/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/Feeds/AnimeTosho.cs
 */
import { type ISiteMetadata } from "../types";
import { format, subDays } from "date-fns";

export const siteMetadata: ISiteMetadata = {
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

    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords) {
        requestConfig!.url = "/";
      }
      return requestConfig!;
    },

    selectors: {
      rows: { selector: "div.home_list_entry" },
      id: {
        selector: "div.link a",
        attr: "href",
        filters: [(q: string) => q.match(/\.([nd\d]+)$/)![1]],
      },
      title: { selector: "div.link a" },
      url: { selector: "div.link a", attr: "href" },
      link: {
        selector: ['div.links > a[href$=".torrent"]', 'div.links > a[href^="magnet:?xt="]'],
        attr: "href",
      },
      time: {
        selector: "div.date",
        attr: "title",
        filters: [
          (q: string) => {
            // 03/06/2011 08:17
            // Today 01:59
            // Yesterday 23:39
            q = q.replace("Date/time submitted: ", "");
            q = q.replace("Today", format(new Date(), "dd/MM/yyyy"));
            q = q.replace("Yesterday", format(subDays(new Date(), 1), "dd/MM/yyyy"));
            return q;
          },
          { name: "parseTime", args: ["dd/MM/yyyy HH:mm"] },
        ],
      },
      size: { selector: "div.size" },
      seeders: {
        text: 0,
        selector: 'span[title*="Seeders"]',
        attr: "title",
        filters: [(q: string) => q.match(/Seeders: (\d+)/)?.[1] ?? "0"],
      },
      leechers: {
        text: 0,
        selector: 'span[title*="Leechers"]',
        attr: "title",
        filters: [(q: string) => q.match(/Leechers: (\d+)/)?.[1] ?? "0"],
      },
      category: { text: "Anime" },
    },
  },

  list: [
    {
      urlPattern: [/\.org\/$/, /\/\?page=/, "/?filter", "/search"],
      excludeUrlPattern: ["/view/"],
      mergeSearchSelectors: true,
      selectors: {
        keywords: { selector: 'input[name="q"]', attr: "value" },
      },
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
