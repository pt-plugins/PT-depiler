<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { EResultParseStatus, type IUserInfo, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { fixUserInfo, formatRatio } from "./utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import { formatNumber, formatSize, formatDate } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();
const props = defineProps<{
  siteId: TSiteID | null;
}>();
const { t } = useI18n();

const currentDate = formatDate(+new Date(), "yyyy-MM-dd");
const jsonData = ref<any>({});

interface IShowUserInfo extends IUserInfo {
  date: string;
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
];

function loadSiteHistoryData(siteId: TSiteID) {
  sendMessage("getSiteUserInfo", siteId).then((data) => {
    const retData = [];

    for (const [date, item] of Object.entries(data)) {
      retData.push({ ...fixUserInfo(item), date });
    }

    siteHistoryData.value = retData;
  });
}

function deleteSiteUserInfo(date: string) {
  if (confirm(t("MyData.HistoryDataView.deleteConfirm"))) {
    sendMessage("removeSiteUserInfo", { siteId: props.siteId!, date }).then(() => {
      loadSiteHistoryData(props.siteId!);
    });
  }
}

const showStoreDataDialog = ref<boolean>(false);
function viewStoreData(data: IShowUserInfo) {
  jsonData.value = data;
  showStoreDataDialog.value = true;
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
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>
            {{ t("MyData.HistoryDataView.title") }} @ <SiteName :site-id="props.siteId!" class="" tag="span" />
          </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-data-table
          :headers="tableHeader"
          :items="siteHistoryData"
          :sort-by="[{ key: 'date', order: 'desc' }]"
          class="table-stripe"
          items-per-page="10"
        >
          <!-- -->
          <template #item.date="{ item }">
            <span class="text-no-wrap">{{ item.date }}</span>
          </template>

          <!-- 用户名，用户ID -->
          <template #item.name="{ item }">
            <span :title="item.id" class="text-no-wrap">{{ item.name ?? "-" }}</span>
          </template>

          <!-- 等级 -->
          <template #item.levelName="{ item }">
            <span class="text-no-wrap">{{ item.levelName ?? "-" }}</span>
          </template>

          <!-- 上传、下载 -->
          <template #item.uploaded="{ item }">
            <v-container>
              <v-row justify="end">
                <span class="text-no-wrap">
                  {{ typeof item.uploaded !== "undefined" ? formatSize(item.uploaded) : "-" }}
                </span>
                <v-icon color="green-darken-4" icon="mdi-chevron-up" small></v-icon>
              </v-row>
              <v-row justify="end">
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

          <!-- 做种体积 -->
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
                :disabled="item.status == EResultParseStatus.success && item.date == currentDate"
                :title="t('common.remove')"
                color="error"
                icon="mdi-delete"
                size="small"
                @click="() => deleteSiteUserInfo(item.date)"
              ></v-btn>
            </v-btn-group>
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
