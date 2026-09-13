/**
 * 双路线解析：把 IYUU 查询命中（{sid, torrent_id}）解析为最终种子下载请求。
 *
 * - 路线 B（推荐）：构造 stub ITorrent → 本地站点适配器 getTorrentDownloadRequestConfig()
 *   （复用站点 cookie/UA/协议/sign 等全部既有逻辑；覆盖 IYUU 104 站，见 siteMapping）
 * - 路线 A（兜底）：IYUU download_page 模板 + 凭据渲染（未来 IYUU 新增站且本地未适配时）
 */
import type { AxiosRequestConfig } from "axios";
import type { ITorrent, TSiteID } from "@ptd/site";
import { iyuuSiteToLocal } from "./siteMapping";
import { iyuuProtocol, renderDownloadPage } from "./template";
import type { IYUUReseedHit, IYUUDownloadCredentials } from "./types";

/** 本地站点适配器窄接口（便于依赖注入与单测） */
export interface IYUUResolveSiteInstance {
  getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig>;
}

/** 解析结果 */
export interface IYUUResolveResult {
  /** 解析到的本地站点 id（未映射时可能为空） */
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

export interface IYUUResolveOptions {
  /** 本地站点适配器实例（可注入 mock） */
  siteInstance?: IYUUResolveSiteInstance;
  /** IYUU 查询命中项 */
  hit: IYUUReseedHit;
  /** IYUU 站点表条目（模板兜底用；B 路线无需） */
  iyuuSite?: { site: string; download_page: string; base_url: string; is_https: 0 | 1 | 2 };
  /** A 路线凭据 */
  creds?: IYUUDownloadCredentials;
}

/** 默认 stub 构造：仅 site/id 必填，link/url 留空由适配器自行补全（如 hdsky 由 id 拼详情页） */
export function buildStubTorrent(siteId: TSiteID, hit: IYUUReseedHit): ITorrent {
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
export async function resolveTorrentDownload(options: IYUUResolveOptions): Promise<IYUUResolveResult> {
  const { hit, iyuuSite } = options;

  // 先尝试路线 B：本地适配器
  if (options.siteInstance) {
    const localSiteId = iyuuSite ? iyuuSiteToLocal(iyuuSite.site) : undefined;
    if (localSiteId) {
      try {
        const config = await options.siteInstance.getTorrentDownloadRequestConfig(buildStubTorrent(localSiteId, hit));
        return { siteId: localSiteId, method: "B", config };
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        // 路由 B 失败（详情页解析失败/站点要求额外上下文）时记下原因，继续尝试 A
        if (!iyuuSite) {
          return { siteId: localSiteId, method: "B", error };
        }
        const fallback = await renderTemplateFallback(iyuuSite, hit, options.creds);
        return { siteId: localSiteId, ...fallback, error };
      }
    }
  }

  // 路线 A：模板渲染（或提示未适配）
  if (!iyuuSite) {
    return { method: "A", error: "该 IYUU 站点未映射到本地站点且未提供模板信息" };
  }
  return renderTemplateFallback(iyuuSite, hit, options.creds);
}

async function renderTemplateFallback(
  iyuuSite: { site: string; download_page: string; base_url: string; is_https: 0 | 1 | 2 },
  hit: IYUUReseedHit,
  creds: IYUUDownloadCredentials = {},
): Promise<Pick<IYUUResolveResult, "method" | "config" | "url" | "missing" | "unsupported">> {
  const { url, missing, unsupported } = renderDownloadPage(iyuuSite.download_page, hit.torrent_id, creds);
  if (unsupported.length > 0) {
    return { method: "A", unsupported, url, missing };
  }
  if (missing.length > 0) {
    return { method: "A", missing, url };
  }
  const fullUrl = `${iyuuProtocol(iyuuSite)}${iyuuSite.base_url}/${url}`;
  return {
    method: "A",
    url: fullUrl,
    config: { method: "GET", url: fullUrl, responseType: "arraybuffer" },
  };
}
