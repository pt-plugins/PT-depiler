import { SchemaMetadata as t } from "../schemas/Luminance-DtLCtoLD.js";
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
const L = {
  ...t,
  id: "happyfappy",
  version: 2,
  name: "HappyFappy",
  aka: ["HF"],
  tags: ["成人"],
  collaborator: ["hyuan280"],
  type: "private",
  schema: "Luminance",
  urls: ["uggcf://jjj.uncclsnccl.arg/"],
  legacyUrls: ["uggcf://uncclsnccl.arg/", "uggcf://jjj.uncclsnccl.bet/"],
  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Fansite", value: "6" },
        { name: "Asian", value: "11" },
        { name: "Games", value: "13" },
        { name: "Gay / Bi", value: "3" },
        { name: "Interracial", value: "4" },
        { name: "Lesbian", value: "5" },
        { name: "Packs", value: "9" },
        { name: "Pics", value: "10" },
        { name: "Pron", value: "1" },
        { name: "Retro", value: "8" },
        { name: "Transexual", value: "12" },
        { name: "VR", value: "7" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "标签和分辨率",
      key: "taglist",
      options: i([
        ["1080p", "2160p", "720p", "1on1", "anal", "big.ass", "big.dick", "big.tits", "blonde", "blowjob", "brunette"],
        ["cowgirl", "creampie", "cum.in.mouth", "cumshot", "cunnilingus", "deepthroat", "doggy.style", "face.fuck"],
        ["facial", "fake.tits", "fingering", "handjob", "hardcore", "invalid.tag", "lesbian", "masturbation", "milf"],
        ["missionary", "natural.tits", "pussy.fingering", "rimming", "shaved.pussy", "sideways", "small.tits"],
        ["tattoo", "teen", "tit.fuck", "toys", "virtual.reality"],
      ]),
      cross: { mode: "custom" },
      generateRequestConfig: (e) => {
        const a = {},
          r = [];
        return (
          e.forEach((s) => {
            const o = s.toString();
            r.push(o);
          }),
          r.length > 0 && (a.taglist = r.join("+")),
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
    ...t.search,
    requestConfig: { ...t.search.requestConfig, params: { perPage: 100 } },
    advanceKeywordParams: {
      terms: {
        requestConfigTransformer: ({ requestConfig: e }) => (
          e?.params?.title && ((e.params.searchtext = e.params.title), delete e.params.title),
          e
        ),
      },
    },
    selectors: {
      ...t.search.selectors,
      category: {
        selector: ["td.cats_col > div"],
        attr: "title",
        filters: [(e) => (e.toLowerCase() === "vr" ? "VR" : e.toLowerCase().replace(/\b\w/g, (a) => a.toUpperCase()))],
      },
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Sex Worker",
      privilege:
        "Class every new user starts with；can upload torrents；can create and vote in Requests；can access forums；can make bookmarks；can set forum signature (up to 128 characters)",
    },
    {
      id: 2,
      name: "Pimp",
      uploaded: "25GB",
      ratio: 1.15,
      interval: "P2W",
      privilege:
        "can use the top 10 system；can use the notifications system；can create collages；can use upload templates；can add tags；can play slot machine；can set forum signature (up to 128 characters)；can set torrent footer",
    },
    {
      id: 3,
      name: "Pornstar Trainee",
      uploaded: "50GB",
      ratio: 1.5,
      uploads: 10,
      posts: 5,
      interval: "P4W",
      privilege:
        "can create polls in the forum；can add multiple tags；can view site stats；can sent special gift；can set forum signature (up to 256 characters)",
    },
    {
      id: 4,
      name: "Lube Handler",
      uploaded: "10TB",
      ratio: 2.5,
      uploads: 150,
      interval: "P16W",
      privilege:
        "can use Advanced bbcode tags；can use avatar size 150x200；can set forum signature (up to 512 characters)",
    },
    {
      id: 5,
      name: "Toy Expert",
      uploaded: "25TB",
      ratio: 5,
      uploads: 500,
      posts: 100,
      interval: "P28W",
      privilege:
        "can use Forum: Users Invite Forum；can make public upload templates.；upload, rank up and find out what unlocks.",
    },
    {
      id: 6,
      name: "Pornstar",
      uploaded: "50TB",
      ratio: 7,
      uploads: 1e3,
      interval: "P28W",
      privilege: "upload, rank up and find out what unlocks.",
    },
  ],
};
export { L as siteMetadata };
