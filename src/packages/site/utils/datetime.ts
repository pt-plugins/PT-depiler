import { sub, parse, isValid, format, type DurationUnit } from "date-fns";

export type timezoneOffset = `${"UTC" | ""}${"-" | "+"}${number}`;

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

export function parseTimeToLive(ttl: string): number {
  // 处理原始字符串中的非标准Unit
  for (const [k, v] of Object.entries(nonStandDateUnitMap)) {
    for (const unit of v) {
      ttl = ttl.replace(unit, k);
    }
  }

  let nowDate = new Date();
  dateUnit.forEach((v) => {
    const matched = ttl.match(new RegExp(`([.\\d]+) ?(${v}s?)`));
    if (matched) {
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

  return +nowDate;
}

export function parseValidTimeString(query: string, format: string[] = []): number | string {
  for (const f of [...format, "yyyy-MM-dd'T'HH:mm:ssXXX", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm:ss.SSS"]) {
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
