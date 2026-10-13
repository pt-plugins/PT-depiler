/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/anirena.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "anirena",
  name: "AniRena",
  description: "AniRena is a Public torrent tracker for the latest anime and Japanese related torrents",
  tags: ["Anime"],

  type: "public",
  urls: ["uggcf://jjj.naveran.pbz/"],
  legacyUrls: ["uggcf://naveran.pbz/"],

  // 站点的高级搜索用两个参数：cat=<一级分类 slug>&sub=<二级分类 slug>
  // （依据站点 /content/js/main.js 的 buildSearchUrl()，2026-10 实测 `?q=naruto&cat=anime&sub=raw` 只返回 Anime / RAW）
  // 这里沿用站点自身下拉框的合并写法 `cat|sub` 作为选项值，再在 generateRequestConfig 里拆开
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "全部", value: "" },
        { name: "Anime", value: "anime" },
        { name: "Anime » Music Video", value: "anime|music-video" },
        { name: "Anime » Subtitle(s) and/or Audio(s)", value: "anime|sub-audio" },
        { name: "Anime » RAW", value: "anime|raw" },
        { name: "Manga/Manhwa/Comic", value: "manga" },
        { name: "Manga/Manhwa/Comic » Doujinshi", value: "manga|doujinshi" },
        { name: "Manga/Manhwa/Comic » RAW", value: "manga|raw" },
        { name: "Audio", value: "audio" },
        { name: "Audio » Lossless", value: "audio|lossless" },
        { name: "Audio » Lossy", value: "audio|lossy" },
        { name: "Literature", value: "literature" },
        { name: "Literature » Subtitle(s) and/or Text", value: "literature|sub-text" },
        { name: "Literature » RAW", value: "literature|raw" },
        { name: "Live Action", value: "live" },
        { name: "Live Action » Subtitle(s) and/or Audio(s)", value: "live|sub-audio" },
        { name: "Live Action » Idol/Promotional Video", value: "live|idol-promo" },
        { name: "Live Action » RAW", value: "live|raw" },
        { name: "Pictures", value: "pictures" },
        { name: "Pictures » Graphics", value: "pictures|graphics" },
        { name: "Pictures » Photos", value: "pictures|photos" },
        { name: "Software", value: "software" },
        { name: "Software » Application", value: "software|application" },
        { name: "Software » Game", value: "software|game" },
        { name: "Other", value: "other" },
      ],
      cross: false,
      generateRequestConfig: (selected) => {
        const value = String(selected ?? "");
        // 「全部」等同不传分类参数（`?cat=` 与不带 cat 的结果一致，实测确认）
        if (!value) return { requestConfig: { params: {} } };
        const [cat, sub] = value.split("|");
        return { requestConfig: { params: sub ? { cat, sub } : { cat } } };
      },
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: { url: "/" },
    selectors: {
      // 页面第一张表是搜索语法帮助，种子行都带 data-torrent-id
      rows: { selector: "tr[data-torrent-id]" },
      id: {
        selector: "a.tl-torrent-name",
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/([\w-]+)/)?.[1]],
      },
      title: { selector: "a.tl-torrent-name" },
      url: { selector: "a.tl-torrent-name", attr: "href" },
      link: { selector: 'a[title="Download Torrent"]', attr: "href" },
      // 站点的时间戳标注为 UTC（data-utc），显式按 UTC 解析，避免依赖运行主机时区
      time: {
        selector: "td.col-date span[data-utc]",
        filters: [(q: string) => new Date(`${q.replace(" ", "T")}:00Z`).getTime()],
      },
      size: { selector: "td.col-size", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td.col-se .tl-se" },
      leechers: { selector: "td.col-le .tl-le" },
      completed: { selector: "td.col-dl", filters: [(q: string) => q.replace(/\(\d+\)/g, "")] },
      category: { selector: "td.col-cat", attr: "title" },
      author: { selector: "td.col-uploader a" },
    },
  },

  list: [
    {
      // 简洁模式 /minimal 是另一套模板：行没有 data-torrent-id，标题是 a.tl-name，
      // 详情页是 /minimal/torrent/<id>（所以 urlPattern 必须用 `$` 收尾，否则会把详情页也当成列表页）
      // time（td.col-date span[data-utc]）与 size（td.col-size）两个选择器与普通页相同，
      // 靠 mergeSearchSelectors 继承，这里不重复声明
      urlPattern: ["/minimal(\\?.*)?$"],
      selectors: {
        rows: { selector: "table tbody tr:has(a.tl-name)" },
        id: {
          selector: "a.tl-name",
          attr: "href",
          filters: [(q: string) => q.match(/\/([\w-]+)$/)?.[1]],
        },
        title: { selector: "a.tl-name" },
        url: { selector: "a.tl-name", attr: "href" },
        link: { selector: 'a[title="Download .torrent"]', attr: "href" },
        seeders: { selector: "td.col-s" },
        leechers: { selector: "td.col-l" },
        completed: { selector: "td.col-num:not(.col-s):not(.col-l)" },
        author: { selector: "a.tl-uploader-link" },
        // 简洁模式的分类分隔符是 `›`，普通页是 `/`；统一成 `/`，两种模式下同一颗种子的 category 才一致
        category: { selector: "td.col-cat", attr: "title", filters: [(q: string) => q.replace(/›/g, "/")] },
        // 简洁模式的搜索框是服务端渲染的，value 属性里就是当前关键词
        keywords: { selector: 'input[name="q"]', attr: "value" },
      },
    },
    {
      // 普通页：搜索框是 JS 驱动的 #search-input（静态 HTML 里没有 value），
      // 因此不声明 keywords —— transformListPage 会回落到从 URL 的 ?q= 解析（AbstractBittorrentSite.ts:683-712）
      // 第一条 ^https?://[^/]+/?$ 用来认「站点根路径」这个不带任何查询串的列表页
      urlPattern: ["^https?://[^/]+/?$", "/\\?q=", "/\\?cat=", "/\\?page=", "/page/"],
    },
  ],

  // 详情页有两种模板（普通 /torrent/<id> 与简洁 /minimal/torrent/<id>）。
  // detail 只有一份配置，所以每个字段用「选择器数组」——数组是首个命中即停，
  // 两套模板里只会有一套命中，另一条自然落空（AbstractBittorrentSite.ts:366-411）。
  // 注意 transformDetailPage 不做 tryToNumber / parseSizeString / parseTimeWithZone，
  // 所以数值与时间必须在 filters 里自己转好（737-769）。
  detail: {
    urlPattern: ["/torrent/[\\w-]+"], // 同时覆盖 /torrent/<uuid> 与 /minimal/torrent/<uuid>
    selectors: {
      // 两套模板的标题都是页面里的 h1
      title: { selector: "h1" },
      // id 取 .torrent 链接里的 uuid，与搜索页 selectors.id 保持一致（否则同一颗种子会有两个 id）
      id: {
        selector: 'a[href$=".torrent"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrents\/([\w-]+)\.torrent/)?.[1]],
      },
      // 两套模板的 .torrent 直链都是 a[href$=".torrent"]
      link: { selector: 'a[href$=".torrent"]', attr: "href" },
      // 时间戳同样标 UTC（data-utc），显式按 UTC 解析
      time: {
        selector: [".td-ov-meta span[data-utc]", ".crumbs span[data-utc]"],
        filters: [(q: string) => new Date(`${q.replace(" ", "T")}:00Z`).getTime()],
      },
      size: {
        selector: [".td-ov-stat:has(.td-ov-stat-lbl:contains('Size')) .td-ov-stat-num", "dt:contains('Size') + dd"],
        filters: [{ name: "parseSize" }],
      },
      // 普通页的做种/下载数带一个括号里的备用数字（如 `1(5)`），需要先剥掉
      seeders: {
        selector: [".td-ov-stat--se .td-ov-stat-num", ".val.seed"],
        filters: [(q: string) => q.replace(/\(\d+\)/g, "")],
      },
      leechers: {
        selector: [".td-ov-stat--le .td-ov-stat-num", ".val.leech"],
        filters: [(q: string) => q.replace(/\(\d+\)/g, "")],
      },
      completed: {
        selector: [
          ".td-ov-stat:has(.td-ov-stat-lbl:contains('Completed')) .td-ov-stat-num",
          ".peer-row .item:has(.lbl:contains('Completed')) .val",
        ],
        filters: [(q: string) => q.replace(/\(\d+\)/g, "")],
      },
      // 普通页用 `Audio ›› Lossless`、简洁页用 `Audio › Lossless`；
      // 搜索页那条经 tryToNumber 后是 `Audio/Lossless`，这里对齐成同一种写法
      category: {
        selector: ["span.td-cat-breadcrumb", "span.cat-pill"],
        filters: [(q: string) => q.replace(/››?/g, "/").replace(/\s+/g, "")],
      },
      // 匿名发布时普通页渲染成 `-`，而简洁页的 crumbs 会整段省略上传者；
      // 用 text 兜底成 `-`，两套模板对同一颗种子才会给出一致的值
      author: {
        selector: [".td-ov-meta-lbl:contains('Uploaded by') + .td-ov-meta-val", '.crumbs a[href*="user%3A"]'],
        text: "-",
      },
    },
  },
};
