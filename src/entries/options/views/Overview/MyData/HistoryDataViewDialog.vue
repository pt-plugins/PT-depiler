<script setup lang="ts">
import { ref, watch } from "vue";
import { type IUserInfo, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { fixUserInfo, getFixedRatio } from "./utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import { formatNumber, formatSize } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();
const props = defineProps<{
  siteId: TSiteID | null;
}>();

const siteHistoryData = ref<Array<IUserInfo & { date: string }>>([]);
const tableHeader = [
  { title: "日期", key: "date", align: "center" },
  { title: "用户名", key: "name", align: "center" },
  { title: "等级", key: "levelName", align: "start" },
  { title: "数据量", key: "uploaded", align: "end" },
  { title: "分享率", key: "ratio", align: "end" },
  { title: "做种数", key: "seeding", align: "end" },
  { title: "做种体积", key: "seedingSize", align: "end" },
  { title: "魔力/积分", key: "bonus", align: "end" },
  { title: "操作", key: "action", align: "center", width: 90, sortable: false },
];

function loadSiteHistoryData(siteId: TSiteID) {
  sendMessage("getSiteUserInfo", siteId).then((data) => {
    const retData = [];

    for (const [date, item] of Object.entries(data)) {
      retData.push({ ...fixUserInfo(item), date });
    }

    siteHistoryData.value = retData.sort((a, b) => b.date.localeCompare(a.date));
  });
}

watch(showDialog, () => {
  if (showDialog.value === true && props.siteId) {
    loadSiteHistoryData(props.siteId);
  }
});

function deleteSiteUserInfo(date: string) {
  if (confirm("确定删除该条记录吗？")) {
    sendMessage("removeSiteUserInfo", { siteId: props.siteId, date }).then(() => {
      loadSiteHistoryData(props.siteId);
    });
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" width="1200">
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 用户数据@<SiteName :site-id="props.siteId" class="" /> </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-data-table :headers="tableHeader" :items="siteHistoryData" :items-per-page="25">
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
                  {{ item.uploaded ? formatSize(item.uploaded) : "-" }}
                </span>
                <v-icon small color="green-darken-4" icon="mdi-chevron-up"></v-icon>
              </v-row>
              <v-row justify="end">
                <span class="text-no-wrap">
                  {{ item.downloaded ? formatSize(item.downloaded) : "-" }}
                </span>
                <v-icon small color="red-darken-4" icon="mdi-chevron-down"></v-icon>
              </v-row>
            </v-container>
          </template>

          <!-- 分享率 -->
          <template #item.ratio="{ item }">
            <span class="text-no-wrap">{{ getFixedRatio(item) }}</span>
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
            <span class="text-no-wrap">{{ item.seedingSize ? formatSize(item.seedingSize) : "-" }}</span>
          </template>

          <!-- 魔力/积分 -->
          <template #item.bonus="{ item }">
            <span class="text-no-wrap">{{ item.bonus ? formatNumber(item.bonus) : "-" }}</span>
          </template>

          <!-- 操作 -->
          <template #item.action="{ item }">
            <v-btn-group variant="text">
              <v-btn icon="mdi-delete" color="red" size="small" @click="() => deleteSiteUserInfo(item.date)"></v-btn>
            </v-btn-group>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
