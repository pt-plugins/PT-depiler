import { SchemaMetadata as e } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
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
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const T = {
  ...e,
  version: 1,
  id: "sugoimusic",
  name: "SugoiMusic",
  aka: ["SM"],
  description:
    "SugoiMusic is a private tracker focused on Asian music: music, concerts, PVs, variety & drama shows, Blu-ray/DVDs, and pictures.",
  tags: ["音乐", "亚洲音乐"],
  timezoneOffset: "+0800",
  collaborator: ["MewX"],
  type: "private",
  schema: "GazelleJSONAPI",
  urls: ["https://sugoimusic.me/"],
  search: { ...e.search, advanceKeywordParams: { imdb: !1 } },
  levelRequirements: [
    {
      id: 1,
      name: "User",
      bonus: 0,
      uploads: 0,
      uploaded: "0B",
      ratio: 0,
      privilege: "Default class; SugoiMusic ;) ; Can access basic Top 10",
    },
    {
      id: 2,
      name: "Member",
      bonus: 1e3,
      uploads: 0,
      uploaded: "0B",
      ratio: 0,
      privilege: "Top 10 filters; Make requests; Use torrent notifications system",
    },
    {
      id: 3,
      name: "Merit",
      bonus: 2500,
      uploads: 5,
      uploaded: "0B",
      ratio: 0,
      isKept: !0,
      privilege: "Comment in Suggestions forum; Inactivity-pruning disabled",
    },
    {
      id: 4,
      name: "Power User",
      bonus: 5e3,
      uploads: 25,
      uploaded: "1GB",
      ratio: 0,
      isKept: !0,
      privilege:
        "Power User Forum; Batch download torrents; Collage subscriptions; Edit artist/group info; Make new suggestions",
    },
    {
      id: 5,
      name: "Extreme User",
      bonus: 25e3,
      uploads: 50,
      uploaded: "5GB",
      ratio: 0,
      isKept: !0,
      privilege: "1 Personal collage; Submit 1 login background; Add/delete own screenshots",
    },
    {
      id: 6,
      name: "Pro User",
      bonus: 1e5,
      uploads: 200,
      uploaded: "20GB",
      ratio: 0,
      isKept: !0,
      privilege: "Invite forum; 2 Personal collages; Comment on suggestions/bugs forums",
    },
    {
      id: 7,
      name: "Commandant",
      bonus: 25e4,
      uploads: 500,
      uploaded: "50GB",
      ratio: 0,
      isKept: !0,
      privilege: "Search results beyond page 20; 4 Personal collages; Rename own collages",
    },
    {
      id: 8,
      name: "Elite",
      bonus: 5e5,
      uploads: 1e3,
      uploaded: "200GB",
      ratio: 0,
      isKept: !0,
      privilege: "Elite Forum; 5 Personal collages; Edit any torrent; Add artists to groups",
    },
    {
      id: 9,
      name: "Senior Elite",
      bonus: 75e4,
      uploads: 2e3,
      uploaded: "300GB",
      ratio: 0,
      isKept: !0,
      privilege: "Create polls; Delete tags",
    },
    {
      id: 10,
      name: "Patriarch / Matriarch",
      bonus: 15e5,
      uploads: 3e3,
      uploaded: "500GB",
      ratio: 0,
      isKept: !0,
      privilege: "6 Personal collages; Create a forum (with staff approval of topic)",
    },
    {
      id: 11,
      name: "Torrent Master",
      bonus: 3e6,
      uploads: 5e3,
      uploaded: "2TB",
      ratio: 0,
      isKept: !0,
      privilege: "Torrent Master forum; 7 Personal collages; Project Team invite; Forum double post",
    },
    {
      id: 12,
      name: "Senior Torrent Master",
      bonus: 5e6,
      uploads: 7500,
      uploaded: "3TB",
      ratio: 0,
      isKept: !0,
      privilege: "8 Personal collages; Submit a contest",
    },
    {
      id: 13,
      name: "Elite Torrent Master",
      bonus: 1e7,
      uploads: 1e4,
      uploaded: "5TB",
      ratio: 0,
      isKept: !0,
      privilege: "9 Personal collages; Request debug info; JPS Blue horse badge",
    },
    {
      id: 14,
      name: "Overlord / Dame",
      bonus: 15e6,
      uploads: 15e3,
      uploaded: "10TB",
      ratio: 0,
      isKept: !0,
      privilege: "Unlimited collages & invites; Custom badge; Create multiple forums",
    },
    {
      id: 15,
      name: "Torrent God / Goddess",
      bonus: 5e7,
      uploads: 2e4,
      uploaded: "50TB",
      ratio: 0,
      isKept: !0,
      privilege: "Custom forum header colour; Personal class name; Secret perks",
    },
  ],
};
export { T as siteMetadata };
