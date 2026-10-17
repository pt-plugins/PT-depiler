/**
 * MDI 图标名的静态校验（跑在 `pnpm check` 里，不写任何文件）。
 *
 * 两件事：
 *  1. 源码里用到的 `mdi-<name>`（含 Konva 路径那种**字面私有区字符**）都必须存在于
 *     `public/lib/mdi/icons.css` —— 否则运行时表现为「图标静默消失」；
 *  2. 提示动态拼接点（`` `mdi-${…}` ``），其取值记在 `vite/mdiIcons.ts` 的 `DYNAMIC_MDI_NAMES`，
 *     改了那两处源码取值时要同步。
 *
 * 产物层面的「子集 CSS 是否覆盖全部用到的名字」由 `vite/subsetMdiFont.ts` 在构建后自检
 * （产物检查必须排在构建之后，见审计 §6.11）。
 */
import path from "node:path";
import fs from "node:fs";

import { DYNAMIC_MDI_NAMES, MDI_CSS_PATH, collectMdiIconUsage, parseMdiCss, planMdiSubset } from "./mdiIcons.ts";

const root = process.cwd();
const tables = parseMdiCss(fs.readFileSync(path.resolve(root, MDI_CSS_PATH), "utf8"));
const usage = collectMdiIconUsage(tables, root);
const plan = planMdiSubset(tables, usage);

const rel = (p: string) => p.replace(/\\/g, "/");

if (plan.missing.length > 0) {
  console.error(
    `✗ ${MDI_CSS_PATH} 中不存在的 MDI 图标名（会静默消失）：\n` +
      plan.missing.map((name) => `    mdi-${name}    ${usage.used.get(name)!.slice(0, 3).join(", ")}`).join("\n"),
  );
  process.exit(1);
}

// 只通过字面字符用到的图标：子集化时必须一起带上，这里提示一下（它们不出现在 mdi-* 字面量里）
const literalOnly = [...usage.literalOnly.keys()].filter((name) => ![...usage.used.keys()].includes(name));

console.log(
  `✓ MDI 图标：用到 ${usage.used.size} 个（其中无字形工具类 ${plan.utilities.length} 个：` +
    `${plan.utilities.map((n) => "mdi-" + n).join(", ") || "无"}）；` +
    `字面字符额外用到 ${literalOnly.length} 个${literalOnly.length ? "：" + literalOnly.map((n) => "mdi-" + n).join(", ") : ""}；` +
    `共需字形 ${plan.names.length} / 字体含 ${tables.codepointByName.size}`,
);

if (usage.dynamicSites.length > 0) {
  console.log(
    `  · 动态拼接 ${usage.dynamicSites.length} 处，取值按 ${rel("vite/mdiIcons.ts")} 的 DYNAMIC_MDI_NAMES（${DYNAMIC_MDI_NAMES.length} 个）计：`,
  );
  usage.dynamicSites.forEach((site) => console.log(`      ${site}`));
}
