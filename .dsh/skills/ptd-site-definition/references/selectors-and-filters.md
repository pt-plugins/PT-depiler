# 选择器、filters 与搜索配置

写站点定义时绝大多数工作都落在这一层。权威源码：`types/search.ts`（类型与语义注释）、`utils/filter.ts`（可用 filters）、`schemas/AbstractBittorrentSite.ts`（实际解释逻辑）。

## IElementQuery：单字段如何取值

一个字段就是一个 `IElementQuery` 对象（`types/search.ts:250-293`）。解释逻辑全在 `AbstractBittorrentSite.getFieldData`（`schemas/AbstractBittorrentSite.ts:366-444`），核心事实是：**`elementProcess` / `case` / `data` / `attr` / 文本 这五种取值方式是互斥的**（源码是 `else if` 链，383-399），命中一种就不再往下走；而 `selector` 数组是"多候选"（依次尝试）。

### 取值流程

```text
selector 数组依次尝试 ──► 命中元素（":self" = 当前元素 / JSON 根）
      │
      ├─ elementProcess 存在 → 它的返回值（返回 undefined 视为未命中，继续下一个 selector）
      ├─ case 存在          → 元素自身匹配到的第一个 CSS 选择器所对应的值
      ├─ data 存在          → element.dataset[data]        （即 data-* 属性）
      ├─ attr 存在          → element.getAttribute(attr)
      └─ 都没有             → innerText ?? textContent（换行替换为空格）

      ├─ 有 selector 命中：字符串 trim() → 应用 switchFilters[命中的 selector]，否则 filters
      └─ 全部未命中：直接使用 text 回落值（**不经过 filters**）

      └─ 最后归一化：整体匹配 /^-?\d+$/ 的字符串 → number；NaN → 0
```

### 什么时候用哪一种

| 方式 | 适用场景 | 取到的值 | 注意 |
| --- | --- | --- | --- |
| `elementProcess(el)` | 一个字段需要**组合多个来源、清洗或条件判断**：标题优先取 `title` 属性再回落到文本；状态要同时看 class 与进度 | 函数返回值，类型不限（string / number / 枚举） | 返回 `undefined` 会被当作"该选择器未命中"，继续尝试数组里的下一个；返回 `null` 会走到 `text` 回落 |
| `case: { … }` | 字段值是**固定枚举**，由元素自身特征决定（class、属性），不需要处理文本 | `case` 里第一个命中键对应的值（类型自由，字符串仍会在末尾被 `trim()`） | 键是 CSS 选择器，用 `Sizzle.matchesSelector` 匹配**选中的那个元素自身**（不是它的子元素）。值建议直接写 `ETorrentStatus.*` |
| `data: "cat"` | 值挂在 `data-*` 上（现代前端最常见） | `element.dataset.cat`，即 `data-cat="…"` | 属性名转驼峰：`data-category-id` → `data: "categoryId"` |
| `attr: "href"` | 值在普通属性上：`href`、`title`、`style`、`id` | `getAttribute()` 的字符串 | 名为 `url` / `link` 的字段，相对链接会被基类自动补全（`schemas/AbstractBittorrentSite.ts:592-593`）；其它字段不会。**不要在 filters 里调用 `fixLink`**（315-320 的 `@warning`） |
| 都不写 | 值就是元素文本 | `innerText ?? textContent`，换行→空格，随后 `trim()` | 取的是**整个子树**的文本：`<a title="X"><b>X</b><span>中字</span></a>` 会得到 `"X 中字"`。要把这类混入的元素剔除，正是用 `elementProcess` 的典型场景（`schemas/NexusPHP.ts:386-390` 的 `subTitleRemoveExtraElement`） |

除此之外还有两个"结构级"字段：

- `selector`：`string` 时是 CSS 选择器；`string[]` 时**依次尝试**，第一个取到非 `undefined` 的生效（`AbstractBittorrentSite.ts:372-411`）。写多个候选是为了兼容站点改版，例如 NexusPHP 的标题选择器列了 4 个（`schemas/NexusPHP.ts:77-84`）。
- `filters`：在取值**之后**统一处理（413-426）。`switchFilters` 按"最终命中的那个 selector"选 filters，优先级高于 `filters`；`selector` 是数组时常用它区分结构不同的行（例如 Gazelle 的 `subTitle`，`schemas/Gazelle.ts:231-239`）。
- `text`：所有 selector 都没命中时的回落值；约定 `"N/A"` 表示源站不提供该信息（`types/search.ts:254-256`）。

### HTML 示例

下面是一段 NexusPHP 风格的种子行（**示意结构**，各选择器取自本仓库的真实配置），上下文就是 `search.selectors.rows` 选出的这一个 `<tr>`：

```html
<table class="torrents">
  <tbody>
    <tr id="12345" data-cat="Movies">
      <td class="rowfollow">
        <a href="details.php?id=12345&hit=1" title="Some.Movie.2024.1080p"><b>Some.Movie.2024.1080p</b><span class="optiontag">中字</span></a>
      </td>
      <td class="rowfollow"><a href="download.php?id=12345&passkey=abc"><img alt="download"></a></td>
      <td class="rowfollow"><div class="progressseeding" style="width:100%"></div></td>
      <td class="rowfollow">4.37 GB</td>
    </tr>
  </tbody>
</table>
```

同一行上五种取法的写法与结果：

```ts
selectors: {
  // attr + filters：链接在 href 上，再从中抽出 id
  id: {
    selector: 'a[href*="download.php?id="]',            // NexusPHP.ts:86-89
    attr: "href",                                       // → "download.php?id=12345&passkey=abc"
    filters: [{ name: "querystring", args: ["id"] }],   // → "12345"
  },

  // elementProcess：title 属性比 innerText 干净，且要防止取到空值
  title: {
    selector: ["a[href^='details.php?id='][title]"],    // NexusPHP.ts:77-84
    elementProcess: (el) => (el.getAttribute("title") || el.textContent || "").trim(),
    // → "Some.Movie.2024.1080p"
    // 若只取文本（不写 elementProcess），会得到 "Some.Movie.2024.1080p 中字"
  },

  // case：状态由元素自身的 class 决定，不需要读文本
  status: {
    text: ETorrentStatus.unknown,
    selector: ['div[class^="progress"]'],
    case: {
      ".progressseeding": ETorrentStatus.seeding,       // → ETorrentStatus.seeding
      ".progressdownloading": ETorrentStatus.downloading,
      ".progressfinished": ETorrentStatus.completed,
    },
  },                                                     // 写法参考 definitions/hdsky.ts:311-320

  // 默认文本：取第 4 个 td 的文本
  size: { selector: "> td:nth-child(4)", filters: [{ name: "parseSize" }] }, // "4.37 GB" → 对应字节数

  // data：读当前元素（:self）的 data-cat
  category: { selector: ":self", data: "cat" },          // → "Movies"（写法参考 definitions/animebytes.ts:267）
}
```

几个容易错的点：

- `:self` 表示"当前上下文元素本身"。在 `rows` 里就是这一行；在 `userInfo` 步骤里是该步骤的响应文档；在 `detail` 里是整个 `Document`（因此在 `detail.selectors` 里写 `:self` 通常没有意义，会拿到整页文本）；在 JSON 里是当前对象/根（见下节）。
- `case` 的键匹配的是**选中元素自身**：`selector: 'div[class^="progress"]'` 配 `case: { ".progressseeding": … }` 能命中；写成 `.progressseeding span` 就永远不命中。
- 文本取值会把换行变成空格（397-399），所以 `<td>` 里的多行内容不会带 `\n`。
- 字符串会 `trim()`，且**整体匹配 `/^-?\d+$/` 时被转成 number**（433-441）：`0012` → `12`。需要保留前导零时用 `text` 或自定义 filter 兜住。这一步在**所有**取值方式之后执行，`case`/`data`/`attr` 取到的字符串同样会被 trim。
- `text` 回落值**不经过 filters**（filters 只在"有 selector 命中"时应用，413-426），所以别指望用 filter 处理回落值。

### HTML 下 `rows.merge`：一个种子占多行时

有些站（尤其公开 BT 站）把**一个种子的信息拆在连续的多行 `<tr>` 里**：第一行放标题与下载链接，第二行放评论数、发布日期、体积、发布者。如果直接按行解析，每个 `<tr>` 都会被当成一个独立种子，结果是同一个种子出现两条残缺记录。

`rows.merge: N` 就是为这种情况准备的：**把选中的行按位置每 N 行合并成"一行"**，再交给行解析。

源码行为（`schemas/AbstractBittorrentSite.ts:514-536`）：

```ts
// 只在 Document 响应、且没有 rows.filter 时走到这里
const rowMergeDeep = rowsSelector.merge || 1;        // 默认 1，即不合并
if (trs.length > 0 && rowMergeDeep > 1) {
  const newTrs: Element[] = [];
  chunk(trs, rowMergeDeep).forEach((chunkTr) => {    // 按位置切组
    const wrapperDiv = doc.createElement("div");     // 每组包进一个新建的 <div>
    chunkTr.forEach((tr) => wrapperDiv.appendChild(tr));
    newTrs.push(wrapperDiv);
  });
  trs = newTrs;
}
```

三个前置条件（缺一不生效）：

1. **只在 HTML（Document）响应下生效**：JSON 分支没有这段逻辑（537-541），`merge` 对接口站无意义。
2. **只在没有定义 `rows.filter` 时生效**：`filter` 优先，写了 `filter` 就直接走它，`merge` 被完全忽略（515-517 与 522-535 是 if/else 的两支）。
3. **值必须大于 1**：不写或写 `1` 等于不合并（522）。

合并之后，行内子选择器的上下文变成了那个包装 `<div>`，于是有两种写法：

- **不区分行**：直接写 `td.desc-bot` 这类选择器，Sizzle 会在整组里取第一个匹配的元素。真实用例 `definitions/tokyotosho.ts:60`（`rows: { selector: "table.listing tr.category_0", merge: 2 }`，其余子选择器仍是不带前缀的 `td.desc-top` / `td.desc-bot` / `td.stats`）。
- **区分第几行**：`tr:nth-child(1) xxx` / `tr:nth-child(2) xxx`——源码注释里明确推荐这种写法（518-521），组内出现同名 class 时用它精确定位。

HTML 示例（两行一个种子）：

```html
<table class="listing">
  <tbody>
    <tr class="category_0"><!-- 第 1 行 -->
      <td class="desc-top"><a href="details.php?id=1" type="application/x-bittorrent">Some Thing</a></td>
    </tr>
    <tr class="category_0"><!-- 第 2 行 -->
      <td class="desc-bot">Comment: 不错 | Date: 2025-01-02 03:04 UTC | Size: 1.2 GB | Submitter: alice</td>
    </tr>
  </tbody>
</table>
```

```ts
selectors: {
  rows: { selector: "table.listing tr.category_0", merge: 2 }, // 每 2 行合并为一行
  title: { selector: "td.desc-top a" },                        // 自动落在第 1 行
  size: {
    selector: "tr:nth-child(2) td.desc-bot",                   // 明确取第 2 行
    filters: [{ name: "parseSize" }],
  },
}
```

注意事项：

- 分组是**纯位置配对**，不会校验这 N 行是否真的属于同一种子。因此 `rows.selector` 必须选到每个种子的**全部行**（而不是只选每个种子的第一行），否则会把不同种子的行配成一组；若选出的行数又不是 N 的整数倍，最后一组是残缺组（`chunk` 保留余数），该行通常只能解析出部分字段甚至空值。行与行之间存在更强的对应关系（行号、隐藏字段、成对标记等）时，用 `rows.filter` 自行分组更可靠，也更易读。
- `appendChild` 是**移动**而不是复制，原本的表格结构会被改动。搜索场景下 `doc` 来自请求响应或文档副本，没有副作用；列表页场景调用方传的也是副本（`entries/content-script/app/pages/SiteListPage.vue:27` 用 `document.cloneNode(true)`），不会影响用户正在看的页面。
- 列表页同样支持：`list[].selectors.rows` 最终走的是同一个 `transformSearchPage`（`schemas/AbstractBittorrentSite.ts:651-706`）。
- `merge` 与 `filter` 都只能二选一，且都只作用于 `rows`；`types/search.ts:116-126` 的注释里也是这样约定的。

### 响应是 JSON 时怎么处理

当请求配置里写了 `responseType: "json"`（`search.requestConfig`、`detail.requestConfig`、`userInfo.process[n].requestConfig` 任一处），传入 `getFieldData` 的就是普通对象/数组而不是 `Document`，走的是另一条分支（`AbstractBittorrentSite.ts:401-403`）：

```ts
// JSON 分支的实际逻辑
query = usedSelector === ":self" ? element : get(element, usedSelector);
```

规则：

1. **`selector` 变成取值路径**，用 `es-toolkit/compat` 的 `get` 解析，支持点号与下标：`response.userstats.uploaded`、`data.0.attributes.name`。
2. **`elementProcess` / `case` / `data` / `attr` 全部失效**（它们在 `element instanceof Node` 分支里），写了不会被调用——JSON 站点不要写这些字段。
3. **`filters` / `switchFilters` 仍然生效**（414-426 在分支之外），`parseTime`、`parseSize`、`parseNumber` 等照常用。
4. **`:self` = 当前对象本身**：在 `rows` 里表示"响应根"，在行内表示"这一行的对象"。
5. 路径取不到 → `undefined` → 继续尝试 `selector` 数组里的下一个；全部未命中 → 回落 `text ?? ""`（同样不经过 filters）。
6. 取值后的归一化与 HTML 分支完全一致（字符串 trim、纯整数转 number、NaN → 0）。

示例（GazelleJSONAPI 的真实选择器，`schemas/GazelleJSONAPI.ts:239-296`）——响应：

```json
{
  "status": "success",
  "response": {
    "id": 9527,
    "username": "alice",
    "notifications": { "messages": 3 },
    "userstats": { "uploaded": 123456789, "ratio": 1.5, "class": "Power User" },
    "stats": { "joinedDate": "2021-01-01 12:00:00" }
  }
}
```

配置：

```ts
userInfo: {
  selectors: {
    id: { selector: ["response.id"] },                       // → 9527
    name: { selector: ["response.username"] },               // → "alice"
    messageCount: { selector: ["response.notifications.messages"] }, // → 3
    uploaded: { selector: ["response.userstats.uploaded"] }, // → 123456789
    levelName: { selector: ["response.userstats.class"] },   // → "Power User"
    joinTime: {
      selector: ["response.stats.joinedDate"],
      filters: [{ name: "parseTime" }],                      // → 毫秒时间戳
    },
  },
}
```

**JSON 下的 `rows`**：`search.selectors.rows.selector` 同样按路径解析（`AbstractBittorrentSite.ts:478-494`、512），所以：

```ts
search: {
  requestConfig: { url: "/api/v1/torrents", responseType: "json" },
  selectors: {
    rows: { selector: ":self" },   // 响应本身就是 [{...}, {...}] 时用 ":self"
    id: { selector: "id" },
    title: { selector: "name" },
    link: { selector: "downloadUrl" },
  },
}
```

- 响应被包了一层（如 `{ "torrents": [ … ] }`）时，`:self` 会选到那个**对象**而不是数组：对象没有 `length`，随后的 `for…of` 会抛错，整次搜索以 `parseError` 结束。此时必须改成 `rows: { selector: "torrents" }`（Rartracker 的文档里专门记了这条：`references/engines/rartracker.md` 的常见坑 3）。
- 行内字段用**相对路径**（`id`、`name`、`attributes.name`），不是 CSS 选择器。
- `rows.filter` 在 JSON 下同样生效（538-540）；`rows.merge` 只在 Document 响应里实现，JSON 站点写了也不会被处理——多行合并的完整语义见上文「HTML 下 `rows.merge`」。

两个高频故障：

- **忘记 `responseType: "json"`**：`doc` 是字符串，所有 `get()` 都取不到值，字段全空且不报错。接口站排查时先确认这一项。
- **照抄 HTML 选择器**：`selector: "a.title"` 在 JSON 下会被当成"取对象的 `a.title` 属性路径"，结果是 `undefined`。

## 可用 filters

`utils/filter.ts:20-205` 定义，`runQueryFilters` 支持 `{ name, args }` 对象形式与直接函数（`AbstractBittorrentSite.ts:446-460`）：

| filter | args | 作用 |
| --- | --- | --- |
| `querystring` | `["id"]` 可多个 | 从 URL 取查询参数，返回第一个命中的值 |
| `prepend` / `append` | `["xxx"]` | 前置/后置拼接 |
| `replace` | `["pattern", "replacement"]` | 字符串或正则替换 |
| `split` | `[",", 1]` | 按分隔符切分取第 n 段 |
| `trim` / `toLower` / `toUpper` | | 常规字符串处理 |
| `parseNumber` | | 从含杂字符的文本中抽数字 |
| `parseSize` | | 抽取体积并转为 Byte 数 |
| `parseTime` | `["yyyy-MM-dd HH:mm:ss"]` | 按指定格式解析时间戳（毫秒） |
| `parseTTL` | | 解析 `1天2小时前` / `2 months ago` 类相对时间 |
| `parseDuration` | | 解析为秒数 |
| `parseFuzzyTime` | 可选格式 | 先按格式解析，失败再按 TTL 解析 |
| `extImdbId` / `extDoubanId` / `extAnidbId` / `extBangumiId` / `extTvmazeId` | | 抽取外部资源 id，写入 `ext_*` 字段 |
| `dump` | | 打印当前值并原样返回，仅用于调试 |

自定义处理直接写函数即可（`filters: [(v) => ...]`）。时间字段建议优先用 `parseFuzzyTime`，站点改版时更稳。

## 种子字段

`selectors` 的键对应 `ITorrent` 字段（`types/torrent.ts:19-53`），常用：`id`、`title`、`subTitle`、`url`（详情页）、`link`（**下载链接**）、`time`、`size`、`seeders`、`leechers`、`completed`、`comments`、`category`、`progress`、`status`、`tags`。

最容易写反的一对：`url` 是详情页链接，`link` 是种子下载链接（`types/torrent.ts:26-34`）。解析时若 `link` 缺失，插件会走 `getTorrentDownloadLink` 补全（见下）。

`tags` 的写法是数组，每项 `{ name, selector, color? }`（`types/search.ts:133-141`）；name 命中 `utils/tags.ts:13-55` 的预定义名或其 aka（不区分大小写）时，会被替换成统一的 name 与颜色，`color` 取 Vuetify 调色板名。

## search 配置

```ts
search: {
  requestConfig: { url: "/torrents.php", params: { ... } },
  keywordPath: "params.search",     // 缺省 params.keywords（AbstractBittorrentSite.ts:267）
  advanceKeywordParams: { imdb: { requestConfig: { url: "/torrents.php", params: { imdb: "tt" } } } },
  selectors: {
    rows: { selector: "table.torrents > tbody > tr", merge: 2 },
    title: { selector: "a.torrent-name" },
    link: { selector: "a[href*='download']", attr: "href" },
  },
}
```

- 请求配置的生成顺序见 `types/search.ts:20-44` 的注释：默认垫片（`AbstractBittorrentSite.ts:120-123` 补 `baseURL`/`url`/`timeout`）→ `searchEntry` 合并 → `search.requestConfig` → 高级搜索词 → 关键词 → `requestConfigTransformer`。中间每一步都会**覆盖**前面同名字段。
- `rows.filter` 可对取到的行集合做自定义处理；`rows.merge` 用于"多行表示一个种子"的情况，仅在 Document 响应下生效（`types/search.ts:116-126`，`AbstractBittorrentSite.ts:502-543`）。
- 高级搜索词形如 `imdb|tt17097088`。`imdb` 未声明时视为启用，其他类型默认禁用（`types/search.ts:102-113`）。
- `skipNonLatinCharacters`：站点只支持拉丁字符查询时置 `true`；`skipWhiteSpacePlaceholder`：跳过纯空白查询（`types/search.ts:60-88`）。
- POST 请求如需表单编码，记得显式设置 `Content-Type`（`types/search.ts:37-42`）。

## category（搜索分类）

```ts
category: [{
  name: "类别",
  key: "cat",
  options: [{ value: 401, name: "Movies/电影" }],
  cross: { mode: "append" },      // 允许多选时的拼装方式
}]
```

`cross.mode` 的语义表见 `types/search.ts:222-241`：`brackets` → `cat[]=v1&cat[]=v2`、`comma` → `cat=v1,v2`、`append` → `cat4010=1&cat4011=1`、`appendQuote` → `cat[4010]=1&cat[4011]=1`；`cross.key` 可覆盖外层 key。特殊 key `#url` 会直接替换请求 url。

`utils/helper.ts:17-61` 提供 `buildCategoryOptionsFromList` / `buildCategoryOptionsFromDict` 生成 options，避免手写长列表。

## searchEntry（多搜索入口）

`searchEntry` 是 `Record<id, ISearchEntryRequestConfig>`，用于"站点有多个搜索入口且结果不同"或"单次搜索多页"（`types/site.ts:139-144`）。合并规则见 `AbstractBittorrentSite.ts:191-198`：先按 `id` 合并 `metadata.searchEntry[id]`，再（若 `merge !== false`）与 `metadata.search` 合并；`enabled: false` 的入口会被跳过（`AbstractBittorrentSite.ts:201`）。

## list（种子列表页）与 detail（详情页）

- `list[].urlPattern` 不写时会由 `search.requestConfig.url` 与各 `searchEntry[*].requestConfig.url` 自动生成；`excludeUrlPattern` 用于排除被误判为列表页的详情页（`types/site.ts:155-200`）。
- `list[].selectors` 缺省以 `search.selectors` 为垫片；对 API 型站点要显式写 `mergeSearchSelectors: false`（`types/site.ts:179-183`）。
- `list[].selectors.keywords` 用于回填页面上的搜索词；未设置时会按 `keywordPath` 推断（`params.x` → `input[name="x"]`，`data.x` → `form[method="post" i] input[name="x"]`），再退化为从 URL 的 `search`/`keywords`/`keyword`/`q` 参数中读取（`types/site.ts:191-197`，`AbstractBittorrentSite.ts:687-695`）。
- `detail.urlPattern` **必须显式声明**（schema 通常已给）。解析时基类有兜底：未定义 `url` → 取 `doc.URL`；未定义 `id` → 从 URL 的 `tid`/`id` 参数推断，再退化为整个 url；未定义 `title` → `html > body > title`（`AbstractBittorrentSite.ts:716-748`）。

## 下载链接

`getTorrentDownloadLink`（`AbstractBittorrentSite.ts:764-778`）的逻辑：搜索页已解析出 `link` 就直接用；否则若配置了 `detail.selectors.link`，会请求 `detail.requestConfig`（默认 `{ responseType: "document", url: torrent.url }`）后从详情页取 `link`；最后追加用户配置的 `downloadLinkAppendix`。需要更复杂的下载逻辑（如动态 token、限时签名）时才覆写该方法或其 `getTorrentDownloadRequestConfig`（`AbstractBittorrentSite.ts:784-790`，示例见 `definitions/hdsky.ts:337-370`）。

## userInfo 的取字段流程

`AbstractPrivateSite.getUserInfoResult`（`AbstractPrivateSite.ts:113-215`）按 `process` 顺序执行，每一步：

1. 该步字段 = `fields ∪ keys(selectors)`；若这些字段在已有结果中**全部存在**则跳过该步（`AbstractPrivateSite.ts:133-141`）。
2. 处理 `assertion`：url 中替换 `$字段$`，其余路径 `set` 进请求配置；字段缺失直接抛错（`AbstractPrivateSite.ts:148-165`）。
3. 跑 `requestConfigTransformer`，等待 `requestDelay`，发请求（`AbstractPrivateSite.ts:168-175`）。
4. 逐字段解析：若子类存在 `parseUserInfoFor<字段名>`（PascalCase）方法则调用它，否则用该步 `selectors[字段]`，再回落到 `userInfo.selectors[字段]`（`AbstractPrivateSite.ts:177-191`）。**这就是定义文件里既能写选择器、也能写 `public parseUserInfoForXxx()` 的原因。**

`levelName` 拿到但 `levelId` 缺失时，会用 `levelRequirements` 推断（`AbstractPrivateSite.ts:194-197`，`utils/level.ts:300`）。

## 调试用法

- `filters: [{ name: "dump" }]`：把中间值打到控制台。
- `requestConfigTransformer: (config) => { console.log(config); return config; }`：打印最终请求配置（`types/search.ts:51-58`）。
- 运行时 `getSearchResult` 会打印站点名与关键词（`AbstractBittorrentSite.ts:175`）。
