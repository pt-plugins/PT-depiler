# GazelleJSONAPI 站点定义规范

`GazelleJSONAPI` 服务于**提供完整 JSON API 的 Gazelle 站**——搜索与用户信息都走 `/ajax.php?action=…`，而不是解析 HTML 表格。`schemas/Gazelle.ts:205-208` 的注释把这作为选型规则：能拿到完整 JSON 就用本 schema，否则用 `Gazelle`。

它与 `Gazelle` 共用基类 `GazelleBase`（`schemas/Gazelle.ts:375`，提供 `getSeedingSize`、`getUserTorrentList`、`getTorrentDownloadLinkFactory`），但搜索与用户信息的实现完全独立（`schemas/GazelleJSONAPI.ts:300`）；本文件 519 行，下文行号未特别说明时均指该文件。

## 判定站点是否属于该引擎

- 请求 `/ajax.php?action=browse`（搜索）、`action=index`（账号概览）、`action=user&id=`（用户详情）后返回 JSON（226-236、303-316、488-493）。
- 返回体统一为 `{ status: "success", response: {...} }`，搜索结果是 `response.results`（157、400-402）。
- 下载链接形如 `torrents.php?torrentid=<id>`，由 `GazelleBase.getTorrentDownloadLinkFactory("torrentid")` 补成 `torrents.php?action=download&id=<id>`（419-422、`schemas/Gazelle.ts:436-455`）。
- 页面仍是 Gazelle 体系（`torrents.php`、`user.php`），但列表页 HTML 不参与解析。

易混淆情况：

- **Gazelle**：`/ajax.php` 不可用或返回 HTML 的站点用 `schema: "Gazelle"`（见 [gazelle.md](gazelle.md)）。两者的选择器**不能互抄**：本 schema 的 `userInfo.selectors` 是 JSON 路径（`response.userstats.uploaded`），Gazelle 的是 DOM 选择器。
- **Luminance**：同样是 `GazelleBase` 子类，但走 `/torrents.php?action=advanced` 的 HTML 解析。
- **NexusPHP 的 JSON 接口站**（如 zhuyue/rousipro）：路径是 `/api/...`，返回结构不同，不能套用本 schema。

## SchemaMetadata 默认值

`schemas/GazelleJSONAPI.ts:226-298` 导出的 `SchemaMetadata`——**只有 `version`、`search`、`userInfo` 三项**：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `0` | 227 | 现状全部显式写 `1`（`definitions/redacted.ts`、`definitions/orpheus.ts` 等） |
| `search.keywordPath` | `"params.searchstr"` | 229 | 不需要 |
| `search.requestConfig` | `url: "/ajax.php"`、`responseType: "json"`、`params.action: "browse"` | 230-236 | 一般不需要；追加筛选参数时展开 `params` |
| `search.selectors` | **未提供，也不需要** | — | 不要写 DOM 选择器（见「常见坑」1） |
| `userInfo.pickLast` | **未提供** | — | 需要时可补，减少重复请求 |
| `userInfo.process` | **未提供，且写了也不生效** | — | 见「常见坑」2 |
| `userInfo.selectors` | 16 个字段的 JSON 路径 | 239-296 | 站点接口字段不同时逐个覆写 |
| `userInfo.requestDelay` | **未提供** | — | 需要限速时补（只作用于 `getUserExtendInfo`，489） |
| `category`、`levelRequirements`、`list`、`detail`、`noLoginAssert`、`donorConfig`、`userInputSettingMeta`、`searchEntry`、`timezoneOffset` | **未提供** | — | `category`（搜索筛选）与 `levelRequirements` 需自备；时区缺省 `+0000`（`index.ts:60`） |

`userInfo.selectors` 的字段与来源接口（239-296）：

- `action=index`：`id`、`name`、`messageCount`、`uploaded`、`downloaded`、`ratio`、`levelName`、`bonus`、`bonusPerHour`、`seedingSize`；
- `action=user&id=`：`joinTime`、`seeding`、`uploads`、`perfectFlacs`、`groups`、`invited`、`lastAccessAt`。

注意 `seedingSize` 的路径注释为 `// GazellePW`（269），`bonusPerHour` 允许回落到 `seedingBonusPointsPerHour`（266）——不同 Gazelle 分支的字段并不完全一致。

## 最小可用定义骨架

```ts
import type { ISiteMetadata } from "../types";
import GazelleJSONAPI, { SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "example", // 必须与文件名一致
  name: "Example",
  tags: ["音乐"],

  type: "private",
  schema: "GazelleJSONAPI",
  urls: ["uggcf://rknzcyr.pbz/"], // 需要时可写 rot13

  // 搜索筛选：JSON 接口的参数名按站点实测填写
  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [{ name: "Music", value: 1 }],
      cross: { mode: "appendQuote" },
    },
  ],

  levelRequirements: [{ id: 1, name: "User", privilege: "..." }],
};

export default class Example extends GazelleJSONAPI {}
```

## 搜索配置要点

- **请求**：`GET /ajax.php?action=browse`，`responseType: "json"`（230-236）；关键词写入 `params.searchstr`（229，注入逻辑见 `schemas/AbstractBittorrentSite.ts:266-268`）。
- **`selectors` 不参与解析**：`transformSearchPage`（394-417）直接读 `doc.response.results`，逐项判断该行是否含 `torrents` 键——含则是「种子组」（`transformGroupTorrent`，358-393），否则是「单种」（`transformUnGroupTorrent`，329-357）。给 `search.selectors` 写 CSS/JSON 路径都不会被使用。
- **分类筛选**：按接口实际参数名写 `metadata.category` 的 `key`（常见 `filter_cat`），多选形式（`appendQuote` → `filter_cat[1]=1`）与站点一致即可，生成规则见 `types/search.ts:202-248`。
- **空结果的两种来源**：接口 `status !== "success"`（如鉴权失败）时**静默返回空数组**（400-414），不会抛错；真正的「无匹配」也返回空数组。排查时先看网络面板里 `action=browse` 的响应体。
- **`list` / `detail` 未提供**：搜索走 JSON，浏览器里直接打开列表页时没有可复用的选择器；需要 content-script 支持（列表页批量下载、详情页下载按钮）的站点要自己补。

## 用户信息（userInfo）

本 schema 覆写了 `getUserInfoResult`（424-469），**不经过 `AbstractPrivateSite` 的 `userInfo.process` 流程**：

1. 入口守卫：`allowQueryUserInfo` 为假时直接 `passParse`（431-434）。
2. `getUserBaseInfo()` 请求 `action=index`，取 `id`、`name`、`messageCount`、`uploaded`、`downloaded`、`ratio`、`levelName`、`bonus`、`bonusPerHour`、`seedingSize`（471-486）。
3. 有 `id` 时 `getUserExtendInfo(id)` 请求 `action=user&id=`，取 `joinTime`、`seeding`、`uploads`、`perfectFlacs`、`groups`、`invited`、`lastAccessAt`（488-504）；该步骤前会按 `userInfo.requestDelay` 等待（489）。
4. `seedingSize` 仍为空时，调用基类 `getSeedingSize(id)` 翻页抓做种列表累加（444-449、`schemas/Gazelle.ts:377-426`）。
5. `cleanupUserInfo`（506-518）：`bonus`/`bonusPerHour` 为空时填 `"N/A"`，`perfectFlacs` 为空时删除该键。
6. 有 `levelName` 但无 `levelId` 时按 `levelRequirements` 反推（455-457、`schemas/AbstractPrivateSite.ts:194-197`）。
7. 异常映射：`NeedLoginError` → `needLogin`，其余 → `parseError`（460-466）。

由于字段全靠 `userInfo.selectors` 的 JSON 路径（`getFieldsData`，474-485、495-503），站点接口改名时只改对应 selector 即可；字段缺失不会报错，只会被 `cleanupUserInfo` 兜底。

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected async requestApi<T>(action, params)` | 需要给所有 API 请求统一加参数/请求头（如 `api_key`）时 | 303-311 |
| `protected async getAuthKey()` | `authkey`/`passkey` 不在 `action=index` 响应里时（默认带缓存） | 318-327 |
| `protected async transformUnGroupTorrent(group)` | 单种行的字段映射/标签不同 | 329-357 |
| `protected async transformGroupTorrent(group, torrent)` | 组内种子的字段映射不同（组字段 + 种子字段合并） | 358-393 |
| `public override async transformSearchPage(doc, searchConfig)` | 接口返回结构不同（如结果不在 `response.results`）时整体替换 | 394-417 |
| `public override async getTorrentDownloadLink(torrent)` | 下载链接参数名不是 `torrentid` 时 | 419-422 |
| `protected async getUserBaseInfo()` / `getUserExtendInfo(userId)` | 接口字段分组变化、或需要追加第三个接口时 | 471-486 / 488-504 |
| `public override async getUserInfoResult(lastUserInfo)` | 需要改动整体流程（如改为走 `process`）时，注意保持 `status`/`updateAt`/`site` 结构 | 424-469 |
| `protected cleanupUserInfo(flushUserInfo)` | 需要清理/兜底更多字段时 | 506-518 |
| `protected async getSeedingSize(userId, sizeIndex = 0)`（基类） | 做种体积接口不同或想跳过翻页 | `schemas/Gazelle.ts:377-426` |
| `protected async request<T>(axiosConfig, checkLogin = true)`（基类） | 需要注入自定义请求头（API key 等） | `schemas/AbstractBittorrentSite.ts:119-167` |

覆写时保持签名一致并加 `override`（`pnpm check` 会校验）。

## 范例定义

- `definitions/ianon.ts`、`definitions/snakepop.ts` — 最小形态：身份字段 + `isDead: true`，不展开 `SchemaMetadata`。
- `definitions/redacted.ts` — 音乐站的标准适配：`category` 筛选 + `levelRequirements`，覆写 `transformUnGroupTorrent`（`definitions/redacted.ts:173`）、`transformGroupTorrent`（181）、`getSeedingSize`（189）。
- `definitions/orpheus.ts` — 与 redacted 同源的站，可作为「站点参数差异」的对照（覆写 1 处）。
- `definitions/dicmusic.ts` — 中文音乐站，覆写 `getSeedingSize`（`definitions/dicmusic.ts:365`）与 `transformGroupTorrent`（380）。
- `definitions/gazellegames.ts` — 游戏站，覆写点最多（6 处），示范组/单种映射与用户信息方法的实际用法。
- `definitions/greatposterwall.ts`、`definitions/secretcinema.ts` — 中等规模的完整定义，`category` 与 `levelRequirements` 齐全。

## 常见坑

1. **不要写 `search.selectors`**：`SchemaMetadata` 没有该字段，解析也完全不看它（394-417）。写了不会报错，但会给人「已经适配过」的错觉。
2. **`userInfo.process` 写了无效**：本类自定义了 `getUserInfoResult`（424-469），不会走 `AbstractPrivateSite` 的 process 循环。要改流程只能覆写 `getUserBaseInfo` / `getUserExtendInfo` / `getUserInfoResult`。
3. **接口失败是静默的**：`doc.status !== "success"` 时直接返回空数组（400-414），搜索会显示「无结果」而不是报错。鉴权失效（缺少 cookie/api_key）时表现相同，排查要靠网络面板。
4. **字段缺失不会报错**：`getFieldsData` 取不到就给 `undefined`（474-485），最终由 `cleanupUserInfo` 兜底成 `"N/A"` 或删除（506-518）。看到 `N/A` 要回到接口响应里核对字段名。
5. **不同分支字段名不一致**：`seedingSize` 标注为 GazellePW 特有（269）、`bonusPerHour` 有回落路径（266）。跨站复用定义前先比对响应体。
6. **`getAuthKey` 只缓存成功结果**（318-327）：`action=index` 失败会再次请求；`authkey`/`passkey` 缺失时下载链接拿不到。
7. **`pickLast` 未提供**：每次查询用户信息都会重新请求 `index` 与 `user` 两个接口；用户量大或站点限速严格时建议补 `pickLast: ["id"]`。
8. **`requestDelay` 只作用于扩展信息步骤**（489）：想限制搜索频率要另外配 `search.requestDelay` 或站点级 `requestDelay`（`types/site.ts:119-124`）。
9. **时区缺省 `+0000`**（`index.ts:60`）：Gazelle 站的 `joinTime` / `lastAccessAt` 由 `parseTime` 解析，时区不符会整体偏移，必要时显式写 `timezoneOffset`。
10. **`version` 要显式覆盖**：`SchemaMetadata` 是 `0`（227），仓库现状写 `1`。
