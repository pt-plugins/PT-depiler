<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { useSiteStore } from "@/options/stores/site.ts";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import { filesize } from "filesize";
import { getFixedRatio } from "./utils.ts";
import { format } from "date-fns";

const siteStore = useSiteStore();

const fullTableHeader = [
  { title: "站点", key: "site", align: "center", width: 90, alwaysShow: true },
  { title: "用户名", key: "name", align: "center", width: 90, alwaysShow: true },
  { title: "等级", key: "levelName", align: "center", width: 90 },
  { title: "数据量", key: "uploaded", align: "right" },
  { title: "分享率", key: "ratio", align: "left" },
  { title: "发布数", key: "uploads", align: "left" },
  { title: "做种数", key: "seeding", align: "right" },
  { title: "做种体积", key: "seedingSize", align: "right" },
  { title: "魔力/积分", key: "bonus", align: "center" },
  { title: "入站时间", key: "joinTime", align: "center" },
  { title: "数据更新于", key: "updateAt", align: "center" },
  { title: "操作", key: "action", align: "center", width: 90 },
];
const tableData = computedAsync(async () => {
  const allSite = siteStore.getAddedSiteIds;
  const allPrivateSiteUserInfoData = [];
  for (const site of allSite) {
    const siteMeta = await siteStore.getSiteMetadata(site);
    if (siteMeta?.type === "private") {
      const siteUserInfoData = siteStore.lastUserInfo[site] ?? { site: site };

      allPrivateSiteUserInfoData.push(siteUserInfoData);
    }
  }

  return allPrivateSiteUserInfoData;
}, []);
</script>

<template>
  <v-alert type="info">
    <v-alert-title> 我的数据 </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-btn>刷新选择站点数据</v-btn>
    </v-card-title>
    <v-data-table :headers="fullTableHeader" :items="tableData" show-select>
      <!-- 站点信息 -->
      <template #item.site="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.site" :size="18" />
          <SiteName :site-id="item.site" />
        </div>
      </template>

      <!-- 用户名，用户ID -->
      <template #item.name="{ item }">
        <span :title="item.id">{{ item.name }}</span>
      </template>

      <!-- 上传、下载 -->
      <template #item.uploaded="{ item }">
        <v-container>
          <v-row justify="end">
            {{ item.uploaded ? filesize(item.uploaded) : "-" }}
            <v-icon small color="green-darken-4" icon="mdi-chevron-up"></v-icon>
          </v-row>
          <v-row justify="end">
            {{ item.downloaded ? filesize(item.downloaded) : "-" }}
            <v-icon small color="red-darken-4" icon="mdi-chevron-down"></v-icon>
          </v-row>
        </v-container>
      </template>

      <!-- 分享率 -->
      <template #item.ratio="{ item }">
        {{ getFixedRatio(item) }}
      </template>

      <!-- 发布数 -->
      <template #item.uploads="{ item }">
        {{ item.uploads ?? "-" }}
      </template>

      <!-- 做种数 -->
      <template #item.seeding="{ item }">
        {{ item.seeding ?? "-" }}
      </template>

      <!-- 做种体积 -->
      <template #item.seedingSize="{ item }">
        {{ item.seedingSize ? filesize(item.seedingSize) : "-" }}
      </template>

      <!-- 魔力/积分 -->
      <template #item.bonus="{ item }">
        {{ item.bonus ?? "-" }}
      </template>

      <!-- 入站时间 -->
      <template #item.joinTime="{ item }">
        {{ item.joinTime ? format(item.joinTime, "yyyy-MM-dd HH:mm") : "-" }}
      </template>

      <!-- -->
      <template #item.updateAt="{ item }">
        {{ format(item.updateAt, "yyyy-MM-dd HH:mm") }}
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss"></style>
