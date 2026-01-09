<script setup lang="ts">
import { onMounted, shallowRef } from "vue";
import { NO_IMAGE, type TSiteID } from "@ptd/site";

import { getSiteFavicon } from "./utils.ts";

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

onMounted(async () => {
  let favicon = await getSiteFavicon(siteId, flushOnPre);
  if (favicon === NO_IMAGE && flushOnNoImage) {
    favicon = await getSiteFavicon(siteId, true); // 强制刷新
  }

  siteFavicon.value = favicon;
});

function doFlush() {
  if (!flushOnClick) return;
  getSiteFavicon(siteId, true).then((favicon) => {
    siteFavicon.value = favicon;
  });
}

const binds = {
  click: flushOnClick ? doFlush : undefined,
};
</script>

<template>
  <v-img :height="size" :src="siteFavicon" :width="size" aspect-ratio="1/1" v-on="binds" />
</template>

<style scoped lang="scss"></style>
