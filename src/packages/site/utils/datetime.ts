import { add, sub, parse, isValid, format, type DurationUnit } from "date-fns";

export type timezoneOffset = `${"UTC" | ""}${"-" | "+"}${number}`;
export type isoDuration = `P${string}`;

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
  years: ["年", "year", "yr"],
  quarters: ["季度", "quarter", "qtr"],
  months: ["月", "month", "mo"],
  weeks: ["周", "week", "wk"],
  days: ["天", "day"],
  hours: ["时", "hour", "hr"],
  minutes: ["分", "minute", "min"],
  seconds: ["秒", "second", "sec"],
};

export function parseTimeToLive(ttl: string): number | string {
  // A flag to check if we have successfully parsed any unit
  let parsed = false;

  // Deep copy of ttl to avoid side effects
  let ttlTemp = ttl;

  // 处理原始字符串中的非标准Unit
  for (const [k, v] of Object.entries(nonStandDateUnitMap)) {
    for (const unit of v) {
      if (ttlTemp.includes(unit)) {
        // 防止连续替换 (raw) second -> (second) seconds -> (sec) secondsonds
        ttlTemp = ttlTemp.replace(unit, `${k} `);
        break;
      }
    }
  }

  let nowDate = new Date();
  dateUnit.forEach((v) => {
    const matched = ttlTemp.match(new RegExp(`([.\\d]+) ?(${v}s?)`));
    if (matched) {
      parsed = true;
      const amount = parseFloat(matched[1]);
      switch (v) {
        case "quarters":
          nowDate = sub(nowDate, { months: amount * 3 });
          break;
        case "years":
        case "months":
        case "weeks":
        case "days":
        case "hours":
        case "minutes":
        case "seconds":
          nowDate = sub(nowDate, { [v]: amount });
          break;
      }
    }
  });

  return parsed ? +nowDate : ttl;
}

export function parseValidTimeString(query: string, formatString: string[] = []): number | string {
  for (const f of [...formatString, "yyyy-MM-dd'T'HH:mm:ssXXX", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm:ss.SSS"]) {
    let time = parse(query, f, new Date());
    if (isValid(time)) {
      return +time;
    }
  }
  return query;
}

export function parseTimeWithZone(time: number | string, timezoneOffset: timezoneOffset = "+0000"): number {
  let result = time;
  // 标准时间戳需要 * 1000
  if (/^(\d){10}$/.test(result + "")) {
    result = parseInt(result + "") * 1000;
  }
  // 时间格式按 ISO 8601 标准设置，如：2020-01-01T00:00:01+0800
  const datetime = format(new Date(result), "yyyy-MM-dd'T'HH:mm:ss");
  return +new Date(`${datetime}${timezoneOffset}`);
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
  const timeDelta = {
    years: years ? parseInt(years, 10) : 0,
    months: months ? parseInt(months, 10) : 0,
    weeks: weeks ? parseInt(weeks, 10) : 0,
    days: days ? parseInt(days, 10) : 0,
    hours: hours ? parseInt(hours, 10) : 0,
    minutes: minutes ? parseInt(minutes, 10) : 0,
    seconds: seconds ? parseInt(seconds, 10) : 0,
  };

  return (
    timeDelta.years * 365 * 24 * 3600 +
    timeDelta.months * 30 * 24 * 3600 +
    timeDelta.weeks * 7 * 24 * 3600 +
    timeDelta.days * 24 * 3600 +
    timeDelta.hours * 3600 +
    timeDelta.minutes * 60 +
    timeDelta.seconds
  );
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
