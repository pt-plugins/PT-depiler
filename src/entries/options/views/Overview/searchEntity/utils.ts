import searchQueryParser, { type SearchParserOptions } from "search-query-parser";
import { type ISearchResultTorrent } from "@/options/stores/runtime.ts";
import { parseSizeString, parseValidTimeString } from "@ptd/site";
import { computed } from "vue";

export const searchQueryParserOptions: SearchParserOptions = {
  keywords: ["site", "tags"],
  // ranges项的exclude不做支持，FIXME 目前是静默忽视，需要给出提示信息
  ranges: ["date", "size", "seeders", "leechers", "completed"],
  tokenize: true,
  offsets: false,
  alwaysArray: true,
};

const dateFilterFormat = ["T", "yyyyMMdd'T'HHmmss", "yyyyMMdd'T'HHmm", "yyyyMMdd'T'HH", "yyyyMMdd", "yyyyMM", "yyyy"];

function checkRange(range: any, value: number) {
  if (range?.from && value < range.from) return false;
  if (range?.to && value > range.to) return false;
  return true;
}

export function tableCustomFilter(value: any, query: string, item: any) {
  const tableParsedFilter = computed(() => searchQueryParser.parse(query, searchQueryParserOptions));

  const rawItem = item.raw as ISearchResultTorrent;
  const itemTitle = `${rawItem.title}|$|${rawItem.subTitle ?? ""}`.toLowerCase();
  const itemTags = (rawItem.tags ?? []).map((tag) => tag.name);

  // @ts-ignore
  const { site, tags, date, size, seeders, leechers, completed, text, exclude } = tableParsedFilter.value;

  if (site && !site.includes(rawItem.site)) return false;
  if (tags && !tags.every((tag: string) => itemTags.includes(tag))) return false;

  if (date && rawItem.time) {
    const startDateTimestamp = parseValidTimeString(date.from, dateFilterFormat);
    const endDateTimestamp = parseValidTimeString(date.to, dateFilterFormat);
    if (!checkRange({ from: startDateTimestamp, to: endDateTimestamp }, rawItem.time)) return false;
  } else if (date) {
    return false;
  }

  if (size && rawItem.size) {
    const startSize = size.from ? parseSizeString(size.from) : 0;
    const endSize = size.to ? parseSizeString(size.to) : Infinity;
    if (!checkRange({ from: startSize, to: endSize }, rawItem.size)) return false;
  } else if (size) {
    return false;
  }

  // @ts-ignore
  if (seeders && !isNaN(rawItem.seeders) && !checkRange(seeders, rawItem.seeders)) return false;
  // @ts-ignore
  if (leechers && !isNaN(rawItem.leechers) && !checkRange(leechers, rawItem.leechers)) return false;
  // @ts-ignore
  if (completed && !isNaN(rawItem.completed) && !checkRange(completed, rawItem.completed)) return false;

  if (text && !text.map((x: string) => x.toLowerCase()).every((keyword: string) => itemTitle.includes(keyword)))
    return false;

  if (exclude) {
    const { site: exSite, tags: exTags, text: exText } = exclude;
    if (exSite && exSite.includes(rawItem.site)) return false;
    if (exTags && exTags.some((tag: string) => itemTags.includes(tag))) return false;
    if (exText) {
      const excludesText = (Array.isArray(exText) ? exText : [exText]).map((x) => x.toLowerCase());
      if (excludesText.some((keyword: string) => itemTitle.includes(keyword))) return false;
    }
  }

  return true;
}
