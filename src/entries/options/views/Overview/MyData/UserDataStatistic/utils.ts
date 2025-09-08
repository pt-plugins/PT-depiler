import { subDays, format as formatDate, eachDayOfInterval } from "date-fns";
import { EResultParseStatus, TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { type IStoredUserInfo, TUserInfoStorageSchema } from "@/shared/types.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

export interface IUserDataStatistic {
  siteDateRange: Record<TSiteID, [string, string]>;
  dailyUserInfo: Record<string, Record<TSiteID, IStoredUserInfo>>;
  // 新增：预计算的增量数据，提高渲染性能
  incrementalData: Record<TSiteID, Record<string, Record<keyof IStoredUserInfo, number>>>;
}

// 数值字段列表
const numericFields: (keyof IStoredUserInfo)[] = ["uploaded", "downloaded", "seeding", "seedingSize", "bonus"];

// 新增：计算单日增量数据的函数
function calculateDailyIncremental(
  prevDateData: IStoredUserInfo | null,
  dateData: IStoredUserInfo,
  isFirstDataPoint: boolean,
): { incremental: Record<keyof IStoredUserInfo, number>; updatedPrevData: IStoredUserInfo } {
  const incremental: Record<keyof IStoredUserInfo, number> = {} as Record<keyof IStoredUserInfo, number>;

  for (const field of numericFields) {
    const currentValue = dateData[field];
    if (typeof currentValue === "number" && !isNaN(currentValue)) {
      if (isFirstDataPoint) {
        // 站点第一次有数据时，增量为0
        incremental[field] = 0;
      } else if (prevDateData) {
        const prevValue = prevDateData[field];
        if (typeof prevValue === "number" && !isNaN(prevValue)) {
          // 计算增量：当前值 - 前一个有效值
          incremental[field] = currentValue - prevValue;
        } else {
          // 前一个数据字段无效时，增量为0
          incremental[field] = 0;
        }
      } else {
        // 前一个数据不存在时，增量为0
        incremental[field] = 0;
      }
    }
  }

  return { incremental, updatedPrevData: dateData };
}

export async function loadFullData(): Promise<IUserDataStatistic> {
  const rawData = (await sendMessage("getExtStorage", "userInfo")) as TUserInfoStorageSchema;
  const metadataStore = useMetadataStore();
  const addedSiteIds = metadataStore.getAddedSiteIds;

  // 提前过滤已删除的站点数据，避免后续不必要的计算
  const filteredRawData: TUserInfoStorageSchema = Object.fromEntries(
    Object.entries(rawData).filter(([siteId]) => addedSiteIds.includes(siteId as TSiteID)),
  );

  // 提取所有日期并去重（只处理有效站点的数据）
  const allDatesSet = new Set<string>();
  for (const perSiteUserInfoHistory of Object.values(filteredRawData)) {
    for (const dateStr in perSiteUserInfoHistory) {
      allDatesSet.add(dateStr);
    }
  }
  const allDates = Array.from(allDatesSet);

  // 如果没有有效的站点数据，返回空结果
  if (allDates.length === 0) {
    console.debug("[PTD] No valid site data found after filtering");
    return {
      dailyUserInfo: {},
      siteDateRange: {},
      incrementalData: {},
    };
  }

  // 找出最小和最大日期，并生成最小到最大日期之间的所有日期
  const sortedDates = allDates.sort();
  const minDateStr = sortedDates[0];
  const maxDateStr = sortedDates[sortedDates.length - 1];
  const datesInRange = eachDayOfInterval({
    start: new Date(minDateStr + "T00:00:00"),
    end: new Date(maxDateStr + "T00:00:00"),
  }).map((x) => formatDate(x, "yyyy-MM-dd"));

  const siteDateRange: IUserDataStatistic["siteDateRange"] = {};
  const dailyUserInfo: IUserDataStatistic["dailyUserInfo"] = Object.fromEntries(datesInRange.map((x) => [x, {}]));
  const incrementalData: IUserDataStatistic["incrementalData"] = {};

  console.debug(
    `[PTD] Filtered out ${Object.keys(rawData).length - Object.keys(filteredRawData).length} deleted sites`,
  );
  console.debug("[PTD] Found UserDataStatistic used date ranges:", datesInRange);

  // 遍历过滤后的站点数据
  for (const [siteId, perSiteUserInfoHistory] of Object.entries(filteredRawData)) {
    const thisSiteDateRange = Object.keys(perSiteUserInfoHistory);
    const sortedSiteDates = thisSiteDateRange.sort();
    const thisSiteMinDateStr = sortedSiteDates[0];
    const thisSiteMaxDateStr = sortedSiteDates[sortedSiteDates.length - 1];
    const thisSiteDateRangeInInterval = eachDayOfInterval({
      start: new Date(thisSiteMinDateStr + "T00:00:00"),
      end: new Date(thisSiteMaxDateStr + "T00:00:00"),
    }).map((x) => formatDate(x, "yyyy-MM-dd"));
    siteDateRange[siteId] = [thisSiteDateRangeInInterval.at(0)!, thisSiteDateRangeInInterval.at(-1)!];

    // 初始化站点增量数据
    incrementalData[siteId] = {};

    let dateData: IStoredUserInfo | undefined;
    let prevDateData: IStoredUserInfo | null = null;
    let hasFoundFirstDataPoint = false;

    for (const dateStr of thisSiteDateRangeInInterval) {
      // 如果该日期有值，则覆盖，否则使用上一个有效日期的值
      if (perSiteUserInfoHistory[dateStr]) {
        const thisDateData = perSiteUserInfoHistory[dateStr];
        if (thisDateData.status === EResultParseStatus.success) {
          dateData = thisDateData;
        }
      }

      if (dateData) {
        dailyUserInfo[dateStr][siteId] = dateData;

        // 计算增量数据 - 判断是否是第一个有效数据点
        const isFirstDataPoint = !hasFoundFirstDataPoint;
        const { incremental, updatedPrevData } = calculateDailyIncremental(prevDateData, dateData, isFirstDataPoint);
        incrementalData[siteId][dateStr] = incremental;

        // 更新状态
        prevDateData = updatedPrevData;
        hasFoundFirstDataPoint = true;
      }
    }

    console.debug(`[PTD] UserDataStatistic for ${siteId} loaded, date range: ${thisSiteDateRangeInInterval}`);
  }

  console.debug("[PTD] Incremental data calculated during data loading");

  return { dailyUserInfo, siteDateRange, incrementalData };
}

export function setSubDate(days: number) {
  const today = new Date();
  const subDay = subDays(today, days - 1);
  return eachDayOfInterval({ start: subDay, end: today }).map((x) => formatDate(x, "yyyy-MM-dd"));
}
