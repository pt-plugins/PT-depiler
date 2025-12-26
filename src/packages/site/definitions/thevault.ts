/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/thevault.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/1302
 */
import type { ISiteMetadata } from "../types.ts";
import { SchemaMetadata } from "../schemas/TCG.ts";
import { definedFilters, buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  200: "ABCs / Basics",
  202: "Artificial Intelligence",
  107: "Author: Dan Kennedy",
  110: "Author: Dan Pena",
  117: "Author: Eben Pagan",
  92: "Author: Jay Abraham",
  96: "Author: John Reese",
  63: "Author: Robert Kiyosaki",
  106: "Autobiographies / Biographies",
  118: "Ayn Rand / Objectivism",
  112: "Consulting",
  94: "Copywriting",
  103: "Corporate Design / Branding",
  84: "Customer Service",
  65: "Economics / Finance",
  113: "Entertainment Business",
  73: "Hypnosis / NLP",
  67: "Investing / Trading / Stocks",
  75: "Magazines",
  70: "Management / Leadership",
  85: "Mindset / Achievement",
  80: "Misc: Audio",
  90: "Misc: Other",
  83: "Misc: Software",
  81: "Misc: Video",
  82: "Misc: Written / E-Books",
  62: "Money Management / Taxes",
  93: "Negotiation / Contracts",
  97: "Net: Affiliate Schemes",
  105: "Net: Blogging",
  76: "Net: E-Commerce",
  100: "Net: eBay / Online Auctions",
  115: "Net: Email Marketing",
  95: "Net: Marketing",
  101: "Net: Misc",
  98: "Net: Pay-Per-Click Advertising",
  108: "Net: Search Engine Optimizing",
  99: "Net: Traffic Generation",
  102: "Net: Web Site/Blog Templates",
  114: "Network Marketing (MLM)",
  111: "Offshore / Tax Avoidance",
  116: "Private Label Rights (PLR)",
  68: "Real Estate / Property Develop",
  104: "Recruitment / Interviewing",
  71: "Sales / Marketing",
  72: "Small Business / Entrepreneurs",
  109: "Sports / Gambling",
  91: "TTC Lectures",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "thevault",
  name: "TheVault",
  aka: ["TV"],
  description: "TheVault (TVBZ) is a Private Torrent Tracker for BUSINESS / MARKETING E-LEARNING",
  tags: ["学习"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "TCG",

  urls: ["uggcf://gurinhyg.pyvpx/"],

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
