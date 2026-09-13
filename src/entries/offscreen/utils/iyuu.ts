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
import { iyuuSiteToLocal } from "@ptd/iyuu";
import type { IYUUReseedHit } from "@ptd/iyuu";

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
