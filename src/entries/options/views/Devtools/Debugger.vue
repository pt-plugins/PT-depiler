<script setup lang="ts">
import { ref } from "vue";
import {
  definitionList,
  getDefinedSiteMetadata,
  getFavicon,
  getSite as createSiteInstance,
  type TSiteID,
} from "@ptd/site";
import { getDownloader } from "@ptd/downloader";
import type { TDownloaderKey, TMediaServerKey } from "@/shared/storages/types/metadata.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import { sendMessage } from "@/messages.ts";
import * as estoolkit from "es-toolkit";
import axios from "axios";
import Sizzle from "sizzle";
import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";
import { getMediaServer } from "@ptd/mediaServer";

setupReplaceUnsafeHeader(axios);

function enableLibrary() {
  (window as any).axios = axios;
  (window as any).Sizzle = Sizzle;
  (window as any)._ = estoolkit;
  (window as any).sendMessage = sendMessage;
  console.log("开发库已启用");
}

const selectedSite = ref<TSiteID>("");
const useCustomerConfig = ref<boolean>(true);

const selectedDownloader = ref<TDownloaderKey>("");
const selectedMediaServer = ref<TMediaServerKey>("");

const piniaStoreContent = import.meta.glob<Record<string, Function>>("@/options/stores/*.ts");
const piniaStoreName: Array<{ title: string; value: string }> = Object.keys(piniaStoreContent).map((x) => ({
  title: x.replace(/^.+\//, "").replace(/\.ts$/, ""),
  value: x,
}));
const selectedPiniaStore = ref();

const metadataStore = useMetadataStore();

async function getSiteMetadata() {
  return await getDefinedSiteMetadata(selectedSite.value);
}

async function getSiteConfig() {
  return await metadataStore.getSiteUserConfig(selectedSite.value, useCustomerConfig.value);
}

async function getSiteInstance() {
  let customerConfig = {};
  if (useCustomerConfig.value) {
    customerConfig = await getSiteConfig();
  }

  return await createSiteInstance(selectedSite.value, customerConfig);
}

async function getSiteFavicon() {
  const siteInstance = await getSiteInstance();
  return await getFavicon(siteInstance.metadata);
}

async function getPiniaStore(storeName: string) {
  const storeModule = await piniaStoreContent[storeName]();
  const storeFunction = Object.keys(storeModule).filter((f) => /use.+Store/.test(f));
  if (storeFunction.length > 0) {
    return storeModule[storeFunction[0]]();
  }
}

const log = async (v: any) => {
  console.log(await v);
};

interface resetItem {
  title: string;
  subTitle?: string;
  resetFn: () => Promise<void>;
}

const resetItems: resetItem[] = [
  {
    title: "重置系统设置",
    subTitle: "重置所有系统设置（包括但不限于语言、主题、表格展示、图片样式等常规设置）为默认值",
    resetFn: async () => {
      const configStore = useConfigStore();
      configStore.$reset();
      await configStore.$save();
    },
  },
  {
    title: "清空用户配置",
    subTitle: "清空所有用户配置（包括但不限于站点、下载器、搜索方案及默认值、搜索快照元数据、最近一次用户信息）",
    resetFn: async () => {
      const metadataStore = useMetadataStore();
      metadataStore.$reset();
      await metadataStore.$save();
    },
  },
  {
    title: "清空站点数据",
    subTitle: "清空用户所有历史获取的站点数据",
    resetFn: async () => {
      await sendMessage("setExtStorage", { key: "userInfo", value: {} });
    },
  },
  {
    title: "清空历史下载记录",
    resetFn: async () => {
      await sendMessage("clearDownloadHistory", undefined);
    },
  },
  {
    title: "清空站点 Favicon 缓存",
    resetFn: async () => {
      await sendMessage("clearSiteFaviconCache", undefined);
    },
  },
  {
    title: "清空来自豆瓣、IMDb等信息站点的媒体简介缓存",
    resetFn: async () => {
      await sendMessage("clearSocialInformationCache", undefined);
    },
  },
  {
    title: "清空搜索快照",
    subTitle: "清空所有搜索快照数据",
    resetFn: async () => {
      await sendMessage("setExtStorage", { key: "searchResultSnapshot", value: {} });
    },
  },
];

async function resetFnWrapper(resetFn: resetItem["resetFn"]) {
  if (confirm("确定要重置吗？")) {
    await resetFn();
    alert("重置成功");
  }
}
</script>

<template>
  <v-alert type="warning" style="margin-bottom: 10px">
    <v-alert-title> 调试页面！！！！ </v-alert-title>
    所有输出均在console面板！！！
  </v-alert>
  <v-card class="mb-2">
    <v-table>
      <tbody>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">启用开发库</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col class="d-flex align-center">
                  <v-btn @click="enableLibrary" class="mr-3">启用</v-btn>
                  在console中启用 <code>sendMessage, axios, Sizzle, es-toolkit ( as _ ）</code> 等方法
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">调试内置站点</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete v-model="selectedSite" :items="definitionList" hide-details label="site" />
                </v-col>
                <v-col cols="2">
                  <v-checkbox v-model="useCustomerConfig" hide-details label="合并用户配置" />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteMetadata())"> 输出站点定义 </v-btn>
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteConfig())"> 输出用户配置信息 </v-btn>
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteInstance())"> 输出站点实例 </v-btn>
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteFavicon())"> 输出Favicon </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">调试下载服务器</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="selectedDownloader"
                    :items="metadataStore.getDownloaders"
                    item-title="name"
                    item-value="id"
                    label="downloader"
                    :messages="`请先在 SetDownloader 页面添加下载服务器`"
                  />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn
                    :disabled="!selectedDownloader"
                    class="mr-2"
                    @click="log(metadataStore.downloaders[selectedDownloader])"
                  >
                    输出用户配置信息
                  </v-btn>
                  <v-btn
                    :disabled="!selectedDownloader"
                    class="mr-2"
                    @click="log(getDownloader(metadataStore.downloaders[selectedDownloader]))"
                  >
                    输出下载服务器实例
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">调试媒体服务器</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="selectedMediaServer"
                    :items="metadataStore.getMediaServers"
                    item-title="name"
                    item-value="id"
                    label="mediaServer"
                    :messages="`请先在 SetMediaServer 页面添加媒体服务器`"
                  />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn
                    :disabled="!selectedMediaServer"
                    class="mr-2"
                    @click="log(metadataStore.mediaServers[selectedMediaServer])"
                  >
                    输出用户配置信息
                  </v-btn>
                  <v-btn
                    :disabled="!selectedMediaServer"
                    class="mr-2"
                    @click="log(getMediaServer(metadataStore.mediaServers[selectedMediaServer]))"
                  >
                    输出媒体服务器实例
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">调试Pinia</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="selectedPiniaStore"
                    label="piniaStore"
                    :items="piniaStoreName"
                    hide-details
                  />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn class="mr-2" :disabled="!selectedPiniaStore" @click="log(getPiniaStore(selectedPiniaStore))">
                    输出Pinia信息
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">插件重置</div>
          </td>
          <td>
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-alert type="warning" variant="tonal">极其危险！！！！</v-alert>
                </v-col>
                <v-col md="8">
                  <v-list>
                    <v-list-item
                      v-for="item in resetItems"
                      :key="item.title"
                      :title="item.title"
                      :subtitle="item.subTitle"
                      color="primary"
                      rounded
                    >
                      <template v-slot:prepend>
                        <v-list-item-action class="mr-2">
                          <v-btn color="red" @click="() => resetFnWrapper(item.resetFn)">重置</v-btn>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<style scoped lang="scss"></style>
