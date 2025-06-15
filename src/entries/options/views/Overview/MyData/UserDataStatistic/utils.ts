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

  // 提取所有日期并去重
  const allDatesSet = new Set<string>();
  for (const perSiteUserInfoHistory of Object.values(rawData)) {
    for (const dateStr in perSiteUserInfoHistory) {
      allDatesSet.add(dateStr);
    }
  }
  const allDates = Array.from(allDatesSet);

  // 找出最小和最大日期，并生成最小到最大日期之间的所有日期
  const minDate = minDateFn(allDates);
  const maxDate = maxDateFn(allDates);
  const datesInRange = eachDayOfInterval({ start: minDate, end: maxDate }).map((x) => formatDate(x, "yyyy-MM-dd"));

  const siteDateRange: IUserDataStatistic["siteDateRange"] = {};
  const dailyUserInfo: IUserDataStatistic["dailyUserInfo"] = Object.fromEntries(datesInRange.map((x) => [x, {}]));
  const incrementalData: IUserDataStatistic["incrementalData"] = {};

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
  const subDay = subDays(today, days);
  const endDay = subDays(today, 1); // 不包含今天，使用昨天作为结束日期

  return eachDayOfInterval({ start: subDay, end: endDay }).map((x) => formatDate(x, "yyyy-MM-dd"));
}
