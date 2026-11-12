# Torznab 站点定义规范

规范原文：<https://torznab.github.io/spec-1.3-draft/torznab/Specification-v1.3.html>
（1.3-draft；错误码与响应格式另见其外部引用 Newznab Web API 的「Important fields of the returned
data (RSS)」「Predefined Attributes」「Newznab Error Codes」三节）

## 定位：通用 API 协议，不是站点架构（先读这段）

**Torznab 是 Newznab 的 BT 变体，是 Jackett / Prowlarr 等索引器通用的检索协议**——`t=search&q=...`
检索、`t=caps` 声明能力、返回 `<rss><channel><item>` XML feed、种子字段装在
`<torznab:attr name="..." value="..."/>` 扩展里。它回答的是「搜索接口长什么样」，
**不回答「这个站是什么架构」**：站点本身的登录方式、用户信息页面、等级体系、HTML 结构
可以千差万别，只是恰好（或额外）提供了这么一个检索端点。

因此本仓库的承载方式与其它引擎有本质区别（`src/packages/site/schemas/Torznab.ts`，全文 305 行）：

- `SchemaMetadata`（144-221）**只提供搜索骨架，故意不声明 `type` / `schema`**。因为 Torznab
  不是站点架构，「这个站是 public 还是 private、要不要走 TorznabSite 类」只能由 definition
  自己判断。**站点必须在自己的 `siteMetadata` 里显式写 `schema: "Torznab"`**，不写的话
  `index.ts` 会按 `type` 回落到 `AbstractPrivateSite` / `AbstractBittorrentSite`，apikey 注入
  与鉴权错误翻译全部失效（详见「常见坑」第 1 条）。
- `TorznabSite`（234-305）只做与「协议」有关的事：apikey 未填写拦截、请求时注入 key、
  把错误响应（`<error code="..."/>`，**包括 HTTP 200 的**）翻译成上层状态、把
  `infohash` / `magneturl` 补齐到 `ITorrent.infoHash`。它不假设任何登录/用户信息流程。
- 三个独立导出的 helper 供「主架构不是 Torznab」的站点复用：
  `torznabCategoryName(categories, fallback?)`（229-232，category 数字 → 展示名）、
  `parseTorznabSize(size)`（66-79，size 两种口径统一成字节）、
  `parseTorznabApiError(data)`（100-142，解析根级 `<error>`）。

一句话判定：**「搜索走 torznab 协议」决定是否展开 `SchemaMetadata`；「站点没有更合适的
引擎承载整站行为」才决定是否写 `schema: "Torznab"`。**

## 谁该继承 TorznabSite，谁只用 helper

仓库内现状（2026-11-11）：

| 站点                                  | type    | 写法                                                            | 原因                                                                |
| ------------------------------------- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `definitions/magnetz.ts`              | public  | `schema: "Torznab"`                                             | 搜索就靠 torznab（站方已关闭 HTML 抓取），无 userInfo               |
| `definitions/pandacd.ts`              | public  | `schema: "Torznab"`                                             | 同上，且无需 apikey                                                 |
| `definitions/pornotorrent.ts`         | public  | `schema: "Torznab"`                                             | 同上（截至 2026-10 被 CF 拦截，选择器未经真机验证）                 |
| `definitions/tr4ker.ts`               | public  | `schema: "Torznab"`                                             | 同上（无账号，未经真机验证）                                        |
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
- 鉴权失败表现为 `<error code="100" description="...">`（newznab 规范 100 = Incorrect user
  credentials）——**注意状态码可能是 200 也可能是 401/403**，见「错误码」一节。

易混淆情况：

- **「站点有 torznab 端点」≠「站点是 torznab 架构」**：多数 PT 站的 torznab 是插件输出，
  整站仍是 NexusPHP 等模板——这些站维持原引擎，本协议文档不适用。
- **anibt 的自定义命名空间**：feed 长得像 RSS，但 attr 不是 `torznab:attr`（见
  `definitions/anibt.ts` 的 `anibt:` 前缀），且无 `t=search`——不迁移。

## SchemaMetadata 默认值

`src/packages/site/schemas/Torznab.ts:144-221` 导出的 `SchemaMetadata: TSchemaMetadata<"version" | "search">`
（2026-11-11 按规范补齐了 category / comments / author / cover / ext_* 等映射）：

| 字段路径                                                   | 默认值                                             | 行号  | definition 是否通常需要覆盖                                                                                                     |
| ---------------------------------------------------------- | -------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| `version`                                                  | `-1`                                               | 145   | **必须自己写**（现状全部 `1`，同其它引擎口径）                                                                                  |
| `type` / `schema`                                          | **未提供**                                         | —     | **必须自己写**（见开头定位说明；`schema: "Torznab"` 只在走 TorznabSite 类时才写）                                               |
| `search.keywordPath`                                       | `"params.q"`                                       | 147   | 一般不需要                                                                                                                     |
| `search.requestConfig.url`                                 | `"/api/torznab"`                                   | 151   | 路径不同的站点覆写（pornotorrent `/torznab/`、tr4ker `/api/torznab/all`）                                                       |
| `search.requestConfig.responseType`                        | `"document"`                                       | 153   | 不要动——axios 对 XML feed 会解析成 Document，选择器按 XML 结构写                                                               |
| `search.requestConfig.params`                              | `{ t: "search", limit: 100 }`                      | 157   | 一般不需要（limit max=100 见 `t=caps` 的 `<limits max/>`，仓库内站点均如此）                                                     |
| `search.selectors.rows`                                    | `rss > channel > item`                             | 160   | feed 无 `<rss>` 包装时改（pornotorrent 用 `channel > item`）                                                                    |
| `search.selectors.title`                                   | `title`                                            | 164   | 一般不需要；**基类对列表页 title 无回退**（`AbstractBittorrentSite.ts:597-608`），靠这份默认值兜底                               |
| `search.selectors.url`                                     | `comments` → `guid` → `link`（依次兜底）           | 169   | 个别站 guid 就是 magnet（pornotorrent）或详情页在 guid（pandacd）时覆写                                                          |
| `search.selectors.link`                                    | `enclosure`(attr `url`) → `link`(文本) → `magneturl`(attr `value`) | 173   | 站点另有约定时覆写（magnetz 直接写 `[name=magneturl]`）                                                                          |
| `search.selectors.time`                                    | `pubDate` + `parseTime`                            | 178   | RFC 822 由 `parseTime` 的原生 Date 兜底；时间格式确实解析失败时再处理                                                            |
| `search.selectors.size`                                    | `[name=size]` + `attr: "value"` + `parseTorznabSize` | 181   | **一般不需要**：纯字节与带单位字符串都吃（见「常见坑」第 3 条）                                                                 |
| `search.selectors.seeders/leechers/completed`              | `[name=seeders/leechers/grabs]`，无 filter         | 183-186 | 一般不需要（基类 `tryToNumber` 自动归一）；只有 peers 的站自己改（tr4ker）                                                       |
| `search.selectors.comments`                                | `[name=comments]` + `attr: "value"`（评论**数量**） | 189   | 一般不需要；别写成 RSS 的 `<comments>` 元素（那是详情页 URL）                                                                    |
| `search.selectors.author`                                  | `[name=poster]`（torznab = 上传者用户名）          | 191   | 一般不需要                                                                                                                     |
| `search.selectors.cover`                                   | `[name=coverurl]`                                  | 193   | 一般不需要（配合搜索结果封面开关）                                                                                              |
| `search.selectors.category`                                | `[name=category]` → RSS `<category>` 文本，无名称映射 | 197   | **数字 → 展示名必须由 definition 用 `torznabCategoryName` 覆写**（默认只会显示 `5040`）                                          |
| `search.selectors.downloadVolumeFactor/uploadVolumeFactor` | `[name=...volumefactor]` + `parseNumber`           | 203-209 | feed 不携带时保持「未知」（选择器未命中不会应用 filters）；需要从别处推断的站点自行声明                                          |
| `search.selectors.ext_imdb`                                | `[name=imdb]` → `[name=imdbid]` + `extImdbId`      | 211   | 站点若另有字段名再覆写                                                                                                         |
| `search.selectors.ext_tvmaze`                              | `[name=tvmazeid]`                                  | 216   | 一般不需要                                                                                                                     |
| `search.selectors.id`                                      | **未提供**                                         | —     | **通常要写**：guid 形态各异（详情页 URL / infohash / magnet），不写时基类回落到 `url \|\| link`（形如整条 URL）                    |
| `userInfo` / `detail` / `category` / `levelRequirements`   | **未提供**                                         | —     | 按站点实情补（torznab feed 不含用户信息）                                                                                       |

## 最小可用定义骨架

默认值已覆盖 url / link / size / 评论数 / 上传者 / 封面 / 基础 category，最小定义只剩 id 与分类映射：

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
      // guid 形如 https://example.example/release/17230/#t51049 → 取 #t 后的数字
      id: { selector: "guid", filters: [(query: string) => query.match(/#t(\d+)$/)?.[1] ?? query] },
      category: {
        selector: "[name=category]", // 多个 attr 时取第一个；子类在后时用 `[name=category]:last`
        attr: "value",
        filters: [torznabCategoryName(categories)],
      },
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
自动拼进 `params.apikey`（`schemas/Torznab.ts:245-263`）。

## 搜索配置要点

- **key 走 query 参数**（`?apikey=`，与 Jackett 一致）。需要 `Authorization: Bearer` 等特殊
  形式的站点（如 c411 的 userInfo 请求）自行覆写 `request`——helper 不捆绑鉴权形态。
- **category 映射**：同一 `<item>` 可能有多个 category attr（先子类后父类或反之）。
  取第一个还是最后一个由选择器侧决定（`[name=category]` / `[name=category]:last`），
  helper 只做 value→name，未收录 value 退回 `fallback`（未提供则原样透出）。
  范例：magnetz 取第一个、pornotorrent 取最后一个（`torznabCategoryName(CATEGORIES, "XXX")`）。
- **分类参数形态**：多数站是 `cross: { mode: "comma" }`（`cat=2000,2030`）；pornotorrent 是
  单值 + `generateRequestConfig` 手工拼 `cat`。以 Jackett 定义的 `cat = join(...)` 口径为准。
- **高级搜索词**：`t` 只接受 `search` / `tvsearch` / `movie` / `music` / `book`（caps 里的
  `movie-search` 是能力名，不是取值）。用 `advanceKeywordParams[*].requestConfigTransformer`
  改 `t` 与参数（c411 / morethantv 是范例：`t=movie` + `imdbid` + 去掉 `q`）。
  是否真的支持 `movie` / `tvsearch` 取决于 `t=caps` 的 `supportedParams`，没把握的站点先不声明。
- **`ext_*` 扩展字段**：feed 里 `imdb` / `tvmazeid` 已由引擎默认落到 `ext_imdb` / `ext_tvmaze`
  （`infohash` 落到 `ITorrent.infoHash`）；其余（`tmdbid` / `tvdbid` 等）按需自行声明
  （tr4ker 的 `ext_tmdb`、c411 的 `ext_imdb`）。
- **`detail`**：feed 自带下载链接时正常下载不走详情页，`detail` 只服务于 content-script 的
  详情页解析。torznab 站的详情页 URL 就是 `<comments>` / `<guid>`，`urlPattern` 要与站点的
  静态路由区分开（magnetz 用负向先行断言排除 browse/login/account 等）。

## 错误码与状态翻译（2026-11-11 补齐）

规范（Newznab Web API「Newznab Error Codes」）明确：**错误响应同样是 `HTTP 200`**，正文是
根级 `<error code="..." description="..."/>`：

- `100` Incorrect user credentials、`101` Account suspended、`102` Insufficient privileges（1xx = 账号/凭据）
- `200` Missing parameter、`201` Incorrect parameter、`202/203` 函数不存在/未实现（2xx = 调用参数）
- `300` No such item（3xx = 内容）、`900` Unknown error、`910` API Disabled（9xx = 其它）

`TorznabSite.loggedCheck`（265-280）与 `parseTorznabApiError`（100-142）的翻译规则：

- 正文（Document 或字符串）根元素是 `<error>` → 按 code 分类：
  - **1xx → `NoUserInputError("API Key (…)")`**：界面显示「需要输入」并带上站点 description；
  - **其它 → `Error("Torznab API error: …")`**：搜索结果显示真实原因，而不是静默变成「无结果」。
- 401/403 但正文不是 XML `<error>`（反代默认页 / 精简实现）：站点声明了必填 apikey 时同样
  按「需要输入」处理，否则保留基类的 `Network Error: 401/403`。
- CF 质询由基类 `isCloudflareBlocked` 先行拦截，不进入上面的分支。

**只看状态码是错的**：Prowlarr/Jackett 与不少自研实现都用 200 + `<error>` 表达鉴权失败，
以前的行为是把 `<error code="100">` 当成「没有搜索结果」，用户完全不知道该去填 Key。

## 常见坑

1. **不写 `schema: "Torznab"`**：`SchemaMetadata` 故意不提供 `schema`（Torznab 不是站点
   架构，只是通用 API 协议），缺省时按 `type` 回落基类——表现为「401 被当成需要登录 /
   网络错误」，apikey 永远不会被注入。必须由 definition 显式声明。
2. **把 `schema: "Torznab"` 写到不该写的站**：主架构是其它引擎的站点（c411 / morethantv）
   指到 TorznabSite 会丢掉 userInfo / 登录检查。这种站只 import helper 或自行处理 feed。
3. **size 的两种口径**：规范要求**纯字节数**，原生实现（pandacd 2026-11-12 实测
   `value="99726119"`）与 Jackett 多数输出如此；部分 indexer / Jackett metalink 输出给带单位
   字符串（`"1.86 GB"`，magnetz）。
   默认选择器已带 `parseTorznabSize`（纯字节 / 千分位 / 带单位 / 省略 B 的 `1.86G` 都能吃），
   **新站点不必再覆写 size**；站点把 size 放在 `<size>` 元素而非 attr 时才需要覆写（pornotorrent）。
4. **rows 前缀**：默认 `rss > channel > item` 假定完整 RSS 包装；个别站 feed 没有 `<rss>`
   根（pornotorrent 用 `channel > item`）。选择器落空时先确认响应的真实结构。
5. **DVF/UVF 不在基类 `tryToNumber` 列表**：默认选择器已带 `parseNumber`，覆写这两个
   选择器时别把 filter 丢了；选择器未命中时 filters 不会执行，因此「feed 不带系数」仍是
   「未知（undefined）」，不会被误判成 0=免费。
6. **title 覆写整组替换**：覆写 `search.selectors` 时必须展开
   `...SchemaMetadata.search.selectors`，否则连 `title` 一起丢掉——基类对列表页 title 无回退。
7. **url / link 的语义别搞反**：`<link>` 按规范是**下载**地址，`<comments>`/`<guid>` 才是详情页。
   默认已按 `url ← comments → guid → link`、`link ← enclosure(url) → link(文本) → magneturl(value)`
   兜底；站点另有一套写法（pornotorrent 的 guid 就是 magnet）时覆写，并同步 `infoHash`。
   pandacd 实测（2026-11-12）：`<link>` 与 `<comments>` 都是详情页（`<comments>` 带 `#thread`
   锚点），下载只在 `<enclosure url="…/action=download&amp;id=…"/>` 上——**不能把 `<link>` 当下载地址**。
8. **`comments` 有两个含义**：RSS `<comments>` 元素是详情页 URL，`<torznab:attr name="comments">`
   是评论**数量**（映射到 `ITorrent.comments`）。默认只取后者，别混。
9. **infohash 可选**：规范里 `infohash` 是可选属性，只给 magnet 的 feed 很常见。引擎会在
   `fixParsedTorrent`（282-304）里从 `[name=infohash]` / `[name=magneturl]` / 下载链接的
   magnet 反推出 `infoHash`，并统一转小写（pandacd 实测给的是大写 `FEC3FA4A…`）；
   站点 ID 就要 infohash 时仍建议显式声明 `infoHash` 选择器（pornotorrent）。
10. **CF 质询站无法取证**：被 Cloudflare 拦截时选择器只能照 Jackett 定义写，并在文件头注明
    「未经真机验证」（见 `definitions/pornotorrent.ts` / `tr4ker.ts` 头注释的写法），不要编造实测结论。
11. **caps 探测要带 key**：部分站点 `t=caps` 也要鉴权；拿不到 caps 时分类表以 Jackett
    `categorymappings` 为准并注明来源。本引擎不运行期探测 caps（limits / supportedParams 不消费）。

## 规范里本引擎不消费的部分（按需自己补）

- `t=caps`：<limits max/default>、<searching supportedParams>、分类表、<tags> 清单；
- `offset` 翻页（本仓库一次取一页）；
- `tag`（1.3 新增）、`peers`、`seedtype` / `minimumratio` / `minimumseedtime`、`files` /
  `password` / `nfo` / `info` / `year` / `genre` / `video` / `audio` / `resolution` /
  `language` / `subs` / `season` / `episode`——`ITorrent` 没有对应字段，需要时用 `ext_*` 承接
  （注意前端只渲染 social 站点列表中的 `ext_{imdb,douban,bangumi,anidb,tvmaze,tmdb}`）。

## 范例定义

- `definitions/pandacd.ts` — 最简形态：无需 key，只覆写 id/url/category（size 已用引擎默认值）。
- `definitions/magnetz.ts` — 需要 key 的完整形态：`userInputSettingMeta` + 数字分类表 +
  `[name=magneturl]` 下载链接 + `infoHash` + detail 负向断言。
- `definitions/pornotorrent.ts` — feed 无 `<rss>` 包装 + 分类取最后一个 + guid 即 magnet + CF 未验证的注释口径。
- `definitions/tr4ker.ts` — 路径 `/api/torznab/all` + 只有 `peers`（无 leechers）时的覆写写法。
- `definitions/c411.ts` — helper-only 先例：主架构 `AbstractPrivateSite`，仅复用
  `torznabCategoryName`（并自带 Bearer + JSON 的 userInfo）。
