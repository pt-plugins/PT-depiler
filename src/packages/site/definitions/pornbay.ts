import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptions } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "pornbay",
  version: 1,
  name: "Pornbay",
  aka: ["PB"],
  tags: ["成人", "XXX"],

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://cbeaonl.bet/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Amateur", value: "1" },
        { name: "Anal", value: "2" },
        { name: "Asian", value: "3" },
        { name: "BBW", value: "4" },
        { name: "BDSM", value: "31" },
        { name: "Black", value: "5" },
        { name: "Blowjob", value: "6" },
        { name: "Busty", value: "7" },
        { name: "Classic", value: "32" },
        { name: "Clips", value: "8" },
        { name: "Creampie", value: "9" },
        { name: "DVD-R", value: "10" },
        { name: "Feature", value: "11" },
        { name: "Fetish", value: "12" },
        { name: "Foreign", value: "13" },
        { name: "Game", value: "14" },
        { name: "Gay&Bi", value: "15" },
        { name: "Gonzo", value: "16" },
        { name: "Hardcore", value: "17" },
        { name: "HD Quality", value: "18" },
        { name: "Hentai", value: "19" },
        { name: "Homemade", value: "30" },
        { name: "Interracial", value: "20" },
        { name: "Latin", value: "21" },
        { name: "Lesbian", value: "22" },
        { name: "Mature", value: "23" },
        { name: "Megapack", value: "47" },
        { name: "Old + Young", value: "49" },
        { name: "Orgy", value: "24" },
        { name: "Other", value: "25" },
        { name: "Pics", value: "26" },
        { name: "POV", value: "50" },
        { name: "Sick", value: "27" },
        { name: "Site rips", value: "35" },
        { name: "Solo", value: "48" },
        { name: "Straight", value: "28" },
        { name: "Teen", value: "29" },
        { name: "Transgender", value: "33" },
        { name: "VR Porn", value: "51" },
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
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Apprentice",
      privilege:
        "can upload torrents;  can access forums;  can make bookmarks;  can create collages;  can use the notifications system;  can create polls in the forums;  can bump threads in the forums;  can set forum signature (up to 128 characters);  can access site statistics",
    },
    {
      id: 2,
      name: "User",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "can use upload templates;  can add and vote on tags;  can add multiple tags at once",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege:
        "can access top 10 lists;  can create and vote in Requests;  can set torrent footer (800 px);  can set forum signature (up to 256 characters)",
    },
    {
      id: 4,
      name: "Expert User",
      interval: "P8W",
      uploaded: "100GB",
      uploads: 25,
      ratio: 1.05,
      privilege: "can access the Invites Forum",
    },
    {
      id: 5,
      name: "Super User",
      interval: "P13W",
      uploaded: "1TB",
      uploads: 50,
      ratio: 1.05,
      privilege:
        "can download zips of torrent files (from collages, and user pages);  can create public upload templates;  can set forum signature (up to 512 characters)",
    },
    {
      id: 6,
      name: "Fapinator",
      interval: "P26W",
      uploaded: "10TB",
      uploads: 250,
      ratio: 1.05,
      privilege: "can set forum signature (up to 1024 characters)",
    },
  ],
};
