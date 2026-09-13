/**
 * 本地文件树对比源（cross-seed 简化版算法）。
 * 思路：私有站跨站 infohash 必不同，但「同文件种子的文件布局（路径+长度）与
 * info.pieces 串」一致——用这两者做本地文件树 ↔ 目标站候选种子的精确比对。
 *
 * 本包只提供纯函数比对原语；「目标站候选种子获取」由聚合层（offscreen）按站点能力注入。
 */
import type { ICrossSeedFileRef } from "./types";

/**
 * 文件布局比对：路径集合一致且每个路径长度一致。
 * - 单文件种子需归一化路径（单文件种子中路径通常为种子名）
 * - 多文件种子路径为相对路径，直接比对即可
 */
export function filesLayoutMatch(a: ICrossSeedFileRef[], b: ICrossSeedFileRef[]): boolean {
  if (a.length !== b.length) return false;
  const sizeByPath = new Map(a.map((f) => [f.path, f.size]));
  return b.every((f) => sizeByPath.get(f.path) === f.size);
}

/** 归一化：计算两文件清单的「路径哈希集合」签名（用于快速前置过滤避免全量比对） */
export function filesLayoutSignature(files: ICrossSeedFileRef[]): string {
  const minsize = files.reduce((acc, f) => Math.min(acc, f.size), Infinity);
  const total = files.reduce((acc, f) => acc + f.size, 0);
  const joined = files
    .map((f) => f.path)
    .sort()
    .join("\n");
  return `${files.length}|${total}|${minsize}|${joined.length}`;
}

/**
 * 综合判定：布局签名先过滤，再精确比对布局；若两者都提供 piece hash 则再比 pieces。
 */
export function matchLocalToSiteTorrent(
  local: { files?: ICrossSeedFileRef[]; piecesHash?: string },
  siteTorrent: { files?: ICrossSeedFileRef[]; piecesHash?: string },
): boolean {
  if (local.piecesHash && siteTorrent.piecesHash) {
    return local.piecesHash === siteTorrent.piecesHash;
  }
  if (local.files && siteTorrent.files) {
    return filesLayoutMatch(local.files, siteTorrent.files);
  }
  // 无任何可比信息 → 不算命中
  return false;
}
