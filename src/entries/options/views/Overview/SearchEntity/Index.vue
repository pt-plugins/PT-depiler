<script setup lang="ts">
import { watch } from "vue";
import dayjs from "dayjs";
import { filesize } from "filesize";
import { useRoute } from "vue-router";

import { ESearchResultParseStatus } from "@ptd/site";
import { initialSearchData, searchData } from "@/shared/store/runtime.ts";
import { getSiteFavicon, getSiteInstance } from "@/shared/adapters/site.ts";
import { ISearchTorrent, useSiteStore } from "@/shared/store/site.ts";

import TorrentProgress from "./TorrentProgress.vue";

const route = useRoute();
const siteStore = useSiteStore();

export interface ISearchShowTorrent extends ISearchTorrent {
  siteName: string;
  siteUrl: string;
  siteFavicon: string;
}

async function doSearch(flush: boolean = true) {
  if (flush) {
    searchData.value = initialSearchData();
  }

  // 设置搜索初始值
  searchData.value.isSearching = true;
  searchData.value.startAt = Date.now();
  searchData.value.searchKey = (route.query.search as string) || "";
  searchData.value.searchPlanKey = (route.query.plan as string) || "default";
  const searchPlan = (searchData.value.searchPlan = siteStore.getSolutionPlan(
    searchData.value.searchPlanKey,
  )); // 展开searchPlanKey对应的搜索方案

  // TODO 增加p-queue作为前台控制（后台不做控制）

  for (const plan of searchPlan.plan) {
    // TODO 此处步骤全部移入offscreen运行
    const site = await getSiteInstance(plan.site);
    const siteName = site.config.name;
    const siteUrl = site.activateUrl;
    const siteFavicon = await getSiteFavicon(plan.site);

    const v = await site.searchTorrents({
      keywords: searchData.value.searchKey,
      extraParams: Object.entries(plan.filters).map((x) => ({
        key: x[0],
        value: x[1],
      })),
    });

    // 为搜索plan结果增加站点属性字段
    const sv = v.data.map((torrent) => {
      (torrent as ISearchShowTorrent).plan = plan.id;
      (torrent as ISearchShowTorrent).siteName = siteName;
      (torrent as ISearchShowTorrent).siteFavicon = siteFavicon;
      (torrent as ISearchShowTorrent).siteUrl = siteUrl;
      return torrent;
    }) as ISearchTorrent[];

    // TODO 将offscreen运行的返回值更新到searchData中
    searchData.value.searchPlanStatus[plan.id] = v.status;
    if (v.status === ESearchResultParseStatus.success) {
      searchData.value.searchResult.push(...sv);
    }
  }

  searchData.value.isSearching = false;
  searchData.value.costTime = Date.now() - searchData.value.startAt;
}

console.log(searchData);

const tableHeader = [
  {
    title: "站点",
    key: "site",
    align: "center",
  },
  {
    title: "名称",
    key: "title",
    align: "start",
  },
  {
    title: "分类/入口",
    key: "category",
    align: "center",
    width: 150,
  },
  {
    title: "大小",
    key: "size",
    align: "end",
    width: 100,
  },
  {
    title: "上传",
    key: "seeders",
    align: "center",
    width: 60,
  },
  {
    title: "下载",
    key: "leechers",
    align: "center",
    width: 60,
  },
  {
    title: "完成",
    key: "completed",
    align: "center",
    width: 60,
  },
  {
    title: "评论",
    key: "comments",
    align: "center",
    width: 60,
  },
  {
    title: "发布时间(~)",
    key: "time",
    align: "center",
    width: 130,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
  },
];

watch(
  () => route.query,
  (newParams, oldParams) => {
    console.log("search", newParams, oldParams);

    if (newParams.snapshot) {
      // TODO 处理搜索快照
    } else if (
      newParams.search != oldParams.search ||
      newParams.plan != oldParams.plan
    ) {
      doSearch();
    }
  },
);
</script>

<template>
  <v-alert type="info">
    <v-alert-title>
      搜索结果 {{ searchData.searchKey }} 的
      <!-- TODO 搜索结果情况概况展示（部分搜索条目重试按钮） -->
      <!-- TODO 全局重新搜索按钮 -->
    </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <!-- 创建快照（非快照情况下） -->

      <!-- 高级选项 -->

      <!-- TODO 筛选功能 -->
    </v-card-title>

    <v-data-table
      :items="searchData.searchResult"
      :headers="tableHeader"
      :per-page="100"
      show-select
      multi-sort
      :sort-by="[{ key: 'time', order: 'desc' }]"
    >
      <!-- 站点 -->
      <template #item.site="{ item }">
        <v-avatar :image="item.siteFavicon" size="18" />
        <a
          :href="item.siteUrl"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="captionText"
          >{{ item.siteName }}</a
        >
      </template>

      <!-- 标题，副标题（如有），标签（如有），| ， -->
      <template #item.title="{ item }">
        <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="text-body-1 font-weight-medium"
          >{{ item.title }}</a
        >

        <div v-if="(item.tags && item.tags.length) || item.subTitle">
          <span class="mr-1" v-if="item.tags && item.tags.length">
            <span
              v-for="(tag, index) in item.tags"
              :key="index"
              class="tag"
              :title="tag.name"
              :style="{
                'background-color': `${tag.color}`,
                'border-color': `${tag.color}`,
              }"
              >{{ tag.name }}</span
            >
          </span>

          <span v-if="item.subTitle" :title="item.subTitle">{{ item.subTitle }}</span>
        </div>
      </template>

      <!-- 分类 -->
      <template #item.category="{ item }">{{ item.category }}</template>

      <!-- 大小，下载进度（如有） -->
      <template #item.size="{ item }">
        {{ filesize(item.size, { base: 2 }) }}
        <TorrentProgress v-if="item.progress && item.status" :torrent="item" />
      </template>

      <!-- 上传数（不需要自定义template） -->
      <!-- 下载数（不需要自定义template） -->
      <!-- 完成数（不需要自定义template） -->
      <!-- 评论数（不需要自定义template） -->
      <!-- 上传时间 -->
      <template #item.time="{ item }">{{
        dayjs(item.time).format("YYYY-MM-DD HH:mm")
      }}</template>

      <!-- 操作 -->
      <template #item.action="{ item }">
        <!-- 下载到 -->
        <!-- 下载种子文件 -->
        <!-- 复制下载链接 -->
        <!-- 收藏 -->
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
a,
:deep(a) {
  color: black;
  text-decoration: none;
}

.captionText {
  color: #aaaaaa;
}

.tag {
  margin: 0 1px;
  border-radius: 2px;
  color: #fff;
  padding: 1px 3px;
}
</style>
