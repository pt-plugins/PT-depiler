/**
 * crossSeed 聚合扫描：IYUU 中心 / NexusPHP pieces-hash 直查 / 本地文件树对比 三源统一入口。
 * 候选统一为 ICrossSeedCandidate（带 source 标识），UI 只消费候选数组，与单源时代完全兼容。
 */
import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types.ts";
import type { TSiteID } from "@ptd/site";
import type { CTorrent } from "@ptd/downloader";
import { getRemoteTorrentFile } from "@ptd/downloader";
import {
  mapNexusHits,
  nexusQueryPiecesHash,
  assessLocalCandidate,
  fuzzySizeDoesMatch,
  normalizeClientFiles,
  piecesHashFromInfoPieces,
  type ICrossSeedCandidate,
  type ICrossSeedLocalSeed,
  type ILocalSeedForMatch,
  type INexusSiteConfig,
  type TCrossSeedSourceKind,
  type TLocalMatchMode,
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
      results.push(...(await scanLocalSource(seeds, { instance, torrents: completed })));
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

/** Local 源配置：目标站列表 + 匹配模式（读取设置页录入） */
async function localConfig(): Promise<{ sites: TSiteID[]; matchMode: TLocalMatchMode; searchLimit: number }> {
  const metadata = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema | undefined;
  const iyuu = metadata?.iyuu ?? {};
  const sites = (iyuu.localSites ?? []).filter((id) => id);
  const matchMode: TLocalMatchMode = iyuu.localMatchMode ?? "strict";
  return { sites, matchMode, searchLimit: iyuu.localSearchLimit ?? 10 };
}

/**
 * Local 源（参照 cross-seed torrent-based 主路径）：
 * 下载器已完成种子文件树（getTorrentFiles）充当 searchee → 目标站站内搜索同名候选
 * → snatch 候选 .torrent（带站点 cookie）→ parse-torrent 解析文件树/pieces_hash
 * → assessLocalCandidate 决策（hash 去重 / fuzzySize / matchMode 文件树 / pieces 强化）
 * → 命中构建候选（B 路线注入链接）。风控：每站搜索次数上限 searchLimit、串行执行。
 */
async function scanLocalSource(
  seeds: ICrossSeedLocalSeed[],
  ctx: { instance: NonNullable<Awaited<ReturnType<typeof getDownloaderInstance>>>; torrents: CTorrent[] },
): Promise<ICrossSeedCandidate[]> {
  const config = await localConfig();
  if (!config.sites.length) {
    return [errorCandidate("未配置本地对比目标站（设置 → 辅种 → IYUU 辅种中心 → 本地对比）", "local")];
  }

  const metadata = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema | undefined;
  const siteNameMap = metadata?.siteNameMap ?? {};
  const infoHashesToExclude = new Set(seeds.map((s) => s.infoHash));
  const results: ICrossSeedCandidate[] = [];
  let searched = 0;

  for (const siteId of config.sites) {
    let siteError: string | undefined;
    const siteName = siteNameMap[siteId] ?? siteId;
    let siteInstance: Awaited<ReturnType<typeof getSiteInstance<"public">>>;
    try {
      siteInstance = await getSiteInstance<"public">(siteId);
    } catch (e) {
      results.push(errorCandidate(`站点 ${siteName} 初始化失败：${messageOf(e)}`, "local"));
      continue;
    }

    for (const t of ctx.torrents) {
      if (searched >= config.searchLimit) break;
      searched++;

      // 1) 本地文件树（下载器 reports 绝对路径 → 归一化为种子相对路径）
      let files: Array<{ path: string; size: number }>;
      try {
        files = (await ctx.instance.getTorrentFiles(t)).map((f) => ({ path: f.path, size: f.size }));
      } catch {
        continue; // 该客户端不支持文件列表，跳过此种子
      }
      const seed: ILocalSeedForMatch = {
        infoHash: t.infoHash,
        size: t.totalSize,
        files: normalizeClientFiles(files, t.savePath),
      };

      // 2) 站内搜索（同名候选）+ fuzzySize 预过滤
      let candidates: Array<{ id: string | number; title: string; size?: number; link?: string; url?: string }>;
      try {
        const sr = await siteInstance.getSearchResult(t.name, {});
        candidates = sr.data ?? [];
      } catch (e) {
        siteError = messageOf(e);
        continue;
      }
      for (const cand of candidates) {
        if (!cand.link) continue;
        if (cand.size && !fuzzySizeDoesMatch(t.totalSize, cand.size)) continue;

        // 3) snatch 候选 .torrent 并解析
        try {
          const candTorrent = { ...cand, site: siteId } as unknown as Parameters<
            typeof siteInstance.getTorrentDownloadLink
          >[0];
          const link = await siteInstance.getTorrentDownloadLink(candTorrent);
          const reqConfig = await siteInstance.getTorrentDownloadRequestConfig(candTorrent);
          reqConfig.url = link;
          reqConfig.responseType = "arraybuffer";
          const parsed = await getRemoteTorrentFile(reqConfig);
          const parsedInfo = parsed.info as unknown as {
            name?: string;
            length?: number;
            files?: Array<{ path?: string[]; length: number }>;
            pieces?: Uint8Array;
          };

          const cFiles = parsedInfo.files?.length
            ? parsedInfo.files.map((f) => ({ path: (f.path ?? []).join("/"), size: f.length }))
            : [{ path: String(parsedInfo.name ?? cand.title), size: parsedInfo.length ?? cand.size ?? 0 }];
          const cSize = cFiles.reduce((acc, f) => acc + f.size, 0);
          const cHash = parsedInfo.pieces ? await piecesHashFromInfoPieces(parsedInfo.pieces) : undefined;

          // 4) 决策（cross-seed decide 顺序 + pieces 强化层）
          const decision = assessLocalCandidate({
            seed,
            candidate: {
              infoHash: (parsed as unknown as { infoHash?: string }).infoHash,
              files: cFiles,
              size: cSize,
              piecesHash: cHash,
            },
            infoHashesToExclude,
            matchMode: config.matchMode,
          });
          if (
            decision.decision === "MATCH" ||
            decision.decision === "MATCH_SIZE_ONLY" ||
            decision.decision === "MATCH_PARTIAL"
          ) {
            results.push(
              ...(await buildSourceCandidates(
                { siteId, siteName },
                { infoHash: t.infoHash, name: t.name, savePath: t.savePath, size: t.totalSize },
                Number(cand.id),
                "local",
              )),
            );
          }
        } catch {
          // 单个候选 snatch/解析失败不影响其他候选
        }
      }
    }

    if (!results.length && siteError) {
      results.push(errorCandidate(`站点 ${siteName} 搜索失败：${siteError}`, "local"));
    }
  }

  return results;
}

// ── 公共工具 ─────────────────────────────────────────────

/** 统一候选构建（懒加载：扫描阶段不获取详情页/下载链接，发送时由 downloadTorrent 走站点适配器 B 路线） */
async function buildSourceCandidates(
  site: { siteId: TSiteID; siteName?: string },
  seed: ICrossSeedLocalSeed,
  torrentId: number,
  source: TCrossSeedSourceKind,
): Promise<ICrossSeedCandidate[]> {
  return [
    {
      sourceInfoHash: seed.infoHash,
      sourceName: seed.name,
      sourceSavePath: seed.savePath,
      sourceSize: seed.size,
      torrentId,
      siteId: site.siteId,
      siteName: site.siteName || site.siteId,
      status: "ready",
      source,
    },
  ];
}

function errorCandidate(error: string, source: TCrossSeedSourceKind): ICrossSeedCandidate {
  return { sourceInfoHash: "", siteId: "", siteName: "", torrentId: 0, status: "error", error, source };
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
