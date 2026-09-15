# AbstractPrivateSite 站点定义规范

`AbstractPrivateSite`（`schemas/AbstractPrivateSite.ts:1-2` 注释：「所有PT站点的基类」）是私有站默认模板，继承 `AbstractBittorrentSite`。它的定位是**兜底基类**：当 `siteMetadata.type === "private"` 且 schema 缺省或指向不存在的 schema 时，站点实例就落在它身上（`index.ts:41-42`、`index.ts:96-98`）。

因此「只写 `siteMetadata`、不导出 `default class`」时，站点的全部能力由它决定，主要只有三块：

1. **未登录判定**：`loggedCheck`（`schemas/AbstractPrivateSite.ts:50-107`）按状态码 / responseURL / refresh 头 / matchSelectors / 响应体做断言；
2. **用户信息采集**：`getUserInfoResult`（113-215）按 `userInfo.process` 逐步抓取、按 `pickLast` 复用缓存、按 `parseUserInfoFor{Field}` 做特化；
3. **等级换算**：`guessUserLevelId`（218-220）。

它**不提供任何搜索或用户信息的默认选择器**（`SchemaMetadata` 只有 `version` 与两个空对象），所以使用它的站点要把 `search.selectors`、`userInfo.process` 等整段自己写。

下文行号若未特别说明，均指 `src/packages/site/schemas/AbstractPrivateSite.ts`（该文件实际 221 行）。

## 判定站点是否属于该引擎

先明确实例化顺序（`index.ts:79-102`）：**definition 导出了 `default class` → 直接用它；否则才看 `siteMetadata.schema`；`schema` 值在 `schemas/` 下没有实现时再按 `type` 回落**（private → `AbstractPrivateSite`）。所以「是否属于本模板」和「schema 字段写不写」是两个问题。

**省略 `schema` 字段**（合法，`index.ts:41-42` 会补成 `"AbstractPrivateSite"`）适用于：

- definition 导出了 `default class`——此时 schema 字段对实例化毫无影响，仓库中 `definitions/hdbits.ts`、`definitions/gtnet.ts`、`definitions/gtru.ts`、`definitions/qingwa.ts` 就是这样（文件里没有 `schema` 行、有 default class；其中部分是通过 `...SchemaMetadata` 带入 `schema` 的）；
- 站点就是普通私有站，选择器与流程全部自己写、不依赖任何现成引擎，且不需要在文件里强调这一点（`definitions/ncore.ts`、`definitions/bitpt.ts`、`definitions/cinemageddon.ts`）。

**显式写 `schema: "AbstractPrivateSite"`** 适用于：

- 文件里不导出 default class，但希望读者一眼看出「这个站走通用私有站模板」；仓库现有 15 个文件这么写（`definitions/milkie.ts:25`、`definitions/starspace.ts:29`、`definitions/torrentleech.ts`、`definitions/bakabt.ts`、`definitions/karagarga.ts`、`definitions/retrotoon.ts`、`definitions/pussytorrents.ts`、`definitions/hdroute.ts`、`definitions/pornolab.ts`、`definitions/rutracker.ts`、`definitions/yzyy.ts`、`definitions/audionews.ts`、`definitions/iptorrents.ts`、`definitions/pornbits.ts`、`definitions/speedapp.ts`）；
- definition 导出了 `default class` 且该 class 继承的就是 `PrivateSite`（`definitions/milkie.ts:3` + `124`、`definitions/bakabt.ts:4` + `239`）——此时显式写只是声明意图，与省略的实例化结果完全相同。

**必须注意的反向情形**：`schema` 字段还会影响时区缺省（`index.ts:60`：只有 `schema === "NexusPHP"` 才给 `"+0800"`，其余一律 `"+0000"`）。注意这一步作用在 definition 最终导出的对象上——`...SchemaMetadata` 展开本身就会带入 `schema`（`schemas/NexusPHP.ts:348`）与 `timezoneOffset`（`schemas/NexusPHP.ts:350`），所以展开过引擎默认值的文件不会踩到这个缺省。仓库中所有「default class 继承某引擎」的 definition 都展开了 `...SchemaMetadata`，因此该陷阱目前没有真实案例。**结论：default class 继承某个引擎时，展开该引擎的 `SchemaMetadata`、显式写 `schema`、显式写 `timezoneOffset` 三者至少要有其一。**

易混淆情况：

- **站点其实是 NexusPHP / Unit3D / Gazelle 等现成引擎**：手写 `schema: "AbstractPrivateSite"` 会让站点退化成通用模板，白白丢掉引擎的默认选择器与流程。判定依据见各引擎文档；`iptorrents`、`pornolab`、`speedapp` 等站点确实不属于任何现有 schema，才用本模板。
- **把 `type: "public"` 的 BT 站写成 private**：会拿到 `loggedCheck` 的未登录断言与 `userInfo` 流程（虽然没人调用），公开站应走 `AbstractBittorrentSite`（`index.ts:41-42`、97）。

## SchemaMetadata 默认值

`schemas/AbstractPrivateSite.ts:20-24` 导出的 `SchemaMetadata: Partial<ISiteMetadata>`：

| 字段路径 | 默认值 | 行号 | definition 是否通常需要覆盖 |
| --- | --- | --- | --- |
| `version` | `-1` | 21 | 不展开它，definition 自行写 `1` 及以上（见「常见坑」） |
| `search` | `{}` | 22 | — 空对象，等于没有默认值 |
| `userInfo` | `{}` | 23 | — 空对象，等于没有默认值 |

**没有任何 definition 从本 schema 导入 `SchemaMetadata`**（从 `../schemas/` 导入 `SchemaMetadata` 的定义文件全部指向 NexusPHP / Unit3D / Gazelle / GazelleJSONAPI / Luminance / Rartracker / TCG 等）。所以在本模板下不存在「展开默认值再覆写差异项」的写法，definition 是整段自写 metadata。

本模板同样**不提供**：`search.keywordPath`、`search.requestConfig`、`search.selectors`、`search.advanceKeywordParams`、`detail`、`list`、`searchEntry`、`category`、`levelRequirements`、`noLoginAssert`、`userInputSettingMeta`、`userInfo.pickLast/process/selectors/requestDelay/donorConfig`。

缺省值只由加载层补：`tags → []`、`timezoneOffset → "+0000"`（`index.ts:59-60`），`schema → "AbstractPrivateSite"`（`index.ts:41-42`），`userConfig.allowSearch` / `allowQueryUserInfo` 按 metadata 是否非空推导（`index.ts:65-70`、`105-107`）。

## 最小可用定义骨架

只写 metadata、不导出 class；私有站靠 `type` 回落本模板（对照 `definitions/ncore.ts`）：

```ts
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  id: "example", // 必须与文件名 example.ts 一致
  version: 1,
  name: "Example",
  timezoneOffset: "+0800", // 缺省 "+0000"（index.ts:60），按站点实际时区写

  type: "private", // 不写 schema：私有站缺省回落 AbstractPrivateSite
  urls: ["https://example.org/"],

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/profile.php" }, // responseType 缺省 document
        selectors: {
          id: { selector: "input[data-uid]", attr: "data-uid" },
          name: { selector: "#profile-name" },
          uploaded: { selector: "#uploaded", filters: [{ name: "parseSize" }] },
          joinTime: { selector: "#join-date", filters: [{ name: "parseTime" }] },
        },
      },
    ],
  },

  levelRequirements: [{ id: 1, name: "User" }, { id: 2, name: "Power User", interval: "P4W", uploaded: "50GB" }],
};
```

需要覆写引擎行为时再加 `export default class Example extends PrivateSite {}`，导入路径见 `definitions/milkie.ts:3`（`../schemas/AbstractPrivateSite`，有的文件带 `.ts` 后缀）。

## 搜索配置要点

本模板不覆写 `getSearchResult` / `transformSearchPage` / `transformListPage`，搜索完全走 `AbstractBittorrentSite`，因此要点都在基类：

- **请求配置生成顺序**（`schemas/AbstractBittorrentSite.ts:188-229`）：`searchEntry.id` → 与 `metadata.searchEntry[id]` 合并 → 未显式 `merge: false` 时再与 `metadata.search` 合并；最后套在垫片 `{ url: "/", responseType: "document", params: {}, data: {} }` 之上。所以**不写 `responseType` 就是 `document`**，JSON 接口必须显式写 `responseType: "json"`（或像 `definitions/milkie.ts:130` 那样在 `request` 里统一改）。
- **关键词**：`set(requestConfig, searchEntry.keywordPath || "params.keywords", keywords)`（`schemas/AbstractBittorrentSite.ts:266-268`）。本模板下 `keywordPath` 没有默认值之外的约定，直接按站点参数名写 `"params.query"`（`definitions/milkie.ts:39`）即可。
- **`selectors.rows` 必填**：缺失时 `transformSearchPage` 直接 `throw Error("列表选择器未定义")`（`schemas/AbstractBittorrentSite.ts:504-506`），表现为搜索状态 `parseError`。行选择器在 JSON 响应下用 `get(context, selector)`，`:self` 表示响应根（479-485、512）。
- **单行内可覆写的字段**：`id, title, subTitle, url, link, time, size, author, seeders, leechers, completed, comments, category, tags, progress, status`（`schemas/AbstractBittorrentSite.ts:44-61` 的 `defaultTorrentSelectorKey`）；每个字段都可以用同名类方法 `parseTorrentRowFor{Key}` 取代 selector（575-587）。
- **category 分类**：metadata 顶层的 `category: ISearchCategories[]` 决定搜索时怎么下发分类（`types/search.ts:202-248`）。本模板的站点形态各异，三种写法都能在仓库里找到范例：`cross: { mode: "comma" }`（`definitions/milkie.ts:29-36`）、`cross: { mode: "append" }`（`definitions/retrotoon.ts:73-80`）、以及用特殊 key `"#url"` 直接切搜索入口（`definitions/starspace.ts:36-45`，语义见 `types/search.ts:214-217`）。分类 value 必须来自站点真实参数。
- **`list[]`**：只在「浏览器直接打开列表页时也要被识别」时写，且 `urlPattern` 命中即 `break`（`schemas/AbstractBittorrentSite.ts:659-665`）。用 AJAX 取数据的站要把 `mergeSearchSelectors` 设为 `false`（`definitions/milkie.ts:69-86`）。
- **`detail`**：用于详情页解析与「搜索页拿不到 link」时的补链接（`schemas/AbstractBittorrentSite.ts:716-778`）。`urlPattern` 必须显式声明（`types/site.ts:207-214`）。
- **高级搜索词**：`advanceKeywordParams` 同样没有默认值。未声明时 `imdb|xxx` 会被视同 `{ enabled: true }`（只去掉前缀后按普通文本搜索），其余前缀（douban / tmdb / tvdb 等）一律跳过并返回 `i18n.noAdvanceParams`；声明为 `false` 则连 imdb 也跳过（`schemas/AbstractBittorrentSite.ts:237-262`、`types/search.ts:102-113`）。`requestConfigTransformer` 可在请求发出前最后改写配置（`schemas/AbstractBittorrentSite.ts:281-284`）。
- **`searchEntry`**：多搜索入口时才需要（`types/site.ts:139-144`）；本模板下的站点多数不需要。
- **`noLoginAssert`**：这是本模板站点的常用补丁——当站点未登录时返回 200 而非跳转时，用它兜底（生效条件见「用户信息」末段）。范例：`definitions/retrotoon.ts:68-71`（`urlPatterns` + `matchSelectors`）、`definitions/torrentleech.ts:316-318`（只给 `matchSelectors`）、`definitions/karagarga.ts:115`、`definitions/hdroute.ts:246`、`definitions/pussytorrents.ts:312`、`definitions/yzyy.ts:339`、`definitions/bitpt.ts:260`。

## 用户信息（userInfo）

不导出 default class 时，这一段的行为完全由 `AbstractPrivateSite.getUserInfoResult`（113-215）决定。逐步说明：

1. **入口守卫**（120-123）：`!allowQueryUserInfo || !metadata.userInfo?.process` 时直接返回 `status = passParse`，不做任何请求。`allowQueryUserInfo` 要求站点在线、`metadata.userInfo` 存在、且用户配置没有显式关闭（27-29）；加载层还会把 `userConfig.allowQueryUserInfo` 的缺省值设为「`userInfo` 是否非空对象」（`index.ts:65-70`、`105-107`）。**没有 `userInfo` 段或没有 `process` 的站点不会报错，只是没有个人数据。**
2. **`pickLast`**（126-128）：把上一次结果里的字段并入本次结果，避免重复请求。仓库中的实际取值：`["id"]`（`definitions/ncore.ts:14`）、`["name", "joinTime"]`（`definitions/milkie.ts:97`）、`["id", "name"]`（`definitions/torrentleech.ts`、`definitions/gtnet.ts`、`definitions/starspace.ts`）、`["id", "name", "joinTime"]`（`definitions/karagarga.ts`）。字段允许范围由 `TUserInfoParseKey` 约束（`types/site.ts:24`）。
3. **步骤跳过判定**（131-141）：某一步能提供的字段是 `[...(fields ?? []), ...Object.keys(selectors ?? {})]`，若这些字段**全部**已在结果里，该步骤直接跳过。这是「已取到的字段不重复请求」的机制，也意味着**不能假设某一步一定会发请求**。
4. **请求配置**（144-147）：垫片是 `{ url: "/", params: {}, data: {}, responseType: "document" }`，与 `process[n].requestConfig` 做 `toMerged`。JSON 接口要在该步骤显式写 `responseType: "json"`。
5. **`assertion`**（148-165）：`{ id: "url" }` 表示把 URL 字符串里的 `$id$` 替换成已取到的 id；`{ id: "params.uid" }` 表示当 `params.uid` 不存在时直接 `set` 上去（本模板下 `definitions/milkie.ts` 这类单步站点不用，多步站点常用，如 `schemas/TCG.ts:72-74` 的 `/userdetails.php` + `{ id: "params.id" }`）。**断言字段缺失会 `throw`（160-163），整次采集以 `parseError` 结束且后续步骤不再执行。**
6. **`requestConfigTransformer`**（167-170）与 **`requestDelay`**（172-173，回落到 `userInfo.requestDelay`）：需要按已取字段改写请求、或给单步限速时使用。
7. **字段取值顺序**（177-191）：
   ① 同名类方法 `parseUserInfoFor{PascalKey}(flushUserInfo, dataDocument, requestConfig)`（动态派发见 178-181）；
   ② 本步骤的 `selectors[key]`；
   ③ 全局回落 `userInfo.selectors[key]`；
   ④ 三者都没有时**静默什么都不做**——`throw` 已被注释掉（186-189）。
8. **等级**（194-197、218-220）：仅当 `metadata.levelRequirements` 存在、`flushUserInfo.levelName` 有值、且 `levelId` 未定义时，调用 `guessUserLevelId`（`utils/level.ts:300-310`）。所以**给了 `levelRequirements` 却没取到 `levelName`，等级不会被推出来**；取到 `levelId` 的站点则直接使用。
9. **错误分类**（199-212）：`CFBlockedError → CFBlocked`、`NeedLoginError → needLogin`、其余 → `parseError`；正常结束为 `success`。

未登录判定（本模板的能力之一）：

- 默认值来自 `metadata.noLoginAssert`，缺省是状态码 `[401, 403, 502, 504]`（31-40）、URL 模式 `[/doLogin|login|verify|checkpoint|returnto/gi]`（42-44）、refresh 头模式同 URL 模式（46-48）、`matchSelectors: []`、`checkResponseContent: false`（83、93）。
- `noLoginAssert` 的每一项都可以单独设成 `false` 关闭，但**不能整体关闭**；要整体关闭只能改 `type` 或覆写 `loggedCheck`（`types/site.ts:259-266`）。
- **覆写了 `loggedCheck` 的 definition 会让 `noLoginAssert` 失效**（`types/site.ts:263`），本模板下如 `definitions/hdbits.ts:331-341`、`definitions/beyondhd.ts:615`、`definitions/sunnypt.ts:164`。
- `noLoginAssert.checkResponseContent` 开启后会对响应文本做「过短且含 login / auth_form / not authorized」的判定（93-101）。

`donorConfig` 在本模板中没有引擎侧效果：`AbstractPrivateSite` 不读取它，`bonusPerHourMultiplier` 只在 `schemas/NexusPHP.ts:868-870` 生效，`isAccountKept` 仅被前端读取（`src/entries/options/views/Overview/MyData/UserLevelRequirementsTd.vue:56-57`）。

## 凭据、运行态与下载链路

本模板站点的结构千差万别，凭据与下载这几条路径常常要自己接：

- **需要用户输入的凭据**（API token、额外的用户名/passkey）：用 `userInputSettingMeta` 声明表单项（`types/site.ts:378-382`），运行时从 `this.userConfig.inputSetting.<name>` 读取（`types/site.ts:435-438`）。范例：`definitions/milkie.ts:114-121` 声明 `token`，`definitions/milkie.ts:135` 在 `request` 里注入 `x-milkie-auth` 头；`definitions/hdbits.ts:311-314` 声明 `username`/`passkey`，`definitions/hdbits.ts:324-325` 放进 POST data。
- **跨调用复用的一次性凭据**：`storeRuntimeSettings(key, value)` / `retrieveRuntimeSettings(key)`（`schemas/AbstractBittorrentSite.ts:108-117`）把值持久化到扩展存储，避免每次搜索都重新取 token。范例：`definitions/zhuque.ts:299-324` 缓存并回读 `csrfToken`。
- **下载链接**：`getTorrentDownloadLink` 会先用 `detail.selectors.link` 补（`schemas/AbstractBittorrentSite.ts:764-770`），再追加用户的 `userConfig.downloadLinkAppendix`（772-775）。
- **下载请求**：`getTorrentDownloadRequestConfig` 把 `metadata.download.requestConfig` 合并到 `{ baseURL: this.url, url: torrentDownloadLink, method: "GET", timeout }` 之上（`schemas/AbstractBittorrentSite.ts:784-790`，字段定义见 `types/site.ts:244-258`）；`download.interval` 会被提升为批量下载间隔（`types/site.ts:252-257`）。下载要 POST 或带一次性 token 时覆写该方法（`definitions/gtnet.ts:216-251`）。
- **请求延迟**：站点级 `requestDelay` 在 `request()` 里统一等待（`schemas/AbstractBittorrentSite.ts:126`），`search.requestDelay` 与 `userInfo.process[n].requestDelay` 是叠加关系（`types/site.ts:119-124`、`339-342`）。
- **开关语义**：没有 `search` 配置时 `allowSearch` 为 false（`schemas/AbstractBittorrentSite.ts:86-88`、`index.ts:105`）；站点 `isDead` 或用户把 `isOffline` 打开后 `isOnline` 为 false，进而 `allowQueryUserInfo` 也为 false（`schemas/AbstractPrivateSite.ts:27-29`）。写 `isDead: true` 的站点只需保留身份字段即可（`definitions/baconbits.ts`、`definitions/sdbits.ts`）。

## 常被覆写的类方法

| 方法（签名见源码） | 何时覆写 | 行号 |
| --- | --- | --- |
| `protected override loggedCheck(res: AxiosResponse): boolean` | 未登录时返回 200 + JSON 错误体/登录框；默认只处理状态码、responseURL、refresh 头、matchSelectors 与响应文本 | 50-107；范例 `definitions/hdbits.ts:331-341`、`definitions/beyondhd.ts:615`、`definitions/fsm.ts:277`、`definitions/sunnypt.ts:164` |
| `public override async getUserInfoResult(lastUserInfo = {}): Promise<IUserInfo>` | 需要在默认流程之外再补请求/汇总（先用 `super` 拿基础数据再加工） | 113-215；范例 `definitions/torrentleech.ts:362-383`、`definitions/karagarga.ts:293`、`definitions/zhixing.ts:208`、`definitions/zhuque.ts:299`、`definitions/beyondhd.ts:532` |
| `protected async parseUserInfoFor{Field}(flushUserInfo, dataDocument, requestConfig)` | 某字段的取值需要单独发请求或跨行汇总。方法名按字段 PascalCase 动态派发，因此不需要注册；调用点在流程内，实际定义通常只声明第一个参数 | 动态派发 177-191；范例 `definitions/torrentleech.ts:400-430`、`definitions/zhixing.ts:175` |
| `protected override guessUserLevelId(userInfo: IUserInfo): TLevelId` | 站点等级无法用名称/条件表推出（如按用户组 id 映射） | 218-220；范例 `definitions/52pt.ts:245`、`definitions/speedapp.ts:541` |
| `public override async request<T>(axiosConfig, checkLogin = true)` | 统一注入 token / 自定义请求头，或统一改 `responseType`（基类方法） | `schemas/AbstractBittorrentSite.ts:119-167`；范例 `definitions/milkie.ts:125-139`、`definitions/hdbits.ts:318-329`、`definitions/yemapt.ts:357`、`definitions/zhuque.ts:252` |
| `public override async transformSearchPage(doc, searchConfig): Promise<ITorrent[]>` | 需要对整个列表做后处理（补分类、去重、改写字段） | `schemas/AbstractBittorrentSite.ts:502-558`；范例 `definitions/bakabt.ts:240-256`、`definitions/speedapp.ts:554` |
| `protected override parseTorrentRowFor{TorrentKey}(torrent, row, searchConfig)` | 逐字段覆盖：`Link`（拼带凭据的下载链接）、`Tags`（打标签）、`Time`（特殊时间格式）等 | 调度见 `schemas/AbstractBittorrentSite.ts:575-587`；范例 `definitions/milkie.ts:141-144`（Link）、`definitions/hdbits.ts:343-350`（Link）、`definitions/torrentleech.ts:385-397`（Tags） |
| `public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string>` | 搜索页拿不到 link、需要在详情页或接口补 | `schemas/AbstractBittorrentSite.ts:764-778`；范例 `definitions/bakabt.ts:258-262`、`definitions/pornolab.ts:264`、`definitions/yzyy.ts:354`、`definitions/speedapp.ts:605` |
| `public override async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig>` | 下载需要 POST / 特殊 header / 一次性 token | `schemas/AbstractBittorrentSite.ts:784-790`；范例 `definitions/gtnet.ts:216-251`、`definitions/yemapt.ts:398` |
| `public override async transformDetailPage(doc: Document): Promise<ITorrent>` | content-script 的详情页结构与默认推断不符 | `schemas/AbstractBittorrentSite.ts:716-755`；范例 `definitions/hdroute.ts:291`、`definitions/exttorrents.ts:217` |
| `protected override async parseWholeTorrentFromRow(torrent, row, searchConfig)` | 整行解析逻辑需要改写（不只是某个字段） | `schemas/AbstractBittorrentSite.ts:560-613`；范例 `definitions/hdroute.ts:253` |
| `protected async storeRuntimeSettings<T>(key, value)` / `retrieveRuntimeSettings<T>(key)` | 需要把一次性凭据（csrfToken 等）持久化跨调用复用 | `schemas/AbstractBittorrentSite.ts:108-117`；范例 `definitions/zhuque.ts:299-324` |
| `protected fixParsedTorrent(torrent, row, searchConfig)` | 基类预留的统一后处理钩子；**当前 definitions 中无覆写实例** | `schemas/AbstractBittorrentSite.ts:639-645` |

覆写时保持签名一致并加 `override` 关键字（`pnpm check` / `vue-tsc --noEmit` 会校验）。

## 范例定义

- `definitions/milkie.ts` — 显式 `schema: "AbstractPrivateSite"` + `default class extends PrivateSite`：用 `userInputSettingMeta` 收 token（114-121）、在 `request` 里注入请求头（125-139）、`parseTorrentRowForLink` 拼下载 key（141-144），并完整自写 `search`/`list`/`detail`。
- `definitions/ncore.ts` — 最小可用形态：不写 schema、不导出 class，只靠 `userInfo.process`（13-63）与 `levelRequirements`（65-93）走默认模板。
- `definitions/torrentleech.ts` — `getUserInfoResult` 里 `super` 之后追加两个 `parseUserInfoFor*` 步骤（362-430），并自定义 `noLoginAssert`（316-318）。
- `definitions/bakabt.ts` — `transformSearchPage` 后处理（用上一行分类补齐 stub 行）与 `getTorrentDownloadLink` 修正相对链接（239-263）。
- `definitions/bitpt.ts` / `definitions/hdbits.ts` — 同为「不写 schema 字段」的两种走向：前者不导出 class，`category`/`search`/`detail`/`userInfo`/`levelRequirements` 全部手写（73-75、114、244、264、348）；后者导出 default class，`request` 注入 api 凭据、`loggedCheck` 校验接口 status、`parseTorrentRowForLink`/`ForTags` 逐字段覆盖（317-377）。

站点已死亡时只留身份字段也是合法定义：`definitions/baconbits.ts`、`definitions/sdbits.ts`、`definitions/pornbits.ts`。

## 常见坑

1. **不写 `schema` 不等于使用本模板**：只要导出了 `default class`，无论 `schema` 写什么（甚至不写）都用那个 class（`index.ts:81-84`、93-102）。`definitions/qingwa.ts` 继承 `NexusPHP` 而完全不写 `schema`，实例行为仍由 NexusPHP 决定。
2. **`schema` 字段会影响时区缺省，但要看最终对象**：`index.ts:60` 只认字面量 `"NexusPHP"` 给 `"+0800"`，其余一律 `"+0000"`。该判断作用在 definition 导出的最终 metadata 上，而 `...SchemaMetadata` 会同时带入 `schema: "NexusPHP"`（`schemas/NexusPHP.ts:348`）与 `timezoneOffset: "+0800"`（`schemas/NexusPHP.ts:350`）——`definitions/qingwa.ts:343` 就是这种写法（文件里没有 `schema` 行，但展开后 `schema` 为 `"NexusPHP"`，时区也是 `+0800`）。只有「既不展开引擎 `SchemaMetadata`、又不写 `schema`」时才吃 `"+0000"` 缺省。
3. **忘记 `type: "private"`**：`index.ts:41-42` 的类型判断落空后会把 `schema` 补成 `"AbstractBittorrentSite"`，站点将失去个人信息的采集入口（`AbstractBittorrentSite` 没有 `getUserInfoResult`）。
4. **`version` 不要写 `-1`**：`SchemaMetadata`（若展开）给的是 `-1`，但仓库中所有本模板定义写的是大于 0 的数（多数 `1`，`definitions/gtorg.ts`/`definitions/gtru.ts`/`definitions/audionews.ts`/`definitions/speedapp.ts`/`definitions/starspace.ts` 写 `2`，`definitions/yzyy.ts` 写日期 `20260813`）。本模板定义通常根本不展开 `SchemaMetadata`。
5. **`process` 里 `fields` 写了却没给 selector 或 `parseUserInfoFor*`，字段会静默丢失**：`schemas/AbstractPrivateSite.ts:186-189` 的 `throw` 是被注释掉的，不会报错，只是数据一直为空。排查「某字段永远是空」时先看这一条。
6. **`assertion` 缺字段会中断整次采集**（160-163）：例如第二步依赖第一步的 `id`，而第一步没写 `id` 选择器，结果直接 `parseError`，后面的步骤一次都不会执行。
7. **`pickLast` 只复用上一次缓存**（126-128）：首次采集时缓存为空，不能假设 `pickLast` 的字段一定存在；依赖它们的 `assertion` 会因此抛错。
8. **步骤可能被整体跳过**（131-141）：判定用的是 `fields ∪ selectors` 的**全部**字段是否已存在。把 `id` 既写进第一步的 `selectors`、又写进 `pickLast`，第二次采集时第一步可能直接不发请求——如果依赖该请求的副作用（如刷新 token），要改用 `getUserInfoResult` 覆写。
9. **`responseType` 默认是 `document`**（144-147）：JSON 接口必须在每个步骤的 `requestConfig` 里写 `responseType: "json"`，或像 `definitions/milkie.ts:130` 那样在 `request` 中统一改。
10. **`noLoginAssert` 只在未覆写 `loggedCheck` 时生效**（`types/site.ts:263`），且不能整体禁用（265）；覆写 `loggedCheck` 时要自己处理未登录情形，否则会退化成「把登录页当作正常页面解析」。
11. **`search.selectors.rows` 缺失会直接抛错**（`schemas/AbstractBittorrentSite.ts:504-506`）：本模板不提供任何搜索默认值，新建定义时最容易漏的就是 `rows`。
12. **`userInfo.selectors` 是全局回落、优先级低于步骤选择器**（183）：把字段写在这一层可以让多个步骤共用，但要清楚它不会覆盖步骤里已有的同名选择器。
13. **`donorConfig` 在本模板无效**：只有 `schemas/NexusPHP.ts:868-870` 消费 `bonusPerHourMultiplier`，纯本模板站点写它没有引擎侧效果。
14. **`levelName` 与 `levelRequirements` 必须配套**（194-197）：只写等级表而没取到 `levelName` 时等级不会显示；匹配规则是「等级表 name 包含页面 levelName」（`utils/level.ts:302-310`），文案不一致同样匹配不上。
