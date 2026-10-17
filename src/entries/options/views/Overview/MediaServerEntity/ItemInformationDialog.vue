<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { formatBitrate, IMediaServerItem } from "@ptd/mediaServer";
import { formatDate, formatSize } from "@/options/utils.ts";
import { sendMessage } from "@/messages.ts";

const { t } = useI18n();
const router = useRouter();

const showDialog = defineModel<boolean>();
const { item } = defineProps<{
  item: IMediaServerItem;
}>();

/**
 * 调研 B12：列表接口只请求轻量字段，演职人员等重字段在弹窗打开时**按需二次拉取**。
 * 拉不到（服务器不支持 / 请求失败）时静默降级，只展示列表已有的信息。
 */
const detail = ref<IMediaServerItem | null>(null);
const isLoadingDetail = ref<boolean>(false);

watch(showDialog, async (opened) => {
  if (!opened) {
    detail.value = null;
    return;
  }
  if (!item.id) return;

  isLoadingDetail.value = true;
  try {
    detail.value = await sendMessage("getMediaServerItemDetail", { mediaServerId: item.server, itemId: item.id });
  } catch (e) {
    detail.value = null;
  } finally {
    isLoadingDetail.value = false;
  }
});

/** 详情拉取成功就用详情覆盖，否则退回列表里那条 */
const richItem = computed<IMediaServerItem>(() => detail.value ?? item);

/** 调研 B7：用外部标识（imdb / tmdb）一键跳到站点搜索页 */
function searchOnSite(field: "imdb" | "tmdb") {
  const value = richItem.value.providerIds?.[field];
  if (!value) return;
  showDialog.value = false;
  router.push({ path: "/search-entity", query: { search: `${field}|${value}`, flush: 1 } });
}

/** 画质摘要（调研 A2）：分辨率 · 编码(档次) · 色域 · 码率 · 帧率 */
const videoText = computed(() => {
  const video = richItem.value.mediaInfo?.video;
  if (!video) return "";
  return [
    video.resolution,
    video.codec ? `${video.codec}${video.profile ? ` ${video.profile}` : ""}` : undefined,
    video.videoRange && !/^sdr$/i.test(video.videoRange) ? video.videoRange.toUpperCase() : undefined,
    formatBitrate(video.bitrate),
    video.frameRate ? `${video.frameRate} fps` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
});

/** 观看深度（调研 A6）：次数 · 进度 · 最近观看 */
const watchText = computed(() => {
  const parts: string[] = [];
  if (richItem.value.user?.playCount) {
    parts.push(t("MediaServerEntity.ItemInformationDialog.playCountText", { count: richItem.value.user.playCount }));
  }
  if (typeof richItem.value.user?.playedPercentage === "number") {
    parts.push(`${richItem.value.user.playedPercentage}%`);
  }
  if (richItem.value.user?.lastPlayedDate) {
    parts.push(formatDate(new Date(richItem.value.user.lastPlayedDate).getTime()));
  }
  return parts.join(" · ");
});

function secondsToISO8601(seconds: number) {
  seconds = Math.abs(seconds);

  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  let minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60); // 取整秒数

  let duration = "P";

  // 仅在有天数时添加
  if (hours >= 24) {
    let days = Math.floor(hours / 24);
    duration += `${days}D`;
    hours %= 24;
  }

  // 如果有小时、分钟或秒，添加T分隔符
  if (hours > 0 || minutes > 0 || seconds > 0) {
    duration += "T";

    if (hours > 0) duration += `${hours}H`;
    if (minutes > 0) duration += `${minutes}M`;
    if (seconds > 0) duration += `${seconds}S`;
  }

  return duration;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("MediaServerEntity.ItemInformationDialog.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row class="align-center">
          <v-col cols="8" offset="2" offset-sm="0" sm="4">
            <v-img :src="richItem.poster" :title="richItem.name" />

            <!-- 站点搜索（内部搜索：拿外部标识去站点搜索页）与外部链接（原链接：打开服务器给出的页面）都是「动作」，放在海报下方比混在信息列表里更容易识别 -->
            <div class="mt-3 text-center">
              <template v-if="richItem.providerIds?.imdb || richItem.providerIds?.tmdb">
                <div class="text-body-2 text-medium-emphasis mb-1">
                  {{ t("MediaServerEntity.ItemInformationDialog.searchOnSite") }}
                </div>
                <div class="d-flex flex-column ga-1">
                  <v-btn
                    v-if="richItem.providerIds?.imdb"
                    prepend-icon="mdi-movie-search-outline"
                    variant="tonal"
                    @click="searchOnSite('imdb')"
                  >
                    IMDb {{ richItem.providerIds.imdb }}
                  </v-btn>
                  <v-btn
                    v-if="richItem.providerIds?.tmdb"
                    prepend-icon="mdi-movie-search-outline"
                    variant="tonal"
                    @click="searchOnSite('tmdb')"
                  >
                    TMDb {{ richItem.providerIds.tmdb }}
                  </v-btn>
                </div>
              </template>
              <template v-if="richItem.externalUrls?.length">
                <div class="text-body-2 text-medium-emphasis mt-2 mb-1">
                  {{ t("MediaServerEntity.ItemInformationDialog.externalUrls") }}
                </div>
                <div class="d-flex flex-column ga-1">
                  <v-btn
                    v-for="externalUrl in richItem.externalUrls"
                    :key="externalUrl.url"
                    :href="externalUrl.url"
                    append-icon="mdi-open-in-new"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    variant="tonal"
                  >
                    {{ externalUrl.name }}
                  </v-btn>
                </div>
              </template>
            </div>
          </v-col>
          <v-col cols="12" sm="8">
            <a
              :href="richItem.url"
              :title="richItem.name"
              class="w-100 text-headline-small d-inline-block"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              {{ richItem.name }}
            </a>
            <p class="text-body-small">{{ richItem.description ?? "" }}</p>
            <div v-if="richItem.tags && richItem.tags.length > 0" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.type") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip
                  v-for="tag in richItem.tags ?? []"
                  :key="tag.name"
                  :href="tag.url ?? (false as unknown as undefined)"
                  :target="tag.url ? '_blank' : undefined"
                  base-color="orange"
                  class="mr-1"
                  label
                  prepend-icon="mdi-tag"
                  rel="noopener noreferrer nofollow"
                  size="small"
                >
                  {{ tag.name }}
                </v-chip>
              </v-chip-group>
            </div>
            <div v-if="richItem.duration" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.duration") }}</v-label>
              <v-chip base-color="green" class="mr-1" label prepend-icon="mdi-clock-time-four" size="small">
                {{ secondsToISO8601(richItem.duration ?? 0) }}
              </v-chip>
            </div>
            <div v-if="richItem.size" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.size") }}</v-label>
              <v-chip base-color="deep-purple" class="mr-1" label prepend-icon="mdi-harddisk" size="small">
                {{ formatSize(richItem.size ?? 0) }}
              </v-chip>
            </div>
            <!-- 评分（调研 A1） -->
            <div v-if="typeof richItem.rating === 'number'" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.rating") }}</v-label>
              <v-chip base-color="amber" class="mr-1" label prepend-icon="mdi-star" size="small">
                {{ richItem.rating.toFixed(1) }}
              </v-chip>
            </div>
            <!-- 画质（调研 A2） -->
            <div v-if="richItem.format || videoText" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.video") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip v-if="richItem.format" base-color="blue" label prepend-icon="mdi-aspect-ratio" size="small">
                  {{ richItem.format.toUpperCase() }}
                </v-chip>
                <v-chip v-if="videoText" base-color="blue" label prepend-icon="mdi-movie-open" size="small">
                  {{ videoText }}
                </v-chip>
              </v-chip-group>
            </div>
            <!-- 音轨（调研 A2） -->
            <div v-if="richItem.mediaInfo?.audio?.length" class="info-label">
              <v-label class="pr-3">
                {{ t("MediaServerEntity.ItemInformationDialog.audio") }} ({{ richItem.mediaInfo.audio.length }})
              </v-label>
              <v-chip-group show-arrows>
                <v-chip
                  v-for="(audio, idx) in richItem.mediaInfo.audio"
                  :key="idx"
                  base-color="teal"
                  label
                  prepend-icon="mdi-volume-high"
                  size="small"
                >
                  {{
                    [
                      audio.language,
                      audio.codec,
                      audio.channels ? `${audio.channels}ch` : undefined,
                      audio.channelLayout,
                    ]
                      .filter(Boolean)
                      .join(" · ") || audio.title
                  }}
                </v-chip>
              </v-chip-group>
            </div>
            <!-- 字幕（调研 A2） -->
            <div v-if="richItem.mediaInfo?.subtitle?.length" class="info-label">
              <v-label class="pr-3">
                {{ t("MediaServerEntity.ItemInformationDialog.subtitle") }} ({{ richItem.mediaInfo.subtitle.length }})
              </v-label>
              <v-chip-group show-arrows>
                <v-chip
                  v-for="(subtitle, idx) in richItem.mediaInfo.subtitle"
                  :key="idx"
                  base-color="indigo"
                  label
                  prepend-icon="mdi-closed-caption"
                  size="small"
                >
                  {{
                    [
                      subtitle.language,
                      subtitle.codec,
                      subtitle.isExternal ? t("MediaServerEntity.external") : t("MediaServerEntity.embedded"),
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  }}
                </v-chip>
              </v-chip-group>
            </div>
            <!-- 观看深度（调研 A6）：次数 · 进度 · 最近观看 -->
            <div v-if="watchText" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.watched") }}</v-label>
              <v-chip base-color="green" class="mr-1" label prepend-icon="mdi-play-circle-outline" size="small">
                {{ watchText }}
              </v-chip>
            </div>
            <!-- 文件路径（调研 A3） -->
            <div v-if="richItem.path" class="info-label info-path">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.path") }}</v-label>
              <span
                class="text-body-small text-medium-emphasis"
                style="flex: 1 1 auto; min-width: 0; word-break: break-all; overflow-wrap: anywhere"
              >
                {{ richItem.path }}
              </span>
            </div>
            <!-- 入库时间（调研 A4） -->
            <div v-if="richItem.dateCreated" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.dateCreated") }}</v-label>
              <v-chip base-color="blue-grey" class="mr-1" label prepend-icon="mdi-calendar-plus" size="small">
                {{ formatDate(new Date(richItem.dateCreated).getTime()) }}
              </v-chip>
            </div>
            <!-- 外部链接（调研 A5） -->
            <!-- 年份 / 首播 / 分级 / 影评人评分 / 制片公司（调研 B8） -->
            <div v-if="richItem.productionYear || richItem.premiereDate" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.year") }}</v-label>
              <v-chip v-if="richItem.productionYear" base-color="blue-grey" class="mr-1" label size="small">
                {{ richItem.productionYear }}
              </v-chip>
              <v-chip v-if="richItem.premiereDate" base-color="blue-grey" class="mr-1" label size="small">
                {{ richItem.premiereDate.slice(0, 10) }}
              </v-chip>
            </div>
            <div v-if="richItem.officialRating || richItem.criticRating" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.officialRating") }}</v-label>
              <v-chip v-if="richItem.officialRating" base-color="orange" class="mr-1" label size="small">
                {{ richItem.officialRating }}
              </v-chip>
              <v-chip v-if="richItem.criticRating" base-color="amber" class="mr-1" label size="small">
                {{ t("MediaServerEntity.ItemInformationDialog.criticRating") }} {{ richItem.criticRating.toFixed(1) }}
              </v-chip>
            </div>
            <!-- 剧集信息（调研 B10） -->
            <div v-if="richItem.seriesName || richItem.recursiveItemCount || richItem.childCount" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.series") }}</v-label>
              <span class="text-body-small text-medium-emphasis">
                {{
                  [
                    richItem.seriesName,
                    typeof richItem.parentIndexNumber === "number"
                      ? `S${String(richItem.parentIndexNumber).padStart(2, "0")}`
                      : undefined,
                    typeof richItem.indexNumber === "number"
                      ? `E${String(richItem.indexNumber).padStart(2, "0")}`
                      : undefined,
                    richItem.recursiveItemCount || richItem.childCount
                      ? t("MediaServerEntity.ItemInformationDialog.episodeCount", {
                          count: richItem.recursiveItemCount ?? richItem.childCount,
                        })
                      : undefined,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                }}
              </span>
            </div>
            <!-- 同片多版本 / 制片公司 / 自定义标签 / 宣传语（调研 B9 / B8 / B12） -->
            <div v-if="(richItem.mediaSourceCount ?? 0) > 1" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.mediaSourceCount") }}</v-label>
              <v-chip base-color="purple" class="mr-1" label size="small">
                {{ t("MediaServerEntity.versions", { count: richItem.mediaSourceCount }) }}
              </v-chip>
            </div>
            <div v-if="richItem.studios?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.studios") }}</v-label>
              <span class="text-body-small text-medium-emphasis">{{ richItem.studios.join(" / ") }}</span>
            </div>
            <div v-if="richItem.labels?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.labels") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip v-for="label in richItem.labels" :key="label" base-color="cyan" label size="small">
                  {{ label }}
                </v-chip>
              </v-chip-group>
            </div>
            <div v-if="richItem.taglines?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.taglines") }}</v-label>
              <span class="text-body-small text-medium-emphasis font-italic">{{ richItem.taglines.join(" / ") }}</span>
            </div>
            <!-- 演职人员（调研 B12，二次拉取才有） -->
            <div v-if="isLoadingDetail" class="info-label">
              <v-progress-circular indeterminate size="16" width="2" />
              <span class="ml-2 text-body-small text-medium-emphasis">
                {{ t("MediaServerEntity.ItemInformationDialog.loadingDetail") }}
              </span>
            </div>
            <div v-else-if="richItem.people?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.people") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip v-for="person in richItem.people" :key="person.name + (person.role ?? '')" label size="small">
                  {{ person.name }}
                  <template v-if="person.role"> · {{ person.role }}</template>
                </v-chip>
              </v-chip-group>
            </div>
            <!-- 调研 B7：外部标识 → 站点搜索 -->

            <v-divider class="my-2" />

            <div class="d-flex w-100 align-center">
              <v-icon
                :icon="richItem.user?.IsPlayed ? 'mdi-check-bold' : 'mdi-radiobox-blank'"
                color="green"
                size="36"
              />
              <v-icon :icon="richItem.user?.IsFavorite ? 'mdi-heart' : 'mdi-heart-outline'" color="red" size="36" />
              <v-spacer />
              <v-btn
                :href="richItem.url"
                append-icon="mdi-arrow-top-right-bold-box-outline"
                class="visit-btn"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {{ t("common.visit") }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.info-label {
  display: flex;
  margin-top: 4px;

  :deep(.v-chip-group .v-chip) {
    margin-top: 0;
    margin-bottom: 0;
  }
}

/* 标签永不被压缩：否则「音轨 (1)」「字幕 (9)」的计数会被挤掉或折行藏起来 */
.info-label :deep(.v-label) {
  flex: 0 0 auto;
  white-space: nowrap;
}

/* 文件路径很长且不含空格：独占整行、按字符换行，避免撑破容器压到相邻行 */
.info-path {
  display: block;
  word-break: break-all;
  overflow-wrap: anywhere;
}

.visit-btn {
  width: calc(100% - 80px);
  margin-left: 8px;
}
</style>
