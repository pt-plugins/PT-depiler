import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromList } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "empornium",
  version: 1,
  name: "Empornium",
  aka: ["EMP"],
  tags: ["成人", "XXX"],

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://jjj.rzcbeavhz.ef/", "uggcf://jjj.rzcbeavhz.fk/"],
  legacyUrls: ["https://www.empornium.is/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Amateur", value: "1" },
        { name: "Anal", value: "2" },
        { name: "Asian", value: "5" },
        { name: "BBW", value: "6" },
        { name: "BDSM", value: "30" },
        { name: "Big Ass", value: "36" },
        { name: "Big Tits", value: "8" },
        { name: "Black", value: "7" },
        { name: "Classic", value: "9" },
        { name: "Creampie", value: "37" },
        { name: "Cumshot", value: "10" },
        { name: "DVD-R", value: "11" },
        { name: "Fetish", value: "12" },
        { name: "Gang Bang / Orgy", value: "14" },
        { name: "Gay / Bi", value: "39" },
        { name: "Hairy", value: "56" },
        { name: "Hardcore", value: "35" },
        { name: "HD porn", value: "44" },
        { name: "Hentai / 3D", value: "3" },
        { name: "Homemade", value: "25" },
        { name: "Interracial", value: "43" },
        { name: "Latina", value: "16" },
        { name: "Lesbian", value: "23" },
        { name: "Lingerie", value: "52" },
        { name: "Magazines", value: "27" },
        { name: "Manga / Comic", value: "53" },
        { name: "Masturbation", value: "18" },
        { name: "Mature", value: "26" },
        { name: "Megapack", value: "40" },
        { name: "Natural Tits", value: "41" },
        { name: "Oral", value: "17" },
        { name: "Other", value: "29" },
        { name: "Parody", value: "47" },
        { name: "Paysite", value: "24" },
        { name: "Pictures / Images", value: "21" },
        { name: "Piss", value: "50" },
        { name: "Porn Music Videos", value: "55" },
        { name: "Pregnant / Preggo", value: "46" },
        { name: "Scat/Puke", value: "51" },
        { name: "Siterip", value: "22" },
        { name: "Softcore", value: "20" },
        { name: "Squirt", value: "49" },
        { name: "Straight", value: "34" },
        { name: "Teen", value: "19" },
        { name: "Transgender", value: "15" },
        { name: "Voyeur", value: "45" },
        { name: "XXX Games / Applications", value: "13" },
      ],
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
    requestConfig: {
      ...SchemaMetadata!.search!.requestConfig!,
      params: {
        perPage: 100,
      },
    },
    advanceKeywordParams: {
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
        selector: ["td.cats_col > div"],
        attr: "title",
      },
      tags: [
        {
          name: "Free",
          selector: "i.unlimited_leech",
          color: "blue",
        },
      ],
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
