/**
 * 辅种路径一致性预检（移植自 PT-Assistant `reseedPath.ts` 的设计，见 docs/pt-assistant-reseed-research.md）。
 *
 * 背景：发送辅种种子时若带「跳过校验」（skip_checking），下载器不会读盘核对 —— 数据实际在 A 目录
 * 而任务把种子挂到 B 目录时，要么当场报错、要么挂着 0 字节做种。这里在发送前判一次
 * 「基准数据所在目录 ↔ 目标目录」是否同一处，不一致则提示。
 *
 * 三条判不出（一律返回 null，宁可漏提示也不误报）：
 * - 任一侧为空（任务目录空 = 交给下载器默认，基准无 savePath = 旧任务/未报告）；
 * - 目标目录含 `$torrent.title$` 等宏或 `<...>` 现场填空 —— 每条会展开成不同目录，没法比；
 * - 无法归一的两个路径。
 */

/** 发送时才展开的占位符：`$torrent.title$` / `$date:YYYY$` 宏，以及 `<...>` 弹输入框写法 */
const PATH_PLACEHOLDER = /\$[^$]+\$|<\.{3}>/;

/**
 * 归一成可比较形状：统一分隔符、折叠重复斜杠（放过开头 `//` 的 UNC）、去尾部斜杠。
 */
export function normalizeTorrentPath(raw?: string | null): string {
  if (typeof raw !== "string") return "";

  const body = raw.trim().replace(/\\/g, "/");
  const unc = body.startsWith("//") ? "//" : "";
  let path = unc + body.slice(unc.length).replace(/\/{2,}/g, "/");
  while (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

/** Windows 样式路径（盘符/UNC）才按不区分大小写比；Linux/QNAP 上 `/vol1/A` 与 `/vol1/a` 是两个目录 */
function isWindowsStylePath(path: string): boolean {
  return /^[a-zA-Z]:\//.test(path) || path.startsWith("//");
}

/** 两个目录是不是同一处。任一侧为空算「不同」 */
export function isSameTorrentPath(a?: string | null, b?: string | null): boolean {
  const left = normalizeTorrentPath(a);
  const right = normalizeTorrentPath(b);
  if (!left || !right) return false;
  if (isWindowsStylePath(left) && isWindowsStylePath(right)) return left.toLowerCase() === right.toLowerCase();
  return left === right;
}

export interface IReseedPathMismatch {
  /** 基准那份数据实际所在 */
  basePath: string;
  /** 这一批辅种种子的目标目录 */
  taskPath: string;
}

/**
 * 基准与目标目录不一致时返回两条原样路径，一致或判不出返回 null（不误报）。
 */
export function detectBasePathMismatch(input: {
  basePath?: string | null;
  taskPath?: string | null;
}): IReseedPathMismatch | null {
  const { basePath, taskPath } = input;
  if (!basePath || !taskPath) return null;
  if (PATH_PLACEHOLDER.test(taskPath)) return null;
  return isSameTorrentPath(basePath, taskPath) ? null : { basePath, taskPath };
}

/** 占位符判断（供 UI 直接复用：含宏的路径无法在此预检） */
export function hasPathPlaceholder(path?: string | null): boolean {
  return typeof path === "string" && PATH_PLACEHOLDER.test(path);
}
