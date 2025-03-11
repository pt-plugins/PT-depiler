<script setup lang="ts">
import { computed, ref } from "vue";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { sendMessage } from "@/messages.ts";

const runtimeStore = useRuntimeStore();

const props = defineProps<{
  torrentIds: string[];
}>();

const torrentItems = computed(() => {
  return runtimeStore.search.searchResult.filter((x) => props.torrentIds.includes(x.uniqueId));
});

async function getTorrentDownloadLinks() {
  const downloadUrls = [];

  for (const torrent of torrentItems.value) {
    const downloadUrl = await sendMessage("getTorrentDownloadLink", { siteId: torrent.site, torrent });
    console.log(`torrent download link:`, torrent, downloadUrl);
    downloadUrls.push({ torrent, downloadUrl });
  }

  return downloadUrls;
}

const copyTorrentDownloadLinkBtnStatus = ref(false);
async function copyTorrentDownloadLink() {
  copyTorrentDownloadLinkBtnStatus.value = true;
  const downloadUrls = await getTorrentDownloadLinks();
  await navigator.clipboard.writeText(
    downloadUrls
      .map((x) => x.downloadUrl)
      .join("\n")
      .trim(),
  );
  copyTorrentDownloadLinkBtnStatus.value = false;
}

const localDlTorrentDownloadLinkBtnStatus = ref(false);
async function localDlTorrentDownloadLink() {
  localDlTorrentDownloadLinkBtnStatus.value = true;
  for (const torrent of torrentItems.value) {
    await sendMessage("downloadTorrentFile", { siteId: torrent.site, torrent });
  }
  localDlTorrentDownloadLinkBtnStatus.value = false;
}

function noop() {
  // do nothing
}
</script>

<template>
  <v-btn-group size="small" variant="text" color="grey">
    <!-- TODO 下载到服务器 -->
    <v-btn icon="mdi-cloud-download" :disabled="true || props.torrentIds.length == 0" @click="() => noop()"></v-btn>
    <!-- 复制下载链接 -->
    <v-btn
      icon="mdi-content-copy"
      :loading="copyTorrentDownloadLinkBtnStatus"
      :disabled="props.torrentIds.length == 0"
      title="复制下载链接"
      @click="() => copyTorrentDownloadLink()"
    >
    </v-btn>
    <!-- 下载种子文件到本地 -->
    <v-btn
      icon="mdi-content-save"
      :loading="localDlTorrentDownloadLinkBtnStatus"
      :disabled="props.torrentIds.length == 0"
      title="下载种子文件到本地"
      @click="() => localDlTorrentDownloadLink()"
    ></v-btn>
    <!-- TODO 收藏 -->
    <v-btn icon="mdi-heart-outline" :disabled="true || props.torrentIds.length == 0" @click="() => noop()"></v-btn>
  </v-btn-group>
</template>

<style scoped lang="scss"></style>
