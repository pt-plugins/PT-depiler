import { toRaw, isRef, isReactive, isProxy } from "vue";
import { filesize, type FileSizeOptions } from "filesize";
import { format as dateFormat } from "date-fns";
import { EResultParseStatus } from "@ptd/site";

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

export const formatSize = (size: number | string, options?: FileSizeOptions) => {
  try {
    return filesize(size, { base: 2, ...(options ?? {}) });
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
export const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) =>
  Number(num).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2, ...options });

// FIXME 临时先放在这里，后面再调整为一个 component
export const ResultParseStatusMap: Record<EResultParseStatus, string> = {
  [EResultParseStatus.unknownError]: "未知错误！",
  [EResultParseStatus.waiting]: "队列等待中...",
  [EResultParseStatus.working]: "正在搜索中...",
  [EResultParseStatus.success]: "搜索成功！",
  [EResultParseStatus.parseError]: "解析错误",
  [EResultParseStatus.passParse]: "未启用搜索！",
  [EResultParseStatus.needLogin]: "需要登录！",
  [EResultParseStatus.noResults]: "无结果！",
};
