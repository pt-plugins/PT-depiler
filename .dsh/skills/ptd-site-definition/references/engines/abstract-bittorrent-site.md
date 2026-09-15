# AbstractBittorrentSite 站点定义规范

`src/packages/site/schemas/AbstractBittorrentSite.ts` 是所有站点模板的根基类（`AbstractPrivateSite`、`NexusPHP`、`Unit3D`、`Gazelle` 等全部直接或间接继承它），同时也是公共 BT 站点（`type: "public"`）在未指定 `schema` 时的**回落基类**（`index.ts:41-42`、`index.ts:97`）。它自带一整套「按 `siteMetadata.search / list / detail` 发请求 → 用选择器解析 → 组装 `ITorrent`」的通用流程，因此公共 BT 站通常**只写 metadata、不导出 `default class`**；只有当需要在流程中间插入逻辑（补下载链接、读页面内 token、改写列表页结构）时才导出 `default class Xxx extends BittorrentSite`。

下文行号若未特别注明，均指 `src/packages/site/schemas/AbstractBittorrentSite.ts`（该文件实际 791 行）。

## 什么情况下落到这个基类

三种来源，优先级从高到低（`index.ts:79-102`）：

1. **definition 导出了 `default class`** → 直接使用该 class（`index.ts:81-84`），此时 `siteMetadata.schema` 被忽略。这也是 `nyaa`、`ehentai`、`nekobt`、`exttorrents`、`audiobookbay` 等公共站的做法。
2. **未导出 class，且 `schema` 在 `schemas/` 中有同名实现** → 用该 schema 类（`index.ts:93-101`）。
3. **未导出 class，且 `schema` 缺省或没有对应实现** → 按 `type` 回落：`private` → `AbstractPrivateSite`，`public` → `AbstractBittorrentSite`（`index.ts:41-42`、`index.ts:96-98`）。

因此对公共 BT 站而言：

- 写 `type: "public"` 且**不写** `schema`，就是"隐式回落"到本基类。现有 15 个 public 定义全部属于这种写法，**没有一个声明 `schema`**。
- 显式写 `schema: "AbstractBittorrentSite"` 效果相同，但仓库现状没有先例，不必画蛇添足。
- 如果给 public 站写了一个 `schemas/` 里不存在的 `schema` 名（例如复制 private 站模板留下 `schema: "NexusPHP"` 却没改），`index.ts:96-98` 会静默回落，**不会报错**——写错引擎时不会有任何提示，必须自己核对。

与 `AbstractPrivateSite` 的分工（`AbstractPrivateSite.ts:26` 继承自本基类）：

| 能力 | AbstractBittorrentSite | AbstractPrivateSite |
| --- | --- | --- |
| 搜索列表 / 列表页 / 详情页解析 | 有（本文件） | 继承 |
| 下载链接生成 `getTorrentDownloadLink` | 有（764-778） | 继承 |
| 登录态判定 `loggedCheck` | **恒返回 true**（98-100） | 覆写为按状态码/URL/refresh 头/选择器判定（50-107），消费 `metadata.noLoginAssert` |
| `allowQueryUserInfo` getter | **不存在** | 有（27-29） |
| `getUserInfoResult` 用户信息抓取 | **不存在** | 有（113-215），消费 `metadata.userInfo` / `levelRequirements` |
| `SchemaMetadata` 默认值 | `{ version: -1, search: {} }`（39-42） | `{ version: -1, search: {}, userInfo: {} }`（`AbstractPrivateSite.ts:20-24`） |

**怎么判断一个新站该写 `public` 还是 `private`**：`type` 只有这两个取值（`types/site.ts:75`）。要登录才能搜索、需要抓用户信息/等级/保号数据的站是 `private`（并应优先考虑 NexusPHP / Unit3D / Gazelle 等现成引擎）；无需登录即可检索、没有账号体系的站是 `public`。`type` 还会顺带决定两件事：缺省 `schema`（`index.ts:41-42`）与 `userConfig.allowQueryUserInfo` 的默认值（`index.ts:105-106`，依据 metadata 里是否存在 `userInfo`）。把 public 站写成 `private` 会引入一整套无用的 `noLoginAssert` 判定，反之则会让 public 站失去应有的解析能力。

> 两个 `SchemaMetadata` 都不会被框架自动合并：`index.ts:100-101` 只取 schema 模块的 `default` 类，`getDefinedSiteMetadata`（`index.ts:47-63`）只读 definition 自己的 `siteMetadata`。它们的用途是给 definition 里手写 `...SchemaMetadata` 展开用；对 public 站来说展开它只等于 `{ version: -1, search: {} }`，实际意义不大（15 个 public 定义一个都没展开它）。

## 它提供的通用能力

只列对写 definition 有直接影响的：

- **`request(axiosConfig, checkLogin = true)`（119-167）**：所有请求的统一入口。垫片为 `baseURL = this.url`、`url = "/"`、`timeout = userConfig.timeout ?? 30e3`（121-123）；发请求前 `await sleepAction(metadata.requestDelay ?? 0)`（126）；`responseType: "document"` 时自动把 Cloudflare 的 `span.__cf_email__` 还原成明文邮箱（133-146）；命中 Cloudflare 拦截抛 `CFBlockedError`（152-154）；`loggedCheck` 不通过抛 `NeedLoginError`（157-159，基类恒为 true）；`status >= 400` 抛 `Network Error: <code> <statusText>`（162-164）。注意异常被 catch 后仍会取 `error.response` 继续走上述判定（147-150）。
- **`getSearchResult(keywords?, searchEntry = {})`（174-313）**：搜索总入口。负责 searchEntry 合并、关键词与高级搜索词解析、requestConfig 组装、调用 `request` 与 `transformSearchPage`，并把异常映射为 `EResultParseStatus.{CFBlocked, needLogin, noResults, parseError}`（304-310）。
- **`transformSearchPage(doc, searchConfig)`（502-558）**：把列表页/接口响应转成 `ITorrent[]`。`searchEntry.selectors.rows` 未定义时抛 `Error("列表选择器未定义")`（504-506）；DOM 结果可用 `rows.merge`（多行合并为一颗种子）或 `rows.filter`，JSON 结果只能用 `rows.filter`（512-541）；结果为空抛 `NoTorrentsError`（544-546）；逐行调用 `parseWholeTorrentFromRow`（548-555）。
- **`transformListPage(doc)`（651-710）**：content-script 在列表页调用。按 `metadata.list[*].urlPattern` 选中一条并覆盖 `search.selectors`（656-665，命中即 `break`），再推断当前关键词（668-697），最后委托给 `transformSearchPage`。
- **`transformDetailPage(doc)`（716-755）**：content-script 在详情页调用。用 `metadata.detail.selectors` 取值（721-722），并内置 url / id / title 的回落规则。
- **`getFieldData` / `getFieldsData`（347-444）**：选择器求值核心，解释 `IElementQuery` 的全部字段（见「常见坑」）。
- **`runQueryFilters(query, filters)`（446-460）**：执行 `filters`，既支持函数也支持 `{ name, args }`；只有 `filterNames`（`utils/filter.ts:207`）里存在的名字才生效，**拼错名字会被静默忽略**（451-456）。
- **`fixLink(uri, requestConfig)`（321-338）**：把 `//host/x`、`/x`、`x` 形式的相对链接按请求地址补全；`magnet:` 原样返回。
- **`parseTorrentRowForTags(torrent, row, searchConfig)`（615-637）**：仅当 `searchEntry.selectors.tags` 存在时才写入 `torrent.tags`（620）；对 DOM 用 `Sizzle(selector, row).length > 0` 判断，对 JSON 用 `get(row, selector)` 判断（623-631）。
- **`parseWholeTorrentFromRow(torrent, row, searchConfig)`（560-613）**：逐字段求值 + 通用补全（`site`、`id`、`fixLink`、体积/计数转数字、`timezoneOffset` 时间换算，590-608），最后交给 `fixParsedTorrent`（611）。
- **`fixParsedTorrent(torrent, row, searchConfig)`（639-645）**：默认直接返回入参，是留给子类的空挂钩。
- **`getTorrentDownloadLink(torrent)`（764-778）**：`torrent.link` 为空且配置了 `detail.selectors.link` 时，用 `detail.requestConfig` 垫片请求详情页并取值（765-770）；随后若用户配置了 `downloadLinkAppendix` 就拼到链接尾部（772-775）。
- **`getTorrentDownloadRequestConfig(torrent)`（784-790）**：先取下载链接，再与 `download.requestConfig` 合并出最终 axios 配置。
- **`userInfo` 相关：基类没有。** `allowQueryUserInfo`、`getUserInfoResult`、`guessUserLevelId` 都只存在于 `AbstractPrivateSite`（27-29、113-215、218-220）。调用方 `offscreen/utils/userInfo.ts:59-61` 用 `if (site.allowQueryUserInfo)` 判断，纯 `BittorrentSite` 实例上该属性为 `undefined`，因此 public 站**永远不会进入用户信息抓取**。

## siteMetadata 中由基类解释的字段

| 字段 | 谁在读它 | 说明 |
| --- | --- | --- |
| `type` | `index.ts:41-42`、`index.ts:97` | 基类自己**不读**，只用于决定缺省 `schema` 与实例类型兜底 |
| `schema` | `index.ts:94-98` | 同上；public 站一般省略 |
| `id` | 590、717、`storeRuntimeSettings` / `retrieveRuntimeSettings` 108-117 | 也被要求等于文件名（`index.ts:22-29` 用文件名做 key） |
| `name` | `get name()` 74-76 | `userConfig.merge?.name ?? metadata.name` |
| `urls` | `get url()` 78-80、`request` 121、`fixLink` 328 | 只取 **第一个**作为默认地址；`urls`/`legacyUrls` 会先经 rot13 还原（`index.ts:53-56`） |
| `legacyUrls` | `index.ts:54-56`；旧地址迁移提示见 `entries/options/stores/metadata.ts:405-407` | 基类解析流程不使用 |
| `favicon` | `utils/favicon.ts:200-252`（尤其 212 行优先使用定义值） | 不在基类里消费 |
| `category` | 基类**不消费**；由 `SetSearchSolution/utils.ts:35-80` 生成搜索入口请求配置 | 详见「搜索与列表页」 |
| `requestDelay` | 126（全站统一延迟） | definition 中写的是毫秒；与 `search.requestDelay`（287-289）**叠加** |
| `officialGroupPattern` | `offscreen/utils/search.ts:28-29` | 仅在用户开启 `autoDetectOfficialGroupFromTitle` 时用于自动打「官方」标签 |
| `search` | 174-313 全流程 | 关键词路径、请求垫片、选择器 |
| `searchEntry` | 191-198（按 `id` 合并后再与 `search` 合并） | 多搜索入口才需要 |
| `list` | 651-665 | content-script 判定列表页 + 覆盖选择器 |
| `detail` | 716-755（详情页解析）、765-770（补下载链接） | `urlPattern` 只能手写，不能推断（`types/site.ts:210-212`） |
| `download.requestConfig` | 784-790 | 与 `{ baseURL: this.url, url: 下载链接, method: "GET", timeout }` 合并 |
| `download.interval` | `get downloadInterval()` 90-92 | `userConfig.downloadInterval ?? metadata.download?.interval ?? 0`（单位：秒） |
| `noLoginAssert` | 基类**不消费**（`loggedCheck` 恒 true，98-100）；仅 `AbstractPrivateSite.ts:31-101` 使用 | public 站写它无效（且 `types/site.ts:260-266` 也声明"仅对 PrivateSite 模板生效"） |
| `userInfo` / `levelRequirements` | 基类**不消费** | public 站写了也不会被读取，除非自己导出 class 实现 `getUserInfoResult` |
| `userInputSettingMeta` | `offscreen/utils/site.ts:35-36` 生成用户输入项 | 基类不参与 |

## 最小可用定义骨架

```ts
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1, // 现有 15 个 public 定义全部写 1（不是 SchemaMetadata 里的 -1）
  id: "example", // 必须等于文件名 example.ts
  name: "Example",
  type: "public", // 不写 schema，隐式回落到 AbstractBittorrentSite
  urls: ["https://example.com/"], // 第一个是默认使用地址

  search: {
    keywordPath: "params.q", // 默认值就是 params.keywords（267）
    requestConfig: { url: "/search", responseType: "document" },
    selectors: {
      rows: { selector: "table.torrents > tbody > tr" }, // 必需，否则 "列表选择器未定义"
      id: { selector: "a[href*='/view/']", attr: "href" }, // 省略时由 url/link 推断（591）
      title: { selector: "a[href*='/view/']" },
      url: { selector: "a[href*='/view/']", attr: "href" }, // 详情页链接
      link: { selector: "a[href^='magnet:']", attr: "href" }, // 下载链接
      time: { selector: "td:nth-child(3)", filters: [{ name: "parseFuzzyTime" }] },
      size: { selector: "td:nth-child(4)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(5)" },
      leechers: { selector: "td:nth-child(6)" },
    },
  },
};
```

## 搜索与列表页

**requestConfig 垫片**（226-229）：先取 `{ url: "/", responseType: "document", params: {}, data: {} }`，再用 `searchEntry.requestConfig`（含从 `search` 合并来的部分）覆盖。`baseURL` 不在这里写，由 `request` 补成 `this.url`（121）。JSON 接口的站点在 `requestConfig.responseType` 里改成 `"json"`，并把 `selectors` 换成 JSON 路径（范例 `definitions/torrentscsv.ts:14-37`：`rows: { selector: "torrents" }`、`id: { selector: "id" }`，对 JSON 走 `get(row, selector)`，见 402）。

**关键词**（266-268）：`set(requestConfig, searchEntry.keywordPath || "params.keywords", keywords)`。`keywordPath` 按点号路径解释（`es-toolkit` 的 `set`，类型见 `types/search.ts:100`），如 `params.q`、`params.search`、`data.keywords`。

**高级搜索词**（231-263）：形如 `imdb|tt17097088`、`douban|35131346`。前缀先被剥掉（240），再查 `searchEntry.advanceKeywordParams[<前缀>]`：未声明时 `imdb` 视同 `{ enabled: true }` 并回落成普通关键词搜索，**其它前缀（douban/bangumi/anidb/tmdb/tvdb/mal 等）直接标记为不搜并返回**（244-257）。声明为 `false` 或 `{ enabled: false }` 同样跳过。命中后先合 `requestConfig`（272-274）、再套 `requestConfigTransformer`（276-279）。

**搜索入口合并**（188-205）：传入 `searchEntry.id` 时先与 `metadata.searchEntry[id]` 深合并（192）；随后只要 `searchEntry` 为空或没显式写 `merge: false`，就继续与 `metadata.search` 深合并（196-198）；`enabled === false` 的入口直接返回 `passParse`。`nyaa` 用它做"表站/里站"两个入口（`definitions/nyaa.ts:137-151`）。

**selectors 字段解析**：见「常见坑」中的 `IElementQuery` 语义。可用的种子键为 `ITorrent` 里除 `site`/`tags` 外的字段 + `rows`（`types/search.ts:115-141`）；`parseWholeTorrentFromRow` 遍历的是 `selectors` 的键与 `defaultTorrentSelectorKey`（44-61）的并集（575）。

**`list.urlPattern` 自动推断**：`metadata.list` 为空时，content-script 用 `uniq([search.requestConfig.url, ...searchEntry[*].requestConfig.url])` 作为列表页正则（`entries/content-script/app/utils.ts:44-52`）；一旦 `metadata.list` 非空，就**只**用其中各条 `urlPattern` 的并集（46）。`list[*].urlPattern` 缺省则为空数组、不匹配任何页面。匹配前会先用 `excludeUrlPattern` 排除（54-59）。`transformListPage` 侧则只认 `list`（656-665），与上面的推断互补。

**category 与 cross**：基类不读 `category`；它由 `SetSearchSolution/utils.ts:39-80` 生成请求配置——有 `generateRequestConfig` 就用它（49-50）；否则键为 `#url` 时直接写入 `requestConfig.url`（53-54），其余写进 `requestConfig.<keyPath ?? "params">.<key|cross.key>`（56-77），`cross.mode` 决定 `brackets`（数组）/`comma`（逗号串）/`append`（`key{v}: 1`）/`appendQuote`（`key[v]: 1`），`custom` 必须在 `generateRequestConfig` 里自己实现（`types/search.ts:222-241`）。`cross: false` 与不写等价（单选）。

**列表页专属字段**：`list[*].selectors` 可额外定义 `keywords`（`types/site.ts:199`），命中后用于回填搜索框；没写时 `transformListPage` 按 `keywordPath` 推断输入框选择器，再退化为从 URL 的 `params.<name>`、`search`、`keywords`、`keyword`、`q` 里解析（668-697）。

`list` 与 `rows` 的常见写法：

```ts
list: [
  {
    urlPattern: ["/search", "/top100"], // 命中即 break，注意与其它条目的重叠（659-665）
    mergeSearchSelectors: true, // 默认 true；接口型站点写 false 以摆脱 search.selectors
    selectors: { keywords: { selector: 'input[name="q"]', attr: "value" } },
  },
],

search: {
  selectors: {
    // 一个种子被相邻多个 tr 表示时，merge 会把它们包进一个 div（520-535）
    // 之后子选择器要写成 "tr:nth-child(1) xxx" 这种形式
    rows: { selector: "table > tbody > tr", merge: 2 },
  },
},
```

## 详情页与下载链接

`transformDetailPage(doc)`（716-755）的解析顺序：

1. 克隆文档，用 `metadata.detail.selectors` 逐字段取值并合并进 `{ site }`（718-722）。
2. `url` 缺失 → `doc.URL || location.href`（725-727）。
3. `id` 缺失 → 从 url 查询串的 `tid`、`id` 依次取；仍无则 `id = url`（730-744）。
4. `title` 缺失 → `html > body > title`（746-748）。
5. `link` 存在 → 以文档 URL 为基准 `fixLink`（750-752）。

`getTorrentDownloadLink(torrent)`（764-778）只在 **`torrent.link` 为空** 且配置了 `detail.selectors.link` 时才发请求：请求配置是 `toMerged({ responseType: "document", url: torrent.url }, metadata.detail?.requestConfig ?? {})`（766-768），即"以种子的详情页 url 为基础，用 `detail.requestConfig` 打补丁"。取到的值直接写入 `torrent.link`（769）。之后若 `userConfig.downloadLinkAppendix` 非空则追加到尾部（772-775）。`getTorrentDownloadRequestConfig` 再把它合成 `{ baseURL: this.url, url, method: "GET", timeout }` 并与 `download.requestConfig` 合并（784-790）。

因此"搜索页拿不到下载链接"的站点有两种写法：配置 `detail.selectors.link` + 可选 `detail.requestConfig`（如 `1337x.ts:255-262`），或在 class 里覆写 `getTorrentDownloadLink`（如 `nyaa.ts:176-186`）。

```ts
detail: {
  urlPattern: ["/torrent/\\d+"], // 无法自动推断，必须显式声明（types/site.ts:210-212）
  // 垫片为 { responseType: "document", url: torrent.url }（766-768）
  requestConfig: { responseType: "document" },
  selectors: {
    title: { selector: "h1.card-title" },
    link: { selector: ["a[href^='magnet:?xt=']", "a[href$='.torrent']"], attr: "href" },
  },
},

download: {
  // 与 { baseURL: this.url, url: 下载链接, method: "GET", timeout } 合并（786-789）
  requestConfig: { method: "POST" },
},
```

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 / 范例 |
| --- | --- | --- |
| `public async getTorrentDownloadLink(torrent: ITorrent): Promise<string>` | 下载链接需要二次跳转、需要拼接 id、或需要页面内 token 时。常见写法是 `const link = await super.getTorrentDownloadLink(torrent)` 后判断并补全 | 764-778；`definitions/nyaa.ts:177-185`、`definitions/nekobt.ts:210-218`、`definitions/ehentai.ts:42-45` |
| `public async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig>` | 下载需要 POST、额外 header 等 `download.requestConfig` 表达不了的配置 | 784-790；`definitions/gtnet.ts:216` |
| `public async transformSearchPage(doc, searchConfig): Promise<ITorrent[]>` | 列表页需要二次加工：从页面脚本取 token、按接口结构重组行。建议先 `await super.transformSearchPage(...)` 再加工 | 502-558；`definitions/exttorrents.ts:201-215`、`definitions/audiobookbay.ts:184` |
| `public async transformListPage(doc: Document)` | 列表页结构特殊，默认的"list 覆盖 selectors"不够用 | 651-710 |
| `public async transformDetailPage(doc: Document): Promise<ITorrent>` | 详情页需要额外字段或改写 id 推断 | 716-755；`definitions/exttorrents.ts:217-226` |
| `protected parseTorrentRowForTags(torrent, row, searchConfig)` | 需要按行内容动态打标签（JSON 接口站点尤其常见） | 615-637；`definitions/nekobt.ts:195-208` |
| `protected fixParsedTorrent(torrent, row, searchConfig)` | 解析收尾时统一修正字段 | 639-645 |
| `protected fixLink(uri, requestConfig): string` | 站点的相对链接规则异于 `new URL(uri, requestUrl)` | 321-338 |
| `protected getFieldData(element, elementQuery)` | 需要一种全新的取值方式（极少用） | 366-444 |
| `public async request<T>(axiosConfig, checkLogin = true)` | 需要统一注入 header / 处理特殊响应 | 119-167 |

覆写时保留签名并加 `override`（`pnpm check` 会校验）；`protected` 成员在 definition 的子类里同样可覆写，但要从 `protected` 提升为 `public` 时必须显式写 `public`。

## 范例定义

- `definitions/torrentscsv.ts` — 最简的"纯 metadata + JSON 接口"样例：`responseType: "json"`、JSON 路径选择器、用 filter 把 infohash 拼成 magnet，另附一条 `mergeSearchSelectors: false` 的 `list` 规则。
- `definitions/nyaa.ts` — 综合度最高：`category` 里用 `generateRequestConfig` 切表站/里站、`searchEntry` 两个入口、`detail.selectors.id` 用 `:self` + `elementProcess`、并覆写 `getTorrentDownloadLink` 补 `/download/{id}.torrent`。
- `definitions/1337x.ts` — 演示 `requestConfigTransformer` 把 `params` 重写成 REST 路径（关键词/分类/排序都进 URL 路径），以及 `detail.selectors.link` 双候选（magnet 与 itorrents）。
- `definitions/ehentai.ts` — 最短的覆写范例：`getTorrentDownloadLink` 里再发一次请求，从下载页取真实 `.torrent` 链接。
- `definitions/exttorrents.ts` — 需要页面内 token 的完整改造：同时覆写 `transformSearchPage`（注入 token）、`transformDetailPage`（解析 id 与 magnet）、`getTorrentDownloadLink`，并用 `detail.selectors.link: { text: "N/A" }` 占位。
- `definitions/nekobt.ts` — 覆写 `parseTorrentRowForTags` 处理非 DOM 行对象（`{ level: number }`）的样例。

## 常见坑

1. **`url` 与 `link` 的含义与 ptpp 相反**：`url` 是详情页链接、`link` 是下载链接（`types/torrent.ts:26-34`）。写反会导致详情页/下载全错，且不会有任何报错。
2. **`id` 会被自动推断，但推断源是 `url || link`**（591，`tryToNumber` 包裹）。若 `url` 是一整条长链接，`id` 就会退化成该链接字符串；`transformDetailPage` 里的推断规则不同（优先 `tid`/`id` 查询参数，最后才是 url，730-744）。需要稳定数字 id 就显式写 `selectors.id`。
3. **选择器数组是"首个命中即停"**：数组内逐个尝试，只有 `typeof query !== "undefined"` 才跳出（372-411）。空字符串（`textContent` 为空）经 `|| query` 处理后仍是 `undefined`，会继续试下一个选择器，这是 `nyaa.ts:105-127`、`1337x.ts:259` 能写多候选的前提。
4. **`:self` 是特殊选择器**：DOM 场景表示元素自身（用于 `tr` 自身的属性），JSON 场景表示根对象（380、402）。`nyaa.ts:163-170` 用 `:self` + `elementProcess` 从 `Document.URL` 里正则取 id。
5. **取值有隐式回落与类型转换**（429-441）：最终 `query ??= elementQuery.text ?? ""`；字符串会 `trim()`，且只有形如 `^-?\d+$` 的整串数字才转成 `int`——`"1,234"`、`"1.2 GB"` 都不会自动变数字，必须配 `filters`（如 `parseNumber`、`parseSize`）。
6. **`elementProcess > case > data > attr > innerText`** 是有优先级的互斥链（383-399，注释见 `types/search.ts:265-281`）；写了 `elementProcess` 就不要再依赖 `filters`（`types/search.ts:273`）。
7. **`filters` 名字拼错会被静默忽略**（451-456 只对 `filterNames` 中的名字生效）；`switchFilters` 的键是"最终命中的那条 selector 字符串"，不是数组下标（421-422）。
8. **`rows.merge` 只在 DOM 返回时生效**（515-541），JSON 返回只能靠 `rows.filter`；`filter` 存在时 `merge` 被完全忽略（515-517）。
9. **`list` 只命中第一条即 `break`**（659-665）：规则顺序与 `urlPattern` 重叠会互相遮挡；`mergeSearchSelectors: false`（对接口型站点常用，如 `torrentscsv.ts:42`）会让该条的 `selectors` 独立，不再继承 `search.selectors`。
10. **`detail.selectors.link` 只在 `torrent.link` 为空时被使用**（765）：如果搜索页已经解析出了 `link`（哪怕是个中间页链接），基类不会再去详情页取真正链接——这种情况必须覆写 `getTorrentDownloadLink`。
11. **`downloadLinkAppendix` 会被重复追加**：它直接改写 `torrent.link`（772-775），而 `getTorrentDownloadRequestConfig` 内部又调用一次 `getTorrentDownloadLink`（785）。调用方 `offscreen/utils/download.ts:118-121` 正是先调 `getTorrentDownloadLink(torrent)` 再调 `getTorrentDownloadRequestConfig(torrent)`（同一对象），`userConfig.downloadLinkAppendix` 非空时会被拼两次。改这块逻辑时需注意。
12. **`types/site.ts:246-248` 的注释（`toMerged({ url: torrent.link, method: 'get' }, ...)`）与实现不一致**：实际实现是 `getTorrentDownloadRequestConfig`（784-790），先经 `getTorrentDownloadLink` 补链接，且垫片含 `baseURL: this.url` 与 `timeout`。以源码为准。
13. **public 站写 `userInfo` / `levelRequirements` / `noLoginAssert` 不生效**：基类既没有 `getUserInfoResult`（只在 `AbstractPrivateSite.ts:113` 与各 schema 中），`loggedCheck` 也恒为 `true`（98-100）。现有 15 个 public 定义没有一个写这三项。
14. **`metadata.requestDelay` 与 `search.requestDelay` 会叠加**（126 与 287-289），两个都设时要按总和评估限速。
15. **`urls[0]` 是默认地址**（78-80），更换域名必须新地址放前面、旧地址进 `legacyUrls`（`types/site.ts:88-96`）；两者都会在加载时做 rot13 还原（`index.ts:53-56`），所以敏感站点可以直接写 `uggcf://` 形式。
16. **`SchemaMetadata` 不会被自动合并**（`index.ts:100-101` 只用 `default` 类），definition 里写的 `search` 是**整体对象**，不做与 schema 默认值的深合并——写 `search.selectors` 时要么写全，要么自己手动展开。
