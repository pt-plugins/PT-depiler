/**
 * 种子收藏处理函数（ #708 ）
 */

import type { ITorrent } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import {
  buildTorrentFavorite,
  getTorrentFavoriteKey,
  type ITorrentFavoriteItem,
  type TTorrentFavoriteKey,
  type TTorrentFavoriteStorageSchema,
} from "@/shared/types.ts";

const STORAGE_KEY = "torrentFavorite" as const;

async function getStoredFavorites(): Promise<TTorrentFavoriteStorageSchema> {
  return ((await sendMessage("getExtStorage", STORAGE_KEY)) as TTorrentFavoriteStorageSchema) ?? {};
}

/**
 * 获取所有种子收藏（按收藏时间倒序，最新收藏的在前）
 */
export async function getTorrentFavorites(): Promise<ITorrentFavoriteItem[]> {
  const favorites = await getStoredFavorites();
  return Object.values(favorites).sort((a, b) => b.createdAt - a.createdAt);
}

onMessage("getTorrentFavorites", getTorrentFavorites);

/**
 * 批量添加种子收藏
 *
 * 同一种子重复收藏时视为更新其分类与备注（保留原收藏时间）；
 * `favCategories` / `comment` 传入空值表示清空，缺省（undefined）表示保持原值。
 */
export async function createTorrentFavorites(data: {
  torrents: ITorrent[];
  favCategories?: string[];
  comment?: string;
}): Promise<number> {
  const favorites = await getStoredFavorites();
  const now = Date.now();

  for (const torrent of data.torrents) {
    const key = getTorrentFavoriteKey(torrent);
    favorites[key] = buildTorrentFavorite(torrent, favorites[key], data, now);
  }

  await sendMessage("setExtStorage", { key: STORAGE_KEY, value: favorites });
  return data.torrents.length;
}

onMessage("createTorrentFavorites", async ({ data }) => {
  return await createTorrentFavorites(data);
});

/**
 * 批量删除种子收藏
 */
export async function deleteTorrentFavorites(keys: TTorrentFavoriteKey[]): Promise<void> {
  const favorites = await getStoredFavorites();

  for (const key of keys) {
    delete favorites[key];
  }

  await sendMessage("setExtStorage", { key: STORAGE_KEY, value: favorites });
}

onMessage("deleteTorrentFavorites", async ({ data: keys }) => {
  await deleteTorrentFavorites(keys);
});
