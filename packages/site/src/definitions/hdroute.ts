import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDRoute",
  timezoneOffset: "+0800",
  description: "HDRoute",
  type: "private",
  url: "aHR0cDovL2hkcm91dGUub3JnLw==",
  tags: ["影视", "综合"],
  search: {
    keywordsParam: "s",
    requestConfig: {
      url: "/browse.php",
      params: {
        dp: 0,
        add: 0,
        action: "s",
        or: 1,
      },
    },
    advanceKeyword: {
      imdb: {
        transformer: (config) => {
          config.params.imdb = config.params.s.replace("tt", "");
          config.params.s = "";
          return config;
        },
      }
    },
    selectors: {
      rows: { selector: "#unsticky-torrent-table dl" },
      id: {
        selector: ":self",
        attr: "id",
        filters: [(query: string) => parseInt(query.replace("dl_torrent_", ""))],
      },
      title: { selector: ".title_chs" },
      subTitle: { selector: ".title_eng" },
      url: {
        selector: ":self",
        attr: "id",
        filters: [(query: string) => `/details.php?id=${query.replace("dl_torrent_", "")}`],
      },
      link: {
        selector: ":self",
        attr: "id",
        filters: [(query: string) => `/download.php?id=${query.replace("dl_torrent_", "")}`],
      },
      time: { selector: ".torrent_added" },
      author: { selector: ".torrent_owner" },
      category: { text: "ALL" },
      seeders: {
        selector: ".torrent_count.strong:eq(0)",
        filters: [(query: string) => (query === "---" ? 0 : query)],
      },
      leechers: {
        selector: ".torrent_count.strong:eq(1)",
        filters: [(query: string) => (query === "---" ? 0 : query)],
      },
      completed: { text: -1 },
      comments: { selector: "span.torrent_comments_count" },

      tags: [
        {
          name: "Free",
          selector: "figure.sprite_dlp000, figure.sprite_tempo_free",
        }, // 把临时Free并入Free中
        { name: "30%", selector: "figure.sprite_dlp030" },
        { name: "50%", selector: "figure.sprite_dlp050" },
        { name: "70%", selector: "figure.sprite_dlp070" },
      ],
    },
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: "/" },
        fields: ["id", "name", "bonus"],
      },
      {
        requestConfig: { url: "/userdetail.php" },
        assertion: { id: "id" },
        fields: ["uploaded", "downloaded", "levelName", "joinTime", "seeding", "seedingSize"],
      },
    ],
    selectors: {
      id: {
        selector: [".headerRightInfo a[href*='userdetail.php']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: ".headerRightInfo a[href*='userdetail.php']",
      },
      bonus: { text: "N/A" },
      uploaded: {
        selector: ".headerRightInfo span:contains('上传量: ') > span",
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ".headerRightInfo span:contains('下载量: ') > span",
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: ".userdetail-list-title:contains('用户等级') + div",
        filters: [(query: string) => query.replace(" 级别", "")],
      },
      joinTime: {
        selector: ".userdetail-list-title:contains('注册日期') + div",
        filters: [{ name: "parseTime" }],
      },
      seeding: {
        selector: ".header-user-data a[href*='list_seeding.php']",
      },
      seedingSize: {
        selector: ".header-user-data a[href*='list_seeding.php'] + span",
        filters: [{ name: "parseSize" }],
      },
    },
  },
};
