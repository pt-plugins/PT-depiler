# Rartracker 站点定义规范

Rartracker（`https://github.com/swetorrentking/rartracker`）是一套小型开源 BT/PT 站程序，前端为 AngularJS SPA，页面数据通过 `/api/v1/` 下的 JSON 接口异步加载（`schemas/Rartracker.ts:1-5`）。本仓库由 `src/packages/site/schemas/Rartracker.ts` 承载它：该 schema 已给出搜索、用户信息的 JSON 选择器，并导出一个 `SchemaMetadata`。

因此**Rartracker 站点只需在 `definitions/<id>.ts` 中展开 `...SchemaMetadata` 再覆写差异项**；种子下载链接由 schema 的类方法用 passkey 现拼（`schemas/Rartracker.ts:102-106`），definition 一般不必再处理。只有分叉站的字段名/接口路径不同，或需要给站点打标签、补 content-script 的列表页/详情页时才需要写额外配置。

下文行号若未特别说明，均指 `src/packages/site/schemas/Rartracker.ts`（该文件实际 107 行）。

## 判定站点是否属于该引擎

正向特征（有其一即可进一步验证）：

- 存在 JSON 接口 `/api/v1/status`（`schemas/Rartracker.ts:12`）与 `/api/v1/torrents`（23-24）；打开浏览器控制台可在网络面板看到这两个请求。
- 页面是 AngularJS 风格的自定义元素，如 `torrents-table[torrents]`、`torrent[viewing-torrent]`（`definitions/digitalcore.ts:8`、`definitions/digitalcore.ts:180`）。
- 种子详情页形如 `/torrent/{id}/`（`schemas/Rartracker.ts:41`），用户页形如 `/api/v1/users/{id}`（72-73）。
- 上游程序的 README/页脚写着 rartracker；已知基于它的站只有 DigitalCore 与 Superbits（仓库内 `schema: "Rartracker"` 的定义仅这两个）。

易混淆情况：

- **TCG**：同为「PHP 自研小站」，但 TCG 是 `browse.php` + HTML 表格（`schemas/TCG.ts:10`、`schemas/TCG.ts:25`），没有 `/api/v1/` 接口。
- **Unit3D / NexusPHP 的 JSON 变体**：也可能返回 JSON，但路径是 `/api/torrents/filter` 或 `torrents.php`，且不存在 `/api/v1/status`。
- **分叉站的字段名会变**：`completed` 在 DigitalCore 是 `times_completed`（`definitions/digitalcore.ts:135`），在 Superbits 是 `timesCompleted`（`definitions/superbits.ts:77`）；`section`、`limit` 等查询参数也可能被改。**不要照抄另一个 Rartracker 站的选择器**。
- 部分分叉站把 `/api/v1/torrents` 的响应包了一层（顶层不是数组）。此时 `rows: { selector: ":self" }` 会选到对象而不是行数组，必须换成具体字段路径，做法参考 `definitions/milkie.ts:50`（`rows: { selector: "torrents" }`）这类 JSON 站点。

## SchemaMetadata 默认值

`schemas/Rartracker.ts:16-88` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`；另导出 `statusRequestConfig`（11-14），供类方法与 definition 复用。

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 17 | 现状都显式写 `1`（`definitions/digitalcore.ts:91`、`definitions/superbits.ts:26`） |
| `schema` | `"Rartracker"` | 18 | 展开 `...SchemaMetadata` 已带上；现有定义仍在 `type` 旁重复写一遍（`definitions/digitalcore.ts:99`） |
| `type` | `"private"` | 19 | 不需要 |
| `search.keywordPath` | `"params.searchText"` | 22 | 分叉站改了参数名时才改 |
| `search.requestConfig` | `url: "/api/v1/torrents"`、`responseType: "json"`、`params: { limit: 100, index: 0, section: "all", extendedSearch: false, watchview: false }` | 23-33 | 需要：补站点特有参数（排序、`dead`、`page` 等） |
| `search.advanceKeywordParams.imdb` | `{ enabled: true }`（只去除 `imdb\|` 前缀，不改写请求） | 34-36 | 一般不需要；要提取 imdb id 时自行加 `ext_imdb` selector |
| `search.selectors.rows` | `{ selector: ":self" }` | 38 | 响应包了一层时才改 |
| `search.selectors.id/title/url` | `id` / `name` / `id` + filter 拼 `/torrent/{id}/` | 39-41 | 分叉站字段名不同时改 |
| `search.selectors.time/size/seeders/leechers/comments/category` | `added` / `size` / `seeders` / `leechers` / `comments` / `category` | 42-47 | `completed`、`subTitle`、`tags`、`ext_imdb` 等要自己补 |
| `userInfo.pickLast` | `["id", "joinTime"]` | 52 | 需要：常补 `name`（`definitions/digitalcore.ts:187`） |
| `userInfo.process[0]` | `statusRequestConfig` + `id/name/uploaded/downloaded/messageCount/bonus/seedingSize` | 54-69 | 需要：追加 `uploads`、`seeding`、`levelId/levelName` 等 |
| `userInfo.process[1]` | `url: "/api/v1/users/$id$"`、`assertion: { id: "url" }` + `joinTime/lastAccessAt/uploaded/downloaded/trueDownloaded/bonus` | 70-85 | 需要：追加站点等级、真实上传量等 |
| `userInfo.requestDelay`、`userInfo.selectors`、`userInfo.donorConfig` | **未提供** | — | 需要限速时补（`types/site.ts:355-358`） |
| `category`、`levelRequirements`、`list`、`detail`、`searchEntry`、`noLoginAssert`、`userInputSettingMeta` | **未提供** | — | 前四项按站点补（见下）；后两项一般不需要 |

## 最小可用定义骨架

```ts
import type { ISiteMetadata } from "../types";
import Rartracker, { SchemaMetadata } from "../schemas/Rartracker";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "example", // 必须与文件名 example.ts 一致
  name: "Example",
  tags: ["综合"],
  timezoneOffset: "+0200", // 缺省为 "+0000"（index.ts:60），按站点实际时区补

  type: "private",
  schema: "Rartracker",

  urls: ["https://example.org/"],

  category: [
    {
      name: "类别",
      key: "categories", // 站点接口接收的分类参数名
      options: [{ name: "Movies", value: 1 }], // 必须来自站点真实分类
      cross: { mode: "brackets" }, // 多选形式按接口实测
    },
  ],

  levelRequirements: [{ id: 1, name: "User", privilege: "..." }],
};

export default class Example extends Rartracker {}
```

`default class` 只有在该分叉站覆写了引擎行为时才需要；不写也能正常工作（`index.ts:93-102` 会用 `schema` 指向的 `Rartracker` 类）。

## 搜索配置要点

- **请求基础**：URL 由 schema 给定为 `/api/v1/torrents`，`responseType: "json"`（23-25）；未声明 `method`，因此走 axios 默认的 GET。搜索的通用垫片是 `{ url: "/", responseType: "document", params: {}, data: {} }`（`schemas/AbstractBittorrentSite.ts:226-229`），schema 在此之上覆盖。
- **关键词位置**：`keywordPath: "params.searchText"`（22）；`getSearchResult` 用 `set(requestConfig, searchEntry.keywordPath || "params.keywords", keywords)` 注入（`schemas/AbstractBittorrentSite.ts:266-268`）。覆写 `keywordPath` 时只改路径字符串即可。
- **高级搜索词**：`advanceKeywordParams: { imdb: { enabled: true } }`（34-36）只表示「`imdb|tt123` 不跳过」，前缀被去掉后仍按普通文本搜索（`schemas/AbstractBittorrentSite.ts:238-262`）。要真正拿到 imdb id，需自行加 `ext_imdb` selector（`definitions/digitalcore.ts:148`）。
- **selectors 覆盖的种子字段**：`id, title, url, time, size, seeders, leechers, comments, category`（38-48）。**没有 `link`**：下载链接由类方法的 `parseTorrentRowForLink` 用 passkey 拼（102-106）。`completed`/`subTitle`/`tags`/`ext_imdb` 都由 definition 自行追加。
- **JSON 行选择器**：`rows: { selector: ":self" }` 在非 Document 响应下代表响应根（`schemas/AbstractBittorrentSite.ts:479-485`、512）；如果接口把数组包在 `{ torrents: [...] }` 之类的外层里，`:self` 会选到对象，必须把 selector 改成具体字段路径。
- **覆写 requestConfig 要保留默认 params**：只写自己的参数会把 `limit/index/section/...` 丢掉，标准写法是逐层展开——`definitions/digitalcore.ts:122-131`、`definitions/superbits.ts:59-73`。
- **category 分类**：种子的 `category` 取到的是站点数字分类 id（47），definition 用 `filters` 映射成名字（`definitions/digitalcore.ts:136-139`）；搜索用的分类配置写在 metadata 顶层的 `category`，写法见 `types/search.ts:202-248`。两个范例都用了字典 + `buildCategoryOptionsFromDict`（`utils/helper.ts:36`），但多选形式不同：DigitalCore 用 `cross: { mode: "brackets" }`（`definitions/digitalcore.ts:103-118`），Superbits 用 `cross: { mode: "append" }`（`definitions/superbits.ts:40-55`）——**按接口实测结果选，不要照抄**。
- **`list` / `detail` / `searchEntry`**：schema 均未提供。由于搜索走 JSON 接口，浏览器里直接打开列表页时插件无法复用同一套选择器，需要 content-script 适配的站（如 DigitalCore 的 HTML 列表页）要自己补 `list[]` 与 `detail`（`definitions/digitalcore.ts:152-184`），并把 `mergeSearchSelectors` 设为 `false`。
- **请求延迟**：schema 未设置 `search.requestDelay`；站点级 `requestDelay`（`types/site.ts:119-124`）在 `request()` 内生效（`schemas/AbstractBittorrentSite.ts:126`）。

## 用户信息（userInfo）

两个步骤，全部走 `/api/v1/` JSON：

1. `process[0]` 请求 `/api/v1/status`（复用导出的 `statusRequestConfig`，11-14），取 `user.id`、`user.username`、`user.uploaded`、`user.downloaded`、`user.newMessages`、`user.bonuspoang`、`user.currentGbSeed`（57-68）。最后一项用 `filters: [(q) => q * GB]` 换算成字节，`GB` 来自 `utils/filesize.ts:8`。
2. `process[1]` 请求 `/api/v1/users/$id$`，`assertion: { id: "url" }`（72-76）：`AbstractPrivateSite.getUserInfoResult` 会把 URL 里的 `$id$` 替换成上一步拿到的 id（`schemas/AbstractPrivateSite.ts:148-165`）；取 `added`、`last_access`、`uploaded`、`downloaded`、`downloaded_real`、`bonuspoang`（77-84）。

其余行为全部继承 `AbstractPrivateSite`，要点：

- `pickLast` 默认 `["id", "joinTime"]`（52）：命中历史缓存时该字段不会重复请求（`schemas/AbstractPrivateSite.ts:126-128`）。DigitalCore 补成 `["id", "name", "joinTime"]`（`definitions/digitalcore.ts:187`），Superbits 直接展开默认值再改 process（`definitions/superbits.ts:82-83`）。
- 某一步的 `fields ∪ Object.keys(selectors)` 若已全部存在，该步骤整体跳过（`schemas/AbstractPrivateSite.ts:131-141`）——所以「上一步已经取到的字段」不要再在下一步写一次选择器。
- 断言字段缺失会抛错，该次采集直接以 `parseError` 结束（`schemas/AbstractPrivateSite.ts:160-163`、200-206）。
- `donorConfig` 在 schema 中未提供，Rartracker 路径也不会消费它；`bonusPerHourMultiplier` 仅在 `schemas/NexusPHP.ts:868-870` 生效。
- **等级要自己写**：`SchemaMetadata` 没有 `levelRequirements`。站点等级在 process[1] 里以 `levelId` / `levelName` 的形式取（`definitions/digitalcore.ts:202-207` 用 `class` 字段 + 字典 filter）；只有当 `levelName` 有值且 `levelId` 缺失时，`AbstractPrivateSite.ts:194-197` 才会用 `guessUserLevelId` 反推（`utils/level.ts:300-310`）。两个范例都写全了 `levelRequirements`（`definitions/digitalcore.ts:236-279`、`definitions/superbits.ts:106-133`）。
- 追加第三个步骤很常见（如 bonus 日志接口），照 `definitions/digitalcore.ts:209-232` 的写法加 `requestConfig` + `assertion` 即可。

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected async parseTorrentRowForLink(torrent: Partial<ITorrent>): Promise<Partial<ITorrent>>` | 下载链接的拼法不同（路径、附加参数）时；默认实现是 `/api/v1/torrents/download/{id}/{passkey}`。覆写时可继续用父类私有方法 `getPassKey()` 拿 passkey | 102-106 |
| `private async getPassKey(): Promise<string>` | passkey 不在 `/api/v1/status` 的 `user.passkey` 里时；默认实现带缓存，只请求一次 | 94-100 |
| `protected override parseTorrentRowForTags(torrent, row, searchConfig)` | 分叉站在 JSON 行对象上有自己的优惠/语言标记时。注意 row 是普通对象而非 Element，用 `row.frileech === 1` 这类判断，不要用 Sizzle | 基类实现 `schemas/AbstractBittorrentSite.ts:615-637`；范例 `definitions/superbits.ts:138-154` |
| `public override async request<T>(axiosConfig, checkLogin = true)` | 需要给所有 API 请求统一加 header / 改 `responseType` 时（基类方法，不是本 schema 定义） | `schemas/AbstractBittorrentSite.ts:119-167`；同类写法见 `definitions/milkie.ts:125-139`、`definitions/hdbits.ts:318-329` |
| `protected override loggedCheck(res)` | 分叉站未登录时返回的是 HTTP 200 + JSON 错误体时（基类默认只处理状态码/跳转/refresh 头）。Rartracker 路径默认走 `AbstractPrivateSite` 的实现 | `schemas/AbstractPrivateSite.ts:50-107`；范例 `definitions/hdbits.ts:331-341` |

覆写时保持签名一致并加 `override` 关键字（`pnpm check` 会校验：`vue-tsc --noEmit`）。

## 范例定义

- `definitions/digitalcore.ts` — 最完整的范例：展开 `...SchemaMetadata` 后补搜索参数、`category` 映射与标签、`ext_imdb`、两级 userInfo 追加、第三级 bonus 日志接口、完整 `levelRequirements`，并额外补 `list[]` / `detail` 供 content-script 使用；`default class` 为空壳。
- `definitions/superbits.ts` — 差异化范例：`category` 用 `cross: { mode: "append" }`、`completed` 字段名不同、覆写 `parseTorrentRowForTags` 在 JSON 行上打 Free/SweSub/Pack 标签。

## 常见坑

1. **分叉字段名不一致**：`completed` 一处叫 `times_completed`（`definitions/digitalcore.ts:135`）、一处叫 `timesCompleted`（`definitions/superbits.ts:77`）。选择器必须对着真实接口响应写。
2. **`...SchemaMetadata` 是浅展开**：覆写 `search.requestConfig.params` 时要连同 `...SchemaMetadata.search!.requestConfig!.params` 一起展开，否则丢 `limit/index/section` 等默认值（`definitions/digitalcore.ts:122-131`）。覆写 `userInfo.process[n]` 同理，要 `...SchemaMetadata.userInfo!.process![n]`（`definitions/digitalcore.ts:190-196`）。
3. **`rows: ":self"` 只对「响应根就是行数组」成立**：响应多包一层会解析失败或抛错（`schemas/AbstractBittorrentSite.ts:479-485`、512）。
4. **`imdb` 高级搜索词不等于支持 imdb 检索**：`{ enabled: true }` 只是不跳过（34-36 + `schemas/AbstractBittorrentSite.ts:238-262`），请求里不会自动带 imdb 参数；要展示 imdb id 得自己加 `ext_imdb` selector。
5. **`SchemaMetadata` 不含 `link` 选择器**：搜索结果的下载链接由 `parseTorrentRowForLink` 拼（102-106）。覆写该方法时不要忘了 passkey，否则下载链接失效。
6. **`version` 要显式覆盖**：`SchemaMetadata` 写的是 `0`（17），现有定义都写 `1`（`definitions/digitalcore.ts:91`、`definitions/superbits.ts:26`）。按 `types/site.ts:46-54` 的约定 Rartracker 不在「不需要更新版本号」的名单内。
7. **时区缺省是 `+0000`**：`index.ts:60` 只给 `schema === "NexusPHP"` 特殊待遇；DigitalCore 写 `+0200`、Superbits 写 `+0100`，漏写会让 `added` 时间偏移（`schemas/AbstractBittorrentSite.ts:606-608`）。
8. **`noLoginAssert` 只在未覆写 `loggedCheck` 时生效**（`types/site.ts:259-266`）；Rartracker 路径使用 `AbstractPrivateSite.ts:31-48` 的默认值（401/403/502/504 + `/doLogin|login|verify|checkpoint|returnto/gi`）。若某站未登录也返回 200，需要显式补 `noLoginAssert.matchSelectors` 或覆写 `loggedCheck`。
