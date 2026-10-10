/**
 * 本地文件树对比源（LocalCrossSeed）——参照 cross-seed/cross-seed 的 decide.ts 决策模型实现。
 *
 * 事实（2026-09 源码级调研，docs/cross-seed-research.md）：
 * - cross-seed **从不计算 piece hash**，匹配 = 候选 .torrent 文件树（name+size）与 searchee 文件树比对；
 * - 决策顺序：SAME/EXISTS hash 去重 → fuzzySize 总大小校验 → 按 matchMode 文件树比对 → 决策；
 * - matchMode：strict（严格路径+长度）/ flexible（只比大小，容忍改名）/ partial（按大小占比）。
 *
 * 本项目在 cross-seed 模型之上叠加一层「pieces_hash == sha1(info.pieces)」精确比对：
 * 同内容种子（跨站 private/announce 不同）pieces 串一致，允许 strict 之外的精确强化。
 */
import type { ICrossSeedFileRef } from "./types";

/** 本地匹配决策（对齐 cross-seed Decision 的子集） */
export type TLocalMatchDecision =
  | "MATCH" // 文件树完全一致（strict / pieces 一致）
  | "MATCH_SIZE_ONLY" // 只比大小（flexible）
  | "MATCH_PARTIAL" // 大小占比达标（partial）
  | "NO_MATCH" // 不匹配
  | "INFO_HASH_ALREADY_EXISTS" // 该 hash 已在本机（跳过注入）
  | "SAME_INFO_HASH"; // 与本地种子同 hash（候选即本地）

export type TLocalMatchMode = "strict" | "flexible" | "partial";

export interface ILocalCandidate {
  infoHash?: string;
  name?: string;
  /** 候选种子文件树（解析 .torrent 得到；单文件种子路径归一为种子名） */
  files?: ICrossSeedFileRef[];
  /** 候选种子总大小（可来自搜索结果或 .torrent） */
  size?: number;
  /** 候选 pieces_hash（可选；提供时 strict 判定直接按 pieces 精确命中） */
  piecesHash?: string;
}

export interface ILocalSeedForMatch {
  infoHash?: string;
  files?: ICrossSeedFileRef[];
  size?: number;
  piecesHash?: string;
}

export interface IAssessLocalOptions {
  seed: ILocalSeedForMatch;
  candidate: ILocalCandidate;
  /** 本地已知 infohash 集合（避免重复注入已在本机的种子） */
  infoHashesToExclude?: Set<string>;
  matchMode?: TLocalMatchMode;
  /** fuzzy 总大小阈值（默认 ±2%，对齐 cross-seed fuzzySizeThreshold） */
  fuzzySizeThreshold?: number;
  /** partial 模式最低字节占比（默认 98%，= 1 - fuzzySizeThreshold） */
  minSizeRatio?: number;
}

export interface IAssessLocalResult {
  decision: TLocalMatchDecision;
  /** 决策原因（人工可读） */
  reason?: string;
  /** partial 模式预计进度（0-100） */
  progress?: number;
}

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

/** 归一化：计算两文件清单的签名（用于快速前置过滤避免全量比对） */
export function filesLayoutSignature(files: ICrossSeedFileRef[]): string {
  const total = files.reduce((acc, f) => acc + f.size, 0);
  const joined = files
    .map((f) => f.path)
    .sort()
    .join("\n");
  return `${files.length}|${total}|${joined.length}`;
}

/**
 * 下载器文件清单归一化：把绝对路径（含 savePath 前缀）转为种子根相对路径。
 * 对齐 cross-seed：searchee.files[].path 为相对路径，candidate 的 .torrent files 亦为相对路径。
 */
export function normalizeClientFiles(files: Array<{ path: string; size: number }>, savePath = ""): ICrossSeedFileRef[] {
  const root = savePath.replace(/\\/g, "/").replace(/\/+$/, "");
  return files.map((f) => {
    const norm = f.path.replace(/\\/g, "/");
    const rel = root && norm.startsWith(root) ? norm.slice(root.length).replace(/^\//, "") : norm;
    return { path: rel || norm.split("/").pop() || "", size: f.size };
  });
}

/** 总大小 fuzzy 校验（对齐 cross-seed fuzzySizeDoesMatch，默认 ±2%） */
export function fuzzySizeDoesMatch(sizeA: number, sizeB: number, threshold = 0.02): boolean {
  const max = Math.max(sizeA, sizeB);
  if (max === 0) return sizeA === sizeB;
  return Math.abs(sizeA - sizeB) / max <= threshold;
}

/** flexible：只比大小集合（重命名/换组文件也能命中） */
export function compareFileTreesIgnoringNames(a: ICrossSeedFileRef[], b: ICrossSeedFileRef[]): boolean {
  if (a.length !== b.length) return false;
  const sizesA = a.map((f) => f.size).sort((x, y) => x - y);
  const sizesB = b.map((f) => f.size).sort((x, y) => x - y);
  return sizesA.every((s, i) => s === sizesB[i]);
}

/** partial：候选文件大小能在 searchee 中配上的字节数占比 */
export function compareFileTreesPartial(a: ICrossSeedFileRef[], b: ICrossSeedFileRef[]): { ratio: number } {
  const sizesB = b.map((f) => f.size);
  const matchedBytes = a.reduce((acc, file) => {
    const idx = sizesB.indexOf(file.size);
    if (idx >= 0) {
      sizesB.splice(idx, 1);
      return acc + file.size;
    }
    return acc;
  }, 0);
  const total = Math.max(
    b.reduce((acc, f) => acc + f.size, 0),
    1,
  );
  return { ratio: matchedBytes / total };
}

/**
 * 决策入口（对齐 cross-seed decide.ts 检查顺序）：
 * 1) hash 去重（SAME_INFO_HASH / INFO_HASH_ALREADY_EXISTS）
 * 2) fuzzy 总大小校验
 * 3) pieces_hash 精确命中（本项目强化层）
 * 4) 按 matchMode 文件树比对（strict / flexible / partial）
 */
export function assessLocalCandidate(options: IAssessLocalOptions): IAssessLocalResult {
  const {
    seed,
    candidate,
    infoHashesToExclude,
    matchMode = "strict",
    fuzzySizeThreshold = 0.02,
    minSizeRatio = 0.98,
  } = options;

  // 1. hash 去重
  if (seed.infoHash && candidate.infoHash) {
    if (seed.infoHash === candidate.infoHash) {
      return { decision: "SAME_INFO_HASH", reason: "候选与本地种子同 infohash" };
    }
    if (infoHashesToExclude?.has(candidate.infoHash)) {
      return { decision: "INFO_HASH_ALREADY_EXISTS", reason: "该 infohash 已在本机存在" };
    }
  }

  // 2. 总大小 fuzzy 校验（无 size 信息时跳过）
  if (
    seed.size != null &&
    candidate.size != null &&
    !fuzzySizeDoesMatch(seed.size, candidate.size, fuzzySizeThreshold)
  ) {
    return { decision: "NO_MATCH", reason: `总大小超出 fuzzy 阈值（±${fuzzySizeThreshold * 100}%）` };
  }

  // 3. pieces_hash 精确命中（本项目强化层）
  if (seed.piecesHash && candidate.piecesHash) {
    if (seed.piecesHash === candidate.piecesHash) {
      return { decision: "MATCH", reason: "pieces_hash 一致（sha1(info.pieces)）", progress: 100 };
    }
    return { decision: "NO_MATCH", reason: "pieces_hash 不一致" };
  }

  // 4. 文件树比对
  if (!seed.files || !candidate.files) {
    if (candidate.files === undefined && seed.files === undefined) {
      // 双方均无文件树时仅凭 size 判定（罕见）
      return seed.size != null && candidate.size != null
        ? { decision: "MATCH_SIZE_ONLY", reason: "无文件树信息，仅总大小匹配", progress: 100 }
        : { decision: "NO_MATCH", reason: "缺少文件树与大小信息" };
    }
    return { decision: "NO_MATCH", reason: "缺少一方文件树信息" };
  }

  if (matchMode === "flexible") {
    if (compareFileTreesIgnoringNames(seed.files, candidate.files)) {
      return { decision: "MATCH_SIZE_ONLY", reason: "按大小匹配（flexible，容忍改名）", progress: 100 };
    }
    return { decision: "NO_MATCH", reason: "flexible 大小集合不匹配" };
  }

  if (matchMode === "partial") {
    const { ratio } = compareFileTreesPartial(seed.files, candidate.files);
    if (ratio >= minSizeRatio) {
      return {
        decision: "MATCH_PARTIAL",
        reason: `大小占比 ${(ratio * 100).toFixed(1)}% ≥ ${(minSizeRatio * 100).toFixed(1)}%`,
        progress: Math.round(ratio * 100),
      };
    }
    return { decision: "NO_MATCH", reason: `大小占比 ${(ratio * 100).toFixed(1)}% 不足` };
  }

  if (filesLayoutMatch(seed.files, candidate.files)) {
    return { decision: "MATCH", reason: "文件树完全一致（strict）", progress: 100 };
  }
  return { decision: "NO_MATCH", reason: "文件树不一致（strict）" };
}

/**
 * 综合判定（兼容旧接口）：layout/pieces 任一层命中即可；无任何可比信息返回 false。
 * @deprecated 使用 assessLocalCandidate（含决策与原因）
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
  return false;
}
