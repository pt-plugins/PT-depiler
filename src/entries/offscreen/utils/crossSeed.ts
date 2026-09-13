/**
 * crossSeed 聚合扫描：IYUU 中心 / NexusPHP pieces-hash 直查 / 本地文件树对比 三源统一入口。
 * 候选统一为 ICrossSeedCandidate（带 source 标识），UI 只消费候选数组，与单源时代完全兼容。
 */
import axios from "axios";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types.ts";
import type { TSiteID } from "@ptd/site";
import {
  mapNexusHits,
  nexusQueryPiecesHash,
  resolveTorrentDownload,
  type ICrossSeedCandidate,
  type ICrossSeedLocalSeed,
  type INexusSiteConfig,
  type TCrossSeedSourceKind,
} from "@ptd/crossSeed";

import { getDownloaderInstance } from "./download.ts";
import { getSiteInstance } from "./site.ts";
import { iyuuQueryReseed, iyuuResolveHits } from "./iyuu.ts";

export interface ICrossSeedScanOptions {
  enableIyuus?: boolean;
  enableNexus?: boolean;
  enableLocal?: boolean;
}

/**
 * 多源聚合扫描：取下载器已完成种子 → 按启用的源并行查询并合并候选。
 * 源级失败隔离：某源异常不影响其余源结果（以 error 候选提示）。
 */
export async function crossSeedScanForReseed(
  downloaderId: string,
  options: ICrossSeedScanOptions = {},
): Promise<ICrossSeedCandidate[]> {
  const { enableIyuus = true, enableNexus = true, enableLocal = false } = options;

  const instance = await getDownloaderInstance(downloaderId);
  if (!instance) {
    return [errorCandidate("下载器不存在或未配置", "iyuu")];
  }
  const torrents = await instance.getAllTorrents();
  const completed = torrents.filter((t) => t.isCompleted && t.infoHash);
  if (!completed.length) {
    return [errorCandidate("该下载器没有已完成的种子", "iyuu")];
  }

  const seeds: ICrossSeedLocalSeed[] = completed.map((t) => ({
    infoHash: t.infoHash,
    name: t.name,
    savePath: t.savePath,
    size: t.totalSize,
  }));

  const results: ICrossSeedCandidate[] = [];

  if (enableIyuus) {
    try {
      results.push(...(await scanIyuuSource(seeds)));
    } catch (e) {
      results.push(errorCandidate(messageOf(e), "iyuu"));
    }
  }

  if (enableNexus) {
    try {
      results.push(...(await scanNexusSource(seeds)));
    } catch (e) {
      results.push(errorCandidate(messageOf(e), "nexusphp"));
    }
  }

  if (enableLocal) {
    try {
      results.push(...(await scanLocalSource(seeds)));
    } catch (e) {
      results.push(errorCandidate(messageOf(e), "local"));
    }
  }

  return results;
}

onMessage("crossSeedScanForReseed", async ({ data: { downloaderId, options } }) => {
  return await crossSeedScanForReseed(downloaderId, options);
});

// ── IYUU 中心源 ─────────────────────────────────────────

async function scanIyuuSource(seeds: ICrossSeedLocalSeed[]): Promise<ICrossSeedCandidate[]> {
  // 与 iyuuScanForReseed 相同：hash 分批（100/批）查中心 → 统一候选解析
  const hashes = seeds.map((s) => s.infoHash);
  const hits: Array<{ sid: number; torrent_id: number; info_hash: string }> = [];
  const BATCH = 100;
  for (let i = 0; i < hashes.length; i += BATCH) {
    const resp = await iyuuQueryReseed(hashes.slice(i, i + BATCH));
    for (const [hash, item] of Object.entries(resp)) {
      for (const h of item.torrent ?? []) {
        hits.push({ sid: h.sid, torrent_id: h.torrent_id, info_hash: hash });
      }
    }
  }
  const sources: Record<string, { name: string; savePath: string; size: number }> = {};
  for (const s of seeds) {
    sources[s.infoHash] = { name: s.name, savePath: s.savePath, size: s.size };
  }
  return await iyuuResolveHits(hits, sources);
}

// ── NexusPHP pieces-hash 直查源 ─────────────────────────

/** 读取设置页录入的已启用 Nexus 站点配置 */
async function enabledNexusConfigs(): Promise<INexusSiteConfig[]> {
  const metadata = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema | undefined;
  const nexusSites = metadata?.iyuu?.nexusSites ?? {};
  return Object.entries(nexusSites)
    .filter(([, c]) => c.enabled && c.apiUrl && c.passkey)
    .map(([siteId, c]) => ({ siteId: siteId as TSiteID, apiUrl: c.apiUrl!, passkey: c.passkey!, enabled: true }));
}

/**
 * Nexus 源：本地种子 pieces_hash（sha1(info.pieces)）→ 对每个已配置的 nexus 站点直查 → 候选。
 * 本地 pieces 由调用方前置计算（gatherPiecesHash / 下载器扩展能力）；聚合层对缺失 pieces 的
 * 种子给出提示候选而非静默跳过。
 */
async function scanNexusSource(seeds: ICrossSeedLocalSeed[]): Promise<ICrossSeedCandidate[]> {
  const configs = await enabledNexusConfigs();
  if (!configs.length) {
    return [errorCandidate("未配置 NexusPHP pieces-hash 站点（设置 → IYUU 辅种中心 → NexusPHP 直查）", "nexusphp")];
  }

  const withPieces = seeds.filter((s) => s.piecesHash);
  if (!withPieces.length) {
    return [
      errorCandidate("NexusPHP 直查需要本地种子 pieces_hash（当前扫描未提供种子文件/下载器导出能力）", "nexusphp"),
    ];
  }

  const results: ICrossSeedCandidate[] = [];
  for (const config of configs) {
    const hits = await nexusQueryPiecesHash(
      config.apiUrl,
      config.passkey,
      withPieces.map((s) => s.piecesHash!),
    );
    for (const hit of mapNexusHits(hits)) {
      const seed = withPieces.find((s) => s.piecesHash === hit.piecesHash);
      if (!seed) continue;
      results.push(...(await buildSourceCandidates(config, seed, hit.torrentId, "nexusphp")));
    }
  }
  return results;
}

// ── Local 文件树对比源 ──────────────────────────────────

/**
 * Local 源：本地文件树 ↔ 目标站候选种子比对。
 * 目标站候选种子的获取（站点搜索/种子下载）依赖站点搜索基建，当前聚合层不产出候选行，
 * 算法原语（matchLocalToSiteTorrent/filesLayoutMatch）已在 @ptd/crossSeed/local 落地，
 * 完整接入见 docs/cross-seed-research.md 与后续迭代。
 */
async function scanLocalSource(_seeds: ICrossSeedLocalSeed[]): Promise<ICrossSeedCandidate[]> {
  return [];
}

// ── 公共工具 ─────────────────────────────────────────────

/** 统一候选构建（B 路线优先、A 兜底），与 IYUU 单源候选构造同型 */
async function buildSourceCandidates(
  site: { siteId: TSiteID; siteName?: string },
  seed: ICrossSeedLocalSeed,
  torrentId: number,
  source: TCrossSeedSourceKind,
): Promise<ICrossSeedCandidate[]> {
  const base = {
    sourceInfoHash: seed.infoHash,
    sourceName: seed.name,
    sourceSavePath: seed.savePath,
    sourceSize: seed.size,
    torrentId,
    source,
  };
  const siteId = site.siteId;
  const siteName = site.siteName || siteId;
  try {
    const siteInstance = await getSiteInstance<"public">(siteId);
    const result = await resolveTorrentDownload({ siteInstance, hit: { torrent_id: torrentId }, localSiteId: siteId });

    if (result.method === "B" && result.config?.url) {
      return [{ ...base, siteId, siteName, downloadUrl: axios.getUri(result.config), method: "B", status: "ready" }];
    }
    if (result.url && result.missing?.length === 0 && result.unsupported?.length === 0) {
      return [
        { ...base, siteId, siteName, downloadUrl: result.url, method: "A", status: "ready", error: result.error },
      ];
    }
    return [
      {
        ...base,
        siteId,
        siteName,
        method: result.method,
        status: "error",
        error:
          result.error ?? ([...(result.missing ?? []), ...(result.unsupported ?? [])].join(", ") || "下载链接解析失败"),
      },
    ];
  } catch (e) {
    return [{ ...base, siteId, siteName, status: "error", error: messageOf(e) }];
  }
}

function errorCandidate(error: string, source: TCrossSeedSourceKind): ICrossSeedCandidate {
  return { sourceInfoHash: "", siteId: "", siteName: "", torrentId: 0, status: "error", error, source };
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
