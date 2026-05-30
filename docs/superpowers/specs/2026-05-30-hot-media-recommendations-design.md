# 搜索栏热门影视推荐设计

## 背景

当前搜索入口在 `src/entries/options/views/Layout/Topbar.vue`，由 topbar 内的 `v-combobox` 接收关键词，并通过 `startSearchEntity()` 路由到 `SearchEntity` 页面触发现有搜索队列。

用户希望在插件搜索栏中增加热门推荐，推荐“最新最火”的影视，范围包含电影、剧集、动画。用户明确选择：

- 不接入 TMDB 等新外部推荐 API；
- 复用现有 Douban / IMDb / Bangumi 相关能力；
- 在搜索框旁使用独立热门按钮；
- 点击推荐项后直接触发搜索。

## 目标

在 topbar 搜索框右侧新增热门推荐菜单，用户点击推荐项后直接按当前搜索方案发起搜索。

推荐来源第一版使用项目已有的社交站点页面解析能力：

- 电影：Douban `https://movie.douban.com/chart`
- 剧集：Douban `https://movie.douban.com/tv`
- 动画：Bangumi `https://bgm.tv/anime/browser`

IMDb 当前已有能力主要是按 IMDb ID 拉取详情，不提供热榜页面解析入口，因此第一版不把 IMDb 作为热榜来源。

## 非目标

- 不新增 TMDB / Trakt / IMDb 官方 API key 配置。
- 不做个性化推荐。
- 不改现有搜索方案、搜索队列、站点搜索解析逻辑。
- 不把推荐项混入搜索框输入历史或普通候选项。

## UI 设计

在 `Topbar.vue` 搜索框 `append` 区域内，现有搜索按钮旁新增一个 `mdi-fire` 图标按钮。

点击按钮打开 `v-menu`，菜单内容分为三组：

- 电影
- 剧集
- 动画

每个推荐项展示主标题和来源标记，例如 `Douban` 或 `Bangumi`。菜单提供加载态、空态、失败态和刷新按钮。

点击推荐项后：

1. 将 `searchKey` 设置为该推荐项标题；
2. 调用现有 `startSearchEntity()`；
3. 路由 query 保持现有结构：`{ search, plan, flush: 1 }`；
4. 搜索方案使用用户当前选中的 `searchPlanKey`。

## 数据模型

新增轻量推荐项类型：

```ts
interface ISocialRecommendationItem {
  id: string;
  site: "douban" | "bangumi";
  category: "movie" | "tv" | "anime";
  title: string;
  titles: string[];
  sourceUrl: string;
}
```

`title` 使用 `titles[0]`，用于直接搜索。`titles` 保留解析出的别名，为后续扩展提供空间，但第一版不做多标题搜索。

## 数据流

新增 offscreen message，例如 `getSocialRecommendations`：

1. options topbar 打开热门菜单时调用 `sendMessage("getSocialRecommendations")`；
2. offscreen helper 检查缓存；
3. 缓存命中则返回；
4. 缓存未命中时分别请求 Douban / Bangumi 页面；
5. 使用现有 `socialPageParserMatchesMap` 中对应 parser 解析条目；
6. 归一化为 `ISocialRecommendationItem[]`；
7. 返回给 topbar 菜单渲染。

解析能力来自现有 `src/packages/social/entity/douban.ts` 和 `src/packages/social/entity/bangumi.ts`：

- Douban 已支持 `movie.douban.com/chart`、`movie.douban.com/explore`、`movie.douban.com/tv`；
- Bangumi 已支持 `bgm.tv/anime/browser`。

## 缓存策略

推荐列表缓存 6 小时。原因：

- 榜单不需要每次打开菜单都实时刷新；
- Douban / Bangumi 页面请求受网络和站点策略影响；
- 插件 topbar 是高频 UI，不应因为推荐功能增加稳定性风险。

缓存放在 offscreen 层内存即可。浏览器或插件重启后重新拉取，不新增持久化 schema。

## 错误处理

- 单个来源失败不影响其他来源展示；
- 全部来源失败时，菜单显示失败提示和刷新按钮；
- 推荐加载失败不影响用户手动搜索；
- 点击刷新按钮跳过当前缓存重新拉取。

## 测试计划

- TypeScript 检查：`pnpm run check`。
- 构建检查：`pnpm run build:dist`。
- 手动验证：
  - 打开 options 页面；
  - 点击热门按钮；
  - 能看到电影、剧集、动画分组或明确失败态；
  - 点击推荐项后进入 `SearchEntity`，query 中 `search` 为标题，`plan` 为当前搜索方案；
  - 普通输入搜索仍按原行为工作。

## 决策记录

选择独立热门按钮，而不是把推荐项直接混入 combobox items。原因是推荐是显式动作入口，和用户手动输入/搜索历史语义不同。

选择点击后直接触发搜索。原因是用户明确要求推荐项承担“一键搜索”行为，因此实现必须复用 `startSearchEntity()`，不能只填充输入框。
