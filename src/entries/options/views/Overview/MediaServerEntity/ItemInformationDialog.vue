<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatBitrate, IMediaServerItem } from "@ptd/mediaServer";
import { formatDate, formatSize } from "@/options/utils.ts";

const { t } = useI18n();

const showDialog = defineModel<boolean>();
const { item } = defineProps<{
  item: IMediaServerItem;
}>();

function streamsTextFactory(type: "Video" | "Audio" | "Subtitle") {
  return computed(() =>
    (item.streams ?? [])
      .filter((s) => s.type === type)
      .map((x) => x.title)
      .join(" / "),
  );
}

const showSteams = [
  { name: "Audio", icon: "mdi-expansion-card" },
  { name: "Subtitle", icon: "mdi-closed-caption" },
];

/** 画质摘要（调研 A2）：分辨率 · 编码(档次) · 色域 · 码率 · 帧率 */
const videoText = computed(() => {
  const video = item.mediaInfo?.video;
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
  if (item.user?.playCount) {
    parts.push(t("MediaServerEntity.ItemInformationDialog.playCountText", { count: item.user.playCount }));
  }
  if (typeof item.user?.playedPercentage === "number") {
    parts.push(`${item.user.playedPercentage}%`);
  }
  if (item.user?.lastPlayedDate) {
    parts.push(formatDate(new Date(item.user.lastPlayedDate).getTime()));
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
            <v-img :src="item.poster" :title="item.name" />
          </v-col>
          <v-col cols="12" sm="8">
            <a
              :href="item.url"
              :title="item.name"
              class="w-100 text-headline-small d-inline-block"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              {{ item.name }}
            </a>
            <p class="text-body-small">{{ item.description ?? "" }}</p>
            <div v-if="item.tags && item.tags.length > 0" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.type") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip
                  v-for="tag in item.tags ?? []"
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
            <div v-if="item.duration" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.duration") }}</v-label>
              <v-chip base-color="green" class="mr-1" label prepend-icon="mdi-clock-time-four" size="small">
                {{ secondsToISO8601(item.duration ?? 0) }}
              </v-chip>
            </div>
            <div v-if="item.size" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.size") }}</v-label>
              <v-chip base-color="deep-purple" class="mr-1" label prepend-icon="mdi-harddisk" size="small">
                {{ formatSize(item.size ?? 0) }}
              </v-chip>
            </div>
            <!-- 评分（调研 A1） -->
            <div v-if="typeof item.rating === 'number'" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.rating") }}</v-label>
              <v-chip base-color="amber" class="mr-1" label prepend-icon="mdi-star" size="small">
                {{ item.rating.toFixed(1) }}
              </v-chip>
            </div>
            <!-- 画质（调研 A2） -->
            <div v-if="videoText" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.video") }}</v-label>
              <v-chip base-color="blue" class="mr-1" label prepend-icon="mdi-movie-open" size="small">
                {{ videoText }}
              </v-chip>
            </div>
            <!-- 音轨（调研 A2） -->
            <div v-if="item.mediaInfo?.audio?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.audio") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip
                  v-for="(audio, idx) in item.mediaInfo.audio"
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
            <div v-if="item.mediaInfo?.subtitle?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.subtitle") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip
                  v-for="(subtitle, idx) in item.mediaInfo.subtitle"
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
            <div v-if="item.path" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.path") }}</v-label>
              <span class="text-body-small text-medium-emphasis" style="word-break: break-all">{{ item.path }}</span>
            </div>
            <!-- 入库时间（调研 A4） -->
            <div v-if="item.dateCreated" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.dateCreated") }}</v-label>
              <v-chip base-color="blue-grey" class="mr-1" label prepend-icon="mdi-calendar-plus" size="small">
                {{ formatDate(new Date(item.dateCreated).getTime()) }}
              </v-chip>
            </div>
            <!-- 外部链接（调研 A5） -->
            <div v-if="item.externalUrls?.length" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.externalUrls") }}</v-label>
              <v-btn
                v-for="externalUrl in item.externalUrls"
                :key="externalUrl.url"
                :href="externalUrl.url"
                class="mr-1"
                rel="noopener noreferrer nofollow"
                size="small"
                target="_blank"
                variant="tonal"
              >
                {{ externalUrl.name }}
              </v-btn>
            </div>
            <div v-if="item.streams && item.streams.length > 0" class="info-label">
              <v-label class="pr-3">{{ t("MediaServerEntity.ItemInformationDialog.mediaInfo") }}</v-label>
              <v-chip-group show-arrows>
                <v-chip v-if="item.format" base-color="blue" label prepend-icon="mdi-aspect-ratio" size="small">
                  {{ item.format?.toUpperCase() }}
                </v-chip>

                <v-chip
                  v-if="item.streams.filter((s) => s.type === 'Video')!.length > 0"
                  base-color="blue"
                  label
                  prepend-icon="mdi-movie"
                  size="small"
                >
                  {{ item.streams.filter((s) => s.type === "Video")[0].title }}
                </v-chip>

                <template v-for="showStream in showSteams" :key="showStream.name">
                  <v-menu v-if="item.streams.filter((s) => s.type === showStream.name)!.length > 0" open-on-hover>
                    <template #activator="{ props }">
                      <v-chip v-bind="props" :prepend-icon="showStream.icon" base-color="blue" label size="small">
                        {{ item.streams.filter((s) => s.type === showStream.name)!.length }}
                      </v-chip>
                    </template>

                    <v-card class="pl-2">
                      <v-chip-group direction="vertical">
                        <v-chip
                          v-for="stream in item.streams.filter((s) => s.type === showStream.name)"
                          :prepend-icon="showStream.icon"
                          label
                          size="small"
                        >
                          {{ stream.title }}
                        </v-chip>
                      </v-chip-group>
                    </v-card>
                  </v-menu>
                </template>
              </v-chip-group>
            </div>
            <v-divider class="my-2" />

            <div class="d-flex w-100 align-center">
              <v-icon :icon="item.user?.IsPlayed ? 'mdi-check-bold' : 'mdi-radiobox-blank'" color="green" size="36" />
              <v-icon :icon="item.user?.IsFavorite ? 'mdi-heart' : 'mdi-heart-outline'" color="red" size="36" />
              <v-spacer />
              <v-btn
                :href="item.url"
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

.visit-btn {
  width: calc(100% - 80px);
  margin-left: 8px;
}
</style>
