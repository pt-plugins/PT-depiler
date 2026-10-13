/**
 * 静态守卫：`INDEXED_METADATA_FIELDS` 与 `pickSiteMetadataIndexEntry()` 必须一致。
 *
 * ## 为什么还需要这个检查
 *
 * 索引的**值**不可能漂移 —— 每次构建都从站点定义现算（见 vite/plugin/generateSiteIndex.ts），
 * 没有需要提交的生成产物。唯一会漂的是这层「字段契约」：
 *
 *   · 名单里有、抽取函数没写 → `metadataStore.getSiteMergedMetadata()` 会以为能从索引取到，
 *     实际拿到 `undefined`，而且**不会回落**到完整定义（静默错值，最难查）
 *   · 抽取函数写了、名单里没有 → 字段白白进了索引却没人能用（索引体积白涨）
 *
 * 光靠注释约束不住，所以在 `pnpm check` 里钉死。
 *
 * 做法是行为断言而不是文本扫描：造一个「每个固定属性都有值」的站点定义，逼出抽取函数里的
 * 全部条件分支，再比对它实际写出的键集合。
 */
import { INDEXED_METADATA_FIELDS, pickSiteMetadataIndexEntry } from "../src/packages/site/utils/metadataIndex.ts";
import type { ISiteMetadata } from "../src/packages/site/types/site.ts";

/** 索引条目里除「可查询的固定属性」之外，额外存在的键 */
const EXTRA_ENTRY_KEYS = ["id", "hasUserInputSettingMeta", "hasSearch", "hasUserInfo", "searchEntries"];

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

function main(): number {
  const written = new Set(Object.keys(pickSiteMetadataIndexEntry(metadataWithEveryField)));
  const expected = new Set<string>([...INDEXED_METADATA_FIELDS, ...EXTRA_ENTRY_KEYS]);

  // 名单里有、抽取没写 → 消费方静默拿到 undefined
  const missing = [...expected].filter((key) => !written.has(key));
  // 抽取写了、名单没有 → 字段进了索引却没人能用
  const unexpected = [...written].filter((key) => !expected.has(key));

  if (missing.length === 0 && unexpected.length === 0) {
    console.log(
      `站点轻量索引字段契约检查通过：共 ${written.size} 个键（固定属性 ${INDEXED_METADATA_FIELDS.length} 个 + 派生标志 ${EXTRA_ENTRY_KEYS.length} 个）`,
    );
    return 0;
  }

  if (missing.length > 0) {
    console.error(`✗ INDEXED_METADATA_FIELDS 列了但 pickSiteMetadataIndexEntry() 没写出：${missing.join(", ")}`);
    console.error("  → 消费方会以为能从索引取到这些字段，实际拿到 undefined，且不会回落到完整站点定义。");
  }
  if (unexpected.length > 0) {
    console.error(
      `✗ pickSiteMetadataIndexEntry() 写出了但既不在 INDEXED_METADATA_FIELDS 也不在 EXTRA_ENTRY_KEYS：${unexpected.join(", ")}`,
    );
    console.error("  → 该字段进了索引却没人能查；若它是新加的固定属性，请一并加进 INDEXED_METADATA_FIELDS。");
  }

  return 1;
}

process.exit(main());
