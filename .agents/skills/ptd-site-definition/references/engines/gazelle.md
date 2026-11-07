# Gazelle 站点定义规范

Gazelle 是一套广泛用于音乐/影视 PT 站的开源程序，页面以 HTML 表格呈现，本仓库由 `src/packages/site/schemas/Gazelle.ts`（709 行）承载。`schemas/Gazelle.ts:205-208` 的注释明确了分工：**站点支持 JSON API 且数据完整时应当用 `GazelleJSONAPI`**，其余走本 schema。

用户信息与搜索都依赖 Gazelle 的经典页面结构（`table.torrent_table` 列表、`/user.php?id=` 资料页、`.box` 统计块），因此定义文件通常只做「补 `category` + 补 `levelRequirements` + 少量选择器覆写」。

下文行号未特别说明时均指 `src/packages/site/schemas/Gazelle.ts`。

## 判定站点是否属于该引擎

- 种子列表页是 `table.torrent_table`（`schemas/Gazelle.ts:109`），行分两类：种子组行带 `group` / `group_redline`，单种行带 `torrent` / `torrent_redline`（`schemas/Gazelle.ts:459-464`）。
- 下载链接形如 `torrents.php?action=download&id=<torrentid>`（`schemas/Gazelle.ts:244`）；详情页为 `torrents.php?id=` 或 `torrents.php?torrentid=`（`schemas/Gazelle.ts:241`）。
- 排序链接带 `order_by=time|size|seeders|leechers|snatched`（`schemas/Gazelle.ts:466-474`）。
- 用户页 `/user.php?id=`、首页 `/index.php`，统计值分布在 `.box` 区块中（`schemas/Gazelle.ts:189`、`269-295`）。
- 站点支持 `torrents.php?action=…` 之外还提供 `/ajax.php` 时，**先判断是不是 `GazelleJSONAPI`**（见下条），不要默认用本 schema。

易混淆情况：

- **GazelleJSONAPI**：请求 `/ajax.php?action=browse` 返回 JSON 的站点，应使用 `schema: "GazelleJSONAPI"`（见 [gazelle-json-api.md](gazelle-json-api.md)）。二者共用 `GazelleBase`（`schemas/Gazelle.ts:375`），但搜索与用户信息的实现完全不同。
- **Luminance**：也是 `GazelleBase` 的子类，但列表页用 `/torrents.php?action=advanced` 且列索引推导方式不同，属于独立 schema（见 [luminance.md](luminance.md)）。
- **NexusPHP / Unit3D**：中文站与 Laravel 站的表格结构和类名体系完全不同，不适用本 schema。

## SchemaMetadata 默认值

`schemas/Gazelle.ts:209-373` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 210 | 现状全部显式写 `1`（`definitions/anthelion.ts`、`definitions/passthepopcorn.ts` 等） |
| `search.keywordPath` | `"params.searchstr"` | 212 | 不需要 |
| `search.requestConfig` | `url: "/torrents.php"`、`responseType: "document"`、`params.searchsubmit: 1` | 213-217 | 搜索入口不同的站用 `searchEntry` 表达 |
| `search.selectors.rows` | `table.torrent_table tr:gt(0)` | 109、220 | 换表格类名时要改 |
| `search.selectors.id` | 优先从下载链接取，再回落到 `torrents.php?id=`，filter `querystring(torrentid,id)` | 221-226 | 一般不需要（这样拿到的是种子 id 而不是组 id） |
| `search.selectors.title` | `:self` + `GazelleUtils.genTitleElementProcess()` | 227-230 | 标题结构特别时才改 |
| `search.selectors.subTitle` | `.tags` / `> td:has(a[...]) a:not(span a):last`，配 `switchFilters` 区分单种行与组内行 | 231-239 | 视站点 |
| `search.selectors.url` | `a[href*='torrents.php?id=']` 等 | 240-243 | 一般不须改 |
| `search.selectors.link` | `a[href*='torrents.php?action=download']:first` | 244 | 一般不须改 |
| `search.selectors.category` | **被 TODO 注释掉，未提供** | 245 | **必须自己补**（否则列表页没有分类） |
| `search.selectors.time` | `baseTimeSelector`（`<span title="...">` 的 title） | 110-131、246 | 视站点 |
| `search.selectors.progress` / `status` | `{ text: 0 }` / `{ text: ETorrentStatus.unknown }` | 247-248 | 需要进度/状态时自补 |
| `search.selectors.tags` | 仅 `strong:contains('Freeleech!')` → Free | 249 | 常追加站点自有标签 |
| `search.selectors.seeders/leechers/completed/size` | **未提供 selector**，由 `transformSearchPage` 按表头自动推导（见下节） | 219、466-474 | 表头结构不同时覆写 `guessSearchFieldIndexConfig` |
| `list` | 三条：`commonPagesList`、`detailPageList`、`top10PageList`（分别导出在 137、141、165） | 253-263 | 需要额外列表页时追加 |
| `userInfo.pickLast` | `["id"]` | 266 | 一般不需要 |
| `userInfo.process` | 两步：`/index.php` 取 `id` → `/user.php?id=` 取 11 个字段 | 267-296 | 资料页路径不同时改 `requestConfig` |
| `userInfo.selectors` | 10 个字段：`id`、`name`、`messageCount`、`uploaded`、`downloaded`、`ratio`、`levelName`、`bonus`、`joinTime`、`lastAccessAt`、`uploads`（用 `genStatBoxSelector` + `BoxName` 拼 `.box` 选择器） | 297-371 | 站点改版时逐个覆写 |
| `detail` | **未提供** | — | 需要 content-script 的详情页适配时自补 |
| `category`、`levelRequirements`、`noLoginAssert`、`donorConfig`、`userInputSettingMeta`、`searchEntry`、`timezoneOffset` | **未提供** | — | `category` 与 `levelRequirements` 必需；时区缺省为 `+0000`（`index.ts:60`） |

## 最小可用定义骨架

```ts
import type { ISiteMetadata } from "../types";
import Gazelle, { SchemaMetadata } from "../schemas/Gazelle.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "example", // 必须与文件名一致
  name: "Example",
  tags: ["音乐"],

  type: "private",
  schema: "Gazelle",
  urls: ["https://example.com/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [{ name: "Music", value: 1 }], // 必须来自站点真实分类
      cross: { mode: "appendQuote" }, // Gazelle 常用 filter_cat[1]=1
    },
  ],

  levelRequirements: [{ id: 1, name: "User", privilege: "..." }],
};

export default class Example extends Gazelle {}
```

## 搜索配置要点

- **请求**：`GET /torrents.php`、`responseType: "document"`、`params.searchsubmit = 1`（213-217）；关键词写入 `params.searchstr`（212）。
- **列索引自动推导**：`seeders`、`leechers`、`completed`、`size`、`time` 的取值位置不是写死的，而是 `transformSearchPage`（476-587）调用 `guessSearchFieldIndexConfig()`（466-474）扫描表头单元格，命中 `a[href*='order_by=seeders']`、`img[src*='seeders']` 一类的特征后生成 `> td:nth-child(n)`。站点表头结构不同时，覆写 `guessSearchFieldIndexConfig()`（范例 `definitions/nebulance.ts`、`definitions/anthelion.ts`）。
- **种子组与单种行**：Gazelle 列表里一个「种子组」下可能有多个单种，行 class 决定分组（459-464）；`transformSearchPage` 会先解析组信息再展开组内种子（588-680）。站点改了行 class 名，必须覆写 `torrentClasses`。
- **`subTitle` 的双形态**：默认用 `switchFilters` 对「单种行」直接取 `.tags`、对「组内行」用 `GazelleUtils.extractTags` 提取属性（231-239），改这里要同时顾及两种行。
- **`category` 必须自补**：源码里是 `// TODO category: {}`（245），站点需要自己给 `category` 选择器与 `metadata.category` 搜索分类。Gazelle 的搜索分类参数通常是 `filter_cat`，多选写法 `cross: { mode: "appendQuote" }`（`filter_cat[1]=1`）。
- **`list`**：默认三条覆盖常规列表页、详情页（`torrents.php?id=` 的组页）与 Top10（253-263，定义在 137/141/165）。新增特殊列表页时追加条目即可。

## 用户信息（userInfo）

默认两步（267-296）：

1. `GET /index.php`（document），只取 `id`（从 `a.username[href*='user.php']` 的 `id` 查询参数，299-303）。
2. `GET /user.php?id=$id$`（`assertion: { id: "params.id" }`），取 `name`、`messageCount`、`uploaded`、`downloaded`、`ratio`、`levelName`、`bonus`、`joinTime`、`lastAccessAt`、`seeding`、`seedingSize`、`uploads`。

- 选择器用 `genStatBoxSelector(BoxName.stats|personal|community, "<文案>")` 拼 `.box` 内的位置（189、337-370），站点改文案时替换对应项即可。
- `messageCount` 用 `elementProcess` 同时解析传统 `#alerts` 与弹窗 `.noty-notification`（307-335）。
- **`seedingSize` 默认没有 selector**：`Gazelle.getUserInfoResult` 在拿到 `id` 后若 `seedingSize` 仍为空，会调用 `getSeedingSize(id)` 翻页抓 `/torrents.php?userid=&type=seeding` 累加体积（686-692、377-426、427-434）。这一步请求量大，站点若能直接给出该值，写 selector 更划算。
- `levelName` 拿到但 `levelId` 缺失时，由 `levelRequirements` 反推（`schemas/AbstractPrivateSite.ts:194-197`）。
- `donorConfig` 在本 schema 未被消费（`bonusPerHourMultiplier` 只在 `schemas/NexusPHP.ts:866-873` 生效）。

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected get torrentClasses(): Record<"group" \| "unGroupTorrent", string[]>` | 列表行 class 名与默认不同时 | 459-464 |
| `protected guessSearchFieldIndexConfig(): Record<string, string[]>` | 表头没有 `order_by=` 排序链接或图标特征时 | 466-474 |
| `public override async transformSearchPage(doc, searchConfig)` | 行列结构整体不同时（尽量先用 selector 解决） | 476-587 |
| `protected getTorrentGroupInfo(group, searchConfig)` | 种子组的公共字段（标题、分类、标签）取法不同 | 588-596 |
| `protected async transformGroupTorrents(...)` / `transformUnGroupTorrent(...)` | 组内种子/单种的字段映射不同 | 597-680 |
| `public override async getTorrentDownloadLink(torrent)` | 下载链接不是 `torrents.php?action=download&id=` 时；默认实现走 `getTorrentDownloadLinkFactory("torrentid")`（436-455） | 681-684 |
| `public override async getUserInfoResult(lastUserInfo)` | 需要改动整体抓取流程（默认 = `super` + 补 `seedingSize`） | 686-692 |
| `protected async getSeedingSize(userId, sizeIndex = 0)` | 做种体积页面结构不同、或想跳过翻页 | 377-426 |
| `protected async getUserTorrentList(userId, page, type)` | 做种列表路径/参数不同 | 427-434 |

## 范例定义

- `definitions/awesomehd.ts`、`definitions/gfxpeers.ts` — 最小形态：只写身份字段 + `isDead: true`，不展开 `SchemaMetadata`（关站后无需解析能力）。
- `definitions/simurg.ts` — 只写 `category` 与 `levelRequirements`、不覆写任何方法的典型「页面结构标准」站。
- `definitions/jpopsuki.ts` — 音乐站，覆写三处引擎钩子：`guessSearchFieldIndexConfig`（`definitions/jpopsuki.ts:253`）、`getTorrentGroupInfo`（264）、`getUserTorrentList`（268）。
- `definitions/anthelion.ts` — 覆写 `transformSearchPage`（`definitions/anthelion.ts:332`）与 `getTorrentGroupInfo`（346），示范组信息结构不同时的处理。
- `definitions/nebulance.ts` — 用 `groupPageSelectors` / `categorySelector` 常量自定义列表页与分类选择器（`definitions/nebulance.ts:318-341`）。
- `definitions/passthepopcorn.ts` — 电影站：`category` 项较多，覆写 `transformSearchPage`（`definitions/passthepopcorn.ts:367`）适配自身列表结构。

## 常见坑

1. **忘了补 `category`**：`SchemaMetadata` 里是 TODO 注释（245），不补则搜索分类为空、列表页也拿不到分类。
2. **`seeders`/`leechers`/`completed`/`size` 不是 selector**：它们由表头推导（219、466-474）。只改 CSS 选择器而不改 `guessSearchFieldIndexConfig`，这些字段会一直是空。
3. **`id` 优先取下载链接**：这是为了避免把「种子组 id」当成「种子 id」（221-226）。覆写 `id` 选择器时要保留这个语义。
4. **`progress` / `status` 默认恒为 0 / unknown**（247-248）：站点没有做种进度信息时不要强行补，写了反而会误导用户。
5. **`...SchemaMetadata` 是浅展开**：覆写 `search.selectors` 时要连 `...SchemaMetadata.search!.selectors` 一起展开，否则 `title`/`subTitle`/`url`/`link` 全部丢失（范例见各定义中的 `...(SchemaMetadata.search?.selectors ?? {})` 写法）。
6. **`userInfo` 同理**：只想改一个选择器时用 `...SchemaMetadata.userInfo!` + `selectors: { ...SchemaMetadata.userInfo!.selectors, xxx }`，否则会连两步 `process` 一起丢掉。
7. **时区缺省是 `+0000`**：`index.ts:60` 只给 `schema === "NexusPHP"` 特殊待遇；Gazelle 站的发布时间多为站点本地时区，需要显式写 `timezoneOffset`（如 `-0500`）。
8. **`getSeedingSize` 会翻页请求**（377-426）：做种数量很多的站首次采集较慢，且请求路径基于 `/torrents.php`，站点改版后该值会静默变空。
9. **`version` 要显式覆盖**：`SchemaMetadata` 是 `0`（210），仓库现状写 `1`。
