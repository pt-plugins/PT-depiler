import l, { SchemaMetadata as e } from "../schemas/Rartracker-Hen9WwNJ.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
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
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const r = { 0: "Medlem", 1: "Fullvärdig medlem", 2: "Trogen medlem", 3: "Veteran", 4: "Legend" },
  V = {
    ...e,
    version: 1,
    id: "superbits",
    name: "Superbits",
    description: "Sveriges största bittorrent tracker.",
    tags: ["综合", "影视", "瑞典"],
    timezoneOffset: "+0100",
    collaborator: [],
    type: "private",
    schema: "Rartracker",
    urls: ["uggcf://fhcreovgf.bet/"],
    category: [
      {
        name: "Category",
        key: "section",
        options: [
          { name: "Nytt", value: "nytt" },
          { name: "P2P", value: "p2p" },
          { name: "Musik", value: "musik" },
          { name: "TV-Serier", value: "tvserier" },
          { name: "Arkiv", value: "arkiv" },
          { name: "Movie", value: "movie" },
          { name: "Swedish TV", value: "swetv" },
        ],
        cross: { mode: "append" },
      },
    ],
    search: {
      ...e.search,
      requestConfig: {
        ...e.search.requestConfig,
        params: {
          ...e.search.requestConfig.params,
          order: "desc",
          sort: "d",
          freeleech: !1,
          stereoscopic: !1,
          swesub: !1,
          dksub: !1,
          nosub: !1,
          fisub: !1,
          enaudio: !1,
          p2p: !1,
        },
      },
      selectors: { ...e.search.selectors, completed: { selector: "timesCompleted" }, author: { text: "" } },
    },
    userInfo: {
      ...e.userInfo,
      process: [
        {
          ...e.userInfo.process[0],
          selectors: {
            ...e.userInfo.process[0].selectors,
            levelId: { selector: "user.class" },
            levelName: { selector: "user.class", filters: [(t) => r[t] ?? `Class ${t}`] },
          },
        },
        {
          ...e.userInfo.process[1],
          selectors: { ...e.userInfo.process[1].selectors, seeding: { selector: "peersSeeder" } },
        },
      ],
    },
    levelRequirements: [
      { id: 0, name: r[0], privilege: "新用户的默认等级。" },
      {
        id: 1,
        name: r[1],
        interval: "P14D",
        uploaded: "50GiB",
        ratio: 1.05,
        privilege: "可以创建和上传 requests，使用积分系统及站点其他功能。",
      },
      {
        id: 2,
        name: r[2],
        interval: "P15W",
        uploaded: "300GiB",
        ratio: 1.1,
        privilege: "访问所有排行榜，使用邀请系统。IP 日志被清除且关闭 IP 记录。可在 P2P 和 Arkiv 上传种子。",
      },
      { id: 3, name: r[3], interval: "P30W", uploaded: "1.2TiB", ratio: 1.1, privilege: "可以查看 Veteran 论坛。" },
      { id: 4, name: r[4], interval: "P3Y", uploaded: "30TiB", ratio: 2.1, privilege: "访问大部分功能。" },
    ],
  };
class x extends l {
  parseTorrentRowForTags(a, o, p) {
    const s = a.tags || [];
    if (!(o instanceof Node)) {
      const i = o;
      (i.frileech === 1 && s.push({ name: "Free", color: "blue" }),
        i.swesub === 1 && s.push({ name: "SweSub" }),
        i.pack === 1 && s.push({ name: "Pack" }));
    }
    return (s.length > 0 && (a.tags = s), a);
  }
}
export { x as default, V as siteMetadata };
