import { SchemaMetadata as t } from "../schemas/Luminance-DtLCtoLD.js";
import "../index-COeZNva1.js";
import { b as i } from "../utils/helper-OCngMtkv.js";
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
const o = { 13: "Games", 4: "Misc", 1: "Movies", 2: "TV", 3: "WOC" },
  W = {
    ...t,
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
      { name: "类别", key: "filter_cat", options: i(o), cross: { mode: "appendQuote" } },
      { name: "优惠", key: "filter_freeleech", options: [{ name: "Free", value: 1 }] },
    ],
    search: {
      ...t.search,
      advanceKeywordParams: {
        imdb: {
          requestConfigTransformer: ({ requestConfig: e }) => (
            e?.params?.title && ((e.params.searchtext = e.params.title), delete e.params.title),
            e
          ),
        },
      },
      selectors: {
        ...t.search.selectors,
        category: {
          selector: "td.cats_col > div[title] > a",
          attr: "href",
          filters: [
            (e) => {
              const r = e.match(/filter_cat\[(\d+)\]=/);
              return r ? o[Number(r[1])] : "";
            },
          ],
        },
      },
    },
    levelRequirements: [
      { id: 1, name: "Nostalgic Newcomer", privilege: "Torrent download limit set to 6 torrents per hour." },
      {
        id: 2,
        name: "Retro Rookie",
        interval: "P4W",
        uploaded: "100GiB",
        posts: 1,
        ratio: 1,
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
export { W as siteMetadata };
