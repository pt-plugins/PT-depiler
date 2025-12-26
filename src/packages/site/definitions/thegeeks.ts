/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/thegeeks.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/1302
 */
import type { ISiteMetadata } from "../types.ts";
import { SchemaMetadata } from "../schemas/TCG.ts";
import { definedFilters, buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  212: "AudioBook : Fiction",
  213: "AudioBook : Non-Fiction",
  71: "Docu : Antiques / Collecting",
  82: "Docu : Architecture/Building",
  72: "Docu : Astronomy / Space",
  85: "Docu : Childrens Ed",
  38: "Docu : Crime/ Investigation",
  59: "Docu : Earth / Environment",
  18: "Docu : Engineering",
  4: "Docu : Fine/Visual Arts",
  39: "Docu : FlyOnWall Docus",
  216: "Docu : FlyOnWall Medical",
  84: "Docu : FrontLine",
  36: "Docu : Gardening/Agriculture",
  58: "Docu : History - Biographies",
  55: "Docu : History - Civilization",
  31: "Docu : History - Misc",
  56: "Docu : History - War/Politics",
  35: "Docu : Home / Property",
  78: "Docu : Horizon",
  69: "Docu : Misc",
  75: "Docu : Nature",
  54: "Docu : News/World Reports",
  83: "Docu : Nova",
  27: "Docu : Paleontology",
  67: "Docu : Pets/Animal Keeping",
  53: "Docu : Social Experiment",
  32: "Docu : Travel / Culture",
  80: "Docu : Travelogues",
  34: "Docu : Vehicles/Transport",
  207: "Business : Economics",
  211: "Business : Investing",
  208: "Business : Marketing",
  209: "Business : Startup/Dev",
  28: "Business :Misc",
  214: "Comp: Artificial Intelligence",
  40: "Comp: Certification Courses",
  44: "Comp: Digital Audio/Video",
  48: "Comp: Games Dev/Guides",
  3: "Comp: Graphics ",
  42: "Comp: Lang/DBs",
  49: "Comp: Network/Hardware",
  43: "Comp: Operating Systems",
  46: "Comp: Security/Encryption",
  52: "Comp: Software Training",
  41: "Comp: Theory/Ref/Mags",
  47: "Comp: Web Development",
  68: "Crafts/Jewelry",
  21: "DIY / Workshop",
  25: "Exam Prep / Education",
  9: "Food/Cooking/Nutrition",
  37: "Game Shows / Quiz Shows",
  2: "Games: Cards/Tabletop/etc",
  23: "Hobbies: Misc",
  1: "Languages / Linguistics",
  20: "Law & Justice",
  30: "Literature",
  16: "Magic & Illusion",
  206: "Native American Studies",
  201: "Occultism: Academic / Referenc",
  210: "Occultism: Bashar",
  202: "Occultism: Mythology Folklore",
  203: "Paranormal",
  204: "Parapsychology",
  11: "Political Studies",
  61: "Science: Biology",
  77: "Science: Chemistry",
  12: "Science: Math/Statistics",
  10: "Science: Medicine/Health ",
  29: "Science: Philosophy",
  76: "Science: Physics",
  14: "Science: Psych/Sociolgy",
  215: "Sexuality/Seductn/Body Img",
  22: "Sports/Exercise/Outdoors",
  24: "Stock Media",
  33: "Style & Fashion",
  73: "Docu : Survivalism",
  60: "Docu : The Arts: Acting/ Filmmaking",
  217: "Docu : The Arts: Dance/Singing/Voice",
  26: "Docu : The Arts: Music History/Theory",
  15: "Docu : The Arts: Music Learn/Courses",
  45: "Docu : The Arts: Photography",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "thegeeks",
  name: "TheGeeks",
  aka: ["TG"],
  description: "The Geeks is a Private Torrent Tracker for Technology E-LEARNING",
  tags: ["学习"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "TCG",

  urls: ["uggcf://gurtrrxf.pyvpx/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "append", key: "c" },
    },
    {
      name: "种子状态",
      key: "incldead",
      options: [
        { name: "Active", value: 0 },
        { name: "Dead", value: 3 },
        { name: "Neutral Leech", value: 4 },
      ],
    },
    {
      name: "搜索类型",
      key: "nonboolean",
      options: [
        { name: "Exact", value: 0 },
        { name: "Fuzzy", value: 1 },
        { name: "Parsed", value: 3 },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: {
        selector: "a[href^='browse.php?cat=']",
        attr: "href",
        filters: [
          (query: string) => {
            const catId = definedFilters.querystring(query, ["cat"]);
            return categoryMap[Number(catId)];
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "Can leech up to 10 torrents at a time.",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P28D",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Able to leech 50 torrents at a time. Has full request privileges.",
    },
    {
      id: 3,
      name: "Extreme User",
      interval: "P60D",
      uploaded: "60GB",
      ratio: 2.05,
      privilege: "Able to leech 100 torrents at a time.",
    },
  ],
};
