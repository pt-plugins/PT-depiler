import { g as r } from "../../../date-fns/format-b1gG6cM7.js";
import { s as a } from "../../../date-fns/subDays-DlPNbvmn.js";
const l = {
  version: 1,
  id: "animetosho",
  name: "AnimeTosho",
  aka: ["AT", "アニメ等所"],
  description:
    "AnimeTosho (AT) is an automated service that provides torrent files, magnet links and DDL for all anime releases",
  tags: ["动画", "漫画"],
  type: "public",
  urls: ["https://animetosho.org/"],
  category: [
    {
      name: "Sort",
      key: "order",
      options: [
        { name: "Newest first", value: "" },
        { name: "Oldest first", value: "date-a" },
        { name: "Smallest first", value: "size-a" },
        { name: "Sort: Largest first", value: "size-d" },
      ],
    },
  ],
  search: {
    keywordPath: "params.q",
    requestConfig: { url: "/search" },
    requestConfigTransformer: ({ keywords: e, requestConfig: t }) => (e || (t.url = "/"), t),
    selectors: {
      rows: { selector: "div.home_list_entry" },
      id: { selector: "div.link a", attr: "href", filters: [(e) => e.match(/\.([nd\d]+)$/)[1]] },
      title: { selector: "div.link a" },
      url: { selector: "div.link a", attr: "href" },
      link: { selector: ['div.links > a[href$=".torrent"]', 'div.links > a[href^="magnet:?xt="]'], attr: "href" },
      time: {
        selector: "div.date",
        attr: "title",
        filters: [
          (e) => (
            (e = e.replace("Date/time submitted: ", "")),
            (e = e.replace("Today", r(new Date(), "dd/MM/yyyy"))),
            (e = e.replace("Yesterday", r(a(new Date(), 1), "dd/MM/yyyy"))),
            e
          ),
          { name: "parseTime", args: ["dd/MM/yyyy HH:mm"] },
        ],
      },
      size: { selector: "div.size" },
      seeders: {
        text: 0,
        selector: 'span[title*="Seeders"]',
        attr: "title",
        filters: [(e) => e.match(/Seeders: (\d+)/)?.[1] ?? "0"],
      },
      leechers: {
        text: 0,
        selector: 'span[title*="Leechers"]',
        attr: "title",
        filters: [(e) => e.match(/Leechers: (\d+)/)?.[1] ?? "0"],
      },
      category: { text: "Anime" },
    },
  },
  list: [
    {
      urlPattern: [/\.org\/$/, /\/\?page=/, "/?filter", "/search"],
      excludeUrlPattern: ["/view/"],
      mergeSearchSelectors: !0,
      selectors: { keywords: { selector: 'input[name="q"]', attr: "value" } },
    },
  ],
  detail: {
    urlPattern: ["/view/"],
    selectors: {
      title: { selector: "h2#title" },
      link: { selector: ['a[href$=".torrent"]', 'a[href^="magnet:?xt="]'], attr: "href" },
    },
  },
};
export { l as siteMetadata };
