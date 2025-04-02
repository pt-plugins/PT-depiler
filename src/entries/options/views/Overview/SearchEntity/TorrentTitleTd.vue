<script setup lang="ts">
import type { ISearchResultTorrent } from "@/shared/storages/runtime.ts";
import { useElementSize } from "@vueuse/core";
import { useTemplateRef } from "vue";

const { item } = defineProps<{
  item: ISearchResultTorrent;
}>();

const { width: containerWidth } = useElementSize(useTemplateRef<HTMLDivElement>("container"));
const { width: tagsWidth } = useElementSize(useTemplateRef<HTMLDivElement>("tags"));
</script>

<template>
  <v-container class="t_main" ref="container">
    <v-row>
      <a
        :href="item.url"
        class="t_title text-decoration-none text-subtitle-1 text-black text-truncate"
        :title="item.title"
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {{ item.title }}
      </a>
    </v-row>
    <v-row>
      <div ref="tags">
        <v-chip v-for="tag in item.tags" label size="x-small" class="mr-1" :color="tag.color">
          {{ tag.name }}
        </v-chip>
      </div>

      <span
        v-if="item.subTitle"
        class="t_subTitle text-grey text-truncate"
        :title="item.subTitle"
        :style="{
          'max-width': item.tags ? `${containerWidth - tagsWidth}px` : false,
        }"
      >
        {{ item.subTitle }}
      </span>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
