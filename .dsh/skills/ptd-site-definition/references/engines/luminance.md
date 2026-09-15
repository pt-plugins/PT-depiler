# Luminance 站点定义规范

Luminance 是 Gazelle 的一个分支（Empornium / MoreThanTV / PixelCove 等站使用的源码），列表页与资料页的类名、列布局都是自研的。引擎实现在 `src/packages/site/schemas/Luminance.ts`（**实际 304 行**）：`export default class Luminance extends GazelleBase`（`:219`），而 `GazelleBase` 定义在 `schemas/Gazelle.ts:375`。注意它**只继承 `GazelleBase` 的三个工具方法**（`getSeedingSize` / `getUserTorrentList` / `getTorrentDownloadLinkFactory`），并不继承 `Gazelle.ts` 里默认类 `Gazelle` 的种子组解析逻辑——Luminance 的 `transformSearchPage` 里 `super.transformSearchPage(...)`（`:278`）最终落到 `AbstractBittorrentSite.transformSearchPage`（`schemas/AbstractBittorrentSite.ts:502`），即「一行 = 一个种子」的通用解析。

因此定义文件通常是「展开 `...SchemaMetadata` + 覆写 `category` 选择器 + 补 `levelRequirements`」；8 个现有定义中只有 `definitions/morethantv.ts` 导出了 default class。

下文行号若未特别说明，均指 `schemas/Luminance.ts`。

## 判定站点是否属于该引擎

正向特征（有其一即可进一步验证）：

- 列表页为 `/torrents.php`，默认用高级搜索接口 `?action=advanced`（`:10-16`）。
- 分类筛选参数是 `filter_cat[n]`（`definitions/cathoderaytube.ts:31-33`、`definitions/cgpeers.ts:41-45`、`definitions/empornium.ts:71-76`、`definitions/kufirc.ts:19-21`、`definitions/pixelcove.ts:64-66`），部分站还用 `filter_freeleech`（`definitions/happyfappy.ts:69-73`）。
- 列表页存在 `table#torrent_table`，且末表的首行是表头（`:240`、`:250`）。
- 用户资料页 `/user.php?id={id}`（`:87-93`），首页有 `a.username` 且 href 带 `id`（`:114-118`）。
- 图标类名：`span.icon_disk_seed` / `span.icon_disk_leech` / `span.icon_disk_grabbed`（`:50-52`），Free 与 2xUp 用 `span.icon[title*='Freeleech']` / `img[alt='DoubleSeed']`（`:66`、`:71`）。
- 资料页出现 `ul.stats > li`、`div[id='bonusdiv']`、`div[id='bonuslog']`（`:121`、`:145`、`:164`）。
- 站点源码基于 Empornium/Luminance（描述中常直接写明）。

易混淆情况：

- **Gazelle / GazelleJSONAPI**：Gazelle 的列表是「种子组行 + 组内种子行」（`Gazelle.ts:459-580`），分类从中部 `.cats_col` 自动取得；Luminance 走通用单行解析，**分类选择器在源码里被注释掉了**（`:45`），必须自己补。
- **MoreThanTV**：虽然 `schema: "Luminance"`，搜索已切到 `/api/torznab`（XML）（`definitions/morethantv.ts:58-108`）。判引擎要看站点源码而不是搜索接口。
- **同一引擎内分类列结构不同**：有的站分类在 `td.cats_col > div[title] > a` 的 href 里（cathoderaytube），有的只能读 `div` 的 `title` 属性（happyfappy / kufirc）。写选择器前先看真实页面。
- **`pornbay`** 只是保留 `schema: "Luminance"` 并标记 `isDead` 的极简定义，`...SchemaMetadata` 被注释掉（`definitions/pornbay.ts:2`、`:5`），不要把它当模板。
- 现有 8 个 Luminance 定义里，`definitions/pornbay.ts:18` 与 `definitions/morethantv.ts:45` 已 `isDead: true`；它们仍能反映 schema 的用法，但不要据此推断站点当前行为。

## SchemaMetadata 默认值

`schemas/Luminance.ts:7-217` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 8 | 现状定义写 `1`，改版过的站写 `2`（cgpeers / happyfappy / morethantv） |
| `search.requestConfig` | `url: "/torrents.php"`、`responseType: "document"`、`params: { action: "advanced" }` | 10-16 | 换搜索接口或改每页数量时覆写（happyfappy 加 `perPage: 100`，cgpeers 改 `url: "/torrent/browse"`） |
| `search.keywordPath` | `"params.title"` | 17 | 一般不改；站点走 torznab 时改成 `params.q`（morethantv） |
| `search.selectors.rows` | `table#torrent_table:last tr:gt(0)` | 19 | 一般不改；`transformSearchPage` 只在未定义时兜底（`:243-247`） |
| `search.selectors.id/title/url/link` | `a[href*='torrents.php?id=']`（id 用正则抽数字）、`a[href*='torrents.php?action=download']` | 20-25、42-43 | 站点链接形式不同才改（cgpeers 用 `a[href*='torrent/download/']`） |
| `search.selectors.subTitle` | 汇总 `div.tags a[href]` 文本，`", "` 连接 | 26-41 | 一般不改 |
| `search.selectors.time` | `span.time[title]` 的 `title`，`parseTime` | 44 | 一般不改 |
| `search.selectors.category` | **未提供**（源码注释掉） | 45 | **需要**：现有定义全部自补 |
| `search.selectors.status` / `progress` | 由下载链接内 `span` 的类名映射：`icon_disk_seed`→seeding、`icon_disk_leech`→downloading、`icon_disk_grabbed`→inactive；progress 只有 seed 为 100 | 46-61 | 站点图标类名不同就整套重写（empornium `:114-122`、cgpeers `:81-96`） |
| `search.selectors.tags` | 两项：`Free`（blue）、`2xUp`（lime） | 62-74 | 一般不改 |
| `userInfo.pickLast` | `["id"]` | 79 | 一般不改 |
| `userInfo.process` | 两步：先 `/` 取 `id`，再 `/user.php`（`assertion: { id: "params.id" }`）取 14 个字段 | 80-111 | 资料页路径不是 `/user.php?id=` 时改（cgpeers 改 `/user/$id$`） |
| `userInfo.selectors` | 15 个字段，见「用户信息」 | 112-193 | 站点改版时覆写；`category`/`levelName` 之外的字段基本能用 |
| `userInfo.requestDelay` | **未提供** | — | 需要限速时补 |
| `userInfo.donorConfig` | **未提供**，本引擎也不消费 | — | 写了无效（只有 `NexusPHP.ts:868-871` 消费） |
| `list` | 一条：`urlPattern: ["/torrents\\.php(?!\\?id=\\d+$)"]`，无 `selectors`（继承 `search.selectors`）、无 `mergeSearchSelectors`（默认 `true`） | 196-200 | 一般不改；另有特殊列表页时追加条目 |
| `detail.urlPattern` | `["/torrents\\.php\\?id=\\d+"]` | 203 | 一般不需要 |
| `detail.selectors` | `title`（`#content > .details > h2`，回落 `table.torrent_table tr[id] strong`）、`id`、`link` | 204-215 | 详情页模板不同才改（cgpeers） |
| `timezoneOffset` | **未提供**（`index.ts:60` 回落到 `"+0000"`） | — | 站点时区非 UTC 时必须写（empornium 写 `"-1100"`） |
| `category` / `levelRequirements` / `noLoginAssert` / `userInputSettingMeta` / `searchEntry` / `download` / `detail.requestConfig` | **未提供** | — | `category` 与 `levelRequirements` 通常需要 |

## 最小可用定义骨架

```ts
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromDict } from "../utils";
const categoryMap: Record<number, string> = { 1: "Movies", 2: "TV" };
const catOpts = buildCategoryOptionsFromDict(categoryMap);
const toCategoryName = (q: string) => categoryMap[Number(q.match(/filter_cat\[(\d+)\]=/)?.[1])] ?? "";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "example", // 必须与文件名 example.ts 一致
  name: "Example",
  tags: ["综合"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "Luminance",
  urls: ["uggcf://rknzcyr.bet/"],
  category: [
    { name: "类别", key: "filter_cat", options: catOpts, cross: { mode: "appendQuote" } },
    { name: "优惠", key: "filter_freeleech", options: [{ name: "Free", value: 1 }] },
  ],
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: { selector: "td.cats_col > div[title] > a", attr: "href", filters: [toCategoryName] },
    },
  },
  levelRequirements: [{ id: 1, name: "User" }, { id: 2, name: "Member", uploaded: "50GB", ratio: 1 }],
};
```

## 搜索配置要点

- **默认请求**：`GET /torrents.php?action=advanced`，`responseType: "document"`，关键词写入 `params.title`（`:10-17`）。定义里加 `params` 时要展开默认值（happyfappy 只加 `perPage: 100` 并展开 `requestConfig`，`definitions/happyfappy.ts:78-83`）。
- **高级搜索词**：`keywordPath` 是 `params.title`，站点的「全文搜索」参数是 `searchtext`，所以几乎每个定义都定义一个高级搜索词把 `params.title` 改名为 `params.searchtext`——有的是 `imdb`（cathoderaytube）、有的是自定义的 `terms`（happyfappy / kufirc / empornium）。按 `types/search.ts:106-113` 的约定，除 `imdb` 外的关键词必须显式声明，不支持时写 `imdb: false`（cgpeers `:60-62`、empornium `:89`）。
- **默认覆盖的种子字段**：`rows`、`id`、`title`、`subTitle`、`url`、`link`、`time`、`status`、`progress`、`tags`（`:18-75`）——**没有 `category`**，也**没有 `size`/`seeders`/`leechers`/`completed`/`comments`/`author`**。
- **列索引由类方法自动推导**：`guessSearchFieldIndexConfig()`（`:220-229`）把表头单元格匹配到 `size`/`seeders`/`leechers`/`completed`/`comments`/`author`，`transformSearchPage` 再据此生成 `> td:eq(N)` 选择器（`:250-274`）。因此覆盖 `search.selectors` 时不要手写这几列，除非站点表头无法识别。
- **覆写 `search.selectors` 必须展开默认值**：`...SchemaMetadata.search!.selectors`，同时外层还要 `...SchemaMetadata.search`（`definitions/cgpeers.ts:54-97`、`definitions/empornium.ts:86-123`、`definitions/happyfappy.ts:76-78`）。
- **category 写法**：分类筛选统一用 `key: "filter_cat"` + `cross: { mode: "appendQuote" }`，生成 `requestConfig.params.filter_cat = { "1": 1 }`（`SetSearchSolution/utils.ts:66-68`），由 axios 序列化。优惠项可用两种写法：`{ key: "filter_freeleech" }`（不写 `cross`，`definitions/cathoderaytube.ts:36-39`）或 `{ key: "free", cross: { mode: "append", key: "" } }`（生成 `params.filter_freeleech = 1`，`definitions/happyfappy.ts:68-73`）。标签组合筛选用 `cross: { mode: "custom" }` + `generateRequestConfig` 拼 `taglist=a+b`（`definitions/happyfappy.ts:43-67`、`definitions/kufirc.ts:80-102`）。
- **`searchEntry`**：SchemaMetadata 未提供，现有 Luminance 定义也都没用；默认搜索入口直接用 `search.requestConfig`（`types/site.ts:139-144`）。`list` 里的 `keywords` 选择器也不需要写，会按 `keywordPath` 推断。
- **`detail`**：默认已能解析 `title`/`id`/`link`，一般不用改；cgpeers 因为详情页是另一套模板而覆写了三个字段（`definitions/cgpeers.ts:147-155`），覆写时同样要展开默认值。

## 用户信息（userInfo）

- **两步 process**（`:80-111`）：第 1 步请求 `/`（`responseType: "document"`）只取 `id`；第 2 步请求 `/user.php`，用 `assertion: { id: "params.id" }` 把 id 写进查询参数，取 `name`、`joinTime`、`lastAccessAt`、`uploaded`、`downloaded`、`levelName`、`bonus`、`ratio`、`uploads`、`bonusPerHour`、`seeding`、`seedingSize`、`messageCount`、`posts`。资料页路径不同的站只需重写第 2 步的 `requestConfig.url` 与 `assertion`（cgpeers 改成 `/user/$id$` + `assertion: { id: "url" }`，`definitions/cgpeers.ts:100-127`）。
- **selectors 默认覆盖 15 个字段**（`:112-193`）：`id`、`name`、`joinTime`、`lastAccessAt`、`uploaded`、`downloaded`、`levelName`、`bonus`、`ratio`、`uploads`、`bonusPerHour`、`seeding`、`seedingSize`、`messageCount`、`posts`。**未覆盖**：`snatches`、`leeching`、`invites`、`avatar`、`isDonor`、`hnrUnsatisfied`、`trueRatio`、`seedingTime`。
- **`seedingSize` 走动态钩子**：`AbstractPrivateSite.getUserInfoResult` 会用 `parseUserInfoFor${pascalCase(field)}` 找同名方法（`AbstractPrivateSite.ts:177-181`），因此 `process` 里的 `seedingSize` 会命中 `parseUserInfoForSeedingSize`（`:286-303`）：先按 `userInfo.selectors.seedingSize`（`ul.stats > li:contains('Seeding Size:')`，`:183`）直读，读不到再回落到 `GazelleBase.getSeedingSize(userId)` 翻做种列表累加（`Gazelle.ts:377-423`，请求 `/torrents.php?userid=&page=&type=seeding`）。**改字段名会连带改掉这个钩子名**。
- **`pickLast` 默认 `["id"]`**（`:79`）：缓存里拿到 id 时第 1 步会被跳过（`AbstractPrivateSite.ts:138-141`）。覆写 `userInfo` 时要展开 `...SchemaMetadata.userInfo!` 才能保留它。
- **`ratio` 用 `-1` 表示无限**（`:150-156`）：源码注释说明 `Infinity` 无法通过 `sendMessage` 传递，前端另有处理；自定义 ratio 选择器时应沿用 `-1`。
- **`bonusPerHour` 是从 `div#bonuslog` 里算出来的**（`:162-173`）：取日志中含 `hrs` 的第一行，按 `| N credits |` 除以 24。站点日志格式不同就得重写该字段。
- **`noLoginAssert` 未提供**：默认值来自 `AbstractPrivateSite.ts:31-48`（401/403/502/504 + `login` 系列 URL 模式）；需要额外兜底时在定义里补。
- **`donorConfig` 无效**：本引擎不读取它（只有 `NexusPHP.ts:868-871` 会应用 `bonusPerHourMultiplier`）。
- **`levelRequirements`**：本引擎不提供默认值，必须自己写（`id` 递增 + `name` 必须与站点 `levelName` 文本一致 + `interval`/`uploaded`/`ratio`/`uploads`/`posts` 等），否则不会有 `levelId`（`AbstractPrivateSite.ts:194-197`）。

## 常被覆写的类方法

| 方法 | 何时覆写 | 行号 / 范例 |
| --- | --- | --- |
| `protected guessSearchFieldIndexConfig(): Record<string, string[]>` | 站点表头无法用默认锚点识别（`order_by=size`、`td:contains('Size')` 等）时改锚点 | 220-229（Gazelle 版本在 `Gazelle.ts:466-474`） |
| `public override async transformSearchPage(doc, searchConfig)` | 需要改自动列选择器逻辑，或在解析前修正 DOM；默认只对 `doc instanceof Document` 生效 | 231-279 |
| `public override async getTorrentDownloadLink(torrent)` | 下载链接的参数名不是 `id`（MoreThanTV 是 `torrentid`） | 281-284；`definitions/morethantv.ts:229-233` |
| `protected async parseUserInfoForSeedingSize(flushUserInfo, dataDocument)` | 做种量来源变化（如改走别的接口） | 286-303 |
| `protected async getSeedingSize(userId, sizeIndex = 0)`（继承自 `GazelleBase`） | 做种列表页不是 `/torrents.php?userid=&page=&type=seeding` | `Gazelle.ts:377-423` |
| `protected async getUserTorrentList(userId, page = 1, type = "seeding")`（继承自 `GazelleBase`） | 同上 | `Gazelle.ts:427-434` |
| `protected getTorrentDownloadLinkFactory(torrentIdParam)`（继承自 `GazelleBase`） | 不是覆写点，而是自定义 `getTorrentDownloadLink` 时的复用工具 | `Gazelle.ts:436-455` |

覆写时保持签名一致并加 `override` 关键字（`pnpm check` 会校验）。

## 范例定义

- `definitions/cathoderaytube.ts` — 最小标准写法：`filter_cat` + `filter_freeleech` 分类、从 `td.cats_col > div[title] > a` 的 href 反解分类名、`imdb` 高级搜索词改写为 `searchtext`。
- `definitions/cgpeers.ts` — 改版站：搜索地址换成 `/torrent/browse`、整段覆写 `search.selectors`（含 `status`/`progress`）、`userInfo.process` 改成 `/user/$id$`、覆写 `detail.selectors`。
- `definitions/happyfappy.ts` — 用 `buildCategoryOptionsFromList` + `cross: { mode: "custom" }` + `generateRequestConfig` 实现 `taglist=a+b` 组合筛选；`perPage: 100`；自定义 `terms` 高级搜索词。
- `definitions/empornium.ts` — 站点图标类名不同，整套重写 `status` 的 `case` 映射；`advanceKeywordParams.imdb: false` 并新增 `terms`。
- `definitions/morethantv.ts` — 唯一导出 default class 的定义：搜索整体切到 `/api/torznab` XML（`skipNonLatinCharacters: true`、`keywordPath: "params.q"`、手写全部选择器），并覆写 `getTorrentDownloadLink`。
- 反例：`definitions/pornbay.ts` — 注释掉 `...SchemaMetadata` 后仅剩 `isDead`，不是可参考的骨架。

## 常见坑

1. **`category` 默认没有选择器**：`:45` 明确注释掉了，不补 `search.selectors.category` 就永远没有分类。
2. **列索引不考虑 colspan**：Luminance 用 `elementIndex` 直接生成 `> td:eq(N)`（`:250-273`），而 Gazelle 会累加 `colSpan`（`Gazelle.ts:490-503`）。列表页有合并单元格的站点会整体错位，需要覆写 `transformSearchPage`。
3. **列选择器自动生成依赖 `table#torrent_table` 的表头**：`:240`、`:250` 取的是 `table#torrent_table:last tr:first > td`，XML/JSON 接口的响应里没有这些表头，自动生成会静默失效——morethantv 因此手写了 `rows`/`id`/`title`/`link`/`size`/`seeders` 等全部字段（`definitions/morethantv.ts:85-107`）。
4. **`rows` 已定义就不再兜底**：`:243-247` 只在 `searchEntry.selectors.rows` 为空时才生成 `table#torrent_table:last tr:gt(0)`。
5. **覆盖 `search.selectors` 必须展开默认值**：否则会丢掉 `rows`/`title`/`url`/`link`/`time`/`status`/`progress`/`tags`（`definitions/cgpeers.ts:63-97` 是正确写法）。
6. **只写 `userInfo: { selectors: {...} }` 会丢 `pickLast` 与 `process`**：标准写法是先 `...SchemaMetadata.userInfo!`（`definitions/cgpeers.ts:100-129`）。
7. **`tags` 默认选择器是网页类名**：`span.icon[title*='Freeleech']` / `img[alt='DoubleSeed']`（`:66`、`:71`），对没有这些图标的接口返回不会命中，需要整段重写（morethantv 用 `[name="downloadvolumefactor"][value="0"]`，`definitions/morethantv.ts:102`）。
8. **`status`/`progress` 用 `case` + `Sizzle.matchesSelector` 判定**（`:46-61`）：`case` 的键是 CSS 选择器，站点换图标类名后不会报错，只会全部落到默认值 `unknown` / `0`。
9. **`timezoneOffset` 没有默认值**：`index.ts:60` 对非 NexusPHP 站点回落 `"+0000"`；有些定义仍显式写 `"+0000"`（冗余），Empornium 写 `"-1100"`（`definitions/empornium.ts:63`）——时区错了会让 `time`/`lastAccessAt` 偏移。
10. **下载链接补全依赖参数名**：默认 `getTorrentDownloadLinkFactory("id")`（`:281-284`）只处理 `?id=`；链接形如 `torrents.php?torrentid=123` 的站必须覆写（morethantv），否则得到的不是下载链接。
11. **`list` 只有一条且没有 selectors**：`mergeSearchSelectors` 默认 `true`（`AbstractBittorrentSite.ts:660`），列表页解析直接用 `search.selectors`；新增列表页条目时注意 `urlPattern` 的先后顺序（`transformListPage` 命中即 `break`，`AbstractBittorrentSite.ts:661-664`）。
12. **`pornbay` 的写法不要模仿**：`definitions/pornbay.ts:2`、`:5` 把 `...SchemaMetadata` 注释掉了，该站点没有任何 `search`/`userInfo` 配置，仅靠 `isDead: true` 存在；同时它仍然声明 `schema: "Luminance"`。
