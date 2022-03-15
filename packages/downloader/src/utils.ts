import { Buffer } from "buffer";
import axios, { AxiosRequestConfig } from "axios";
import contentDisposition from "content-disposition";
import parseTorrent, { Instance as TorrentInstance } from "parse-torrent";

export interface ParsedTorrent {
  name: string;
  metadata: {
    arraybuffer: ArrayBuffer;
    blob: Blob;
    buffer: Buffer;
    base64: string;
  };
  info: TorrentInstance;
}

export async function getRemoteTorrentFile(
  options: AxiosRequestConfig = {}
): Promise<ParsedTorrent> {
  const req = await axios.request({
    ...options,
    responseType: "arraybuffer", // 统一以 ArrayBuffer 形式获取，方便后面转化
  });

  if (
    /**
     * 服务器设置了 content-type 响应头，
     * 但响应头值不是 application/x-bittorrent 或 application/octet-stream，
     * 则我们认为非正常的种子：
     */
    req.headers["content-type"] &&
    !/octet-stream|x-bittorrent/gi.test(req.headers["content-type"])
  ) {
    throw new Error("Invalid Torrent From Server");
  }

  // 将获取到的 ArrayBuffer 转成 Buffer
  const metaDataBuffer = Buffer.from(req.data, "binary");
  const parsedInfo = parseTorrent(metaDataBuffer) as TorrentInstance;

  /**
   * 设置种子名字
   * 如果服务器显式设置 content-disposition 头，则我们尊重服务器设置
   * 不然，文件名会被设置为解析后的种子名
   */
  let torrentName = parsedInfo.name || "1.torrent";
  if (req.headers["content-disposition"]) {
    const parsedContentDisposition = contentDisposition.parse(
      req.headers["content-disposition"]
    );
    torrentName = parsedContentDisposition.parameters.filename || torrentName;
  }
  if (!/\.torrent$/i.test(torrentName)) {
    torrentName = `${torrentName}.torrent`;
  }

  return {
    name: torrentName,
    metadata: {
      arraybuffer: req.data,
      buffer: metaDataBuffer,
      base64: metaDataBuffer.toString("base64"),
      blob: new Blob([req.data], { type: "application/x-bittorrent" }),
    },
    info: parsedInfo,
  };
}
