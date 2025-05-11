<script setup lang="ts">
import { computed } from "vue";
import { IMediaServerItem } from "@ptd/mediaServer";
import { formatSize } from "@/options/utils.ts";

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
          <v-toolbar-title> 媒体详情 </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row align="center">
          <v-col cols="8" offset="2" offset-sm="0" sm="4">
            <v-img :src="item.poster" :title="item.name" />
          </v-col>
          <v-col cols="12" sm="8">
            <a
              :href="item.url"
              :title="item.name"
              class="w-100 text-h6 d-inline-block"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              {{ item.name }}
            </a>
            <p class="text-caption">{{ item.description ?? "" }}</p>
            <div v-if="item.tags && item.tags.length > 0" class="info-label">
              <v-label class="pr-3">类型：</v-label>
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
              <v-label class="pr-3">时长：</v-label>
              <v-chip base-color="green" class="mr-1" label prepend-icon="mdi-clock-time-four" size="small">
                {{ secondsToISO8601(item.duration ?? 0) }}
              </v-chip>
            </div>
            <div v-if="item.size" class="info-label">
              <v-label class="pr-3">大小：</v-label>
              <v-chip base-color="deep-purple" class="mr-1" label prepend-icon="mdi-harddisk" size="small">
                {{ formatSize(item.size ?? 0) }}
              </v-chip>
            </div>
            <div v-if="item.streams && item.streams.length > 0" class="info-label">
              <v-label class="pr-3">媒体信息：</v-label>
              <v-chip-group>
                <v-chip
                  v-if="item.streams.filter((s) => s.type === 'Video')!.length > 0"
                  base-color="blue"
                  label
                  prepend-icon="mdi-movie"
                  size="small"
                >
                  {{ streamsTextFactory("Video") }}
                </v-chip>

                <v-chip
                  v-if="item.streams.filter((s) => s.type === 'Audio')!.length > 0"
                  base-color="blue"
                  label
                  prepend-icon="mdi-expansion-card"
                  size="small"
                >
                  {{ streamsTextFactory("Audio") }}
                </v-chip>

                <v-chip
                  v-if="item.streams.filter((s) => s.type === 'Subtitle')!.length > 0"
                  base-color="blue"
                  label
                  prepend-icon="mdi-closed-caption"
                  size="small"
                >
                  {{ streamsTextFactory("Subtitle") }}
                </v-chip>
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
                target="_blank"
                class="visit-btn"
                rel="noopener noreferrer nofollow"
              >
                访问
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
