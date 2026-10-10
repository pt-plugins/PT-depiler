import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/**
 * 站点定义静态校验（跑在 `pnpm check` 里，**不在构建里** —— 构建只负责编译，校验属于 check 阶段）。
 *
 * 两件事：
 *  1. **结构检查**：`export const siteMetadata` 里那些「写错了也不会报错、只会静默失效」的地方
 *     （id 与文件名不符、category 的 key 重复、levelRequirements 的 id 重复/非递增、urls 不是地址……）；
 *  2. **正则编译检查**：会被 `new RegExp(pattern, "i")` 编译的字段（`TPatterns`）里的字符串字面量，
 *     编译不过就直接失败 —— 它们在打包期本来完全不被检查，坏一个括号要等运行到那行才抛，
 *     而调用点通常在 `.some()` 回调里，会把整页列表解析带崩。
 *
 * 规则来源：`src/packages/site/index.ts`（加载与回落）、`types/site.ts`、`types/search.ts`。
 * 用法：`pnpm check`（顺带跑）/ `pnpm check:site-definition`（只跑本项）/ 加文件参数只校验指定定义。
 * 错误（error）让命令以非 0 退出；警告与提示不影响退出码。
 */
const DEFINITIONS_DIR = "src/packages/site/definitions";
const SCHEMAS_DIR = "src/packages/site/schemas";

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

  // 7. timezoneOffset
  const tzNode = getProp(meta, "timezoneOffset");
  const tz = asString(tzNode);
  if (tz !== undefined && !/^(UTC)?[+-]\d{4}$/.test(tz)) {
    errors.push(`${at(tzNode!)}  timezoneOffset "${tz}" 格式非法，应为 +0800 / -0500 / UTC+0800 之类`);
  }

  // 8. category：key 必须唯一（types/search.ts:208-217 —— 界面选择按 key 存进 Record，重复会互相覆盖）
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

  // 9. levelRequirements：id 唯一且严格递增
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

  // 10. isDead 提示
  if (getProp(meta, "isDead")?.kind === ts.SyntaxKind.TrueKeyword) {
    notes.push("isDead: true —— 按 types/site.ts:108-115 建议注释或删除其后的全部配置项");
  }

  return result;
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
  results: ICheckResult[];
  errorCount: number;
  warningCount: number;
  noteCount: number;
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
  const sources = onlyFiles?.length ? targets : [...definitionFiles, ...schemaFiles];
  for (const file of sources) {
    const r = checkPatterns(file);
    patternCount += r.count;
    if (r.errors.length) bucket(file).errors.push(...r.errors);
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

  const results = [...byFile.values()].sort((a, b) => a.file.localeCompare(b.file));
  return {
    definitionCount: definitionFiles.length,
    patternCount,
    results,
    errorCount: results.reduce((n, r) => n + r.errors.length, 0),
    warningCount: results.reduce((n, r) => n + r.warnings.length, 0),
    noteCount: results.reduce((n, r) => n + r.notes.length, 0),
  };
}

/** 直接运行（`tsx vite/checkSiteDefinition.ts [file...]`）时打印报告，并按错误数设置退出码 */
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

  console.log(
    `\n检查 ${summary.definitionCount} 个定义、${summary.patternCount} 条 pattern：` +
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
