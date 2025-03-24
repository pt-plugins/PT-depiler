<script setup lang="ts">
import { computed, ref } from "vue";
import { computedAsync } from "@vueuse/core";

import { useSiteStore } from "@/options/stores/site.ts";
import { useUIStore } from "@/options/stores/ui.ts";

import { getFixedRatio, flushSiteLastUserInfo } from "./utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import UserLevelRequirementsTd from "@/options/views/Overview/MyData/UserLevelRequirementsTd.vue";

import { TSiteID } from "@ptd/site";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatDate, formatNumber, formatSize } from "@/options/utils.ts";

const siteStore = useSiteStore();
const uiStore = useUIStore();
const runtimeStore = useRuntimeStore();

const fullTableHeader = [
  { title: "站点", key: "site", align: "center", width: 90, alwaysShow: true },
  { title: "用户名", key: "name", align: "center", width: 90, alwaysShow: true },
  { title: "等级", key: "levelName", align: "center", width: 90 },
  { title: "数据量", key: "uploaded", align: "right" },
  { title: "真实数据量", key: "trueUploaded", align: "right" }, // 默认不显示
  { title: "分享率", key: "ratio", align: "left" },
  { title: "发布数", key: "uploads", align: "left" },
  { title: "做种数", key: "seeding", align: "right" },
  { title: "做种体积", key: "seedingSize", align: "right" },
  { title: "魔力/积分", key: "bonus", align: "center" },
  { title: "入站时间", key: "joinTime", align: "center" },
  { title: "数据更新于", key: "updateAt", align: "center", alwaysShow: true },
  { title: "操作", key: "action", align: "center", width: 90, alwaysShow: true },
];

const tableHeader = computed(() => {
  return fullTableHeader.filter((item) => item.alwaysShow || uiStore.tableBehavior.MyData.columns!.includes(item.key));
});

const tableData = computedAsync(async () => {
  const allSite = siteStore.getAddedSiteIds;
  const allPrivateSiteUserInfoData = [];
  for (const site of allSite) {
    const siteMeta = await siteStore.getSiteMetadata(site);

    // 仅私有站点存在个人信息
    if (siteMeta?.type === "private") {
      const siteUserInfoData = siteStore.lastUserInfo[site] ?? { site: site };

      // 对 siteUserInfoData 进行一些预处理（不涉及渲染格式）
      let { uploaded = 0, downloaded = 0 } = siteUserInfoData;
      if (typeof siteUserInfoData.ratio === "undefined") {
        let ratio = -1;
        if (downloaded == 0 && uploaded > 0) {
          ratio = Infinity; // 没有下载量时设置分享率为无限
        } else if (downloaded > 0) {
          ratio = uploaded / downloaded;
        }
        siteUserInfoData.ratio = ratio;
      }

      allPrivateSiteUserInfoData.push(siteUserInfoData);
    }
  }

  return allPrivateSiteUserInfoData;
}, []);
const tableSelected = ref<TSiteID[]>([]); // 选中的站点行
</script>

<template>
  <v-alert type="info">
    <v-alert-title> 我的数据 </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          prepend-icon="mdi-cached"
          color="green"
          :disabled="runtimeStore.userInfo.isFlush || tableSelected.length === 0"
          @click="() => flushSiteLastUserInfo(tableSelected)"
          >刷新所选站点的数据
        </v-btn>

        <v-divider vertical class="mx-2" />

        <v-combobox
          multiple
          chips
          v-model="uiStore.tableBehavior.MyData.columns"
          :items="fullTableHeader.map((item) => item.key)"
          max-width="240"
          density="compact"
          hide-details
          class="table-header-filter-clear"
          prepend-inner-icon="mdi-filter-cog"
        >
          <template #chip="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ fullTableHeader.find((x) => x.key == item.title)?.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption">
              (+{{ uiStore.tableBehavior.MyData.columns!.length - 1 }} others)
            </span>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item>
              <v-checkbox
                v-model="uiStore.tableBehavior.MyData.columns"
                density="compact"
                hide-details
                :value="item.title"
                :disabled="fullTableHeader.find((x) => x.key == item.title)?.alwaysShow"
                :label="fullTableHeader.find((x) => x.key == item.title)?.title"
              ></v-checkbox>
            </v-list-item>
          </template>
        </v-combobox>
      </v-row>
    </v-card-title>
    <v-data-table v-model="tableSelected" :headers="tableHeader" :items="tableData" item-value="site" show-select>
      <!-- 站点信息 -->
      <template #item.site="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.site" :size="18" />
          <SiteName :site-id="item.site" />
        </div>
      </template>

      <!-- 用户名，用户ID -->
      <template #item.name="{ item }">
        <span :title="item.id" class="text-no-wrap">{{ item.name }}</span>
      </template>

      <!-- 等级信息，升级信息 -->
      <template #item.levelName="{ item }">
        <UserLevelRequirementsTd :user-info="item" />
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

      <!-- 真实上传、下载 -->
      <template #item.trueUploaded="{ item }">
        <v-container>
          <v-row justify="end">
            <span class="text-no-wrap">
              {{ item.trueUploaded ? formatSize(item.trueUploaded) : "-" }}
            </span>
            <v-icon small color="green-darken-4" icon="mdi-chevron-up"></v-icon>
          </v-row>
          <v-row justify="end">
            <span class="text-no-wrap">
              {{ item.trueDownloaded ? trueDownloaded(item.trueUploaded) : "-" }}
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

      <!-- 入站时间 -->
      <template #item.joinTime="{ item }">
        <span class="text-no-wrap">{{ item.joinTime ? formatDate(item.joinTime) : "-" }}</span>
      </template>

      <!-- 更新时间 -->
      <template #item.updateAt="{ item }">
        {{ formatDate(item.updateAt) }}
      </template>

      <!-- 操作 -->
      <template #item.action="{ item }">
        <v-btn
          icon="mdi-cached"
          color="green"
          size="small"
          variant="text"
          :loading="runtimeStore.userInfo.flushPlan[item.site]?.isFlush"
          :disabled="runtimeStore.userInfo.flushPlan[item.site]?.isFlush"
          @click="() => flushSiteLastUserInfo([item.site])"
        ></v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss"></style>
