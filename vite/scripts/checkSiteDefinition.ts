import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import { INDEXED_METADATA_FIELDS, pickSiteMetadataIndexEntry } from "../../src/packages/site/utils/metadataIndex.ts";
import type { ISiteMetadata } from "../../src/packages/site/types/site.ts";

/**
 * 站点定义静态校验（跑在 `pnpm check` 里，**不在构建里** —— 构建只负责编译，校验属于 check 阶段）。
 *
 * 五件事：
 *  1. **结构检查**：`export const siteMetadata` 里那些「写错了也不会报错、只会静默失效」的地方
 *     （id 与文件名不符、category 的 key 重复、levelRequirements 的 id 重复/非递增、urls 不是地址……）；
 *  2. **正则编译检查**：会被 `new RegExp(pattern, "i")` 编译的字段（`TPatterns`）里的字符串字面量，
 *     编译不过就直接失败 —— 它们在打包期本来完全不被检查，坏一个括号要等运行到那行才抛，
 *     而调用点通常在 `.some()` 回调里，会把整页列表解析带崩；
 *  3. **过滤器名检查**：`filters` / `switchFilters` 里 `{ name: "xxx" }` 的名字必须存在于 `definedFilters`
 *     —— 写错的名字会被 `runQueryFilters` 静默跳过，只给出错值；
 *  4. **favicon 守卫**：`favicon` 字段用远端地址要提醒（本地资产优先且更稳），显式 `"./x"` 引用的
 *     文件必须存在，且本地图标不应超过 256x256（站点图标实际只显示 14~36px）；
 *  5. **索引字段契约**（全量模式才跑）：`INDEXED_METADATA_FIELDS` 与 `pickSiteMetadataIndexEntry()`
 *     必须一致 —— 详见 `checkMetadataIndexContract()`。
 *
 * 规则来源：`src/packages/site/index.ts`（加载与回落）、`types/site.ts`、`types/search.ts`、
 * `utils/metadataIndex.ts`（索引字段契约）、`utils/favicon.ts`（favicon 查找顺序）、
 * `utils/filter.ts`（可用过滤器名单）。
 * 用法：`pnpm check`（顺带跑）/ `pnpm check:site-definition`（只跑本项）/ 加文件参数只校验指定定义。
 * 错误（error）让命令以非 0 退出；警告与提示不影响退出码。
 */
const DEFINITIONS_DIR = "src/packages/site/definitions";
const SCHEMAS_DIR = "src/packages/site/schemas";
/** 索引字段契约涉及的文件：`INDEXED_METADATA_FIELDS` 与抽取函数都在这里，报告时挂到它名下 */
const METADATA_INDEX_FILE = "src/packages/site/utils/metadataIndex.ts";
/** 本地站点图标目录（与 vite.config.ts 里注入的 `__RESOURCE_SITE_ICONS__` 同源） */
const ICONS_DIR = "public/icons/site";
/** 具名过滤器表：`filters: [{ name }]` 里的名字必须取自这里 */
const FILTER_FILE = "src/packages/site/utils/filter.ts";
/**
 * 本地图标的尺寸上限。
 * 站点图标在界面里的实际显示尺寸只有 14~36px（components/SiteFavicon/Index.vue 的 `size` prop），
 * 超过这个边长基本只能说明资产没压过（历史上出现过多达 512x512 / 264KB 的 favicon，占整包体积 41%）。
 */
const MAX_LOCAL_ICON_DIM = 256;

/** 会被 `new RegExp(pattern, "i")` 编译的字段（类型里的 `TPatterns`） */
const PATTERN_FIELDS = new Set([
  "urlPattern", // site.urlPattern / list[].urlPattern / search.urlPattern
  "excludeUrlPattern",
  "urlPatterns", // noLoginAssert.urlPatterns
  "refreshHeaderPattern",
  "officialGroupPattern",
]);

/** 模板类固定版本的引擎（types/site.ts:46-54） */
const ENGINE_VERSION_RULE: Record<string, number> = {
  AbstractBittorrentSite: -1,
  AbstractPrivateSite: -1,
  NexusPHP: 0,
  Unit3D: 0,
  Gazelle: 0,
  GazelleJSONAPI: 0,
  AvistazNetwork: 0,
};

/** definition 里 default class 对模板类的别名写法 */
const CLASS_ALIAS: Record<string, string> = {
  PrivateSite: "AbstractPrivateSite",
  BittorrentSite: "AbstractBittorrentSite",
};

const ID_PATTERN = /^[0-9a-z]+$/;

/**
 * 成人站点的标记。命中时该站点的 `urls` / `legacyUrls` / `trackerUrls` 必须写成 rot13，
 * 避免仓库里出现明文成人站点域名（加载时由 `index.ts:53-59` 的 `restoreSecureLink` 还原）。
 *
 * `adult` 一并收进来是因为仓库里已有 `pornbits` 用 `tags: ["Adult"]` 并早已按此约定 rot13，
 * 词汇不统一会留下漏网口子。
 */
const ADULT_TAG_PATTERN = /^(成人|xxx|adult)$/i;

/** 需要 rot13 保护的地址字段 */
const SECURE_URL_FIELDS = ["urls", "legacyUrls", "trackerUrls"] as const;

/* ---------------------------------- AST 小工具 --------------------------------- */

function readName(name: ts.PropertyName | ts.BindingName | undefined): string | undefined {
  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) return name.text;
  return undefined;
}

/** 取对象字面量里某个属性的值（重复赋值时后者生效，与 JS 一致） */
function getProp(obj: ts.ObjectLiteralExpression, name: string): ts.Expression | undefined {
  let found: ts.Expression | undefined;
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && readName(p.name) === name) found = p.initializer;
  }
  return found;
}

function hasSpread(obj: ts.ObjectLiteralExpression): boolean {
  return obj.properties.some((p) => ts.isSpreadAssignment(p));
}

function asString(node: ts.Node | undefined): string | undefined {
  return node && ts.isStringLiteralLike(node) ? node.text : undefined;
}

function asNumber(node: ts.Node | undefined): number | undefined {
  if (!node) return undefined;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -Number(node.operand.text);
  }
  return undefined;
}

function asArray(node: ts.Node | undefined): ts.Expression[] | undefined {
  return node && ts.isArrayLiteralExpression(node) ? [...node.elements] : undefined;
}

/** 剥掉 `as` / `satisfies` / 括号等包装（`export const siteMetadata = { ... } as ISiteMetadata` 是常见写法） */
function unwrap(node: ts.Expression | undefined): ts.Expression | undefined {
  let current = node;
  while (
    current &&
    (ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

/** rot13：用于校验被保护的地址（types/base.ts:11-21） */
function rot13(input: string): string {
  return input.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function isHttpUrl(url: string): boolean {
  return /^https?:\/\/[^\s/]+/i.test(url);
}

/** 取 http(s) 地址的主机名（去掉 `www.` 与端口），取不到返回 undefined */
function urlHost(url: string): string | undefined {
  const match = url.match(/^https?:\/\/([^/?#\s]+)/i);
  if (!match) return undefined;
  const host = match[1].toLowerCase().replace(/:\d+$/, "");
  return host.startsWith("www.") ? host.slice(4) : host;
}

/* ---------------------------------- 图标工具 --------------------------------- */

/**
 * 本地图标的候选路径，顺序与 `site/utils/favicon.ts:213-231` 一致：
 * `favicon` 字段以 `"./"` 开头时该文件排在最前，否则依次是 `<id>.png` / `<id>.ico` / `<id>.svg`。
 * （`favicon` 是 http 地址或 data URI 时，本地候选仍然会被先命中，只是这份名单里不含它。）
 */
function localIconCandidates(siteId: string, favicon: string | undefined): string[] {
  const byId = [`${siteId}.png`, `${siteId}.ico`, `${siteId}.svg`];
  return favicon?.startsWith("./") ? [favicon.slice(2), ...byId] : byId;
}

/**
 * 只读文件头解析图片尺寸（PNG / ICO / JPEG / GIF / WebP / SVG 的显式 width/height）。
 * 识别不出来的格式返回 null —— 调用方按「跳过」处理，不产生误报。
 */
function readImageSize(file: string): { width: number; height: number } | null {
  let buf: Buffer;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return null;
  }

  // PNG：IHDR 里的宽高
  if (buf.length >= 24 && buf.toString("latin1", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // ICO：取所有帧里最大的声明尺寸（目录项里 0 表示 256）
  if (buf.length >= 22 && buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1) {
    let width = 0;
    let height = 0;
    const count = buf.readUInt16LE(4);
    for (let i = 0; i < count; i++) {
      const offset = 6 + i * 16;
      if (offset + 16 > buf.length) break;
      width = Math.max(width, buf[offset] === 0 ? 256 : buf[offset]);
      height = Math.max(height, buf[offset + 1] === 0 ? 256 : buf[offset + 1]);
    }
    return width && height ? { width, height } : null;
  }

  // GIF
  if (buf.length >= 10 && buf.toString("latin1", 0, 3) === "GIF") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }

  // WebP：VP8X / VP8L / VP8 三种块头的宽高编码各不相同
  if (buf.length >= 30 && buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP") {
    const chunk = buf.toString("latin1", 12, 16);
    if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }

  // JPEG：扫到 SOFn 段取宽高
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
        i += 2;
        continue;
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  // SVG：矢量没有固有像素尺寸，只认显式 width/height（读不到就跳过）
  const head = buf.toString("utf8", 0, Math.min(buf.length, 2000));
  if (head.includes("<svg")) {
    const width = head.match(/\bwidth\s*=\s*["']?(\d+(?:\.\d+)?)/i);
    const height = head.match(/\bheight\s*=\s*["']?(\d+(?:\.\d+)?)/i);
    if (width && height) return { width: Math.round(Number(width[1])), height: Math.round(Number(height[1])) };
  }

  return null;
}

/* ---------------------------------- 单文件检查 --------------------------------- */

interface IFileResult {
  errors: string[];
  warnings: string[];
  notes: string[];
}

/** pattern 编译检查：definitions 与 schemas 都要做（它们都会被 `new RegExp(pattern, "i")` 消费） */
function checkPatterns(file: string): { errors: string[]; count: number } {
  const errors: string[] = [];
  let count = 0;
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");

  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node)) {
      const field = readName(node.name);
      if (field && PATTERN_FIELDS.has(field)) {
        for (const literal of collectStringLiterals(node.initializer)) {
          count++;
          try {
            new RegExp(literal.text, "i");
          } catch (e) {
            const { line } = source.getLineAndCharacterOfPosition(literal.getStart(source));
            errors.push(
              `${rel}:${line + 1}  ${field} = ${JSON.stringify(literal.text)} 无法编译：${e instanceof Error ? e.message : e}`,
            );
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  return { errors, count };
}

/** 承载 `TQueryFilter` 的字段（types/search.ts:291-292） */
const FILTER_FIELDS = new Set(["filters", "switchFilters"]);

/**
 * 静态读出 `definedFilters` 的键名。
 *
 * ⚠️ 这里**不能** `import` filter.ts：它的依赖链（`@ptd/social`）在模块顶层用了 `import.meta.glob`，
 * 那是 Vite 的能力，`tsx`/Node 下会直接抛 `(intermediate value).glob is not a function`
 * —— 而 `pnpm check` 跑的正是 tsx。所以与 pattern 检查一样走 AST。
 *
 * 读不到名单时**抛错**而不是返回空数组：否则「一条都没扫到」会伪装成「全部通过」
 * （这正是上一轮复核里给守卫定的三条反误报判据之一）。
 */
function readDefinedFilterNames(): string[] {
  const file = path.resolve(process.cwd(), FILTER_FILE);
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const stmt of source.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    if (!(stmt.modifiers ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (readName(decl.name) !== "definedFilters") continue;
      const init = unwrap(decl.initializer); // 外面可能包着 satisfies Record<string, TQueryFilterFn>
      if (!init || !ts.isObjectLiteralExpression(init)) continue;
      const names = init.properties.map((p) => readName(p.name)).filter((n): n is string => !!n);
      if (names.length === 0) throw new Error(`${FILTER_FILE} 里的 definedFilters 解析为空，过滤器名检查无法进行`);
      return names;
    }
  }
  throw new Error(`在 ${FILTER_FILE} 里找不到 \`export const definedFilters = { ... }\`，过滤器名检查无法进行`);
}

let definedFilterNamesCache: string[] | null = null;
function definedFilterNames(): string[] {
  return (definedFilterNamesCache ??= readDefinedFilterNames());
}

/**
 * 过滤器名检查：`{ name: "xxx" }` 里的名字必须存在于 `definedFilters`。
 *
 * 这是**第二层**守卫：第一层是 `filter.ts` 的类型（`satisfies Record<string, TQueryFilterFn>`，
 * 见那里的注释）—— 它能在编译期拦住「写在有类型上下文的位置」的错名（本次改造就是这样一次性暴露出
 * 16 处问题的）。这一层覆盖编译期看不到的情况：`any` 边界、动态拼出来的配置对象，
 * 以及单跑 `pnpm check:site-definition`（不经过 vue-tsc）时的兜底；错误信息也更直白（直接列出可用名字）。
 *
 * 为什么值得是 error：`runQueryFilters`（AbstractBittorrentSite.ts:461-475）对不存在的名字**静默跳过**，
 * 「过滤器没生效」既不报错也不告警，只会给出错值 —— broadcasthenet 的 `bonusPerHour` 就因为写了
 * 并不存在的 `divide` 而偏高 24 倍。
 */
function checkFilters(file: string): { errors: string[]; count: number } {
  const errors: string[] = [];
  let count = 0;
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");

  const checkOne = (node: ts.Expression) => {
    const obj = unwrap(node);
    // 函数式过滤器 / 常量引用 / 展开：静态看不出名字，交给类型系统
    if (!obj || !ts.isObjectLiteralExpression(obj)) return;
    const nameNode = getProp(obj, "name");
    if (!nameNode) return;
    count++;
    const name = asString(nameNode);
    if (name === undefined) return; // 名字不是字面量（动态拼接），静态查不了
    const names = definedFilterNames();
    if (!names.includes(name)) {
      const { line } = source.getLineAndCharacterOfPosition(nameNode.getStart(source));
      errors.push(
        `${rel}:${line + 1}  filters 里的 name "${name}" 不在 definedFilters 中；` +
          `运行时会被 runQueryFilters 静默跳过（可用：${names.join(" / ")}）`,
      );
    }
  };

  const checkArray = (node: ts.Expression) => {
    const arr = unwrap(node);
    if (arr && ts.isArrayLiteralExpression(arr)) arr.elements.forEach(checkOne);
  };

  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node)) {
      const field = readName(node.name);
      if (field && FILTER_FIELDS.has(field)) {
        const init = unwrap(node.initializer);
        if (init && ts.isArrayLiteralExpression(init)) {
          // filters: TQueryFilter[]
          init.elements.forEach(checkOne);
        } else if (init && ts.isObjectLiteralExpression(init)) {
          if (field === "switchFilters") {
            // switchFilters: Record<selector, TQueryFilter[]>
            for (const p of init.properties) {
              if (ts.isPropertyAssignment(p)) checkArray(p.initializer);
            }
          } else {
            checkOne(init); // filters 也允许写成单个对象
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  return { errors, count };
}

function checkSiteDefinition(file: string, seenIds: Map<string, string>, knownSchemas: Set<string>): IFileResult {
  const result: IFileResult = { errors: [], warnings: [], notes: [] };
  const { errors, warnings, notes } = result;
  const fileName = path.basename(file);
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const expectedId = fileName.replace(/\.ts$/, "");
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const at = (node: ts.Node) => `${rel}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`;

  // 1. 找到 `export const siteMetadata = { ... }`
  let meta: ts.ObjectLiteralExpression | undefined;
  for (const stmt of source.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    if (!(stmt.modifiers ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const decl of stmt.declarationList.declarations) {
      const init = unwrap(decl.initializer);
      if (readName(decl.name) === "siteMetadata" && init && ts.isObjectLiteralExpression(init)) {
        meta = init;
      }
    }
  }
  if (!meta) {
    errors.push(`${rel}  未找到 \`export const siteMetadata = { ... }\`（或它不是对象字面量）`);
    return result;
  }

  // 2. id
  const id = asString(getProp(meta, "id"));
  if (id === undefined) {
    errors.push(`${at(meta)}  缺少 \`id\` 或它不是字符串字面量`);
  } else {
    if (id !== expectedId)
      errors.push(`${at(meta)}  id "${id}" 与文件名 "${expectedId}" 不一致（index.ts 以文件名作为 siteId）`);
    if (!ID_PATTERN.test(id)) errors.push(`${at(meta)}  id "${id}" 不符合 /^[0-9a-z]+$/（types/site.ts:36-44）`);
    if (seenIds.has(id)) errors.push(`${at(meta)}  id "${id}" 与其他定义文件重复：${seenIds.get(id)}`);
    else seenIds.set(id, fileName);
  }

  // 3. 必填字段
  for (const [field, desc] of [
    ["version", "数字"],
    ["name", "字符串"],
    ["type", "字符串"],
  ] as const) {
    if (!getProp(meta, field)) errors.push(`${at(meta)}  缺少必填字段 \`${field}\`（应为${desc}）`);
  }
  if (!getProp(meta, "urls")) errors.push(`${at(meta)}  缺少必填字段 \`urls\`（types/site.ts:86）`);

  const type = asString(getProp(meta, "type"));
  if (getProp(meta, "type") && type === undefined) errors.push(`${at(meta)}  type 不是字符串字面量`);
  else if (type !== undefined && type !== "private" && type !== "public") {
    errors.push(`${at(meta)}  type 取值 "${type}" 非法，只能是 "private" 或 "public"`);
  }

  // 4. schema 与 default class
  const schema = asString(getProp(meta, "schema"));
  let extendsTarget: string | undefined;
  let extendsRaw: string | undefined;
  for (const stmt of source.statements) {
    const isDefaultExport = (stmt.modifiers ?? []).some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (isDefaultExport && ts.isClassDeclaration(stmt) && stmt.heritageClauses) {
      for (const clause of stmt.heritageClauses) {
        const expr = clause.types[0]?.expression;
        if (expr && ts.isIdentifier(expr)) extendsRaw = expr.text;
      }
    }
  }
  if (extendsRaw) extendsTarget = CLASS_ALIAS[extendsRaw] ?? extendsRaw;

  if (schema !== undefined && !knownSchemas.has(schema)) {
    if (extendsRaw) {
      notes.push(
        `schema "${schema}" 不是 schemas/ 下的引擎，属该站点自定义命名；因已导出 default class，实例化以该类为准`,
      );
    } else {
      warnings.push(
        `${rel}:${source.getLineAndCharacterOfPosition(meta.getStart(source)).line + 1}  schema "${schema}" 不在 schemas/ 中且未导出 default class，实例化会按 type 回落 ${type === "public" ? "AbstractBittorrentSite" : "AbstractPrivateSite"}（index.ts:93-102）`,
      );
    }
  }
  if (!getProp(meta, "schema") && !extendsRaw) {
    notes.push(
      `未声明 schema 且未导出 default class，将按 type 回落 ${type === "public" ? "AbstractBittorrentSite" : "AbstractPrivateSite"}`,
    );
  }
  if (extendsRaw && !knownSchemas.has(extendsTarget!)) {
    warnings.push(`${rel}  default class extends "${extendsRaw}"，该目标不在 schemas/ 中`);
  }
  if (extendsRaw && schema !== undefined && knownSchemas.has(schema) && extendsTarget !== schema) {
    warnings.push(
      `${rel}  schema 字段为 "${schema}"，但 default class extends "${extendsRaw}"（实例化时以 default class 为准）`,
    );
  }

  // 5. version（约定与仓库现状不一致，故只提示）
  const versionNode = getProp(meta, "version");
  const version = asNumber(versionNode);
  if (versionNode && version === undefined) {
    errors.push(`${at(versionNode)}  version 不是数字字面量`);
  } else if (version !== undefined) {
    const engine = schema ?? extendsTarget ?? (type === "public" ? "AbstractBittorrentSite" : "AbstractPrivateSite");
    const expected = ENGINE_VERSION_RULE[engine];
    if (expected !== undefined && version !== expected) {
      notes.push(
        `version=${version}，types/site.ts:46-54 约定 "${engine}" 应为 ${expected}（仓库现状多写 1，保持站点内一致即可）`,
      );
    } else if (expected === undefined && version <= 0) {
      warnings.push(`${at(versionNode!)}  version=${version}，非模板类站点应为大于 0 的数字（types/site.ts:52-53）`);
    }
  }

  // 6. urls / legacyUrls
  const urlsRaw = getProp(meta, "urls");
  const urls = asArray(urlsRaw);
  if (urlsRaw !== undefined) {
    if (!urls) errors.push(`${at(urlsRaw)}  urls 不是数组字面量`);
    else if (urls.length === 0) errors.push(`${at(urlsRaw)}  urls 为空数组`);
    else {
      urls.forEach((element, index) => {
        const value = asString(element);
        if (value === undefined) {
          errors.push(`${at(element)}  urls[${index}] 不是字符串字面量`);
          return;
        }
        const decoded = isHttpUrl(value) ? value : rot13(value);
        if (!isHttpUrl(decoded))
          errors.push(`${at(element)}  urls[${index}] = "${value}" 不是 http(s) 地址，rot13 后也不是`);
        else if (/^http:\/\//i.test(decoded))
          warnings.push(`${at(element)}  urls[${index}] 使用明文 http，建议优先 https：${decoded}`);
      });
    }
  }
  const legacy = asArray(getProp(meta, "legacyUrls"));
  if (legacy && urls) {
    const urlSet = new Set(urls.map((u) => asString(u)).filter(Boolean));
    legacy.forEach((element, index) => {
      const value = asString(element);
      if (value === undefined) errors.push(`${at(element)}  legacyUrls[${index}] 不是字符串字面量`);
      else if (urlSet.has(value)) warnings.push(`${at(element)}  legacyUrls[${index}] 与 urls 重复：${value}`);
    });
  }

  // 6.1 legacyUrls / trackerUrls 与 urls 一样支持 rot13（index.ts:53-59），坏值同样要拦下来
  for (const field of ["legacyUrls", "trackerUrls"] as const) {
    asArray(getProp(meta, field))?.forEach((element, index) => {
      const value = asString(element);
      if (value === undefined || isHttpUrl(value) || isHttpUrl(rot13(value))) return;
      errors.push(`${at(element)}  ${field}[${index}] = "${value}" 不是 http(s) 地址，rot13 后也不是`);
    });
  }

  // 7. 成人（tags 含「成人 / XXX」）站点的地址必须 rot13 保护
  const tagsNode = getProp(meta, "tags");
  const tagElements = asArray(tagsNode);
  if (tagsNode !== undefined && !tagElements) {
    notes.push("tags 不是数组字面量，已跳过「成人站点地址需 rot13」检查");
  } else if (tagElements) {
    const tagValues = tagElements.map((element) => asString(element));
    if (tagValues.some((value) => value === undefined)) {
      notes.push("tags 含非字符串字面量，已跳过「成人站点地址需 rot13」检查");
    } else if (tagValues.some((value) => ADULT_TAG_PATTERN.test(value!))) {
      const tagList = tagValues.join("/");
      // 该站点声明的全部域名（明文值本身也要报错，但照样先收进集合供 7.1 使用）
      const ownHosts = new Set<string>();
      const secureLiterals = new Set<string>();

      for (const field of SECURE_URL_FIELDS) {
        const elements = asArray(getProp(meta, field));
        elements?.forEach((element, index) => {
          const value = asString(element);
          if (value === undefined) return;
          secureLiterals.add(value);
          const host = urlHost(isHttpUrl(value) ? value : rot13(value));
          if (host) ownHosts.add(host);
          if (isHttpUrl(value)) {
            errors.push(
              `${at(element)}  ${field}[${index}] 是明文地址 "${value}"；该站点 tags 含成人标记（${tagList}），` +
                `必须写成 rot13："${rot13(value)}"（types/base.ts:11-21）`,
            );
          }
        });
      }

      // 7.1 文件里其它位置不得再出现本站域名的明文地址。
      //     只有 urls / legacyUrls / trackerUrls 会被 restoreSecureLink 还原（index.ts:53-59），
      //     所以 favicon / Origin / Referer / 绝对 requestConfig.url 这类字段必须改用 this.url 派生、
      //     本地图标，或者干脆省略。
      if (ownHosts.size > 0) {
        const visit = (node: ts.Node) => {
          if (ts.isStringLiteralLike(node) && isHttpUrl(node.text) && !secureLiterals.has(node.text)) {
            const host = urlHost(node.text);
            if (host && ownHosts.has(host)) {
              errors.push(
                `${at(node)}  明文地址 "${node.text}" 暴露了本站在 ${SECURE_URL_FIELDS.join(" / ")} 里已收录的域名 "${host}"；` +
                  `该站点 tags 含成人标记（${tagList}），且这些字段不会被 rot13 还原，请改用 this.url 派生、本地图标或省略该字段`,
              );
            }
          }
          ts.forEachChild(node, visit);
        };
        ts.forEachChild(source, visit);
      }
    }
  }

  // 8. timezoneOffset
  const tzNode = getProp(meta, "timezoneOffset");
  const tz = asString(tzNode);
  if (tz !== undefined && !/^(UTC)?[+-]\d{4}$/.test(tz)) {
    errors.push(`${at(tzNode!)}  timezoneOffset "${tz}" 格式非法，应为 +0800 / -0500 / UTC+0800 之类`);
  }

  // 9. category：key 必须唯一（types/search.ts:208-217 —— 界面选择按 key 存进 Record，重复会互相覆盖）
  const categoryElements = asArray(getProp(meta, "category"));
  if (categoryElements) {
    const keys: string[] = [];
    categoryElements.forEach((element, index) => {
      if (!ts.isObjectLiteralExpression(element)) return; // 常量引用/展开等交给运行时
      const key = asString(getProp(element, "key"));
      if (key === undefined) {
        if (!hasSpread(element)) errors.push(`${at(element)}  category[${index}] 缺少字符串类型的 key`);
      } else keys.push(key);
      if (!getProp(element, "options") && !hasSpread(element)) {
        warnings.push(`${at(element)}  category[${index}]（key=${key ?? "?"}）缺少 options`);
      }
    });
    const duplicated = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))];
    if (duplicated.length > 0) errors.push(`${at(meta)}  category 的 key 重复：${duplicated.join(", ")}`);
  }

  // 10. levelRequirements：id 唯一且严格递增
  const levelElements = asArray(getProp(meta, "levelRequirements"));
  if (levelElements) {
    const ids: number[] = [];
    levelElements.forEach((element, index) => {
      if (!ts.isObjectLiteralExpression(element)) return;
      const levelId = asNumber(getProp(element, "id"));
      if (levelId === undefined) {
        if (!hasSpread(element)) errors.push(`${at(element)}  levelRequirements[${index}] 缺少数字类型的 id`);
      } else ids.push(levelId);
      if (!getProp(element, "name") && !hasSpread(element)) {
        warnings.push(`${at(element)}  levelRequirements[${index}]（id=${levelId ?? "?"}）缺少 name`);
      }
    });
    const duplicated = [...new Set(ids.filter((v, index) => ids.indexOf(v) !== index))];
    if (duplicated.length > 0) {
      errors.push(`${at(meta)}  levelRequirements 的 id 重复：${duplicated.join(", ")}`);
    } else {
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] <= ids[i - 1]) {
          warnings.push(`${rel}  levelRequirements 的 id 非严格递增：${ids[i - 1]} → ${ids[i]}（数组第 ${i} 项）`);
          break;
        }
      }
    }
  }

  // 11. isDead 提示
  if (getProp(meta, "isDead")?.kind === ts.SyntaxKind.TrueKeyword) {
    notes.push("isDead: true —— 按 types/site.ts:108-115 建议注释或删除其后的全部配置项");
  }

  // 12. favicon：优先本地资产（远端地址与 data URI 都要提醒）；本地资产不应超过 256x256；显式引用的文件必须存在
  const faviconNode = getProp(meta, "favicon");
  const favicon = asString(faviconNode);
  if (faviconNode && favicon === undefined) {
    notes.push("favicon 不是字符串字面量，已跳过 favicon 检查");
  } else if (favicon?.startsWith("data:image/")) {
    warnings.push(
      `${at(faviconNode!)}  favicon 使用内联 data URI（favicon.ts:220-221 会直接返回它）；建议落成本地资产 ` +
        `${ICONS_DIR}/${expectedId}.png —— 内联 base64 会随定义 chunk 一起变胖，也享受不到统一的图片压缩`,
    );
  } else {
    const iconsDir = path.resolve(process.cwd(), ICONS_DIR);

    if (favicon !== undefined && isHttpUrl(favicon)) {
      warnings.push(
        `${at(faviconNode!)}  favicon 使用远端地址 "${favicon}"；建议落成本地资产 ${ICONS_DIR}/${expectedId}.png —— ` +
          `favicon.ts:237-252 里本地资产优先于这个字段，且本地资产不受站点改版 / 防盗链 / CF 拦截影响`,
      );
    }

    const candidates = localIconCandidates(expectedId, favicon);
    const explicit = favicon?.startsWith("./") ? favicon.slice(2) : undefined;
    if (explicit && !fs.existsSync(path.join(iconsDir, explicit))) {
      errors.push(
        `${at(faviconNode!)}  favicon "${favicon}" 指向的文件不存在（缺 ${ICONS_DIR}/${explicit}）；` +
          `favicon.ts:227-231 会静默跳过它，最终回落到运行时抓取`,
      );
    }

    // 真正会命中的那一个（favicon.ts 是「按顺序找第一个存在于包内的文件」）
    const hit = candidates.find((name) => fs.existsSync(path.join(iconsDir, name)));
    if (hit) {
      const size = readImageSize(path.join(iconsDir, hit));
      if (!size) {
        notes.push(`无法解析本地图标 ${ICONS_DIR}/${hit} 的尺寸，已跳过尺寸检查`);
      } else if (size.width > MAX_LOCAL_ICON_DIM || size.height > MAX_LOCAL_ICON_DIM) {
        warnings.push(
          `${rel}  本地图标 ${ICONS_DIR}/${hit} 为 ${size.width}x${size.height}，超过 ${MAX_LOCAL_ICON_DIM}x${MAX_LOCAL_ICON_DIM}；` +
            `站点图标实际显示尺寸只有 14~36px（components/SiteFavicon/Index.vue 的 size prop），建议压到 128 以内并去掉未压缩 BMP 载荷`,
        );
      }
    }
  }

  return result;
}

/* ---------------------------------- 索引字段契约 --------------------------------- */

/**
 * 索引条目里除「可查询的固定属性」之外的键：都是从固定属性派生出来的标志 / 摘要。
 * 注意 `id` **不在这里** —— 它是索引的 key，条目本身不再存一份。
 */
const DERIVED_ENTRY_KEYS = ["hasUserInputSettingMeta", "hasSearch", "hasUserInfo", "searchEntries"];

/**
 * 每个固定属性都给一个真值，保证抽取函数里的 `if` 全部命中。
 * 取值只需真值性正确，所以不追求与 ISiteMetadata 的结构完全对齐，用 as 收口。
 */
const metadataWithEveryField = {
  id: "check-site-metadata-index",
  name: "Check",
  type: "private",
  schema: "NexusPHP",
  isDead: true,
  urls: ["https://example.com/"],
  legacyUrls: ["https://legacy.example.com/"],
  trackerUrls: ["https://tracker.example.com/announce"],
  aka: ["别名"],
  tags: ["综合"],
  version: 1,
  description: "检查用",
  userInputSettingMeta: [{ name: "cookie", label: "Cookie", hint: "", required: true }],
  search: { requestConfig: {} },
  userInfo: { selectors: {} },
  searchEntry: { default: { name: "默认" } },
} as unknown as ISiteMetadata;

export interface IMetadataIndexContractResult {
  fixedFieldCount: number;
  derivedKeyCount: number;
  errors: string[];
}

/**
 * `INDEXED_METADATA_FIELDS` 与 `pickSiteMetadataIndexEntry()` 必须一致。
 *
 * 索引的**值**不可能漂移 —— 每次构建都从站点定义现算（见 `vite/plugin/generateSiteIndex.ts`），
 * 没有需要提交的生成产物。唯一会漂的是这层「字段契约」：
 *
 *   · 名单里有、抽取函数没写 → `metadataStore.getSiteMergedMetadata()` 会以为能从索引取到，
 *     实际拿到 `undefined`，而且**不会回落**到完整定义（静默错值，最难查）
 *   · 抽取函数写了、名单里没有 → 字段白白进了索引却没人能用（索引体积白涨）
 *
 * 光靠注释约束不住，所以在 `pnpm check` 里钉死。做法是**行为断言**而不是文本扫描：
 * 造一个「每个固定属性都有值」的站点定义逼出抽取函数里的全部分支，再比对它实际写出的键集合。
 *
 * 这是全量不变量，所以单文件模式（`pnpm check:site-definition <file>`）不跑。
 */
export function checkMetadataIndexContract(): IMetadataIndexContractResult {
  const written = new Set(Object.keys(pickSiteMetadataIndexEntry(metadataWithEveryField)));
  const expected = new Set<string>([...INDEXED_METADATA_FIELDS, ...DERIVED_ENTRY_KEYS]);
  const errors: string[] = [];

  const missing = [...expected].filter((key) => !written.has(key));
  if (missing.length > 0) {
    errors.push(
      `INDEXED_METADATA_FIELDS 列了但 pickSiteMetadataIndexEntry() 没写出：${missing.join(", ")}`,
      "消费方会以为能从索引取到这些字段，实际拿到 undefined，且不会回落到完整站点定义。",
    );
  }

  const unexpected = [...written].filter((key) => !expected.has(key));
  if (unexpected.length > 0) {
    errors.push(
      `pickSiteMetadataIndexEntry() 写出了但既不在 INDEXED_METADATA_FIELDS 也不在 DERIVED_ENTRY_KEYS：${unexpected.join(", ")}`,
      "该字段进了索引却没人能查；若它是新加的固定属性，请一并加进 INDEXED_METADATA_FIELDS。",
    );
  }

  return {
    fixedFieldCount: INDEXED_METADATA_FIELDS.length,
    derivedKeyCount: DERIVED_ENTRY_KEYS.length,
    errors,
  };
}

/* ---------------------------------- 入口 --------------------------------- */

function listTsFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".ts")) out.push(full);
    }
  };
  const abs = path.resolve(process.cwd(), dir);
  if (fs.existsSync(abs)) walk(abs);
  return out;
}

/* ---------------------------------- 检查入口 --------------------------------- */

export interface ICheckResult {
  file: string;
  errors: string[];
  warnings: string[];
  notes: string[];
}

export interface ICheckSummary {
  definitionCount: number;
  patternCount: number;
  /** 检查过的具名过滤器数量（`filters` / `switchFilters` 里带 `name` 的项） */
  filterCount: number;
  results: ICheckResult[];
  errorCount: number;
  warningCount: number;
  noteCount: number;
  /** 索引字段契约的结果；单文件模式下为 null（那是全量不变量，只在校验全部定义时查） */
  metadataIndexContract: IMetadataIndexContractResult | null;
}

/**
 * 跑一遍检查。
 * @param onlyFiles 只对这些文件收集结构检查结果（仍会扫描全部定义以判定 id 是否重复）；不传 = 全量
 */
export function checkSiteDefinitions(onlyFiles?: string[]): ICheckSummary {
  const knownSchemas = new Set(
    fs
      .readdirSync(path.resolve(process.cwd(), SCHEMAS_DIR))
      .filter((f) => f.endsWith(".ts"))
      .map((f) => f.slice(0, -3)),
  );

  const definitionFiles = listTsFiles(DEFINITIONS_DIR);
  const schemaFiles = listTsFiles(SCHEMAS_DIR);
  const targets = onlyFiles?.length ? onlyFiles.map((f) => path.resolve(process.cwd(), f)) : definitionFiles;

  const byFile = new Map<string, ICheckResult>();
  const bucket = (file: string) => {
    let r = byFile.get(file);
    if (!r) byFile.set(file, (r = { file, errors: [], warnings: [], notes: [] }));
    return r;
  };

  let patternCount = 0;
  let filterCount = 0;
  const sources = onlyFiles?.length ? targets : [...definitionFiles, ...schemaFiles];
  for (const file of sources) {
    const r = checkPatterns(file);
    patternCount += r.count;
    if (r.errors.length) bucket(file).errors.push(...r.errors);

    const f = checkFilters(file);
    filterCount += f.count;
    if (f.errors.length) bucket(file).errors.push(...f.errors);
  }
  // 结构检查：全都过一遍（id 唯一性需要全集），但只收 targets 的结果
  const seenIds = new Map<string, string>();
  for (const file of definitionFiles) {
    const r = checkSiteDefinition(file, seenIds, knownSchemas);
    if (!targets.includes(file)) continue;
    const b = bucket(file);
    b.errors.push(...r.errors);
    b.warnings.push(...r.warnings);
    b.notes.push(...r.notes);
  }

  // 索引字段契约：全量不变量，挂到抽取函数所在文件下，于是错误计数 / 报告 / 退出码都走同一套
  let metadataIndexContract: IMetadataIndexContractResult | null = null;
  if (!onlyFiles?.length) {
    metadataIndexContract = checkMetadataIndexContract();
    if (metadataIndexContract.errors.length) {
      bucket(path.resolve(process.cwd(), METADATA_INDEX_FILE)).errors.push(...metadataIndexContract.errors);
    }
  }

  const results = [...byFile.values()].sort((a, b) => a.file.localeCompare(b.file));
  return {
    definitionCount: definitionFiles.length,
    patternCount,
    filterCount,
    results,
    errorCount: results.reduce((n, r) => n + r.errors.length, 0),
    warningCount: results.reduce((n, r) => n + r.warnings.length, 0),
    noteCount: results.reduce((n, r) => n + r.notes.length, 0),
    metadataIndexContract,
  };
}

/** 直接运行（`tsx vite/scripts/checkSiteDefinition.ts [file...]`）时打印报告，并按错误数设置退出码 */
const isMain = !!process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const single = args.length > 0;
  const summary = checkSiteDefinitions(single ? args : undefined);
  const rel = (f: string) => path.relative(process.cwd(), f).replace(/\\/g, "/");

  for (const r of summary.results) {
    const tag = r.errors.length ? "ERROR" : r.warnings.length ? "WARN " : "OK   ";
    // 全量扫描时「提示」有 400+ 条，只汇总；单文件模式把它自己的提示也列出来
    if (tag === "OK   " && !single) continue;
    console.log(`${tag}  ${rel(r.file)}${r.notes.length ? `  (${r.notes.length} 条提示)` : ""}`);
    for (const e of r.errors) console.log(`   ✖ ${e.replace(/^\S+:\d+\s+/, "")}`);
    for (const w of r.warnings) console.log(`   ⚠ ${w.replace(/^\S+:\d+\s+/, "")}`);
    if (single) for (const n of r.notes) console.log(`   · ${n}`);
  }

  // 通过的规则在全量模式下不逐条打印，所以这里给索引字段契约一行明确的状态（失败时的细节在文件行里）
  if (summary.metadataIndexContract) {
    const { fixedFieldCount, derivedKeyCount, errors } = summary.metadataIndexContract;
    console.log(
      `${errors.length ? "✗" : "✓"}  索引字段契约（INDEXED_METADATA_FIELDS ↔ pickSiteMetadataIndexEntry）：` +
        `${fixedFieldCount} 个固定属性 + ${derivedKeyCount} 个派生标志`,
    );
  }

  console.log(
    `\n检查 ${summary.definitionCount} 个定义、${summary.patternCount} 条 pattern、${summary.filterCount} 个具名过滤器：` +
      `${summary.errorCount} 个错误，${summary.warningCount} 个警告，${summary.noteCount} 条提示`,
  );
  process.exit(summary.errorCount > 0 ? 1 : 0);
}

/** 收集一棵子树里的所有字符串字面量（无插值的模板串也算） */
function collectStringLiterals(node: ts.Node, out: ts.StringLiteralLike[] = []): ts.StringLiteralLike[] {
  if (ts.isStringLiteralLike(node)) {
    out.push(node);
    return out;
  }
  // ⚠️ 回调必须返回 undefined：`ts.forEachChild` 的回调**返回真值就停止遍历**，
  // 早先这里直接返回了数组（真值），于是每个数组只收得到第一个字面量 —— 藏在数组
  // 第二个位置的坏正则永远扫不到，而它照样打印「✓ 全部可编译」。
  ts.forEachChild(node, (child) => {
    collectStringLiterals(child, out);
  });
  return out;
}
