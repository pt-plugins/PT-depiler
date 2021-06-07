import {
  BittorrentClientBaseConfig,
  CAddTorrentOptions,
  CTorrent,
  CTorrentFilterRules
} from './types';

import { Buffer } from 'buffer';
import axios, { AxiosRequestConfig } from 'axios';
import contentDisposition from 'content-disposition';
import parseTorrent, { Instance as TorrentInstance } from 'parse-torrent';

export interface ParsedTorrent {
  name: string,
  metadata: {
    arraybuffer: ArrayBuffer,
    blob: Blob,
    buffer: Buffer,
    base64: string
  },
  info: TorrentInstance
}

/**
 * 客户端具体要实现的抽象方法
 */
export default abstract class AbstractBittorrentClient<T extends BittorrentClientBaseConfig = BittorrentClientBaseConfig> {
  abstract version: `v${number}.${number}.${number}`;
  readonly config: T;

  protected constructor (options: T) {
    this.config = options as T;
  }

  // 检查客户端是否可以连接
  public abstract ping (): Promise<boolean>;

  async getRemoteTorrentFile (options: AxiosRequestConfig = {}): Promise<ParsedTorrent> {
    const req = await axios.request({
      ...options,
      responseType: 'arraybuffer' // 统一以 ArrayBuffer 形式获取
    });

    if (
      /**
       * 服务器设置了 content-type 响应头，
       * 但响应头值不是 application/x-bittorrent 或 application/octet-stream，
       * 则我们认为非正常的种子：
       */
      (req.headers['content-type'] && !/octet-stream|x-bittorrent/gi.test(req.headers['content-type']))
    ) {
      throw new Error('Invalid Torrent From Server');
    }

    // 将获取到的 ArrayBuffer 转成 Buffer
    const metaDataBuffer = Buffer.from(req.data, 'binary');
    const parsedInfo = parseTorrent(metaDataBuffer) as TorrentInstance;

    /**
     * 设置种子名字
     * 如果服务器显式设置 content-disposition 头，则我们尊重服务器设置
     * 不然，文件名会被设置为解析后的种子名
     */
    let torrentName = parsedInfo.name || '1.torrent';
    if (req.headers['content-disposition']) {
      const parsedContentDisposition = contentDisposition.parse(req.headers['content-disposition']);
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
        base64: metaDataBuffer.toString('base64'),
        blob: new Blob([req.data], { type: 'application/x-bittorrent' })
      },
      info: parsedInfo
    };
  }

  /**
   * 获取种子信息的方法
   *
   * 注意 abstract class 中内置了一种本地筛选种子的获取方法，
   * 即从bt软件中获取所有种子，然后本地筛选，即 getAllTorrents -> getTorrentsBy -> getTorrent
   * 此时只需要完成 getAllTorrents 方法的逻辑即可
   *
   * 如果该客户端支持在获取种子的时候进行筛选，
   * 则建议将筛选给bt软件，即 getTorrentsBy -> getAllTorrents/getTorrent
   * 此时，则同时需要完成 3个方法（部分情况下为其中1个或2个）的 override
   *
   */
  public abstract getAllTorrents(): Promise<CTorrent[]>

  public async getTorrentsBy (filter: CTorrentFilterRules): Promise<CTorrent[]> {
    let torrents = await this.getAllTorrents();
    if (filter.ids) {
      const filterIds = Array.isArray(filter.ids) ? filter.ids : [filter.ids];
      torrents = torrents.filter(t => {
        return filterIds.includes(t.infoHash);
      });
    }

    if (filter.complete) {
      torrents = torrents.filter(t => t.isCompleted);
    }

    return torrents;
  }

  public async getTorrent (id: string): Promise<CTorrent> {
    return (await this.getTorrentsBy({ ids: id }))[0];
  }

  // 添加种子
  public abstract addTorrent (url: string, options: Partial<CAddTorrentOptions>) : Promise<boolean>;

  // 暂停种子
  public abstract pauseTorrent (id: any) : Promise<boolean>;

  // 恢复种子
  public abstract resumeTorrent (id: any) : Promise<boolean>;

  // 删除种子
  public abstract removeTorrent (id: any, removeData?: boolean) : Promise<boolean>;
}
