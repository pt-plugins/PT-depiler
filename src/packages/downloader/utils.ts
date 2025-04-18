import { Buffer } from "buffer";
import axios, { AxiosRequestConfig } from "axios";
import parseTorrent, { Instance as TorrentInstance } from "parse-torrent";
import isValidFilename from "valid-filename";
import { decode } from "urlencode";

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
  if (req.headers["content-type"] && !/octet-stream|x-bittorrent/gi.test(req.headers["content-type"])) {
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
