import type { ITorrentDownloadMetadata } from "@/shared/storages/types/indexdb.ts";

import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";

export const tableCustomFilter = useTableCustomFilter({
  parseOptions: {
    keywords: ["siteId", "downloaderId", "downloadStatus"],
    ranges: ["downloadAt"],
  },
  titleFields: ["title", "subTitle"],
  format: {
    downloadAt: "date",
  },
});

export const downloadStatusMap: Record<
  ITorrentDownloadMetadata["downloadStatus"],
  { title: string; icon: string; color: string }
> = {
  downloading: { title: "下载中", icon: "mdi-download", color: "blue" },
  pending: { title: "等待中", icon: "mdi-clock", color: "orange" },
  completed: { title: "已完成", icon: "mdi-check", color: "green" },
  failed: { title: "错误", icon: "mdi-alert", color: "red" },
};
