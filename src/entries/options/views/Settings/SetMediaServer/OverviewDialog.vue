<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { formatBitrate, type IMediaServerOverview, type IMediaServerOverviewEntry } from "@ptd/mediaServer";
import { formatDate, formatSize } from "@/options/utils.ts";
import { sendMessage } from "@/messages.ts";
import type { TMediaServerKey } from "@/shared/types.ts";

const { t } = useI18n();

const showDialog = defineModel<boolean>();
const { mediaServerId, mediaServerName } = defineProps<{
  mediaServerId: TMediaServerKey;
  mediaServerName?: string;
}>();

const overview = ref<IMediaServerOverview | null>(null);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");
/** 整库遍历有被封号的风险，必须先由用户显式确认（每次打开都要确认） */
const confirmed = ref<boolean>(false);

/**
 * 调研 C14 / C20：**默认不获取** —— 打开弹窗先给出风险提示，用户确认后才开始。
 * 整库遍历与聚合都在 offscreen 侧完成（几千条条目不会跨消息边界搬过来）。
 */
async function generate() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const result = await sendMessage("getMediaServerOverview", { mediaServerId });
    overview.value = result;
    if (!result) {
      errorMessage.value = t("SetMediaServer.Overview.unsupported");
    }
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : String(e);
  } finally {
    isLoading.value = false;
  }
}

function confirmAndGenerate() {
  confirmed.value = true;
  void generate();
}

watch(showDialog, (opened) => {
  if (opened) {
    // 每次打开都重新走一遍风险提示：整库遍历是高风险操作，不做「不再提示」
    overview.value = null;
    confirmed.value = false;
  }
});

/** 分布条按最大项归一化 */
const barWidth = (entry: IMediaServerOverviewEntry) => {
  const max = Math.max(1, ...(overview.value?.byResolution ?? []).map((e) => e.size), overview.value?.totalSize ?? 1);
  return `${Math.max(2, Math.round((entry.size / max) * 100))}%`;
};

const keyLabel = (key: string) => (key === "-" ? t("SetMediaServer.Overview.unknownKey") : key);
</script>

<template>
  <v-dialog v-model="showDialog" max-width="900" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>
            {{ t("SetMediaServer.Overview.title") }}
            <span v-if="mediaServerName" class="text-body-medium">· {{ mediaServerName }}</span>
          </v-toolbar-title>
          <template #append>
            <v-btn
              :disabled="isLoading || !confirmed"
              icon="mdi-refresh"
              :title="t('SetMediaServer.Overview.regenerate')"
              @click="generate"
            />
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <!-- 风险提示：绝大多数公开媒体服务器不允许整库遍历，必须先确认（用户要求） -->
        <template v-if="!confirmed">
          <v-alert type="warning" variant="tonal">
            <template #title>
              <span class="text-body-large font-weight-bold">
                {{ t("SetMediaServer.Overview.warningTitle") }}
              </span>
            </template>
            <p class="mt-2">{{ t("SetMediaServer.Overview.warningLine1") }}</p>
            <p class="mt-2">{{ t("SetMediaServer.Overview.warningLine2") }}</p>
            <p class="mt-2 text-medium-emphasis">{{ t("SetMediaServer.Overview.warningLine3") }}</p>
          </v-alert>

          <div class="d-flex justify-end mt-4">
            <v-btn class="mr-2" variant="text" @click="showDialog = false">
              {{ t("SetMediaServer.Overview.warningCancel") }}
            </v-btn>
            <v-btn
              color="warning"
              prepend-icon="mdi-alert-outline"
              variant="flat"
              @click="confirmAndGenerate"
              :loading="isLoading"
            >
              {{ t("SetMediaServer.Overview.warningConfirm") }}
            </v-btn>
          </div>
        </template>

        <div v-else-if="isLoading" class="d-flex flex-column align-center py-8">
          <v-progress-circular indeterminate size="48" />
          <div class="mt-4 text-body-medium">{{ t("SetMediaServer.Overview.generating") }}</div>
          <div class="mt-1 text-caption text-medium-emphasis">{{ t("SetMediaServer.Overview.hint") }}</div>
        </div>

        <v-alert v-else-if="errorMessage" type="warning" variant="tonal">{{ errorMessage }}</v-alert>

        <template v-else-if="overview">
          <v-alert v-if="overview.truncated" class="mb-3" density="compact" type="info" variant="tonal">
            {{ t("SetMediaServer.Overview.truncated", { count: overview.totalItems }) }}
          </v-alert>

          <!-- 概览数字（C20） -->
          <v-row dense>
            <v-col cols="6" sm="3">
              <v-card variant="tonal">
                <v-card-text class="text-center">
                  <div class="text-h6">{{ overview.totalItems }}</div>
                  <div class="text-caption">{{ t("SetMediaServer.Overview.totalItems") }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card variant="tonal">
                <v-card-text class="text-center">
                  <div class="text-h6">{{ formatSize(overview.totalSize) }}</div>
                  <div class="text-caption">{{ t("SetMediaServer.Overview.totalSize") }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card variant="tonal">
                <v-card-text class="text-center">
                  <div class="text-h6">{{ formatBitrate(overview.averageBitrate) ?? "-" }}</div>
                  <div class="text-caption">{{ t("SetMediaServer.Overview.averageBitrate") }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card variant="tonal">
                <v-card-text class="text-center">
                  <div class="text-h6">
                    {{
                      overview.playsPerGb === undefined
                        ? "-"
                        : t("SetMediaServer.Overview.playsPerGbValue", { value: overview.playsPerGb })
                    }}
                  </div>
                  <div class="text-caption">{{ t("SetMediaServer.Overview.playsPerGb") }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- 观看情况（C14 / C20） -->
          <div class="text-subtitle-2 mt-4 mb-1">{{ t("SetMediaServer.Overview.watch") }}</div>
          <v-chip-group>
            <v-chip color="success" label size="small">
              {{ t("SetMediaServer.Overview.watched") }} {{ overview.watch.watched }}
            </v-chip>
            <v-chip color="warning" label size="small">
              {{ t("SetMediaServer.Overview.partial") }} {{ overview.watch.partial }}
            </v-chip>
            <v-chip color="grey" label size="small">
              {{ t("SetMediaServer.Overview.unwatched") }} {{ overview.watch.unwatched }}
            </v-chip>
            <v-chip color="info" label size="small">
              {{ t("SetMediaServer.Overview.totalPlays") }} {{ overview.watch.totalPlays }}
            </v-chip>
          </v-chip-group>

          <!-- 分布（C20） -->
          <template
            v-for="dist in [
              { title: 'byResolution', list: overview.byResolution },
              { title: 'byCodec', list: overview.byCodec },
              { title: 'byContainer', list: overview.byContainer },
              { title: 'byRootPath', list: overview.byRootPath },
            ]"
            :key="dist.title"
          >
            <div v-if="dist.list.length > 0" class="mt-4">
              <div class="text-subtitle-2 mb-1">{{ t(`SetMediaServer.Overview.${dist.title}`) }}</div>
              <div v-for="entry in dist.list" :key="entry.key" class="mb-1">
                <div class="d-flex justify-space-between text-caption">
                  <span>{{ keyLabel(entry.key) }}</span>
                  <span class="text-medium-emphasis">
                    {{ t("SetMediaServer.Overview.countUnit", { count: entry.count }) }} ·
                    {{ formatSize(entry.size) }}
                  </span>
                </div>
                <v-progress-linear :model-value="parseFloat(barWidth(entry))" color="primary" height="6" rounded />
              </div>
            </div>
          </template>

          <!-- 占空间但从未观看（C14） -->
          <template v-if="overview.neverWatched.length > 0">
            <div class="text-subtitle-2 mt-4 mb-1">{{ t("SetMediaServer.Overview.neverWatched") }}</div>
            <v-table density="compact">
              <tbody>
                <tr v-for="entry in overview.neverWatched" :key="entry.name">
                  <td>{{ entry.name }}</td>
                  <td class="text-right text-no-wrap">
                    <span v-if="entry.productionYear" class="text-medium-emphasis mr-2">{{
                      entry.productionYear
                    }}</span>
                    {{ formatSize(entry.size) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </template>

          <!-- 最近 7 天入库（C20） -->
          <template v-if="overview.recentlyAdded.length > 0">
            <div class="text-subtitle-2 mt-4 mb-1">{{ t("SetMediaServer.Overview.recentlyAdded") }}</div>
            <v-table density="compact">
              <tbody>
                <tr v-for="entry in overview.recentlyAdded" :key="entry.name + (entry.dateCreated ?? '')">
                  <td>{{ entry.name }}</td>
                  <td class="text-right text-no-wrap text-medium-emphasis">
                    {{ entry.dateCreated ? formatDate(new Date(entry.dateCreated).getTime()) : "-" }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </template>

          <div class="mt-4 text-caption text-medium-emphasis">
            {{ t("SetMediaServer.Overview.generatedAt", { time: formatDate(overview.generatedAt) }) }}
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
