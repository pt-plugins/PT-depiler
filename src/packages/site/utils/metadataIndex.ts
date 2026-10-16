// noinspection ES6PreferShortImport

import { checkSiteMetadataAllow } from "./helper";
import type { ISiteMetadata } from "../types/site";
import type { ISiteMetadataIndexEntry } from "../types/metadataIndex";

/**
 * 索引收录的「固定属性」字段名。
 *
 * ⚠️ 必须与 `pickSiteMetadataIndexEntry()` 实际写入的字段保持一致：消费方（如
 * `metadataStore.getSiteMergedMetadata`）靠它判断「这个字段能不能从索引里拿到」，
 * 判断为能拿却其实没写，就会静默拿到 undefined。改字段集时两处一起改。
 */
export const INDEXED_METADATA_FIELDS = [
  "name",
  "type",
  "schema",
  "isDead",
  "urls",
  "legacyUrls",
  "trackerUrls",
  "aka",
  "tags",
  "version",
  "description",
] as const;

export type TIndexedMetadataField = (typeof INDEXED_METADATA_FIELDS)[number];

export function isIndexedMetadataField(field: PropertyKey): field is TIndexedMetadataField {
  return (INDEXED_METADATA_FIELDS as readonly PropertyKey[]).includes(field);
}

/**
 * 从完整站点定义里抽出轻量索引需要的字段。
 *
 * 这是「索引里到底有什么」的唯一出处：构建期生成器（vite/plugin/generateSiteIndex.ts）
 * 调用它来产出索引，运行时消费方按 `ISiteMetadataIndexEntry` 来读，两边不会各写一份。
 *
 * 注意：入参必须是 `getDefinedSiteMetadata()` 的返回值（urls 已还原 rot13、tags 已补空数组），
 * 不要直接拿 `definitions/*.ts` 里的原始 `siteMetadata` 传进来。
 */
export function pickSiteMetadataIndexEntry(metadata: ISiteMetadata): ISiteMetadataIndexEntry {
  const entry: ISiteMetadataIndexEntry = {
    name: metadata.name,
    type: metadata.type,
    urls: metadata.urls,
  };

  // 只写「有值」的字段：401 个条目里 isDead 只有 86 个、trackerUrls 更少，
  // 让 undefined 的键直接不出现，索引体积小一截
  if (metadata.schema) entry.schema = metadata.schema;
  if (metadata.isDead) entry.isDead = true;
  if (metadata.legacyUrls?.length) entry.legacyUrls = metadata.legacyUrls;
  if (metadata.trackerUrls?.length) entry.trackerUrls = metadata.trackerUrls;
  if (metadata.aka?.length) entry.aka = metadata.aka;
  if (metadata.tags?.length) entry.tags = metadata.tags;
  if (metadata.version !== undefined) entry.version = metadata.version;
  if (metadata.description) entry.description = metadata.description;
  if (metadata.userInputSettingMeta) entry.hasUserInputSettingMeta = true;
  if (checkSiteMetadataAllow(metadata, "search")) entry.hasSearch = true;
  if (checkSiteMetadataAllow(metadata, "userInfo")) entry.hasUserInfo = true;
  if (metadata.searchEntry) {
    entry.searchEntries = Object.fromEntries(
      Object.entries(metadata.searchEntry).map(([key, value]) => [
        key,
        {
          name: value?.name ?? key,
          ...(typeof value?.enabled === "boolean" ? { enabled: value.enabled } : {}),
        },
      ]),
    );
  }

  return entry;
}
