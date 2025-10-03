import { ref, shallowRef, computed } from "vue";
import { differenceInDays } from "date-fns";
import { EResultParseStatus, type ISiteUserConfig, type IUserInfo, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { formatSize, simplifyNumber } from "@/options/utils.ts";
import { useResetableRef } from "@/options/directives/useResetableRef.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { IStoredUserInfo, TUserInfoStorageSchema } from "@/shared/types.ts";

import { allAddedSiteMetadata, fixUserInfo, realFormatRatio, TOptionSiteMetadatas } from "../utils.ts";

const metadataStore = useMetadataStore();

export interface IMaxInfo {
  site: IStoredUserInfo;
  maxValue: number;
  subSite: IStoredUserInfo;
  subValue: number;
}

export const topSiteRenderAttr = [
  { iconFill: "#C9B037", siteKey: "site", valueKey: "maxValue" },
  { iconFill: "#B4B4B4", siteKey: "subSite", valueKey: "subValue" },
] as const;

export const CTimelineUserInfoField = [
  { name: "uploads", format: (x: number) => x },
  { name: "uploaded", format: (x: number) => formatSize(x) },
  { name: "downloaded", format: (x: number) => formatSize(x) },
  { name: "seeding", format: (x: number) => x },
  { name: "seedingSize", format: (x: number) => formatSize(x) },
  { name: "bonus", format: (x: number) => simplifyNumber(x, " ") },
  { name: "bonusPerHour", format: (x: number) => simplifyNumber(x, " ") },
  { name: "ratio", format: (x: number) => realFormatRatio(x) },
] as const;

export type ITimelineUserInfoField = (typeof CTimelineUserInfoField)[number];

interface ITimelineData {
  createAt: Date;
  title: string;
  siteInfo: IStoredUserInfo[];
  joinTimeInfo: {
    site: IStoredUserInfo;
    time: number;
    years: string;
  };
  topInfo: Record<ITimelineUserInfoField["name"], IMaxInfo>;
  totalInfo: {
    sites: number;
    deadSites: number;
    offlineSites: number;
  } & Required<Pick<IUserInfo, ITimelineUserInfoField["name"] | "ratio">>;
}

export const fixedLastUserInfo = shallowRef<Record<TSiteID, IStoredUserInfo>>({});
const fixedLastUserInfoComputed = computed(() => Object.values(fixedLastUserInfo.value));

function isValidUserInfo(userInfo: IStoredUserInfo): boolean {
  return !!(userInfo && userInfo.name && userInfo.joinTime && userInfo.status === EResultParseStatus.success);
}

export function canThisSiteShow(siteId: TSiteID) {
  const siteUserInfo = fixedLastUserInfo.value[siteId] as IStoredUserInfo;
  if (!isValidUserInfo(siteUserInfo)) {
    return false;
  }

  const siteUserConfig = (metadataStore.sites[siteId] ?? {}) as ISiteUserConfig;
  const siteMetadata = (allAddedSiteMetadata[siteId] ?? {}) as TOptionSiteMetadatas[typeof siteId];

  // 对于已死站点，只要有有效的用户信息就可以显示
  // 对于活跃站点，需要检查是否有 userInfo 配置
  return siteMetadata.hasUserInfo || isValidUserInfo(siteUserInfo);
}

export async function loadFullData(): Promise<Record<TSiteID, IStoredUserInfo>> {
  const lastUserInfo: Record<TSiteID, IStoredUserInfo> = {};
  const rawData = (await sendMessage("getExtStorage", "userInfo")) as TUserInfoStorageSchema;

  for (const siteId in metadataStore.sites) {
    const siteUserInfo = metadataStore.lastUserInfo[siteId] as IStoredUserInfo;
    if (isValidUserInfo(siteUserInfo)) {
      // 如果站点用户信息获取成功，则直接使用
      lastUserInfo[siteId] = fixUserInfo(siteUserInfo);
    } else {
      // 如果站点用户信息获取失败，则尝试从存储中获取最近一个成功的数据
      const siteUserInfoHistory = rawData?.[siteId];
      if (siteUserInfoHistory) {
        let maxDate = null;
        for (const date in siteUserInfoHistory) {
          const thisDaySiteUserInfo = siteUserInfoHistory[date] as IStoredUserInfo;
          if (isValidUserInfo(thisDaySiteUserInfo) && (!maxDate || new Date(date) > new Date(maxDate))) {
            maxDate = date;
          }
        }

        if (maxDate) {
          lastUserInfo[siteId] = {
            ...fixUserInfo(siteUserInfoHistory[maxDate]),
            site: siteId as TSiteID,
          };
        }
      }
    }
  }

  return lastUserInfo;
}

export const selectedSites = ref<TSiteID[]>([]); // 选择的站点

export const timelineDataRef = useResetableRef<ITimelineData>(
  () => {
    // 初始化需要展示的数据
    const currentDate = new Date();
    const result: ITimelineData = {
      createAt: currentDate,
      title: "这些年走过的路", // FIXME i18n
      joinTimeInfo: { site: {} as IStoredUserInfo, time: Infinity, years: "0" },
      siteInfo: [],
      topInfo: {
        uploads: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        uploaded: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        downloaded: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        seeding: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        seedingSize: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        ratio: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        bonus: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
        bonusPerHour: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
      },
      totalInfo: {
        sites: 0,
        deadSites: 0,
        offlineSites: 0,
        uploads: 0,
        uploaded: 0,
        downloaded: 0,
        seeding: 0,
        seedingSize: 0,
        bonus: 0,
        bonusPerHour: 0,
        ratio: -1,
      },
    };

    const userNames: Record<string, number> = {};
    const addedSiteInfo: IStoredUserInfo[] = [];
    for (let userInfo of fixedLastUserInfoComputed.value) {
      // 未勾选的站点不展示
      if (!selectedSites.value.includes(userInfo.site)) {
        continue;
      }

      // 不能获取站点信息的站点，即使勾选了也不展示
      if (!canThisSiteShow(userInfo.site)) {
        continue;
      }

      // 更新 result 信息， 这里其实并不需要判断 name & joinTime，但为了 ts 不报错。。。
      if (userInfo.name && userInfo.joinTime) {
        result.totalInfo.sites++;
        addedSiteInfo.push(userInfo); // 记录下所有能添加的站点

        // 统计 dead 站点数量
        if (allAddedSiteMetadata[userInfo.site]?.isDead) {
          result.totalInfo.deadSites++;
        }

        // 统计 offline 站点数量
        if (allAddedSiteMetadata[userInfo.site]?.isOffline) {
          result.totalInfo.offlineSites++;
        }

        if (!userNames[userInfo.name]) {
          userNames[userInfo.name] = 0;
        }
        userNames[userInfo.name]++;

        // 获取加入时间最久的站点
        if (userInfo.joinTime < result.joinTimeInfo.time) {
          result.joinTimeInfo.site = userInfo;
          result.joinTimeInfo.time = userInfo.joinTime;
          // 此处先不计算 years，在完成全部站点遍历后再计算
        }

        // 更新 uploads, uploaded, downloaded, seeding, seedingSize 信息
        for (const userInfoField of CTimelineUserInfoField) {
          const userInfoKey = userInfoField.name as ITimelineUserInfoField["name"];
          if (userInfo[userInfoKey] && userInfo[userInfoKey] > 0) {
            // refs: https://github.com/pt-plugins/PT-depiler/issues/48
            let value = 0;
            try {
              value = parseFloat(userInfo[userInfoKey]);
            } catch (e) {}

            if (!isFinite(value)) continue; // 如果不是有限数字，则跳过

            result.totalInfo[userInfoKey] += value; // 更新总量

            // 更新最大值和次大值
            if (value > result.topInfo[userInfoKey].maxValue) {
              result.topInfo[userInfoKey].subValue = result.topInfo[userInfoKey].maxValue;
              result.topInfo[userInfoKey].subSite = result.topInfo[userInfoKey].site;
              result.topInfo[userInfoKey].maxValue = value;
              result.topInfo[userInfoKey].site = userInfo;
            } else if (value > result.topInfo[userInfoKey].subValue) {
              result.topInfo[userInfoKey].subValue = value;
              result.topInfo[userInfoKey].subSite = userInfo;
            }
          }
        }
      }
    }

    if (result.totalInfo.downloaded > 0) {
      result.totalInfo.ratio = result.totalInfo.uploaded / result.totalInfo.downloaded;
    }

    if (result.joinTimeInfo.time !== Infinity) {
      result.joinTimeInfo.years = (differenceInDays(currentDate, result.joinTimeInfo.time) / 365).toFixed(2);
    }

    result.siteInfo = addedSiteInfo.toSorted((a, b) => a.joinTime! - b.joinTime!); // 按照加入时间排序

    return result;
  },
  { shallow: true },
);

export type TKonvaConfig = Record<string, any>;
export const text = (config: TKonvaConfig) => ({ x: 0, y: 0, fontSize: 24, fill: "#fff", ...config });
export const divider = (config: TKonvaConfig) => ({ x: 0, y: 0, stroke: "#0000001f", strokeWidth: 2, ...config });
export const image = (config: TKonvaConfig) => {
  const imageBaseSize = config.size ?? 24;
  const imageWidth = config.image?.width ?? imageBaseSize;
  const imageHeight = config.image?.height ?? imageBaseSize;

  return {
    x: 0,
    y: 0,
    scaleX: config.scaleX ?? imageBaseSize / imageWidth,
    scaleY: config.scaleY ?? imageBaseSize / imageHeight,
    width: config.canvas?.width ?? imageBaseSize,
    height: config.canvas?.height ?? imageBaseSize,
    ...config,
  };
};

export const icon = (config: TKonvaConfig) =>
  text({
    fontSize: 32,
    fontFamily: "Material Design Icons For PTD",
    ...config,
  });
