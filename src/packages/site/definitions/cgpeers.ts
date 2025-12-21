import { type ISiteMetadata, ETorrentStatus } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";

const categoryMap: Record<number, string> = {
  1: "Applications",
  8: "Audio",
  7: "Game Development",
  5: "Materials",
  6: "Miscellaneous",
  4: "Models",
  2: "Plugins",
  3: "Tutorials",
  9: "Web Development",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "cgpeers",
  name: "CGPeers",
  aka: ["CGP"],
  description: "CGPeers 是一个专注于计算机图形资源的私有站点",
  tags: ["设计", "教育", "软件", "学习", "素材"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Luminance",

  urls: ["https://cgpeers.to/"],
  formerHosts: ["www.cgpeers.com"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "优惠",
      key: "filter_freeleech",
      options: [{ name: "Free", value: 1 }],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      rows: { selector: "table#torrent_table > tbody > tr:has(a[href*='action=download'])" },
      category: {
        selector: "td.cats_col > div[title] > a",
        attr: "href",
        filters: [
          (query: string) => {
            const match = query.match(/filter_cat\[(\d+)\]=/);
            if (!match) return "";
            return categoryMap[Number(match[1])];
          },
        ],
      },
      time: { selector: ["td:nth-child(6) > span"], attr: "title", filters: [{ name: "parseTime" }] },
      size: { selector: ["td:nth-child(7)"], filters: [{ name: "parseSize" }] },
      author: undefined,
      seeders: { selector: ["td:nth-child(9)"], filters: [{ name: "parseNumber" }] },
      leechers: { selector: ["td:nth-child(10)"], filters: [{ name: "parseNumber" }] },
      completed: { selector: ["td:nth-child(8)"], filters: [{ name: "parseNumber" }] },
      status: {
        selector: ["a[href*='torrents.php?action=download'] > i"],
        text: ETorrentStatus.unknown,
        case: {
          "i.seeding-torrent": ETorrentStatus.seeding, // 做种!
          "i.leeching-torrent": ETorrentStatus.downloading, // 吸血!
          "i.grabbed-torrent": ETorrentStatus.inactive, // 未完成!
        },
      },
      progress: {
        selector: ["a[href*='torrents.php?action=download'] > i"],
        text: 0,
        case: {
          "i.seeding-torrent": 100,
        },
      },
      tags: [
        {
          name: "Free",
          selector: "i.unlimited_leech",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "span.icon[title*='DoubleSeed']",
          color: "lime",
        },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      name: { selector: ["a.username-link"] },
      id: {
        selector: ["a.username-link"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
    },
  },

  detail: {
    ...SchemaMetadata.detail!,
    selectors: {
      ...SchemaMetadata.detail!.selectors,
      title: { selector: "table.cgp-tb-torrent-details div.torrent-name-details > span:first-child" },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "Member",
      interval: "P4W",
      uploaded: "100GiB",
      ratio: 1,
      privilege: "Access Top 10; Can (anonymously) upload torrents; Can make requests",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P20W",
      uploaded: "500GiB",
      ratio: 2,
      uploads: 5,
      privilege: "Can view advanced site stats.",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P52W",
      uploaded: "2TiB",
      ratio: 4,
      uploads: 50,
      privilege: "Can download multiple torrents at once. Can delete tags. Can view torrent peerlists.",
    },
    {
      id: 5,
      name: "Legend",
      interval: "P260W",
      uploaded: "100TiB",
      ratio: 4,
      uploads: 100,
      privilege: "Can have a personal collage. Can create collages.",
    },
  ],
};
