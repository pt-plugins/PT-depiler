<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";
import { type ITorrent } from "@ptd/site";

const { item } = defineProps<{
  item: ITorrent;
}>();

const { width: containerWidth } = useElementSize(useTemplateRef<HTMLDivElement>("container"));
const { width: socialWidth } = useElementSize(useTemplateRef<HTMLDivElement>("social"));
</script>

<template>
  <v-container ref="container" class="t_main">
    <v-row>
      <!-- 种子主标题信息 -->
      <span
        :style="{
          width: `${containerWidth - socialWidth}px`,
        }"
        class="t_title text-decoration-none text-subtitle-1 text-truncate"
      >
        {{ item.title }}
      </span>
    </v-row>
    <!-- 种子副标题信息 -->
    <v-row v-if="item.subTitle">
      <span
        :style="{ 'max-width': `${containerWidth}px` }"
        :title="item.subTitle"
        class="t_subTitle text-grey text-truncate"
      >
        {{ item.subTitle }}
      </span>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
