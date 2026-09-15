# Unit3D 站点定义规范

Unit3D（UNIT3D-Community-Edition，Laravel + Blade）是近年新建 PT 站最常用的开源引擎，各站的列表页、详情页、用户资料页结构高度一致。本仓库由 `src/packages/site/schemas/Unit3D.ts` 承载它：该 schema 已提供搜索列表页、详情页、用户信息的默认选择器，并导出一个 `SchemaMetadata`。因此**绝大多数 Unit3D 站点只需在 `definitions/<id>.ts` 中展开 `...SchemaMetadata` 再覆写差异项，不需要导出 `default class`**（现有 35 个 Unit3D 定义中只有 2 个导出了 default class）。

下文行号若未特别说明，均指 `src/packages/site/schemas/Unit3D.ts`（该文件实际 666 行）。

## 判定站点是否属于该引擎

正向特征（有其一即可进一步验证）：

- 种子列表页在 `/torrents/`（少数站改为自建 JSON 接口，如 huno 的 `/api/torrents/filter`，`definitions/huno.ts:179`），下载链接形如 `/torrents/download/{id}`、`/download/{id}`、`/download_check/{id}`（`schemas/Unit3D.ts:140-144`）。
- 页面存在 Unit3D 专有类名：`torrent-search--list__results`、`torrent-search--list__name`、`torrent-search--list__seeders/leechers/completed/size/category/uploader`、`ratio-bar__uploaded/downloaded/ratio/points/seeding/leeching`、`badge-user`、`panelV2`（`schemas/Unit3D.ts:103-205`、`405-520`）。
- 图标类名成体系：`i.fa-arrow-circle-up`（做种）、`i.fa-thumbs-down`（撤种）、`i.torrent-icons__freeleech`、`i.torrent-icons__double-upload`、`i.torrent-icons__internal`、`i.fa-thumbtack`（`schemas/Unit3D.ts:213-288`）。
- 用户等级显示为 `span.badge-user`（或 `a.user-tag__link`），资料页路径为 `/users/{name}`，另有 `/users/{name}/earnings`（`schemas/Unit3D.ts:457-462`、`635`、`649`）。
- 站点描述中直接写明 "POWERED BY UNIT3D"（`definitions/huno.ts:112`）。

易混淆情况：

- **Gazelle / GazelleJSONAPI**：同为英文影视/音乐站，但路径为 `torrents.php?id=` 或 JSON API，且没有 `torrent-search--list__*` 这组类名。
- **NexusPHP**：中文站通常走 `details.php?id=`、`torrents.php`，类名体系完全不同。
- **其它 Laravel 模板**：可能同样使用 Bootstrap 的 `badge`、`table-responsive`，务必以 `torrent-search--list__*` / `ratio-bar__*` 是否出现为准，不要仅凭「Laravel + `/torrents/`」判定。
- **Unit3D 站点自研前端**：仍属本引擎，但默认选择器会失效（Livewire 卡片布局见 `definitions/nordicbytes.ts:135-137`），需要整段重写 `search.selectors`。

## SchemaMetadata 默认值

`schemas/Unit3D.ts:70-523` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 71 | 现状全部显式写 `1`（见「常见坑」） |
| `timezoneOffset` | `"+0000"` | 72 | 一般不需要（个别站如 monikadesign 写 `+0800`） |
| `search.keywordPath` | `"params.name"` | 74 | 不需要 |
| `search.requestConfig` | `url: "/torrents/"`、`responseType: "document"`、`params.perPage: 100` | 75-81 | 默认不需要；JSON API 站必须改（含 `responseType`） |
| `search.advanceKeywordParams.imdb` | 把 `params.name` 改写为 `params.imdbId` | 83-91 | 不需要；新增其它高级搜索词时展开 |
| `search.advanceKeywordParams.tmdb` | 把 `params.name` 改写为 `params.tmdbId` | 92-100 | 同上 |
| `search.selectors.rows` | 新版 `div.torrent-search--list__results > table:first > tbody > tr` 与旧版 `div.table-responsive table > tbody > tr` 两套，外加只保留含 `/torrents/{id}` 链接行的 `filter` | 103-118 | 仅改版站 / JSON API 站需要 |
| `search.selectors.id/title/url` | `a.view-torrent`、`a.torrent-search--list__name` | 124-138 | 视站点 |
| `search.selectors.subTitle` | `{ text: "" }`（Unit3D 列表页没有副标题设计） | 132-134 | 有副标题的站要覆写（`definitions/monikadesign.ts:187`） |
| `search.selectors.link` | `a[href*='/download/']`、`a[href*='/download_check/']`，并把 `download_check` 归一为 `download` | 140-144 | 视站点 |
| `search.selectors.time` | `time` 标签；有 `title` 用 `parseValidTimeString(title)`，否则用 `parseTimeToLiveToDate(text)` | 146-158 | 视站点 |
| `search.selectors.size/author/category/seeders/leechers/completed/comments` | 见源码；`category` 优先取 `data-original-title` 去掉末尾的 "Torrent" 词，回落到 `alt` | 160-211 | 视站点 |
| `search.selectors.status/progress` | 由 `i.torrent-icons` 的类名映射 `ETorrentStatus`，默认 `unknown` / `0` | 213-229 | 视站点 |
| `search.selectors.tags` | 11 个标签：Free、2xUp、75%、50%、25%、置顶、可退款、Internal、个人发布、Highspeed、Trump | 230-288 | 常追加站点自有标签 |
| `list[0]` | `urlPattern` 匹配 `/torrents` 根路径，`excludeUrlPattern` 排除 `?view=card` / `?view=grouped` / `?view=poster` | 292-296 | 不需要 |
| `list[1]` | `/torrents/similar/`，`mergeSearchSelectors: false`，自带 `rows/id/title/url/link` | 297-325 | 不需要 |
| `detail.urlPattern` | `/torrents/\d+` | 329 | 不需要 |
| `detail.selectors` | `id`（先 URL 后页面链接）、`title`（`h1.torrent__name`，回落 `html > body > title` 并做切分）、`link` | 330-379 | 不需要 |
| `userInfo.pickLast` | `["name"]` | 383 | 一般不需要 |
| `userInfo.selectors` | 18 个字段，见下节 | 384-521 | 站点改版时逐个覆写 |
| `userInfo.process` | **未提供** | — | 未提供即走 Unit3D 自带的抓取流程；只有 JSON API / 多步抓取才需要定义 |
| `userInfo.requestDelay` | **未提供** | — | 需要限速时补 |
| `userInfo.donorConfig` | **未提供**，且 Unit3D 的 `getUserInfoResult` 不消费该配置 | — | 在 Unit3D 定义里写它无效（见「常见坑」） |
| `noLoginAssert` | **未提供** | — | 一般不需要；兜底来自 `AbstractPrivateSite.ts:31-48`，需要时按 `definitions/huno.ts:269-272` 追加 URL 模式 |
| `category` | **未提供** | — | 需要：活跃定义几乎都显式声明（未声明的站将没有分类筛选） |
| `levelRequirements` | **未提供** | — | 需要：不写则无法把 `levelName` 映射为 `levelId` |
| `userInputSettingMeta` | **未提供** | — | 仅站点要求 API token 时（`definitions/huno.ts:124-131`） |
| `searchEntry` | **未提供** | — | 35 个 Unit3D 定义均未使用；只有多搜索入口才需要（`types/site.ts:139-144`） |

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
      key: "categoryIds", // Unit3D 分类参数名，站点间不同（categoryIds / categories / types / resolutions...）
      options: [{ name: "Movie", value: 1 }], // 必须来自站点真实分类
      cross: { mode: "brackets" }, // &categoryIds[0]=1&categoryIds[1]=2
    },
    CategoryFree, // schemas/Unit3D.ts:43-68 导出的通用「优惠」分类（custom 模式）
  ],

  // 站点要求 API token 时才需要（见 definitions/huno.ts:124-131 + huno.ts:525-537 注入请求头）
  // userInputSettingMeta: [{ name: "token", label: "Token", hint: "...", required: true }],
};
```

## 搜索配置要点

- **默认请求**：`GET /torrents/`，`responseType: "document"`，`params.perPage = 100`（75-81）；关键词写入 `params.name`（74）。个别站会按自身每页数量调整该项，如 nordicbytes 改成 25（`definitions/nordicbytes.ts:131`）。
- **高级搜索词**：`advanceKeywordParams` 已内置 `imdb`、`tmdb`（83-100），二者都把 `params.name` 改名为 `params.imdbId` / `params.tmdbId`。要新增（如 bangumi）时展开该对象：`definitions/monikadesign.ts:172-184` 把 name 改写为 `params.bgmId`。若站点用 JSON 接口，需像 huno 一样只保留 `imdb`（`definitions/huno.ts:185-195`）。
- **默认覆盖的种子字段**：`id, title, subTitle, url, link, time, size, author, category, seeders, leechers, completed, comments, status, progress, tags`（102-289）。覆写 `search.selectors` 时若只写部分字段，需要展开 `...SchemaMetadata.search.selectors` 保留其余字段（`definitions/aither.ts:86-101`）。注意 `tags` 是数组，展开时要连同数组一起处理。
- **category 写法**：每个大类是一个 `ISearchCategories`（`types/search.ts:202-248`）。Unit3D 站的分类 key 通常是 `categoryIds` / `types` / `resolutions` / `genres` / `free`，多选用 `cross: { mode: "brackets" }`（`definitions/blutopia.ts:100`、`definitions/monikadesign.ts:35`、`definitions/huno.ts:139`），追加式单值参数用 `cross: { mode: "append", key: "" }`（`definitions/monikadesign.ts:142`）。优惠分类用 `cross: { mode: "custom" }` + `generateRequestConfig`，直接复用导出的 `CategoryFree`（`schemas/Unit3D.ts:43-68`）或照 `definitions/huno.ts:155-172` 自行实现。category → requestConfig 的合并发生在 `src/entries/options/views/Settings/SetSearchSolution/utils.ts:39-89`。
- **`searchEntry`**：Unit3D 定义中无先例，默认搜索入口用 `search.requestConfig` 即可（`types/site.ts:139-144`）。列表中 `keywords` 选择器也不需要写：`AbstractBittorrentSite.transformListPage` 会从 `keywordPath` 推断（`types/site.ts:191-198`）。
- **`list`**：默认两条已覆盖普通列表页与 `/torrents/similar/`；站点若另有一批特殊列表页（如 monikadesign 的 `/torrents/airing/`），只需在数组尾部追加 `{ urlPattern: [...] }`（`definitions/monikadesign.ts:227-232`）。
- **`detail`**：默认已能解析 id/title/link，一般不用动；替换下载链接的补全逻辑由 class 方法负责（见下两节）。

## 用户信息（userInfo）

Unit3D 覆写了 `getUserInfoResult`（564-612），行为与 `AbstractPrivateSite` 不同：

1. **定义了 `userInfo.process` 时**，直接交给 `AbstractPrivateSite.getUserInfoResult`（577-579），按 process 逐步抓取。
2. **未定义 `process` 时**（默认路径）依次请求：
   - 若 `lastUserInfo.name` 不存在，用 `getUserNameFromSite()` 访问 `/`，按 `selectors.name` 取用户名（587-589、614-629）；
   - `getUserInfoFromDetailsPage(name)` 请求 `/users/{name}`，用 `selectors` 除去 `name` 之外的全部字段（593、631-644）；
   - 若 `levelRequirements` 与 `levelName` 存在但 `levelId` 缺失，调用 `guessUserLevelId`（596-598、`AbstractPrivateSite.ts:218-220`）；
   - `getUserBonusPerHour(name)` 请求 `/users/{name}/earnings`（600、646-655）；
   - 只有 `NeedLoginError` 会被映射为 `needLogin`，其它异常统一 `parseError`（603-609）。

默认选择器覆盖的字段（384-521）：`name`（取 `/users/*/settings` 链接中的用户名）、`id`、`uploaded`、`downloaded`、`ratio`、`trueRatio`、`bonus`、`seeding`、`leeching`、`seedingSize`、`averageSeedingTime`、`levelName`、`messageCount`、`uploads`、`joinTime`、`lastAccessAt`、`invites`、`bonusPerHour`。
**未覆盖**：`hnrUnsatisfied`、`hnrPreWarning`、`avatar`、`isDonor`、`posts`、`snatches`（`definitions/monikadesign.ts:254` 的 TODO 也记录了这一点），需要时自行补 selector 或自定义 process。

其余要点：

- `pickLast` 默认 `["name"]`（383）；改用 process 时可按 huno 写 `["name", "id"]`（`definitions/huno.ts:275`）。
- 多数站点是「`dl/dt/dd` 或 `td:contains(...)` 文本匹配」，源码用导出的 `userInfoTrans`（32-41）拼选择器；站点改版后按同样思路替换：`definitions/aither.ts:13-14` 用文案拼 `span.user-profile-card__meta-item-title:contains('x') + span.user-profile-card__meta-item-value`。
- `messageCount` 的 `elementProcess` 恒返回 `11`（468），只是为了让未读红点显示出来，不是真实数量；huno 覆写它从 `fa-square-N` 反推（`definitions/huno.ts:318-334`）。
- `noLoginAssert` 在 Unit3D 中未定义；需要额外兜底时在 definition 里补 `urlPatterns`（`definitions/huno.ts:269-272`），默认值见 `AbstractPrivateSite.ts:43`（`/doLogin|login|verify|checkpoint|returnto/gi`）。
- `donorConfig` 只在 NexusPHP 中被消费（`NexusPHP.ts:866-873`），Unit3D 路径不会应用 `bonusPerHourMultiplier`；Unit3D 站点若时魔需要倍率，应直接在 `bonusPerHour` 的 selector/filter 中处理（如 `definitions/monikadesign.ts:247-250` 覆写 `getUserBonusPerHour`）。
- `levelRequirements` 用 `id`（递增）+ `name`（**必须与站点 `levelName` 文本一致**，`types/userinfo.ts:73-77`）+ 需求字段（`uploaded`、`interval`、`averageSeedingTime`、`seedingSize`、`uploads`、`alternative` 等，`types/userinfo.ts:18-69`）。Unit3D 站常见「上传量 + 等待时间」与「做种量 + 平均做种时间」两类，用 `groupType: "user"` 区分保号组（`definitions/blutopia.ts:61-69`）。

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected parseTorrentRowForTags(torrent, row, searchConfig)` | 需要在默认标签之外增删标签。默认实现会把同一个种子的多个优惠标签裁剪为只保留最高折扣（Free > 75% > 50% > 25%） | 527-562；范例 `definitions/huno.ts:405` |
| `public getUserInfoResult(lastUserInfo = {})` | 抓取流程与默认三页不同（每站自定义路径 / 字段顺序）时整体替换；注意保持 `status`/`updateAt`/`site` 返回结构 | 564-612 |
| `protected getUserNameFromSite()` | 首页无法用默认 `selectors.name` 取到用户名时 | 614-629 |
| `protected getUserInfoFromDetailsPage(userName)` | 用户资料页路径不是 `/users/{name}` 时 | 631-644 |
| `protected getUserBonusPerHour(name)` | 时魔不在 `/users/{name}/earnings` 时（monikadesign 改为 `/users/{name}/bonus/transactions/create`） | 646-655；范例 `definitions/monikadesign.ts:318` |
| `public getTorrentDownloadLink(torrent)` | 默认实现只把 `/torrents/{id}` 形式补成 `/torrents/download/{id}`；若站点需要先跳详情页再取真实链接，覆写并可按需直接调用 `AbstractBittorrentSite.prototype.getTorrentDownloadLink` 绕过 Unit3D 逻辑 | 657-665；范例 `definitions/monikadesign.ts:329-342` |
| `public request(axiosConfig, checkLogin = true)`（基类方法） | 站点要求注入 `X-Api-Token` 等自定义请求头 | 范例 `definitions/huno.ts:525-537` |

覆写时保持签名一致并加 `override` 关键字（`pnpm check` 会校验）。

## 范例定义

- `definitions/blutopia.ts` — 最典型的「只写 metadata」范例：`category`（categoryIds/types/resolutions + `CategoryFree`）、完整 `levelRequirements`、追加 H&R 标签。
- `definitions/aither.ts` — 站点改版后只覆写 `userInfo.selectors`（用导出的 `userInfoTrans` 拼接新文案选择器）与 `category`，其余沿用默认。
- `definitions/monikadesign.ts` — 同时示范：自研列表页 selectors、`bangumi` 高级搜索词、覆写 `getUserBonusPerHour` 与 `getTorrentDownloadLink`。
- `definitions/huno.ts` — 改用 JSON API 的完整改造：整段替换 `search.selectors`、定义 `userInfo.process`、`userInputSettingMeta` 存 token、覆写 `request` 注入请求头、覆写 `parseTorrentRowForTags` 打标签。
- `definitions/nordicbytes.ts` — Livewire 卡片布局 + `userInfo.process` 两步抓取（首页统计 + 资料页徽章）。
- 极简样板：`definitions/hdpost.ts`、`definitions/dxdhd.ts`（仅 `id`/`name`/`urls`/`isDead`，不展开 `SchemaMetadata`）。

## 常见坑

1. **`version` 与类型注释不一致**：`Unit3D.ts:71` 声明 `version: 0`，`types/site.ts:46-54` 也说 Unit3D 架构「不需要更新版本号」，但仓库中 35 个 Unit3D 定义全部显式写了大于 `0` 的版本号（绝大多数 `1`，`asiancinema`、`huno`、`lst`、`nordicbytes` 为 `2`）。新增定义请跟随现状写 `1`。
2. **JSON API 站不能只改 `requestConfig`**：默认 `rows/id/title/...` 全是 DOM 选择器，把 `responseType` 改成 `json` 后必须整段替换 `search.selectors`（`definitions/huno.ts:197-266`）。
3. **`userInfo` 是浅合并**：只写 `userInfo: { selectors: { ... } }` 会丢掉默认的 `pickLast` 与其它字段，标准写法是 `...SchemaMetadata.userInfo!` 后再展开 `selectors`（`definitions/seedpool.ts:37-40`、`definitions/aither.ts:104-107`）。
4. **`tags: [{ selector: "*" }]` 恒成立**：`AbstractBittorrentSite.ts:620-632` 用 `Sizzle(selector, row).length > 0` 判断，`"*"` 对任意 DOM 行都为真，因此 `definitions/blutopia.ts:143-147`、`definitions/aither.ts:95-99` 追加的 `H&R` 实际会命中所有行；照抄该写法前请确认这是站点真实语义。
5. **`donorConfig` 在 Unit3D 无效**：只有 `NexusPHP.ts:866-873` 会应用 `bonusPerHourMultiplier`，Unit3D 的 `getUserInfoResult` 不含该逻辑。
6. **`SchemaMetadata.noLoginAssert` 不存在**：`definitions/huno.ts:270` 展开的是 `undefined`（JS 展开 `undefined` 合法但不产生任何键），真正的默认值来自 `AbstractPrivateSite.ts:43-48`。
7. **`subTitle` 默认是空字符串**：`Unit3D.ts:132-134` 用 `{ text: "" }` 明确表明列表页没有副标题；要展示副标题必须自己给 `selector`（`definitions/monikadesign.ts:187`）。
8. **`comments` 空值处理**：默认靠 `parseNumber` filter 把空值变成 `0`（208-211）；JSON API 站若接口不返回评论数，写 `comments: { text: 0 }` 更稳妥（`definitions/huno.ts:235`）。
9. **`list` 只匹配第一条命中的规则**：`transformListPage` 命中即 `break`（`AbstractBittorrentSite.ts:659-665`），新增 `list` 条目要注意顺序与 `urlPattern` 的重叠。
10. **`id` 必须与文件名一致且只含小写字母数字**（`index.ts:22`、`types/site.ts:36-44`）；`urls` 支持 rot13，加载时会统一还原（`index.ts:53-56`）。
