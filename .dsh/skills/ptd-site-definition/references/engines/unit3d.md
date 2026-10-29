# Unit3D 站点定义规范

Unit3D（[UNIT3D-Community-Edition](https://github.com/HDInnovations/UNIT3D-Community-Edition)，Laravel + Blade + Livewire）是近年新建 PT 站最常用的开源引擎，各站的列表页、详情页、用户资料页结构高度一致。本仓库由 `src/packages/site/schemas/Unit3D.ts` 承载它：该 schema 已提供搜索列表页、详情页、用户信息的默认选择器，并导出一个 `SchemaMetadata`。因此**绝大多数 Unit3D 站点只需在 `definitions/<id>.ts` 中展开 `...SchemaMetadata` 再覆写差异项，不需要导出 `default class`**（现状 61 个 Unit3D 定义里 7 个导出了 class，其中 6 个是为了 JSON API 的 token / 请求头）。

下文行号若未特别说明，均指 `src/packages/site/schemas/Unit3D.ts`（该文件实际 740 行，2026-10 重新核对）。

## 判定站点是否属于该引擎

正向特征（有其一即可进一步验证）：

- 种子列表页在 `/torrents/`，下载链接形如 `/torrents/download/{id}`、`/download/{id}`、`/download_check/{id}`（`schemas/Unit3D.ts:205-210`）。
- 页面存在 Unit3D 专有类名：`torrent-search--list__results`、`torrent-search--list__name`、`torrent-search--list__seeders/leechers/completed/size/category/uploader`、`ratio-bar__uploaded/downloaded/ratio/points/seeding/leeching`、`badge-user`、`panelV2`（7.x+ 的列表；6.x 只有 `data-table` / `view-torrent`）。
- 列表页由 Livewire 渲染：6.x 组件是 `torrent-list-search`，7.x+ 是 `torrent-search`（页面源码里能看到 `wire:snapshot` / `livewire/…/torrent-search`）。
- 图标类名成体系：`i.fa-arrow-circle-up`（做种）、`i.fa-thumbs-down`（撤种）、`i.torrent-icons__freeleech`、`i.torrent-icons__double-upload`、`i.torrent-icons__internal`、`i.fa-thumbtack`（`schemas/Unit3D.ts:278-294`）。
- 用户等级显示为 `span.badge-user`（或 `a.user-tag__link`），资料页路径为 `/users/{name}`，另有 `/users/{name}/earnings`（`schemas/Unit3D.ts:527-593`、`705-730`）。
- 站点描述或页脚直接写明 "POWERED BY UNIT3D"。

**API-only 站**：未登录访问 `/torrents/`、`/stats/groups/requirements`、`/pages/1` 会 302 到 `/login`，Jackett / Prowlarr 的 `*-api.yml` 末尾标注 `# json UNIT3D x.y.z`。这类站走 `/api/torrents/filter`（见下文 JSON API 一节），但引擎仍然判定为 Unit3D。

易混淆情况：

- **Gazelle / GazelleJSONAPI**：同为英文影视/音乐站，但路径为 `torrents.php?id=` 或 JSON API，且没有 `torrent-search--list__*` 这组类名。
- **NexusPHP**：中文站通常走 `details.php?id=`、`torrents.php`，类名体系完全不同。
- **其它 Laravel 模板**：可能同样使用 Bootstrap 的 `badge`、`table-responsive`，务必以 `torrent-search--list__*` / `ratio-bar__*` 是否出现为准，不要仅凭「Laravel + `/torrents/`」判定。
- **Unit3D 站点自研前端**：仍属本引擎，但默认选择器会失效（Livewire 卡片布局见 `definitions/nordicbytes.ts`），需要整段重写 `search.selectors`。

## 版本差异（2026-10 对照 UNIT3D 源码核对）

各站运行版本不同（5.x / 6.x / 7.x / 8.x / 9.x），下面这些能力与结构差异会直接影响定义写法：

| 能力 / 结构 | 起始版本 | 说明 |
| --- | --- | --- |
| `GET /api/torrents/filter` | 5.3.0 已确认 | `routes/api.php` 里在 `auth:api`（Laravel `token` driver，即 `Authorization: Bearer <API Key>`）之下；更早版本未核对 |
| 响应包裹 `{ data: [ {type,id,attributes} ] }` | 5.3.0 已确认 | `TorrentsResource`；分页信息在 `links` / `meta`，种子数组始终在 `data` |
| 列表 `div.data-table-wrapper > table.data-table` | 6.5.0 已确认 | 6.5.0 的 Livewire `torrent-list-search` 只有这层 wrapper；更早版本未核对 |
| 列表再加 `torrent-search--list__results` 类 | 7.0.0 | 7.0.0+ 是 `div.data-table-wrapper.torrent-search--list__results > table.data-table` |
| `perPage` 上限 100 | 7.2.1 | `cursorPaginate(min(perPage,100))`；7.2.0 及更早没有上限 |
| `sortField` / `sortDirection` 白名单 | 8.3.0 | `name,size,seeders,leechers,times_completed,created_at,bumped_at`；乱传会 422 |
| JSON 字段 `refundable` | 8.0.0 | 8.0.0 起 `TorrentResource` 输出 |
| JSON 字段 `featured` / `personal_release` | 8.1.0 | 9.x 的 `featured` 已改为 `featured_torrents` 关联子查询（`featured as featured`），不再是列 |
| `GET /api/user` | 9.0.0 | 8.3.6 已有 `UserResource` 但**没有注册路由**，8.x 及更早只能走 HTML 资料页 |
| `free` 允许任意 0–100 | 全版本 | 上传校验 `between:0,100`，不是只允许 0/25/50/75/100 |

## SchemaMetadata 默认值

`schemas/Unit3D.ts:135-593` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 136 | 现状全部显式写 `1`（见「常见坑」） |
| `timezoneOffset` | `"+0000"` | 137 | 一般不需要（个别站如 monikadesign 写 `+0800`） |
| `search.keywordPath` | `"params.name"` | 139 | 不需要 |
| `search.requestConfig` | `url: "/torrents/"`、`responseType: "document"`、`params.perPage: 100` | 140-146 | JSON API 站必须改（含 `responseType`） |
| `search.advanceKeywordParams.imdb` | 把 `params.name` 改写为 `params.imdbId` | 147-156 | HTML 站不需要；JSON API 站要再剥 `tt`（见 JSON API 一节） |
| `search.advanceKeywordParams.tmdb` | 把 `params.name` 改写为 `params.tmdbId` | 157-166 | 同上 |
| `search.selectors.rows` | 两条候选（7.x+ 的 `torrent-search--list__results`、旧版 `table-responsive`），外加只保留含 `/torrents/{id}` 链接行的 `filter` | 168-183 | 只匹配 7.0.0+；6.x 站点需要补 `table.data-table` 候选 |
| `search.selectors.id/title/url` | `a.view-torrent`（6.x）、`a.torrent-search--list__name`（7.x+） | 189-204 | 自研前端才需要 |
| `search.selectors.subTitle` | `{ text: "" }`（Unit3D 列表页没有副标题设计） | 197-199 | 有副标题的站要覆写（如 `definitions/generationfree.ts` 用 API 的 `release_year/resolution/type` 拼） |
| `search.selectors.link` | `a[href*='/download/']`、`a[href*='/download_check/']`，并把 `download_check` 归一为 `download` | 205-210 | 视站点 |
| `search.selectors.time` | `time` 标签；有 `title` 用 `parseValidTimeString(title)`，否则用 `parseTimeToLiveToDate(text)` | 211-224 | 视站点 |
| `search.selectors.size/author/category/seeders/leechers/completed/comments` | 见源码 | 225-277 | 视站点 |
| `search.selectors.status/progress` | 由 `i.torrent-icons` 的类名映射 `ETorrentStatus`，默认 `unknown` / `0` | 278-294 | 视站点 |
| `search.selectors.tags` | 11 个标签：Free、2xUp、25%、50%、75%、置顶、可退款、Internal、个人发布、Highspeed、Trump | 295-360 | 常追加站点自有标签 |
| `list[0]` | `urlPattern` 匹配 `/torrents` 根路径，`excludeUrlPattern` 排除 `?view=card` / `?view=grouped` / `?view=poster` | 362-366 | 不需要 |
| `list[1]` | `/torrents/similar/`，`mergeSearchSelectors: false`，自带 `rows/id/title/url/link` | 367-395 | 不需要 |
| `detail.urlPattern` | `/torrents/\d+` | 399 | 不需要 |
| `detail.selectors` | `id`（先 URL 后页面链接）、`title`（`h1.torrent__name`，回落 `html > body > title` 并做切分）、`link` | 400-451 | 不需要 |
| `userInfo.pickLast` | `["name"]` | 453 | 一般不需要 |
| `userInfo.selectors` | 18 个字段 | 454-593 | 站点改版时逐个覆写 |
| `userInfo.process` | **未提供** | — | 未提供即走 Unit3D 自带的抓取流程；只有 JSON API / 多步抓取才需要定义 |
| `userInfo.requestDelay` | **未提供** | — | 需要限速时补 |
| `userInfo.donorConfig` | **未提供**，且 Unit3D 的 `getUserInfoResult` 不消费该配置 | — | 在 Unit3D 定义里写它无效 |
| `noLoginAssert` | **未提供** | — | 兜底来自 `AbstractPrivateSite.ts`；需要时按 `definitions/dreadvault.ts` 追加 URL 模式 |
| `category` | **未提供** | — | 需要：活跃定义几乎都显式声明（未声明的站将没有分类筛选） |
| `levelRequirements` | **未提供** | — | 需要：不写则无法把 `levelName` 映射为 `levelId` |
| `userInputSettingMeta` | **未提供** | — | 仅站点要求 API token 时 |
| `searchEntry` | **未提供** | — | 只有多搜索入口才需要 |

同一文件还导出 JSON API 的公共工具（定义里直接 import，不要各写一份）：

| 导出 | 行号 | 用途 |
| --- | --- | --- |
| `pick(row, key, fallback?)` | 43 | 从 `attributes.*` 或拍平字段取值 |
| `pickAttr(row, key, fallback?)` | 62 | 只从 `attributes.*` 取值（避开顶层的 `type`/`id` 元字段） |
| `IUnit3DRawTorrent` | 76 | API 种子行的公共促销字段（`freeleech` / `double_upload` / `featured` / `internal`） |
| `freeleechFactorMap` | 97 | 5 档免费比例 → 计费比例；任意百分比请自行 `1 - p/100` |
| `CategoryFree` | 105 | 通用「优惠」分类（`free[]`、doubleup、featured、refundable） |
| `userInfoTrans` | 28 | 资料页字段的多语言标签（英文 / 中文） |

## 最小可用定义骨架

```ts
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "example", // 必须与文件名 example.ts 一致
  name: "Example",
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://example.cc/"], // 敏感站点写 rot13："uggcf://rknzcyr.pp/"

  category: [
    {
      name: "类别",
      key: "categoryIds", // HTML 站是 categoryIds；JSON API 站是 categories，别抄错
      options: [{ name: "Movie", value: 1 }], // 必须来自站点真实分类
      cross: { mode: "brackets" }, // &categoryIds[0]=1&categoryIds[1]=2
    },
    CategoryFree,
  ],
};
```

## 搜索配置要点

- **HTML 默认请求**：`GET /torrents/`，`responseType: "document"`，`params.perPage = 100`（140-146）；关键词写入 `params.name`（139）。个别站会按自身每页数量调整该项（如 nordicbytes 改成 25）。
- **高级搜索词**：`advanceKeywordParams` 已内置 `imdb`、`tmdb`（147-166），二者都把 `params.name` 改名为 `params.imdbId` / `params.tmdbId`。HTML 站可以直接沿用：Livewire 的 `imdbId` 会自己 `preg_match('/tt0*(\d{7,})/')`，传 `tt0133093` 没问题。
- **JSON API 站**：不能只改 `requestConfig`，还要整段替换 `search.selectors`，见下一节。
- **默认覆盖的种子字段**：`id, title, subTitle, url, link, time, size, author, category, seeders, leechers, completed, comments, status, progress, tags`。覆写 `search.selectors` 时若只写部分字段，需要展开 `...SchemaMetadata.search.selectors` 保留其余字段。注意 `tags` 是数组，展开时要连同数组一起处理。
- **category 写法**：每个大类是一个 `ISearchCategories`。HTML 站的分类 key 通常是 `categoryIds` / `types` / `resolutions` / `genres` / `free`，多选用 `cross: { mode: "brackets" }`；JSON API 站的 key 是 `categories`（不是 `categoryIds`）。优惠分类直接复用 `CategoryFree`。
- **`searchEntry`**：Unit3D 定义中无先例，默认搜索入口用 `search.requestConfig` 即可。列表中 `keywords` 选择器不需要写：`AbstractBittorrentSite.transformListPage` 会从 `keywordPath` 推断。
- **`list`**：默认两条已覆盖普通列表页与 `/torrents/similar/`；站点若另有特殊列表页（如 monikadesign 的 `/torrents/airing/`），只需在数组尾部追加。
- **`detail`**：默认已能解析 id/title/link，一般不用动。

## JSON API 站点（`/api/torrents/filter`）

适用于未登录看不到列表、只提供 API 的站（`retromoviesclub`、`dreadvault`、`generationfree`、`huno`、`infinityhd`、`zenith`、`concertos` 等）。

### 请求

```
GET /api/torrents/filter?perPage=100&name=<keyword>&categories[]=1&free[]=100
Authorization: Bearer <API Key>
Accept: application/json
```

- 鉴权：`auth:api` 是 Laravel `token` driver，个人 API Key 直接放 `Authorization: Bearer`（6.x 起一致）。
- 分页：`perPage` 上限 100（7.2.1+；7.2.0 及更早无上限），默认 25。
- 分类参数是 `categories[]`（HTML 站是 `categoryIds[]`）。
- 其它可用参数：`types[]`、`resolutions[]`、`genres[]`、`free[]`、`doubleup`、`refundable`（8.0+）、`featured`、`internal`、`imdbId`、`tmdbId`、`tvdbId`、`malId`、`sortField`、`sortDirection`。
- `sortField` / `sortDirection` 从 8.3.0 起有白名单校验，非白名单值会 422。

### 响应与字段

```json
{ "data": [ { "type": "torrent", "id": "123", "attributes": { ... } } ], "links": { ... }, "meta": { ... } }
```

种子数组始终在 `data`（`rows` 选择器写 `["data.data", "data"]`，前者只是兼容旧包装）。常用 `attributes` 字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 标题 |
| `category` / `category_id` | string / int | 分类名与分类 ID（分类显示可以直接用 `category`，不必再维护 id → 名称映射） |
| `size` | number | 字节 |
| `seeders` / `leechers` / `times_completed` | int | 做种 / 下载 / 完成数 |
| `created_at` | ISO 8601（UTC，带 `Z`） | 先转绝对时间戳，避免再套一次站点偏移 |
| `download_link` | string | 形如 `/torrents/download/{id}?rsskey=…`，**自带 rsskey，不依赖 Cookie 或 token** |
| `details_link` | string | 详情页地址 |
| `freeleech` | string `"N%"` | 免费比例 0–100，任意整数 |
| `double_upload` | bool | 双倍上传 |
| `internal` | int | 官方组（0/1） |
| `refundable` | bool | 8.0.0+，可退款 |
| `featured` | bool | 8.1.0+，首页精选（9.x 来自关联子查询） |
| `personal_release` | bool | 8.1.0+，个人发布 |
| `uploader` | **string** | 发布者用户名（匿名时是 `"Anonymous"`） |
| `imdb_id` / `tmdb_id` / `tvdb_id` | int | IMDb 是纯数字，没有 `tt` 前缀 |
| `num_file` / `files[]` | int / array | 文件数与文件列表（9.x 更完整） |
| `meta.poster` / `meta.genres` | string | 海报与类型 |

### 计费与标签

- **下载计费 = 1 − free / 100**。`free` 允许任意 0–100（上传校验 `between:0,100`），不要只映射 `0/25/50/75/100` 五档；本仓库的 `freeleechFactorMap` 只是这五档的便捷表，其它值要现算。
- **上传计费 = `double_upload` ? 2 : 1**。
- `freeleech` 换算后的标签名沿用仓库口径「计费比例」：`100%` 免费 → `Free`，`75%` 免费 → `25%`，以此类推。
- **`featured` 只是首页精选，不影响计费**：源码里 `Jobs/ProcessAnnounce`（6.x）与 `Services/Unit3dAnnounce`（9.x）只读 `free` 与 `doubleup`，`featured_torrents` 是独立关联表。不要像 Jackett 那样把 `featured` 当 0 下载 / 2x 上传，只打一个「精选」徽章。
- `internal` → 官方；`refundable` → 可退款；`personal_release` → 个人发布。
- API 不返回个人做种/下载状态，`status`/`progress` 保持 `unknown`/`0` 即可（除非站点另给接口）。

JSON 行标签解析在 `parseTorrentRowForTags` 里做（默认实现是 DOM 选择器，JSON 下取不到），可参考 `definitions/retromoviesclub.ts`：

```ts
protected override parseTorrentRowForTags(torrent, row, searchInput) {
  const raw = row as IUnit3DRawTorrent;
  const free = Number(String(pick(raw, "freeleech", "0%")).replace("%", ""));
  torrent.downloadVolumeFactor = Number.isFinite(free) ? 1 - free / 100 : undefined;
  torrent.uploadVolumeFactor = pick(raw, "double_upload", false) ? 2 : 1;
  // tags 按 site 语义自行组装（Free / 2xUp / 官方 / 可退款 / H&R …）
}
```

### 用户信息 `/api/user`（仅 9.0.0+）

- 路由 9.0.0 才注册（8.3.6 只有 Resource），**8.x 及更早的站不要配这个 process**，否则 404。
- 返回扁平对象（`UserResource::withoutWrapping()`），只有 10 个字段：`username`、`group`、`uploaded`、`downloaded`、`ratio`、`buffer`、`seeding`、`leeching`、`seedbonus`、`hit_and_runs`。
- **没有**注册时间、做种体积、平均做种时间、发布数、时魔；前端对应列会留空，这是接口限制不是解析错误。
- 标准写法见 `definitions/retromoviesclub.ts` / `definitions/dreadvault.ts`：`userInfo.process` 一步请求 `/api/user`，字段用 `selectors` 声明（definition 侧优先 `selectors`，不要和 `fields` 重复）。

### 请求头注入与下载

- 只在 `/api/` 路径上附 `Authorization: Bearer <token>`，避免把凭据带到 HTML 页面或第三方下载跳转；缺 token 时抛 `NoUserInputError`，比空 Bearer 触发 401 更清晰。
- 下载链接自带 `rsskey`，直接使用 API 返回的 `download_link` 即可，不需要再拼 token。
- 只有 huno 这类用 `X-Api-Token` 的站需要覆写请求头名。

## 用户信息（userInfo，HTML 路径）

Unit3D 覆写了 `getUserInfoResult`（636-687），行为与 `AbstractPrivateSite` 不同：

1. **定义了 `userInfo.process` 时**，直接交给 `AbstractPrivateSite.getUserInfoResult`（650），按 process 逐步抓取。
2. **未定义 `process` 时**（默认路径）依次请求：
   - 若 `lastUserInfo.name` 不存在，用 `getUserNameFromSite()` 访问 `/`，按 `selectors.name` 取用户名（660、688-704）；
   - `getUserInfoFromDetailsPage(name)` 请求 `/users/{name}`，用 `selectors` 除去 `name` 之外的全部字段（705-719）；
   - 若 `levelRequirements` 与 `levelName` 存在但 `levelId` 缺失，调用 `guessUserLevelId`；
   - `getUserBonusPerHour(name)` 请求 `/users/{name}/earnings`（672、720-730）；
   - 只有 `NeedLoginError` 会被映射为 `needLogin`，其它异常统一 `parseError`。

默认选择器覆盖的字段（454-593）：`name`、`id`、`uploaded`、`downloaded`、`ratio`、`trueRatio`、`bonus`、`seeding`、`leeching`、`seedingSize`、`averageSeedingTime`、`levelName`、`messageCount`、`uploads`、`joinTime`、`lastAccessAt`、`invites`、`bonusPerHour`。
**未覆盖**：`hnrUnsatisfied`、`hnrPreWarning`、`avatar`、`isDonor`、`posts`、`snatches`，需要时自行补 selector 或自定义 process。

其余要点：

- `pickLast` 默认 `["name"]`（453）；改用 process 时可按 huno 写 `["name", "id"]`。
- 多数站点是「`dl/dt/dd` 或 `td:contains(...)` 文本匹配」，源码用导出的 `userInfoTrans` 拼选择器；站点改版后按同样思路替换。
- `messageCount` 的 `elementProcess` 恒返回 `11`，只是为了让未读红点显示出来，不是真实数量。
- `noLoginAssert` 在 Unit3D 中未定义；需要额外兜底时在 definition 里补 `urlPatterns`（如 `definitions/dreadvault.ts`）。
- `donorConfig` 只在 NexusPHP 中被消费，Unit3D 路径不会应用 `bonusPerHourMultiplier`。
- `levelRequirements` 用 `id`（递增）+ `name`（**必须与站点 `levelName` 文本一致**）+ 需求字段（`uploaded`、`interval`、`averageSeedingTime`、`seedingSize`、`uploads`、`alternative` 等）。Unit3D 站常见「上传量 + 等待时间」与「做种量 + 平均做种时间」两类，用 `groupType: "user"` 区分保号组。

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected parseTorrentRowForTags(torrent, row, searchConfig)` | 需要在默认标签之外增删标签；JSON API 站必须覆写（默认实现面向 DOM）。默认 HTML 实现会把同一个种子的多个优惠标签裁剪为只保留最高折扣 | 597-629 |
| `public getUserInfoResult(lastUserInfo = {})` | 抓取流程与默认三页不同时整体替换；注意保持 `status`/`updateAt`/`site` 返回结构 | 636-687 |
| `protected getUserNameFromSite()` | 首页无法用默认 `selectors.name` 取到用户名时 | 688-704 |
| `protected getUserInfoFromDetailsPage(userName)` | 用户资料页路径不是 `/users/{name}` 时 | 705-719 |
| `protected getUserBonusPerHour(name)` | 时魔不在 `/users/{name}/earnings` 时 | 720-730 |
| `public getTorrentDownloadLink(torrent)` | 默认实现只把 `/torrents/{id}` 形式补成 `/torrents/download/{id}`；需要先跳详情页再取真实链接时覆写，可调用 `AbstractBittorrentSite.prototype.getTorrentDownloadLink` 绕过 Unit3D 逻辑 | 731-739 |
| `public request(axiosConfig, checkLogin = true)`（基类方法） | 站点要求注入自定义请求头（`Authorization` / `X-Api-Token`） | 范例 `definitions/huno.ts`、`definitions/retromoviesclub.ts` |

覆写时保持签名一致并加 `override` 关键字（`pnpm check` 会校验）。

## 范例定义

- `definitions/blutopia.ts` — 最典型的「只写 metadata」范例：`category`（categoryIds/types/resolutions + `CategoryFree`）、完整 `levelRequirements`、追加 H&R 标签。
- `definitions/aither.ts` — 站点改版后只覆写 `userInfo.selectors`（用导出的 `userInfoTrans` 拼接新文案选择器）与 `category`，其余沿用默认。
- `definitions/monikadesign.ts` — 同时示范：自研列表页 selectors、`bangumi` 高级搜索词、覆写 `getUserBonusPerHour` 与 `getTorrentDownloadLink`。
- `definitions/huno.ts` — JSON API 的「老派」完整改造：整段替换 `search.selectors`、`userInfo.process`、`userInputSettingMeta`、覆写 `request` 注入 `X-Api-Token`。
- `definitions/retromoviesclub.ts` / `definitions/dreadvault.ts` / `definitions/generationfree.ts` — 9.x API-only 站的标准形态：`/api/torrents/filter` + Bearer、`/api/user`（9.0+）、复用 `IUnit3DRawTorrent` / `freeleechFactorMap` / `pick` / `pickAttr`。
- `definitions/nordicbytes.ts` — Livewire 卡片布局 + `userInfo.process` 两步抓取。
- 极简样板：`definitions/hdpost.ts`、`definitions/dxdhd.ts`。

## 常见坑

1. **`version` 与类型注释不一致**：`Unit3D.ts:136` 声明 `version: 0`，`types/site.ts` 也说 Unit3D 架构「不需要更新版本号」，但仓库现状全部显式写大于 `0`（绝大多数 `1`）。新增定义跟随现状写 `1`。
2. **JSON API 站不能只改 `requestConfig`**：默认 `rows/id/title/...` 全是 DOM 选择器，把 `responseType` 改成 `json` 后必须整段替换 `search.selectors`。
3. **`userInfo` 是浅合并**：只写 `userInfo: { selectors: { ... } }` 会丢掉默认的 `pickLast` 与其它字段，标准写法是 `...SchemaMetadata.userInfo!` 后再展开 `selectors`。
4. **`tags: [{ selector: "*" }]` 恒成立**：`AbstractBittorrentSite` 用 `Sizzle(selector, row).length > 0` 判断，`"*"` 对任意 DOM 行都为真；照抄前请确认这是站点真实语义。
5. **`donorConfig` 在 Unit3D 无效**：只有 `NexusPHP` 会应用 `bonusPerHourMultiplier`。
6. **`SchemaMetadata.noLoginAssert` 不存在**：展开的是 `undefined`（合法但无键），真正默认值来自 `AbstractPrivateSite`。
7. **`subTitle` 默认是空字符串**：Unit3D 列表页没有副标题设计；要展示必须自己给 selector（JSON API 站可拼 `release_year` / `resolution` / `type`）。
8. **`comments` 空值处理**：默认靠 `parseNumber` 把空值变 `0`；JSON API 站写 `{ text: 0 }` 更稳。
9. **`list` 只匹配第一条命中的规则**：`transformListPage` 命中即 `break`，新增条目要注意顺序与 `urlPattern` 重叠。
10. **`id` 必须与文件名一致且只含小写字母数字**；`urls` 支持 rot13，加载时统一还原。
11. **`freeleech` 是「免费比例」不是计费比例**：`free = 75` 表示免 75%、按 25% 计费；且值可以是任意 0–100。`freeleechFactorMap` 只覆盖五档，其它值要 `1 - free/100` 现算。
12. **`featured` 不是优惠**：`ProcessAnnounce` / `Unit3dAnnounce` 的计费只看 `free` 与 `doubleup`；把 featured 当 0 下载 / 2x 上传会显示错误的计费。
13. **API 的 `uploader` 是字符串**，不是对象：`uploader.username` 永远取不到，`author` 应写 `["uploader", "attributes.uploader"]`。
14. **`/api/user` 只存在于 9.0.0+**，且只有 10 个字段（没有注册时间 / 做种体积 / 平均做种 / 发布数 / 时魔）。8.x 站只能走 HTML 资料页，配 process 会 404。
15. **API 的 `imdbId` 会被 `(int)` 强转**：传 `tt0133093` 会变成 `0`、等于不过滤；JSON API 的高级检索必须先剥 `tt`。HTML 站不需要剥（Livewire 自己会用 `preg_match('/tt0*(\d{7,})/')` 处理）。
16. **列表布局按版本分叉**：默认 `rows` 只覆盖 7.0.0+ 的 `torrent-search--list__results` 结构；6.x 站点的列表是 `div.data-table-wrapper > table.data-table`，需要把 `table.data-table > tbody > tr` 加进候选（见上表「版本差异」）。
17. **`version`、`timezoneOffset: "+0000"`、`favicon: "./_default_unit3d.ico"` 等默认值不要无意义地重复声明**：`timezoneOffset` 与 `version` 已有默认；`favicon` 只有站点没有本地图标时才需要写，`public/icons/site/{id}.{png,ico,svg}` 的存在会覆盖该字段。
