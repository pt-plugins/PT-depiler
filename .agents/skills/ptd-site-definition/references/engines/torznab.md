# Torznab 站点定义规范

## 定位：通用 API 协议，不是站点架构（先读这段）

**Torznab 是 Newznab 的 BT 变体，是 Jackett / Prowlarr 等索引器通用的检索协议**——`t=search&q=...`
检索、`t=caps` 声明能力、返回 `<rss><channel><item>` XML feed、种子字段装在
`<torznab:attr name="..." value="..."/>` 扩展里。它回答的是「搜索接口长什么样」，
**不回答「这个站是什么架构」**：站点本身的登录方式、用户信息页面、等级体系、HTML 结构
可以千差万别，只是恰好（或额外）提供了这么一个检索端点。

因此本仓库的承载方式与其它引擎有本质区别（`src/packages/site/schemas/Torznab.ts`，全文 127 行）：

- `SchemaMetadata`（34-70）**只提供搜索骨架，故意不声明 `type` / `schema`**。因为 Torznab
  不是站点架构，「这个站是 public 还是 private、要不要走 TorznabSite 类」只能由 definition
  自己判断。**站点必须在自己的 `siteMetadata` 里显式写 `schema: "Torznab"`**，不写的话
  `index.ts` 会按 `type` 回落到 `AbstractPrivateSite` / `AbstractBittorrentSite`，apikey 注入
  与鉴权错误翻译全部失效（详见「常见坑」第 1 条）。
- `TorznabSite`（83-127）只做三件与「协议」有关的事：apikey 未填写拦截、请求时注入 key、
  把 401/403 + XML `<error>` 翻译成 `NoUserInputError`。它不假设任何登录/用户信息流程。
- `torznabCategoryName(categories, fallback?)`（78-82）是独立导出的 helper——给那些
  **主架构不是 Torznab** 的站点复用（见下「谁该继承、谁只用 helper」）。

一句话判定：**「搜索走 torznab 协议」决定是否展开 `SchemaMetadata`；「站点没有更合适的
引擎承载整站行为」才决定是否写 `schema: "Torznab"`。**

## 谁该继承 TorznabSite，谁只用 helper

仓库内现状（2026-11-10）：

| 站点                                  | type    | 写法                                                            | 原因                                                                |
| ------------------------------------- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `definitions/magnetz.ts`              | public  | `schema: "Torznab"`                                             | 搜索就靠 torznab（站方已关闭 HTML 抓取），无 userInfo               |
| `definitions/pandacd.ts`              | public  | `schema: "Torznab"`                                             | 同上，且无需 apikey                                                 |
| `definitions/pornotorrent.ts`         | public  | `schema: "Torznab"`                                             | 同上（截至 2026-10 被 CF 拦截，选择器未经真机验证）                 |
| `definitions/c411.ts`                 | private | **继承 `AbstractPrivateSite`，只 import `torznabCategoryName`** | 还有 Bearer + JSON 的 userInfo 流程；单继承链装不下两套引擎能力     |
| `definitions/morethantv.ts`           | private | 不迁移                                                          | 主架构 Luminance（其 torznab 输出由 Luminance 引擎承载）            |
| `definitions/anibt.ts` / `showrss.ts` | public  | 不迁移                                                          | 只是 RSS 骨架（自定义命名空间 / 全局 feed），无 `t=search` 协议语义 |

新站点对照：**搜索端点是 torznab 且整站没有别的引擎可用** → 走 `TorznabSite`；
**站点主体能用 NexusPHP / Unit3D / Luminance / AbstractPrivateSite 等承载** → 保持原引擎，
torznab 只作为一种数据源按需处理，需要分类映射时复用 helper。

## 判定站点是否属于该协议

正向特征（有其一即可进一步验证）：

- 索引器目录（Jackett 的 `Definitions/*.yml`）里 `type: semi-private` + 尾注 `# torznab xml`，
  `search.path` 是 `/api/torznab` / `/torznab`，参数 `t=search`。
- `?t=caps` 返回 `<caps><searching><category...>` 结构（部分站 caps 也要 key）。
- 搜索响应是 XML：`<item>` 内有 `<title>` / `<guid>` / `<pubDate>` / `<enclosure url>` /
  `<torznab:attr name="seeders|size|magneturl|..."/>`。
- 鉴权失败表现为 401/403 + `<error code="100" description="...">`（newznab 规范 100 =
  Incorrect user parameters），而不是 HTML 登录页。

易混淆情况：

- **「站点有 torznab 端点」≠「站点是 torznab 架构」**：多数 PT 站的 torznab 是插件输出，
  整站仍是 NexusPHP 等模板——这些站维持原引擎，本协议文档不适用。
- **anibt 的自定义命名空间**：feed 长得像 RSS，但 attr 不是 `torznab:attr`（见
  `definitions/anibt.ts` 的 `anibt:` 前缀），且无 `t=search`——不迁移。

## SchemaMetadata 默认值

`src/packages/site/schemas/Torznab.ts:34-70` 导出的 `SchemaMetadata: TSchemaMetadata<"version" | "search">`：

| 字段路径                                                   | 默认值                                     | 行号  | definition 是否通常需要覆盖                                                                        |
| ---------------------------------------------------------- | ------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------- |
| `version`                                                  | `-1`                                       | 35    | **必须自己写**（现状全部 `1`，同其它引擎口径）                                                     |
| `type` / `schema`                                          | **未提供**                                 | —     | **必须自己写**（见开头定位说明；`schema: "Torznab"` 只在走 TorznabSite 类时才写）                  |
| `search.keywordPath`                                       | `"params.q"`                               | 37    | 一般不需要                                                                                         |
| `search.requestConfig.url`                                 | `"/api/torznab"`                           | 39    | 路径不同的站点覆写（如 pornotorrent 的 `/torznab/`）                                               |
| `search.requestConfig.responseType`                        | `"document"`                               | 40    | 不要动——axios 对 XML feed 会解析成 Document，选择器按 XML 结构写                                   |
| `search.requestConfig.params`                              | `{ t: "search", limit: 100 }`              | 41    | 一般不需要（limits max=100 是 caps 惯例，magnetz/pandacd/c411 均声明）                             |
| `search.selectors.rows`                                    | `rss > channel > item`                     | 44    | feed 无 `<rss>` 包装时改（pornotorrent 用 `channel > item`）                                       |
| `search.selectors.title`                                   | `title`                                    | 48    | 一般不需要；**基类对列表页 title 无回退**（`AbstractBittorrentSite.ts:597-608`），靠这份默认值兜底 |
| `search.selectors.url`                                     | `link`                                     | 50    | 各站 `<link>`/`<guid>`/`<comments>` 语义不一，常覆写                                               |
| `search.selectors.link`                                    | `enclosure` + `attr: "url"`                | 51    | 个别站用 `[name=magneturl]`（magnetz）或 `link`（morethantv）                                      |
| `search.selectors.time`                                    | `pubDate` + `parseTime`                    | 52    | 时间格式解析失败时再处理                                                                           |
| `search.selectors.size`                                    | `[name=size]` + `attr: "value"`            | 55    | **纯字节数站点必须改 `parseNumber`**（见「常见坑」第 3 条）                                        |
| `search.selectors.seeders/leechers/completed`              | `[name=seeders/leechers/grabs]`，无 filter | 57-59 | 一般不需要（基类 `tryToNumber` 自动归一）                                                          |
| `search.selectors.downloadVolumeFactor/uploadVolumeFactor` | `[name=...volumefactor]` + `parseNumber`   | 62-67 | feed 不携带时站点无需声明 DVF/UVF 分类                                                             |
| `search.selectors.id` / `category`                         | **未提供**                                 | —     | **必须自己写**：id 的 guid 形态各异，category 的数字映射表站点自有（用 helper）                    |
| `userInfo` / `detail` / `category` / `levelRequirements`   | **未提供**                                 | —     | 按站点实情补（torznab feed 不含用户信息）                                                          |

## 最小可用定义骨架

以 `definitions/pandacd.ts`（无需 key 的最简形态）为参照：

```ts
import type { ISearchCategoryOptions, ISiteMetadata } from "../types.ts";
import { SchemaMetadata, torznabCategoryName } from "../schemas/Torznab.ts";

const categories: ISearchCategoryOptions[] = [{ name: "Audio", value: 3000 }];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "example", // 必须与文件名 example.ts 一致
  name: "Example",
  type: "public", // 按站点实情写；TorznabSchema 不提供 type
  schema: "Torznab", // 必须显式声明：Torznab 是通用 API 协议，不是站点架构
  urls: ["https://example.example/"],

  category: [{ name: "分类", key: "cat", options: categories, cross: { mode: "comma" } }], // Jackett: cat = join(Categories, ",")

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search.selectors, // 必须展开，否则丢掉 rows/title/url/link/... 全部默认
      id: { selector: "guid", filters: [(query: string) => query.match(/#t(\d+)$/)?.[1] ?? query] },
      url: { selector: "guid" },
      category: { selector: "[name=category]", attr: "value", filters: [torznabCategoryName(categories)] },
    },
  },
};
```

需要 apikey 的站点再加：

```ts
  userInputSettingMeta: [
    { name: "apikey", label: "API Key", hint: "…生成地址与配额说明…", required: true },
  ],
```

`TorznabSite` 会在用户未填写 required apikey 时直接抛 `NoUserInputError`（不发请求），填写后
自动拼进 `params.apikey`（`schemas/Torznab.ts:89-108`）；`loggedCheck`（110-124）把
401/403 + `<error>` 的响应翻译成 `NoUserInputError` 并尽量带上站点的 `description`
（magnetz 实测：`<error code="100" description="A valid API key is required... (MZ-API-401)">`）。

## 搜索配置要点

- **key 走 query 参数**（`?apikey=`，与 Jackett 一致）。需要 `Authorization: Bearer` 等特殊
  形式的站点（如 c411 的 userInfo 请求）自行覆写 `request`——helper 不捆绑鉴权形态。
- **category 映射**：同一 `<item>` 可能有多个 category attr（先子类后父类或反之）。
  取第一个还是最后一个由选择器侧决定（`[name=category]` / `[name=category]:last`），
  helper 只做 value→name，未收录 value 退回 `fallback`（未提供则原样透出）。
  范例：magnetz 取第一个、pornotorrent 取最后一个（`torznabCategoryName(CATEGORIES, "XXX")`）。
- **分类参数形态**：多数站是 `cross: { mode: "comma" }`（`cat=2000,2030`）；pornotorrent 是
  单值 + `generateRequestConfig` 手工拼 `cat`。以 Jackett 定义的 `cat = join(...)` 口径为准。
- **高级搜索词**：Jackett 的 `tv-search` / `movie-search` 支持项（season/ep/imdbid/tvdbid/
  tmdbid）按需映射到 `advanceKeywordParams`；magnetz 还支持 `allowrawsearch`。没把握的先不声明。
- **`ext_*` 扩展字段**：feed 里的 `infohash` / `imdbid` / `tvdbid` 等可写入
  `ext_infohash` 等 `ext_` 命名空间键（`ITorrent` 无对应字段；`TAdvanceSearchKeyword` 含
  string，类型合法）。范例见 `definitions/magnetz.ts` 的 `ext_infohash`、`definitions/c411.ts` 的 `ext_imdb`。
- **`detail`**：feed 自带下载链接时正常下载不走详情页，`detail` 只服务于 content-script 的
  详情页解析。torznab 站的详情页 URL 就是 `<link>` / `<comments>` / `<guid>`，`urlPattern`
  要与站点的静态路由区分开（magnetz 用负向先行断言排除 browse/login/account 等）。

## 常见坑

1. **不写 `schema: "Torznab"`**：`SchemaMetadata` 故意不提供 `schema`（Torznab 不是站点
   架构，只是通用 API 协议），缺省时按 `type` 回落基类——表现为「401 被当成需要登录 /
   网络错误」，apikey 永远不会被注入。必须由 definition 显式声明。
2. **把 `schema: "Torznab"` 写到不该写的站**：主架构是其它引擎的站点（c411 / morethantv）
   指到 TorznabSite 会丢掉 userInfo / 登录检查。这种站只 import helper 或自行处理 feed。
3. **size 的两种口径**：标准 torznab 的 `[name=size]` value 是带单位字符串（"1.86 GB"），
   靠默认值即可（基类对 string 型 size 自动 `parseSizeString`，`AbstractBittorrentSite.ts:616-618`）；
   但 pandacd 给的是**纯字节数**，`parseSizeString` 的 sizePattern 要求单位、纯数字会得 0——
   必须覆写为 `parseNumber`。
4. **rows 前缀**：默认 `rss > channel > item` 假定完整 RSS 包装；个别站 feed 没有 `<rss>`
   根（pornotorrent 用 `channel > item`）。选择器落空时先确认响应的真实结构。
5. **DVF/UVF 不在基类 `tryToNumber` 列表**：默认选择器已带 `parseNumber`，覆写这两个
   选择器时别把 filter 丢了。
6. **title 覆写整组替换**：覆写 `search.selectors` 时必须展开
   `...SchemaMetadata.search.selectors`，否则连 `title` 一起丢掉——基类对列表页 title 无回退。
7. **CF 质询站无法取证**：被 Cloudflare 拦截时选择器只能照 Jackett 定义写，并在文件头注明
   「未经真机验证」（见 `definitions/pornotorrent.ts` 头注释的写法），不要编造实测结论。
8. **caps 探测要带 key**：部分站点 `t=caps` 也要鉴权；拿不到 caps 时分类表以 Jackett
   `categorymappings` 为准并注明来源。

## 范例定义

- `definitions/pandacd.ts` — 最简形态：无需 key，只覆写 id/url/size/category。
- `definitions/magnetz.ts` — 需要 key 的完整形态：`userInputSettingMeta` + 数字分类表 +
  `ext_infohash` + detail 负向断言。
- `definitions/pornotorrent.ts` — feed 无 `<rss>` 包装 + 分类取最后一个 + CF 未验证的注释口径。
- `definitions/c411.ts` — helper-only 先例：主架构 `AbstractPrivateSite`，仅复用
  `torznabCategoryName`（并自带 Bearer + JSON 的 userInfo）。
