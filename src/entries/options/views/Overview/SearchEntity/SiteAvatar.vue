<script setup lang="ts">
import { ISearchTorrent } from "@/shared/store/site.ts";
import { computedAsync } from "@vueuse/core";
import { getSiteConfig, getSiteFavicon } from "@/shared/adapters/site.ts";

const props = defineProps<{
  torrent: ISearchTorrent;
}>();

const siteFavicons = computedAsync<string>(async () => {
  return await getSiteFavicon(props.torrent.site);
}, "");

const siteConfig = computedAsync(async () => {
  return await getSiteConfig(props.torrent.site);
});
</script>

<template>
  <v-avatar :image="siteFavicons" size="18" />
  <template v-if="siteConfig.id"
    ><!-- 此处确保对应站点config获取成功 -->
    <a
      :href="siteConfig.activateUrl || siteConfig.url"
      target="_blank"
      rel="noopener noreferrer nofollow"
      class="captionText"
      >{{ siteConfig.name }}</a
    >
  </template>
</template>

<style scoped></style>
