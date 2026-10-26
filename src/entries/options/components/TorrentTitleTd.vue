<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { socialBuildUrlMap } from "@ptd/social";
import { isPromotionTagName, tagsToPromotion, type ITorrent, type ITorrentTag } from "@ptd/site";
import type { ISocialInformation, TSupportSocialSite } from "@ptd/social/types.ts";

import { useConfigStore } from "@/options/stores/config.ts";
import { sendMessage } from "@/messages.ts";

const { item, showSocial = true } = defineProps<{
  item: Partial<ITorrent>;
  showSocial?: boolean;
}>();

const { t } = useI18n();
const router = useRouter();
const configStore = useConfigStore();

interface ISocialInformationData extends ISocialInformation {
  loading?: boolean;
}

// @ts-ignore
const socialInformation = reactive<Record<TSupportSocialSite | string, ISocialInformationData>>({});

const tagsExpanded = ref(false);

const visibleTags = computed(() => {
  const tags = item.tags;
  if (!tags || !tags.length) return [];
  const hiddenNames = configStore.searchEntifyControl.hiddenTagNames || [];
  // 「仅 factor」与「不显示」模式下都不再显示优惠标签；其他标签照常显示
  const hidePromotionTags = ["factor", "none"].includes(configStore.searchEntifyControl.promotionDisplay);
  return tags.filter((tag) => !hiddenNames.includes(tag.name) && !(hidePromotionTags && isPromotionTagName(tag.name)));
});

const maxTagCount = computed(() => configStore.searchEntifyControl.maxTagCountBeforeGroup || 0);

const displayedTags = computed(() => {
  if (!maxTagCount.value || maxTagCount.value >= visibleTags.value.length || tagsExpanded.value) {
    return visibleTags.value;
  }
  return visibleTags.value.slice(0, maxTagCount.value);
});

const hasMoreTags = computed(
  () => maxTagCount.value > 0 && visibleTags.value.length > maxTagCount.value && !tagsExpanded.value,
);

const hiddenTagCount = computed(() => visibleTags.value.length - maxTagCount.value);

function tempHideTag(name: string) {
  if (!configStore.searchEntifyControl.hiddenTagNames.includes(name)) {
    configStore.searchEntifyControl.hiddenTagNames = [...configStore.searchEntifyControl.hiddenTagNames, name];
  }
}

/** 优惠标签的数值释义（由 tagsToPromotion 反推），非优惠标签返回 undefined */
function tagTooltip(tag: ITorrentTag): string | undefined {
  const { downloadVolumeFactor, uploadVolumeFactor } = tagsToPromotion([tag]);
  const parts: string[] = [];

  if (downloadVolumeFactor !== undefined) {
    parts.push(
      downloadVolumeFactor === 0
        ? t("SearchEntity.index.tagTooltip.freeDownload")
        : t("SearchEntity.index.tagTooltip.downloadPercent", [Math.round(downloadVolumeFactor * 100)]),
    );
  }

  if (uploadVolumeFactor !== undefined && uploadVolumeFactor !== 1) {
    parts.push(
      uploadVolumeFactor === 0
        ? t("SearchEntity.index.tagTooltip.noUpload")
        : t("SearchEntity.index.tagTooltip.uploadTimes", [uploadVolumeFactor]),
    );
  }

  return parts.length > 0 ? parts.join(" · ") : undefined;
}

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

function canAdvanceSearch(site: TSupportSocialSite) {
  return site !== "tmdb";
}
</script>

<template>
  <v-container class="t_main pa-0">
    <v-row gap="0" class="flex-nowrap">
      <!-- 种子主标题信息 -->
      <span class="text-truncate flex-1-1-0">
        <a
          :href="item.url"
          :title="item.title"
          class="t_title text-decoration-none text-high-emphasis text-body-large text-truncate"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          {{ item.title ?? item.url ?? item.link }}
        </a>
      </span>

      <!-- 种子的媒体信息 -->
      <div class="ml-2 flex-0-0">
        <template v-if="showSocial && configStore.searchEntifyControl.showSocialInformation">
          <template v-for="(meta, key) in socialBuildUrlMap" :key="key">
            <!--
              不要移除 close-delay：卡片里是可点击的（搜索 / 访问），而激活它的头像只有 24px，
              指针移向卡片的过程中必然先离开头像（VMenu 默认 closeDelay 仅 250ms，斜向稍慢移动就会超时），
              一旦关闭，浮层内容会被置为 inert（Vuetify 4 起，见 #1454），再也无法重新进入（#1580 / #1582 同类问题）。
              这里留出 800ms 关闭延迟，指针进入卡片后即可取消关闭。
            -->
            <v-menu v-if="item[`ext_${key}`]" :close-delay="800" open-on-hover>
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
                        class="text-decoration-none text-truncate font-weight-bold"
                        :title="socialInformation[key]?.title"
                      >
                        {{ socialInformation[key]?.title.split(" / ")[0] }}
                      </h3>
                      <p v-if="socialInformation[key]?.ratingScore" class="text-body-small">
                        {{ socialInformation[key].ratingScore }}
                        <span v-if="socialInformation[key]?.ratingCount">
                          from {{ socialInformation[key].ratingCount }} votes
                        </span>
                      </p>
                    </template>
                    <template v-else>
                      <h3 class="font-weight-bold my-2">No Information</h3>
                    </template>

                    <template v-if="canAdvanceSearch(key as TSupportSocialSite)">
                      <v-divider class="my-1" />
                      <v-btn
                        variant="text"
                        block
                        append-icon="mdi-magnify"
                        @click="doAdvanceSearch(key as TSupportSocialSite, item[`ext_${key}`] as string)"
                      >
                        {{ t("common.search") }}
                      </v-btn>
                    </template>

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
                      {{ t("common.visit") }}
                    </v-btn>
                    <v-divider class="my-1" />
                    <p class="text-body-small mt-1">( {{ key }}: {{ item[`ext_${key}`] }} )</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </template>
      </div>
    </v-row>
    <v-row
      gap="0"
      class="flex-nowrap"
      v-if="configStore.searchEntifyControl.showTorrentTag || configStore.searchEntifyControl.showTorrentSubtitle"
    >
      <!-- 种子标签信息 -->
      <div class="flex-0-0">
        <template v-if="configStore.searchEntifyControl.showTorrentTag && item.tags && item.tags.length > 0">
          <v-hover v-for="tag in displayedTags" :key="tag.name" v-slot:default="{ isHovering, props }">
            <v-chip
              v-bind="props"
              :color="tag.color"
              :closable="isHovering as unknown as boolean"
              :title="tagTooltip(tag)"
              class="mr-1"
              label
              size="x-small"
              @click:close="tempHideTag(tag.name)"
            >
              {{ tag.name }}
            </v-chip>
          </v-hover>
          <v-chip
            v-if="hasMoreTags"
            class="mr-1"
            label
            size="x-small"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-arrow-expand-right"
            @click="tagsExpanded = true"
          >
            {{ hiddenTagCount }}
          </v-chip>
        </template>
      </div>

      <!-- 种子副标题信息 -->
      <span
        v-if="configStore.searchEntifyControl.showTorrentSubtitle && item.subTitle"
        :title="item.subTitle"
        class="t_subTitle text-grey text-truncate flex-1-1-0"
      >
        {{ item.subTitle }}
      </span>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
// flex item 默认 min-width: auto 会阻止 text-overflow: ellipsis 收缩截断,需显式归零
.t_main .text-truncate.flex-1-1-0 {
  min-width: 0;
}
</style>
