import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Gazelle.ts";

const categoryMap: Record<string, string> = {
  ebooks: "E-Books",
  audiobooks: "Audiobooks",
};

const statisticsItemSelector = (label: string) =>
  `div.head:contains('Statistics') + ul.stats > li:contains('${label}')`;
const communityItemSelector = (label: string) => `div.head:contains('Community') + ul.stats > li:contains('${label}')`;

const relativeTimeFilters = [
  (query: string) => (query.trim().toLowerCase() === "just now" ? "0 seconds" : query),
  { name: "parseTTL" },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "simurg",
  name: "Simurg",
  description: "Simurg is a private digital library focused on carefully catalogued e-books and audiobooks.",
  tags: ["电子书", "有声书"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Gazelle",

  urls: ["https://simurg.world/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "E-Books", value: 3 },
        { name: "Audiobooks", value: 4 },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "促销",
      key: "freetorrent",
      options: [
        { name: "Freeleech", value: 1 },
        { name: "Neutral Leech", value: 2 },
        { name: "Either", value: 3 },
        { name: "Normal", value: 0 },
      ],
    },
    {
      name: "语言",
      key: "language",
      options: [
        { name: "English", value: "English" },
        { name: "Turkish", value: "Turkish" },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      ...SchemaMetadata.search!.requestConfig,
      params: {
        ...SchemaMetadata.search!.requestConfig!.params,
        action: "basic",
        searchsubmit: 1,
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      time: {
        ...SchemaMetadata.search!.selectors!.time!,
        selector: ".td_time",
      },
      category: {
        selector: ".cats_col > div[class*='cats_']",
        attr: "class",
        filters: [
          (className: string) => {
            const match = className.match(/\bcats_(ebooks|audiobooks)\b/);
            return match ? categoryMap[match[1]] : "Other";
          },
        ],
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: SchemaMetadata.userInfo!.process!.map((process, index) =>
      index === 1
        ? {
            ...process,
            fields: [...(process.fields ?? []), "bonusPerHour", "leeching", "snatches", "posts", "groups"],
          }
        : process,
    ),
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      joinTime: {
        selector: `${statisticsItemSelector("Joined:")} > span.time`,
        filters: relativeTimeFilters,
      },
      lastAccessAt: {
        selector: `${statisticsItemSelector("Last seen:")} > span.time`,
        filters: relativeTimeFilters,
      },
      bonusPerHour: {
        selector: statisticsItemSelector("Points Per Hour"),
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: statisticsItemSelector("Seeding Size:"),
        filters: [{ name: "parseSize" }],
      },
      uploads: {
        selector: communityItemSelector("Uploaded:"),
        filters: [{ name: "parseNumber" }],
      },
      groups: {
        selector: communityItemSelector("Unique groups:"),
        filters: [{ name: "parseNumber" }],
      },
      posts: {
        selector: communityItemSelector("Forum posts:"),
        filters: [{ name: "parseNumber" }],
      },
      leeching: {
        selector: communityItemSelector("Leeching:"),
        filters: [{ name: "parseNumber" }],
      },
      snatches: {
        selector: communityItemSelector("Snatched:"),
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: communityItemSelector("Seeding:"),
        filters: [{ name: "parseNumber" }],
      },
    },
  },
};
