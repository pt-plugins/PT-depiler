<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { omit } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { computed, ref, shallowRef } from "vue";
import {
  definitionList,
  EResultParseStatus,
  getHostFromUrl,
  type IUserInfo,
  parseSizeString,
  parseValidTimeString,
  type TSiteHost,
  type TSiteID,
} from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { IPtppDumpUserInfo, IPtppUserInfo, TUserInfoStorageSchema } from "@/shared/types.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import CheckSwitchButton from "@/options/components/CheckSwitchButton.vue";

const showDialog = defineModel<boolean>();
const { ptppUserData } = defineProps<{
  ptppUserData: IPtppDumpUserInfo;
}>();

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const parsePtppSize = (v: any) => (typeof v == "string" ? parseSizeString(v) : v);

type TUserInfoTransferFull = { key: keyof IUserInfo; format?: (v: any) => any };

type TUserInfoTransfer =
  | false // 不导入
  | undefined // 按照原 key 导入
  | keyof IUserInfo // 按新的 key 导入
  | TUserInfoTransferFull; // 导入到新的 key 中，并使用 format 对原始数据进行转换

/**
 * 这个 映射表是用来将 ptpp 的用户信息转换为我们需要的格式，未列出的字段的字段会 按照原 key 导入
 */
const userInfoTransferMap = {
  trueDownloaded: { key: "trueDownloaded", format: parsePtppSize },
  totalTraffic: { key: "totalTraffic", format: parsePtppSize },
  // seedingList?: string[]; // 做种列表
  seedingPoints: "seedingBonus",
  averageSeedtime: "averageSeedtime",
  // totalSeedtime?: number; // 总保种时间
  bonusPage: false,
  unsatisfiedsPage: false,
  // classPoints?: number; // 等级积分
  unsatisfieds: { key: "hnrUnsatisfied", format: (v) => Number(v) },
  prewarn: "hnrPreWarning",
  lastUpdateTime: "updateAt",
  lastUpdateStatus: {
    key: "status",
    format: (v) => (v === "success" ? EResultParseStatus.success : EResultParseStatus.unknownError),
  },
  isLogged: false,
  isLoading: false,
  lastErrorMsg: false,
  // uniqueGroups?: number; // 独特分组
  // perfectFLAC?: number; // “完美”FLAC
  joinTime: {
    key: "joinTime",
    format: (v: any) => {
      if (typeof v === "number") {
        if (v > 1e12) return v; // 13位时间戳
        if (v > 1e9) return v * 1000; // 10位时间戳转13位
      }
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v)) {
        return parseValidTimeString(v);
      }
      return v;
    },
  },
} as Record<keyof IPtppUserInfo, TUserInfoTransfer>;

const isImporting = ref<boolean>(false);
const toImportSite = ref<string[]>([]);

// 这里我们自己维护一个站点列表，而不是用 metadataStore.siteHostMap （因为 siteHostMap 只考虑了已添加的站点，无未添加的站点）
const allSupportedSiteHostMap = shallowRef<Record<TSiteHost, TSiteID>>({});

const allSupportedSiteHost = computed(() =>
  Object.keys(ptppUserData)
    .map((x) => ({ site: allSupportedSiteHostMap.value[x], host: x }))
    .filter((x) => !!x.site)
    .map((x) => x.host),
);
const overwriteExistUserInfo = ref<boolean>(false);

const statusIconPropComputed = (host: string) =>
  computed(() => {
    let progressIcon = "progress-helper"; // 默认
    let progressColor = "grey";
    let progressTitle = "";
    if (!allSupportedSiteHost.value.includes(host)) {
      progressIcon = "progress-close";
      progressColor = "purple";
      progressTitle = "该站点暂不支持";
    } else if (toImportSite.value.includes(host)) {
      progressIcon = "progress-pencil"; // 已选择
      progressColor = "";
      progressTitle = "已选择";
    }

    return {
      "prepend-icon": `mdi-${progressIcon}`,
      color: progressColor,
      title: progressTitle,
    };
  });

function transferUserInfo(userInfo: IPtppUserInfo) {
  const newUserInfo = {} as IUserInfo;
  for (const [key, value] of Object.entries(userInfo)) {
    if (userInfoTransferMap[key as keyof IPtppUserInfo]) {
      const transfer = userInfoTransferMap[key as keyof IPtppUserInfo];
      if (transfer === false) {
        continue;
      } else if (transfer === undefined) {
        newUserInfo[key] = value;
      } else if (typeof transfer === "string") {
        newUserInfo[transfer] = value;
      } else {
        const { key, format = undefined } = transfer as TUserInfoTransferFull;
        newUserInfo[key as keyof IPtppUserInfo] = format ? format(value) : value;
      }
    } else {
      newUserInfo[key] = value;
    }
  }
  return newUserInfo;
}

async function doImport() {
  if (isEmpty(metadataStore.sites)) {
    if (!confirm("你似乎还没有添加任何站点，这可能导致导入异常，是否继续？")) {
      runtimeStore.showSnakebar("导入操作已取消。", { color: "warning" });
      return;
    }
  }

  isImporting.value = true;

  // 暂停后端刷新数据的任务
  const autoReflushStatus = configStore.userInfo.autoReflush.enabled;

  try {
    if (autoReflushStatus) {
      configStore.userInfo.autoReflush.enabled = false;
      await configStore.$save();
    }

    // 读出目前所有的 userInfo
    const userInfoStorage = ((await sendMessage("getExtStorage", "userInfo")) as TUserInfoStorageSchema) ?? {};

    // 开始转换数据
    for (const [host, data] of Object.entries(ptppUserData)) {
      if (toImportSite.value.includes(host)) {
        const siteId = allSupportedSiteHostMap.value[host];
        userInfoStorage[siteId] ??= {};

        // 首先处理 latest，注意我们仅处理 lastUpdateStatus 为 success ，且历史时间大于当前存储的时间（这样可以帮助我们导入 isDead 的站点）
        const latestUserInfo = data.latest ?? {};
        if (
          overwriteExistUserInfo.value &&
          latestUserInfo?.lastUpdateStatus === "success" &&
          (latestUserInfo?.lastUpdateTime ?? -1) > (metadataStore.lastUserInfo[siteId]?.updateAt ?? 0)
        ) {
          metadataStore.lastUserInfo[siteId] = { ...transferUserInfo(latestUserInfo), site: siteId };
        }

        for (const [date, userData] of Object.entries(omit(data, ["latest"]))) {
          if (typeof userInfoStorage[siteId][date] == "undefined" || overwriteExistUserInfo.value) {
            userInfoStorage[siteId][date] = { ...transferUserInfo(userData), site: siteId };
          }
        }
      }
    }

    // 更新 userInfo
    await sendMessage("setExtStorage", { key: "userInfo", value: userInfoStorage });
    await metadataStore.$save();

    runtimeStore.showSnakebar("导入成功，窗口将在 5s 后自动关闭，请刷新页面。");

    setTimeout(() => (showDialog.value = false), 5e3);
  } catch (e) {
    console.error("导入失败", e);
    runtimeStore.showSnakebar("导入失败。", { color: "error" });
  } finally {
    // 恢复自动刷新的状态
    configStore.userInfo.autoReflush.enabled = autoReflushStatus;
    await configStore.$save();

    isImporting.value = false;
  }
}

async function entryDialog() {
  // 构造 allSupportedSiteHostMap
  const siteHostMap: Record<TSiteHost, TSiteID> = {};
  for (const siteId of definitionList) {
    // 用户自定义的 url
    if (metadataStore.sites[siteId]?.url) {
      siteHostMap[getHostFromUrl(metadataStore.sites[siteId].url)] = siteId;
    }

    // 站点定义中的 urls
    const urls = await metadataStore.getSiteMergedMetadata(siteId, "urls", []);
    if (urls.length > 0) {
      for (const url of urls) {
        siteHostMap[getHostFromUrl(url)] = siteId;
      }
    }

    // 站点定义中的 host
    const host = await metadataStore.getSiteMergedMetadata(siteId, "host", "");
    if (host) {
      siteHostMap[host] = siteId;
    }

    // 站点定义中的 formerHosts
    const formerHosts = (await metadataStore.getSiteMergedMetadata(siteId, "formerHosts", []))!;
    if (formerHosts.length > 0) {
      for (const host of formerHosts) {
        siteHostMap[host] = siteId;
      }
    }
  }

  allSupportedSiteHostMap.value = siteHostMap;

  toImportSite.value = allSupportedSiteHost.value;
}
</script>

<template>
  <v-dialog v-model="showDialog" :persistent="isImporting" max-width="800" scrollable @after-enter="entryDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>恢复 PT-Plugin-Plus 的用户历史数据信息</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert class="mb-1 py-2" title="待导入数据">
          <template #append>
            <CheckSwitchButton
              v-model="toImportSite"
              :all="allSupportedSiteHost"
              :size="undefined"
              :disabled="isImporting"
            />
          </template>
        </v-alert>
        <v-list>
          <v-container class="pa-0">
            <v-row no-gutters>
              <v-col v-for="(data, host) in ptppUserData" :key="host" class="pa-1" cols="12" md="6">
                <v-list-item border class="bg-grey-lighten-4">
                  <template #prepend>
                    <v-checkbox
                      v-model="toImportSite"
                      :disabled="!allSupportedSiteHost.includes(host as string)"
                      :indeterminate="!allSupportedSiteHost.includes(host as string)"
                      :value="host"
                      hide-details
                      indeterminate-icon="mdi-close"
                    />
                  </template>

                  <template #title>
                    <v-list-item-title class="d-inline-flex align-center">
                      {{ host }}
                      <template v-if="allSupportedSiteHost.includes(host as string)">
                        ->
                        <SiteFavicon :site-id="allSupportedSiteHostMap[host as string]" class="mx-1" />
                        <SiteName
                          :site-id="allSupportedSiteHostMap[host as string]"
                          class="text-no-wrap font-weight-bold"
                          tag="span"
                        />
                      </template>
                    </v-list-item-title>
                  </template>

                  <template #append>
                    <v-chip label v-bind="statusIconPropComputed(host as string).value">
                      {{ Object.keys(data).length - 1 }}条
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-switch
          color="success"
          v-model="overwriteExistUserInfo"
          :label="`是否覆盖已有数据`"
          :disabled="isImporting"
          hide-details
          density="compact"
          class="ml-5"
        ></v-switch>
        <v-spacer />
        <v-btn
          color="error"
          prepend-icon="mdi-close-circle"
          variant="text"
          :disabled="isImporting"
          @click="showDialog = false"
        >
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn color="green" prepend-icon="mdi-import" variant="text" :disabled="isImporting" @click="doImport">
          导入
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
