import type { ITorrent, ITorrentTag } from "../types/torrent";
import { normalizedTorrentTagMap, preDefinedTorrentTagMap } from "./tags";

/**
 * 优惠信息的两种表示与单点互转。
 *
 * 设计口径（与 torznab / Jackett 对齐）：
 *  - `downloadVolumeFactor`：0=免费，0<d<1=折扣，1=正常，undefined=未知
 *  - `uploadVolumeFactor`：0=不计上传，1=正常，>1=多倍，undefined=未知
 *
 * 一个种子在离开解析层时应**同时具备 factor 与 tag**：
 *  - 定义里只写 factor（数据源本身给数值/枚举，如 sunnypt、colapt、mteam）；
 *  - 或只写 tag（数据源只给图标/文本，如 NexusPHP 的 `img.pro_free`）；
 *  - 由 `normalizeTorrentPromotion` 在一次调用中补齐另一侧；两侧都在时 **factor 优先**。
 *
 * 注意：`tags` 里还有 `Freeload` / `可退款` / `H&R` / `官方` 等非倍率语义的标签，
 * 它们不参与逆向，重建优惠标签时也不会被删除。
 */

/** 预定义标签名 → Vuetify 颜色，派生标签复用同一套配色 */
const predefinedTagColor = new Map<string, string | undefined>(
  preDefinedTorrentTagMap.map((tag) => [tag.name, tag.color]),
);

/**
 * 规范标签名 → 量系数。只收录语义能与倍率一一对应的标签，且只声明该标签**确定**的那一维：
 * `Free` 只说明下载免费，不能断言上传是否翻倍（另一维保持 undefined）。
 */
const tagPromotionFactorMap: Record<string, { downloadVolumeFactor?: number; uploadVolumeFactor?: number }> = {
  "NL.": { downloadVolumeFactor: 0, uploadVolumeFactor: 0 },
  Free: { downloadVolumeFactor: 0 },
  "2xFree": { downloadVolumeFactor: 0, uploadVolumeFactor: 2 },
  "25%": { downloadVolumeFactor: 0.25 },
  "30%": { downloadVolumeFactor: 0.3 },
  "35%": { downloadVolumeFactor: 0.35 },
  "50%": { downloadVolumeFactor: 0.5 },
  "70%": { downloadVolumeFactor: 0.7 },
  "75%": { downloadVolumeFactor: 0.75 },
  "2x50%": { downloadVolumeFactor: 0.5, uploadVolumeFactor: 2 },
  "2x": { uploadVolumeFactor: 2 }, // sunnypt 的历史写法，归一后会改写为 2xUp
  "2xUp": { uploadVolumeFactor: 2 },
  "1.5xUp": { uploadVolumeFactor: 1.5 },
};

/** 站点代码里直接 push 的标签不经过预定义表，这里先做一次规范名解析 */
function canonicalTagName(name: string): string {
  const hit = normalizedTorrentTagMap.find((normalized) => normalized.from.test(name));
  return hit?.to.name ?? name;
}

/** 兜底的通用写法：`60%` / `3xUp` / `2xFree` / `2x60%` */
function genericTagFactors(name: string): { downloadVolumeFactor?: number; uploadVolumeFactor?: number } | undefined {
  const percent = name.match(/^(\d+(?:\.\d+)?)%$/);
  if (percent) {
    const download = Number(percent[1]) / 100;
    return download >= 0 && download <= 1 ? { downloadVolumeFactor: download } : undefined;
  }

  const combined = name.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)%$/i);
  if (combined) {
    const upload = Number(combined[1]);
    const download = Number(combined[2]) / 100;
    return download >= 0 && download <= 1 && upload >= 0
      ? { downloadVolumeFactor: download, uploadVolumeFactor: upload }
      : undefined;
  }

  const uploadOnly = name.match(/^(\d+(?:\.\d+)?)x(?:Up)?$/i);
  if (uploadOnly) {
    const upload = Number(uploadOnly[1]);
    return upload >= 0 ? { uploadVolumeFactor: upload } : undefined;
  }

  return undefined;
}

function resolveTagFactors(name: string): { downloadVolumeFactor?: number; uploadVolumeFactor?: number } | undefined {
  const canonical = canonicalTagName(name);
  if (Object.hasOwn(tagPromotionFactorMap, canonical)) {
    return tagPromotionFactorMap[canonical];
  }
  return genericTagFactors(canonical);
}

/** 该名字是否是「优惠」标签：会被 factor 派生结果替换/去重的那一类 */
export function isPromotionTagName(name: string): boolean {
  return resolveTagFactors(name) !== undefined;
}

function makeTag(name: string): ITorrentTag {
  const color = predefinedTagColor.get(name);
  return color ? { name, color } : { name };
}

/** 避免浮点噪声：1.5 → "1.5"、0.30000000000000004 → "0.3" */
function formatFactor(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/**
 * factor → 优惠标签。组合优惠优先用站点惯用的合成名（`2xFree` / `2x50%` / `NL.`），
 * 其余情况拆成两个标签（如 `75%` + `2xUp`），与各站点既有展示保持一致。
 */
export function promotionToTags(downloadVolumeFactor?: number, uploadVolumeFactor?: number): ITorrentTag[] {
  const d = downloadVolumeFactor;
  const u = uploadVolumeFactor;

  if (d === undefined && u === undefined) return [];

  // 站点惯用的合成写法：宁愿一个 chip 也不拆两个
  if (d === 0 && u === 0) return [makeTag("NL.")];
  if (d === 0 && u === 2) return [makeTag("2xFree")];
  if (d === 0.5 && u === 2) return [makeTag("2x50%")];

  const tags: ITorrentTag[] = [];
  if (d !== undefined && d !== 1) {
    tags.push(makeTag(d === 0 ? "Free" : `${Math.round(d * 100)}%`));
  }
  if (u !== undefined && u !== 1) {
    tags.push(makeTag(`${formatFactor(u)}xUp`));
  }
  return tags;
}

/**
 * 优惠标签 → factor。多个优惠标签同时存在时按「下载取最小、上传取最大」合并，
 * 这样 `Free` + `2xUp` 会被读成 `2xFree`，与合成写法等价。
 */
export function tagsToPromotion(tags?: ITorrentTag[]): {
  downloadVolumeFactor?: number;
  uploadVolumeFactor?: number;
} {
  let download: number | undefined;
  let upload: number | undefined;

  for (const tag of tags ?? []) {
    if (!tag?.name) continue;
    const factors = resolveTagFactors(tag.name);
    if (!factors) continue;

    if (factors.downloadVolumeFactor !== undefined) {
      download =
        download === undefined ? factors.downloadVolumeFactor : Math.min(download, factors.downloadVolumeFactor);
    }
    if (factors.uploadVolumeFactor !== undefined) {
      upload = upload === undefined ? factors.uploadVolumeFactor : Math.max(upload, factors.uploadVolumeFactor);
    }
  }

  return { downloadVolumeFactor: download, uploadVolumeFactor: upload };
}

/** 收敛成合法 factor：0 是合法值；`""` / `"N/A"` / `null` / `NaN` / 负数 / 越界的下载系数都算未知 */
function toFactor(value: unknown, kind: "download" | "upload"): number | undefined {
  if (value === null || value === undefined) return undefined;

  let num = typeof value === "string" ? (value.trim() === "" || value.trim() === "N/A" ? NaN : Number(value)) : value;
  if (typeof num !== "number" || !Number.isFinite(num) || num < 0) return undefined;
  if (kind === "download" && num > 1) return undefined;

  return num;
}

/**
 * 读取种子的量系数（供消费方使用）：优先用显式字段，缺失时从 tags 反推，
 * 以兼容没有经过归一层的旧数据（旧搜索快照、旧运行时缓存）。
 * 两个键都可能为 undefined —— 表示未知，不是 1。
 */
export function getTorrentVolumeFactors(
  torrent: Pick<Partial<ITorrent>, "downloadVolumeFactor" | "uploadVolumeFactor" | "tags">,
): { downloadVolumeFactor?: number; uploadVolumeFactor?: number } {
  const inferred = tagsToPromotion(torrent.tags);
  return {
    downloadVolumeFactor: torrent.downloadVolumeFactor ?? inferred.downloadVolumeFactor,
    uploadVolumeFactor: torrent.uploadVolumeFactor ?? inferred.uploadVolumeFactor,
  };
}

/**
 * 单点归一：让种子的 factor 与 tag 两种表示同时成立、且相互一致（幂等）。
 *
 * - 已有 factor（来自定义的选择器 / 覆写方法）→ 以 factor 为准，重建优惠标签；
 * - 只有 tag → 反推 factor（`Free` 只推下载轴），再按 factor 重建优惠标签（`2x` → `2xUp`）；
 * - 两者都没有 → 清理选择器可能写入的非法值（`""` / `"N/A"`），不新增任何字段。
 *
 * 非优惠标签（`H&R` / `官方` / `Freeload` / `可退款` …）原样保留，顺序上仍由调用方排序。
 */
export function normalizeTorrentPromotion<T extends Partial<ITorrent>>(torrent: T): T {
  const target: Partial<ITorrent> = torrent;

  const download = toFactor(target.downloadVolumeFactor, "download");
  const upload = toFactor(target.uploadVolumeFactor, "upload");

  if (download === undefined && upload === undefined) {
    // 没有 factor：要么反过来从标签推断，要么什么都不写
    const inferred = tagsToPromotion(target.tags);
    if (inferred.downloadVolumeFactor === undefined && inferred.uploadVolumeFactor === undefined) {
      // 清掉 selector 未命中时写入的空串 / 哨兵值，保持「未知」语义
      delete target.downloadVolumeFactor;
      delete target.uploadVolumeFactor;
      return torrent;
    }
    return rebuild(torrent, target, inferred.downloadVolumeFactor, inferred.uploadVolumeFactor);
  }

  return rebuild(torrent, target, download, upload);
}

function rebuild<T extends Partial<ITorrent>>(
  torrent: T,
  target: Partial<ITorrent>,
  download: number | undefined,
  upload: number | undefined,
): T {
  if (download === undefined) delete target.downloadVolumeFactor;
  else target.downloadVolumeFactor = download;

  if (upload === undefined) delete target.uploadVolumeFactor;
  else target.uploadVolumeFactor = upload;

  const keptTags = (target.tags ?? []).filter((tag) => !isPromotionTagName(tag.name));
  target.tags = [...keptTags, ...promotionToTags(download, upload)];

  return torrent;
}
