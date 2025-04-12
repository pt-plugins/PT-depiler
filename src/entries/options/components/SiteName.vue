<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { TSiteID } from "@ptd/site";
import { reactive } from "vue";
import { omit } from "es-toolkit";

const metadataStore = useMetadataStore();

const props = defineProps<{
  siteId: TSiteID;
  tag?: string;
  class?: string[] | string;
}>();

const siteName = computedAsync(() => metadataStore.getSiteMergedMetadata(props.siteId, "name", props.siteId));

const tagIs = props.tag ?? "a";

const renderProp = reactive<Record<string, any>>({
  ...omit(props, ["siteId", "tag", "class"]),
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
  <component :is="tagIs" v-bind="renderProp">{{ siteName }}</component>
</template>

<style scoped lang="scss"></style>
