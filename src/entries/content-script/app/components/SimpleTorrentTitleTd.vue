<script setup lang="ts">
import { type ITorrent } from "@ptd/site";

const { item } = defineProps<{
  item: ITorrent;
}>();
</script>

<template>
  <v-container ref="container" class="t_main px-0">
    <v-row>
      <!-- 种子主标题信息 -->
      <span class="t_title text-decoration-none text-subtitle-1 text-truncate">
        {{ item.title }}
      </span>
    </v-row>
    <!-- 种子副标题信息 -->
    <v-row v-if="item.subTitle">
      <span :title="item.subTitle" class="t_subTitle text-grey text-truncate">
        {{ item.subTitle }}
      </span>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
