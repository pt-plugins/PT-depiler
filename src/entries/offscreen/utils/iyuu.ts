/**
 * IYUU 辅种中心 offscreen 处理
 * @see https://doc.iyuu.cn/reference/site_list
 * @see https://doc.iyuu.cn/reference/reseed_index
 * @see https://doc.iyuu.cn/reference/site_report_existing
 */
import axios from "axios";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IIyuuStorageSchema, IIyuuSiteCacheEntry, IMetadataPiniaStorageSchema } from "@/shared/types.ts";
import type { TSiteID } from "@ptd/site";
import { iyuuSiteToLocal, resolveTorrentDownload } from "@ptd/iyuu";
import type { IYUUReseedCandidate, IYUUReseedHit } from "@ptd/iyuu";

import { getDownloaderInstance } from "./download.ts";
import { getSiteInstance } from "./site.ts";

/** IYUU 配置并入 metadata storage 的 iyuu 子对象 */
const METADATA_KEY = "metadata" as const;
const IYUU_KEY = "iyuu" as const;
const API_BASE = "https://2025.iyuu.cn";
const VERSION = "1.0.0";

/** sid_sha1 有效期：7 天 */
const SID_SHA1_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** 站点表缓存 TTL：24 小时 */
const SITES_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function getMetadata(): Promise<IMetadataPiniaStorageSchema | undefined> {
  return (await sendMessage("getExtStorage", METADATA_KEY)) as IMetadataPiniaStorageSchema | undefined;
}

async function getConfig(): Promise<IIyuuStorageSchema> {
  return (await getMetadata())?.[IYUU_KEY] ?? {};
}

/** 合并写：读最新 metadata → 补丁 iyuu 子对象 → 整体写回（避免覆盖其他字段） */
async function saveConfig(patch: Partial<IIyuuStorageSchema>): Promise<void> {
  const metadata = (await getMetadata()) ?? ({} as IMetadataPiniaStorageSchema);
  await sendMessage("setExtStorage", {
    key: METADATA_KEY,
    value: { ...metadata, [IYUU_KEY]: { ...(metadata[IYUU_KEY] ?? {}), ...patch } },
  });
}

/** 拼接 token 请求头；未配置 token 时抛错 */
function tokenHeaders(token: string): Record<string, string> {
  return { Token: token };
}

onMessage("getIyuusConfig", async () => {
  return await getConfig();
});

onMessage("setIyuusConfig", async ({ data }) => {
  await saveConfig(data);
});

// ── 站点表 ──────────────────────────────────────────────

async function fetchSitesRemote(token: string): Promise<IIyuuSiteCacheEntry[]> {
  const { data } = await axios.get<{
    code: number;
    data?: { sites?: IIyuuSiteCacheEntry[] };
    msg?: string;
  }>(`${API_BASE}/reseed/sites/index`, { headers: tokenHeaders(token), timeout: 30e3 });
  if (data.code !== 0 || !data.data?.sites) {
    throw new Error(data.msg || "IYUU 站点列表获取失败");
  }
  return data.data.sites;
}

/** 拉取站点表（带缓存 TTL 24h；token 未配置抛错提示） */
export async function iyuuFetchSites(): Promise<IIyuuSiteCacheEntry[]> {
  const config = await getConfig();
  if (!config.token) {
    throw new Error("请先在设置页配置 IYUU token");
  }
  if (config.sitesCache && Date.now() - config.sitesCache.fetchedAt < SITES_CACHE_TTL_MS) {
    return config.sitesCache.sites;
  }
  const sites = await fetchSitesRemote(config.token);
  await saveConfig({ sitesCache: { fetchedAt: Date.now(), sites } });
  return sites;
}

onMessage("iyuuFetchSites", iyuuFetchSites);

// ── 汇报持有站点 → sid_sha1 ─────────────────────────────

/** 汇报持有站点（sid 列表），返回 sid_sha1 并缓存（7 天） */
export async function iyuuReportExisting(sidList: number[]): Promise<string> {
  const config = await getConfig();
  if (!config.token) {
    throw new Error("请先在设置页配置 IYUU token");
  }
  const { data } = await axios.post<{ code: number; data?: { sid_sha1?: string }; msg?: string }>(
    `${API_BASE}/reseed/sites/reportExisting`,
    { sid_list: sidList },
    { headers: tokenHeaders(config.token), timeout: 30e3 },
  );
  if (data.code !== 0 || !data.data?.sid_sha1) {
    throw new Error(data.msg || "IYUU 站点汇报失败");
  }
  await saveConfig({ sidSha1: data.data.sid_sha1, sidSha1ExpiresAt: Date.now() + SID_SHA1_TTL_MS });
  return data.data.sid_sha1;
}

onMessage("iyuuReportExisting", async ({ data: sidList }) => {
  return await iyuuReportExisting(sidList);
});

// ── 查询辅种 ────────────────────────────────────────────

/**
 * 查询辅种：给定本地 infohash 列表，返回各站命中 {sid, torrent_id, info_hash}。
 * sid_sha1 缺失/过期时，用已保存的 heldSites 自动重新汇报。
 */
export async function iyuuQueryReseed(hashes: string[]): Promise<Record<string, { torrent: IYUUReseedHit[] }>> {
  const config = await getConfig();
  if (!config.token) {
    throw new Error("请先在设置页配置 IYUU token");
  }
  let sidSha1 = config.sidSha1;
  if (!sidSha1 || !config.sidSha1ExpiresAt || Date.now() > config.sidSha1ExpiresAt) {
    const sidList = await deriveHeldSids(config);
    sidSha1 = await iyuuReportExisting(sidList);
  }

  const body = new URLSearchParams({
    hash: JSON.stringify(hashes),
    sid_sha1: sidSha1,
    timestamp: String(Math.floor(Date.now() / 1000)),
    version: VERSION,
  });
  const { data } = await axios.post<{
    code: number;
    data?: Record<string, { torrent?: IYUUReseedHit[] }>;
    msg?: string;
  }>(`${API_BASE}/reseed/index/index`, body, {
    headers: { ...tokenHeaders(config.token), "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 60e3,
  });
  if (data.code !== 0) {
    throw new Error(data.msg || "IYUU 辅种查询失败");
  }
  const result: Record<string, { torrent: IYUUReseedHit[] }> = {};
  for (const [hash, item] of Object.entries(data.data ?? {})) {
    result[hash] = { torrent: item?.torrent ?? [] };
  }
  return result;
}

onMessage("iyuuQueryReseed", async ({ data: hashes }) => {
  return await iyuuQueryReseed(hashes);
});

// ── 持有站点自动推导 ────────────────────────────────────

/** 由本地已配置站点（metadata.sites keys）推导 IYUU 持有站点 */
export async function iyuuDeriveHeldSites(): Promise<{
  localIds: TSiteID[];
  sidList: number[];
  unmatched: TSiteID[];
}> {
  const metadata = (await sendMessage("getExtStorage", "metadata")) as { sites?: Record<string, unknown> } | undefined;
  const localIds = Object.keys(metadata?.sites ?? {});

  const sites = await iyuuFetchSites();
  const localToSid = new Map<TSiteID, number>();
  for (const site of sites) {
    const local = iyuuSiteToLocal(site.site);
    if (local) {
      localToSid.set(local, site.id);
    }
  }

  const held = localIds.filter((id) => localToSid.has(id));
  return {
    localIds: held,
    sidList: held.map((id) => localToSid.get(id)!),
    unmatched: localIds.filter((id) => !localToSid.has(id)),
  };
}

onMessage("iyuuDeriveHeldSites", iyuuDeriveHeldSites);

/** 由配置中的 heldSites（本地 id）推导 sid 列表（无则从 metadata 推导） */
async function deriveHeldSids(config: IIyuuStorageSchema): Promise<number[]> {
  if (config.heldSites?.length) {
    const sites = await iyuuFetchSites();
    const localToSid = new Map<string, number>();
    for (const site of sites) {
      const local = iyuuSiteToLocal(site.site);
      if (local) {
        localToSid.set(local, site.id);
      }
    }
    return config.heldSites.map((id) => localToSid.get(id)).filter((sid): sid is number => sid !== undefined);
  }
  const derived = await iyuuDeriveHeldSites();
  return derived.sidList;
}

// ── 辅种候选解析与批量扫描（P1） ─────────────────────────

export type IYUUResolveSourceInfo = { name: string; savePath: string; size: number };

/**
 * 来源信息统一规范化：offscreen 内部直接传 Map；经消息传输时 Map 会因 JSON 序列化退化为
 * 普通对象（导致 .get is not a function），消息端传 Record，这里统一转回 Map。
 */
function toSourceMap(
  sources: Map<string, IYUUResolveSourceInfo> | Record<string, IYUUResolveSourceInfo> | undefined,
): Map<string, IYUUResolveSourceInfo> {
  if (!sources) return new Map();
  return sources instanceof Map ? sources : new Map(Object.entries(sources));
}

/** 批量查询命中 → 解析为辅种候选（B 路线优先，A 兜底；不可注入项标 error） */
export async function iyuuResolveHits(
  hits: Array<{ sid: number; torrent_id: number; info_hash?: string }>,
  sources?: Map<string, IYUUResolveSourceInfo> | Record<string, IYUUResolveSourceInfo>,
): Promise<IYUUReseedCandidate[]> {
  if (!hits.length) return [];
  const sourceMap = toSourceMap(sources);
  const sites = await iyuuFetchSites();
  const siteById = new Map(sites.map((s) => [s.id, s]));
  const candidates: IYUUReseedCandidate[] = [];

  for (const hit of hits) {
    const iyuuSite = siteById.get(hit.sid);
    if (!iyuuSite) continue;

    const source = hit.info_hash ? sourceMap.get(hit.info_hash) : undefined;
    const base = {
      sourceInfoHash: hit.info_hash ?? "",
      sourceName: source?.name,
      sourceSavePath: source?.savePath,
      sourceSize: source?.size,
      torrentId: hit.torrent_id,
    };

    const localSiteId = iyuuSiteToLocal(iyuuSite.site);
    const siteName = iyuuSite.nickname || localSiteId || iyuuSite.site;

    // 未映射到本地站点的命中无法注入（downloadTorrent 依赖站点适配器），直接标 error
    if (!localSiteId) {
      candidates.push({
        ...base,
        siteId: "",
        siteName,
        status: "error",
        error: `IYUU 站点 ${iyuuSite.site} 未映射到本地站点（模板侧 ${iyuuSite.download_page} 不注入）`,
      });
      continue;
    }

    try {
      const siteInstance = await getSiteInstance<"public">(localSiteId);
      const result = await resolveTorrentDownload({
        siteInstance,
        hit: { sid: hit.sid, torrent_id: hit.torrent_id, info_hash: hit.info_hash ?? "" },
        iyuuSite,
      });

      // B 路线成功：config.baseURL + url 拼全下载链接
      if (result.method === "B" && result.config?.url) {
        candidates.push({
          ...base,
          siteId: localSiteId,
          siteName,
          downloadUrl: axios.getUri(result.config),
          method: "B",
          status: "ready",
        });
        continue;
      }

      // B 失败走 A 兜底：模板渲染出完整链接且无缺失/动态变量 → 可注入
      if (result.url && result.missing?.length === 0 && result.unsupported?.length === 0) {
        candidates.push({
          ...base,
          siteId: localSiteId,
          siteName,
          downloadUrl: result.url,
          method: "A",
          status: "ready",
          error: result.error, // 保留 B 尝试失败原因作备注
        });
        continue;
      }

      candidates.push({
        ...base,
        siteId: localSiteId,
        siteName,
        method: result.method,
        status: "error",
        error:
          result.error ??
          ([...(result.missing ?? []), ...(result.unsupported ?? [])].join(", ") ||
            "下载链接解析失败（详情页需重新获取或模板变量缺失）"),
      });
    } catch (e) {
      candidates.push({
        ...base,
        siteId: localSiteId,
        siteName,
        status: "error",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return candidates;
}

/**
 * 批量辅种扫描：取下载器内已完成种子 → hash 分批（100/批）查 IYUU → 解析候选。
 * 仅返回 ready 候选（调用方可直接注入），error 项同样携带以便 UI 展示失败原因。
 */
export async function iyuuScanForReseed(downloaderId: string): Promise<IYUUReseedCandidate[]> {
  const instance = await getDownloaderInstance(downloaderId);
  if (!instance) {
    return [
      { sourceInfoHash: "", siteId: "", siteName: "", torrentId: 0, status: "error", error: "下载器不存在或未配置" },
    ];
  }

  const torrents = await instance.getAllTorrents();
  const completed = torrents.filter((t) => t.isCompleted && t.infoHash);
  if (!completed.length) {
    return [
      {
        sourceInfoHash: "",
        siteId: "",
        siteName: "",
        torrentId: 0,
        status: "error",
        error: "该下载器没有已完成的种子",
      },
    ];
  }

  const sources = new Map(
    completed.map((t) => [t.infoHash, { name: t.name, savePath: t.savePath, size: t.totalSize }]),
  );

  const hits: Array<{ sid: number; torrent_id: number; info_hash: string }> = [];
  const BATCH = 100;
  for (let i = 0; i < completed.length; i += BATCH) {
    const batch = completed.slice(i, i + BATCH);
    const resp = await iyuuQueryReseed(batch.map((t) => t.infoHash));
    for (const [hash, item] of Object.entries(resp)) {
      for (const t of item.torrent ?? []) {
        hits.push({ sid: t.sid, torrent_id: t.torrent_id, info_hash: hash });
      }
    }
  }

  return await iyuuResolveHits(hits, sources);
}

onMessage("iyuuResolveHits", async ({ data: { hits, sources } }) => {
  return await iyuuResolveHits(hits, sources);
});

onMessage("iyuuScanForReseed", async ({ data: downloaderId }) => {
  return await iyuuScanForReseed(downloaderId);
});
