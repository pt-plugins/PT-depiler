<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as estoolkit from "es-toolkit";
import * as datefns from "date-fns";
import axios from "axios";
import Sizzle from "sizzle";
import {
  definitionList,
  getDefinedSiteMetadata,
  getFavicon,
  getSite as createSiteInstance,
  type TSiteID,
} from "@ptd/site";

import { getDownloader } from "@ptd/downloader";
import { getMediaServer } from "@ptd/mediaServer";
import { getBackupServer } from "@ptd/backupServer";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { sendMessage } from "@/messages.ts";

import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";
import { setupRetryWhenCloudflareBlock } from "~/extends/axios/retryWhenCloudflareBlock.ts";

setupRetryWhenCloudflareBlock(setupReplaceUnsafeHeader(axios));

const { t } = useI18n();

function enableLibrary() {
  (window as any).axios = axios;
  (window as any).Sizzle = Sizzle;
  (window as any)._ = estoolkit;
  (window as any).datefns = datefns;
  (window as any).sendMessage = sendMessage;
  console.log("开发库已启用");
}

const selectedSite = ref<TSiteID>("");
const useCustomerConfig = ref<boolean>(true);

const clearSiteTarget = ref<TSiteID>("all");
const siteSelectItems = computed(() => [{ title: t("Debugger.siteAll"), value: "all" }, ...definitionList.map((x) => ({ title: x, value: x }))]);

const piniaStoreContent = import.meta.glob<Record<string, Function>>("@/options/stores/*.ts");
const piniaStoreName: Array<{ title: string; value: string }> = Object.keys(piniaStoreContent).map((x) => ({
  title: x.replace(/^.+\//, "").replace(/\.ts$/, ""),
  value: x,
}));
const selectedPiniaStore = ref();

const metadataStore = useMetadataStore();

const simpleServer = ref<Record<string, { selected: string; piniaKey: keyof typeof metadataStore; getFn: Function }>>({
  Downloader: { selected: "", piniaKey: "downloaders", getFn: getDownloader },
  MediaServer: { selected: "", piniaKey: "mediaServers", getFn: getMediaServer },
  BackupServer: { selected: "", piniaKey: "backupServers", getFn: getBackupServer },
});

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
  id?: string;
  title: string;
  subTitle?: string;
  resetFn: () => Promise<void>;
}

const resetItems = computed<resetItem[]>(() => [
  {
    title: t("Debugger.resetItems.resetSystemSettings"),
    subTitle: t("Debugger.resetItems.resetSystemSettingsDesc"),
    resetFn: async () => {
      const configStore = useConfigStore();
      configStore.$reset();
      await configStore.$save();
    },
  },
  {
    title: t("Debugger.resetItems.clearUserConfig"),
    subTitle: t("Debugger.resetItems.clearUserConfigDesc"),
    resetFn: async () => {
      const metadataStore = useMetadataStore();
      metadataStore.$reset();
      await metadataStore.$save();
    },
  },
  {
    id: "clearSiteData",
    title: t("Debugger.resetItems.clearSiteData"),
    subTitle: t("Debugger.resetItems.clearSiteDataDesc"),
    resetFn: async () => {
      const metadataStore = useMetadataStore();
      if (clearSiteTarget.value === "all") {
        // 清空所有站点数据
        metadataStore.lastUserInfo = {};
        await sendMessage("setExtStorage", { key: "userInfo", value: {} });
      } else {
        // 清空指定站点数据
        if (metadataStore.lastUserInfo[clearSiteTarget.value]) delete metadataStore.lastUserInfo[clearSiteTarget.value];
        const userInfo = (await sendMessage("getExtStorage", "userInfo")) as Record<string, any>;
        if (userInfo && userInfo[clearSiteTarget.value]) {
          delete userInfo[clearSiteTarget.value];
          await sendMessage("setExtStorage", { key: "userInfo", value: userInfo });
        }
      }
      await metadataStore.$save();
    },
  },
  {
    title: t("Debugger.resetItems.clearDownloadHistory"),
    resetFn: async () => {
      await sendMessage("clearDownloadHistory", undefined);
    },
  },
  {
    title: t("Debugger.resetItems.clearFaviconCache"),
    resetFn: async () => {
      await sendMessage("clearSiteFaviconCache", undefined);
    },
  },
  {
    title: t("Debugger.resetItems.clearMediaCache"),
    resetFn: async () => {
      await sendMessage("clearSocialInformationCache", undefined);
    },
  },
  {
    title: t("Debugger.resetItems.clearSearchSnapshot"),
    subTitle: t("Debugger.resetItems.clearSearchSnapshotDesc"),
    resetFn: async () => {
      const metadataStore = useMetadataStore();
      metadataStore.snapshots = {};
      await metadataStore.$save();
      await sendMessage("setExtStorage", { key: "searchResultSnapshot", value: {} });
    },
  },
]);

async function resetFnWrapper(resetFn: resetItem["resetFn"]) {
  if (confirm(t("Debugger.confirmReset"))) {
    await resetFn();
    alert(t("Debugger.resetSuccess"));
  }
}
</script>

<template>
  <v-alert type="warning" style="margin-bottom: 10px">
    <v-alert-title> {{ t("Debugger.title") }} </v-alert-title>
    {{ t("Debugger.consoleOutput") }}
  </v-alert>
  <v-card class="mb-2">
    <v-table>
      <tbody>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">{{ t("Debugger.enableLibrary") }}</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col class="d-flex align-center">
                  <v-btn @click="enableLibrary" class="mr-3">{{ t("common.enable") }}</v-btn>
                  {{ t("Debugger.libraryList") }}
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">{{ t("Debugger.debugBuiltinSite") }}</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete v-model="selectedSite" :items="definitionList" hide-details label="site" />
                </v-col>
                <v-col cols="2">
                  <v-checkbox v-model="useCustomerConfig" hide-details :label="t('Debugger.mergeUserConfig')" />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteMetadata())"> {{ t("Debugger.outputSiteDefinition") }} </v-btn>
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteConfig())"> {{ t("Debugger.outputUserConfig") }} </v-btn>
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteInstance())"> {{ t("Debugger.outputSiteInstance") }} </v-btn>
                  <v-btn :disabled="!selectedSite" class="mr-2" @click="log(getSiteFavicon())"> {{ t("Debugger.outputFavicon") }} </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr v-for="(server, serverType) in simpleServer" :key="serverType">
          <td>
            <div class="d-flex justify-center align-center text-body-2">{{ t("Debugger.debug", { serverType }) }}</div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="simpleServer[serverType].selected"
                    :items="metadataStore[`get${serverType}s` as keyof typeof metadataStore] as any[]"
                    item-title="name"
                    item-value="id"
                    :label="serverType"
                    :messages="t('Debugger.addServerFirst', { serverType })"
                  />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn
                    :disabled="!server.selected"
                    class="mr-2"
                    @click="
                      // @ts-ignore
                      log(metadataStore[server.piniaKey][server.selected])
                    "
                  >
                    {{ t("Debugger.outputConfig") }}
                  </v-btn>
                  <v-btn
                    :disabled="!server.selected"
                    class="mr-2"
                    @click="
                      // @ts-ignore
                      log(server.getFn(metadataStore[server.piniaKey][server.selected]))
                    "
                  >
                    {{ t("Debugger.outputInstance", { serverType }) }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">{{ t("Debugger.debugPinia") }}</div>
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
                    {{ t("Debugger.outputPinia") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">{{ t("Debugger.pluginReset") }}</div>
          </td>
          <td>
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-alert type="warning" variant="tonal">{{ t("Debugger.dangerWarning") }}</v-alert>
                </v-col>
                <v-col md="10">
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
                          <v-btn color="red" @click="() => resetFnWrapper(item.resetFn)">{{ t("common.dialog.reset") }}</v-btn>
                        </v-list-item-action>
                      </template>
                      <template v-slot:append>
                        <v-select
                          v-if="item.id === 'clearSiteData'"
                          v-model="clearSiteTarget"
                          :items="siteSelectItems"
                          :label="t('Debugger.selectSite')"
                          hide-details
                          density="compact"
                          style="min-width: 150px; margin-left: 12px"
                        />
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
