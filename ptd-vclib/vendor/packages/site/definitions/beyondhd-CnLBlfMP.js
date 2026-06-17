import { o as u } from "../../../es-toolkit/omit-BqXgNNTz.js";
import { t as o } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { E as n, N as p } from "../types/base-Dy_28wGT.js";
import h from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import { a as c } from "../utils/datetime-DQxMK7bP.js";
import { a as d } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const U = {
  version: 2,
  id: "beyondhd",
  name: "BeyondHD",
  aka: ["BHD"],
  description:
    "Beyond Your Imagination, BeyondHD is a community-built Movie/TV database.Every piece of data has been added by our amazing community since 2012.",
  tags: ["电影", "电视剧"],
  timezoneOffset: "+0000",
  collaborator: ["lengmianxia"],
  type: "private",
  schema: "F3NIX",
  urls: ["uggcf://orlbaq-uq.zr/"],
  category: [
    {
      name: "Category",
      key: "categories",
      keyPath: "data",
      options: [
        { name: "Movies", value: "1" },
        { name: "TV", value: "2" },
      ],
      cross: !1,
    },
    {
      name: "Type",
      key: "types",
      keyPath: "data",
      options: d([
        ["UHD 100", "UHD 66", "UHD 50", "UHD Remux"],
        ["BD 50", "BD 25", "BD Remux"],
        ["2160p", "1080p", "1080i", "720p", "576p", "540p"],
        ["DVD 9", "DVD 5", "DVD Remux"],
        ["480p", "Other"],
      ]),
      cross: { mode: "comma" },
    },
    {
      name: "Source",
      key: "sources",
      keyPath: "data",
      options: d(["Blu-ray", "HD-DVD", "WEB", "HDTV", "DVD"]),
      cross: { mode: "comma" },
    },
    {
      name: "ReleaseGroup",
      key: "groups",
      keyPath: "data",
      options: d(["FraMeSToR", "BHDStudio", "BeyondHD", "RPG", "iROBOT", "iFT", "ZR", "MKVULTRA"]),
      cross: { mode: "comma" },
    },
    { name: "Internal", key: "types", keyPath: "data", options: [{ name: "Yes", value: "1" }] },
    {
      name: "Discount",
      key: "discount",
      keyPath: "data",
      options: [
        { name: "Freeleech", value: "freeleech" },
        { name: "Freeleech (Limited)", value: "limited" },
        { name: "25% Promo", value: "promo25" },
        { name: "50% Promo", value: "promo50" },
        { name: "75% Promo", value: "promo75" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "SpecialDiscount",
      key: "specialDiscount",
      keyPath: "data",
      options: [
        { name: "Refund", value: "refund" },
        { name: "Rescue", value: "rescue" },
        { name: "Rewind", value: "rewind" },
        { name: "Reboot", value: "reboot" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Special",
      key: "special",
      keyPath: "data",
      options: [
        { name: "SD", value: "sd" },
        { name: "TV Pack", value: "pack" },
        { name: "Stream Optimized", value: "stream" },
        { name: "h264 codec", value: "h264" },
        { name: "h265 codec", value: "h265" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Health",
      key: "health",
      keyPath: "data",
      options: [
        { name: "Alive", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "Reseed", value: "reseed" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "种子状态",
      key: "seedStatus",
      options: [
        { name: "seeding", value: "seeding" },
        { name: "leeching", value: "leeching" },
        { name: "completed", value: "completed" },
        { name: "incomplete", value: "incomplete" },
        { name: "notdownload", value: "notdownload" },
      ],
      cross: { mode: "append", key: "" },
    },
  ],
  search: {
    skipNonLatinCharacters: !0,
    keywordPath: "data.search",
    requestConfig: { url: "/api/torrents", method: "POST", data: { action: "search" }, responseType: "json" },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: a }) => (
          a?.data?.search && ((a.data.imdb_id = a.data.search), delete a.data.search),
          a
        ),
      },
      tmdb: {
        requestConfigTransformer: ({ requestConfig: a }) => (
          a?.data?.search && ((a.data.tmdb_id = a.data.search), delete a.data.search),
          a
        ),
      },
    },
    selectors: {
      rows: { selector: "results" },
      id: { selector: "id" },
      title: { selector: "name" },
      url: { selector: "url" },
      link: { selector: ["download_url", "url"], filters: [{ name: "replace", args: ["torrents", "download"] }] },
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      author: { text: "N/A", selector: "uploaded_by" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      comments: { text: "N/A" },
      category: { selector: "category" },
      ext_imdb: { selector: "imdb_id" },
    },
  },
  list: [],
  detail: {
    urlPattern: ["/torrents/(.+)\\.(\\d+)"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (a) => {
          const e = a.URL.match(/\/torrents\/(.+)\.(\d+)/);
          if (e && e[2]) return e[2];
        },
      },
      title: {
        selector: ["tr:has(td:first-child:contains('Name')) > td:last-child"],
        switchFilters: {
          "tr:has(td:first-child:contains('Name')) > td:last-child": [
            (a) => {
              if (a) return a;
            },
          ],
        },
      },
      link: { selector: ["a[href*='/download/']"], attr: "href" },
    },
  },
  userInfo: {
    pickLast: ["name", "id"],
    selectors: {
      name: { selector: ["img.beta-image-avatar"], attr: "title" },
      id: { selector: ["meta[name='secret-id']"], attr: "content" },
      uploaded: { selector: ["ul#beta-stats li a:has(> i.fas.fa-arrow-up)"], filters: [{ name: "parseSize" }] },
      downloaded: { selector: ["ul#beta-stats li a:has(> i.fas.fa-arrow-down)"], filters: [{ name: "parseSize" }] },
      ratio: { selector: ["ul#beta-stats li a:has(> span > i.fas.fa-sync-alt)"], filters: [{ name: "parseNumber" }] },
      bonus: { selector: ["ul#beta-stats li a:has(> i.fas.fa-star)"], filters: [{ name: "parseNumber" }] },
      seeding: { selector: ["ul#beta-stats li a:has(> i.fas.fa-seedling)"], filters: [{ name: "parseNumber" }] },
      hnrUnsatisfied: {
        selector: ["ul#beta-stats li a:has(> i.fas.fa-skull-crossbones)"],
        filters: [{ name: "parseNumber" }],
      },
      levelName: { selector: ["div[style*='margin-left'] a.beta-alert"], attr: "title" },
      uploads: {
        selector: [".button-right .bhd-block:nth-child(1) .class-highlight"],
        filters: [(a) => a.replace(/,/g, "").match(/\d+/)?.[0] ?? ""],
      },
      leeching: { selector: [".button-right .bhd-block:nth-child(2) .bhd-tidbit-icon"] },
      snatches: { selector: [".button-right .bhd-block:nth-child(4) .bhd-tidbit-icon"] },
      trueRatio: { selector: ["td.bhd-user-left:contains('Real Ratio') + td span.badge-user"] },
      joinTime: {
        selector: ["div.button-holder h5:contains('Member Since: ')"],
        filters: [
          (a) => {
            const t = a.match(/Member Since:\s*(\d{4}-\d{2}-\d{2})/);
            return t ? t[1] : a;
          },
          { name: "parseTime", args: ["yyyy-MM-dd"] },
        ],
      },
      seedingSize: {
        selector: ["td.bhd-user-left:contains('Active Seed Size') + td span.badge-user"],
        filters: [{ name: "parseSize" }],
      },
      seedingTime: {
        selector: ["td.bhd-user-left:contains('Total Seedtime') + td span.badge-user"],
        elementProcess: (a) => {
          const e = "P" + (a.textContent?.trim() || "").replace(/\s+/g, "").replace(/(\d+[YMD])(\d+[hms])/i, "$1T$2");
          return c(e);
        },
      },
      averageSeedingTime: {
        selector: ["td.bhd-user-left:contains('Average Seedtime') + td span.badge-user"],
        elementProcess: (a) => {
          const e = "P" + (a.textContent?.trim() || "").replace(/\s+/g, "").replace(/(\d+[YMD])(\d+[hms])/i, "$1T$2");
          return c(e);
        },
      },
      specialSeedsize: {
        selector: ["td.bhd-user-left:contains('Special Seed Size') + td span.badge-user"],
        filters: [{ name: "parseSize" }],
      },
      messageCount: { text: 0, selector: [".beta-alert[title='Private Messages'] .notify"], elementProcess: () => 11 },
      bonusPerHour: {
        selector: [".panel-body.no-padding .hd-table > div:first-child .class-bold"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Recruit",
      ratio: 0.25,
      privilege:
        "Can Download; Can rescue 5 torrents per day until 25 pending completion; Members in this class are capped at receiving 1,000 BP in gifts/tips per member.",
    },
    {
      id: 2,
      name: "User",
      ratio: 0.25,
      uploaded: "50GiB",
      interval: "P14D",
      seedingTime: "P25D",
      snatches: 5,
      privilege:
        "Can Request Reseeds; Can Request Torrents; Can Remove HNRs (with BP); Bypass Upload Moderation; Change Avatar;Can rescue 6 torrents per day until 30 pending completion.",
    },
    {
      id: 3,
      name: "Member",
      ratio: 0.4,
      uploaded: "400GiB",
      interval: "P1M",
      averageSeedingTime: "P10D",
      seedingTime: "P8M10D",
      snatches: 25,
      privilege:
        "View Workhouse; View Internals; View Staff; View Site Stats; Change Title; Change About; Change Signature; Can rescue 10 torrents per day until 30 pending completion.",
    },
    {
      id: 4,
      name: "Expert",
      ratio: 0.55,
      uploaded: "800GiB",
      interval: "P3M",
      averageSeedingTime: "P15D",
      seedingTime: "P2Y20D",
      snatches: 50,
      privilege:
        "Send Invites; View Torrent Peers; View Torrent History; Change Profile Cover; Can rescue 11 torrents per day until 33 pending completion.",
    },
    {
      id: 5,
      name: "Pro",
      ratio: 0.7,
      uploaded: "1.25TiB",
      interval: "P6M",
      averageSeedingTime: "P30D",
      seedingTime: "P4Y11M",
      specialSeedsize: "500GiB",
      snatches: 60,
      privilege: "View Invite Forum; View Chat History; Can rescue 12 torrents per day until 36 pending completion.",
    },
    {
      id: 6,
      name: "Elite",
      ratio: 0.85,
      uploaded: "2.5TiB",
      interval: "P9M",
      averageSeedingTime: "P45D",
      seedingTime: "P9Y3M",
      specialSeedsize: "2TiB",
      snatches: 75,
      privilege:
        "Can rescue 15 torrents per day until 45 pending completion. Receive 2 FL token(s) for every 30 days this class is retained.",
    },
    {
      id: 7,
      name: "Master",
      ratio: 1,
      uploaded: "8TiB",
      interval: "P1Y",
      averageSeedingTime: "P60D",
      seedingTime: "P41Y1M5D",
      specialSeedsize: "4TiB",
      snatches: 250,
      privilege:
        "View Torrent Changes; View Movie / TV Edits; Can rescue 16 torrents per day until 48 pending completion. Receive 2 FL token(s) for every 30 days this class is retained. Receive 25% discount on all downloads.",
    },
    {
      id: 8,
      name: "King",
      ratio: 1.25,
      uploaded: "24TiB",
      interval: "P2Y",
      averageSeedingTime: "P90D",
      seedingTime: "P123Y3M15D",
      specialSeedsize: "8TiB",
      snatches: 500,
      privilege:
        "Edit Movie / TV Details; Can rescue 20 torrents per day until 60 pending completion. Receive 2 FL token(s) for every 30 days this class is retained. Receive 50% discount on all downloads.",
    },
    {
      id: 9,
      name: "Emperor",
      ratio: 4,
      uploaded: "96TiB",
      download: "24TiB",
      interval: "P5Y",
      averageSeedingTime: "P180D",
      seedingTime: "P123Y3M15D",
      specialSeedsize: "48TiB",
      snatches: 1e4,
      privilege:
        "Can rescue 40 torrents per day until 120 pending completion. Receive 5 FL token(s) for every 30 days this class is retained. Receive 1 invite(s) for every 30 days this class is retained. Receive 100% discount on all downloads.",
    },
    { id: 100, name: "Pirater", groupType: "vip" },
    { id: 101, name: "Celebrity", groupType: "vip" },
    { id: 102, name: "Legend", groupType: "vip" },
    { id: 103, name: "Uploader", groupType: "vip" },
    { id: 104, name: "Internal", groupType: "vip" },
    { id: 200, name: "Moderator", groupType: "manager" },
    { id: 201, name: "Bot", groupType: "manager" },
    { id: 202, name: "SysOp", groupType: "manager" },
  ],
  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key",
      hint: "Find the API keys under your security settings (your profile picture -> my security)",
      required: !0,
    },
    {
      name: "rsskey",
      label: "RSS Key",
      hint: "Your personal RSS key (RID) if you wish get download_url without cookies",
      required: !1,
    },
  ],
};
class L extends h {
  async getUserInfoResult(t = {}) {
    let e = { status: n.unknownError, updateAt: +new Date(), site: this.metadata.id };
    if (!this.allowQueryUserInfo) return ((e.status = n.passParse), e);
    try {
      ((e = o(e, await this.getUserBaseInfoFromSite())),
        t !== null && t.name && t.id
          ? (e = o(e, await this.getUserExtendInfoFromDetails(t.name, t.id)))
          : (e = o(e, await this.getUserExtendInfoFromDetails(e.name, e.id))),
        (e = o(e, await this.getBonusPerHourFromBonus())),
        this.metadata.levelRequirements &&
          e.levelName &&
          typeof e.levelId > "u" &&
          (e.levelId = this.guessUserLevelId(e)),
        (e.status = n.success));
    } catch (i) {
      ((e.status = n.parseError), i instanceof p && (e.status = n.needLogin));
    }
    return e;
  }
  async getUserBaseInfoFromSite() {
    const { data: t } = await this.request({ url: "/", responseType: "document" }, !0);
    return this.getFieldsData(t, this.metadata.userInfo?.selectors, ["id", "name"]);
  }
  async getUserExtendInfoFromDetails(t, e) {
    const { data: i } = await this.request({ url: `/users/${t}.${e}`, responseType: "document" });
    return this.getFieldsData(
      i,
      this.metadata.userInfo?.selectors,
      Object.keys(u(this.metadata.userInfo?.selectors, ["id", "name"])),
    );
  }
  async getBonusPerHourFromBonus() {
    const { data: t } = await this.request({ url: "/bp", responseType: "document" });
    return this.getFieldsData(t, this.metadata.userInfo?.selectors, ["bonusPerHour"]);
  }
  async request(t, e = !0) {
    if (t.url === "/api/torrents") {
      const i = this.userConfig.inputSetting?.apikey ?? "",
        r = this.userConfig.inputSetting?.rsskey ?? "";
      ((t.url = `/api/torrents/${i}`), (t.data = { ...t.data, rsskey: `${r}` }));
    }
    return await super.request(t, e);
  }
  loggedCheck(t) {
    return (t.config.url?.startsWith("/api") ?? !1)
      ? t.data?.success === !0 && t.data?.status_code === 1
      : super.loggedCheck(t);
  }
  parseTorrentRowForTags(t, e, i) {
    const r = [],
      l = {
        exclusive: { name: "Excl.", color: "deep-orange-darken-1" },
        promo25: { name: "75%", color: "lime-darken-3" },
        promo50: { name: "50%", color: "orange" },
        promo75: { name: "25%", color: "purple" },
        freeleech: { name: "Freeleech", color: "blue" },
        limited: { name: "Freeleech(UL)", color: "blue-lighten-3" },
        rewind: { name: "Rewind" },
        refund: { name: "Refund" },
        rescue: { name: "Rescue" },
        reboot: { name: "Reboot" },
        tv_pack: { name: "完结" },
      };
    for (const s of Object.keys(l)) s in e && e[s] === 1 && r.push(l[s]);
    const m = /(Chinese|Cantonese)(\s*\(.*\))?/i;
    return (
      e.audios
        ?.split(", ")
        .filter((s) => s.trim() !== "")
        ?.some((s) => m.test(s)) && r.push({ name: "中配" }),
      e.subtitles
        ?.split(", ")
        .filter((s) => s.trim() !== "")
        ?.some((s) => m.test(s)) && r.push({ name: "中字" }),
      r.push({ name: "H&R", color: "red" }),
      (t.tags = r),
      t
    );
  }
}
export { L as default, U as siteMetadata };
