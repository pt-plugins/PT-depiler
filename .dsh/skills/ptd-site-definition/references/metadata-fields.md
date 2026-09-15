# ISiteMetadata 字段速查

来源：`src/packages/site/types/site.ts`（字段与注释的唯一权威）。本文件是索引与约束汇总，写定义时以源码注释为准。

一个站点定义文件的最小形态是：

```ts
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "example",
  name: "Example",
  type: "private",
  schema: "NexusPHP",     // 可省略，省略时按 type 回落（index.ts:41-42）
  urls: ["https://example.com/"],
};
```

导出名必须是 `siteMetadata`（`index.ts:37-44` 读取该字段）。

## 身份与版本

| 字段 | 类型 | 必填 | 约束 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 必须等于文件名（无扩展名），匹配 `/[0-9a-z]+/`；Jackett 有同名站点时优先与其一致（`types/site.ts:36-44`） |
| `version` | number | ✅ | 必填数字，既有定义全部显式声明。`types/site.ts:46-54` 约定：模板类 `-1`、NexusPHP/Unit3D/Gazelle/GazelleJSONAPI/AvistaZ 系 `0`、其他 >0；但仓库现状是引擎类定义普遍写 `1`。实际做法是跟随同引擎既有文件取值，同一站点内保持一致 |
| `name` | string | ✅ | 站点显示名 |
| `aka` | string[] | | 站点别名，用于搜索/匹配 |
| `description` | string \| string[] | | 站点说明 |
| `tags` | string[] | | 站点标签；缺省为 `[]`（`index.ts:59`） |
| `timezoneOffset` | `` `${"UTC"｜""}${"+"｜"-"}${number}` `` | | 用于发布时间解析；缺省 NexusPHP `+0800`、其余 `+0000`（`index.ts:60`） |
| `collaborator` | readonly string[] | | 该站点解决方案的协作者，`readonly` |

## 类型与构造

| 字段 | 说明 |
| --- | --- |
| `type` | 必填，`"private"` \| `"public"`；决定 schema 缺省回落方向，也影响未登录断言等私有站行为 |
| `schema` | 可省略。取值见 `types/site.ts:11-22` 的 `SiteSchema`。缺省或取值在 `schemas/` 中无实现时按 `type` 回落（`index.ts:41-42, 93-102`） |

若定义文件导出了 `default class`，实例化时**直接使用该类**，`schema` 字段不再决定基类（`index.ts:79-84`）。此时仍建议保留能表达意图的 `schema` 值。

## 地址与图标

| 字段 | 约束 |
| --- | --- |
| `urls` | 必填，至少一项；第一项为默认使用地址；支持 https 就用 https；敏感站点可写 rot13（`uggc://` / `uggcf://`），读取时由 `restoreSecureLink` 还原（`index.ts:53`，`utils/html.ts:49`） |
| `legacyUrls` | 历史域名。换域名时不要删 `urls` 中的旧值，而应移入此处；曾出现在 ptpp 中但未出现在 `urls` 的域名必须补进来（`types/site.ts:88-96`） |
| `favicon` | 三种写法：完整 favicon URL、`./<name>.png`（指向 `public/icons/site/`）、`data:image/...`；若 `public/icons/site/` 已有 `{id}.{png,ico,svg}` 可不写（`types/site.ts:98-106`） |
| `isDead` | 只在站点彻底死亡时写 `true`；写 `true` 后插件不再展示该站点、停止搜索与用户信息（`types/site.ts:108-115`）。临时故障不要用这个字段 |

## 搜索相关

| 字段 | 说明 |
| --- | --- |
| `category` | `ISearchCategories[]`，自定义搜索方案的分类。同一站点内各分类的 `key` 不能重复；`#url` 是特殊 key，表示直接替换请求 url（`types/search.ts:202-248`） |
| `requestDelay` | 站点全局请求延迟（毫秒）。该值作用于 `AbstractBittorrentSite.request`；若同时定义了 `search` / `searchEntry[*]` / `userInfo.process[*]` 的 `requestDelay`，两者**叠加**（`types/site.ts:119-124`） |
| `officialGroupPattern` | `TPattern[]`；搜索标题命中时，用户开启对应功能后会打上「官方」标签（`types/site.ts:126-130`） |
| `search` | `ISearchConfig`，见 [selectors-and-filters.md](selectors-and-filters.md) |
| `searchEntry` | `Record<string, ISearchEntryRequestConfig>`；仅在「站点有多个搜索入口」或「单次搜索需多页」时定义（`types/site.ts:139-144`） |
| `list` | 种子列表页（content-script 用）。`urlPattern` 不写时会由 `search.requestConfig.url` 与各 `searchEntry[*].requestConfig.url` 自动生成（`types/site.ts:155-200`） |
| `detail` | 种子详情页。`urlPattern` **无法自动生成**，需显式声明或依赖 schema（`types/site.ts:207-242`） |
| `download` | `requestConfig` 在 `getTorrentDownloadRequestConfig`（`schemas/AbstractBittorrentSite.ts:784-790`）中以 `toMerged({ baseURL: this.url, url: <下载链接>, method: "GET", timeout }, download.requestConfig)` 合并（`types/site.ts:246-248` 的注释写的是简化的 `{ url: torrent.link, method: "get" }`，与实现略有出入）；`interval`（秒）会提升为 `ISiteUserConfig.downloadInterval`（`types/site.ts:252-257`） |

## 未登录判定（private 站点）

`noLoginAssert` 仅对基于私有站模板且未改写 `loggedCheck` 的站点生效；每一项都可单独置 `false` 禁用，但不支持整体禁用（`types/site.ts:260-299`）：

| 项 | 默认值（`AbstractPrivateSite.ts:31-48, 83-101`） |
| --- | --- |
| `httpStatusCodes` | `[401, 403, 502, 504]` |
| `urlPatterns` | `[/doLogin|login|verify|checkpoint|returnto/gi]` |
| `refreshHeaderPattern` | 缺省等于 `urlPatterns`；`urlPatterns` 为 `false` 时该项也为 `false` |
| `matchSelectors` | 缺省空；命中即判定未登录（Document 用 Sizzle，JSON 用 `has`） |
| `checkResponseContent` | 缺省 `false`；开启后响应为空、或长度 < 800 且含 `login`/`auth_form`/`not authorized` 时判定未登录 |

## 用户信息（private 站点）

`userInfo` 仅对基于私有站模板且未改写 `getUserInfoResult` 的站点生效（`types/site.ts:301-371`）：

| 字段 | 说明 |
| --- | --- |
| `pickLast` | 从上次缓存结果中直接继承的字段，用于减少请求 |
| `process` | 有序步骤数组；**第一步不应有 `assertion`**，后续步骤可用。每步可含 `requestConfig`、`assertion`、`requestConfigTransformer`、`requestDelay`、`fields`、`selectors` |
| `process[*].fields` / `selectors` | 共同决定该步骤要取哪些字段：实际字段为 `[...fields, ...Object.keys(selectors)]`（`AbstractPrivateSite.ts:133-136`）；字段已存在则跳过该步骤 |
| `process[*].assertion` | `{ 字段: 'url' \| 'params.uid' \| ... }`；值为 `url` 时在 url 中替换 `$字段$`，否则按路径 set 进请求配置；缺字段会抛错（`AbstractPrivateSite.ts:148-165`） |
| `requestDelay` | process 未定义时的回落值 |
| `donorConfig` | 捐赠者（黄星）特权：`isAccountKept`、`bonusPerHourMultiplier`（能直接用 selector 选出正确时魔时该系数应为 1） |
| `selectors` | 所有步骤共用的字段选择器 |

约定：**schema 用 `fields` 声明默认能取的字段，definition 用 `userInfo.selectors` 覆写具体选择器**，这样站点侧改版只需改选择器（`types/site.ts:344-352`）。

## 用户等级

`levelRequirements: ILevelRequirement[]`（类型见 `types/userinfo.ts:73-91`）：

- `id` 为递增等级序列，不可重复；`name` 需与解析出的 `levelName` 一致，可用 `nameAka` 补充别名（i18n 或站点改名场景）。
- `groupType` 缺省 `"user"`；`vip` 为 100-199、`manager` 为 200-299（常量见 `utils/level.ts:11-12`）。
- `isKept: true` 表示该等级符合保号要求；**大于该等级的 user 组别都要声明**，否则默认视为不符合保级要求；vip/manager 组别不需要该字段。
- 需求项支持 `isoDuration`（如 `P5W`）、`TSize`（如 `"200GB"`）与数值；`ratio` 支持 `[min, max]` 区间。可选要求写在 `alternative` 中。
- **不要**写 `bonusNeededInterval` / `passTime` 这类由 `levelRequirementUnMet` 计算出的派生字段（`types/userinfo.ts:44-57`）。

## 需要用户额外输入

`userInputSettingMeta: ISiteUserInputMeta[]`：每项 `{ name, label, hint, required }`，`name` 是存入 `userConfig.inputSetting` 的键（`types/site.ts:26-31, 378-382`）。典型用途是需要 API key 或额外 ID 的站点。

## 与用户配置的边界

`ISiteUserConfig`（`types/site.ts:392-454`）是**用户侧**数据（url、超时、下载间隔、分组、`inputSetting`、`merge` 等），不是站点定义该写的内容。定义文件唯一能"提升"到用户配置的是 `download.interval`。用户可通过 `merge` 覆盖 metadata 任意字段（例如自定义 `levelRequirements` 或启停某个 `searchEntry`）。
