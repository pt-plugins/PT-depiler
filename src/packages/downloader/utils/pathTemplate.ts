import { format as formatDate } from "date-fns";

/**
 * 路径 / 标签模板里支持的变量名（不含两侧的 `$`）。
 *
 * 设置页「路径与标签建议」的说明表格、以及 {@link expandPathTemplate} 的调用方共用这一份名单，
 * 避免变量名在多处各写一遍。
 */
export const PATH_TEMPLATE_VARIABLES = [
  "torrent.title",
  "torrent.subTitle",
  "torrent.category",
  "torrent.site",
  "torrent.siteName",
  "search:keyword",
  "search:plan",
  "date:YYYY",
  "date:MM",
  "date:DD",
] as const;

/** `$date:YYYY$` / `$date:MM$` / `$date:DD$` 三个日期变量的取值 */
export function datePathTemplateVars(now: Date = new Date()): Record<string, string> {
  return {
    "date:YYYY": formatDate(now, "yyyy"),
    "date:MM": formatDate(now, "MM"),
    "date:DD": formatDate(now, "dd"),
  };
}

/** 模板里是否还存在 `$…$` 变量（用于判断是否仍有未解析项） */
export function hasPathTemplateVariable(template: string): boolean {
  return /\$[^$]+\$/.test(template);
}

/**
 * 展开 `$变量$` 形式的路径 / 标签模板。
 *
 * 此前这段逻辑写了三份（`SentToDownloaderDialog`、`KeepUploadTask` 视图、右键菜单的建议目录），
 * 且三份各有细微差异（有的只替换第一处、有的要丢弃未解析项），这里统一：
 *
 * - 一次扫描替换全部变量 → 同一个变量出现多次都会被替换；
 * - **不对替换结果二次扫描** → 种子标题里即使含 `$xxx$` 也不会被当成变量；
 * - `replaceMap` 里没有的变量**原样保留**，调用方可用 {@link hasPathTemplateVariable} 判断；
 * - `options.dropUnresolved` 为 true 时，展开后仍含变量的模板返回 `null` —— 右键菜单里没有 `prompt()`
 *   可用，只能把「依赖当前标签页站点」的目录项直接去掉。
 */
export function expandPathTemplate(
  template: string,
  replaceMap: Record<string, string>,
  options: { dropUnresolved?: boolean } = {},
): string | null {
  const expanded = template.replace(/\$([^$]+)\$/g, (matched, key: string) =>
    Object.hasOwn(replaceMap, key) ? replaceMap[key] : matched,
  );

  return options.dropUnresolved && hasPathTemplateVariable(expanded) ? null : expanded;
}
