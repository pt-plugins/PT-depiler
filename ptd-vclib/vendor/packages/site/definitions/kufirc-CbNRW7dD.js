import { SchemaMetadata as r } from "../schemas/Luminance-DtLCtoLD.js";
import "../index-COeZNva1.js";
import { a as i } from "../utils/helper-OCngMtkv.js";
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
const G = {
  ...r,
  id: "kufirc",
  version: 1,
  name: "kufirc",
  aka: ["kf"],
  tags: ["成人", "XXX"],
  description: "XXX Animal",
  type: "private",
  schema: "Luminance",
  urls: ["uggcf://xhsvep.pbz/"],
  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Amateur", value: "30" },
        { name: "Anal", value: "29" },
        { name: "Animal", value: "5" },
        { name: "Asian", value: "27" },
        { name: "BBW", value: "26" },
        { name: "BDSM", value: "44" },
        { name: "Big Ass", value: "25" },
        { name: "Big Tits", value: "24" },
        { name: "Black", value: "34" },
        { name: "Busty", value: "35" },
        { name: "Classic", value: "23" },
        { name: "Creampie", value: "33" },
        { name: "Cumshot", value: "22" },
        { name: "Feature", value: "36" },
        { name: "Fetish", value: "21" },
        { name: "Film/Cam/Hun", value: "31" },
        { name: "Film/Xvid/hun", value: "46" },
        { name: "Foreign", value: "37" },
        { name: "Gay / Bi", value: "19" },
        { name: "Hardcore", value: "18" },
        { name: "HD porn", value: "32" },
        { name: "Hentai / 3D", value: "28" },
        { name: "Homemade", value: "17" },
        { name: "Image", value: "11" },
        { name: "Interracial", value: "38" },
        { name: "Latina", value: "48" },
        { name: "Lesbian", value: "16" },
        { name: "Magazines", value: "56" },
        { name: "Magyar", value: "6" },
        { name: "Masturbation", value: "15" },
        { name: "Mature", value: "14" },
        { name: "Megapack", value: "13" },
        { name: "Milf", value: "55" },
        { name: "Natural Tits", value: "49" },
        { name: "Old + Young", value: "39" },
        { name: "Oral", value: "12" },
        { name: "Orgia / Gang Bang", value: "20" },
        { name: "Other", value: "42" },
        { name: "Parody", value: "50" },
        { name: "Paysite", value: "41" },
        { name: "Piss", value: "40" },
        { name: "Porn Music Videos", value: "43" },
        { name: "Pov", value: "54" },
        { name: "Pregnant / Preggo", value: "45" },
        { name: "Scat/Puke", value: "57" },
        { name: "Shemale / TS", value: "10" },
        { name: "Siterip", value: "51" },
        { name: "Softcore", value: "52" },
        { name: "Squirt", value: "53" },
        { name: "Straight", value: "9" },
        { name: "Teen", value: "8" },
        { name: "VR", value: "47" },
        { name: "XXX Games / Applications", value: "7" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "标签和分辨率",
      key: "taglist",
      options: i([
        ["1080p", "1on1", "2160p", "720p", "amateur", "anal", "big.ass"],
        ["big.tits", "brunette", "cowgirl", "cumshot", "doggy", "facial", "family.strokes"],
        ["hardcore", "hd", "homemade", "horse", "hungarian", "hungary", "natural.tits", "oral"],
      ]),
      cross: { mode: "custom" },
      generateRequestConfig: (e) => {
        const a = {},
          t = [];
        return (
          e.forEach((m) => {
            const n = m.toString();
            t.push(n);
          }),
          t.length > 0 && (a.taglist = t.join("+")),
          { requestConfig: { params: a } }
        );
      },
    },
    {
      name: "优惠",
      key: "free",
      options: [{ name: "100% Freeleech", value: "filter_freeleech" }],
      cross: { mode: "append", key: "" },
    },
  ],
  search: {
    ...r.search,
    requestConfig: { ...r.search.requestConfig, params: { perPage: 100 } },
    advanceKeywordParams: {
      terms: {
        requestConfigTransformer: ({ requestConfig: e }) => (
          e?.params?.title && ((e.params.searchtext = e.params.title), delete e.params.title),
          e
        ),
      },
    },
    selectors: {
      ...r.search.selectors,
      category: {
        selector: ["td.cats_col > div"],
        attr: "title",
        filters: [(e) => (e.toLowerCase() === "vr" ? "VR" : e.toLowerCase().replace(/\b\w/g, (a) => a.toUpperCase()))],
      },
    },
  },
  levelRequirements: [
    { id: 1, name: "Apprentice", privilege: "The default class of new members." },
    {
      id: 2,
      name: "Perv",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "Must have been be a member for at least 1 week, uploaded 10GB+, ratio 0.7+",
    },
    {
      id: 3,
      name: "Good Perv",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Must have been be a member for at least 4 weeks, uploaded 25GB+, ratio 1.05+",
    },
    {
      id: 4,
      name: "Sextreme Perv",
      interval: "P13W",
      uploaded: "1TB",
      uploads: 50,
      ratio: 1.05,
      privilege: "Must have been be a member for at least 13 weeks, uploaded 1TB+, uploaded 50+ torrents, ratio 1.05+",
    },
    {
      id: 5,
      name: "Smut Peddler",
      interval: "P26W",
      uploaded: "10TB",
      uploads: 250,
      ratio: 1.05,
      privilege:
        "Must have been be a member for at least 26 weeks, uploaded 10TB+, uploaded 250+ torrents, ratio 1.05+",
    },
    { id: 6, name: "Legenda", privilege: "Legendary user with special privileges." },
  ],
};
export { G as siteMetadata };
