import { eachDayOfInterval, subDays, min as minDateFn, max as maxDateFn, format as formatDate } from "date-fns";
import { EResultParseStatus, TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { type IStoredUserInfo, TUserInfoStorageSchema } from "@/shared/types.ts";

export interface IUserDataStatistic {
  siteDateRange: Record<TSiteID, [string, string]>;
  dailyUserInfo: Record<string, Record<TSiteID, IStoredUserInfo>>;
  // 新增：预计算的增量数据，提高渲染性能
  incrementalData: Record<TSiteID, Record<string, Record<keyof IStoredUserInfo, number>>>;
}

// 新增：预计算增量数据的函数
function calculateIncrementalData(
  dailyUserInfo: Record<string, Record<TSiteID, IStoredUserInfo>>,
  siteDateRange: Record<TSiteID, [string, string]>,
): Record<TSiteID, Record<string, Record<keyof IStoredUserInfo, number>>> {
  const incrementalData: Record<TSiteID, Record<string, Record<keyof IStoredUserInfo, number>>> = {};

  // 预排序日期，避免重复排序
  const sortedDates = Object.keys(dailyUserInfo).sort();
  const dateIndexMap = new Map(sortedDates.map((date, index) => [date, index]));

  // 数值字段列表
  const numericFields: (keyof IStoredUserInfo)[] = ["uploaded", "downloaded", "seeding", "seedingSize", "bonus"];

  for (const [siteId, dateRange] of Object.entries(siteDateRange)) {
    incrementalData[siteId] = {};
    const siteFirstDate = dateRange[0];

    // 构建站点数据查找表
    const siteDataMap = new Map<string, Record<keyof IStoredUserInfo, number>>();
    for (const date of sortedDates) {
      const siteData = dailyUserInfo[date]?.[siteId];
      if (siteData) {
        const numericData: Record<string, number> = {};
        for (const field of numericFields) {
          const value = siteData[field];
          if (typeof value === "number" && !isNaN(value)) {
            numericData[field] = value;
          }
        }
        if (Object.keys(numericData).length > 0) {
          siteDataMap.set(date, numericData as Record<keyof IStoredUserInfo, number>);
        }
      }
    }

    // 计算增量数据
    for (const date of sortedDates) {
      const currentData = siteDataMap.get(date);
      if (!currentData) continue;

      incrementalData[siteId][date] = {} as Record<keyof IStoredUserInfo, number>;

      for (const field of numericFields) {
        const currentValue = currentData[field];
        if (typeof currentValue !== "number") continue;

        // 如果是站点第一次有数据的日期，增量为0
        if (date === siteFirstDate) {
          incrementalData[siteId][date][field] = 0;
          continue;
        }

        // 向前查找最近的有效数据
        let previousValue: number | null = null;
        const currentDateIndex = dateIndexMap.get(date);
        if (currentDateIndex !== undefined) {
          for (let i = currentDateIndex - 1; i >= 0; i--) {
            const prevDate = sortedDates[i];
            const prevData = siteDataMap.get(prevDate);
            if (prevData && typeof prevData[field] === "number") {
              previousValue = prevData[field];
              break;
            }
          }
        }

        // 计算增量
        incrementalData[siteId][date][field] = previousValue !== null ? currentValue - previousValue : 0;
      }
    }
  }

  return incrementalData;
}

export async function loadFullData(): Promise<IUserDataStatistic> {
  const rawData = (await sendMessage("getExtStorage", "userInfo")) as TUserInfoStorageSchema;

  // 提取所有日期
  const allDates = [];
  for (const perSiteUserInfoHistory of Object.values(rawData)) {
    for (const dateStr in perSiteUserInfoHistory) {
      allDates.push(dateStr);
    }
  }

  // 找出最小和最大日期，并生成最小到最大日期之间的所有日期
  const minDate = minDateFn(allDates);
  const maxDate = maxDateFn(allDates);
  const datesInRange = eachDayOfInterval({ start: minDate, end: maxDate }).map((x) => formatDate(x, "yyyy-MM-dd"));

  const siteDateRange: IUserDataStatistic["siteDateRange"] = {};
  const dailyUserInfo: IUserDataStatistic["dailyUserInfo"] = Object.fromEntries(datesInRange.map((x) => [x, {}]));

  console.debug("[PTD] Found UserDataStatistic used date ranges:", datesInRange);

  // 遍历每个站点
  for (const [siteId, perSiteUserInfoHistory] of Object.entries(rawData)) {
    const thisSiteDateRange = Object.keys(perSiteUserInfoHistory);
    const thisSiteMinDate = minDateFn(thisSiteDateRange);
    const thisSiteMaxDate = maxDateFn(thisSiteDateRange);
    const thisSiteDateRangeInInterval = eachDayOfInterval({ start: thisSiteMinDate, end: thisSiteMaxDate }).map((x) =>
      formatDate(x, "yyyy-MM-dd"),
    );
    siteDateRange[siteId] = [thisSiteDateRangeInInterval.at(0)!, thisSiteDateRangeInInterval.at(-1)!];

    let dateData;
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
      }
    }

    console.debug(`[PTD] UserDataStatistic for ${siteId} loaded, date range: ${thisSiteDateRangeInInterval}`);
  }

  // 预计算增量数据
  const incrementalData = calculateIncrementalData(dailyUserInfo, siteDateRange);
  console.debug("[PTD] Incremental data pre-calculated for all sites");

  return { dailyUserInfo, siteDateRange, incrementalData };
}

export function setSubDate(days: number) {
  const today = new Date();
  const subDay = subDays(today, days);

  return eachDayOfInterval({ start: subDay, end: today }).map((x) => formatDate(x, "yyyy-MM-dd"));
}
