<script setup lang="ts">
import { ref, shallowRef, computed } from "vue";
import { useI18n } from "vue-i18n";
import { saveAs } from "file-saver";
import { EResultParseStatus, type IUserInfo, type TSiteID } from "@ptd/site";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { sendMessage } from "@/messages.ts";
import { formatNumber, formatSize, formatDate } from "@/options/utils.ts";
import { fixUserInfo, formatRatio } from "./utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SiteName from "@/options/components/SiteName.vue";
import NavButton from "@/options/components/NavButton.vue";

const showDialog = defineModel<boolean>();
const props = defineProps<{
  siteId: TSiteID | null;
}>();
const { t } = useI18n();
const metadataStore = useMetadataStore();

const currentDate = formatDate(+new Date(), "yyyy-MM-dd");
const jsonData = ref<any>({});

interface IShowUserInfo extends IUserInfo {
  date: string;
}

// 获取站点是否离线
const isSiteOffline = computed(() => {
  if (!props.siteId) return false;
  return metadataStore.sites[props.siteId]?.isOffline ?? false;
});

// 判断数据是否是错误的（站点关闭后通常都是0）
function isDataErroneous(userInfo: IShowUserInfo): boolean {
  // 检查关键字段是否都是0或未定义
  const uploaded = userInfo.uploaded ?? 0;
  const downloaded = userInfo.downloaded ?? 0;
  const seeding = userInfo.seeding ?? 0;
  const seedingSize = userInfo.seedingSize ?? 0;
  const bonus = userInfo.bonus ?? 0;
  
  // 如果所有关键数据都是0，认为是错误数据
  return uploaded === 0 && downloaded === 0 && seeding === 0 && seedingSize === 0 && bonus === 0;
}

// 判断是否可以删除当天的数据
function canDeleteTodayData(item: IShowUserInfo): boolean {
  // 如果站点已离线且数据是错误的，允许删除
  if (isSiteOffline.value && item.date === currentDate && isDataErroneous(item)) {
    return true;
  }
  // 其他情况：不是当天数据，或者不是成功状态，或者不是当天
  return item.date !== currentDate || item.status !== EResultParseStatus.success;
}

const siteHistoryData = shallowRef<IShowUserInfo[]>([]);
const tableHeader = [
  { title: t("common.date"), key: "date", align: "center" },
  { title: t("MyData.table.username"), key: "name", align: "center", sortable: false },
  { title: t("MyData.table.levelName"), key: "levelName", align: "start", sortable: false },
  { title: t("MyData.table.userData"), key: "uploaded", align: "end", sortable: false },
  { title: t("levelRequirement.ratio"), key: "ratio", align: "end", sortable: false },
  { title: t("levelRequirement.seeding"), key: "seeding", align: "end", sortable: false },
  { title: t("levelRequirement.seedingSize"), key: "seedingSize", align: "end", sortable: false },
  { title: t("levelRequirement.bonus"), key: "bonus", align: "end", sortable: false },
  { title: t("common.action"), key: "action", align: "center", width: 90, sortable: false },
] as DataTableHeader[];
const tableSelected = ref<string[]>([]);

function loadSiteHistoryData(siteId: TSiteID) {
  sendMessage("getSiteUserInfo", siteId).then((data) => {
    const retData = [];

    for (const [date, item] of Object.entries(data)) {
      retData.push({ ...fixUserInfo(item), date });
    }

    siteHistoryData.value = retData;
  });
}

function deleteSiteUserInfo(date: string[]) {
  if (confirm(t("MyData.HistoryDataView.deleteConfirm"))) {
    // 过滤掉当天数据，但如果站点已离线且当天数据是错误的，允许删除
    const filteredDates = date.filter((d) => {
      if (d === currentDate) {
        // 如果是当天数据，检查是否可以删除
        const todayItem = siteHistoryData.value.find((item) => item.date === d);
        if (todayItem && canDeleteTodayData(todayItem)) {
          return true; // 允许删除
        }
        return false; // 不允许删除
      }
      return true; // 非当天数据可以删除
    });
    
    sendMessage("removeSiteUserInfo", {
      siteId: props.siteId!,
      date: filteredDates,
    }).then(() => {
      loadSiteHistoryData(props.siteId!);
    });
  }
}

const showStoreDataDialog = ref<boolean>(false);
function viewStoreData(data: IShowUserInfo) {
  jsonData.value = data;
  showStoreDataDialog.value = true;
}

function exportSiteHistoryData() {
  let exportData = siteHistoryData.value;
  if (tableSelected.value.length > 0) {
    exportData = siteHistoryData.value.filter((item) => tableSelected.value.includes(item.date));
  }

  const exportedSolutionBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  saveAs(exportedSolutionBlob, `site-history-data-${props.siteId}.json`); // FIXME filename
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    width="1200"
    @after-enter="() => props.siteId && loadSiteHistoryData(props.siteId!)"
    @after-leave="() => (siteHistoryData = [])"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>
            {{ t("MyData.HistoryDataView.title") }} @ <SiteName :site-id="props.siteId!" class="" tag="span" />
          </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-data-table
          v-model="tableSelected"
          :headers="tableHeader"
          :items="siteHistoryData"
          :sort-by="[{ key: 'date', order: 'desc' }]"
          class="table-stripe"
          hover
          item-selectable="_selectable"
          item-value="date"
          items-per-page="10"
          show-select
        >
          <!-- -->
          <template #item.date="{ item }">
            <span class="text-no-wrap">{{ item.date }}</span>
          </template>

          <!-- 用户名，用户ID -->
          <template #item.name="{ item }">
            <span :title="item.id as string" class="text-no-wrap">{{ item.name ?? "-" }}</span>
          </template>

          <!-- 等级 -->
          <template #item.levelName="{ item }">
            <span class="text-no-wrap">{{ item.levelName ?? "-" }}</span>
          </template>

          <!-- 上传、下载 -->
          <template #item.uploaded="{ item }">
            <v-container>
              <v-row class="flex-nowrap" justify="end">
                <span class="text-no-wrap">
                  {{ typeof item.uploaded !== "undefined" ? formatSize(item.uploaded) : "-" }}
                </span>
                <v-icon color="green-darken-4" icon="mdi-chevron-up" small></v-icon>
              </v-row>
              <v-row class="flex-nowrap" justify="end">
                <span class="text-no-wrap">
                  {{ typeof item.downloaded !== "undefined" ? formatSize(item.downloaded) : "-" }}
                </span>
                <v-icon color="red-darken-4" icon="mdi-chevron-down" small></v-icon>
              </v-row>
            </v-container>
          </template>

          <!-- 分享率 -->
          <template #item.ratio="{ item }">
            <span class="text-no-wrap">{{ formatRatio(item) }}</span>
          </template>

          <!-- 发布数 -->
          <template #item.uploads="{ item }">
            <span class="text-no-wrap">{{ item.uploads ?? "-" }}</span>
          </template>

          <!-- 做种数 -->
          <template #item.seeding="{ item }">
            <span class="text-no-wrap">{{ item.seeding ?? "-" }}</span>
          </template>

          <!-- 做种量 -->
          <template #item.seedingSize="{ item }">
            <span class="text-no-wrap">
              {{ typeof item.seedingSize !== "undefined" ? formatSize(item.seedingSize) : "-" }}
            </span>
          </template>

          <!-- 魔力/积分 -->
          <template #item.bonus="{ item }">
            <v-container>
              <v-row justify="end" align="center">
                <span class="text-no-wrap">{{ item.bonus ? formatNumber(item.bonus) : "-" }}</span>
              </v-row>
              <v-row justify="end" align="center">
                <span class="text-no-wrap">{{ item.seedingBonus ? formatNumber(item.seedingBonus) : "-" }}</span>
              </v-row>
            </v-container>
          </template>

          <!-- 操作 -->
          <template #item.action="{ item }">
            <v-btn-group variant="text">
              <!-- 查看原始记录 -->
              <v-btn
                :title="t('MyData.HistoryDataView.action.viewRaw')"
                icon="mdi-eye"
                size="small"
                @click="() => viewStoreData(item)"
              ></v-btn>

              <!-- 删除 -->
              <v-btn
                :disabled="!canDeleteTodayData(item)"
                :title="t('common.remove')"
                color="error"
                icon="mdi-delete"
                size="small"
                @click="() => deleteSiteUserInfo([item.date])"
              ></v-btn>
            </v-btn-group>
          </template>

          <template #footer.prepend>
            <NavButton
              :disabled="tableSelected.length <= 0"
              color="error"
              icon="mdi-delete"
              :text="t('common.remove')"
              @click="deleteSiteUserInfo(tableSelected)"
            />
            <NavButton color="info" icon="mdi-export" text="导出" @click="exportSiteHistoryData" />
            <v-spacer />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showStoreDataDialog" width="800">
      <v-card>
        <v-card-text>
          <pre> {{ JSON.stringify(jsonData, null, 2) }}</pre>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
