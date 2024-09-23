import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "Legit Torrents",
  type: "public",
  timezoneOffset: "-0700",
  description: "Legit Torrents is a Public site for free and legal torrents",
  url: "http://www.legittorrents.info/",
  search: {
    requestConfig: {
      url: "/index.php",
      params: {
        page: "torrents",
        active: 0, // 0 all 1 active 2 deadonly
        category: 0,
      },
    },
    keywordsParam: "search",
    selectors: {
      rows: {
        selector:
          'table table table.lista > tbody > tr:has(a[href^="download.php?id="])',
      },
      id: {
        selector: 'a[title][href^="index.php?page=torrent-details&id="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: 'a[title][href^="index.php?page=torrent-details&id="]',
      },
      url: {
        selector: 'a[title][href^="index.php?page=torrent-details&id="]',
        attr: "href",
      },
      link: { selector: 'a[href^="download.php?id="]', attr: "href" },
      time: {
        selector: "td time",
        filters: [{ name: "parseTime", args: ["DD/MM/YYYY"] }],
      },
      seeders: { selector: "td:nth-child(5)" },
      leechers: { selector: "td:nth-child(6)" },
      completed: { selector: "td:nth-child(7)" },
    },
  },
};
