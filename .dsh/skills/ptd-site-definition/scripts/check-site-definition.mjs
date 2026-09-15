#!/usr/bin/env node
/**
 * PT-depiler 站点定义静态检查（无第三方依赖）
 *
 * 用法：
 *   node .dsh/skills/ptd-site-definition/scripts/check-site-definition.mjs                       # 检查全部
 *   node .dsh/skills/ptd-site-definition/scripts/check-site-definition.mjs src/packages/site/definitions/hdsky.ts
 *
 * 只做结构层面的静态检查，不发起网络请求，也不能替代 `pnpm check` 与真机验证。
 * 规则来源：src/packages/site/index.ts、types/site.ts、types/base.ts。
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const DEFINITIONS_DIR = join(ROOT, "src/packages/site/definitions");
const SCHEMAS_DIR = join(ROOT, "src/packages/site/schemas");

/** 模板类固定版本的引擎（types/site.ts:46-54） */
const ENGINE_VERSION_RULE = {
  AbstractBittorrentSite: -1,
  AbstractPrivateSite: -1,
  NexusPHP: 0,
  Unit3D: 0,
  Gazelle: 0,
  GazelleJSONAPI: 0,
  AvistazNetwork: 0,
};

/** definition 中 default class 对模板类的别名写法 */
const CLASS_ALIAS = {
  PrivateSite: "AbstractPrivateSite",
  BittorrentSite: "AbstractBittorrentSite",
};

const ID_PATTERN = /^[0-9a-z]+$/;

/* ---------------------------------- 词法扫描 --------------------------------- */

function skipString(text, i) {
  const quote = text[i];
  i++;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === quote) return i + 1;
    if (quote === "`" && ch === "$" && text[i + 1] === "{") {
      const end = scanBalanced(text, i + 1);
      i = end < 0 ? text.length : end;
      continue;
    }
    i++;
  }
  return i;
}

/** 判断下标 i 处的 `/` 是否可能是正则字面量的起点（启发式：看前一个非空白字符） */
function regexCanStart(text, i) {
  let j = i - 1;
  while (j >= 0 && /\s/.test(text[j])) j--;
  if (j < 0) return true;
  return "([{,:;=!&|?+-*%<>~^".includes(text[j]);
}

/** i 指向正则起始的 `/`，返回其结束后的下标；不像正则则原样返回 i */
function skipRegex(text, i) {
  if (!regexCanStart(text, i)) return i;
  let j = i + 1;
  let inClass = false;
  while (j < text.length) {
    const ch = text[j];
    if (ch === "\\") {
      j += 2;
      continue;
    }
    if (ch === "\n") return i; // 正则不跨行，说明判断有误
    if (ch === "[") inClass = true;
    else if (ch === "]") inClass = false;
    else if (ch === "/" && !inClass) return j + 1;
    j++;
  }
  return i;
}

/** 判断“可能是注释/正则”的分支，统一在扫描器中调用 */
function skipSlashConstruct(text, i) {
  const next = text[i + 1];
  if (next === "/") {
    const nl = text.indexOf("\n", i);
    return { end: nl < 0 ? text.length : nl, kind: "line-comment" };
  }
  if (next === "*") {
    const end = text.indexOf("*/", i);
    return { end: end < 0 ? text.length : end + 2, kind: "block-comment" };
  }
  const regexEnd = skipRegex(text, i);
  return regexEnd === i ? undefined : { end: regexEnd, kind: "regex" };
}

/** openIdx 指向 `{` / `[` / `(`，返回配对结束符之后的下标；未闭合返回 -1 */
function scanBalanced(text, openIdx) {
  let depth = 0;
  let i = openIdx;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(text, i);
      continue;
    }
    if (ch === "/") {
      const skipped = skipSlashConstruct(text, i);
      if (skipped) {
        i = skipped.end;
        continue;
      }
    }
    if (ch === "{" || ch === "[" || ch === "(") depth++;
    else if (ch === "}" || ch === "]" || ch === ")") {
      depth--;
      if (depth === 0) return i + 1;
    }
    i++;
  }
  return -1;
}

/** 把 from..to 之间按顶层逗号切段（忽略字符串与嵌套括号内的逗号） */
function splitTopLevel(text, from, to) {
  const segments = [];
  let depth = 0;
  let start = from;
  let i = from;
  while (i < to) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(text, i);
      continue;
    }
    if (ch === "/") {
      const skipped = skipSlashConstruct(text, i);
      if (skipped) {
        i = skipped.end;
        continue;
      }
    }
    if (ch === "{" || ch === "[" || ch === "(") depth++;
    else if (ch === "}" || ch === "]" || ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      if (text.slice(start, i).trim()) segments.push(text.slice(start, i));
      start = i + 1;
    }
    i++;
  }
  if (text.slice(start, to).trim()) segments.push(text.slice(start, to));
  return segments;
}

/** 取整个字面量的内部文本（不含首尾括号），入参为字面量起始下标 */
function literalInner(text, openIdx) {
  const end = scanBalanced(text, openIdx);
  if (end < 0) return undefined;
  return { inner: text.slice(openIdx + 1, end - 1), end };
}

/** 去掉注释（字符串字面量内部原样保留） */
function stripComments(text) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const end = skipString(text, i);
      out += text.slice(i, end);
      i = end;
      continue;
    }
    if (ch === "/") {
      const skipped = skipSlashConstruct(text, i);
      if (skipped) {
        if (skipped.kind === "regex") out += text.slice(i, skipped.end); // 正则原样保留
        if (skipped.end <= i) break;
        i = skipped.end;
        continue;
      }
    }
    out += ch;
    i++;
  }
  return out;
}

/** 把对象字面量内部文本解析为 key → 原始值文本 */
function objectEntryMap(inner) {
  const map = new Map();
  const clean = stripComments(inner);
  for (const segment of splitTopLevel(clean, 0, clean.length)) {
    const colon = findTopLevelColon(segment);
    if (colon < 0) continue;
    const rawKey = segment.slice(0, colon).trim();
    const key = rawKey.replace(/^["'`]|["'`]$/g, "");
    map.set(key, segment.slice(colon + 1).trim());
  }
  return map;
}

function findTopLevelColon(text) {
  let depth = 0;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(text, i);
      continue;
    }
    if (ch === "{" || ch === "[" || ch === "(") depth++;
    else if (ch === "}" || ch === "]" || ch === ")") depth--;
    else if (ch === ":" && depth === 0) return i;
    i++;
  }
  return -1;
}

function unescapeLiteral(text) {
  return text.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, esc) => {
    const map = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", "0": "\0" };
    if (esc[0] === "u" || esc[0] === "x") return String.fromCodePoint(parseInt(esc.replace(/^u\{?|^x|\}$/g, ""), 16));
    return map[esc] ?? esc;
  });
}

function asString(raw) {
  if (typeof raw !== "string") return undefined;
  const t = stripComments(raw).trim();
  const quote = t[0];
  if ((quote !== '"' && quote !== "'") || t.at(-1) !== quote) return undefined;
  return unescapeLiteral(t.slice(1, -1));
}

function asNumber(raw) {
  if (typeof raw !== "string") return undefined;
  const t = stripComments(raw).trim();
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : undefined;
}

function asArrayElements(raw) {
  if (typeof raw !== "string") return undefined;
  const t = stripComments(raw).trim();
  if (t[0] !== "[") return undefined;
  const lit = literalInner(t, 0);
  if (!lit) return undefined;
  return splitTopLevel(lit.inner, 0, lit.inner.length);
}

function objectOf(raw) {
  if (typeof raw !== "string") return undefined;
  const t = stripComments(raw).trim();
  if (t[0] !== "{") return undefined;
  const lit = literalInner(t, 0);
  return lit ? objectEntryMap(lit.inner) : undefined;
}

/** 数组元素是否为“引用的常量/展开”，这类元素不是对象字面量，属正常写法 */
function isReferenceElement(raw) {
  const t = stripComments(raw ?? "").trim();
  return !t.startsWith("{"); // 展开、标识符、函数调用等表达式一律交给运行时
}

/** 对象字面量是否含展开（`{ ...CategorySpstate, cross: {...} }`），其 key/name 来自被展开对象 */
function objectHasSpread(raw) {
  const t = stripComments(raw ?? "").trim();
  if (t[0] !== "{") return false;
  const lit = literalInner(t, 0);
  if (!lit) return false;
  return splitTopLevel(lit.inner, 0, lit.inner.length).some((segment) => segment.trim().startsWith("..."));
}

/** 兜底边界：第一个位于第 0 列的 `};` / `} as ...`（返回 `}` 之后的下标） */
function findColumnZeroClose(text, from) {
  const re = /^\}\s*(?:;|as\b)/gm;
  re.lastIndex = from;
  const match = re.exec(text);
  return match ? match.index + 1 : undefined;
}

/** rot13：用于校验 urls 中“被保护”的地址（types/base.ts:11-21） */
function rot13(input) {
  return input.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function isHttpUrl(url) {
  return /^https?:\/\/[^\s/]+/i.test(url);
}

/* ---------------------------------- 单文件检查 --------------------------------- */

function checkFile(filePath, seenIds) {
  const errors = [];
  const warnings = [];
  const notes = [];
  const fileName = basename(filePath);
  const expectedId = fileName.replace(/\.ts$/, "");
  const text = readFileSync(filePath, "utf8");
  const knownSchemas = new Set(readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".ts")).map((f) => f.slice(0, -3)));

  const decl = /export\s+const\s+siteMetadata[\s\S]{0,200}?=\s*\{/.exec(text);
  if (!decl) {
    errors.push("未找到 `export const siteMetadata = { ... }`（index.ts:37-44 要求导出该字段）");
    return { errors, warnings, notes };
  }
  const braceIdx = decl.index + decl[0].length - 1;
  // 括号扫描器偶发被正则/注释带偏，用第 0 列的 `};` 兜底（metadata 对象的嵌套层级都带缩进）
  const scanEnd = scanBalanced(text, braceIdx);
  const lineEnd = findColumnZeroClose(text, braceIdx);
  let end = scanEnd;
  if (lineEnd !== undefined && (scanEnd < 0 || scanEnd > lineEnd)) end = lineEnd;
  if (end === undefined || end <= braceIdx) {
    errors.push("siteMetadata 对象字面量未闭合，无法解析");
    return { errors, warnings, notes };
  }
  const meta = objectEntryMap(text.slice(braceIdx + 1, end - 1));

  // 1. id
  const id = asString(meta.get("id"));
  if (id === undefined) errors.push("缺少 `id` 或它不是字符串字面量");
  else {
    if (id !== expectedId) errors.push(`id "${id}" 与文件名 "${expectedId}" 不一致（index.ts 以文件名作为 siteId）`);
    if (!ID_PATTERN.test(id)) errors.push(`id "${id}" 不符合 /^[0-9a-z]+$/（types/site.ts:36-44）`);
    if (seenIds?.has(id)) errors.push(`id "${id}" 与其他定义文件重复：${seenIds.get(id)}`);
    else seenIds?.set(id, fileName);
  }

  // 2. 必填字段
  for (const [field, desc] of [
    ["version", "数字"],
    ["name", "字符串"],
    ["type", "字符串"],
  ]) {
    if (!meta.has(field)) errors.push(`缺少必填字段 \`${field}\`（应为${desc}）`);
  }
  if (!meta.has("urls")) errors.push("缺少必填字段 `urls`（types/site.ts:86）");

  const type = asString(meta.get("type"));
  if (type !== undefined && type !== "private" && type !== "public") {
    errors.push(`type 取值 "${type}" 非法，只能是 "private" 或 "public"`);
  }
  if (type === undefined && meta.has("type")) errors.push("type 不是字符串字面量");

  // 3. schema 与 default class
  const schema = asString(meta.get("schema"));
  const classDecl = /export\s+default\s+class\s+[A-Za-z_$][\w$]*\s+extends\s+([A-Za-z_$][\w$.]*)/.exec(text);
  const extendsRaw = classDecl?.[1];
  const extendsTarget = extendsRaw ? (CLASS_ALIAS[extendsRaw] ?? extendsRaw) : undefined;

  if (schema !== undefined && !knownSchemas.has(schema)) {
    if (classDecl) {
      notes.push(
        `schema "${schema}" 不是 schemas/ 下的引擎，属该站点自定义命名；因已导出 default class，实例化以该类为准（index.ts:79-84）`,
      );
    } else {
      warnings.push(
        `schema "${schema}" 不在 schemas/ 中且未导出 default class，实例化会按 type 回落 ${type === "public" ? "AbstractBittorrentSite" : "AbstractPrivateSite"}（index.ts:93-102）`,
      );
    }
  }
  if (!meta.has("schema") && !classDecl) {
    notes.push(
      `未声明 schema 且未导出 default class，将按 type 回落 ${type === "public" ? "AbstractBittorrentSite" : "AbstractPrivateSite"}`,
    );
  }
  if (extendsRaw && !knownSchemas.has(extendsTarget)) {
    warnings.push(`default class extends "${extendsRaw}"，该目标不在 schemas/ 中`);
  }
  // schema 明确写了 schemas/ 中存在的引擎、但 default class 继承别的类时，才视为不一致；
  // 若 schema 是站点自定义命名（schemas/ 中不存在），definition 继承模板类属于正常写法。
  if (extendsRaw && schema !== undefined && knownSchemas.has(schema) && extendsTarget !== schema) {
    warnings.push(`schema 字段为 "${schema}"，但 default class extends "${extendsRaw}"（实例化时以 default class 为准）`);
  }

  // 4. version
  //    注意：types/site.ts:46-54 的约定与仓库现状不一致（引擎类定义普遍写 1 而非 0），
  //    因此此处只提示、不报错，避免对既有文件产生大面积噪音。
  const version = asNumber(meta.get("version"));
  if (version === undefined) {
    if (meta.has("version")) errors.push("version 不是数字字面量");
  } else {
    const engine = schema ?? extendsTarget ?? (type === "public" ? "AbstractBittorrentSite" : "AbstractPrivateSite");
    const expected = ENGINE_VERSION_RULE[engine];
    if (expected !== undefined && version !== expected) {
      notes.push(
        `version=${version}，types/site.ts:46-54 约定 "${engine}" 应为 ${expected}（仓库现状多写 1，保持站点内一致即可）`,
      );
    } else if (expected === undefined && version <= 0) {
      warnings.push(`version=${version}，非模板类站点应为大于 0 的数字（types/site.ts:52-53）`);
    }
  }

  // 5. urls / legacyUrls
  const urlsRaw = meta.get("urls");
  const urls = asArrayElements(urlsRaw);
  if (urlsRaw !== undefined) {
    if (!urls) errors.push("urls 不是数组字面量");
    else if (urls.length === 0) errors.push("urls 为空数组");
    else {
      urls.forEach((element, index) => {
        const value = asString(element);
        if (value === undefined) {
          errors.push(`urls[${index}] 不是字符串字面量`);
          return;
        }
        const decoded = isHttpUrl(value) ? value : rot13(value);
        if (!isHttpUrl(decoded)) {
          errors.push(`urls[${index}] = "${value}" 不是 http(s) 地址，rot13 后也不是`);
        } else if (/^http:\/\//i.test(decoded)) {
          warnings.push(`urls[${index}] 使用明文 http，建议优先 https：${decoded}`);
        }
      });
    }
  }
  const legacy = asArrayElements(meta.get("legacyUrls"));
  if (legacy && urls) {
    const urlSet = new Set(urls.map((u) => asString(u)).filter(Boolean));
    legacy.forEach((element, index) => {
      const value = asString(element);
      if (value === undefined) errors.push(`legacyUrls[${index}] 不是字符串字面量`);
      else if (urlSet.has(value)) warnings.push(`legacyUrls[${index}] 与 urls 重复：${value}`);
    });
  }

  // 6. timezoneOffset
  const tz = asString(meta.get("timezoneOffset"));
  if (tz !== undefined && !/^(UTC)?[+-]\d{4}$/.test(tz)) {
    errors.push(`timezoneOffset "${tz}" 格式非法，应为 +0800 / -0500 / UTC+0800 之类（utils/datetime.ts:3）`);
  }

  // 7. category：key 必须唯一（types/search.ts:208-217）
  const categoryElements = asArrayElements(meta.get("category"));
  if (categoryElements) {
    const keys = [];
    categoryElements.forEach((element, index) => {
      if (isReferenceElement(element)) return; // 例如 CategoryIncldead / ...sharedCategory
      const entry = objectOf(element);
      if (!entry) {
        errors.push(`category[${index}] 不是对象字面量，也不是可识别的常量引用`);
        return;
      }
      const key = asString(entry.get("key"));
      if (key === undefined) {
        if (!objectHasSpread(element)) errors.push(`category[${index}] 缺少字符串类型的 key（types/search.ts:208-217）`);
      } else keys.push(key);
      if (!entry.has("options") && !objectHasSpread(element)) {
        warnings.push(`category[${index}]（key=${key ?? "?"}）缺少 options`);
      }
    });
    const duplicated = keys.filter((key, index) => keys.indexOf(key) !== index);
    if (duplicated.length > 0) errors.push(`category 的 key 重复：${[...new Set(duplicated)].join(", ")}`);
  }

  // 8. levelRequirements：id 递增且唯一（types/userinfo.ts:73-74）
  const levelElements = asArrayElements(meta.get("levelRequirements"));
  if (levelElements) {
    const ids = [];
    levelElements.forEach((element, index) => {
      if (isReferenceElement(element)) return;
      const entry = objectOf(element);
      if (!entry) {
        errors.push(`levelRequirements[${index}] 不是对象字面量，也不是可识别的常量引用`);
        return;
      }
      const levelId = asNumber(entry.get("id"));
      if (levelId === undefined) {
        if (!objectHasSpread(element)) errors.push(`levelRequirements[${index}] 缺少数字类型的 id`);
      } else ids.push(levelId);
      if (!entry.has("name") && !objectHasSpread(element)) {
        warnings.push(`levelRequirements[${index}]（id=${levelId ?? "?"}）缺少 name`);
      }
    });
    const duplicated = ids.filter((v, index) => ids.indexOf(v) !== index);
    if (duplicated.length > 0) {
      errors.push(`levelRequirements 的 id 重复：${[...new Set(duplicated)].join(", ")}`);
    } else {
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] <= ids[i - 1]) {
          warnings.push(`levelRequirements 的 id 非严格递增：${ids[i - 1]} → ${ids[i]}（在数组第 ${i} 项）`);
          break;
        }
      }
    }
  }

  // 9. isDead 提示
  if (meta.get("isDead")?.trim() === "true") {
    notes.push("isDead: true —— 按 types/site.ts:108-115 建议注释或删除其后的全部配置项");
  }

  return { errors, warnings, notes };
}

/* ---------------------------------- 入口 --------------------------------- */

const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
let files;
if (args.length > 0) {
  files = args.map((arg) => resolve(process.cwd(), arg));
} else {
  files = readdirSync(DEFINITIONS_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => join(DEFINITIONS_DIR, f));
}

const seenIds = new Map();
let errorCount = 0;
let warningCount = 0;

for (const file of files) {
  if (!existsSync(file)) {
    console.log(`ERROR  ${file}\n   - 文件不存在`);
    errorCount++;
    continue;
  }
  const { errors, warnings, notes } = checkFile(file, seenIds);
  const label = basename(file);
  if (errors.length === 0 && warnings.length === 0) {
    console.log(`OK     ${label}${notes.length ? `  (${notes.length} 条提示)` : ""}`);
  } else {
    console.log(`${errors.length > 0 ? "ERROR " : "WARN  "} ${label}`);
  }
  for (const error of errors) console.log(`   ✖ ${error}`);
  for (const warning of warnings) console.log(`   ⚠ ${warning}`);
  for (const note of notes) console.log(`   · ${note}`);
  errorCount += errors.length;
  warningCount += warnings.length;
}

console.log(`\n检查 ${files.length} 个文件：${errorCount} 个错误，${warningCount} 个警告`);
if (errorCount > 0) process.exitCode = 1;
