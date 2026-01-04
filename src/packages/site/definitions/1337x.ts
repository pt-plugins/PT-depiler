/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/1337x.yml
 */
import { type ISiteMetadata } from "../types";
import urlJoin from "url-join";

const categoryMap: Record<number, string> = {
  28: "Anime/Anime",
  78: "Anime/Dual Audio",
  79: "Anime/Dubbed",
  80: "Anime/Subbed",
  81: "Anime/Raw",
  22: "Music/MP3",
  23: "Music/Lossless",
  24: "Music/DVD",
  25: "Music/Video",
  26: "Music/Radio",
  27: "Music/Other",
  53: "Music/Album",
  58: "Music/Box set",
  59: "Music/Discography",
  60: "Music/Single",
  68: "Music/Concerts",
  69: "Music/AAC",
  1: "Movies/DVD",
  2: "Movies/Divx/Xvid",
  3: "Movies/SVCD/VCD",
  4: "Movies/Dubs/Dual Audio",
  42: "Movies/HD",
  54: "Movies/h.264/x264",
  55: "Movies/Mp4",
  66: "Movies/3D",
  70: "Movies/HEVC/x265",
  73: "Movies/Bollywood",
  76: "Movies/UHD",
  5: "TV/DVD",
  6: "TV/Divx/Xvid",
  7: "TV/SVCD/VCD",
  41: "TV/HD",
  71: "TV/HEVC/x265",
  74: "TV/Cartoons",
  75: "TV/SD",
  9: "TV/Documentary",
  18: "Apps/PC Software",
  19: "Apps/Mac",
  20: "Apps/Linux",
  21: "Apps/Other",
  56: "Apps/Android",
  57: "Apps/iOS",
  10: "Games/PC Game",
  11: "Games/PS2",
  12: "Games/PSP",
  13: "Games/Xbox",
  14: "Games/Xbox360",
  15: "Games/PS1",
  16: "Games/Dreamcast",
  17: "Games/Other",
  43: "Games/PS3",
  44: "Games/Wii",
  45: "Games/DS",
  46: "Games/GameCube",
  72: "Games/3DS",
  77: "Games/PS4",
  82: "Games/Switch",
  48: "XXX/Video",
  49: "XXX/Picture",
  50: "XXX/Magazine",
  51: "XXX/Hentai",
  67: "XXX/Games",
  33: "Other/Emulation",
  34: "Other/Tutorial",
  35: "Other/Sounds",
  36: "Other/E-books",
  37: "Other/Images",
  38: "Other/Mobile Phone",
  39: "Other/Comics",
  40: "Other/Other",
  47: "Other/Nulled Script",
  52: "Other/Audiobook",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "1337x",
  name: "1337x",
  description: "1337X is a Public torrent site that offers verified torrent downloads",
  type: "public",
  urls: [
    // get status and news on domains at the official site https://1337x-status.org/
    "https://1337x.to/",
    "https://1337x.st/",
    "https://x1337x.ws/",
    "https://x1337x.eu/",
    "https://x1337x.cc/",
  ],
  legacyUrls: [
    "https://1337x.is/",
    "https://1337x.gd/",
    "https://1337x.mrunblock.bond/",
    "https://1337x.abcproxy.org/",
    "https://1337x.so/",
    "https://1337x.unblockit.download/",
    "https://1337x.unblockninja.com/",
    "https://1337x.ninjaproxy1.com/",
    "https://1337x.proxyninja.org/",
    "https://1337x.proxyninja.net/",
    "https://1337x.torrentbay.st/",
    "https://1337x.torrentsbay.org/",
    "https://x1337x.se/",
  ],

  category: [
    {
      key: "category",
      name: "Category",
      options: [
        { name: "TV", value: "TV" },
        { name: "Movies", value: "Movies" },
        { name: "Games", value: "Games" },
        { name: "Music", value: "Music" },
        { name: "Applications", value: "Apps" },
        { name: "Documentaries", value: "Documentaries" },
        { name: "Anime", value: "Anime" },
        { name: "Other", value: "Other" },
        { name: "XXX", value: "XXX" },
      ],
      cross: false,
    },
    {
      name: "Sort",
      key: "sort",
      options: [
        { name: "Time", value: "time" },
        { name: "Size", value: "size" },
        { name: "Seeders", value: "seeders" },
        { name: "leechers", value: "leechers" },
      ],
      cross: false,
    },
    {
      name: "Order",
      key: "order",
      options: [
        { name: "Ascending", value: "asc" },
        { name: "Descending", value: "desc" },
      ],
      cross: false,
    },
  ],

  search: {
    keywordPath: "q", // mocked, will be handled in requestConfigTransformer
    requestConfig: {
      url: "/search",
      params: {
        order: "desc",
      },
    },
    skipNonLatinCharacters: true,
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords) {
        requestConfig!.url = "/trending";
      } else {
        delete requestConfig!.params.q;

        let searchPath = "search";

        const category = requestConfig!.params?.category as string | undefined;

        if (category) {
          searchPath = "category-" + searchPath;
          delete requestConfig!.params.category;
        }

        const sort = requestConfig!.params?.sort as string | undefined;
        if (sort) {
          searchPath = "sort-" + searchPath;
          delete requestConfig!.params.sort;
        }

        const order = requestConfig!.params?.order as string | undefined;
        if (order) {
          delete requestConfig!.params.order;
        }

        requestConfig!.url = urlJoin(
          searchPath,
          keywords || "",
          String(category || ""),
          String(sort || ""),
          String(sort ? order || "desc" : ""),
          "1/",
        );
      }

      return requestConfig!;
    },

    selectors: {
      rows: { selector: "table.table-list > tbody > tr" }, // 'tr:has(a[href^="/torrent/"])'
      id: {
        selector: 'td[class^="coll-1"] a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/(\d+)/)![1]],
      },
      title: { selector: 'td[class^="coll-1"] a[href^="/torrent/"]' },
      url: { selector: 'td[class^="coll-1"] a[href^="/torrent/"]', attr: "href" },

      time: {
        selector: 'td[class^="coll-date"]',
        filters: [
          /**
           * - (within this year) 7am Sep. 14th       -> ha MMM. do
           * - (more than a year ago) Apr. 18th '11   -> MMM. do ''yy
           * - (today) 12:25am                        -> h:mma
           */
          { name: "parseTime", args: ["ha MMM. do", "MMM. do ''yy", "h:mma"] },
        ],
      },

      size: { selector: 'td[class^="coll-4"]', filters: [{ name: "parseSize" }] },
      seeders: { selector: 'td[class^="coll-2"]' },
      leechers: { selector: 'td[class^="coll-3"]' },
      comments: {
        selector: 'td[class^="coll-1"] span.comments',
        filters: [(q: string) => parseInt(q) || 0],
      },
      category: {
        selector: 'td[class^="coll-1"] a[href^="/sub/"]',
        attr: "href",
        filters: [(q: string) => categoryMap[parseInt(q.match(/\/sub\/(\d+)/)?.[1] ?? "40")]],
      },
    },
  },

  list: [
    {
      urlPattern: [
        "/trending",
        "/trending-week",
        "/search/",
        "/category-search/",
        "/sort-search/",
        "/category-sort-search/",
        "/top-100",
        "/cat/",
      ],
      mergeSearchSelectors: true,
      selectors: {
        keywords: { selector: 'input[name="search"]', attr: "value" },
      },
    },
  ],

  detail: {
    urlPattern: ["/torrent/\\d+/.*"],
    selectors: {
      title: { selector: "div.box-info-heading h1" },
      link: { selector: ["a[href^='magnet:?xt=']", "a[href^='http://itorrents.org/']"], attr: "href" },
      size: { selector: "li:contains('Total size') > span", filters: [{ name: "parseSize" }] },
    },
  },
};
