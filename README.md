<p align="center">
  <img alt="Logo" width="100" src="./public/icons/logo/128.png?raw=true">
</p>

<p align="center">
    <a href="../../releases?include_prereleases/latest" title="GitHub Releases"><img src="https://img.shields.io/github/v/release/pt-plugins/PT-depiler.svg?include_prereleases"></a>
    <a href="../../releases" title="GitHub Download"><img src="https://img.shields.io/github/downloads/pt-plugins/PT-depiler/total.svg?label=Downloads"></a>
    <img src="https://img.shields.io/badge/Used-TypeScript%20Vue-blue.svg">
    <a href="./LICENSE" title="GitHub license"><img src="https://img.shields.io/github/license/pt-plugins/PT-depiler.svg?label=License" alt="GitHub license"/></a>
    <a href="https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw"><img src="https://img.shields.io/badge/Telegram-Chat-blue.svg?logo=telegram" alt="Telegram"/></a>
    <a href="https://deepwiki.com/pt-plugins/PT-depiler"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"/></a>
</p>

# YzYY 站点适配 PT-Depiler 技术文档

> 本文档描述 YzYY 站点在 PT-Depiler 中的适配实现，所有内容基于**外部可观察的行为**
> （浏览器访问页面、DOM 结构、HTTP 请求/响应），不依赖 YzYY 站方源码。
> 供 PT-Depiler 使用者 / 贡献者 / 二次开发者参考。

## 一、适配文件

- `src/packages/site/definitions/yzyy.ts`：YzYY 站点适配定义
- 已合入官方主仓库：https://github.com/pt-plugins/PT-depiler
- 使用方式：扩展加载后，在「站点设置」添加 YzYY 即可（若未内置则重新构建）

## 二、站点概况

| 项 | 值 | 说明 |
|----|-----|------|
| 主域名 | https://www.yzyy.org/ | ROT13：`uggcf://jjj.lmll.bet/` |
| 备用域名 | https://bbs.yzyy.asia/ | ROT13：`uggcf://oof.lmll.nfvn/`；两个域名都放 `urls` |
| 架构 | Discuz X3.5 论坛 + 自定义种子聚合模块 | 非标准 NexusPHP（无 details.php?id=） |
| 种子列表页 | `https://www.yzyy.org/torrents.php` | 服务端渲染完整 HTML；`?ajax=1` 返回 JSON |
| 种子详情页 | `https://www.yzyy.org/forum.php?mod=viewthread&tid={tid}` | Discuz 帖子页 |
| 种子 ID | **info_hash**（40 位 hex） | **不是 tid**；tid 只用于帖子 URL |
| 登录 | 标准 Discuz 登录（`member.php?mod=logging`） | PT-Depiler 需带 cookie |

**种子 ID 与 URL 的关系**：
- 列表页每行种子有**两个关键链接**：
  - 详情链接：`forum.php?mod=viewthread&tid={tid}` → 种子的 `url`
  - 下载链接：`plugin.php?id=dz_seed:seed_detail&action=download&info_hash={hash}` → 种子的 `link`，`info_hash` 即种子 `id`
- PT-Depiler 的 `id` = info_hash（下载构造用），`url` = 帖子链接（详情跳转用）

## 三、种子列表页（torrents.php）DOM 结构

`torrents.php` 默认返回**服务端渲染的完整 HTML**（不是 SPA，无需执行 JS 就有数据），种子在 `#listWrap` 表格中。

```html
<div class="lst" id="listWrap">
  <table>
    <thead><tr><th></th><th>标题</th><th>评分</th><th>💬</th><th>🕐</th><th>体积</th><th>▲上传</th><th>▼下载</th><th>⬇</th></tr></thead>
    <tbody>
      <tr id="row_{tid}"
          data-sticky data-title data-rating data-time data-size data-seeders data-leechers
          data-douban="{豆瓣ID}" data-imdb="{IMDbID}">
        <td class="pw"><a href="https://www.yzyy.org/forum.php?mod=viewthread&tid={tid}"><img src="{poster}"></a></td>
        <td class="nfo">
          <div class="tt">
            <a href="https://www.yzyy.org/forum.php?mod=viewthread&tid={tid}" title="{英文名}">{英文名}</a>
            <span class="nt">New</span>            <!-- 新种标签（可选） -->
            <span class="pp fr">Free</span>         <!-- 促销标签：fr=Free, x2=2x, p5=50% -->
          </div>
          <div class="sb" title="{中文副标题}">{中文副标题}</div>
          <div class="ic"><span class="ig ig-movie" title="电影">电影</span><span class="ig ig-enc" title="Encode">Encode</span>...</div>
        </td>
        <td><span class="rtg_{tid}"></span></td>   <!-- 评分占位，JS 填充（见"评分"节） -->
        <td style="text-align:center;" title="评论">💬 {replies}</td>
        <td title="{yyyy-MM-dd HH:mm}">{相对时间}</td>
        <td>{size}</td>
        <td>▲{seeders}</td>
        <td>▼{leechers}</td>
        <td><a href="https://www.yzyy.org/plugin.php?id=dz_seed:seed_detail&action=download&info_hash={hash}">⬇</a></td>
      </tr>
    </tbody>
  </table>
</div>
```

### 列表页字段选择器（yzyy.ts 已固化）

| 字段 | 选择器 | 说明 |
|------|--------|------|
| `rows` | `#listWrap table tbody tr` | 每行一个种子 |
| `id` | `td:last-child a[href*="info_hash="]` attr=href → querystring `info_hash` | 种子 ID = info_hash |
| `url` | `td.nfo .tt a[href*="viewthread"]` attr=href | 详情链接 |
| `link` | `td:last-child a[href*="info_hash="]` attr=href | 下载链接 |
| `title` | `td.nfo .tt a[href*="viewthread"]` **取文本内容** | ⚠️ 勿用 title 属性（曾因缺失致标题空白）；文本=英文名 |
| `subTitle` | `td.nfo .sb` **取文本内容** | ⚠️ 同样勿用 title 属性；文本=中文副标题 |
| `time` | `td:nth-child(5)` attr=title + parseTime(`yyyy-MM-dd HH:mm`) | 时间在 title 属性 |
| `size` | `td:nth-child(6)` + parseSize | |
| `seeders` | `td:nth-child(7)` + parseNumber | 文本带 ▲ 前缀 |
| `leechers` | `td:nth-child(8)` + parseNumber | 文本带 ▼ 前缀 |
| `comments` | `td:nth-child(4)` + parseNumber | `💬 0` |
| `completed` | 固定 `text: "-"` | YzYY 列表无"完成数"列 |
| `category` | `.ic` 内类型图标 `title` 属性 | 见下 |
| `ext_douban` | `:self` attr `data-douban` | 行属性（见"评分"节） |
| `ext_imdb` | `:self` attr `data-imdb` | 行属性（见"评分"节） |
| `tags` | `td.nfo .tt .pp.fr`(Free) / `.pp.x2`(2x) / `.pp.p5`(50%) / `.nt`(New) | 促销/新种标签 |

**category（分类）解析要点**：`.ic` 里的类型图标是 `<span class="ig ig-类型" title="中文分类名">`，如 `ig-movie`(电影)、`ig-tv`(电视剧)、`ig-music`(音乐)、`ig-soft`(软件)、`ig-movie-anime`(动画)、`ig-movie-doc`(纪录片)、`ig-movie-live`(演唱会)、`ig-movie-variety`(综艺)、`ig-tv-anime`(番剧) 等。用 elementProcess 遍历 `.ic span.ig`，匹配这些类型 class 取 `title`，**排除** `ig-pin`(置顶)/`ig-off`(官组)/`ig-enc`(Encode)/`ig-zh`(中字)/`ig-hr`(HR)/`ig-nr`(禁转) 等非类型图标。

## 四、种子详情页（Discuz 帖子）DOM

- 下载按钮：`a#dz_seed_dl_btn[href*="download.php?info_hash="]`（在 `#dz_seed_dl_wrap` 容器内）
- 标题：`#thread_subject` / `h1#thread_subject`
- 种子 ID = info_hash：从下载按钮 href 的 `info_hash` 参数提取

## 五、IMDb / 豆瓣 ID 搜索

`torrents.php` 的 `keyword` 参数支持三种匹配（页面上有对应的快速搜索框：`douban:`/`imdb:`/标题）：

| 搜索词 | 示例 URL | 匹配逻辑 |
|--------|----------|----------|
| IMDb ID | `?keyword=tt0063183` | 匹配种子 IMDb ID |
| 豆瓣 ID | `?keyword=2033997` | 匹配种子豆瓣 ID |
| 标题 | `?keyword=追魂镖` | 标题 LIKE |

**PT-Depiler 侧配置**（yzyy.ts 已含）：
```js
advanceKeywordParams: { imdb: { enabled: true }, douban: { enabled: true } },
```
- 必须显式配置 `douban: { enabled: true }`，否则 `douban|xxx` 高级搜索词会被跳过（PT-Depiler 默认只放行 imdb）
- `imdb` 未声明时 PT-Depiler 有内置 fallback 放行，但显式声明更明确

**匹配行为**：
- IMDb 搜索词必须**保留 `tt` 前缀**（`tt0063183`），帖子正文里的 IMDb 链接是 `https://www.imdb.com/title/tt0063183/`
- 豆瓣 ID 是纯数字（如 `2033997`），帖子正文里的豆瓣链接是 `https://movie.douban.com/subject/2033997/`
- **历史种子**（发布时未填豆瓣/IMDb ID）也能被 ID 搜索命中——站方实现了**帖子正文链接兜底**（发布工具在帖子正文写入 `【豆瓣链接】...` / `【IMDb链接】...`）

## 六、评分显示与评分图标超链接

YzYY 网页上所有评分徽章（豆瓣 X / IMDb Y）都**可点击**，点击直接打开对应影视页：
- 豆瓣徽章 → `https://movie.douban.com/subject/{豆瓣ID}/`
- IMDb 徽章 → `https://www.imdb.com/title/{IMDbID}/`

评分徽章出现在三个位置：
1. **torrents.php 聚合列表**（评分列，JS 填充 `.rtg_{tid}`）
2. **论坛板块列表页**（Discuz 帖子列表，标题旁）
3. **帖子详情页**（基本信息栏右侧）

**对 PT-Depiler 的意义**：
- 列表页每行 tr 带 `data-douban`（豆瓣ID）/`data-imdb`（IMDb ID）属性，PT-Depiler 解析为 `ext_douban`/`ext_imdb`
- 有了 ext_douban/ext_imdb，PT-Depiler 标题区的豆瓣/IMDb 图标（`showSocialInformation`）会显示，悬停可看评分、跳转外站
- 即使种子 DB 没存 did/iid（历史种子），站方也会从帖子正文兜底提取到行属性上

## 七、用户信息（userInfo）

YzYY 提供 **`https://www.yzyy.org/plugin.php?id=dz_seed:user_panel`** 作为当前登录用户的完整 PT 数据面板。页面结构：`.upanel-row` 用 `.upanel-label`（字段名）+ `.upanel-value`（值）相邻兄弟。

### user_panel 页提供的字段

- 用户名（`.upanel-header h2`，可能带 ★VIP / ⚠ 警告图标，需过滤）、注册日期、上次访问、等级、上传量、下载量、分享率、总流量、发布数、做种数、做种量、下载中、完成数、魔力、消息数、邀请、HR
- 头像：`.upanel-header img` 的 src
- 发布数/做种数/做种量/下载中/完成数等是**服务端真实统计**（非表格行数）

### yzyy.ts userInfo 配置要点

- `process` 两步请求：
  1. `plugin.php?id=dz_seed:user_panel`（responseType: document）→ 大部分字段
  2. `plugin.php?id=dz_seed:mybonus` → 取**时魔 bonusPerHour**（`table.dz-mb-table tbody tr.my td.hl:last-of-type`=每小时魔力）和 **seedingBonusPerHour**（`tr.my td.hl:first-of-type`=每小时积分）
- 字段选择器统一用 `.upanel-label:contains('字段名') + .upanel-value` + parseNumber/parseSize
- 时魔**不在 user_panel 页展示**（站方只显示积分），故单独从 mybonus 页取
- `pickLast: ["id"]`

### 字段名对照（.upanel-label 文本）

| 字段 | label 文本 | 解析 |
|------|-----------|------|
| `joinTime` | 注册日期 | parseTime `yyyy-MM-dd HH:mm` |
| `levelName` | 等级 | 文本 |
| `uploaded` | 上传量 | parseSize |
| `downloaded` | 下载量 | parseSize |
| `ratio` | 分享率 | parseNumber |
| `bonus` | 魔力 | parseNumber |
| `totalTraffic` | 总流量 | parseSize |
| `uploads` | 发布数 | parseNumber |
| `seeding` | 做种数 | parseNumber |
| `seedingSize` | 做种量 | parseSize |
| `leeching` | 下载中 | parseNumber |
| `snatches` | 完成数 | parseNumber |
| `messageCount` | 消息数 | parseNumber |
| `invites` | 邀请 | parseNumber |
| `avatar` | `.upanel-header img` | src |

## 八、noLoginAssert（登录判定）

```js
noLoginAssert: {
  urlPatterns: [/member\.php\?mod=logging|action=login|logging/i],
  matchSelectors: ["form[name='login']", "div#mainbox form[name='login']"],
},
```
⚠️ **不能用 formhash 作判据**：Discuz 已登录页面也含 `<input name="formhash">`，会误判未登录（曾导致一键导入 0 成功）。

## 九、已知注意点 / 适配坑

1. **搜索框无 `name` 属性**：列表页搜索框只有 `id="keyword"`，keywords 选择器必须用 `input#keyword`
2. **时间格式**：`yyyy-MM-dd HH:mm`（无秒），parseTime args 指定
3. **列表页是服务端渲染 + JS AJAX 双模式**：用 `responseType: document` 拿服务端 HTML，JS 不执行，列表可解析；`?ajax=1` 才返回 JSON
4. **fid 30/31 是"高清修复区"**：会员 AI 修复资源，种子带 `no_repost`（禁转）标记（列表 `.ig-nr` 图标），解析不受影响，但注意转发合规
5. **种子 ID 用 info_hash**：`id`=info_hash（下载构造），`url`=帖子链接（详情跳转），两者区分
6. **标题/副标题取文本内容**：`.tt a`/`.sb` 都取文本（勿用 title 属性，曾因此标题空白）
7. **IMDb/豆瓣 ID 搜索**：`advanceKeywordParams` 显式配置 `imdb`/`douban` enabled（douban 默认被跳过）
8. **评分/外站信息**：`ext_douban`/`ext_imdb` 从行 `data-douban`/`data-imdb` 属性取（站方已输出）
9. **分类**：从 `.ic` 类型图标 title 取（见第三节）

## 十、版本号

- yzyy.ts 的 `version` 用 YYYYMMDD 格式（如 `20260813`），每次调整适配会递增
- 站方服务端功能（搜索/评分链接/user_panel）由站方维护

## 十一、功能测试清单

1. **添加站点**：添加 YzYY，应显示两个域名可选项（www.yzyy.org / bbs.yzyy.asia）
2. **列表解析**：登录后打开 `torrents.php`，快捷操作（下载/复制/搜索）应可用；title/subTitle/category/size/seeders/leechers/comments 应正确
3. **详情页**：打开某帖子，应能识别下载按钮
4. **豆瓣/IMDb 搜索**：搜索 `douban|2033997`（追魂镖）或 `imdb|tt0063183`，YzYY 应返回结果
5. **用户信息**："我的数据"显示用户名/等级/上传下载/魔力/时魔等
6. **评分外站信息**：标题区显示豆瓣/IMDb 图标（可悬停看评分）

## 十二、常见问题（FAQ）

**Q: 为什么 douban|xxx 搜索无结果？**
A: 若 `advanceKeywordParams` 未配置 `douban: { enabled: true }`，PT-Depiler 会跳过该高级搜索词。已配置则正常。

**Q: 为什么搜索 IMDb ID 用 tt 前缀匹配不到？**
A: IMDb 帖子链接是 `title/tt0063183`（带 tt），匹配必须保留 tt。豆瓣是 `subject/2033997`（纯数字）。

**Q: 历史种子 did/iid 为空，评分链接会不会失效？**
A: 站方已实现帖子正文链接兜底（发布时正文必有豆瓣/IMDb 链接），列表页 data-douban/data-imdb 和评分徽章链接都会自动带上 ID。

**Q: 登录判定为什么不能用 formhash？**
A: Discuz 已登录页面也含 formhash，会误判未登录。用 URL 判据（member.php?mod=logging/login）+ 登录表单选择器。

## 十三、维护与更新

- YzYY 适配由 YzYY 站方提供并维护，已合入 PT-Depiler 官方主仓库
- 若站方服务端行为（搜索匹配、评分链接、user_panel）发生变化，会同步更新本文档与适配文件

### 🚀 关于 Introduction

PT-depiler 是在原 [PT-Plugin-Plus](https://github.com/pt-plugins/PT-Plugin-Plus) 基础上，
基于浏览器最新的 [Manifest v3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) 标准开发的一款浏览器插件（Web Extensions），
一个可以提升 PT 站点使用效率的工具。

适用于各 PT 站，可使下载种子等各项操作变化更简单、快捷。配合下载服务器（如 Transmission、qBittorrent 等），可一键下载指定的种子。

### 🖥️ 功能 Features

- **多站点支持**：兼容 NexusPHP、Unit3D、Gazelle 等多种类型的 PT 站点，提供聚合搜索相同关键字的种子、批量下载等功能 （ 支持站点列表见： [PT Site Status](https://pt-plugins.github.io/monitor/)  ）
- **下载器集成**：支持 qBittorrent、Transmission、Deluge、ruTorrent、Synology Download Station、Aria2 等多种下载器，并保存下载历史记录
- **备份服务器管理**：集成 WebDav、Gist、CookieCloud、Google Drive、DropBox、OWSS 等备份服务，方便数据同步
- **智能搜索**：增强搜索功能，支持多站点同时搜索并合并结果
- **用户信息管理**：集中显示和管理各站点的用户信息和统计数据
- **地址栏快速搜索**：在浏览器地址栏中输入 `ptd` 后按 Tab 键即可快速调用智能搜索功能
- 更多功能请参考 [Wiki](../../wiki)

### 🔧 安装 Installation

#### 1. 从各个浏览器的扩展商店安装

在各主流浏览器的扩展商店中均已上架 PT-Depiler，您可以直接前往对应的扩展商店搜索 "PT-Depiler" 进行安装，或点击表格状态列的徽标图片直接跳转到对应的扩展商店页面进行安装。

|          浏览器           | 状态                                                                                                                                                                                                                                                                                                                                |
|:----------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    Chrome Web Store    | [![Google Chrome](https://img.shields.io/chrome-web-store/v/iloddidemhbedaopmipajgclofjocogb.svg?label=Google%20Chrome)](https://chromewebstore.google.com/detail/pt-depiler/iloddidemhbedaopmipajgclofjocogb)                                                                                                                    | 
|    Firefox Add-ons     | [![Mozilla Firefox](https://img.shields.io/amo/v/pt-depiler.svg?label=Mozilla%20Firefox)](https://addons.mozilla.org/zh-CN/firefox/addon/pt-depiler/)                                                                                                                                                                             | 
| Microsoft Edge Add-ons | [![Microsoft Edge](https://img.shields.io/badge/dynamic/json?label=Edge%20Addons&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2FAddons%2Fgetproductdetailsbycrxid%2Fkbijhmckhndmeckonoikakdfdlbnlkde)](https://microsoftedge.microsoft.com/addons/detail/pt-depiler/kbijhmckhndmeckonoikakdfdlbnlkde) |

#### 2. 从 Github Action 或者 Release 中获取并安装

[![Build Action Release](../../actions/workflows/action_build.yml/badge.svg)](../../actions/workflows/action_build.yml)

我们使用 Github Action 自动构建了基于 master 分支的最新版本，你可以在 [Github Action](../../actions/workflows/action_build.yml)
或者 [Release](../../releases) 页面中下载最新的版本。

#### 3. 从源码构建

请预先准备好 [Git](https://git-scm.com/) 、 [Node.js](https://nodejs.org/en) 和 [pnpm](https://pnpm.io/) 环境。
建议使用 [VSCode](https://code.visualstudio.com/) 或 [WebStorm](https://www.jetbrains.com/webstorm/) 作为开发工具。

```bash
git clone https://github.com/pt-plugins/PT-depiler
cd PT-depiler
pnpm install
# pnpm dev
pnpm build:dist    # or pnpm build:dist-firefox
```

### 📝 改动说明 Changelog

PT-Depiler 并不是对 PT-Plugin-Plus 的简单移植，而是对其进行了全面的重构和改进，以获得更好的使用体验。

> 目前， PT-Depiler 仅支持**已适配站点**的PTPP历史用户数据迁移。
> 请勿将 [PT-Plugin-Plus](https://github.com/pt-plugins/PT-Plugin-Plus) 或者 [PT 助手](https://github.com/ronggang/PT-Plugin) 的配置文件直接导入 PT-Depiler。

更新记录请见： [CHANGELOG.md](./CHANGELOG.md)

### 💁‍♂️ 贡献 Contributors

✨ 欢迎 Star & 提 Issue，共同完善 PT-Depiler！ 有兴趣贡献的开发者请阅读[行为准则](./CODE_OF_CONDUCT.md)

> 请不要在 Issue 中提出一般性问题。Issue 仅用于报告错误、提出改进建议或请求新功能。

我们还有一个 [help wanted](../../labels/%22help%20wanted%22) 的问题列表，您可能会感兴趣。

![Alt](https://repobeats.axiom.co/api/embed/9d98187b3a4c57e8c3a7087ff45d61bc03741af0.svg "Repobeats analytics image")

### 📝 许可证 License

PT-Depiler 是一个开源项目，遵循 [MIT 许可证](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present [pt-plugins](https://github.com/pt-plugins)

## Star History

<a href="https://www.star-history.com/?type=date&repos=pt-plugins%2FPT-depiler">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=pt-plugins/PT-depiler&type=date&theme=dark&legend=top-left&sealed_token=OpJ3esFdalMwUXwBy-fVSBoD13v91i_UOr42DGy3YnLp1vYTmzz-HlmjbwfzTMJK22WAF77Mxee0x-lJe92NjXvP49gWWVu7EhT84a48k1NhYwnbtC2LOXyqDKThfZBnFF8pXClgBHQlFQbuo9ECpgC4u4Srg412B8A4rCyBbHovALa7zXcHckFLy0CV" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=pt-plugins/PT-depiler&type=date&legend=top-left&sealed_token=OpJ3esFdalMwUXwBy-fVSBoD13v91i_UOr42DGy3YnLp1vYTmzz-HlmjbwfzTMJK22WAF77Mxee0x-lJe92NjXvP49gWWVu7EhT84a48k1NhYwnbtC2LOXyqDKThfZBnFF8pXClgBHQlFQbuo9ECpgC4u4Srg412B8A4rCyBbHovALa7zXcHckFLy0CV" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=pt-plugins/PT-depiler&type=date&legend=top-left&sealed_token=OpJ3esFdalMwUXwBy-fVSBoD13v91i_UOr42DGy3YnLp1vYTmzz-HlmjbwfzTMJK22WAF77Mxee0x-lJe92NjXvP49gWWVu7EhT84a48k1NhYwnbtC2LOXyqDKThfZBnFF8pXClgBHQlFQbuo9ECpgC4u4Srg412B8A4rCyBbHovALa7zXcHckFLy0CV" />
 </picture>
</a>

--------------

特别感谢以下所有为本项目做出贡献的人 😍！

[![Contributors](https://contrib.rocks/image?repo=pt-plugins/PT-depiler)](../../graphs/contributors)
