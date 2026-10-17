<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { EResultParseStatus, type IUserInfo, type TSiteID } from "@ptd/site";
import type { DataTableHeader } from "vuetify";

import { sendMessage } from "@/messages.ts";
import { downloadBlob, formatSize, formatDate } from "@/options/utils.ts";
import { useTableActionColumn } from "@/options/directives/useTableActionColumn.ts";
import { formatRatio } from "./utils/format.ts";
import { loadSiteHistoryData } from "./utils/lastUserData.ts";

import BonusFormatSpan from "./BonusFormatSpan.vue";
import SiteName from "@/options/components/SiteName.vue";
import NavButton from "@/options/components/NavButton.vue";

const showDialog = defineModel<boolean>();
const { siteId } = defineProps<{
  siteId: TSiteID | null;
}>();
const { t } = useI18n();

const currentDate = formatDate(+new Date(), "yyyy-MM-dd");
const jsonData = ref<any>({});

interface IShowUserInfo extends IUserInfo {
  date: string;
}

const siteHistoryData = shallowRef<IShowUserInfo[]>([]);
const tableHeader = computed(() =>
  useTableActionColumn([
    { title: t("common.date"), key: "date", align: "center" },
    { title: t("common.username"), key: "name", align: "center", sortable: false },
    { title: t("MyData.table.levelName"), key: "levelName", align: "start", sortable: false },
    { title: t("MyData.table.userData"), key: "uploaded", align: "end", sortable: false },
    { title: t("levelRequirement.ratio"), key: "ratio", align: "end", sortable: false },
    { title: t("levelRequirement.seeding"), key: "seeding", align: "end", sortable: false },
    { title: t("levelRequirement.seedingSize"), key: "seedingSize", align: "end", sortable: false },
    { title: t("levelRequirement.bonus"), key: "bonus", align: "end", sortable: false },
    { title: t("common.action"), key: "action", align: "center", width: 90, sortable: false },
  ] as DataTableHeader[]),
);
const tableSelected = ref<string[]>([]);

function deleteSiteUserInfo(date: string[]) {
  if (confirm(t("MyData.HistoryDataView.deleteConfirm"))) {
    sendMessage("removeSiteUserInfo", {
      siteId: siteId!,
      date: date.filter((d) => d != currentDate), // 不允许移除当天的数据
    }).then(() => {
      loadSiteHistoryData(siteId!).then((data) => {
        siteHistoryData.value = data;
        tableSelected.value = [];
      });
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
  void downloadBlob(exportedSolutionBlob, `site-history-data-${siteId}.json`); // FIXME filename
}

function afterEnter() {
  if (siteId) {
    loadSiteHistoryData(siteId!).then((data) => {
      siteHistoryData.value = data;
      tableSelected.value = [];
    });
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" width="1200" @after-enter="afterEnter" @after-leave="() => (siteHistoryData = [])">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>
            {{ t("MyData.HistoryDataView.title") }} @ <SiteName :site-id="siteId!" class="" tag="span" />
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
            <!-- Vuetify 4 的 v-container 自带 16px 内衬、v-row 默认 24px flex gap（相邻两个 v-row 还会再叠一条等宽的 margin-top），
                 故与 MyData/Index.vue 一致用 py-0 pr-0 + gap="0" 还原紧凑两行；v-icon 的 small 属性在 v4 已移除，需显式写 size="small" -->
            <v-container class="py-0 pr-0">
              <v-row gap="0" class="justify-end flex-nowrap">
                <span class="text-no-wrap">
                  {{ typeof item.uploaded !== "undefined" ? formatSize(item.uploaded) : "-" }}
                </span>
                <v-icon color="green-darken-4" icon="mdi-chevron-up" size="small"></v-icon>
              </v-row>
              <v-row gap="0" class="justify-end flex-nowrap">
                <span class="text-no-wrap">
                  {{ typeof item.downloaded !== "undefined" ? formatSize(item.downloaded) : "-" }}
                </span>
                <v-icon color="red-darken-4" icon="mdi-chevron-down" size="small"></v-icon>
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
            <!-- bonus/seedingBonus 允许是站点直接给出的非数字串（如 "N/A"，见 karagarga / seedpool 等定义），
                 formatNumber 会把它们渲染成 NaN，故与 MyData/Index.vue 一致改用 BonusFormatSpan 承载 -->
            <v-container class="py-0 pr-0">
              <v-row gap="0" class="align-center justify-end">
                <BonusFormatSpan v-if="item.bonus" :num="item.bonus" />
                <span v-else class="text-no-wrap">-</span>
              </v-row>
              <v-row gap="0" class="align-center justify-end">
                <BonusFormatSpan v-if="item.seedingBonus" :num="item.seedingBonus" />
                <span v-else class="text-no-wrap">-</span>
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
                :disabled="item.status == EResultParseStatus.success && item.date == currentDate"
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
            <NavButton color="info" icon="mdi-export" :text="t('common.export')" @click="exportSiteHistoryData" />
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
