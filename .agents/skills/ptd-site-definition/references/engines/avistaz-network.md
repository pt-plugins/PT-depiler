# AvistazNetwork 站点定义规范

AvistaZ Network（AvistaZ / CinemaZ / PrivateHD / ExoticaZ / AnimeZ 等）是同一套私有 tracker 软件的多站点网络：搜索统一走站点自带的 Jackett API（JSON + Bearer token），网页部分（列表页、下载历史页、资料页）结构也高度一致。引擎实现在 `src/packages/site/schemas/AvistazNetwork.ts`（**实际 838 行**），默认类继承 `AbstractPrivateSite`（`:517`）。因此定义文件的工作量很小：展开 `...SchemaMetadata` 覆写站点差异，需要站点专属标签时再导出一个 `extends AvistazNetwork` 的 `default class`（现有 5 个定义全部导出了 default class）。

下文行号若未特别说明，均指 `schemas/AvistazNetwork.ts`。

## 判定站点是否属于该引擎

正向特征（有其一即可进一步验证）：

- 站点自述属于 AvistaZ Network（`definitions/exoticaz.ts:38`、`definitions/privatehd.ts:37`），或由 avistaz.to 家族运营。
- 搜索走 `/api/v1/jackett/torrents`（JSON），鉴权走 `/api/v1/jackett/auth`（POST 提交 `username`/`password`/`pid`）（`:683-697`、`:316-320`）。
- 种子详情页 URL 为 `/torrent/{id}`，下载链接含 `/download/torrent/`（`:246-263`）。
- 资料页 `/profile/{name}`，另有 `/profile/{name}/active`（做种列表）与 `/profile/{name}/bonus`（时魔）（`:601`、`:637`、`:667`）。
- Bootstrap + FontAwesome 类名体系：`.ratio-bar`、`span.badge-extra.fa-database` / `fa-arrow-up` / `fa-arrow-down` / `fa-check`、分类图标 `i[data-original-title]`（`:96-102`、`:296-300`、`:410-423`）。
- 账号配置需要三项：用户名、密码、PID（`:493-514`）。

易混淆情况：

- **Gazelle 系**：同为英文影视站，但路径是 `torrents.php?id=`，没有 Jackett API。
- **Unit3D 系**：类名是 `torrent-search--list__*` / `ratio-bar__*`，且下载链接为 `/torrents/download/{id}`。
- **AnimeZ**：资料页已换成 datagrid 模板（用 `.datagrid-item`/`.datagrid-title`/`.datagrid-content` 取值，`definitions/animez.ts:23-32`），列表页字段名也不同，但仍在网络内——不要因为页面模板不同就改判引擎，改的是 `search.selectors` 与 userInfo 选择器。
- **同网络内各站的编号表不通用**：AvistaZ 的 res 是 `1:SD/2:720p/3:1080p/6:2160p`（`definitions/avistaz.ts:11-18`），ExoticaZ 是 `1:240p…9:VR 360°`（`definitions/exoticaz.ts:19-29`），PrivateHD 又是另一套（`definitions/privatehd.ts:10-16`）。分类编号必须逐站核对。

## SchemaMetadata 默认值

`schemas/AvistazNetwork.ts:304-515` 导出的 `SchemaMetadata`（类型为 `Pick<ISiteMetadata, "version" | "schema" | "type" | "timezoneOffset" | "search" | "userInfo" | "userInputSettingMeta" | "list" | "detail">`）：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 308 | 现状 5 个定义都显式写 `1`（animez 为 `3`） |
| `schema` | `"AvistazNetwork"` | 309 | 不用改 |
| `type` | `"private"` | 310 | 不用改 |
| `timezoneOffset` | `"-0400"` | 312 | 需要：5 个定义全部覆写为 `"+0100"` |
| `search.keywordPath` | `"params.search"` | 315 | 不用改 |
| `search.requestConfig` | `url: "/api/v1/jackett/torrents"`、`responseType: "json"`、`params: { in: 1, limit: 50 }` | 316-320 | 一般不改；只改 `limit` 时要展开 `params`（见常见坑 3） |
| `search.advanceKeywordParams` | `imdb` / `tvdb` / `tmdb` 三项，均把 `params.search` 改名为 `params.{imdb,tvdb,tmdb}` | 321-349 | 站点不支持时显式关掉（`definitions/animez.ts:96-100`、`definitions/exoticaz.ts:101-105`） |
| `search.selectors` | 17 个键（含 `rows`；JSON 取值路径），见「搜索配置要点」 | 350-380 | 站点 API 字段名不同时覆写（animez 改 `title`/`category`） |
| `list` | `[listTorrentPageMetadata, listHistoryPageMetadata]`：`/torrents` 与 `/profile/(.+)/history`，两者均 `mergeSearchSelectors: false` | 241-271、274-302、383 | 页面 DOM 变了才改（exoticaz 整段重写） |
| `detail.urlPattern` | `["/torrent/"]` | 386 | 不用改 |
| `detail.selectors` | `id`（`:self` + 正则）、`title`、`link` | 387-398 | 少数站改 `title`（exoticaz） |
| `userInfo.pickLast` | `["name"]` | 402 | 一般不改 |
| `userInfo.selectors` | 14 个字段，见「用户信息」 | 403-490 | 资料页模板不同的站要改（animez 覆写 10 个） |
| `userInfo.process` | **未提供** | — | 定义 `process` 会整体改走 `AbstractPrivateSite` 流程（`:544-547`） |
| `userInfo.requestDelay` | **未提供** | — | 站点限速时补；它是 `sleepAction` 的依据（`:599`、`:616`、`:634`） |
| `userInfo.donorConfig` | **未提供**，本引擎也不消费 | — | 写了无效（见常见坑 9） |
| `noLoginAssert` | **未提供** | — | 一般不需要；默认值来自 `AbstractPrivateSite.ts:31-48` |
| `category` | **未提供** | — | 需要：不写就没有分类筛选 |
| `levelRequirements` | **未提供** | — | 需要：不写则不会有 `levelId`（`:586-588`） |
| `userInputSettingMeta` | username / password / pid，三项均 `required: true` | 493-514 | 现状都写 `[...SchemaMetadata.userInputSettingMeta!]` 显式展开 |
| `searchEntry` | **未提供** | — | 只有 exoticaz 使用（见「搜索配置要点」） |

另**未提供**：`search.requestDelay`、`detail.requestConfig`、`download`、`officialGroupPattern`。

### 为网络中的新站点写定义时要改哪些字段

1. **站点身份**：`id`（= 文件名）、`name`、`aka`、`description`、`tags`、`urls`（敏感站点写 rot13）、`version: 1`。
2. **`timezoneOffset`**：默认是 `-0400`，网络内现有定义都按目标站写成 `"+0100"`。
3. **`category`**：至少给「分类」与「促销」两组；`key` 必须用站点 API 真实参数名，编号表逐站核对。促销组直接复用导出的 `avzNetDiscountMap`（`:195-199`）。
4. **`levelRequirements`**：等级名各站不同（AvistaZ/PrivateHD/ExoticaZ 用同一套 `Leech/Newbie/Member/V.I.P./…`，AnimeZ 另有 `Power User`、`Staff` 等）。等级 `name` 必须与页面显示文本一致（`types/userinfo.ts:73-77`）。
5. **`userInputSettingMeta`**：写 `[...SchemaMetadata.userInputSettingMeta!]` 即可，三项默认值已够用。
6. **API 字段名不同时**：覆写 `search.selectors`（AnimeZ 把 `title` 改成 `release_title`、`category` 改成 `format`，`definitions/animez.ts:101-106`），并关掉不支持的高级搜索词。
7. **资料页模板不同时**：覆写 `userInfo.selectors`，并在 default class 里覆写 `getBaseInfoFromSite` / `getExtendInfoFromProfile`（`definitions/animez.ts:242-274`）。
8. **列表页 DOM 不同时**：整段覆写 `list` 的两条规则，并保持 `mergeSearchSelectors: false`（`definitions/exoticaz.ts:112-181`）。
9. **站点专属标签**：default class 覆写 `parseTorrentRowForTags`（`definitions/avistaz.ts:140-168`）。

## 最小可用定义骨架

```ts
import { type ISiteMetadata } from "../types";
import AvistazNetwork, { SchemaMetadata, avzNetDiscountMap } from "../schemas/AvistazNetwork.ts";

const categoryMap: Record<number, string> = { 0: "All", 1: "Movies", 2: "TV" };
const opts = (map: Record<number, string>) => Object.entries(map).map(([value, name]) => ({ name, value: +value }));
const cross = { mode: "appendQuote" } as const; // 多选：生成 params.category = { "1": 1 }

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "example", // 必须与文件名 example.ts 一致
  name: "Example",
  tags: ["电影"],
  timezoneOffset: "+0100",
  type: "private",
  schema: "AvistazNetwork",
  urls: ["uggcf://rknzcyr.gb/"], // rot13，加载时会还原
  category: [
    { name: "分类", key: "category", keyPath: "params", options: opts(categoryMap), cross },
    { name: "促销", key: "discount", keyPath: "params", options: opts(avzNetDiscountMap), cross },
  ],
  levelRequirements: [{ id: 1, name: "Leech" }, { id: 2, name: "Member" }],
  userInputSettingMeta: [...SchemaMetadata.userInputSettingMeta!],
};
```

## 搜索配置要点

- **默认请求**：`GET /api/v1/jackett/torrents`，`responseType: "json"`，固定参数 `in: 1`、`limit: 50`（最大 50 条结果，源码注释 `:319`）；关键词写入 `params.search`（`:315`）。
- **鉴权由 `request()` 自动接管**：URL 严格等于 `/api/v1/jackett/auth` 时改成 POST 并注入 `username`/`password`/`pid`；URL 以 `/api/v1/jackett/torrents` 开头时改成 GET 并加 `Authorization: Bearer <token>`（`:683-706`）。token 存在 `runtimeSettings` 的 `authToken`/`authExpiry` 里复用（`:763-813`）。**这两条判断都与 URL 字符串强耦合**：把 `search.requestConfig.url` 改到别的路径，鉴权头就不会再注入。
- **高级搜索词**：默认可直接用 `imdb|tt…`、`tvdb|…`、`tmdb|…`，三者的 `requestConfigTransformer` 只是把 `params.search` 改名（`:321-349`）。站点不支持时要显式写 `{ enabled: false }` 或 `false`。
- **默认覆盖的种子字段**（JSON 路径）：`rows: data`、`id: id`、`title: file_name`、`subTitle: {text: ""}`、`url: url`、`link: download`、`category`（取 `category` 对象 `Object.values()[0]`）、`time: created_at`（`parseTime`）、`size: file_size`、`author: {text: ""}`、`seeders: seed`、`leechers: leech`、`completed: completed`、`comments: {text: "N/A"}`、`progress: {text: 0}`、`status: {text: unknown}`、`ext_imdb: movie_tv.imdb`（`extImdbId`）（`:350-380`）。
- **覆写 `search.selectors` 时**：必须展开 `...SchemaMetadata.search!.selectors!`，否则会丢掉其余字段（`definitions/animez.ts:101-106`）。
- **category 与 cross**：`keyPath: "params"` + `cross: { mode: "appendQuote" }` 会生成 `requestConfig.params.category = { "1": 1 }`（`SetSearchSolution/utils.ts:66-68`），由 axios 序列化后交给 Jackett API。单值开关不写 `cross`（`definitions/avistaz.ts:73-84` 的「特殊」组）。ExoticaZ 的「类型」组用 `cross: { mode: "append", key: "" }` 生成 `params.{value}=1`（`definitions/exoticaz.ts:91-96`）。
- **`list`**：两条默认规则都用于 content-script 的网页解析，均显式 `mergeSearchSelectors: false`（`:243`、`:276`），因为搜索走 JSON API、DOM 选择器不能当垫片——自定义 `list` 时必须照做。
- **`searchEntry`**：SchemaMetadata 不定义；回落规则见 `entries/options/stores/metadata.ts:192`（默认 `{ default: {} }`）。网络内只有 ExoticaZ 声明了一个默认关闭的入口 `area_adult`（`definitions/exoticaz.ts:108-110`），同时声明了名为「搜索入口」的分类项（key `entry`，`generateRequestConfig` 返回空 params，`definitions/exoticaz.ts:50-60`）。
- **`detail`**：默认只解析 `title`、`link`，`id` 的 `elementProcess` 用 `:self` 的 URL 匹配 `/detail/(\d+)/`（`:390-394`）——与 `detail.urlPattern` 的 `/torrent/` 并不匹配，实际通常返回整条 URL；站点若有更可靠的 id 来源，直接在定义里覆写。

## 用户信息（userInfo）

- **默认不抓取用户数据**。`enableAvistazUserInfoFetching` 只在构建期 `VITE_ENABLE_AVISTAZ_USER_INFO_FETCHING === "true"` 时为真（`:22`；类型声明 `src/vite-env.d.ts:4`）。关闭时 `getUserInfoResult` 直接返回 `status: passParse`，只有 `name`（取自 `userConfig.inputSetting.username`）与 `levelName: "应站点要求，不启用用户数据获取"`（`:530-537`）。这是站点方的要求（源码注释 `:518-522`），**不要在定义里绕过**。
- **启用后的流程**（`:523-594`）：`allowQueryUserInfo` 为假 → `passParse`（`:539-542`）；`userInfo.process` 是数组 → 交给 `AbstractPrivateSite.getUserInfoResult`（`:544-547`）；否则依次 `getBaseInfoFromSite(userName)` → `getExtendInfoFromProfile(userName)`，只要前面拿到过资料页字段，再执行 `getUserSeedingTorrents` 与 `getUserBonusPerHour`（每步都用 `mergeUserInfo` 包裹，单步失败不影响整体，`:184-193`）。
- **fields 三批**：`name/levelName/uploaded/downloaded/ratio/bonus`（`:605-612`）→ `joinTime/lastAccessAt/uploads/snatches/seeding/leeching/hnrUnsatisfied`（`:622-630`）→ `seedingSize`（`:633-660`）、`bonusPerHour`（`:662-677`）。
- **selectors 默认覆盖 14 个字段**：`name`（资料表 "Username" 或 `.ratio-bar` 徽章）、`levelName`（"Rank"）、`uploaded`/`downloaded`/`ratio`/`bonus`（资料表或 `.ratio-bar` 值）、`bonusPerHour`（积分页表格/标题里的 `points per hour`）、`joinTime`（"Joined"，`dd MMM yyyy hh:mm a`）、`lastAccessAt`（"Last Access"）、`uploads`（"Uploads"）、`snatches`（"Downloads"）、`seeding`（"Seeds"/"Seeding"）、`leeching`（"Leeching"/"Peers"）、`hnrUnsatisfied`（"Hit & Run"）（`:403-490`）。**未覆盖**：`id`、`messageCount`、`invites`、`isDonor`、`posts`、`trueRatio`、`seedingTime`。
- **`pickLast` 默认 `["name"]`**（`:402`）：命中缓存时不再重复解析用户名。覆写 `userInfo` 时必须展开 `...SchemaMetadata.userInfo!`，否则会连带丢掉 `pickLast`（animez 显式重写了 `pickLast`，`definitions/animez.ts:110-112`）。
- **`noLoginAssert` 未提供**，且两个 Jackett API 请求**不经过 `super.request`**（`:708-710`），因此 `loggedCheck` 系列断言不适用于搜索接口（源码注释 `:735`）。
- **`donorConfig` 无效**：本引擎不读取它，`getUserBonusPerHour` 直接采用页面值（`:662-677`）。仓库中只有 `NexusPHP.ts:868-871` 会应用 `bonusPerHourMultiplier`。
- **`levelRequirements` 与 `levelId`**：仅当 `levelRequirements` 与 `levelName` 同时存在、且 `levelId` 缺失时才调用 `guessUserLevelId`（`:586-588`、`AbstractPrivateSite.ts:218-220`）。因此不写 `levelRequirements` 的站点（如 `definitions/cinemaz.ts`）不会得到 `levelId`。

## 常被覆写的类方法

| 方法 | 何时覆写 | 行号 / 范例 |
| --- | --- | --- |
| `public override async getUserInfoResult(lastUserInfo = {})` | 需要改整套抓取流程或状态判定；5 个现有定义都没覆写 | 523-594 |
| `protected async getBaseInfoFromSite(userName)` | 基础资料页不是 `/profile/{name}`，或字段分组不同 | 596-613；`definitions/animez.ts:242-262` |
| `protected async getExtendInfoFromProfile(userName)` | 同上，抓 `joinTime`/`lastAccessAt` 等第二批字段 | 615-631；`definitions/animez.ts:264-274` |
| `protected async getUserSeedingTorrents(userName)` | 需改做种量统计口径（默认翻 `/profile/{name}/active`，最多 100 页，`getActivePageCount` 上限 100） | 633-660 |
| `protected async getUserBonusPerHour(userName)` | 时魔页面不是 `/profile/{name}/bonus` | 662-677 |
| `public override async request<T>(axiosConfig, checkLogin = true)` | 需改 API 鉴权/重试；注意只对两个 Jackett 路径生效，其余仍走 `super.request` | 679-760 |
| `public async getAuthToken(lastUserInfo = {})` | token 的缓存键或过期策略变化 | 763-813 |
| `protected override parseTorrentRowForTags(torrent, row, searchConfig)` | 需要增加折扣外的站点标签；默认实现是**覆盖** `tags`（`:835`），子类必须先 `super` 再 push | 815-837；`definitions/avistaz.ts:140-168` |

覆写时保持签名一致并加 `override` 关键字（`pnpm check` 会校验）。可用类型：`IAvzNetRawTorrent`（`:201-238`）。

## 范例定义

- `definitions/avistaz.ts` — 网络内最完整的模板：分类/分辨率/剧集包/促销/特殊五组 `category`、完整 `levelRequirements`、default class 追加「完结/中配/中字」。
- `definitions/animez.ts` — API 字段名不同的站：覆写 `search.selectors.title`/`category`、关掉三个高级搜索词、按 datagrid 资料页覆写 `userInfo.selectors` 与两个 `get*Info*` 方法、在 `parseTorrentRowForTags` 里改 `title`/`category`。
- `definitions/exoticaz.ts` — 列表页 DOM 与 AvistaZ 不同：整段覆写两条 `list`、覆写 `detail.selectors.title`，并用 `searchEntry` 声明默认关闭的成人入口。
- `definitions/privatehd.ts` — 与 AvistaZ 同构但编号表不同、带 `favicon` 与 `collaborator` 的标准写法。
- `definitions/cinemaz.ts` — 最小形态：只写 metadata + 一个追加标签的 default class，没有 `levelRequirements`（因此没有 `levelId`）。

## 常见坑

1. **默认构建下 userInfo 选择器完全不生效**：`VITE_ENABLE_AVISTAZ_USER_INFO_FETCHING` 未开启时 `getUserInfoResult` 在 `:530-537` 就返回了，网络上任何一处 `userInfo.selectors` 覆写都不会被执行。用户报「个人信息只有用户名」属于预期行为。
2. **定义 `userInfo.process` 会切换实现**：`:544-547` 判定到数组就走 `AbstractPrivateSite` 的多步流程，与网络默认流程完全不同；两条路径的字段来源不一致。
3. **只改 `limit` 会丢掉 `in: 1`**：animez 写的是 `params: { limit: 50 }`（`definitions/animez.ts:92-95`），在 `...requestConfig` 之后整段替换了 `params`。要保留默认参数必须显式写 `params: { ...SchemaMetadata.search!.requestConfig!.params, limit: 50 }`。
4. **改 `search.requestConfig.url` 会破坏鉴权**：`request()` 用字符串比较/前缀匹配判定 API（`:683-684`），换路径后既不注入 Bearer token，也不会把 401/403 走 token 刷新重试（`:736-749`）。
5. **Jackett API 的 400/404/422 被当作「无结果」**：`:751-754` 把它们转成 `NoTorrentsError`，排查「搜不到」时不要只看 HTTP 状态码。
6. **列表页 id 只取一位数字**：`definitions` 中 `/\/torrent\/(\d)/`（`:253`）只捕获 1 位，而历史页用 `\d+`（`:286`）。种子 id 超过一位时列表页会解析出错误 id（疑似历史遗留 bug，照抄时请改成 `\d+`）。
7. **`detail.selectors.id` 与 `urlPattern` 不一致**：`elementProcess` 匹配 `/detail/(\d+)/`（`:390-394`），但 `detail.urlPattern` 是 `/torrent/`（`:386`），通常匹配失败并回落到整条 URL。
8. **`parseTorrentRowForTags` 覆盖而非追加**：默认实现直接 `torrent.tags = tags`（`:835`），子类必须先取 `super` 的结果再 push（`definitions/avistaz.ts:146-147`）。
9. **`donorConfig` 在本引擎无效果**：只有 `NexusPHP.ts:868-871` 消费 `bonusPerHourMultiplier`。
10. **`SchemaMetadata.userInfo` 是浅合并**（同其它引擎）：`userInfo: { selectors: {...} }` 会丢掉 `pickLast`；正确写法是 `...SchemaMetadata.userInfo!` 后再展开 `selectors`。
11. **分类对象取值只取第一个**：JSON 里 `category` 是 `{[key]: string}`（`:209-211`），默认选择器取 `Object.values()[0]`（`:357-366`）；AnimeZ 直接换成 `format` 字段（`definitions/animez.ts:104`）。
12. **`userInputSettingMeta` 的 hint 文本拼接缺空格**（`:497`、`:503`、`:509-510`），是既有瑕疵，新增定义时别照抄这个拼接方式。
