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
import { sanitizeFilename } from "@ptd/utils/filename.ts";

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
    return date as string;
  }
};

interface formatTimeAgoOptions {
  weekOnly?: boolean; // 是否只显示周数（即小于一周的显示为“不到一周”）
  spacer?: string; // 年月日等单位之间的分隔符，默认为一个空格
}

export const formatTimeAgo = (sourceDate: Date | number | string, options: formatTimeAgoOptions = {}): string => {
  const nowDate = new Date();

  const { weekOnly = false, spacer = " " } = options;

  if (weekOnly) {
    const weeks = differenceInWeeks(nowDate, sourceDate);
    if (weeks < 1) {
      return i18n.t("common.time.lessThanAWeek");
    }
    return `${weeks}${spacer}${i18n.t("common.time.week")}` + i18n.t("common.time.ago");
  }

  const years = differenceInYears(nowDate, sourceDate);
  const months = differenceInMonths(nowDate, sourceDate) % 12;
  const days = differenceInDays(nowDate, sourceDate) % 30;
  const hours = differenceInHours(nowDate, sourceDate) % 24;
  const mins = differenceInMinutes(nowDate, sourceDate) % 60;

  let result;
  if (years > 0) {
    result = `${years}${spacer}${i18n.t("common.time.year")}${spacer}${months}${spacer}${i18n.t("common.time.month")}`;
  } else if (months > 0) {
    result = `${months}${spacer}${i18n.t("common.time.month")}${spacer}${days}${spacer}${i18n.t("common.time.day")}`;
  } else if (days > 0) {
    result = `${days}${spacer}${i18n.t("common.time.day")}${spacer}${hours}${spacer}${i18n.t("common.time.hour")}`;
  } else if (hours > 0) {
    result = `${hours}${spacer}${i18n.t("common.time.hour")}${spacer}${mins}${spacer}${i18n.t("common.time.minute")}`;
  } else if (mins > 0) {
    result = `${mins}${spacer}${i18n.t("common.time.minute")}`;
  } else {
    result = `< 1${spacer}${i18n.t("common.time.minute")}`;
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
      return value.toFixed(2) + spacer + suffix;
    }
  }

  // 小于1000的数字直接返回
  return numValue.toFixed(2);
};

/**
 * 让出一帧，等浏览器把**当前**的 DOM（例如刚置位的按钮 loading）真正画出来再继续。
 *
 * 为什么不是 `nextTick()`：Vue 的 nextTick 只在微任务里 flush DOM 更新，此时浏览器还没绘制 ——
 * 紧接着执行的同步重活（konva 的 `toCanvas()` 会按 `pixelRatio` 新建画布并**同步**重绘整棵节点树）
 * 会把这帧占满，用户看到的就是「先卡死一下，转圈才出现」。
 *
 * 双 rAF：第一个 rAF 在下一帧绘制前触发，第二个 rAF 说明这一帧已经画完了。
 */
export function nextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/**
 * 触发一次文件下载（导出用户信息 / 历史数据 / 搜索方案 / 统计图 …）。
 *
 * 以前用 `file-saver` 的 `saveAs`（一个 2020 年起不再维护的包），它做的事是在页面里插一个
 * `<a download>` 再点击。扩展里没必要绕这一圈：把 Blob 变成 object URL 后直接交给
 * `chrome.downloads.download`（options 本身就是扩展页面，有 `downloads` 权限，不必再经后台转发），
 * 文件会走浏览器自己的下载链路。
 *
 * ⚠️ 只有扩展页面（options / offscreen / SW）能这么调；content script 上下文没有 `chrome.downloads`，
 * 所以本函数只供 options 使用。
 *
 * 失败只记日志不抛（调用点原本也是「触发即不管」），返回 downloadId 便于需要时跟进。
 */
export async function downloadBlob(blob: Blob, filename: string): Promise<number | undefined> {
  const blobUrl = URL.createObjectURL(blob);
  // chrome.downloads 会**严格校验** filename（非法字符直接 `Invalid filename` 失败），
  // 而默认导出名带时间「（2026-10-17 08:34:00）」—— 其中的 `:` 在 Windows 上非法，必须先清洗
  const safeFilename = sanitizeFilename(filename);

  try {
    const downloadId = await chrome.downloads.download({
      url: blobUrl,
      filename: safeFilename,
      conflictAction: "uniquify",
    });

    // downloads.download 返回时只是「已创建下载」，必须等它读完才能回收 object URL，否则下载会中途失败
    const onChanged = (delta: chrome.downloads.DownloadDelta) => {
      if (delta.id !== downloadId) return;
      const state = delta.state?.current;
      if (state === "complete" || state === "interrupted") {
        chrome.downloads.onChanged.removeListener(onChanged);
        URL.revokeObjectURL(blobUrl);
      }
    };
    chrome.downloads.onChanged.addListener(onChanged);

    return downloadId;
  } catch (e) {
    URL.revokeObjectURL(blobUrl);
    console.error(`[PTD] 下载 ${filename} 失败：`, e);
    return undefined;
  }
}
