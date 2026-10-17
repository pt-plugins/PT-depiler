/**
 * MDI 字体子集化的公共逻辑（供构建产物处理与静态校验共用）。
 *
 * 背景（审计 §2.2 / P0-3）：`public/lib/mdi/icons.css` 417 KB（7,478 条 `.mdi-*` 规则）+
 * `webfont.woff2` 403 KB，而全仓实际只用到 190 个图标（2.5%）。它同时是 options 首屏与
 * 每一个被注入页面的 content-script shadow root 都要付的代价。
 *
 * ⚠️ 约定：**`public/lib/mdi/` 里的文件是完整版，不要子集化**（它们也是本模块的「真值来源」：
 * 图标名与码点都从这里读）。子集化只发生在 **dist 产物** 上，见 `vite/scripts/subsetMdiFont.ts`。
 *
 * 图标有两种使用形态，都要扫：
 *  1. `mdi-<name>` 字符串（Vuetify 的 `icon` prop / class）；
 *  2. **字面私有区字符** + `font-family: "Material Design Icons For PTD"`（Konva 画布，见
 *     `views/Overview/MyData/UserDataTimeline/`），例如 `text: `󰖛: ${deadSites}`` —— 这一类
 *     直接按字符查 CSS 的码点表反查名字，不做码点区间猜测。
 */
import fs from "node:fs";
import path from "node:path";

/** 完整的图标 CSS（构建/校验时的真值来源） */
export const MDI_CSS_PATH = "public/lib/mdi/icons.css";
/** 完整的字体文件 */
export const MDI_FONT_PATH = "public/lib/mdi/webfont.woff2";

/**
 * 动态拼接的取值，静态扫描看不到，这里显式列出：
 * `mdi-${progressIcon}` —— `RestorePtppUserDataDialog.vue:117` 与 `OneClickImportDialog.vue:110`。
 * 改动那两个文件里的取值时，要同步这里。
 */
export const DYNAMIC_MDI_NAMES = [
  "progress-helper",
  "progress-close",
  "progress-pencil",
  // 播放进度图标：mediaServer/utils.ts 的 getPlayedIcon 会动态拼出 mdi-circle-slice-N
  "circle-slice-1",
  "circle-slice-2",
  "circle-slice-3",
  "circle-slice-4",
  "circle-slice-5",
  "circle-slice-6",
  "circle-slice-7",
  "progress-wrench",
  "progress-check",
  "progress-alert",
] as const;

export interface IMdiCssTables {
  /** 图标名 → 码点（仅含带 `content:` 的真图标） */
  codepointByName: Map<string, number>;
  /** 码点 → 图标名 */
  nameByCodepoint: Map<number, string>;
  /** CSS 里出现过的全部 `.mdi-*` 规则名（含 `mdi-rotate-45` 这类只有 transform、没有字形的工具类） */
  ruleNames: Set<string>;
}

export function parseMdiCss(css: string): IMdiCssTables {
  const codepointByName = new Map<string, number>();
  const nameByCodepoint = new Map<number, string>();
  const ruleNames = new Set<string>();

  for (const m of css.matchAll(/\.mdi-([a-z0-9-]+)\s*::?\s*before\s*\{\s*content:\s*"\\([0-9A-Fa-f]+)"/g)) {
    const name = m[1];
    const codepoint = parseInt(m[2], 16);
    codepointByName.set(name, codepoint);
    nameByCodepoint.set(codepoint, name);
  }
  for (const m of css.matchAll(/\.mdi-([a-z0-9-]+)\s*::?\s*before/g)) {
    ruleNames.add(m[1]);
  }

  return { codepointByName, nameByCodepoint, ruleNames };
}

export interface IMdiIconUsage {
  /** 用到的图标名（含动态取值）→ 使用位置 `文件:行` */
  used: Map<string, string[]>;
  /** 只通过字面字符用到的图标名 → 使用位置 */
  literalOnly: Map<string, string[]>;
  /** 动态拼接点的源码位置（供人核对 DYNAMIC_MDI_NAMES 是否需要更新） */
  dynamicSites: string[];
}

function listSourceFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(ts|vue|json|scss|css|html)$/.test(entry.name)) {
        out.push(full);
      }
    }
  };
  // 不用 `git ls-files`：从 source zip 构建时没有 .git（见 vite/gitInfo.ts 的同款考虑）
  const srcDir = path.join(root, "src");
  if (fs.existsSync(srcDir)) walk(srcDir);
  return out;
}

export function collectMdiIconUsage(tables: IMdiCssTables, root: string = process.cwd()): IMdiIconUsage {
  const used = new Map<string, string[]>();
  const literalOnly = new Map<string, string[]>();
  const dynamicSites: string[] = [];

  const record = (map: Map<string, string[]>, name: string, where: string) => {
    const list = map.get(name);
    if (list) {
      if (!list.includes(where)) list.push(where);
    } else {
      map.set(name, [where]);
    }
  };

  for (const file of listSourceFiles(root)) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    const lines = fs.readFileSync(file, "utf8").split("\n");

    lines.forEach((line, index) => {
      const where = `${rel}:${index + 1}`;

      for (const m of line.matchAll(/\bmdi-([a-z0-9-]+)/g)) {
        const name = m[1];
        const matchedEnd = (m.index ?? 0) + m[0].length;
        // `mdi-circle-slice-${n}` 这类是**动态前缀**（以 - 结尾或紧跟 ${），不是完整名字：
        // 跳过它，其取值由本文件的 DYNAMIC_MDI_NAMES 登记
        if (name.endsWith("-") || line[matchedEnd] === "$") continue;
        record(used, name, where);
      }

      // 字面私有区字符：只认 CSS 里真实出现过的码点，避免区间猜测
      for (const ch of line) {
        const codepoint = ch.codePointAt(0)!;
        const name = tables.nameByCodepoint.get(codepoint);
        if (name) record(literalOnly, name, where);
      }

      if (/`mdi-\$\{/.test(line)) {
        dynamicSites.push(`${where}: ${line.trim()}`);
      }
    });
  }

  // 动态取值并进 used（它们同样是「用到的图标」）
  for (const name of DYNAMIC_MDI_NAMES) {
    if (!used.has(name)) {
      used.set(name, ["<vite/utils/mdiIcons.ts 的 DYNAMIC_MDI_NAMES>"]);
    }
  }

  return { used, literalOnly, dynamicSites };
}

export interface IMdiSubsetPlan {
  /** 需要打进字体的图标名（有字形的） */
  names: string[];
  /** 对应的码点 */
  codepoints: number[];
  /** 用到、但完整 CSS 里根本没有的图标名（拼错/版本不含）—— 必须让构建失败 */
  missing: string[];
  /** 用到、但只是无字形的工具类（如 `mdi-rotate-45`），不需要进字体 */
  utilities: string[];
}

export function planMdiSubset(tables: IMdiCssTables, usage: IMdiIconUsage): IMdiSubsetPlan {
  const names: string[] = [];
  const codepoints: number[] = [];
  const missing: string[] = [];
  const utilities: string[] = [];

  for (const name of usage.used.keys()) {
    const codepoint = tables.codepointByName.get(name);
    if (codepoint !== undefined) {
      names.push(name);
      codepoints.push(codepoint);
    } else if (tables.ruleNames.has(name)) {
      utilities.push(name); // 规则存在但没有字形（transform 类）
    } else {
      missing.push(name);
    }
  }

  names.sort();
  codepoints.sort((a, b) => a - b);
  return { names, codepoints, missing, utilities: utilities.sort() };
}

/**
 * 只保留用到的 `.mdi-<name>::before` 图标规则，其余块（注释、`.mdi`/`.mdi-set` 基础块、
 * `@keyframes`、尺寸类、深浅色等）**原样保留**。
 */
export function subsetMdiCss(css: string, keepNames: Set<string>): string {
  const out: string[] = [];
  let depth = 0;
  let blockStart = 0;
  let preludeStart = 0;

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") {
      if (depth === 0) preludeStart = blockStart;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const block = css.slice(preludeStart, i + 1);
        const prelude = css.slice(preludeStart, css.indexOf("{", preludeStart)).trim();
        const iconMatch = /^\.mdi-([a-z0-9-]+)\s*::?\s*before$/.exec(prelude);
        if (!iconMatch || keepNames.has(iconMatch[1])) {
          out.push(block);
        }
        blockStart = i + 1;
      }
    }
  }
  out.push(css.slice(blockStart)); // 结尾残留（换行/注释）

  return out.join("");
}
