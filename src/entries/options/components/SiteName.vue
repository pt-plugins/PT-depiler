<script setup lang="ts">
import { reactive, useAttrs } from "vue";
import { computedAsync } from "@vueuse/core";
import { type TSiteID } from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";

const metadataStore = useMetadataStore();

const props = defineProps<{
  siteId: TSiteID;
  tag?: string;
  class?: string[] | string;
}>();

const attrs = useAttrs();

const siteName = computedAsync(() => metadataStore.getSiteMergedMetadata(props.siteId, "name", props.siteId));

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
</script>

<template>
  <slot :name="siteName">
    <component :is="tagIs" v-bind="renderProp">{{ siteName }}</component>
  </slot>
</template>

<style scoped lang="scss"></style>
