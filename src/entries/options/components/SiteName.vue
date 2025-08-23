<script setup lang="ts">
import { onMounted, reactive, ref, useAttrs } from "vue";
import { type TSiteID } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";

const metadataStore = useMetadataStore();

const props = defineProps<{
  siteId: TSiteID;
  tag?: string;
  class?: string[] | string;
}>();

const attrs = useAttrs();

const siteName = ref<string>("");

const tagIs = props.tag ?? "a";

const renderProp = reactive<Record<string, any>>({
  ...attrs,
  class: props.class ?? ["text-caption", "text-decoration-none", "text-grey", "text-no-wrap"],
});

if (tagIs === "a") {
  renderProp.href = "#";
  renderProp.target = "_blank";
  renderProp.rel = "noopener noreferrer nofollow";

  metadataStore.getSiteUrl(props.siteId).then((url) => {
    renderProp.href = url;
  });
}

onMounted(() => {
  // 首先赋值为 siteId，防止空白
  siteName.value = props.siteId;

  // 优先从缓存中读取
  if (metadataStore.siteNameMap?.[props.siteId]) {
    siteName.value = metadataStore.siteNameMap[props.siteId];
  } else {
    // 如果缓存中没有/或者没有生成缓存，则按之前的逻辑读取
    metadataStore.getSiteMergedMetadata(props.siteId, "name", props.siteId).then((name) => {
      siteName.value = name;
    });
  }
});
</script>

<template>
  <slot :name="siteName">
    <component :is="tagIs" v-bind="renderProp">{{ siteName }}</component>
  </slot>
</template>

<style scoped lang="scss"></style>
