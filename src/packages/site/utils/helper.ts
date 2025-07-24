// noinspection ES6PreferShortImport

/**
 * Helper functions for other utilities
 */

import { type ISearchCategoryOptions } from "../types/search";

/**
 * Builds search category options from a given array of strings or string arrays.
 * The name and value of each option will be the same as the string itself.
 * @param options
 */
export function buildCategoryOptions(options: (string | string[])[]): ISearchCategoryOptions[] {
  return options.flat(Infinity).map(
    (option) =>
      ({
        name: option,
        value: option,
      }) as ISearchCategoryOptions,
  );
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
