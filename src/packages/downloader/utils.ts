import { Buffer } from "buffer";
import axios, { isAxiosError, AxiosRequestConfig } from "axios";
import parseTorrent, { Instance as TorrentInstance } from "parse-torrent";
import isValidFilename from "valid-filename";
import { decode } from "urlencode";

export * from "./utils/adapter";

export interface ParsedTorrent {
  name: string;
  metadata: {
    arraybuffer: ArrayBuffer;
    buffer: Buffer;
    blob: () => Blob;
    base64: () => string;
  };
  info: TorrentInstance;
}

const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

const magnetUriV1Pattern = /xt(?:\.1)?=urn:btih:(?<hash>[a-z0-9]{32}(?:[a-z0-9]{8})?)/i;
const magnetUriV2Pattern = /xt(?:\.1)?=urn:btmh:1220(?<hash>[a-z0-9]{64})/i;

/**
 * 判断下载器返回的异常是否为「凭据被服务端拒绝」。
 *
 * 多数客户端对账号/密码错误使用 401（Basic 认证）或 403，因此默认同时接受两者；
 * 对 403 语义存在歧义的客户端（如 qBittorrent 的 CSRF 保护也会返回 403），
 * 可通过 statusCodes 参数排除，避免误报。
 */
export function isAuthenticationError(error: unknown, statusCodes: number[] = [401, 403]): boolean {
  return isAxiosError(error) && statusCodes.includes(error.response?.status ?? 0);
}

/**
 * 「快速失败」的判定阈值（ms）。
 *
 * 自签名证书会被浏览器在本地立即拒绝（通常 100~300ms 内就返回错误），
 * 而「服务未启动 / 网络不可达」等一般要等到超时，耗时明显更长，
 * 因此可以用「失败是否足够快」来推测是否为证书问题。
 */
export const FAST_FAILURE_THRESHOLD = 5e3;

/**
 * 判断连接失败是否「疑似由自签名证书导致」。
 *
 * 注意：浏览器不会向页面暴露证书错误的具体原因，这里只能按耗时推测，
 * 因此结果仅用于生成「请确认是否自签名证书」这类疑问式提示，不能作为确定结论
 * （端口不通、服务未启动、域名解析失败等同样会快速失败）。
 *
 * @param options.address 下载器地址（仅 https 才可能涉及证书）
 * @param options.elapsed 本次请求失败时的耗时（ms）
 * @param options.timeout 该下载器配置的超时时间（ms），用于排除「配置的超时本身小于阈值」的情况
 */
export function isSuspectedSelfSignedCertificate(options: {
  address?: string;
  elapsed: number;
  timeout?: number;
}): boolean {
  const { address = "", elapsed, timeout } = options;

  if (!/^https:\/\//i.test(address)) return false;
  if (!Number.isFinite(elapsed) || elapsed >= FAST_FAILURE_THRESHOLD) return false;
  // 用户把超时设置得比阈值还短时，这种「快速失败」实际上是超时，不应提示证书问题
  if (typeof timeout === "number" && timeout > 0 && elapsed >= timeout) return false;

  return true;
}

export function extractMagnetHash(magnetUri: string): string | null {
  // 先尝试使用 v1 模式匹配
  const v1Match = magnetUri.match(magnetUriV1Pattern);
  if (v1Match) {
    return v1Match.groups?.hash || null;
  }
  // 若 v1 匹配失败，再尝试使用 v2 模式匹配
  const v2Match = magnetUri.match(magnetUriV2Pattern);
  return v2Match?.groups?.hash || null;
}

export async function getRemoteTorrentFile(options: AxiosRequestConfig = {}): Promise<ParsedTorrent> {
  const req = await axios.request({
    ...options,
    responseType: "arraybuffer", // 统一以 ArrayBuffer 形式获取，方便后面转化
  });

  /**
   * 如果服务器设置了 content-type 响应头，
   * 但响应头值不是 application/x-bittorrent 或 application/octet-stream，
   * 则我们认为非正常的种子：
   */
  if (req.headers["content-type"] && !/octet-stream|x-bittorrent/gi.test(<string>req.headers["content-type"])) {
    throw new Error("Invalid Torrent From Server");
  }

  // 将获取到的 ArrayBuffer 转成 Buffer
  const metaDataBuffer = Buffer.from(req.data, "binary");
  const parsedInfo = (await parseTorrent(metaDataBuffer)) as TorrentInstance;

  /**
   * 设置种子名字
   * 如果服务器显式设置 content-disposition 头，则我们尊重服务器设置
   * 不然，文件名会被设置为解析后的种子名，缺省为 `1.torrent`
   */
  let torrentName = parsedInfo.name || "1.torrent";

  const disposition: string | null = req.headers["content-disposition"];
  if (disposition && disposition.includes("filename")) {
    let dispositionName = "";
    if (utf8FilenameRegex.test(disposition)) {
      dispositionName = decode(utf8FilenameRegex.exec(disposition)![1]);
    } else {
      // prevent ReDos attacks by anchoring the ascii regex to string start and
      // slicing off everything before 'filename='
      const filenameStart = disposition.toLowerCase().indexOf("filename=");
      if (filenameStart >= 0) {
        const partialDisposition = disposition.slice(filenameStart);
        const matches = asciiFilenameRegex.exec(partialDisposition);
        if (matches != null && matches[2]) {
          dispositionName = decode(matches[2], "ascii"); // 按照规范使用 ascii 转换
        }
      }
    }

    /**
     * hdsky 返回 filename="xxxxxxx.torrent" ; charset=utf-8 需要额外处理，同时此处包含了 trim
     * 注意，由于上面对该情况使用 ascii 转换，这样仍然会导致文件名出现异常
     */
    dispositionName = dispositionName.replace(/^[ "']+/, "").replace(/[ "']+$/, "");
    // 检查 dispositionName 是否合法
    if (isValidFilename(dispositionName)) torrentName = dispositionName;
  }

  if (!/\.torrent$/i.test(torrentName)) {
    torrentName = `${torrentName}.torrent`;
  }

  return {
    name: torrentName,
    metadata: {
      arraybuffer: req.data,
      buffer: metaDataBuffer,
      base64: () => metaDataBuffer.toString("base64"),
      blob: () => new Blob([req.data], { type: "application/x-bittorrent" }),
    },
    info: parsedInfo,
  } as ParsedTorrent;
}
