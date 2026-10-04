import { type TSiteHost, type TSiteID } from "@ptd/site";
import type { CTorrent } from "@ptd/downloader";

import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

/**
 * 根据种子内的 tracker 地址识别其所属站点
 *
 * 识别规则：
 * 1. 优先使用下载器返回种子列表时顺带给出的 tracker（CTorrent.trackerUrls），
 *    没有时再按需调用 `getClientTorrentTrackers` 向下载器请求（结果会被缓存）
 * 2. 客户端明确告知为公开种子（isPrivate === false）时不请求 tracker，直接判定为 public
 * 3. 将 tracker 地址的 host（及其各级父域名）在
 *    已添加站点的 urls / legacyUrls / trackerUrls 的 host 中进行匹配：
 *    - 匹配到私有站点 → site
 *    - 匹配到公开站点 → public
 *    - 其余（含无 tracker / 未匹配）→ unmatched
 */

export type TTorrentSiteMatch =
  | { type: "site"; siteId: TSiteID } // 匹配到已添加的私有站点
  | { type: "public" } // 公开种子（客户端明确标记，或其 tracker 属于公开站点）
  | { type: "unmatched" }; // 未匹配到任何已添加站点

/** 种子 tracker 列表缓存（key: `clientId:infoHash`），避免翻页/刷新时重复请求下载器 */
const trackerUrlsCache = new Map<string, string[]>();

/** 站点类型缓存，避免重复加载站点定义 */
const siteTypeCache = new Map<TSiteID, "private" | "public">();

/** 同一个种子的并发请求合并 */
const pendingTrackerRequests = new Map<string, Promise<string[]>>();

/** 同时向下载器发起的 tracker 请求数上限 */
const MAX_CONCURRENT_TRACKER_REQUESTS = 4;
let runningTrackerRequests = 0;
const trackerRequestWaiters: Array<() => void> = [];

async function acquireTrackerRequestSlot(): Promise<void> {
  if (runningTrackerRequests < MAX_CONCURRENT_TRACKER_REQUESTS) {
    runningTrackerRequests++;
    return;
  }
  await new Promise<void>((resolve) => trackerRequestWaiters.push(resolve));
  runningTrackerRequests++;
}

function releaseTrackerRequestSlot(): void {
  runningTrackerRequests--;
  trackerRequestWaiters.shift()?.();
}

function getTorrentCacheKey(torrent: CTorrent): string {
  return `${torrent.clientId}:${torrent.infoHash || torrent.id}`;
}

/** 获取种子的 tracker 地址列表（优先使用下载器已返回的数据，否则按需向下载器请求） */
export async function getTorrentTrackerUrls(torrent: CTorrent): Promise<string[]> {
  if (torrent.trackerUrls?.length) {
    return torrent.trackerUrls;
  }

  // 已知为公开种子，无需（也不应该）再请求 tracker
  if (torrent.isPrivate === false) {
    return [];
  }

  const cacheKey = getTorrentCacheKey(torrent);
  const cached = trackerUrlsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let pending = pendingTrackerRequests.get(cacheKey);
  if (!pending) {
    pending = (async () => {
      await acquireTrackerRequestSlot();
      try {
        return (await sendMessage("getClientTorrentTrackers", { downloaderId: torrent.clientId, torrent })) ?? [];
      } catch {
        return [];
      } finally {
        releaseTrackerRequestSlot();
      }
    })();
    pendingTrackerRequests.set(cacheKey, pending);
  }

  const trackerUrls = await pending;
  pendingTrackerRequests.delete(cacheKey);
  trackerUrlsCache.set(cacheKey, trackerUrls);
  return trackerUrls;
}

/**
 * 生成 host 及其各级父域名（如 tracker.a.com → ["tracker.a.com", "a.com"]），
 * 用于兼容站点使用 tracker 子域名的情况；不包含顶级域名，避免误匹配
 */
export function getHostCandidates(host: TSiteHost): string[] {
  const candidates: string[] = [];
  const [hostname, port] = host.split(":");
  const parts = hostname.split(".");
  for (let i = 0; i <= parts.length - 2; i++) {
    const candidate = parts.slice(i).join(".");
    candidates.push(candidate);
    if (port) {
      candidates.push(`${candidate}:${port}`);
    }
  }
  return candidates;
}

async function getSiteType(siteId: TSiteID): Promise<"private" | "public"> {
  const cached = siteTypeCache.get(siteId);
  if (cached) {
    return cached;
  }

  let siteType: "private" | "public" = "public";
  try {
    siteType = (await useMetadataStore().getSiteMetadata(siteId))?.type ?? "public";
  } catch {
    siteType = "public";
  }
  siteTypeCache.set(siteId, siteType);
  return siteType;
}

/** 获取种子与站点的匹配结果 */
export async function getTorrentSiteMatch(torrent: CTorrent): Promise<TTorrentSiteMatch> {
  // 客户端已明确告知为公开种子
  if (torrent.isPrivate === false) {
    return { type: "public" };
  }

  const trackerUrls = await getTorrentTrackerUrls(torrent);
  if (trackerUrls.length === 0) {
    return { type: "unmatched" };
  }

  const metadataStore = useMetadataStore();

  // 正常情况下 siteHostMap 已由 buildSiteHostMap 生成，此处兜底重建
  if (Object.keys(metadataStore.siteHostMap).length === 0 && metadataStore.getAddedSiteIds.length > 0) {
    await metadataStore.buildSiteMapCache();
  }

  let matchedPublicSite = false;

  for (const trackerUrl of trackerUrls) {
    let host: TSiteHost;
    try {
      host = new URL(trackerUrl).host;
    } catch {
      continue;
    }

    for (const candidate of getHostCandidates(host)) {
      const siteId = metadataStore.siteHostMap[candidate];
      if (!siteId) {
        continue;
      }
      if ((await getSiteType(siteId)) === "private") {
        return { type: "site", siteId };
      }
      matchedPublicSite = true;
    }
  }

  return matchedPublicSite ? { type: "public" } : { type: "unmatched" };
}
