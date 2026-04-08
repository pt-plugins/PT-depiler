import { ref, computed } from "vue";
import { type ISiteUserConfig, type IUserInfo, TSiteID } from "@ptd/site";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import { differenceInDays } from "date-fns";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import { fixUserInfo } from "./format.ts";
import { loadAllAddedSiteMetadata } from "./siteMetadata.ts";

export interface IUserInfoItem extends IUserInfo {
  siteUserConfig: ISiteUserConfig;
  siteName: string;
}

const metadataStore = useMetadataStore();

export const perSiteLastUserData = ref<Record<TSiteID, IUserInfoItem>>({});
export const tableData = computed(() => Object.values(perSiteLastUserData.value));

async function updatePerSiteData(siteId: TSiteID, siteUserInfoData: IUserInfo) {
  const currentDate = new Date();

  // 再单独加载一遍该站点的配置信息，以免缺失
  const allAddedSiteMetadata = await loadAllAddedSiteMetadata([siteId]);
  const siteMeta = allAddedSiteMetadata[siteId];

  perSiteLastUserData.value[siteId] = {
    ...fixUserInfo(siteUserInfoData),
    site: siteId,
    siteUserConfig: metadataStore.sites[siteId],
    siteName: siteMeta.combinedSiteName,
    // 对 isDead 或者 isOffline 的站点不允许选择（ https://github.com/pt-plugins/PT-depiler/pull/140 ）
    selectable: !(siteMeta.isDead || siteMeta.isOffline),

    // 预先计算 多少天未访问站点，以防止在 template 中反复计算
    lastAccessDuration:
      typeof siteUserInfoData.lastAccessAt === "number"
        ? differenceInDays(currentDate, siteUserInfoData.lastAccessAt)
        : 0,
  };
}

export async function initTableData() {
  const configStore = useConfigStore();

  // 预加载所有已配置的站点基本属性，同时预加载的变量在全局统一，这样可以加快 Timeline 和 Statistic 的加载速度
  const addedSiteMetaData = await loadAllAddedSiteMetadata(Object.keys(metadataStore.sites));

  const tasks: Promise<void>[] = [];

  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    const siteMeta = addedSiteMetaData[siteId];

    if (
      // 只显示私有站点的用户信息
      siteMeta.type === "public" ||
      // 根据配置决定是否显示已死亡站点的用户信息
      (!configStore.userInfo.showDeadSiteInOverview && siteMeta.isDead) ||
      // 根据配置决定是否显示设置了离线模式或不允许查询用户信息的站点
      (!siteMeta.isDead &&
        !configStore.userInfo.showPassedSiteInOverview &&
        (siteUserConfig.isOffline || siteUserConfig.allowQueryUserInfo === false))
    ) {
      continue;
    }

    const siteUserInfoData = metadataStore.lastUserInfo[siteId] ?? {};
    tasks.push(
      updatePerSiteData(siteId as TSiteID, siteUserInfoData).catch((e) => {
        console.error(`initTableData: updatePerSiteData failed for ${siteId}`, e);
      }),
    );
  }

  await Promise.allSettled(tasks);
}

export function flushSiteLastUserInfo(sites: TSiteID[]) {
  const runtimeStore = useRuntimeStore();
  for (const site of sites) {
    runtimeStore.userInfo.flushPlan[site] = true;

    sendMessage("getSiteUserInfoResult", site)
      .then((userInfo) => updatePerSiteData(site, userInfo))
      .catch((e) => {
        // 首先检查是否还在刷新，如果没有，则说明队列已经取消了，此时不报错
        if (!runtimeStore.userInfo.flushPlan[site]) {
          runtimeStore.showSnakebar(`获取站点 [${site}] 用户信息失败`, { color: "error" });
          console.error(e);
        }
      })
      .finally(() => {
        runtimeStore.userInfo.flushPlan[site] = false;
      });
  }
}

export async function cancelFlushSiteLastUserInfo() {
  const runtimeStore = useRuntimeStore();
  for (const runtimeStoreKey in runtimeStore.userInfo.flushPlan) {
    runtimeStore.userInfo.flushPlan[runtimeStoreKey] = false;
  }

  await sendMessage("cancelUserInfoQueue", undefined);

  runtimeStore.showSnakebar(`用户信息刷新队列已取消`, { color: "error" });
}
