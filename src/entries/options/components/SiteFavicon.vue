<script setup lang="ts">
import { onMounted, shallowRef, watch } from "vue";
import { NO_IMAGE, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";

const {
  siteId,
  size = 32,
  flushOnPre = false,
  flushOnNoImage = false,
  flushOnClick = false,
} = defineProps<{
  siteId: TSiteID;
  size?: number;
  flushOnPre?: boolean;
  flushOnNoImage?: boolean;
  flushOnClick?: boolean;
}>();

const siteFavicon = shallowRef<string>(NO_IMAGE);

async function loadFavicon() {
  let favicon = await sendMessage("getSiteFavicon", { site: siteId, flush: flushOnPre });
  if (favicon === NO_IMAGE && flushOnNoImage) {
    favicon = await sendMessage("getSiteFavicon", { site: siteId, flush: true }); // 强制刷新
  }

  siteFavicon.value = favicon;
}

onMounted(() => {
  loadFavicon();
});

watch(
  () => siteId,
  () => {
    loadFavicon();
  },
);

function doFlush() {
  if (!flushOnClick) return;
  sendMessage("getSiteFavicon", { site: siteId, flush: true }).then((favicon) => {
    siteFavicon.value = favicon;
  });
}
</script>

<template>
  <v-img :height="size" :src="siteFavicon" :width="size" aspect-ratio="1/1" @click="doFlush" />
</template>

<style scoped lang="scss"></style>
