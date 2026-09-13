/**
 * IYUU 辅种中心相关类型定义
 * @see https://doc.iyuu.cn/reference/site_list
 * @see https://doc.iyuu.cn/reference/reseed_index
 *
 * 注意：统一辅种候选模型（ICrossSeedCandidate）与模板凭据（IYUUDownloadCredentials）
 * 已迁移至 @ptd/crossSeed；本文件仅保留 IYUU 中心特有类型。
 */
export type { ICrossSeedCandidate, IYUUDownloadCredentials, TCrossSeedSourceKind } from "@ptd/crossSeed";
export type { IYUUDownloadCredentials as IYUUReseedDownloadCredentials } from "@ptd/crossSeed";

/**
 * IYUU 站点表条目（GET /reseed/sites/index 的响应元素精简）
 */
export interface IYUUSite {
  /** IYUU 站点数字 id（sid） */
  id: number;
  /** IYUU 站名（如 m-team / hdsky） */
  site: string;
  /** 站点昵称（如 馒头 / 天空） */
  nickname: string;
  /** 域名（如 api.m-team.cc） */
  base_url: string;
  /** 下载链接模板：{} 或 {id} = torrent_id；其余如 {passkey}/{uid}/{hash} 为凭据变量 */
  download_page: string;
  /** 详情页模板（亦含变量） */
  details_page: string;
  /** 0=http、1=https、2=http(s) 皆可 */
  is_https: 0 | 1 | 2;
  /** 1=下载种子需要带 cookie */
  cookie_required: 0 | 1;
}

/**
 * 查询辅种命中项（POST /reseed/index/index 响应 data[<本地hash>].torrent[] 元素）
 */
export interface IYUUReseedHit {
  /** IYUU 站点 id */
  sid: number;
  /** 该站在此处的种子 id（用于填充 download_page 模板的 {}） */
  torrent_id: number;
  /**
   * 该站签发的种子 infohash。
   * 注意：与本地种子不同（private=1 + announce 进 info dict，私有站跨站 infohash 必不同），仅用于去重/展示。
   */
  info_hash: string;
}

/**
 * 查询辅种响应：data[<本地种子 infohash>] = 该 hash 可辅种的各站列表
 */
export interface IYUUReseedResponse {
  [localInfoHash: string]: {
    torrent: IYUUReseedHit[];
  };
}
