import { eachDayOfInterval, subDays, min as minDateFn, max as maxDateFn, format as formatDate } from "date-fns";
import { EResultParseStatus, TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { type IStoredUserInfo, TUserInfoStorageSchema } from "@/shared/types.ts";

export interface IUserDataStatistic {
  siteDateRange: Record<TSiteID, [string, string]>;
  dailyUserInfo: Record<string, Record<TSiteID, IStoredUserInfo>>;
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

  return { dailyUserInfo, siteDateRange };
}

export function setSubDate(days: number) {
  const today = new Date();
  const subDay = subDays(today, days);

  return eachDayOfInterval({ start: subDay, end: today }).map((x) => formatDate(x, "yyyy-MM-dd"));
}
