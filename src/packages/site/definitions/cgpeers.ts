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

const linkSelector = { selector: "a[href*='torrent/download/']", attr: "href" };
const idSelector = {
  ...linkSelector,
  filters: [{ name: "split", args: ["/", 3] }, { name: "split", args: ["?", 0] }, { name: "parseNumber" }],
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 2,
  id: "cgpeers",
  name: "CGPeers",
  aka: ["CGP"],
  description: "CGPeers 是一个专注于计算机图形资源的私有站点",
  tags: ["设计", "教育", "软件", "学习", "素材"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Luminance", // CGPeers

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
    requestConfig: {
      ...SchemaMetadata.search!.requestConfig!,
      url: "/torrent/browse",
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      id: idSelector,
      title: { selector: "span + a[href*='torrent/']" },
      url: { selector: "span + a[href*='torrent/']", attr: "href" },
      link: linkSelector,
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
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["id"],
      },
      {
        requestConfig: { url: "/user/$id$", responseType: "document" },
        assertion: { id: "url" },
        fields: [
          "name",
          "joinTime",
          "lastAccessAt",
          "uploaded",
          "downloaded",
          "levelName",
          "bonus",
          "ratio",
          "uploads",
          "bonusPerHour",
          "seeding",
          "seedingSize",
          "messageCount",
          "posts",
        ],
      },
    ],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      id: {
        selector: ["div.user-dropdown-section a[href^='/user/']"],
        attr: "href",
        filters: [{ name: "split", args: ["/", 2] }],
      },
      name: {
        selector: ["a#userDropdownTrigger", "span.user_name"],
        switchFilters: { "span.user_name": [{ name: "split", args: ["\n", 0] }] },
      },
      messageCount: {
        text: 0,
        selector: "a#userDropdownTrigger .user-notification-badge",
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  detail: {
    ...SchemaMetadata.detail!,
    selectors: {
      ...SchemaMetadata.detail!.selectors,
      title: { selector: "div.page-header h2" },
      id: idSelector,
      link: linkSelector,
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
