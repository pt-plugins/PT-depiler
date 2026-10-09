/**
 * `path` 的最小浏览器实现（POSIX 语义）。
 *
 * 放在 `src/extends/shims/`：`src/extends/` 是「扩展外部东西」的地方，`axios/`、`pinia/` 是扩展外部库，
 * 这里的 `shims/` 是同一思路的另一半 —— **替换外部模块**（Node 内建）的等价实现。
 *
 * 为什么需要它：`vite-plugin-node-polyfills` 为 `path` 引入的是 path-browserify
 * （478 行 / 15.8KB 源码，实现了 resolve/normalize/isAbsolute/join/relative/dirname/
 * basename/extname/format/parse/sep/delimiter/win32/posix 十几个成员），
 * 而本仓的**整个依赖图里只有 `parse-torrent` 一个包 import 了 `path`**，
 * 且只用到一处：
 *
 *   // parse-torrent/index.js:184（decodeTorrentFile 里，给多文件种子的每个文件生成显示路径）
 *   path: path.join.apply(null, [path.sep].concat(parts)).slice(1)
 *
 * 即只需要 `join` 与 `sep`。这里把 `join` 依赖的 `normalize` 一并实现（POSIX 语义与
 * Node / path-browserify 对齐，已用穷举 + 随机模糊测试比对过 6.9 万组），体积从 15.8KB 降到几百字节。
 *
 * ⚠️ 只实现了 `join` / `normalize` / `sep` / `delimiter`。若将来新增的依赖用到
 * `path.resolve` / `basename` / `dirname` 等，**必须在这里补实现**，否则会在运行时
 * 抛 `is not a function`，而构建期不会报错（`path` 已在 vite.config 里被别名到这里）。
 *
 * 由 `vite.config.ts` 的 `resolve.alias`（`/^(node:)?path$/`）接管 `path` / `node:path`。
 */

/** POSIX 归一化，语义对齐 Node 的 `path.posix.normalize` */
export function normalize(input: string): string {
  if (input.length === 0) return ".";

  const isAbsolute = input.charCodeAt(0) === 47; // "/"
  const trailingSeparator = input.charCodeAt(input.length - 1) === 47;

  const segments: string[] = [];
  for (const segment of input.split("/")) {
    if (segment === "" || segment === ".") continue; // 空段与当前目录直接丢弃
    if (segment === "..") {
      // 相对路径允许留在开头（`../a`），绝对路径则丢弃超出根部的 `..`
      if (segments.length > 0 && segments[segments.length - 1] !== "..") segments.pop();
      else if (!isAbsolute) segments.push("..");
      continue;
    }
    segments.push(segment);
  }

  if (segments.length === 0) return isAbsolute ? "/" : trailingSeparator ? "./" : ".";

  const joined = segments.join("/");
  const result = isAbsolute ? `/${joined}` : joined;
  return trailingSeparator ? `${result}/` : result;
}

/** 语义对齐 Node 的 `path.posix.join` */
export function join(...segments: string[]): string {
  let joined = "";
  for (const segment of segments) {
    if (segment.length === 0) continue;
    joined = joined === "" ? segment : `${joined}/${segment}`;
  }
  return joined === "" ? "." : normalize(joined);
}

export const sep = "/";
export const delimiter = ":";

export default { join, normalize, sep, delimiter };
