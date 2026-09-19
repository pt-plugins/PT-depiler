/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/TorrentDay.cs
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/www.torrentday.com/config.json
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * TorrentDay (TD) 是一个综合类私有站点。
 *
 * 抓取方式采用 Jackett 的实现：走站点自带的 JSON 接口 `/t.json`，而非 PTPP 时代的 HTML 页面
 * （`/t?q=` + `table#torrentTable`）——后者已过时。JSON 结果无需登录态之外的额外凭据，
 * 但未登录时站点会 302 重定向到 login.php，因此由 noLoginAssert 兜住。
 *
 * 站点镜像域名较多，此处仅收录 Jackett 的主域名与常见备用域名。
 */
import type { ISiteMetadata } from "../types";

// Jackett 的 categorymappings（id → 名称），用于把数字分类还原为可读名称
const categoryMap: Record<number, string> = {
  25: "电影/480p",
  96: "电影/4K",
  11: "电影/Bluray",
  5: "电影/Bluray-Full",
  103: "电影/Cam",
  3: "电影/DVD-R",
  21: "电影/MP4",
  22: "电影/非英语",
  13: "电影/合集",
  44: "电影/SD/x264",
  48: "电影/x265",
  1: "电影/XviD",
  24: "剧集/480p",
  104: "剧集/4K",
  32: "剧集/Bluray",
  31: "剧集/DVD-R",
  33: "剧集/DVD-Rip",
  46: "剧集/移动端",
  82: "剧集/非英语",
  14: "剧集/合集",
  26: "剧集/SD/x264",
  7: "剧集/x264",
  34: "剧集/x265",
  2: "剧集/XviD",
  10: "游戏/任天堂",
  4: "游戏/PC",
  18: "游戏/PS",
  8: "游戏/PSP",
  9: "游戏/Xbox",
  17: "音乐/音频",
  27: "音乐/Flac",
  23: "音乐/非英语",
  41: "音乐/合集",
  16: "音乐/视频",
  29: "动漫",
  42: "有声书",
  20: "书籍",
  102: "书籍/非英语",
  30: "纪录片",
  95: "教育",
  47: "字体",
  43: "Mac",
  45: "播客",
  28: "软件/合集",
  12: "软件",
  19: "成人/0Day",
  6: "成人/电影",
  15: "成人/合集",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentday",
  name: "TorrentsTD",
  aka: ["TorrentDay", "TD"],
  description: "TorrentDay (TD) is a Private site for TV / MOVIES / GENERAL",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  // 当前可用的镜像域名（对应 Jackett 的 AlternativeSiteLinks，均已验证可解析）
  urls: [
    "https://tday.love/",
    "https://torrentday.cool/",
    "https://secure.torrentday.com/",
    "https://classic.torrentday.com/",
    "https://www.torrentday.com/",
    "https://www.torrentday.me/",
    "https://torrentday.it/",
    "https://td.findnemo.net/",
    "https://td.getcrazy.me/",
    "https://td.workisboring.net/",
    "https://tday.findnemo.net/",
    "https://tday.getcrazy.me/",
    "https://tday.workisboring.net/",
  ],
  // 历史域名（对应 Jackett 的 LegacySiteLinks）
  legacyUrls: [
    "https://torrentday.com/",
    "https://tdonline.org/",
    "https://torrentday.eu/",
    "https://td-update.com/",
    "https://www.torrentday.ru/",
    "https://www.td.af/",
    "https://td.venom.global/",
    "https://tday.venom.global/",
  ],

  // 站点未登录时会 302 到 login.php，用 URL 模式兜底
  noLoginAssert: {
    urlPatterns: [/login\.php/gi],
  },

  search: {
    // 站点接口形如 /t.json?<cat1>;<cat2>;q=<关键词>[;free=on]
    // 分类以「;」分隔的裸数字出现在查询串里，与常规 params 结构不符，
    // 故这里不开放分类筛选，仅按关键词搜索（与 Jackett 在无分类时取全部分类的行为一致）。
    requestConfig: { url: "/t.json", responseType: "json" },
    keywordPath: "params.q",
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      const q = keywords ?? "";
      requestConfig!.url = `${requestConfig!.url?.split("?")[0]}?q=${encodeURIComponent(q)}`;
      delete requestConfig!.params;
      return requestConfig!;
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      // 接口直接返回数组
      rows: { selector: ":self" },
      id: { selector: "t" },
      title: { selector: "name" },
      url: {
        selector: "t",
        filters: [{ name: "prepend", args: ["/details.php?id="] }],
      },
      link: {
        selector: "t",
        filters: [(id: number) => `/download.php/${id}/${id}.torrent`],
      },
      category: {
        selector: "c",
        filters: [(catId: number) => categoryMap[+catId] ?? String(catId)],
      },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      // 接口无评论数字段
      comments: { text: 0 },
      time: { selector: "ctime", filters: [{ name: "parseTime" }] },
      ext_imdb: { selector: "imdb-id" },
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id="],
    selectors: {
      size: { selector: "span[title='File Size']", filters: [{ name: "parseSize" }] },
      link: { selector: "a[href*='download.php/']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php']",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='userdetails.php']" },
          messageCount: {
            selector: "a[href='/m']:contains('You have')",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: {
            selector: "span.detailsInfoSpan:contains('Up: ') > span",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "span.detailsInfoSpan:contains('Down: ') > span",
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "span.detailsInfoSpan:contains('Ratio: ') > span",
            filters: [{ name: "parseNumber" }],
          },
          levelName: { selector: "span.detailsInfoSpan:contains('Class: ') > span" },
          bonus: { selector: "a[href='/mybonus.php']", filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: "span.detailsInfoSpan:contains('Joined: ') > span",
            filters: [{ name: "parseTime" }],
          },
          seeding: {
            selector: "a[href*='/peers?u='] > img[alt='downloads'] + span",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User" },
    { id: 3, name: "VIP" },
  ],
};
