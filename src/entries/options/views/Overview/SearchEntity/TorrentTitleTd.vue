<script setup lang="ts">
import type { ISearchResultTorrent } from "@/shared/storages/runtime.ts";
import { useElementSize } from "@vueuse/core";
import { useTemplateRef } from "vue";
import { TAdvanceSearchKeyword } from "@ptd/site";

const { item } = defineProps<{
  item: ISearchResultTorrent;
}>();

const { width: containerWidth } = useElementSize(useTemplateRef<HTMLDivElement>("container"));
const { width: tagsWidth } = useElementSize(useTemplateRef<HTMLDivElement>("tags"));
const { width: socialWidth } = useElementSize(useTemplateRef<HTMLDivElement>("social"));

interface SocialMeta {
  url: (id) => string;
}

const socialMap: Record<TAdvanceSearchKeyword, SocialMeta> = {
  imdb: {
    url: (id) => `https://www.imdb.com/title/${id}/`,
  },
  douban: {
    url: (id) => `https://movie.douban.com/subject/${id}/`,
  },
  bangumi: {
    url: (id) => `https://bgm.tv/subject/${id}/`,
  },
  tmdb: {
    url: (id) => `https://www.themoviedb.org/${id}/`,
  },
  tvdb: {
    url: (id) => `https://thetvdb.com/dereferrer/series/${id}/`,
  },
};
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
        :style="{
          width: `${containerWidth - socialWidth}px`,
        }"
      >
        {{ item.title }}
      </a>
      <div ref="social" class="ml-2">
        <template v-for="(meta, key) in socialMap" :key="key">
          <a
            v-if="item[`ext_${key}`]"
            :href="meta.url(item[`ext_${key}`])"
            target="_blank"
            rel="noopener noreferrer nofollow"
            :title="`${key}: ${item[`ext_${key}`]}`"
          >
            <v-avatar
              v-if="item[`ext_${key}`]"
              :image="`/icons/social/${key}.png`"
              rounded="0"
              size="x-small"
              class="ml-1"
            ></v-avatar>
          </a>
        </template>
      </div>
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
