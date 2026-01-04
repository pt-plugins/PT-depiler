import type { ISiteMetadata } from "../types";
import { buildCategoryOptionsFromDict } from "../utils";

const category = {
  "0": "All",
  "1": "Anime",
  "10": "Non-English",
  "2": "Music",
  "3": "Manga",
  "4": "Hentai",
  "5": "Other",
  "7": "Raws",
  "8": "Drama",
  "9": "Music Video",
  "11": "Batch",
  "12": "Hentai (Anime)",
  "13": "Hentai (Manga)",
  "14": "Hentai (Games)",
  "15": "JAV",
} as const;

export const siteMetadata: ISiteMetadata = {
  id: "tokyotosho",
  version: 1,
  name: "Tokyo Toshokan",
  aka: ["東京 図書館"],
  description: "Tokyo Toshokan is a Public BitTorrent Library for JAPANESE Media",

  type: "public",

  urls: ["https://www.tokyotosho.info/", "https://tokyo-tosho.net/"],
  legacyUrls: [
    "https://tokyotosho.se/", // redirect to www.tokyotosho.info
  ],

  category: [
    {
      name: "Category",
      key: "cat",
      options: buildCategoryOptionsFromDict(category),
    },
  ],

  search: {
    requestConfig: {
      url: "/search.php",
    },
    requestConfigTransformer: ({ requestConfig: config, keywords }) => {
      if (!keywords) {
        config!.url = "/index.php";
      }

      return config!;
    },
    keywordPath: "params.terms",

    advanceKeywordParams: { imdb: false },

    selectors: {
      rows: { selector: "table.listing tr.category_0", merge: 2 },
      //id: { selector: "td.stats", filters: [(t: string) => t.match(/ID: (\d+)/)?.[1]] },
      id: { selector: 'a[href^="details.php?id="]', attr: "href", filters: [{ name: "querystring", args: ["id"] }] },
      title: { selector: 'td.desc-top a[type="application/x-bittorrent"]' },
      subTitle: { selector: "td.desc-bot", filters: [(t: string) => t.match(/Comment: ([^|]+) ?/)?.[1] ?? ""] },
      url: { selector: 'a[href^="details.php?id="]', attr: "href" },
      link: { selector: 'td.desc-top a[type="application/x-bittorrent"]', attr: "href" },
      time: {
        selector: "td.desc-bot",
        filters: [
          (t: string) => t.match(/Date: ([^|]+) ?/)?.[1] ?? "",
          { name: "replace", args: ["UTC", "+0000"] },
          { name: "parseTime", args: ["yyyy-MM-dd HH:mm XXX"] },
        ],
      },
      size: {
        selector: "td.desc-bot",
        filters: [(t: string) => t.match(/Size: ([^|]+) ?/)?.[1] ?? "", { name: "parseSize" }],
      },
      author: {
        selector: "td.desc-bot",
        filters: [(t: string) => t.match(/Submitter: ([^|]+) ?/)?.[1] ?? "Anonymous"],
      },
      seeders: { selector: "td.stats", filters: [(t: string) => t.match(/S: (\d+)/)?.[1] ?? 0] },
      leechers: { selector: "td.stats", filters: [(t: string) => t.match(/L: (\d+)/)?.[1] ?? 0] },
      completed: { selector: "td.stats", filters: [(t: string) => t.match(/C: (\d+)/)?.[1] ?? 0] },
      category: {
        selector: "a[href*='cat=']",
        attr: "href",
        filters: [
          { name: "querystring", args: ["cat"] },
          (cat: string) => category[cat as keyof typeof category] || "Unknown",
        ],
      },
    },
  },

  list: [{ urlPattern: ["/index.php", /\/(\?.+)?$/, "/search.php"] }],

  detail: {
    urlPattern: ["/details.php"],
    selectors: {
      title: { selector: 'a[type="application/x-bittorrent"]' },
      link: { selector: 'a[type="application/x-bittorrent"]', attr: "href" },
    },
  },
};
