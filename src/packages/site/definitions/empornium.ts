import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromDict } from "../utils";

const categoryMap: Record<number, string> = {
  1: "Amateur",
  2: "Anal",
  5: "Asian",
  6: "BBW",
  30: "BDSM",
  36: "Big Ass",
  8: "Big Tits",
  7: "Black",
  9: "Classic",
  37: "Creampie",
  10: "Cumshot",
  11: "DVD-R",
  12: "Fetish",
  14: "Gang Bang / Orgy",
  39: "Gay / Bi",
  56: "Hairy",
  35: "Hardcore",
  44: "HD Porn",
  3: "Hentai / 3D",
  25: "Homemade",
  43: "Interracial",
  16: "Latina",
  23: "Lesbian",
  52: "Lingerie",
  27: "Magazines",
  53: "Manga / Comic",
  18: "Masturbation",
  26: "Mature",
  40: "Megapack",
  41: "Natural Tits",
  17: "Oral",
  29: "Other",
  47: "Parody",
  24: "Paysite",
  21: "Pictures / Images",
  50: "Piss",
  55: "Porn Music Videos",
  46: "Pregnant / Preggo",
  51: "Scat/Puke",
  22: "Siterip",
  20: "Softcore",
  49: "Squirt",
  34: "Straight",
  19: "Teen",
  15: "Transsexual",
  45: "Voyeur",
  13: "XXX Games / Apps",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "empornium",
  version: 1,
  name: "Empornium",
  aka: ["EMP"],
  description: "Empornium (EMP) is a Private Torrent Tracker for 3X.",
  tags: ["成人", "XXX"],
  timezoneOffset: "-1100",

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://jjj.rzcbeavhz.fk/"],
  legacyUrls: ["https://www.empornium.is/", "https://www.empornium.me/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "appendQuote" },
    },
    {
      name: "优惠",
      key: "free",
      options: [{ name: "100% Freeleech", value: "filter_freeleech" }],
      cross: { mode: "append", key: "" },
    },
  ],

  search: {
    ...SchemaMetadata!.search!,
    advanceKeywordParams: {
      imdb: false,
      // 支持站点的高级搜索
      terms: {
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
      ...SchemaMetadata!.search!.selectors!,
      category: {
        selector: "td.cats_col > div[title] > a",
        attr: "href",
        filters: [
          (query: string) => {
            const match = query.match(/filter_cat\[(\d+)\]=/) || "";
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
      name: "Apprentice",
      privilege: "The default class of new members.",
    },
    {
      id: 2,
      name: "Perv",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.6,
      privilege:
        "can access top10 lists;  can add and vote on tags;  can use upload templates;  can set forum signature (up to 128 characters)",
    },
    {
      id: 3,
      name: "Good Perv",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege:
        "can access site statistics;  can create public upload templates;  can create and vote in requests;  can use the notifications system;  can create collages;  can create up to 2 personal collages;  can add multiple tags at once;  can see uploaders name in upload (unless forced hidden);  can download zips of torrent files (from collages, and user pages);  can play Slot Machine;  can create polls in the forums;  can bump threads in the forums;  can set forum signature (up to 256 characters)",
    },
    {
      id: 4,
      name: "Great Perv",
      interval: "P8W",
      uploaded: "100GB",
      uploads: 5,
      ratio: 1.05,
      privilege:
        "can see staff list on Staff page;  can access the Invite forum;  can send invites (if you have any);  can create an additional personal collage (3 total);  can set forum signature (up to 512 characters)",
    },
    {
      id: 5,
      name: "Sextreme Perv",
      interval: "P13W",
      uploaded: "1TB",
      uploads: 50,
      ratio: 1.05,
      privilege:
        "can see staff list on Staff page; can create 2 additional personal collages (5 total); can set forum signature (up to 1024 characters)",
    },
    {
      id: 6,
      name: "Smut Peddler",
      interval: "P26W",
      uploaded: "10TB",
      uploads: 250,
      ratio: 1.05,
      privilege:
        "can create 5 additional personal collages (10 total); can set forum signature (up to 2048 characters)",
    },
  ],
};
