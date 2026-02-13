import { type ISiteMetadata, ETorrentStatus } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromDict } from "../utils";

const categoryMap: Record<number, string> = {
  17: "3D Printing",
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
  legacyUrls: ["https://www.cgpeers.com/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: buildCategoryOptionsFromDict(categoryMap),
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
      author: { text: "N/A" },
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
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      name: { selector: ["span.user_name"], filters: [{ name: "split", args: ["(", 0] }] },
      id: {
        selector: ["a[href^='/user.php?id=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      messageCount: { selector: "a#userDropdownTrigger .user-notification-badge", filters: [{ name: "parseNumber" }] },
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
