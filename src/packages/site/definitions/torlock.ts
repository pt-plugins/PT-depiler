import { type ISiteMetadata } from "../types";

// 列表里分类以 `a.tl-cat c<N>` 的 class 形式给出，N 与站内分类页一一对应（2026-10-31 实测）
const categoryMap: Record<string, string> = {
  c1: "Movies",
  c2: "Music",
  c3: "TV Shows",
  c4: "Games",
  c5: "Software",
  c6: "Anime",
  c7: "Adult",
  c8: "Books",
  c9: "Other",
  c10: "Other",
  c12: "Audiobook",
};

// 关键词只保留字母数字，其余折叠成 -（站点搜索路径形如 /all/torrents/gundam-wing.html）
const toPathSlug = (keywords?: string): string =>
  String(keywords ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torlock",
  name: "Torlock",
  description: "Torlock 是一个以「只收录已验证种子」为卖点的公开 BT 索引站，覆盖影视、音乐、游戏、软件与电子书",
  type: "public",
  tags: ["综合", "影视", "音乐", "游戏", "电子书"],
  urls: ["https://www.torlock.com/"],
  legacyUrls: [
    "https://torlock.com/",
    "https://www.torlock2.com/",
    "https://www.torlock.icu/",
    "https://torlock.nocensor.cloud/",
    "https://torlock.mrunblock.bond/",
    "https://torlock.unblockit.download/",
  ],

  category: [
    {
      name: "排序",
      key: "sort",
      cross: false,
      options: [
        { name: "添加时间", value: "added" },
        { name: "文件大小", value: "size" },
        { name: "做种数", value: "seeds" },
        { name: "连接数", value: "peers" },
      ],
    },
    {
      name: "顺序",
      key: "o",
      cross: false,
      options: [
        { name: "降序", value: "desc" },
        { name: "升序", value: "asc" },
      ],
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/",
      responseType: "document",
      params: { q: "", sort: "added", o: "desc" },
    },
    requestConfigTransformer: ({ requestConfig, keywords }) => {
      const config = requestConfig ?? {};
      const params = { ...(config.params ?? {}) } as Record<string, string>;
      const sort = params.sort ?? "added";
      const order = params.o ?? "desc";
      // q 不是查询参数，它已经变成路径里的一段（首页 /?q=… 等效，但路径形式更稳定）
      delete params.q;

      const slug = toPathSlug(keywords);
      // 有关键词走全站检索 /all/torrents/<slug>.html；无关键词退到当年列表（站点没有「全站最新」页）
      config.url = slug ? `/all/torrents/${slug}.html` : `/all/torrents/${new Date().getFullYear()}.html`;
      config.params = { sort, o: order };
      return config;
    },
    selectors: {
      // 列表与栅格视图共用同一张 table.tl-list，种子行是含 a.tl-name 的 tr
      rows: { selector: "table.tl-list tr:has(a.tl-name)" },
      id: {
        selector: "a.tl-name",
        attr: "href",
        filters: [(href: string) => String(href).match(/\/torrent\/(\d+)/)?.[1] ?? ""],
      },
      title: { selector: "a.tl-name" },
      url: { selector: "a.tl-name", attr: "href" },
      // 站点已不再提供 .torrent 直链（下载按钮就是 magnet），列表页没有 magnet，只能进详情页取
      time: {
        selector: "time[datetime]",
        attr: "datetime",
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd"] }],
      },
      size: { selector: "td.ts", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td.tul", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td.tdl", filters: [{ name: "parseNumber" }] },
      category: {
        selector: "a.tl-cat",
        attr: "class",
        filters: [(className: string) => categoryMap[String(className).trim().split(/\s+/).pop() ?? ""] ?? "Other"],
      },
    },
  },

  detail: {
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      title: { selector: "h1.rd-title" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
    },
  },
};
