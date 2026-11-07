# 调试与常见故障

## 状态码先看这个

搜索结果是 `ISearchResult`（`types/search.ts:295-304`），`status` 取值见 `types/base.ts:29-39`。基类的映射逻辑在 `AbstractBittorrentSite.ts:294-311`：

| 现象 | 来源 |
| --- | --- |
| 正常运行 | `success` |
| 站点被禁用/跳过 | `passParse` |
| 列表选择器未定义 | 抛 `列表选择器未定义` → `parseError`（`AbstractBittorrentSite.ts:504-506`） |
| 选择器没命中任何行 | `NoTorrentsError` → `noResults`（`AbstractBittorrentSite.ts:543-546`） |
| 响应被 Cloudflare 拦 | `CFBlockedError` → `CFBlocked`（`AbstractBittorrentSite.ts:152-154`） |
| 判定为未登录 | `NeedLoginError` → `needLogin`（`AbstractBittorrentSite.ts:156-159`） |
| 其他（4xx/5xx、单行解析抛错） | `parseError`（`AbstractBittorrentSite.ts:161-164, 548-555`） |

`statusMsg` 以 `i18n.` 开头时会被前端按对应 i18n key 展示（`types/search.ts:297-302`）。

注意：**单行解析抛错会中断整次搜索**（`AbstractBittorrentSite.ts:551-554` 会 `console.error` 后继续抛），所以"搜到一半全空"通常是某一行里某个 selector 或 filter 抛异常。

## 四步定位法

1. **请求对不对**：看控制台里 `[Site] <name> start search with requestConfig:`（`AbstractBittorrentSite.ts:291`）。没有这条说明在入口就被跳过了（`allowSearch` 为假、`enabled: false`、或关键词被 `skipNonLatinCharacters`/`skipWhiteSpacePlaceholder` 拦掉，见 `AbstractBittorrentSite.ts:182-218`）。
2. **响应形态对不对**：HTML 站点必须让 `responseType` 为 `document`（缺省垫片就是 document）；JSON API 站点必须在 `requestConfig` 里显式写 `responseType: "json"`，否则 `doc` 是字符串，所有 `get()` 路径都会取空。
3. **行选择器命中没有**：`rows.selector` 为空 → `noResults`。先在浏览器 Console 里用与 Sizzle 相同的语法手动验证选择器，再看是否需要 `rows.merge`（一个种子跨多行）或 `rows.filter`。
4. **单行字段对不对**：逐字段核对，重点看 `title`/`size`/`time`/`seeders`/`link`。可临时加 `filters: [{ name: "dump" }]` 把中间值打出来（`utils/filter.ts:196-204`）。

## 高频坑

- **`url` 与 `link` 写反**：`url` 是详情页，`link` 是种子下载链接（`types/torrent.ts:26-34`）。写反的表现是"能搜到但下载失败"或"详情页打开的是种子文件"。
- **数字被自动转换**：取到的字符串若整体匹配 `/^-?\d+$/` 会被转成 number（`AbstractBittorrentSite.ts:433-441`），`0012` 会变成 `12`。
- **取不到值时静默变空串**：query 为 `undefined` 时回落到 `elementQuery.text ?? ""`（`AbstractBittorrentSite.ts:429-430`），所以选择器写错不一定报错，只是字段为空。不要用"字段为空"判断"站点不支持该字段"，要看源码里的 `text: "N/A"` 约定（`types/search.ts:254-256`）。
- **`:self` 只对"当前元素"生效**：在 HTML 上下文里它跳过 Sizzle 直接取当前元素；在 JSON 上下文里它是顶层对象（`AbstractBittorrentSite.ts:380, 402`）。写 `":self"` 时后面的 `attr`/`data`/`case` 才有意义。
- **JSON 站点误用 CSS 选择器**：非 Document 上下文下 `selector` 走 `es-toolkit/compat` 的 `get` 路径（`AbstractBittorrentSite.ts:401-403`），例如 `data.0.attributes.name`。
- **时间差一小时/时区错位**：检查 `timezoneOffset`；不写时 NexusPHP 站点按 `+0800`、其余 `+0000`（`index.ts:60`）。
- **私有没有登录态**：插件请求带的是浏览器 cookie；如果站点需要额外的 API key，用 `userInputSettingMeta` + `userConfig.inputSetting` 表达（`types/site.ts:378-382`）。
- **相对链接漏了 `fixLink`**：直接给 `url`/`link` 赋相对路径时，基类会自动补全（`AbstractBittorrentSite.ts:321-338, 750-752`）；但 `@warning`（`AbstractBittorrentSite.ts:315-320`）指出**不要在 `filters` 里调用 `fixLink`**。
- **列表页与详情页被互相误判**：`list[].urlPattern` 自动生成后可能把详情页也匹配进来，用 `excludeUrlPattern` 排除（`types/site.ts:170-177`）。

## 常用调试手段

```ts
// 1. 打印最终请求配置
search: {
  requestConfig: { url: "/torrents.php" },
  requestConfigTransformer: (config) => { console.log(config); return config; },
}

// 2. 打印某个字段的中间值
title: { selector: "a.title", filters: [{ name: "dump" }] }
```

- 开发模式下解析异常会额外 `console.error`（`AbstractBittorrentSite.ts:299-301`、`AbstractPrivateSite.ts:201-203`）。
- 搜索入口本身会打印站点名与关键词（`AbstractBittorrentSite.ts:175`）。
- 站点定义里需要长期保留的日志按仓库习惯写成 ``console.debug(`[PTD] site '${this.name}' ...`)``（例如 `definitions/audiobookbay.ts:202`）。

## 覆写类方法时的自检

- 覆写必须带 `override` 关键字（`tsconfig.json` 开了 `noImplicitOverride`），`pnpm check` 会检查。
- 覆写解析方法时，**先调用 super 再改**通常更安全（例如 `definitions/hdsky.ts:372-394` 先 `super.parseTorrentRowForTags(...)`）。
- 覆写 `getTorrentDownloadLink` 时记得处理"链接已存在但可能过期"的情况，并在无法取得时回落到 `super`（`definitions/hdsky.ts:337-370`）。
- 覆写 `guessUserLevelId` / `getUserInfoResult` 时注意它们与 `levelRequirements` 的既有约定（`AbstractPrivateSite.ts:194-220`）。
