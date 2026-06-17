import { SchemaMetadata as e } from "../schemas/Luminance-DtLCtoLD.js";
import "../index-COeZNva1.js";
import { b as r } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../types/torrent-BvvY2NbA.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const o = {
    10: "Windows",
    11: "Macintosh",
    47: "Linux",
    56: "VR",
    14: "Xbox",
    61: "Xbox 360",
    62: "Xbox One",
    43: "Playstation",
    63: "Playstation 2",
    64: "Playstation 3",
    67: "Playstation 4",
    12: "PSN",
    57: "Gamecube",
    44: "Wii",
    46: "Wii U",
    76: "Switch",
    15: "DS",
    68: "3DS",
    69: "PSP",
    70: "PSVita",
    65: "iOS",
    49: "Android",
    66: "Windows Mobile",
    53: "Books/Mags",
    60: "Comics",
    17: "Guides",
    58: "Gaming Videos",
    52: "OST",
    55: "Time for a Break",
    81: "Videos",
    59: "Mods",
    54: "Updates/Fixes",
    71: "Applications/Tools",
    48: "Retro",
    72: "Board Games",
    75: "Paper Crafting",
    77: "Arcade",
    78: "Other",
  },
  C = {
    ...e,
    version: 1,
    id: "pixelcove",
    name: "PixelCove",
    aka: ["PxC"],
    description: "PixelCove (Ultimate Gamer) is a Private Torrent Tracker for GAMES",
    tags: ["游戏"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "Luminance",
    urls: ["uggcf://jjj.cvkrypbir.zr/"],
    category: [
      { name: "类别", key: "filter_cat", options: r(o), cross: { mode: "appendQuote" } },
      { name: "优惠", key: "filter_freeleech", options: [{ name: "Free", value: 1 }] },
    ],
    search: {
      ...e.search,
      selectors: {
        ...e.search.selectors,
        category: {
          selector: "td.cats_col > div[title] > a",
          attr: "href",
          filters: [
            (i) => {
              const t = i.match(/filter_cat\[(\d+)\]=/) || "";
              return t ? o[Number(t[1])] : "";
            },
          ],
        },
      },
    },
    levelRequirements: [
      { id: 1, name: "User" },
      { id: 2, name: "Member", interval: "P1W", uploaded: "50GB", posts: 25, ratio: 0.75 },
      {
        id: 3,
        name: "Power User",
        interval: "P12W",
        uploaded: "150GB",
        posts: 50,
        ratio: 1.25,
        uploads: 1,
        privilege: "See the uploader of a torrent.",
      },
      { id: 4, name: "Master", interval: "P24W", uploaded: "500GB", posts: 75, ratio: 0.75, uploads: 10 },
      { id: 5, name: "Elite", interval: "P48W", uploaded: "1TB", posts: 150, ratio: 0.75, uploads: 25 },
    ],
  };
export { C as siteMetadata };
