/**
 * crossSeed：统一辅种命中源抽象（IYUU 中心 / NexusPHP pieces-hash 直查 / 本地文件树对比）
 *
 * 候选模型（ICrossSeedCandidate）为三类命中源的统一输出；
 * UI 只消费候选数组，注入链路（站点适配器 B 路线 / 模板 A 兜底）见 resolver.ts。
 */
import type { TSiteID } from "@ptd/site";
import type { AxiosRequestConfig } from "axios";

/** 辅种命中来源类型 */
export type TCrossSeedSourceKind = "iyuu" | "nexusphp" | "local";

/**
 * 统一辅种候选：一条「本地种子 → 某站可辅种种子」的解析结果（供 UI 勾选/注入）。
 * 是 @ptd/iyuu 旧 IYUUReseedCandidate 的跨源泛化（新增 source 字段标识命中来源）。
 */
export interface ICrossSeedCandidate {
  /** 来源本地种子 infohash */
  sourceInfoHash: string;
  /** 来源本地种子标题（同资源，仅展示用） */
  sourceName?: string;
  /** 来源本地种子保存目录（注入时 savePath 复用） */
  sourceSavePath?: string;
  /** 来源本地种子大小 */
  sourceSize?: number;

  /** 解析到的本地站点 id（未映射时为空串） */
  siteId: TSiteID;
  /** 站点显示名（IYUU 昵称/本地站名/接口站名回退） */
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

  /** 命中来源：iyuu（中心索引）/ nexusphp（站直查）/ local（本地文件树比对） */
  source: TCrossSeedSourceKind;
}

/** 被扫描的本地种子（聚合扫描的输入下一级） */
export interface ICrossSeedLocalSeed {
  infoHash: string;
  name: string;
  savePath: string;
  size: number;
  /** 本地文件清单（local 源比对用；来自下载器 getTorrentFiles） */
  files?: ICrossSeedFileRef[];
  /** 本地种子 pieces_hash（nexus 源直查用，sha1(info.pieces)） */
  piecesHash?: string;
}

/** 文件引用（local 源布局比对的最小单位） */
export interface ICrossSeedFileRef {
  path: string;
  size: number;
}

/**
 * 通用模板站点信息（download_page 模板 A 路线兜底所需）。
 * 与 IYUU 站点表结构同构，跨源复用（NexusPHP/local 源未映射场景也可用）。
 */
export interface ICrossSeedTemplateSite {
  site: string;
  download_page: string;
  base_url: string;
  is_https: 0 | 1 | 2;
}

/**
 * download_page 模板可出现的**静态可配置**凭据变量（A 路线兜底）。
 * 注意：{sign}（hdsky）、{cuhash}（hdcity）等需要详情页动态提取的变量不在模板侧实现，
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
  /** {torrent_pass}：Gazelle 系 torrent_pass */
  torrentPass?: string;
  /** {torrent_key}：zhuque 用户 torrent_key */
  torrentKey?: string;
  /** {rsskey}：hdpost/monikadesign 用户 rsskey */
  rsskey?: string;
}

/** NexusPHP pieces-hash 站点直查配置（设置页录入，存 metadata.iyuu.nexusSites） */
export interface INexusSiteConfig {
  /** 本地站点 id（B 路线下载解析与候选 siteId 使用） */
  siteId: TSiteID;
  /** 完整接口地址，如 https://site/api/pieces-hash */
  apiUrl: string;
  /** 用户 passkey（query 参数认证） */
  passkey: string;
  enabled?: boolean;
}

/** 下载请求配置的窄接口（便于依赖注入与单元测试，对应站点适配器方法） */
export interface ICrossSeedResolveSiteInstance {
  getTorrentDownloadRequestConfig(torrent: ITorrentLike): Promise<AxiosRequestConfig>;
}

/** resolver 依赖的最小种子对象（仅 site/id 必填） */
export interface ITorrentLike {
  site: TSiteID;
  id: number | string;
  title: string;
  link?: string;
  url?: string;
}
