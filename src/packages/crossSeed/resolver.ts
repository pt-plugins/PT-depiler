/**
 * 双路线下载解析（跨源通用）：把「命中记录（{torrent_id}）+ 模板站点」解析为最终种子下载请求。
 *
 * - 路线 B（推荐）：构造 stub ITorrent → 本地站点适配器 getTorrentDownloadRequestConfig()
 *   （复用站点 cookie/UA/协议/sign 等全部既有逻辑）
 * - 路线 A（兜底）：download_page 模板 + 凭据渲染（无本地适配器/适配器失败时）
 *
 * 与本地站点的映射由调用方注入（localSiteId），本包不感知 IYUU/站名的映射细节。
 */
import type { AxiosRequestConfig } from "axios";
import type { TSiteID } from "@ptd/site";

import { siteTemplateProtocol, renderDownloadPage } from "./template";
import type {
  ICrossSeedResolveSiteInstance,
  ICrossSeedTemplateSite,
  ITorrentLike,
  IYUUDownloadCredentials,
} from "./types";

/** 解析结果 */
export interface ICrossSeedResolveResult {
  /** 解析到的本地站点 id（B 路线使用） */
  siteId?: TSiteID;
  /** 采用的路线；A 且 missing/unsupported 非空表示应跳过该站 */
  method: "B" | "A";
  /** 最终下载请求配置（B 为适配器输出；A 为渲染 URL 构造的 GET） */
  config?: AxiosRequestConfig;
  /** A 路线渲染的原始下载链接 */
  url?: string;
  /** A 路线缺失的静态凭据变量（应跳过该站） */
  missing?: string[];
  /** A 路线不可用的动态变量（sign/cuhash，模板侧不实现；应跳过该站走本地适配器） */
  unsupported?: string[];
  /** 失败原因（B 尝试失败但未走 A 时） */
  error?: string;
}

export interface ICrossSeedResolveOptions {
  /** 本地站点适配器实例（可注入 mock） */
  siteInstance?: ICrossSeedResolveSiteInstance;
  /** 命中项（torrent_id 必填） */
  hit: { torrent_id: number; info_hash?: string };
  /** 模板站点条目（A 路线兜底用；含 download_page 模板） */
  templateSite?: ICrossSeedTemplateSite;
  /** 本地站点映射（B 路线需要；由调用方按站点规则解析） */
  localSiteId?: TSiteID;
  /** A 路线凭据 */
  creds?: IYUUDownloadCredentials;
}

/** 默认 stub 构造：仅 site/id 必填，link/url 留空由适配器自行补全（如 hdsky 由 id 拼详情页） */
export function buildStubTorrent(siteId: TSiteID, hit: { torrent_id: number }): ITorrentLike {
  return {
    site: siteId,
    id: hit.torrent_id,
    title: "",
    // link 空串促使适配器进入"重新获取"分支；url 由适配器或后续路由按需补全
    link: "",
  };
}

/**
 * 双路线解析：B 优先（本地适配器），B 失败/未映射 → A（模板渲染），凭据缺失则返回 missing。
 */
export async function resolveCrossSeedTorrent(options: ICrossSeedResolveOptions): Promise<ICrossSeedResolveResult> {
  const { hit, templateSite, localSiteId } = options;

  // 先尝试路线 B：本地适配器
  if (options.siteInstance && localSiteId) {
    try {
      const config = await options.siteInstance.getTorrentDownloadRequestConfig(buildStubTorrent(localSiteId, hit));
      return { siteId: localSiteId, method: "B", config };
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      // 路由 B 失败（详情页解析失败/站点要求额外上下文）时记下原因，继续尝试 A
      if (!templateSite) {
        return { siteId: localSiteId, method: "B", error };
      }
      const fallback = await renderTemplateFallback(templateSite, hit, options.creds);
      return { siteId: localSiteId, ...fallback, error };
    }
  }

  // 路线 A：模板渲染（或提示未适配）
  if (!templateSite) {
    return { method: "A", error: "未映射到本地站点且未提供模板信息" };
  }
  return renderTemplateFallback(templateSite, hit, options.creds);
}

/** 兼容旧导出名（@ptd/iyuu 时代 resolveTorrentDownload） */
export { resolveCrossSeedTorrent as resolveTorrentDownload };

async function renderTemplateFallback(
  templateSite: ICrossSeedTemplateSite,
  hit: { torrent_id: number },
  creds: IYUUDownloadCredentials = {},
): Promise<Pick<ICrossSeedResolveResult, "method" | "config" | "url" | "missing" | "unsupported">> {
  const { url, missing, unsupported } = renderDownloadPage(templateSite.download_page, hit.torrent_id, creds);
  if (unsupported.length > 0) {
    return { method: "A", unsupported, url, missing };
  }
  if (missing.length > 0) {
    return { method: "A", missing, url };
  }
  const fullUrl = `${siteTemplateProtocol(templateSite)}${templateSite.base_url}/${url}`;
  return {
    method: "A",
    url: fullUrl,
    config: { method: "GET", url: fullUrl, responseType: "arraybuffer" },
  };
}
