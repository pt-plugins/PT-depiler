// noinspection ES6PreferShortImport

/**
 * Helper functions for other utilities
 */

import { type ISearchCategoryOptions } from "../types/search";
import { type ISiteMetadata } from "../types/site";

/**
 * 判断站点定义里某个字段是否「可用」。
 *
 * 对 `search` / `userInfo` 这类对象字段，空对象视为不可用（`{}` 也算没配）。
 * 原先定义在 `index.ts`，因为构建期的轻量索引生成器也要用同一口径，故下沉到这里，
 * 由 `index.ts` 的 `export * from "./utils"` 继续对外暴露（公共 API 不变）。
 */
export function checkSiteMetadataAllow(siteMetadata: ISiteMetadata, key: keyof ISiteMetadata): boolean {
  if (key === "search" || key === "userInfo") {
    return !!(siteMetadata[key] && Object.keys(siteMetadata[key]).length > 0);
  }
  return !!siteMetadata[key];
}

/**
 * Builds search category options from a given array of strings or string arrays.
 * The name and value of each option will be the same as the string itself.
 *
 * For Example: [ "Anime", ["Audio", "Literature"] ] => [ { name: "Anime", value: "Anime" }, { name: "Audio", value: "Audio" }, { name: "Literature", value: "Literature" } ]
 *
 * @param options
 */
export function buildCategoryOptionsFromList(options: (string | string[])[]): ISearchCategoryOptions[] {
  return options.flat(Infinity).map(
    (option) =>
      ({
        name: option,
        value: option,
      }) as ISearchCategoryOptions,
  );
}

/**
 * Builds search category options from a given dictionary object.
 * The name of each option will be the value from the dictionary,
 * and the value of each option will be the corresponding key.
 *
 * For Example: { "1": "Anime", "2": "Audio" } => [ { name: "Anime", value: "1" }, { name: "Audio", value: "2" } ]
 *
 * @param dict
 */
export function buildCategoryOptionsFromDict(dict: Record<string | number, string>): ISearchCategoryOptions[] {
  return Object.entries(dict).map(([key, value]) => ({ name: value, value: key }) as ISearchCategoryOptions);
}

/**
 * Detects if a search query contains non-Latin characters
 *
 * Uses Unicode Script Extensions to accurately identify Latin vs non-Latin characters.
 * Characters from Latin and Common scripts (numbers, punctuation, spaces) are considered Latin.
 * Any other Unicode scripts (Chinese, Japanese, Arabic, Cyrillic, etc.) are considered non-Latin.
 *
 * Mixed character handling: If a query contains both Latin and non-Latin characters,
 * it returns true (treated as non-Latin) to ensure compatibility with sites that
 * support the non-Latin characters.
 *
 * @param query - The search query string to analyze
 * @returns true if the query contains any non-Latin characters, false if only Latin/Common characters
 *
 * @example
 * ```typescript
 * hasNonLatinCharacters("hello world"); // false - only Latin
 * hasNonLatinCharacters("你好世界"); // true - Chinese characters
 * hasNonLatinCharacters("hello 世界"); // true - mixed Latin and Chinese
 * hasNonLatinCharacters("123 !@#"); // false - numbers and punctuation are Common script
 * hasNonLatinCharacters(""); // false - empty string
 * ```
 */
export function hasNonLatinCharacters(query: string): boolean {
  try {
    // Return true if query contains any characters outside Latin and Common scripts
    // Latin script includes basic Latin, Latin-1 Supplement, Latin Extended-A/B, etc.
    // Common script includes numbers, punctuation, spaces, and other script-neutral characters
    const latinAndCommonOnly = /^[\p{Script_Extensions=Latin}\p{Script_Extensions=Common}]*$/u;

    return !latinAndCommonOnly.test(query);
  } catch (error) {
    // Fallback: if Unicode Script Extensions are not supported or any error occurs,
    // default to false (treat as Latin) to ensure search functionality continues
    console.warn("Character detection failed, defaulting to Latin-only detection:", error);
    return false;
  }
}
