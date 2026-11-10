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

export interface IInfoHashToMagnetOptions {
  /** BitTorrent v2 的 infohash（64 位 hex），与 v1 主参数同时传入时生成混合种子的双 xt 形态（BEP 53） */
  infoHashV2?: string;
  /** 显示名，作为 magnet 的 dn 参数 */
  dn?: string;
  /** 追加的 tracker 列表，作为 magnet 的 tr 参数 */
  tr?: string[];
}

// BEP 3 的 v1 infohash：40 位 hex，或旧客户端仍在用的 32 位 base32
const infoHashV1Pattern = /^(?:[a-f0-9]{40}|[a-z2-7]{32})$/i;
// BEP 52 的 v2 infohash：64 位 hex（SHA-256）
const infoHashV2Pattern = /^[a-f0-9]{64}$/i;

/**
 * 由种子的 infohash 构造公开 magnet 链接（不携带 passkey 等站点私有信息）。
 *
 * 同时支持 magnet 的各类参数（BEP 3 / 9 / 52 / 53）：
 *  - 主参数 infoHash：v1（40 位 hex / 32 位 base32）→ `xt=urn:btih:<hash>`；
 *    直接传 64 位 hex 时按 v2 处理 → `xt=urn:btmh:1220<hash>`（`1220` 是 multihash 的 sha2-256 前缀）；
 *  - options.infoHashV2：v2 hash（64 位 hex）→ 追加 `xt=urn:btmh:1220<hash>`，
 *    与 v1 同时给出时即混合种子的双 xt 形态（`xt=urn:btih:...&xt=urn:btmh:1220...`）；
 *  - options.dn：显示名 → `dn=<encoded>`；
 *  - options.tr：tracker 列表 → 逐个 `tr=<encoded>`。
 *
 * 找不到任何合法 infohash 时返回 null，由调用方决定兜底行为。
 */
export function infoHashToMagnet(
  infoHash: string,
  options?: IInfoHashToMagnetOptions,
): string | null {
  const raw = String(infoHash ?? "").trim();
  let v1 = infoHashV1Pattern.test(raw) ? raw : undefined;
  let v2 = options?.infoHashV2?.trim();
  if (!v1 && !v2 && infoHashV2Pattern.test(raw)) {
    v2 = raw; // 主参数直接给了 v2 hash（64 位 hex）
  }
  if (v2 && !infoHashV2Pattern.test(v2)) {
    v2 = undefined; // 传入的 v2 不合法，丢弃
  }
  if (!v1 && !v2) {
    return null;
  }

  // ⚠️ xt 是 magnet 的识别主键，客户端与下游工具按字面匹配 `urn:btih:` / `urn:btmh:` 前缀
  // （各站点原有实现也是字面拼接），不能过 URLSearchParams —— 冒烟实测它会把冒号转义成
  // `xt=urn%3Abtih%3A…`，破坏 magnet 识别。dn / tr 的值才走 encodeURIComponent（与原实现一致）。
  const parts: string[] = [];
  if (v1) {
    parts.push(`xt=urn:btih:${v1}`);
  }
  if (v2) {
    parts.push(`xt=urn:btmh:1220${v2}`);
  }

  const dn = options?.dn?.trim();
  if (dn) {
    parts.push(`dn=${encodeURIComponent(dn)}`);
  }
  options?.tr?.forEach((tracker) => {
    const tr = String(tracker ?? "").trim();
    if (tr) {
      parts.push(`tr=${encodeURIComponent(tr)}`);
    }
  });

  return `magnet:?${parts.join("&")}`;
}

/**
 * 从 magnet / URN 文本中剥出裸 infohash：
 *  - `xt=urn:btih:<40 位 hex 或 32 位 base32>` → v1 hash；
 *  - `xt=urn:btmh:1220<64 位 hex>` → v2 hash。
 *
 * 供「id 写的就是整条 magnet」的站点把 infohash 显式落到 ITorrent.infoHash 使用；
 * 找不到合法 infohash 时返回空串（可直接作为选择器值兜底）。
 */
export function extractInfoHashFromMagnet(magnet: string): string {
  const matched = /urn:btih:([a-f0-9]{40}|[a-z2-7]{32})|urn:btmh:1220([a-f0-9]{64})/i.exec(String(magnet ?? ""));
  return matched?.[1] ?? matched?.[2] ?? "";
}

/**
 * 可用的具名过滤器。
 *
 * ⚠️ 这里必须用 `satisfies` 而不是 `: Record<string, TQueryFilterFn>` —— 后者会把
 * `keyof typeof definedFilters` 退化成 `string`，于是 `TDefinedFilterName` 形同虚设，
 * 站点定义里写错过滤器名（例如 `{ name: "divide" }`）能一路通过类型检查，
 * 运行时被 `runQueryFilters` 静默跳过 → 静默错值（broadcasthenet 的 bonusPerHour 曾因此偏高 24 倍）。
 * 用 `satisfies` 既保留了键的字面量联合类型，又保证每个过滤器的签名合规。
 */
export const definedFilters = {
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
   * 由 infohash 构造公开 magnet 链接（详见 infoHashToMagnet）：
   *  - 输入为 v1（40 位 hex / 32 位 base32）→ `xt=urn:btih:`；直接给 64 位 hex → `xt=urn:btmh:1220`；
   *  - args[0] 可传 IInfoHashToMagnetOptions（infoHashV2 / dn / tr），补齐其余参数；
   *
   * input: "0403fb4723bd2f707f0b5e39bff4b2e01c239dda"
   * results: "magnet:?xt=urn:btih:0403fb4723bd2f707f0b5e39bff4b2e01c239dda"
   *
   * 输入不带任何合法 infohash 时原样返回，便于在选择器链里兜底（如回落到站点原链接）。
   */
  infoHashToMagnet: (query, args) => infoHashToMagnet(String(query ?? ""), args?.[0]) ?? query,

  /**
   * 由 magnet/URN 文本剥出裸 infohash（详见 extractInfoHashFromMagnet），配合 infoHash 选择器使用。
   *
   * input: "magnet:?xt=urn:btih:0403fb4723bd2f707f0b5e39bff4b2e01c239dda&dn=x"
   * results: "0403fb4723bd2f707f0b5e39bff4b2e01c239dda"
   */
  magnetToInfoHash: (query) => extractInfoHashFromMagnet(String(query ?? "")),

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
    if (typeof query === "number") {
      return query;
    }
    const queryMatch = String(query ?? "")
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
    if (typeof query === "number") {
      return query;
    }
    const queryMatch = String(query ?? "")
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
} satisfies Record<string, TQueryFilterFn>;

/** 全部具名过滤器（供静态校验用；站点定义里的 `filters: [{ name }]` 必须取自这里） */
export const filterNames = Object.keys(definedFilters);

export type TDefinedFilterName = keyof typeof definedFilters;

export interface IDefinedQueryFilter {
  name: TDefinedFilterName;
  args?: any[];
}

export type TQueryFilter = IDefinedQueryFilter | TQueryFilterFn;
