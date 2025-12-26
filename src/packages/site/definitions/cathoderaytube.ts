import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromDict } from "../utils";

const categoryMap: Record<number, string> = {
  13: "Games",
  4: "Misc",
  1: "Movies",
  2: "TV",
  3: "WOC",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "cathoderaytube",
  name: "Cathode-Ray.Tube",
  aka: ["CRT"],
  description: "Cathode-Ray.Tube (CRT) is a Private Torrent Tracker for CLASSIC MOVIES / TV",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://jjj.pngubqr-enl.ghor/"],

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
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.title) {
            config.params.searchtext = config.params.title;
            delete config.params.title;
          }
          return config!;
        },
      },
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
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Nostalgic Newcomer",
      privilege: "Torrent download limit set to 6 torrents per hour.",
    },
    {
      id: 2,
      name: "Retro Rookie",
      interval: "P4W",
      uploaded: "100GiB",
      posts: 1,
      ratio: 1.0,
      privilege:
        "Access to Top10 Stats. Can send CRT Invites. Can create Collages. Torrent download limit set to 12 torrents per hour.",
    },
    {
      id: 3,
      name: "Classics Collector",
      interval: "P8W",
      uploaded: "1TiB",
      posts: 10,
      ratio: 1.25,
      privilege: "Access to Tracker Discussion forum. Torrent download limit set to 24 torrents per hour.",
    },
    {
      id: 4,
      name: "Analog Ace",
      interval: "P16W",
      uploaded: "5TiB",
      posts: 20,
      ratio: 1.5,
      uploads: 5,
      privilege: "Access to Invite forums. Torrent download limit set to 36 torrents per hour.",
    },
    {
      id: 5,
      name: "Monochrome Master",
      interval: "P32W",
      uploaded: "15TiB",
      posts: 30,
      ratio: 2,
      uploads: 15,
      privilege: 'Can post in the "Looking For..." Invite forum. Torrent download limit set to 48 torrents per hour.',
    },
    {
      id: 6,
      name: "Vintage Virtuoso",
      interval: "P64W",
      uploaded: "25TiB",
      posts: 50,
      ratio: 2.5,
      uploads: 25,
      privilege: "Torrent download limit set to 60 torrents per hour.",
    },
  ],
};
