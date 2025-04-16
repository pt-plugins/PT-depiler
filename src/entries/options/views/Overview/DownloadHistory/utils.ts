import searchQueryParser, { SearchParserOptions } from "search-query-parser";
import { computed, ref } from "vue";
import type { ITorrentDownloadMetadata } from "@/shared/storages/types/indexdb.ts";
import { refDebounced } from "@vueuse/core";
import { parseValidTimeString } from "@ptd/site";
import { checkRange, dateFilterFormat } from "~/helper.ts";

export const searchQueryParserOptions: SearchParserOptions = {
  keywords: ["site", "downloader", "status"],
  ranges: ["date"],
  tokenize: true,
  offsets: false,
  alwaysArray: true,
};

export const tableWaitFilter = ref("");
export const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成
const tableParsedFilter = computed(() => searchQueryParser.parse(tableFilter.value, searchQueryParserOptions));

export function tableCustomFilterFn(value: any, query: string, item: any): boolean {
  const rawItem = item.raw as ITorrentDownloadMetadata;
  const itemTitle = `${rawItem.title}|$|${rawItem.subTitle ?? ""}`.toLowerCase();

  // @ts-ignore
  const { site, date, downloader, status, text, exclude } = tableParsedFilter.value;

  if (site && !site.includes(rawItem.siteId)) return false;
  if (downloader && !downloader.includes(rawItem.downloaderId)) return false;
  if (status && !status.includes(rawItem.downloadStatus)) return false;
  if (date && rawItem.downloadAt) {
    const startDateTimestamp = parseValidTimeString(date.from, dateFilterFormat) as number;
    const endDateTimestamp = parseValidTimeString(date.to, dateFilterFormat) as number;
    if (!checkRange({ from: startDateTimestamp, to: endDateTimestamp }, rawItem.downloadAt)) return false;
  } else if (date) {
    return false;
  }

  if (text && !text.map((x: string) => x.toLowerCase()).every((keyword: string) => itemTitle.includes(keyword)))
    return false;

  if (exclude) {
    const { site: exSite, downloader: exDownloader, text: exText, status: exStatus } = exclude;
    if (exSite && exSite.includes(rawItem.siteId)) return false;
    if (exDownloader && exDownloader.includes(rawItem.downloaderId)) return false;
    if (exStatus && exStatus.includes(rawItem.downloadStatus)) return false;
    if (exText) {
      const excludesText = (Array.isArray(exText) ? exText : [exText]).map((x) => x.toLowerCase());
      if (excludesText.some((keyword: string) => itemTitle.includes(keyword))) return false;
    }
  }

  return true;
}

export const downloadStatusMap: Record<
  ITorrentDownloadMetadata["downloadStatus"],
  { title: string; icon: string; color: string }
> = {
  downloading: { title: "下载中", icon: "mdi-download", color: "blue" },
  pending: { title: "等待中", icon: "mdi-clock", color: "orange" },
  completed: { title: "已完成", icon: "mdi-check", color: "green" },
  failed: { title: "错误", icon: "mdi-alert", color: "red" },
};
