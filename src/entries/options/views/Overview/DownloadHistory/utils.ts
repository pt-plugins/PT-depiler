import { throttle } from "es-toolkit";
import { computed, reactive, shallowRef } from "vue";
import { sendMessage } from "@/messages.ts";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";

import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/types.ts";

// 使用 shallowRef 优化大量下载历史数据的性能
export const downloadHistory = shallowRef<Record<TTorrentDownloadKey, ITorrentDownloadMetadata>>({});
export const downloadHistoryList = computed(() => Object.values(downloadHistory.value));

// 使用 setTimeout 监听下载状态变化
const watchingMap = reactive<Record<TTorrentDownloadKey, number>>({});
function watchDownloadHistory(downloadHistoryId: TTorrentDownloadKey) {
  watchingMap[downloadHistoryId] = setTimeout(async () => {
    const history = await sendMessage("getDownloadHistoryById", downloadHistoryId);
    downloadHistory.value[downloadHistoryId] = history;
    if (history.downloadStatus == "downloading" || history.downloadStatus == "pending") {
      watchDownloadHistory(downloadHistoryId);
    } else {
      delete watchingMap[downloadHistoryId];
    }
  }, 1e3) as unknown as number;
}

function loadDownloadHistory() {
  // 首先清除所有的下载状态监听
  for (const key of Object.keys(watchingMap)) {
    clearTimeout(watchingMap[key as unknown as number]);
    delete watchingMap[key as unknown as number];
  }

  sendMessage("getDownloadHistory", undefined).then((history: ITorrentDownloadMetadata[]) => {
    downloadHistory.value = {}; // 清空目前的下载记录
    history.forEach((item) => {
      downloadHistory.value[item.id!] = item;
      if (item.downloadStatus == "downloading" || item.downloadStatus == "pending") {
        watchDownloadHistory(item.id!);
      }
    });
  });
}

export const throttleLoadDownloadHistory = throttle(loadDownloadHistory, 1e3);

export const tableCustomFilter = useTableCustomFilter({
  parseOptions: {
    keywords: ["siteId", "downloaderId", "downloadStatus"],
    ranges: ["downloadAt"],
  },
  titleFields: ["title", "subTitle"],
  initialItems: downloadHistoryList,
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
