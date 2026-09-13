/**
 * IYUU 辅种中心相关类型定义
 * @see https://doc.iyuu.cn/reference/site_list
 * @see https://doc.iyuu.cn/reference/reseed_index
 */
import type { TSiteID } from "@ptd/site";

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

/**
 * download_page 模板可出现的**静态可配置**凭据变量。
 * 注意：{sign}（hdsky）、{cuhash}（hdcity）等需要详情页动态提取的变量不在此列（模板侧不实现），
 * 此类站点由本地站点适配器（B 路线）覆盖；模板兜底遇到即标记 unsupported。
 * @see docs/iyuu-integration-plan.md §4
 */
export interface IYUUDownloadCredentials {
  /** {passkey}：站点用户 passkey（多数 NexusPHP 站） */
  passkey?: string;
  /** {uid}：站点用户 uid（pthome/hdhome/hddolby 等） */
  uid?: string | number;
  /** {hash}/{downhash}/{downHash}：用户下载鉴权 hash */
  downHash?: string;
  /** {authkey}：Gazelle 系 authkey（dicmusic/greatposterwall） */
  authkey?: string;
  /** {torrent_pass}：Gazelle 系 torrent_pass（≈ passkey） */
  torrentPass?: string;
  /** {torrent_key}：zhuque 用户 torrent_key */
  torrentKey?: string;
  /** {rsskey}：hdpost/monikadesign 用户 rsskey */
  rsskey?: string;
}

/**
 * 辅种候选：一条「本地种子 → 某站可辅种种子」的解析结果（供 UI 勾选/注入）
 */
export interface IYUUReseedCandidate {
  /** 来源本地种子 infohash */
  sourceInfoHash: string;
  /** 来源本地种子标题（同资源，仅展示用） */
  sourceName?: string;
  /** 来源本地种子保存目录（注入时 savePath 复用） */
  sourceSavePath?: string;
  /** 来源本地种子大小 */
  sourceSize?: number;

  /** 解析到的本地站点 id */
  siteId: TSiteID;
  /** 站点显示名（IYUU 昵称回退本地名） */
  siteName: string;
  /** 该站在此处的种子 id */
  torrentId: number;

  /** 解析出的完整下载链接（B 路线适配器输出/A 路线模板渲染） */
  downloadUrl?: string;
  /** 采用的解析路线 */
  method?: "B" | "A";

  /** ready=可注入；error=解析失败（原因见 error） */
  status: "ready" | "error";
  error?: string;
}
