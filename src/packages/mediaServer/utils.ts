/**
 * 媒体服务器的通用工具（与框架、i18n 无关，实体映射与 UI 都能用）。
 */
import type { IMediaServerId, IMediaServerItem, IMediaServerOverview } from "./types.ts";

/** 分辨率宽高 → 规范化标签（480p / 720p / 1080p / 1440p / 4K / 8K） */
export function getResolutionLabel(width?: number, height?: number): string | undefined {
  // 以短边为准：宽银幕影片的 1920×800 仍应算 1080p
  const shortSide = Math.min(width ?? 0, height ?? 0) || Math.max(width ?? 0, height ?? 0);
  if (!shortSide) return undefined;
  if (shortSide >= 4320) return "8K";
  if (shortSide >= 2160) return "4K";
  if (shortSide >= 1440) return "1440p";
  if (shortSide >= 1080) return "1080p";
  if (shortSide >= 720) return "720p";
  if (shortSide >= 576) return "576p";
  if (shortSide >= 480) return "480p";
  return `${shortSide}p`;
}

/** 码率（bps）→ 便于阅读的字符串，如 8.2 Mbps */
export function formatBitrate(bitrate?: number): string | undefined {
  if (!bitrate || bitrate <= 0) return undefined;
  if (bitrate >= 1e6) return `${(bitrate / 1e6).toFixed(1)} Mbps`;
  if (bitrate >= 1e3) return `${Math.round(bitrate / 1e3)} kbps`;
  return `${bitrate} bps`;
}

/**
 * 观看进度：Emby/Jellyfin 给 `PlaybackPositionTicks`（1 tick = 100ns），
 * 这里换算成秒并给出 0-100 的百分比（回退用 `Played` + `UserData.PlayedPercentage`）。
 */
export function getPlayedPercentage(
  positionTicks?: number,
  runTimeTicks?: number,
  played?: boolean,
): number | undefined {
  if (played) return 100;
  if (!positionTicks || !runTimeTicks) return undefined;
  return Math.min(100, Math.max(0, Math.round((positionTicks / runTimeTicks) * 100)));
}

/**
 * 从文件路径取出「库根」，用于按磁盘/目录聚合体积（调研 C14）。
 *
 * - Windows：`E:\Media\Movies\x.mkv` → `E:/Media`
 * - POSIX：`/volume1/media/Movies/x.mkv` → `/volume1/media`
 *
 * 只取前两级是有意的：再深就会把每部片子算成一组，失去聚合意义。
 */
export function getRootPath(path?: string): string | undefined {
  if (!path) return undefined;

  const normalized = path.replace(/\\/g, "/");
  const isWindows = /^[A-Za-z]:/.test(normalized);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length <= 2) return normalized;

  const joined = segments.slice(0, 2).join("/");
  return isWindows ? joined : `/${joined}`;
}

/**
 * 媒体库概览的累加器（调研 C14 / C20）。
 *
 * 各实体（Emby/Jellyfin 的 `MediaBrowser`、Plex、fnOS）自己负责「怎么翻页」，
 * 拉到条目后调用 {@link IMediaServerOverviewAccumulator.add}，最后 `build()` 出统计结果 ——
 * 聚合逻辑只有这一份，避免三家各写一遍。
 */
export interface IMediaServerOverviewAccumulator {
  add(item: IMediaServerItem): void;
  /** 生成结果；一条都没有加入过时返回 undefined */
  build(mediaServerId: IMediaServerId, truncated: boolean): IMediaServerOverview | undefined;
}

export function createOverviewAccumulator(recentDays = 7): IMediaServerOverviewAccumulator {
  const bucket = new Map<string, Map<string, { count: number; size: number }>>();
  const group = (name: string, key?: string, size?: number) => {
    const map = bucket.get(name) ?? new Map<string, { count: number; size: number }>();
    bucket.set(name, map);

    const label = key?.trim() || "-";
    const entry = map.get(label) ?? { count: 0, size: 0 };
    entry.count += 1;
    entry.size += size ?? 0;
    map.set(label, entry);
  };

  const neverWatched: Array<{ name: string; size: number; productionYear?: number }> = [];
  const recentlyAdded: Array<{ name: string; dateCreated?: string }> = [];
  const recentThreshold = Date.now() - recentDays * 24 * 3600 * 1000;

  let totalItems = 0;
  let totalSize = 0;
  let bitrateSum = 0;
  let bitrateCount = 0;
  let watched = 0;
  let partial = 0;
  let unwatched = 0;
  let totalPlays = 0;

  return {
    add(item) {
      const size = item.size ?? 0;
      totalItems += 1;
      totalSize += size;

      group("resolution", item.mediaInfo?.video?.resolution, size);
      group("codec", item.mediaInfo?.video?.codec, size);
      group("container", item.format, size);
      group("rootPath", getRootPath(item.path), size);

      const bitrate = item.mediaInfo?.video?.bitrate;
      if (bitrate) {
        bitrateSum += bitrate;
        bitrateCount += 1;
      }

      const percent = item.user?.playedPercentage ?? (item.user?.IsPlayed ? 100 : 0);
      if (percent >= 100) watched += 1;
      else if (percent > 0) partial += 1;
      else unwatched += 1;
      totalPlays += item.user?.playCount ?? 0;

      if (percent === 0 && size > 0) {
        neverWatched.push({ name: item.name, size, productionYear: item.productionYear });
      }
      if (item.dateCreated && new Date(item.dateCreated).getTime() >= recentThreshold) {
        recentlyAdded.push({ name: item.name, dateCreated: item.dateCreated });
      }
    },

    build(mediaServerId, truncated) {
      if (totalItems === 0) return undefined;

      const entries = (name: string, limit?: number) => {
        const list = [...(bucket.get(name) ?? new Map())]
          .map(([key, value]) => ({ key, count: value.count, size: value.size }))
          .sort((a, b) => b.size - a.size || b.count - a.count);
        return limit ? list.slice(0, limit) : list;
      };

      return {
        mediaServerId,
        generatedAt: Date.now(),
        truncated,
        totalItems,
        totalSize,
        averageBitrate: bitrateCount > 0 ? Math.round(bitrateSum / bitrateCount) : undefined,
        byResolution: entries("resolution"),
        byCodec: entries("codec"),
        byContainer: entries("container"),
        byRootPath: entries("rootPath", 12),
        watch: { watched, partial, unwatched, totalPlays },
        playsPerGb: totalPlays > 0 && totalSize > 0 ? Number((totalPlays / (totalSize / 1e9)).toFixed(2)) : undefined,
        neverWatched: neverWatched.sort((a, b) => b.size - a.size).slice(0, 10),
        recentlyAdded: recentlyAdded
          .sort((a, b) => (b.dateCreated ?? "").localeCompare(a.dateCreated ?? ""))
          .slice(0, 10),
      };
    },
  };
}
