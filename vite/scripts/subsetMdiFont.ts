/**
 * 构建产物收尾：把 dist 里的 MDI 字体与图标 CSS 换成**子集版本**。
 *
 * 用法：`tsx vite/scripts/subsetMdiFont.ts [distDir]`（默认 `dist-${TARGET || "chrome"}`）。
 *
 * 为什么是独立脚本而不是 vite 插件：`vite-plugin-web-extension` 会把同一份 config 跑成
 * 多个 build step（options / background / content-script），`public/` 的拷贝时机在插件间不可靠，
 * 而本步骤必须在**所有**产物都拷完之后执行 —— 独立脚本放在 `vite build` 之后，顺序是确定的。
 *
 * ⚠️ 只写 dist：`public/lib/mdi/` 始终保持完整版（既是运行时开发用的字体，也是本步骤的真值来源）。
 *
 * ⚠️ 子集字体必须补回 BMP 的 cmap 兼容桩（issue #1669）：MDI 码位全在补充私用平面，harfbuzz 重建
 * cmap 后只剩 format 12；Windows GDI 字体后端（`--disable-direct-write`，MacType 用户的常规做法）
 * 会把字体交给 `AddFontMemResourceEx` 安装，安装器只认 BMP 的 format 4，字体面创建失败 →
 * 全部图标变成缺字方块。上游全量字体里那张零映射的 (3,1) format 4 就是为此存在的。
 * 做法：先以 `sfnt` 输出子集 → 补表并重建校验和（`../utils/sfnt.ts`）→ 再压成 woff2；
 * 文件名与 `format("woff2")` 都不变，页面与 content-script 无需改动。
 */
import fs from "node:fs";
import path from "node:path";
import fontverter from "fontverter";
import subsetFont from "subset-font";

import {
  MDI_CSS_PATH,
  MDI_FONT_PATH,
  collectMdiIconUsage,
  parseMdiCss,
  planMdiSubset,
  subsetMdiCss,
} from "../utils/mdiIcons.ts";
import { ensureBmpCmapSubtable, hasBmpCmapSubtable, readCmapSubtables } from "../utils/sfnt.ts";

const root = process.cwd();
const outDir = process.argv[2] || `dist-${process.env.TARGET || "chrome"}`;

const fontPath = path.resolve(root, MDI_FONT_PATH);
const cssPath = path.resolve(root, MDI_CSS_PATH);
const outMdiDir = path.resolve(root, outDir, "lib/mdi");

const css = fs.readFileSync(cssPath, "utf8");
const tables = parseMdiCss(css);
const usage = collectMdiIconUsage(tables, root);
const plan = planMdiSubset(tables, usage);

if (plan.missing.length > 0) {
  console.error(
    `\n✗ MDI 图标名在源码里用到、但 ${MDI_CSS_PATH} 中不存在（拼写错误？版本不含？）：\n` +
      plan.missing.map((name) => `    mdi-${name}`).join("\n") +
      `\n  这些图标**不会**被渲染出来，请修正名字或改用存在的图标。\n`,
  );
  process.exit(1);
}

if (!fs.existsSync(outMdiDir)) {
  console.error(`✗ 找不到 ${path.relative(root, outMdiDir)} —— 请先跑 vite build（本脚本只处理已生成的产物）`);
  process.exit(1);
}

// 1) 字体子集化：先出 sfnt，补回 BMP 兼容桩后再压成 woff2（见文件头 issue #1669 说明）
const sourceFont = fs.readFileSync(fontPath);
const subsetText = String.fromCodePoint(...plan.codepoints);
const subsettedSfnt = await subsetFont(sourceFont, subsetText, { targetFormat: "sfnt" });
const { font: patchedSfnt, added: addedBmpStub } = ensureBmpCmapSubtable(subsettedSfnt);
const subsettedFont = await fontverter.convert(patchedSfnt, "woff2");

// 2) 图标 CSS 只保留用到的规则（基础块 / @keyframes / 尺寸类 / 深浅色等原样保留）
const keepNames = new Set([...plan.names, ...plan.utilities]);
const subsettedCss = subsetMdiCss(css, keepNames);

fs.writeFileSync(path.join(outMdiDir, "webfont.woff2"), subsettedFont);
fs.writeFileSync(path.join(outMdiDir, "icons.css"), subsettedCss);

const describeCmap = (font: Buffer) =>
  readCmapSubtables(font)
    .map((s) => `(${s.platformID},${s.encodingID}) fmt${s.format}`)
    .join(" + ");

// 3) 自检一：产物 woff2 解回来必须带 BMP 的 (3,1) format 4 子表
//    （丢了它 → Windows GDI 字体后端装不上字体、图标全变方块，而默认的 DirectWrite 看不出来）
const emittedFont = fs.readFileSync(path.join(outMdiDir, "webfont.woff2"));
const emittedSfnt = await fontverter.convert(emittedFont, "sfnt");
if (!hasBmpCmapSubtable(emittedSfnt)) {
  console.error(
    `✗ 子集字体的 cmap 缺少 (3,1) format 4 子表 —— Windows GDI 字体后端（--disable-direct-write）\n` +
      `  会无法创建字体面，全部图标变成缺字方块（issue #1669）。\n` +
      `  实际 cmap 子表：${describeCmap(emittedSfnt) || "（无）"}`,
  );
  process.exit(1);
}

// 4) 自检二：产出的 CSS 必须覆盖全部用到的名字（名字扫到了、CSS 里却漏规则 = 图标静默消失）
const emittedCss = fs.readFileSync(path.join(outMdiDir, "icons.css"), "utf8");
const emittedNames = new Set([...emittedCss.matchAll(/\.mdi-([a-z0-9-]+)\s*::?\s*before/g)].map((m) => m[1]));
const uncovered = [...keepNames].filter((name) => !emittedNames.has(name));
if (uncovered.length > 0) {
  console.error(`✗ 子集 CSS 未覆盖以下图标名（会静默消失）：${uncovered.join(", ")}`);
  process.exit(1);
}

const kb = (bytes: number) => (bytes / 1024).toFixed(1) + " KB";
console.log(
  `[PTD] MDI 子集化 → ${path.relative(root, outMdiDir).replace(/\\/g, "/")}\n` +
    `  webfont.woff2 : ${kb(sourceFont.length)} → ${kb(subsettedFont.length)}` +
    `   （字形 ${tables.codepointByName.size} → ${plan.names.length}；cmap ${describeCmap(emittedSfnt)}` +
    `${addedBmpStub ? "，已补回 BMP 兼容桩" : ""}）\n` +
    `  icons.css     : ${kb(Buffer.byteLength(css))} → ${kb(Buffer.byteLength(subsettedCss))}` +
    `   （规则 ${tables.ruleNames.size} → ${emittedNames.size}）\n` +
    `  合计省下      : ${kb(sourceFont.length + Buffer.byteLength(css) - subsettedFont.length - Buffer.byteLength(subsettedCss))}` +
    (plan.utilities.length
      ? `\n  无字形工具类（不进字体，保留 CSS）：${plan.utilities.map((n) => "mdi-" + n).join(", ")}`
      : ""),
);
