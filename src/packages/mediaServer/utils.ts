/**
 * 媒体服务器的通用工具（与框架、i18n 无关，实体映射与 UI 都能用）。
 */

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
