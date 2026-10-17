/**
 * 把文件名里不能用于 Windows 路径的字符替换成 `_`。
 *
 * 为什么需要它：`chrome.downloads.download()` 会**严格校验** `filename`，碰到非法字符直接以
 * `Invalid filename` 失败；而 `<a download>` 那条路由浏览器兜底、会静默替换掉 `:` 之类。
 * 仓库里默认的导出名就带时间（如 `Rhilip的时间轴（2026-10-17 08:34:00）.png`），
 * 其中的 `:` 在 Windows 上非法 —— 不处理必然失败。
 *
 * 规则：Windows 保留字符 `< > : " / \ | ? *` 与控制字符 → `_`（`/` `\` 一并替换，下载接口会把
 * 它们当成路径分隔符）；结尾的点与空格去掉（Windows 会把它们吃掉）；结果为空时回落到 `download`。
 */
export function sanitizeFilename(filename: string): string {
  return (
    filename
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .replace(/[. ]+$/, "")
      .trim() || "download"
  );
}
