import { Buffer } from "buffer";
import axios, { AxiosRequestConfig } from "axios";
import parseTorrent, { Instance as TorrentInstance } from "parse-torrent";

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

const magnetURIComponent =
  /(?:^magnet:\?|[^?&]&)xt(?:\.1)?=urn:(?:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):(?<hash>[a-z0-9]{32}(?:[a-z0-9]{8})?)|btmh:1220(?<hash>[a-z0-9]{64}))(?:$|&)/i;

const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

export function extractMagnetHash(magnetURI: string): string | null {
  const match = magnetURIComponent.exec(magnetURI);
  return match?.groups?.hash ?? null;
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
    if (utf8FilenameRegex.test(disposition)) {
      torrentName = decodeURIComponent(utf8FilenameRegex.exec(disposition)![1]);
    } else {
      // prevent ReDos attacks by anchoring the ascii regex to string start and
      // slicing off everything before 'filename='
      const filenameStart = disposition.toLowerCase().indexOf("filename=");
      if (filenameStart >= 0) {
        const partialDisposition = disposition.slice(filenameStart);
        const matches = asciiFilenameRegex.exec(partialDisposition);
        if (matches != null && matches[2]) {
          torrentName = matches[2];
        }
      }
    }
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
