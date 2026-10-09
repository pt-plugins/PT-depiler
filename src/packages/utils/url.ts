/**
 * URL / form 编码助手（`@ptd/utils`）。
 *
 * 背景：原先这些位置用的是 `urlencode` 包，它的 ESM 入口**第一行**就
 * `import iconv from "iconv-lite"`，而 `stringify → encodeComponent → encode → iconv`
 * 全链路静态可达，rollup 无法 tree-shake —— 于是哪怕只用一个 URL 拼接函数，
 * 整个 iconv-lite 编码表（独立打包实测 486.7KB）也会被打进产物。
 * 在 MV3 Service Worker 里这个代价最刺眼：`dist-chrome/src/entries/background/main.js`
 * 实测 460.7KB，里面能直接搜到 gb18030 / cp936 / shiftjis / big5 的编码表。
 *
 * 本仓库真正用到的只有「UTF-8 的百分号编码/解码」与「ascii 单字节解码」两类，
 * 下面两个函数就是这两类的全部实现，不引入任何依赖。
 *
 * 注意：本文件刻意不依赖 `import.meta.env` 等构建期注入，便于用纯 node 直接跑自检。
 */

/**
 * 把扁平对象序列化成 query string / `application/x-www-form-urlencoded` 表单体。
 *
 * 编码交给平台自带的 `URLSearchParams`（它就是 `application/x-www-form-urlencoded`
 * 的规范实现），这里只补它不覆盖的三处语义，以保持与原 `urlencode.stringify` 一致：
 *
 * 1. `null` / `undefined` → `key=`（`URLSearchParams` 会给出 `key=null` / `key=undefined`，
 *    那会把字面量 "undefined" 真的发给站点，必须拦）；
 * 2. 数组 → `key[0]=..&key[1]=..`（`URLSearchParams` 会逗号拼接；本仓库当前无此调用点，
 *    保留旧语义以免将来传入时静默改变请求）；
 * 3. 空字符串键跳过。
 *
 * 与旧实现**有意的两处差异**（已验证不影响现有消费方）：
 * - 空格编成 `+` 而不是 `%20`：vue-router 的 `parseQuery` 会先把 `+` 还原成空格
 *   （`vue-router.esm-browser.js` 的 `searchParam.replace(PLUS_RE, " ")`），
 *   而 POST 表单体本来就以 `+` 表示空格，更贴近规范；
 * - `! ' ( ) ~` 会被百分号编码（旧实现经 `encodeURIComponent` 保留原字符）：
 *   两者解码后完全等价。
 *
 * **不支持嵌套对象**（本仓库没有这种调用场景）：会被 `String()` 成 `[object Object]`。
 */
export function stringifyQuery(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  const append = (key: string, value: unknown) => {
    params.append(key, value === null || value === undefined ? "" : String(value));
  };

  for (const [key, value] of Object.entries(obj)) {
    if (key === "") {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => append(`${key}[${index}]`, item));
    } else {
      append(key, value);
    }
  }

  return params.toString();
}

/**
 * 百分号解码。
 *
 * @param charset 缺省 / `utf-8`：等价于 `decodeURIComponent`（非法序列会抛 URIError，与原实现一致）；
 *                `ascii`：**7-bit** 单字节解码 —— `0x00..0x7F` 映射为同码点字符，`0x80..0xFF`
 *                落到 U+FFFD。这与原先 `urlencode.decode(str, "ascii")` → `iconv-lite` 的
 *                `ascii` 编解码器逐字节一致（iconv-lite 的 ascii 只定义了下半区 128 个字符）。
 *
 *                该路径用于解析 Content-Disposition 里没有显式 charset 的 `filename=` 值；
 *                非 ASCII 文件名在这里被损坏是**原有行为**（调用方随后会用 `isValidFilename`
 *                决定是否采信），本次替换不做行为变更。
 */
export function decodePercent(str: string, charset?: string): string {
  const normalized = (charset ?? "").toLowerCase().replace(/-/g, "");
  if (normalized === "" || normalized === "utf8") {
    return decodeURIComponent(str);
  }

  const toAsciiChar = (byte: number) => (byte < 0x80 ? String.fromCharCode(byte) : "\uFFFD");

  let result = "";
  for (let i = 0; i < str.length;) {
    if (str[i] === "%") {
      // 与原实现一致：不校验十六进制合法性，解析不出来就按 0 处理
      const byte = parseInt(str.substring(i + 1, i + 3), 16) || 0;
      result += toAsciiChar(byte);
      i += 3;
    } else {
      // 与原实现一致：非百分号字符按单字节处理（>0xFF 的码点同 Buffer.from 一样截断）
      result += toAsciiChar(str.charCodeAt(i) & 0xff);
      i += 1;
    }
  }
  return result;
}
