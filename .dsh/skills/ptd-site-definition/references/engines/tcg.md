# TCG 站点定义规范

TCG 是一套英文学习/电子书类小站共用的 PHP tracker 模板（Jackett 中对应 thegeeks / thevault 两个站点定义，见 `definitions/thegeeks.ts:2`、`definitions/thevault.ts:2`）。本仓库由 `src/packages/site/schemas/TCG.ts` 承载它：该 schema 已给出 `browse.php` 列表页、`details.php` 详情页与两步式用户信息的选择器，并导出一个 `SchemaMetadata`。

因此 **TCG 站点只需在 `definitions/<id>.ts` 中展开 `...SchemaMetadata` 再覆写分类映射与等级**，不需要导出 `default class`（现有两个 TCG 定义都没有）。schema 末尾的类体是空的（`schemas/TCG.ts:133`：`export default class TCG extends PrivateSite {}`），站点能力完全由 `AbstractPrivateSite` 提供——需要覆写类方法时请先读 `references/engines/abstract-private-site.md`。

下文行号若未特别说明，均指 `src/packages/site/schemas/TCG.ts`（该文件实际 133 行）。

## 判定站点是否属于该引擎

正向特征（有其一即可进一步验证）：

- 搜索页是 `/browse.php`，分类链接形如 `browse.php?cat=NNN`，详情页 `details.php?id=`，下载链接 `download.php/...`（10、27-29、51）。
- 用户信息页是 `/main.php` + `/userdetails.php?id=`（62-73），等级显示在 `td.rowhead:contains('Class') + td`（106）。
- 列表表格行是 `tr.ttable`，且行内带有 `a[href^='browse.php?cat=']`（25）。
- 同一套模板的站还有 TCG 联盟的其他站（Jackett 里同批定义），它们的选择器基本一致。

易混淆情况：

- **NexusPHP**：同样有 `details.php?id=`、`userdetails.php?id=`，但 NexusPHP 的列表页通常是 `torrents.php` / `table.torrents`，用户信息结构是 `td.rowhead` 的成套文案（见 `schemas/NexusPHP.ts`）。若站点搜索页是 `torrents.php` 而不是 `browse.php`，基本可判定为 NexusPHP。
- **Rartracker**：同为自研小站，但 Rartracker 走 `/api/v1/` JSON（`schemas/Rartracker.ts:12`、23-24），没有 `browse.php`。
- **TCG 分叉站改了列顺序**：schema 的时间/大小/完成数/做种/下载/评论全部写死 `td:nth-child(N)`（30-38），分叉站一旦增删列就必须整段重写 `search.selectors`，照抄会静默解析出错误字段（不会报错，只是数值对不上）。
- **搜索结果里混入特殊行**：schema 的 `rows` 选择器已经排除了 `*TCG*` 与蓝色字体的禁转/免费种子（23-26，注释说明来自 Jackett 的实测）；换站时要确认这套排除规则仍然适用。

## SchemaMetadata 默认值

`schemas/TCG.ts:5-131` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 6 | 现状都显式写 `1`（`definitions/thegeeks.ts:97`、`definitions/thevault.ts:63`） |
| `type` | **未提供** | — | **必须自己写 `type: "private"`**（见「常见坑」） |
| `schema` | **未提供** | — | **必须自己写 `schema: "TCG"`** |
| `search.keywordPath` | `"params.search"` | 8 | 不需要 |
| `search.requestConfig` | `url: "/browse.php"`、`responseType: "document"`、`params: { incldead: 1, titleonly: 1, nonboolean: 0 }` | 9-17 | 一般不需要（`titleonly: 1` 表示只搜标题，`nonboolean: 0` 表示精确搜索） |
| `search.advanceKeywordParams.imdb` | `false`（`imdb\|xxx` 搜索会被跳过） | 18-20 | 不需要；要支持时改写成 `{ enabled: true }` |
| `search.selectors.rows` | `table[border='0'] > tbody > tr.ttable:has(a[href^='browse.php?cat=']):not(:has(font[color='blue'])):not(:contains('*TCG*'))` | 22-26 | 分叉站改版时才改 |
| `search.selectors.title/url/link` | 都取自 `a[href^='details.php?id=']`（title 用 `attr: "title"`、url 用 `attr: "href"`）与 `a[href^='download.php/']` | 27-29 | 一般不需要 |
| `search.selectors.time` | `td:nth-child(6)` + `parseTime`，参数 `["yyyy-MM-ddHH:mm:ss"]` | 30 | 分叉站列顺序不同时改 |
| `search.selectors.size` | `td:nth-child(7)` + `parseSize` | 31 | 同上 |
| `search.selectors.completed` | `td:nth-child(8)`，先把 `Never` 换成 `0` 再 `parseNumber` | 32-35 | 同上 |
| `search.selectors.seeders/leechers/comments` | `td:nth-child(9)` / `td:nth-child(10)` / `td:nth-child(5)` | 36-38 | 同上 |
| `search.selectors.subTitle` | `span > em` | 39 | 一般不需要 |
| `search.selectors.tags` | 仅一个 `Neutral`（`font[color='green']:contains('NEUTRAL')`，绿色） | 40-46 | 常追加站点自有标签 |
| `search.selectors.id` | **未提供**，由 url 或 link 反推（`schemas/AbstractBittorrentSite.ts:591`） | — | 一般不需要 |
| `search.selectors.category` | **未提供**，需要自己从 `a[href^='browse.php?cat=']` 解析 | — | **需要**（两个范例都写了） |
| `detail.urlPattern` | `["/details.php"]` | 51 | 不需要 |
| `detail.selectors.title/link` | `div > h1` / `a[href^='download.php/']` | 53-54 | 一般不需要 |
| `userInfo.pickLast` | `["id", "name", "joinTime"]` | 59 | 不需要 |
| `userInfo.process[0]` | `/main.php`，取 `id`（从 userdetails 链接 querystring）与 `name` | 62-71 | 一般不需要 |
| `userInfo.process[1]` | `/userdetails.php` + `assertion: { id: "params.id" }`，取 13 个字段 | 72-128 | 追加字段时展开该步骤 |
| `userInfo.selectors`、`userInfo.requestDelay`、`userInfo.donorConfig` | **未提供** | — | 限速 / 捐赠倍率需求时才补 |
| `noLoginAssert` | **未提供** | — | 一般不需要（默认值见 `schemas/AbstractPrivateSite.ts:31-48`） |
| `category`、`levelRequirements`、`list`、`searchEntry`、`userInputSettingMeta` | **未提供** | — | 前两项需要自备（见下） |

## 最小可用定义骨架

```ts
import type { ISiteMetadata } from "../types.ts";
import { SchemaMetadata } from "../schemas/TCG.ts";
import { definedFilters, buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = { 1: "Example Category" };

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "example", // 必须与文件名 example.ts 一致
  name: "Example",
  tags: ["学习"],
  type: "private", // TCG 的 SchemaMetadata 不提供 type/schema，必须自己写
  schema: "TCG",
  urls: ["https://example.club/"],

  category: [
    { name: "类别", key: "category", options: buildCategoryOptionsFromDict(categoryMap), cross: { mode: "append", key: "c" } },
    { name: "种子状态", key: "incldead", options: [{ name: "Active", value: 0 }] },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors, // 必须展开，否则丢掉 rows/title/url/... 全部默认选择器
      category: { selector: "a[href^='browse.php?cat=']", attr: "href", filters: [(q: string) => categoryMap[Number(definedFilters.querystring(q, ["cat"]))]] },
    },
  },
};
```

`levelRequirements` 与 `timezoneOffset`（缺省 `"+0000"`，`index.ts:60`）按站点补；`schema: "TCG"` 会让站点实例落到 `schemas/TCG.ts` 的空类上（`index.ts:96-101`），行为等价于 `AbstractPrivateSite`。

## 搜索配置要点

- **请求基础**：`GET /browse.php`，`responseType: "document"`，固定参数 `incldead=1&titleonly=1&nonboolean=0`（10-16）；关键词写入 `params.search`（8 + `schemas/AbstractBittorrentSite.ts:266-268`）。两个现有定义都没有覆写 `search.requestConfig`，直接沿用默认值。
- **分类参数**：`thegeeks.ts:110-116` 与 `thevault.ts:76-82` 把站点分类写成 `key: "category"` + `cross: { mode: "append", key: "c" }`，实际生成 `c<catId>=1` 形式（`types/search.ts:226-240`）；`incldead`、`nonboolean` 用单值即可（`types/search.ts:202-248`）。分类 value 必须与站点真实 cat id 一致。
- **selectors 依赖 Sizzle 扩展伪类**：默认 `rows` 里的 `:has()` / `:contains()`（24-25）、`userInfo` 里的 `:contains()`（77、85、94、97）与 `:first`（65、69）都不是标准 CSS 选择器，只有在 Sizzle 下才成立——本仓库的解析路径正是 Sizzle（`schemas/AbstractBittorrentSite.ts:380`、488），所以能正常工作；但**不要把这些选择器复制到 `document.querySelectorAll` 或其他工具里**。
- **种子字段**：默认覆盖 `title/url/link/time/size/completed/seeders/leechers/comments/subTitle/tags`（27-46），`id` 由 url 或 link 反推（`schemas/AbstractBittorrentSite.ts:591`）。搜索页已能拿到下载链接（29），因此通常不必再走详情页。
- **category 映射**：种子的 `category` 需要自己写 selector，两个范例的写法一致——取 `a[href^='browse.php?cat=']` 的 href，再用 `definedFilters.querystring(query, ["cat"])` 取 id，最后查字典（`definitions/thegeeks.ts:141-150`、`definitions/thevault.ts:107-116`；filter 实现见 `utils/filter.ts:29-39`）。覆写 `search.selectors` 时务必展开 `...SchemaMetadata.search!.selectors`，否则会丢掉上面整组默认选择器。
- **高级搜索词**：`advanceKeywordParams: { imdb: false }`（18-20）。显式 `false` 表示 `imdb|xxx` 形式的查询会被跳过并返回 `i18n.noAdvanceParams`（`schemas/AbstractBittorrentSite.ts:244-257`），而不是「回落到普通关键词」。
- **`detail`**：给的是 `urlPattern: ["/details.php"]` 与 `title`/`link` 两个选择器（50-56），服务于 content-script 的详情页解析（`schemas/AbstractBittorrentSite.ts:716-755`）与 `getTorrentDownloadLink` 的补链接分支（764-778）。`urlPattern` 以 `new RegExp(pattern, "i").test(location.href)` 做子串匹配，因此 `"/details.php"` 足以命中带 query 的详情页。
- **`list` / `searchEntry` 未提供**：TCG 站点是服务端渲染的表格页，`search` 的选择器可直接复用到列表页，无需额外的 `list[]`。
- **请求延迟**：schema 未设置 `search.requestDelay`；需要限速时用站点级 `requestDelay`（`types/site.ts:119-124`，在 `schemas/AbstractBittorrentSite.ts:126` 生效）。

## 用户信息（userInfo）

两个步骤，均返回 Document：

1. `process[0]` 请求 `/main.php`（62-63），从 `a[href*='userdetails.php?id=']:first` 的 href 中取 `id`（经 `querystring` filter 取 `id` 参数）与 `name`（64-70）。**这一步依赖登录后的 `main.php` 上存在指向自己资料的链接**。
2. `process[1]` 请求 `/userdetails.php`，`assertion: { id: "params.id" }`（72-74）：因为请求配置里没有 `params.id`，框架会直接把上一步的 id `set` 到 `params.id`（`schemas/AbstractPrivateSite.ts:151-159`），即最终请求 `/userdetails.php?id=<id>`。

第 2 步覆盖的字段（76-127）：

| 字段 | 取法要点 | 行号 |
| --- | --- | --- |
| `joinTime` / `lastAccessAt` | `td:contains('Join date'/'Last seen') + td:first`，先用 `split("(", 0)` + `trim` 去掉尾部的 "(10 months ago)"，再 `parseTime` | 76-88 |
| `messageCount` | 站内信链接后的 `b`，`parseNumber` | 89-92 |
| `uploaded` / `downloaded` | `td.rowhead:contains('Uploaded'/'Downloaded') + td`，同样先切掉括号内容再 `parseSize` | 93-100 |
| `ratio` | 站点用 `---` 表示无分享率，映射为 `-1` | 101-104 |
| `seeding` | `img[title='seeders'] + span:first` | 105 |
| `levelName` | `td.rowhead:contains('Class') + td` | 106 |
| `bonus` / `bonusPerHour` | 用 `{ text: "N/A" }` 占位，表示站点不提供该数据 | 107-112 |
| `seedingSize` | selector 指向做种表 `div#kd1 > table.details > tbody`，用 `elementProcess` 遍历各行累加第 4 列的 `parseSize` | 113-126 |

其余要点：

- `pickLast` 默认 `["id", "name", "joinTime"]`（59）：命中缓存时这三个字段不再重复请求；两个现有定义都未改动它。
- `bonusPerHour` 给的是 `"N/A"`，`donorConfig.bonusPerHourMultiplier` 也未被 `SchemaMetadata` 提供，TCG 路径不会做时魔倍率修正（该逻辑只在 `schemas/NexusPHP.ts:868-870`）。若站点实际有魔力值，需自行覆写 `bonus` / `bonusPerHour` 的 selector。
- **等级要自己写**：`levelRequirements` 不在 `SchemaMetadata` 里，而 `levelName` 由第 2 步直接取出（106），因此只在 definition 里补齐等级表，`levelId` 就会由 `guessUserLevelId` 按名称反推（`schemas/AbstractPrivateSite.ts:194-197`、`utils/level.ts:300-310`）。注意 `guessUserLevelId` 的匹配是「站点等级表里的 name 包含页面取到的 levelName」，因此 `name` 文案要尽量与页面一致。
- `noLoginAssert` 未定义，走 `schemas/AbstractPrivateSite.ts:31-48` 的默认值（401/403/502/504 + URL 模式匹配）；TCG 站点未登录时通常会 302 到登录页，命中默认 URL 模式即可。
- 两个现有定义的 `levelRequirements`（`definitions/thegeeks.ts:154-176`、`definitions/thevault.ts:120-142`）完全一致：User / Power User / Extreme User 三级，只写了 `interval` 与 `uploaded`。

## 常被覆写的类方法

`schemas/TCG.ts:133` 是一个空类（`export default class TCG extends PrivateSite {}`），**本 schema 自身没有定义任何可覆写的方法**。TCG 定义若需要覆写，等价于覆写 `AbstractPrivateSite` / `AbstractBittorrentSite` 的钩子（导入写法：`import PrivateSite from "../schemas/AbstractPrivateSite"`，见 `definitions/milkie.ts:3`），常见的有：

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected override loggedCheck(res: AxiosResponse): boolean` | 未登录时返回 200 而非跳转（基类默认检查状态码、responseURL、refresh 头） | `schemas/AbstractPrivateSite.ts:50-107`；范例 `definitions/hdbits.ts:331-341` |
| `public override async getUserInfoResult(lastUserInfo = {})` | 用户信息需要额外页面/接口补充时 | `schemas/AbstractPrivateSite.ts:113-215`；范例 `definitions/torrentleech.ts:362-383` |
| `protected async parseUserInfoFor{Field}(flushUserInfo)` | 某字段需要在抓取流程内做额外请求（方法名按字段 PascalCase 动态派发） | `schemas/AbstractPrivateSite.ts:177-191`；范例 `definitions/torrentleech.ts:400-430` |
| `public override async getTorrentDownloadLink(torrent: ITorrent)` | 搜索页的 `download.php/...` 链接需要补参数或改走接口 | `schemas/AbstractBittorrentSite.ts:764-778`；范例 `definitions/pornolab.ts:264` |
| `public override async request<T>(axiosConfig, checkLogin = true)` | 需要统一加 header / 改 `responseType` | `schemas/AbstractBittorrentSite.ts:119-167`；范例 `definitions/milkie.ts:125-139` |
| `protected override parseTorrentRowForTags(torrent, row, searchConfig)` | 要在默认 `Neutral` 标签之外追加优惠/免费标签 | `schemas/AbstractBittorrentSite.ts:615-637`；范例 `definitions/torrentleech.ts:385-397` |

若覆写，请同样写出 `export default class Example extends TCG {}`（导入 `../schemas/TCG`）或直接继承 `PrivateSite`；仅当确有必要时才加类，否则保持与其他 TCG 定义一致的无类写法。

## 范例定义

- `definitions/thegeeks.ts` — 标准写法：展开 `...SchemaMetadata`，补 `category`（category/incldead/nonboolean 三组）、覆写 `search.selectors.category` 做 id→名称映射、自备 `levelRequirements`；无 `default class`。
- `definitions/thevault.ts` — 与 thegeeks 同构的另一个站，可用来对照「同一模板下只有 categoryMap 与 `urls`/`name` 不同」的最小差异。

## 常见坑

1. **`SchemaMetadata` 没有 `type` 和 `schema`**：不写 `type: "private"` 时，`index.ts:41-42` 的类型判断失败会把 `schema` 补成 `AbstractBittorrentSite`，站点将不会做登录检查、也不会采集用户信息。TCG 定义必须自己写这两行（`definitions/thegeeks.ts:105-106`）。
2. **只写 `userInfo: { ... }` 会整段替换默认流程**：TCG 的默认用户信息全在 `process` 里，覆写字段时应展开 `process[0]` / `process[1]` 后**只加不改**，否则会丢掉 `joinTime`、`uploaded` 等既有选择器（对比 `definitions/digitalcore.ts:188-208` 的展开写法）。
3. **`search.selectors` 是整组替换**：只写 `category` 而不展开 `...SchemaMetadata.search!.selectors`，会丢掉 `rows/title/url/link/time/size/...`，搜索直接解析不出结果（正确写法见 `definitions/thegeeks.ts:139-151`）。
4. **列位置写死在 `td:nth-child(N)`**（30-38）：分叉站增删列后这些数字全部要重排，且错位后不会报错，只会出现「大小/做种数明显不对」。
5. **选择器含 Sizzle 专有伪类**（`:has`、`:contains`、`:first`）：见「搜索配置要点」，换到非 Sizzle 环境会直接抛异常或匹配为空。
6. **`completed` 的 `Never` 需要预处理**（32-35）：跳过 `replace("Never", "0")` 会让 `parseNumber("Never")` 得到 0 或 NaN 类结果，表现为完成数异常。
7. **`bonus`/`bonusPerHour` 默认是 `"N/A"`**（107-112）：如果站点其实提供魔力值，必须换成真实 selector，否则前端会一直显示 N/A。
8. **`version` 要显式覆盖**：`SchemaMetadata` 写的是 `0`（6），现有定义都写 `1`（`definitions/thegeeks.ts:97`）；按 `types/site.ts:46-54` 的约定 TCG 不在「不需要更新版本号」名单内。
9. **`detail.urlPattern` 只影响 content-script**：`["/details.php"]`（51）用于判定「当前页是不是详情页」，与搜索请求无关；站点详情页路径不同时要同步改（`types/site.ts:207-214`）。
