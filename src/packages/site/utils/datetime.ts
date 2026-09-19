import { add, sub, parse, isValid, format, type DurationUnit } from "date-fns";

export type timezoneOffset = `${"UTC" | ""}${"-" | "+"}${number}`;
export type isoDuration = `P${string}`;

enum DateUnitDuration {
  Second = 1,
  Minute = 60 * Second,
  Hour = 60 * Minute,
  Day = 24 * Hour,
  Week = 7 * Day,
  Month = 30 * Day,
  Quarter = 3 * Month,
  Year = 365 * Day,
}

export const dateUnit: Array<DurationUnit | "quarters"> = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] as const;

export const nonStandDateUnitMap: Record<(typeof dateUnit)[number], string[]> = {
  years: ["年", "year", "yr", "Y"],
  quarters: ["季度", "quarter", "qtr"],
  months: ["個月", "月", "month", "mo", "M"],
  weeks: ["周", "week", "wk", "W"],
  days: ["天", "day", "D"],
  hours: ["小時", "时", "hour", "hr", "h"],
  minutes: ["分鐘", "分", "minute", "min", "m"],
  seconds: ["秒", "second", "sec", "s"],
};

const dateUnitToSecondsMap: Record<(typeof dateUnit)[number], number> = {
  years: DateUnitDuration.Year,
  quarters: DateUnitDuration.Quarter,
  months: DateUnitDuration.Month,
  weeks: DateUnitDuration.Week,
  days: DateUnitDuration.Day,
  hours: DateUnitDuration.Hour,
  minutes: DateUnitDuration.Minute,
  seconds: DateUnitDuration.Second,
};

export function parseTimeToLiveToSeconds(ttl: string): number | string {
  // A flag to check if we have successfully parsed any unit
  let parsed = false;

  // Deep copy of ttl to avoid side effects
  let ttlTemp = ttl;

  // 处理原始字符串中的非标准Unit
  for (const [k, v] of Object.entries(nonStandDateUnitMap)) {
    // 若单位为单字符，为避免误匹配，追加一个先行断言
    const unitConvArr = v.map((str) => (/^[A-Za-z]$/.test(str) ? `${str}(?=\\s|$)` : str));
    const regex = new RegExp(`(\\d+)\\s*(${unitConvArr.join("|")})`, "g");
    ttlTemp = ttlTemp.replace(regex, `$1 ${k}`);
  }

  let seconds = 0;
  dateUnit.forEach((v) => {
    const matched = ttlTemp.match(new RegExp(`([.\\d]+) ?(${v}s?)`));
    if (matched) {
      parsed = true;
      const amount = parseFloat(matched[1]);
      seconds += amount * dateUnitToSecondsMap[v];
    }
  });

  return parsed ? seconds : ttl;
}

export function parseTimeToLiveToDate(ttl: string): number | string {
  const parsedTTL = parseTimeToLiveToSeconds(ttl);
  if (typeof parsedTTL === "string") return parsedTTL;
  return +sub(new Date(), { seconds: parsedTTL });
}

export function parseValidTimeString(query: string, formatString: string[] = []): number | string {
  for (const f of [...formatString, "yyyy-MM-dd'T'HH:mm:ssXXX", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm:ss.SSS"]) {
    let time = parse(query, f, new Date());
    if (isValid(time)) {
      return +time;
    }
  }

  // 尝试使用原生 Date 构造函数，它能处理很多常见格式
  let nativeDate = new Date(query);
  if (isValid(nativeDate)) {
    return +nativeDate;
  }

  return query;
}

/**
 * 将时间解析为时间戳。
 *
 * timezoneOffset 表示**输入时间所采用的时区**，即站点本地时间相对 UTC 的偏移：
 * - 输入为字符串（如 "2024-03-01 10:00:00"）时，该字符串是站点的墙上时间，
 *   按其偏移换算为 UTC 时间戳；该墙上时间不随时间变化（如 "-0400" 的站点在
 *   夏令时期间仍按同一偏移解析）。
 * - 输入为 Unix 时间戳（秒或毫秒）时，它已经是绝对时间，本函数直接原样返回，
 *   不再套用偏移——否则偏移会被重复计算，且解析结果依赖运行主机的本地时区。
 *
 * @param time 时间字符串或 Unix 时间戳（秒/毫秒）
 * @param timezoneOffset 输入时间所属时区的偏移，如 "+0800"
 */
export function parseTimeWithZone(time: number | string, timezoneOffset: timezoneOffset = "+0000"): number {
  // Unix 时间戳（秒/毫秒，含纯数字字符串）本身就是绝对时间，无需也无法再做时区换算
  if (typeof time === "number" || /^\d+$/.test(time)) {
    const timestamp = Number(time);
    // 10 位及以下视为秒级时间戳
    return String(Math.trunc(timestamp)).length <= 10 ? timestamp * 1000 : timestamp;
  }

  // 字符串形式为站点本地的墙上时间，显式按其偏移构造，避免依赖运行主机的本地时区
  const [, offsetSign, offsetHours, offsetMinutes] = timezoneOffset.match(/^(?:UTC)?([+-])(\d{1,2})(\d{2})$/) ?? [];
  let result = time;
  if (offsetSign) {
    const offset = `${offsetSign}${offsetHours.padStart(2, "0")}:${offsetMinutes}`;
    // 时间格式按 ISO 8601 标准设置，如：2020-01-01T00:00:01+08:00
    const datetime = format(new Date(time), "yyyy-MM-dd'T'HH:mm:ss");
    result = `${datetime}${offset}`;
  }

  return +new Date(result);
}

export function convertIsoDurationToDate(duration: isoDuration, timestamp: number): number {
  let date = new Date(timestamp);
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const match = duration.match(regex);
  if (match) {
    const [, years, months, weeks, days, hours, minutes, seconds] = match;
    const timeDelta = {
      years: years ? parseInt(years, 10) : 0,
      months: months ? parseInt(months, 10) : 0,
      weeks: weeks ? parseInt(weeks, 10) : 0,
      days: days ? parseInt(days, 10) : 0,
      hours: hours ? parseInt(hours, 10) : 0,
      minutes: minutes ? parseInt(minutes, 10) : 0,
      seconds: seconds ? parseInt(seconds, 10) : 0,
    };
    date = add(date, timeDelta);
  }
  return date.getTime();
}

export function convertIsoDurationToSeconds(duration: string): number {
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const match = duration.toUpperCase().match(regex);
  if (!match) return 0;
  const [, years, months, weeks, days, hours, minutes, seconds] = match;
  const timeDelta: Record<DurationUnit, number> = {
    years: years ? parseInt(years, 10) : 0,
    months: months ? parseInt(months, 10) : 0,
    weeks: weeks ? parseInt(weeks, 10) : 0,
    days: days ? parseInt(days, 10) : 0,
    hours: hours ? parseInt(hours, 10) : 0,
    minutes: minutes ? parseInt(minutes, 10) : 0,
    seconds: seconds ? parseInt(seconds, 10) : 0,
  };

  return (Object.keys(timeDelta) as DurationUnit[]).reduce((sum, k) => {
    return sum + timeDelta[k] * dateUnitToSecondsMap[k];
  }, 0);
}

/**
 * 将秒数转换为ISO duration格式
 * 主要用于将时间长度转换为标准的ISO 8601 duration格式
 * 只包含日期部分（年、月、周、天），忽略时间部分（时、分、秒）
 */
export function convertSecondsToIsoDuration(seconds: number): isoDuration {
  if (seconds <= 0) return "P0D";

  const years = Math.floor(seconds / (365 * 24 * 3600));
  const remainingAfterYears = seconds % (365 * 24 * 3600);

  const months = Math.floor(remainingAfterYears / (30 * 24 * 3600));
  const remainingAfterMonths = remainingAfterYears % (30 * 24 * 3600);

  const weeks = Math.floor(remainingAfterMonths / (7 * 24 * 3600));
  const remainingAfterWeeks = remainingAfterMonths % (7 * 24 * 3600);

  const days = Math.floor(remainingAfterWeeks / (24 * 3600));

  let duration = "P";

  if (years > 0) duration += `${years}Y`;
  if (months > 0) duration += `${months}M`;
  if (weeks > 0) duration += `${weeks}W`;
  if (days > 0) duration += `${days}D`;

  // 如果所有值都为0，返回P0D
  if (duration === "P") duration = "P0D";

  return duration as isoDuration;
}
