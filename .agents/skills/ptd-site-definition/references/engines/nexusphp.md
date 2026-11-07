# NexusPHP 站点定义规范

`schemas/NexusPHP.ts` 是 NexusPHP（xiaomlove/nexusphp 及其大量二次开发）站点的引擎模板，`schemas/NexusPHP.ts:343-771` 导出的 `SchemaMetadata` 已写好搜索页、详情页、用户页的整套默认选择器与抓取流程。只要目标站点的页面结构属于 NexusPHP 家族，就使用 `schema: "NexusPHP"` 并只覆写差异项，不要退回 `AbstractPrivateSite` 从零写。

前置事实：`index.ts:93-102` 从 schema 模块取走的**只有 `default class`**，`SchemaMetadata` 永远不会被自动合并。definition 必须自己 `...SchemaMetadata` 展开；不展开则 search / userInfo / list / detail 全为空。仓库内确实存在不展开的 NexusPHP 定义（`definitions/whupt.ts:3-16`、`definitions/yingk.ts:3-17`），但它们都是 `isDead: true` 的站点。

## 判定站点是否属于该引擎

可观测特征（每一项都能在上面列出的默认选择器里找到依据）：

- 种子列表页是 `table.torrents` 表格（`schemas/NexusPHP.ts:799`），行内下载链接为 `a[href*="download.php?id="]` 且内含 `img[alt="download"]`（`:87`）。
- 页面 URL 形态固定：详情页 `/details.php?id=<tid>`、用户页 `/userdetails.php?id=<uid>`、魔力页 `/mybonus.php`、H&R 页 `/myhr.php`（`:735`、`:757`、`:683`）。
- 种子行内优惠图标使用固定 class：`img.pro_free`、`img.pro_free2up`、`img.pro_2up`、`img.pro_50pctdown`、`img.hitandrun`（`:477-483`）。
- 用户信息表是 `td.rowhead`（字段名）/ `td.rowfollow`（值）两列结构（`:568-571`、`:631-634`）。
- 页面顶部存在 `#info_block` 容器，其中有指向 `userdetails.php?id=` 的链接（`:71`）与 `myhr.php` 链接（`:683`）。
- 做种数、做种量、发布数走 AJAX 接口 `/getusertorrentlistajax.php?userid=&type=seeding|uploaded`（`:888-894`、`:943-945`）。
- 详情页标题为 `<h1 id="top">`，或 `<title>` 形如 `… "种子名" - Powered by NexusPHP`（`:499`、`:512-521`）。

易混淆情况：

- 二次开发站点会替换默认结构类名（Audiences 用 BEM：`table.torrents-table`、`.site-userbar__compact-metric--uploaded`，见 `definitions/audiences.ts:17-25`、`:115-125`），引擎判定不变，但默认 selector 大量失效。
- 无 `default class` 导出时，`schema` 值必须能在 `schemas/` 找到实现，否则按 `type` 回落 `AbstractPrivateSite` / `AbstractBittorrentSite`（`index.ts:96-98`）；写了 `default class` 则 `schema` 不参与实例化，但类型上仍是必填字段（`index.ts:16-19`）。

## SchemaMetadata 默认值

字段路径 → 默认值 → 源码行 → definition 是否通常需要覆盖（`schemas/NexusPHP.ts`）：

| 字段 | 默认值 | 行号 | 是否需覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | `:347` | 否；仓库内 NexusPHP 定义普遍自行写 `version: 1`（`definitions/alingpt.ts:6`、`definitions/ourbits.ts:15`），约定见 `types/site.ts:46-54` |
| `schema` / `type` | `"NexusPHP"` / `"private"` | `:348-349` | 否，直接沿用 |
| `timezoneOffset` | `"+0800"` | `:350` | 仅在站点非 +0800 时改；`index.ts:60` 对 `schema === "NexusPHP"` 也会兜底 +0800 |
| `search.keywordPath` | `"params.search"` | `:352` | 否（注意不是 `params.keywords`） |
| `search.requestConfig` | `{ url: "/torrents.php", params: { notnewword: 1 } }` | `:353-356` | 搜索入口不同的站点用 `searchEntry` 表达，不直接改这里 |
| `search.advanceKeywordParams` | 仅 `imdb` → `params.search_area = 4` | `:357-364` | 需要 `douban` 等前缀时追加（`definitions/ourbits.ts:164-172`） |
| `search.selectors` | 12 个字段：`link` `url` `id` `title` `subTitle` `progress` `status` `category` `time` `ext_douban` `ext_imdb` `tags` | `:365-485` | 只覆写与站点不符的项 |
| `list` | `[{ urlPattern: ["/torrents.php", "/special.php"] }]` | `:488-492` | 入口不同则增删（`definitions/tjupt.ts:149-154`、`definitions/zrpt.ts:192-196`） |
| `detail.urlPattern` | `["/details.php"]` | `:494-495` | 否 |
| `detail.selectors.title` | `h1#top` / `html > body > title` + `switchFilters` | `:498-523` | 极少 |
| `detail.selectors.link` | 4 个 `download.php` 选择器（downhash / passkey 优先） | `:524-533` | 链接带签名或需 POST 时覆写（`definitions/hdsky.ts:324-332`） |
| `userInfo.pickLast` | `["id"]` | `:542` | 否 |
| `userInfo.selectors` | 16 个字段，见「用户信息」一节 | `:543-728` | 只覆写与站点不符的项 |
| `userInfo.process` | 3 步：`/index.php` → `/userdetails.php` → `/mybonus.php` | `:729-760` | 站点接口不同则增删（`definitions/byrbt.ts:119-125`） |
| `userInfo.donorConfig` | `{ isAccountKept: false, bonusPerHourMultiplier: 2 }` | `:766-769` | selector 已能取到加倍后时魔时改为 `1`（`definitions/baozi.ts:127-130`） |

**没有默认值、必须由 definition 提供的字段**（`SchemaMetadata` 的 `Pick` 列表见 `:343-346`）：`id`、`name`、`urls`、`category`、`levelRequirements`；`officialGroupPattern`、`noLoginAssert`、`requestDelay`、`download` 等按需补充。

模式中导出但**不含在 `SchemaMetadata` 内**的等级数据：`xiaomloveDefaultUserLevelRequirements`（`:191-333`）与 `defaultUserLevelRequirements`（`:335-337`，对前者 `omit` 一个字段，内容相同）。它们只是可复用的素材，不会自动生效。

## 最小可用定义骨架

```ts
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata, // 必须：默认 search / userInfo / list / detail 只在此合并
  version: 1,
  id: "example", // 必须与文件名一致，且只含 [0-9a-z]
  name: "Example",
  type: "private",
  schema: "NexusPHP",
  urls: ["https://example.com/"],

  category: [
    { name: "分类", key: "cat", options: [{ name: "Movies", value: 401 }], cross: { mode: "append" } },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  officialGroupPattern: [/-EXAMPLE$/i],

  levelRequirements: [{ id: 1, name: "User", privilege: "新用户的默认级别。" }],
};
```

`id` 规则见 `types/site.ts:36-44`；`category` 与 `levelRequirements` 缺失时功能不完整：没有 `levelRequirements` 就不会计算 `levelId`（`schemas/AbstractPrivateSite.ts:194-197`）。

## 搜索配置要点

**请求配置**。默认 `url: "/torrents.php"`、`params: { notnewword: 1 }`、关键字写入 `params.search`（`:352-356`）。合并顺序是「垫片 → searchEntry → search.requestConfig → 高级搜索词配置 → 关键字 → transformer」，后一步覆盖前一步（`schemas/AbstractBittorrentSite.ts:226-284`）。

**默认 selector 覆盖的种子字段**：`link`（`:367`，`download.php` 且带下载图标）、`url`（`:368`，由 link 的 `id` 拼 `/details.php?id=`）、`id`（`:375`）、`title`（`:379`，取 `title` 属性或文本）、`subTitle`（`:386`）、`progress`（`:391`）、`status`（`:399`）、`category`（`:416`）、`time`（`:431`）、`ext_douban`（`:452`）、`ext_imdb`（`:464`）、`tags`（`:476-484`）。

**未在 selector 中声明、由行结构自动推导的字段**：`rows` 与表头字段。`transformSearchPage` 在返回 Document 时（`:797-842`）：

- 若未定义 `selectors.rows`，生成 `table.torrents:last > tbody > tr`；表格无 `<thead>` 时追加 `:gt(0)` 跳过首行（`:799-809`）。
- 扫描表头单元格，命中 `/(cat|类型|類型|分类|分類|Тип)/i` 的列绑定为 `category`，命中 `guessSearchFieldIndexConfig()` 中图标选择器的列绑定为 `author` / `comments` / `completed` / `leechers` / `seeders` / `size` / `time`，生成 `> td:eq(<列号>)`（`:812-841`，配置见 `:774-784`）。

因此当站点没有分类图标、或表头结构与 NexusPHP 默认不同时，应当显式写 `rows`（`definitions/byrbt.ts:58`）或覆写 `guessSearchFieldIndexConfig`（`definitions/byrbt.ts:249-259`）。

**category 分类写法**。`SchemaMetadata` 不提供 `category`，定义必须自行给出。模板导出了三个通用常量直接复用：`CategoryIncldead`（`:28-37`，key `incldead`）、`CategorySpstate`（`:39-53`，key `spstate`）、`CategoryInclbookmarked`（`:55-64`，key `inclbookmarked`），三者均 `cross: false`。

自定义分类的生成规则（`types/search.ts:202-248` 定义，`entries/options/views/Settings/SetSearchSolution/utils.ts:39-80` 实现）：

- 不写 `cross` → 单选值直接放进 `params.<key>`；
- `cross: { mode: "append" }` → `params.<key><value> = 1`，NexusPHP 的 `cat401=1` 形态（`definitions/hdsky.ts:158`、`definitions/audiences.ts:62`）；
- `cross: { mode: "brackets" }` → `params.<key> = [v1, v2]`（`definitions/ourbits.ts:45`）；
- `cross: { mode: "comma" }` / `appendQuote` → 逗号串 / `key[v]=1`；
- `cross.key` 可改写外层字段名，多个分类块可共用一个站点参数（`definitions/ggpt.ts:47`、`:62`）；
- `key: "#url"` 是特殊值，直接把值写进 `requestConfig.url`，用于区分 `/torrents.php` 与 `/special.php` 两个入口（`entries/options/views/Settings/SetSearchSolution/utils.ts:53-54`，用例 `definitions/ggpt.ts:26-32`）。

**searchEntry**。站点有多个搜索入口且结果不同时使用，每个入口是一个 `ISearchEntryRequestConfig`，默认与 `search` 合并（`types/search.ts:144-156`、`schemas/AbstractBittorrentSite.ts:190-205`）：

```ts
searchEntry: {
  area_normal: { name: "种子区", requestConfig: { url: "/torrents.php" } },
  area_special: { name: "9KG专区", enabled: false, requestConfig: { url: "/special.php" } },
},
```

**officialGroupPattern**。类型是 `TPatterns`（正则或字符串），用于按标题自动打「官方」标签；只有当用户开启 `searchEntity.autoDetectOfficialGroupFromTitle` 时才生效，且字符串会被 `new RegExp(pattern, "i")` 处理，所以写字符串等于写正则源码（`entries/offscreen/utils/search.ts:28-39`；字符串写法见 `definitions/hdpt.ts:19`）。纯文本组名建议还是写成正则（`definitions/zmpt.ts:107`）。

## 用户信息（userInfo）

**process 三步**（`:729-760`），每一步的 `fields` 只列出该步要抓的字段，已有值会自动跳过（`schemas/AbstractPrivateSite.ts:131-141`）：

1. `GET /index.php`（document），只取 `id`。
2. `GET /userdetails.php`，`assertion: { id: "params.id" }` —— 断言把上一步的 id 写进请求参数；断言字段缺失会抛错（`schemas/AbstractPrivateSite.ts:148-165`）。该步取 `name`、`messageCount`、`uploaded`、`trueUploaded`、`downloaded`、`trueDownloaded`、`levelName`、`bonus`、`seedingBonus`、`joinTime`、`seeding`、`seedingSize`、`hnrUnsatisfied`、`hnrPreWarning`、`lastAccessAt`、`isDonor`。
3. `GET /mybonus.php`（document），取 `bonusPerHour`、`seedingBonusPerHour`。

站点魔力页路径不同时，常见做法是过滤掉第 3 步再补一步（`definitions/byrbt.ts:119-125`、`definitions/tjupt.ts:174-180`）。

**selectors 默认覆盖的字段**：`id`（`:545`，用 `baseUserIdSelector`，优先 `#info_block a[href*='userdetails.php'][href*='id=']`，见 `:66-75`）、`name`（`:552`）、`messageCount`（`:555`）、`uploaded`（`:565`）、`trueUploaded`（`:580`）、`downloaded`（`:597`）、`trueDownloaded`（`:612`）、`levelName`（`:629`，读等级图标的 `title`）、`isDonor`（`:637`）、`bonus`（`:642`，`createUserBonusSelectorFn`，`:91-120`）、`seedingBonus`（`:670`）、`joinTime`（`:671`）、`hnrPreWarning`（`:680`）、`hnrUnsatisfied`（`:691`）、`bonusPerHour`（`:702`）、`lastAccessAt`（`:712`）。

`seeding` / `seedingSize` 默认没有 selector（`:721-727` 注释说明）：`process` 三步执行完后，若两者仍为 `undefined`，`getUserInfoResult` 会用 `parseUserInfoForSeedingStatus` 请求 `/getusertorrentlistajax.php` 计算；`uploads` 未定义时同样用 `parseUserInfoForUploads` 补（`:848-876`）。也可以直接给 `seeding` / `seedingSize` 写 selector 来跳过这次 AJAX（`definitions/audiences.ts:318-325` 展示了自定义 selector 的写法）。

**pickLast**。默认 `["id"]`（`:542`），表示 `id` 从本地历史缓存取，减少请求；`name` 刻意不在其中，因为部分站点允许改名（`:538-541`）。

**noLoginAssert**。NexusPHP 的 `SchemaMetadata` **不提供**该字段，默认登录检查来自 `AbstractPrivateSite`：状态码 `[401, 403, 502, 504]`、响应 URL 匹配 `/doLogin|login|verify|checkpoint|returnto/gi`、`refresh` 头重定向（`schemas/AbstractPrivateSite.ts:31-107`）。需要额外断言时在定义里补，例如 `definitions/hddolby.ts:202-204` 的 `matchSelectors: ["script:contains('take2fa.php?returnto=')"]`。

**donorConfig**。默认 `isAccountKept: false`、`bonusPerHourMultiplier: 2`（`:766-769`）。生效条件是 `isDonor === true` 且 `bonusPerHour` 是 number，此时乘系数（`:867-873`）。若 selector 已经能直接选出加倍后的时魔，必须把系数改回 `1`，写法为 `{ ...SchemaMetadata.userInfo!.donorConfig, bonusPerHourMultiplier: 1 }`（`definitions/baozi.ts:127-130`、`definitions/52movie.ts:120-123`）。

**等级处理**。`levelRequirements` 不在 `SchemaMetadata` 内，定义必须提供；`levelId` 由 `guessUserLevelId` 依据 `levelName`（可配合 `nameAka`）匹配 `levelRequirements` 得出（`schemas/AbstractPrivateSite.ts:194-197`、`:218-220`；字段定义见 `types/userinfo.ts:73-91`）。确实需要直接指定 id 时也可以在 `userInfo.selectors` 中给 `levelId` 写选择器（`definitions/zrpt.ts:203-212`）。

## 常被覆写的类方法

`schemas/NexusPHP.ts:773-1052` 的 `default class NexusPHP extends PrivateSite`。definition 用 `export default class X extends NexusPHP` 覆写；下表只列 NexusPHP 真实定义、且在 NexusPHP 定义文件中确有真实用例的覆写点：

| 方法签名 | 何时覆写 | 源码行 / 用例 |
| --- | --- | --- |
| `protected guessSearchFieldIndexConfig(): Record<string, string[]>` | 列表表头不是 NPHP 默认的 `a[href*="sort=9"]` / `img.comments` 等 | `:774-784`；`definitions/byrbt.ts:249-259`（改用 `div.icons.*`） |
| `protected get customTagsLocaterSelector(): string` | 自定义 tag 不在 `table.torrentname` 内 | `:786-788`；`definitions/cspt.ts:318` |
| `public override async transformSearchPage(doc, searchConfig): Promise<ITorrent[]>` | 需要改行解析或表头推导逻辑（多数情况应先用 selector 解决；NexusPHP 定义中未见覆写） | `:790-846` |
| `protected async requestUserSeedingPage(userId, type): Promise<string \| null>` | 站点 AJAX 路径不同、或需要额外请求头 | `:888-894`；`definitions/audiences.ts:456-465`（补 `Referer`） |
| `protected async parseUserInfoForSeedingStatus(flushUserInfo)` | 做种/做种量表格结构与默认不同 | `:896-941`；`definitions/audiences.ts:468-495`、`definitions/keepfrds.ts:402` |
| `protected async parseUserInfoForUploads(flushUserInfo)` | 发布数不在默认文案/表格里 | `:943-968`；`definitions/tjupt.ts:346`、`definitions/keepfrds.ts:408` |
| `protected override parseTorrentRowForTags(torrent, row, searchConfig)` | 站点自定义 tag 的元素结构不同 | `:970-1012`；`definitions/hdsky.ts:372-394`（`span.optiontag`） |
| `public override async getTorrentDownloadLink(torrent): Promise<string>` | 下载链接需要凭据、有时间限制或需改写 | `:1014-1052`；`definitions/hdsky.ts:338-370`、`definitions/yzyy.ts:354` |
| `protected guessUserLevelId(userInfo): TLevelId` | 等级判定有额外规则（继承自 `AbstractPrivateSite`） | `schemas/AbstractPrivateSite.ts:218-220`；`definitions/hdsky.ts:396-414`、`definitions/52pt.ts:245` |

## 范例定义

- `definitions/alingpt.ts` — 最小可用形态：`...SchemaMetadata` + urls + 自定义 `category` + 抄改的 `levelRequirements`，没有覆写任何方法。
- `definitions/ggpt.ts` — 用 `key: "#url"` 区分 `/torrents.php` 与 `/special.php` 两个搜索入口，并用 `searchEntry` 声明入口，`cross.key` 让两个分类块共用 `cat` 参数。
- `definitions/byrbt.ts` — 覆盖 `rows` 与 `id`/`url`/`link`/`category`/`status` 选择器、过滤掉默认 `/mybonus.php` 步骤换成 `/bonus.php`，并覆写 `guessSearchFieldIndexConfig` 适配 `div.icons.*` 表头。
- `definitions/ourbits.ts` — `cross: { mode: "brackets" }` 的多维分类、追加 `douban` 高级搜索词、覆写 `progress`/`status`/`tags` 选择器与 `hnr*` 选择器。
- `definitions/hdsky.ts` — 三个方法级覆写：`getTorrentDownloadLink`（passkey/sign 两种链接形态与 10 分钟有效期）、`parseTorrentRowForTags`（`span.optiontag`）、`guessUserLevelId`（按 `joinTime` 切换新旧两套等级表），并覆写 `detail.selectors.link`。
- `definitions/audiences.ts` — 二次开发改版站点的完整适配：重写 `link`/`rows`/`time`/`progress`/`status`/`tags` 与大量用户字段选择器，并覆写 `requestUserSeedingPage` 与 `parseUserInfoForSeedingStatus`。

## 常见坑

1. **忘了 `...SchemaMetadata`**：`index.ts:93-102` 只取 schema 的 `default class`，不会合并 `SchemaMetadata`；不展开则完全没有 search / userInfo 配置。
2. **`id` 与文件名不一致或含大写**：`id` 必须等于文件名（去扩展名）且匹配 `/[0-9a-z]+/`（`types/site.ts:36-44`）。
3. **不给 `levelRequirements`**：它不在 `SchemaMetadata` 里，缺失时 `levelId` 不会计算（`schemas/AbstractPrivateSite.ts:194-197`）。
4. **`rows` 自动推断失效**：默认依赖 `table.torrents:last`，且无 `<thead>` 时用 `:gt(0)` 跳过首行（`:799-809`）。表格类名或结构不同必须显式写 `rows`（`definitions/byrbt.ts:58`、`definitions/audiences.ts:117-119`）。
5. **`progress` / `status` 默认取法特殊**：默认从标题元素父级的 `div[title="<status> <progress>"]` 解析（`:122-131`、`:391-415`）。站点改用 `div.progressBar` 一类结构时必须覆写（`definitions/ourbits.ts:182-212`、`definitions/hdsky.ts:300-320`）。
6. **`category` 默认读行内第一个 `a` 的图片 title/alt**（`:416-430`），没有分类图标时会一律得到 `"Other"`。
7. **`time` 覆盖时不要丢掉 `elementProcess`**：默认实现依赖 `<br>` 分隔与时间串格式（`:431-450`），只换 selector 的写法见 `definitions/audiences.ts:163-166`。
8. **`tags` 用追加而不是替换**：默认 7 项探测固定 class（`:476-484`），站点自定义标签应 `...SchemaMetadata.search!.selectors!.tags!` 后再补（`definitions/audiences.ts:181-205`）。
9. **`donorConfig.bonusPerHourMultiplier` 忘改**：默认 2，若 selector 已经取到加倍后的时魔，会再乘一次（`:766-769`、`:867-873`）。
10. **`keywordPath` 写错**：默认是 `params.search`，不是 `params.keywords`（`:352`）；`params.search` 与 `search_area` 配合使用（高级搜索词改写见 `:359-363`）。
11. **高级搜索词只默认支持 `imdb`**：未声明 `douban` 时 `douban|xxx` 会被直接跳过（`schemas/AbstractBittorrentSite.ts:243-257`），需要自己在 `advanceKeywordParams` 里加（`definitions/ourbits.ts:164-172`）。
12. **`list` 默认只认两个入口**：`/torrents.php` 与 `/special.php`（`:488-492`）；入口不同要追加（`definitions/tjupt.ts:149-154`），要去掉 `/special.php` 需整体重写（`definitions/zrpt.ts:192-196`）。
13. **H&R 字段默认只读 `#info_block` 的 `myhr.php` 链接**（`:680-700`），站点若在别处展示必须覆写（`definitions/ourbits.ts:236-250`）。
14. **`timezoneOffset` 只在非 +0800 时改**：模板已给 `+0800`（`:350`），`index.ts:60` 对 NexusPHP 还会兜底一次。
