import { SchemaMetadata as e } from "../schemas/TCG-DV6FyUhd.js";
import "../index-COeZNva1.js";
import { d as a } from "../utils/filter-Dko2hrfF.js";
import { b as o } from "../utils/helper-OCngMtkv.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const t = {
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
  },
  S = {
    ...e,
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
      { name: "类别", key: "category", options: o(t), cross: { mode: "append", key: "c" } },
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
      ...e.search,
      selectors: {
        ...e.search.selectors,
        category: {
          selector: "a[href^='browse.php?cat=']",
          attr: "href",
          filters: [
            (i) => {
              const r = a.querystring(i, ["cat"]);
              return t[Number(r)];
            },
          ],
        },
      },
    },
    levelRequirements: [
      { id: 1, name: "User", privilege: "Can leech up to 10 torrents at a time." },
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
export { S as siteMetadata };
