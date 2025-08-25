import { toRaw, isRef, isReactive, isProxy } from "vue";
// Note: filesize library changed type name from FileSizeOptions to FilesizeOptions in v11.0+
import { filesize, type FilesizeOptions } from "filesize";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  differenceInMinutes,
  format as dateFormat,
} from "date-fns";
import { i18n } from "@/options/plugins/i18n.ts";

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
  const objectIterator = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item));
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    if (input && typeof input === "object") {
      return Object.keys(input).reduce((acc, key) => {
        acc[key as keyof typeof acc] = objectIterator(input[key]);
        return acc;
      }, {} as T);
    }
    return input;
  };

  return objectIterator(sourceObj);
}

export const formValidateRules: Record<string, (args?: any) => (v: any) => boolean | string> = {
  require: (args: string = "Item is required") => {
    return (v: any) => !!v || args;
  },
  url: (args: string = "Not url") => {
    return (v: any) => /^(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;[\]]+[-A-Za-z0-9+&@#/%=~_|]$/.test(v) || args;
  },
};

export const formatSize = (size: number | string, options?: FilesizeOptions) => {
  try {
    return filesize(size, { base: 2, round: 2, pad: true, ...(options ?? {}) });
  } catch (e) {
    return size;
  }
};

export const formatDate = (date: Date | number | string, format: string = "yyyy-MM-dd HH:mm:ss") => {
  try {
    return dateFormat(date, format);
  } catch (e) {
    return date;
  }
};

export const formatTimeAgo = (sourceDate: Date | number | string, weekOnly: boolean = false): string => {
  const nowDate = new Date();

  if (weekOnly) {
    const weeks = differenceInWeeks(nowDate, sourceDate);
    if (weeks < 1) {
      return i18n.t("common.time.lessThanAWeek");
    }
    return `${weeks}${i18n.t("common.time.week")}` + i18n.t("common.time.ago");
  }

  const years = differenceInYears(nowDate, sourceDate);
  const months = differenceInMonths(nowDate, sourceDate) % 12;
  const days = differenceInDays(nowDate, sourceDate) % 30;
  const hours = differenceInHours(nowDate, sourceDate) % 24;
  const mins = differenceInMinutes(nowDate, sourceDate) % 60;

  let result;
  if (years > 0) {
    result = `${years}${i18n.t("common.time.year")}${months}${i18n.t("common.time.month")}`;
  } else if (months > 0) {
    result = `${months}${i18n.t("common.time.month")}${days}${i18n.t("common.time.day")}`;
  } else if (days > 0) {
    result = `${days}${i18n.t("common.time.day")}${hours}${i18n.t("common.time.hour")}`;
  } else if (hours > 0) {
    result = `${hours}${i18n.t("common.time.hour")}${mins}${i18n.t("common.time.minute")}`;
  } else if (mins > 0) {
    result = `${mins}${i18n.t("common.time.minute")}`;
  } else {
    result = `< 1${i18n.t("common.time.minute")}`;
  }
  return result + i18n.t("common.time.ago");
};

export const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) =>
  Number(num).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2, ...options });

// 定义单位和对应的阈值
const simplifyNumberUnits = [
  { threshold: 1000000000000, suffix: "T" },
  { threshold: 1000000000, suffix: "B" },
  { threshold: 1000000, suffix: "M" },
  { threshold: 1000, suffix: "K" },
];

// 数字简化函数，将大数字转换为带单位的简化形式（用于bonus相关数字）
export const simplifyNumber = (num: number | string, spacer: string = ""): string => {
  const numValue = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(numValue)) {
    return "-";
  }

  const absNum = Math.abs(numValue);

  // 找到合适的单位
  for (const { threshold, suffix } of simplifyNumberUnits) {
    if (absNum >= threshold) {
      const value = numValue / threshold;
      // 如果是整数，不显示小数点
      return value % 1 === 0 ? value.toString() + spacer + suffix : value.toFixed(2) + spacer + suffix;
    }
  }

  // 小于1000的数字直接返回
  return numValue.toString();
};
