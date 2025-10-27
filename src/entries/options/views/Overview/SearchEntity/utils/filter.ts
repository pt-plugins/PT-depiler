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
    ranges: ["time", "size", "seeders", "leechers", "completed"],
  },
  titleFields: ["title", "subTitle"],
  initialSearchValue: metadataStore.lastSearchFilter,
  initialItems: computed(() => runtimeStore.search.searchResult),
  format: {
    tags: {
      parse: (value: ITorrentTag) => (value ?? {}).name,
    },
    time: "date",
    size: "size",
  },
});

watch(tableCustomFilter.tableFilterRef, (newValue) => {
  if (configStore.searchEntity.saveLastFilter) {
    // noinspection JSIgnoredPromiseFromCall
    metadataStore.setLastSearchFilter(newValue);
  }
});
