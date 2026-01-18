// noinspection ES6PreferShortImport

import { parseTimeToLiveToDate, parseTimeToLiveToSeconds, parseValidTimeString } from "./datetime.ts";
import { parseSizeString } from "./filesize.ts";
import { socialParseUrlMap } from "@ptd/social/index.ts";

export function tryToNumber(value: any): number {
  if (typeof value === "string") {
    value = value.replace(/[, ]/gi, ""); // 统一处理 `1,024` `1 024` 之类的情况
    if (/^-?\d+$/.test(value)) {
      // 尽可能的将返回值转成数字类型
      value = isNaN(parseInt(value)) ? 0 : parseInt(value);
    }
  }
  return value;
}

type TQueryFilterFn = (query: any, args?: any[]) => any;

export const definedFilters: Record<string, TQueryFilterFn> = {
  /**
   * Extract values from URL arguments.
   * If more than one arg is provided, the first one that matches will be returned.
   *
   * input: browse.php?cat=123
   * args: ["cat"]
   * results: 123
   */
  querystring: (query, args) => {
    const baseUrl = /^https?:/.test(query as string) ? undefined : "http://localhost/";

    const parsedQueryString = new URL(query, baseUrl).searchParams;
    for (const arg of args!) {
      if (parsedQueryString.has(arg)) {
        return parsedQueryString.get(arg);
      }
    }
    return "";
  },

  /**
   * Extends a string by appending additional characters to the end.
   *
   * input: "a"
   * args: ["b"]
   * results: "ab"
   */
  append: (query, args) => query + (args![0] || ""),

  /**
   * Inserts a string by appending additional characters to the beginning of its current value.
   *
   * input: "b"
   * args: ["a"]
   * results: "ab"
   */
  prepend: (query, args) => (args![0] || "") + query,

  /**
   * Converts a string to lowercase letters. Does not require any parameters.
   *
   * input: MY MOVIE TITLE 1080P
   * results: my movie title 1080p
   */
  toLower: (query) => String(query).toLowerCase(),

  /**
   * Converts a string to uppercase letters. Does not require any parameters.
   *
   * input: my movie title 1080p
   * results: MY MOVIE TITLE 1080P
   */
  toUpper: (query) => String(query).toUpperCase(),

  /**
   * If the pattern string is matched, then the pattern is replaced by a replacement string.
   * args[0] can be a string or a regular expression.
   *
   * input: "Hello, world!"
   * args: ["Hello", "Hi"]
   * results: "Hi, world!"
   */
  replace: (query, args) => String(query).replace(args![0], args![1]),

  /**
   * Divides a string into an array of substrings, and return the selected substring.
   * The first parameter in the argument is the single character pattern used to split the string,
   * and the second parameter is the array element number of the wanted substring,
   * counting from zero for the first element.
   * If the second parameter is omitted, the first element will be returned.
   *
   * input: "Hello, world!"
   * args: [",", 1]
   * results: " world!"
   */
  split: (query, args) => String(query).split(args![0])[args![1] ?? 0],

  /**
   * Removes all leading and trailing white-space characters.
   *
   * input: "  Hello, world!  "
   * results: "Hello, world!"
   */
  trim: (query) => String(query).trim(),

  /**
   * Extracts a number from a string.
   *
   * input: "This is 8.5"
   * results: 8.5
   */
  parseNumber: (query) => {
    const queryMatch = query
      .trim()
      .replace(/[\s,\n]/g, "")
      .match(/(-?[\d.]+)/);
    return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
  },

  /**
   * Extracts a size from a string.
   * The size string can be in the format of "123.45 MB" or "123.45MiB".
   *
   * input: "This is 8.5 MB"
   * results: 8912896
   */
  parseSize: (query) => {
    const queryMatch = query
      .trim()
      .replace(/[ ,\n]/g, "")
      .match(/([\d.]+(.*[^ZEPTGMK])?[ZEPTGMK]?i?B)/);
    return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
  },

  /**
   * Extracts a valid time from a string.
   * The time string should be in the format of "2021-01-01 12:00:00".
   * If the time string is not valid, the original string will be returned.
   * Only used when you know the format of the time string.
   *
   * input: "2021-01-01 12:00:00"
   * args: ["yyyy-MM-dd HH:mm:ss"]
   * results: 1609488000000
   */
  parseTime: parseValidTimeString,

  /**
   * Extracts a valid time from a string.
   * The time string should be in the format of "1年2月3天4时5分前" or "1 year 3 months ago".
   * all valid time units are:
   *  - year, quarter, month, week, day, hour, minute, second.
   *  - 年, 月, 天, 时, 分, 秒.
   *  - yr, qtr, mo, wk, day, hr, min, sec.
   * If the time string is not valid, the original string will be returned.
   *
   * input: "1 year 2 months 3 days 4 hours 5 minutes ago"
   * results: 1609488000000
   */
  parseTTL: parseTimeToLiveToDate,

  /**
   * Extracts a duration value (seconds) from a string.
   * The time string should be in the format of "1年2月3天4时5分前" or "1 year 3 months ago".
   * all valid time units are:
   *  - year, quarter, month, week, day, hour, minute, second.
   *  - 年, 月, 天, 时, 分, 秒.
   *  - yr, qtr, mo, wk, day, hr, min, sec.
   * If the time string is not valid, the original string will be returned.
   *
   * input: "1 year 2 months 3 days 4 hours 5 minutes"
   * results: 36993900
   */
  parseDuration: parseTimeToLiveToSeconds,

  /**
   * Parses a string into a timestamp (milliseconds).
   * Attempts to use the provided format (e.g. "yyyy-MM-dd HH:mm:ss");
   * if parsing fails, falls back to TTL-style parsing (e.g. "1 year 2 months ago").
   *
   * Example input: "2021-01-01 12:00:00" or "1 year 2 months 3 days 4 hours 5 minutes ago"
   * args: ["yyyy-MM-dd HH:mm:ss"] // optional, specify the time format
   * Returns: 1609488000000 (timestamp). If parsing fails, returns the original string or TTL result.
   */
  parseFuzzyTime: (query, args) => {
    const time = parseValidTimeString(query, args);
    return time === query ? parseTimeToLiveToDate(query) : time;
  },

  // Social Site Parser
  extAnidbId: socialParseUrlMap.anidb,
  extBangumiId: socialParseUrlMap.bangumi,
  extDoubanId: socialParseUrlMap.douban,
  extImdbId: socialParseUrlMap.imdb,
  extTvmazeId: socialParseUrlMap.tvmaze,

  /**
   * Print the query to the console.
   * This filter is used for debugging purposes.
   * No change for the query.
   */
  dump: (query) => {
    console?.log(query);
    return query;
  },
};

export const filterNames = Object.keys(definedFilters);

export type TDefinedFilterName = keyof typeof definedFilters;

export interface IDefinedQueryFilter {
  name: TDefinedFilterName;
  args?: any[];
}

export type TQueryFilter = IDefinedQueryFilter | TQueryFilterFn;
