import { computed, watch } from "vue";
import { ITorrentTag } from "@ptd/site";

import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";

const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

export const tableCustomFilter = useTableCustomFilter({
  parseOptions: {
    keywords: ["site", "tags", "status"],
    ranges: ["time", "size", "seeders", "leechers", "completed", "downloadVolumeFactor", "uploadVolumeFactor"],
  },
  titleFields: ["title", "subTitle"],
  initialSearchValue: metadataStore.lastSearchFilter,
  initialItems: computed(() => runtimeStore.search.searchResult),
  format: {
    tags: {
      parse: (value: ITorrentTag | string) => ((value ?? {}) as ITorrentTag).name ?? value,
    },
    time: "date",
    size: "size",
    // 滑块步进会产出 0.35000000000000003 这类浮点噪声，生成过滤词时统一保留两位小数
    downloadVolumeFactor: {
      parse: (value: number | string) => Number(value),
      build: (value: number | string) => String(Math.round(Number(value) * 100) / 100),
    },
    uploadVolumeFactor: {
      parse: (value: number | string) => Number(value),
      build: (value: number | string) => String(Math.round(Number(value) * 100) / 100),
    },
  },
});

watch(tableCustomFilter.tableFilterRef, (newValue) => {
  if (configStore.searchEntity.saveLastFilter) {
    // noinspection JSIgnoredPromiseFromCall
    metadataStore.setLastSearchFilter(newValue);
  }
});
