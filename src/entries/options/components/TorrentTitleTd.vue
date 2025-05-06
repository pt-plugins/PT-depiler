<script setup lang="ts">
import { reactive, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";
import { useRouter } from "vue-router";
import { socialBuildUrlMap } from "@ptd/social";
import type { ISocialInformation, TSupportSocialSite } from "@ptd/social/types.ts";

import type { ISearchResultTorrent } from "@/shared/storages/types/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { sendMessage } from "@/messages.ts";

const { item } = defineProps<{
  item: ISearchResultTorrent;
}>();

const router = useRouter();
const configStore = useConfigStore();

const { width: containerWidth } = useElementSize(useTemplateRef<HTMLDivElement>("container"));
const { width: tagsWidth } = useElementSize(useTemplateRef<HTMLDivElement>("tags"));
const { width: socialWidth } = useElementSize(useTemplateRef<HTMLDivElement>("social"));

interface ISocialInformationData extends ISocialInformation {
  loading?: boolean;
}

// @ts-ignore
const socialInformation = reactive<Record<TSupportSocialSite | string, ISocialInformationData>>({});

function loadSocialInformation(site: TSupportSocialSite) {
  if (item[`ext_${site}`] && !socialInformation[site]) {
    socialInformation[site] = { loading: true } as ISocialInformationData;
    sendMessage("getSocialInformation", { site, sid: item[`ext_${site}`] as unknown as string }).then((info) => {
      socialInformation[site] = info;
    });
  }
}

function doAdvanceSearch(site: TSupportSocialSite, sid: string) {
  const toRoute = { name: "SearchEntity", query: { search: `${site}|${sid}`, flush: 1 } };

  if (configStore.searchEntifyControl.socialInformationSearchOnNewTab) {
    window.open(router.resolve(toRoute).href, "_blank");
  } else {
    router.push(toRoute);
  }
}
</script>

<template>
  <v-container ref="container" class="t_main">
    <v-row>
      <!-- 种子主标题信息 -->
      <span
        :style="{
          width: `${containerWidth - socialWidth}px`,
        }"
        class="text-truncate"
      >
        <a
          :href="item.url"
          :title="item.title"
          class="t_title text-decoration-none text-subtitle-1 text-truncate"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          {{ item.title }}
        </a>
      </span>

      <!-- 种子的媒体信息 -->
      <div ref="social" class="ml-2">
        <template v-if="configStore.searchEntifyControl.showSocialInformation">
          <template v-for="(meta, key) in socialBuildUrlMap" :key="key">
            <v-menu v-if="item[`ext_${key}`]">
              <template v-slot:activator="{ props }">
                <v-avatar
                  v-bind="props"
                  :image="`/icons/social/${key}.png`"
                  rounded="0"
                  size="x-small"
                  class="ml-1"
                  @click="() => loadSocialInformation(key as TSupportSocialSite)"
                  @mouseenter="() => loadSocialInformation(key as TSupportSocialSite)"
                />
              </template>
              <v-card>
                <v-card-text class="pa-0 py-1">
                  <div class="text-center" style="max-width: 150px">
                    <template v-if="socialInformation[key]?.loading === true">
                      <h3 class="font-weight-bold my-2">Loading....</h3>
                    </template>
                    <template v-else-if="socialInformation[key]?.id">
                      <v-img :src="socialInformation[key]?.poster" class="mb-1" width="150" aspect-ratio="2/3">
                        <template #placeholder>
                          <v-skeleton-loader type="image@2" height="225"></v-skeleton-loader>
                        </template>
                        <template #error>
                          <v-img width="150" src="/icons/movie_placeholder.png" class="mb-1" />
                        </template>
                      </v-img>
                      <h3
                        v-if="socialInformation[key]?.title"
                        class="text-decoration-none text-ellipsis text-truncate font-weight-bold"
                        :title="socialInformation[key]?.title"
                      >
                        {{ socialInformation[key]?.title.split(" / ")[0] }}
                      </h3>
                      <p class="text-caption">
                        {{ socialInformation[key]?.ratingScore }} from {{ socialInformation[key]?.ratingCount }} votes
                      </p>
                    </template>
                    <template v-else>
                      <h3 class="font-weight-bold my-2">No Information</h3>
                    </template>

                    <v-divider class="my-1" />
                    <v-btn
                      variant="text"
                      block
                      append-icon="mdi-magnify"
                      @click="doAdvanceSearch(key as TSupportSocialSite, item[`ext_${key}`] as string)"
                    >
                      搜索
                    </v-btn>

                    <v-divider class="my-1" />
                    <v-btn
                      variant="text"
                      :href="meta(item[`ext_${key}`]! as string)"
                      target="_blank"
                      block
                      rel="noopener noreferrer nofollow"
                      :title="`${key}: ${item[`ext_${key}`]}`"
                      append-icon="mdi-arrow-top-right-bold-box-outline"
                    >
                      访问
                    </v-btn>
                    <v-divider class="my-1" />
                    <p class="text-caption mt-1">( {{ key }}: {{ item[`ext_${key}`] }} )</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </template>
      </div>
    </v-row>
    <v-row v-if="configStore.searchEntifyControl.showTorrentTag || configStore.searchEntifyControl.showTorrentSubtitle">
      <!-- 种子标签信息 -->
      <div ref="tags">
        <template v-if="configStore.searchEntifyControl.showTorrentTag">
          <v-chip v-for="tag in item.tags" :color="tag.color" class="mr-1" label size="x-small">
            {{ tag.name }}
          </v-chip>
        </template>
      </div>

      <!-- 种子副标题信息 -->
      <span
        v-if="configStore.searchEntifyControl.showTorrentSubtitle && item.subTitle"
        :style="{
          'max-width': item.tags ? `${containerWidth - tagsWidth}px` : undefined,
        }"
        :title="item.subTitle"
        class="t_subTitle text-grey text-truncate"
      >
        {{ item.subTitle }}
      </span>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
