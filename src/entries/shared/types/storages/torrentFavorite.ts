/**
 * 种子收藏相关类型定义（ #708 ）
 */

import type { ITorrent } from "@ptd/site";

/** 收藏项 key，与搜索结果中的 uniqueId 采用同一约定：`${site}-${id}` */
export type TTorrentFavoriteKey = string;

export interface ITorrentFavoriteItem extends ITorrent {
  key: TTorrentFavoriteKey;
  favCategories?: string[]; // 收藏分类（用户自设，类似文件夹，同一种子可同时归入多个），为空表示未分类
  comment?: string; // 备注
  createdAt: number; // 收藏时间（毫秒时间戳）
}

export type TTorrentFavoriteStorageSchema = Record<TTorrentFavoriteKey, ITorrentFavoriteItem>;

/**
 * 生成收藏项 key
 *
 * 与搜索结果的 uniqueId 保持一致，方便各处（搜索结果页 / 站点页面）对同一种子做去重；
 * id 缺失时退回下载链接、详情链接，避免同一种子被重复收藏。
 */
export function getTorrentFavoriteKey(torrent: Pick<ITorrent, "site" | "id" | "link" | "url">): TTorrentFavoriteKey {
  return `${torrent.site}-${torrent.id || torrent.link || torrent.url || ""}`;
}

/** 归一化收藏分类：去掉首尾空白与空项、去重（保持原顺序） */
export function normalizeFavCategories(categories?: string[]): string[] {
  return [...new Set((categories ?? []).map((category) => category.trim()).filter(Boolean))];
}

/**
 * 生成一条收藏项（同一种子重复收藏时在原有条目上更新）
 *
 * - 保留原有的收藏时间，便于按「收藏时间」排序时不被重复收藏打乱；
 * - `favCategories` / `comment` 缺省（undefined）表示保持原值，传入（含空数组 / 空字符串）则整体覆盖。
 */
export function buildTorrentFavorite(
  torrent: ITorrent,
  exist: ITorrentFavoriteItem | undefined,
  { favCategories, comment }: { favCategories?: string[]; comment?: string } = {},
  now: number = Date.now(),
): ITorrentFavoriteItem {
  return {
    ...exist,
    ...torrent,
    key: getTorrentFavoriteKey(torrent),
    favCategories: favCategories === undefined ? exist?.favCategories : normalizeFavCategories(favCategories),
    comment: comment ?? exist?.comment,
    createdAt: exist?.createdAt ?? now,
  };
}
