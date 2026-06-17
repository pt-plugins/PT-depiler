import { o as c } from "../../../es-toolkit/omit-BqXgNNTz.js";
import { t as m } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { E as n, N as d } from "../types/base-Dy_28wGT.js";
import { E as s } from "../types/torrent-BvvY2NbA.js";
import u from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import { f as p } from "../utils/datetime-DQxMK7bP.js";
import { p as f } from "../utils/filesize-D_1hx4u8.js";
import { a as h } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/filter-Dko2hrfF.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const _ = {
  id: "aidoruonline",
  version: 1,
  name: "Aidoru!Online",
  tags: ["偶像"],
  collaborator: ["hyuan280"],
  type: "private",
  schema: "AidoruOnline",
  urls: ["uggcf://nvqbeh-bayvar.zr/"],
  category: [
    { name: "类别", key: "pcat", options: h(["Show All", "48G", "Games", "Stardust", "Other"]) },
    {
      name: "规格",
      key: "scat",
      options: [
        { name: "BD/DVDISO", value: "1" },
        { name: "BD/DVD-RIP", value: "2" },
        { name: "TV", value: "3" },
        { name: "Perf", value: "4" },
        { name: "PV", value: "5" },
        { name: "Webstream", value: "6" },
        { name: "Image", value: "7" },
        { name: "Audio", value: "8" },
        { name: "Album", value: "9" },
        { name: "Single", value: "10" },
        { name: "Radio", value: "11" },
        { name: "Misc", value: "12" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { name: "Resurrected", value: "resd" },
        { name: "Freeleech", value: "fl" },
        { name: "Subtitled", value: "subbed" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (t) => {
        const r = {};
        return (
          t.forEach((e) => {
            r[e] = "1";
          }),
          { requestConfig: { params: r } }
        );
      },
    },
    {
      name: "搜索类型",
      key: "typ",
      options: [
        { name: "Name", value: "name" },
        { name: "Description", value: "descr" },
        { name: "Name & Descr", value: "both" },
      ],
    },
    {
      name: "活跃度",
      key: "deadlive",
      options: [
        { name: "Active Transfers", value: 0 },
        { name: "Include Dead", value: 1 },
        { name: "Only Dead", value: 2 },
        { name: "Need Seed", value: 3 },
      ],
    },
  ],
  search: {
    requestConfig: {
      url: "/get_ttable.php",
      params: {
        pcat: "Show+All",
        typ: "name",
        scat: "",
        subbed: "",
        fl: "",
        resd: "",
        p: 0,
        searchstr: "",
        deadlive: 0,
      },
    },
    keywordPath: "params.searchstr",
    selectors: {
      rows: { selector: "tr.t-row" },
      id: {
        selector: ["a[href*='torrents-details.php?id=']:not([href*='#'])"],
        attr: "href",
        filters: [(t) => t.match(/torrents-details\.php\?id=(\d+)/)[1]],
      },
      title: { selector: ["a[href*='torrents-details.php?id=']:not([href*='#']) b"] },
      url: { selector: ["a[href*='torrents-details.php?id=']:not([href*='#'])"], attr: "href" },
      link: { selector: ["a[href*='download.php?id=']"], attr: "href" },
      time: { selector: ["td.ttable_timestamp"], filters: [(t) => p(t, ["MMddyy HH:mm:ss"])] },
      size: { selector: ["td.ttable_size"], filters: [{ name: "parseSize" }] },
      author: { selector: ["a[href*='account-details.php?id=']"] },
      seeders: { selector: ["font[color='green'] > b"], filters: [{ name: "parseNumber" }] },
      leechers: { selector: ["font[color='#ff0000'] > b"], filters: [{ name: "parseNumber" }] },
      completed: { selector: ["font[color='black'] > b"], filters: [{ name: "parseNumber" }] },
      comments: { selector: ["a.comment-link"], filters: [{ name: "parseNumber" }] },
      category: { selector: ["a.category-link"], filters: [(t) => t.split(":")[1].trim()] },
      tags: [
        { name: "Free", selector: "img[title='freeleech']", color: "blue" },
        { name: "sub", selector: "img[title='subtitled']", color: "orange" },
      ],
      status: {
        selector: ":self",
        elementProcess: (t) =>
          t
            ? t.querySelector("td.ttable_seeding font[color='green']")
              ? s.seeding
              : t.querySelector("td.ttable_seeding font[color='#ff0000']")
                ? s.downloading
                : t.querySelector("td.ttable_seeding font[color='black']")
                  ? s.completed
                  : s.unknown
            : s.unknown,
      },
      progress: {
        selector: ":self",
        elementProcess: (t) =>
          t
            ? t.querySelector("td.ttable_seeding font[color='green']") ||
              t.querySelector("td.ttable_seeding font[color='black']")
              ? 100
              : s.unknown
            : s.unknown,
      },
    },
  },
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    selectors: {
      id: {
        selector: ["a[href*='member.php?action=profile']"],
        attr: "href",
        filters: [(t) => t.match(/uid=(\d+)/)[1]],
      },
      name: { selector: ["td.prof-lbl:contains('Username:') + td"] },
      joinTime: { selector: ["td.prof-lbl:contains('Joined:') + td"], filters: [{ name: "parseTime" }] },
      uploaded: { selector: ["td.prof-lbl:contains('Uploaded:') + td"], filters: [{ name: "parseSize" }] },
      downloaded: { selector: ["td.prof-lbl:contains('Downloaded:') + td"], filters: [{ name: "parseSize" }] },
      levelName: { selector: ["td.prof-lbl:contains('User Class:') + td"] },
      ratio: {
        selector: ["td.prof-lbl:contains('Ratio:') + td"],
        filters: [(t) => (t.trim() === "---" ? -1 : parseFloat(t))],
      },
      uploads: { selector: ["td.prof-lbl:contains('Uploads:') + td"], filters: [{ name: "parseNumber" }] },
      seeding: { selector: ["span[id='seed-count']"], filters: [{ name: "parseNumber" }] },
      seedingPage: {
        selector: ["div[id='seed-search-stat']"],
        filters: [(t) => parseInt(t?.match(/Page (\d+) \//)?.[1] ?? "0")],
      },
      bonus: { text: "0" },
      seedingSize: {
        selector: ":self",
        elementProcess: (t) => {
          if (!t) return 0;
          const r = t.querySelectorAll("tr");
          let e = 0;
          return (
            r.forEach((a) => {
              const i = a.querySelectorAll("td");
              if (i.length >= 4) {
                const l = i[3].textContent?.trim() || "";
                e += f(l.replace(/,/g, ""));
              }
            }),
            e
          );
        },
      },
    },
  },
  list: [{ urlPattern: ["/(index.php|torrents-search.php)$"] }],
  detail: {
    urlPattern: ["/torrents-details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: ["div.myFrame td:contains('Name:') + td"] },
      id: { selector: ["a[href*='download.php?id=']"], attr: "href", filters: [(t) => t.match(/id=(\d+)/)[1]] },
      link: { selector: ["a[href*='download.php?id=']"], attr: "href" },
    },
  },
  levelRequirements: [
    { id: 1, name: "Member", privilege: "Can download, upload torrents；Ratio effects availability of new torrents" },
    {
      id: 2,
      name: "Sharer ",
      uploads: 50,
      averageSeedingTime: "P20H",
      interval: "P6M",
      privilege:
        "Can download, upload torrents；Ratio has no effect on availability of new torrents；Notification and highlighting of new comments",
    },
    {
      id: 3,
      name: "Distributor",
      uploads: 500,
      averageSeedingTime: "P5D",
      ratio: 1,
      privilege:
        "Can download, upload torrents；Ratio has no effect on availability of new torrents；Notification and highlighting of new comments；Can view peers on torrents；Can view user list of who completed downloading a torrent",
    },
    { id: 4, name: "Uploader", privilege: "user who uploads new content to the site on a regular basis" },
    { id: 5, name: "Uploader+", privilege: "uploader who has a low freeleech ratio" },
  ],
};
class H extends u {
  async getUserInfoResult(r = {}) {
    let e = { status: n.unknownError, updateAt: +new Date(), site: this.metadata.id };
    if (!this.allowQueryUserInfo) return ((e.status = n.passParse), e);
    try {
      let a;
      (r !== null && r.id ? (a = r.id) : (a = await this.getUserIdFromUserCP()),
        (e.id = a),
        (e = m(e, await this.getUserInfoFromDetailsPage())),
        (e = await this.getUserSeedingFields(e)),
        this.metadata.levelRequirements &&
          e.levelName &&
          typeof e.levelId > "u" &&
          (e.levelId = this.guessUserLevelId(e)),
        (e.status = n.success));
    } catch (a) {
      ((e.status = n.parseError), a instanceof d && (e.status = n.needLogin));
    }
    return e;
  }
  async getUserIdFromUserCP() {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: r } = await this.request({ url: "/forum/usercp.php", responseType: "document" }, !0),
      e = r.querySelectorAll("[href]");
    if (
      Array.from(e)
        .map((o) => o.getAttribute("href"))
        .some((o) => o && o.toLowerCase().includes("action=login"))
    )
      throw new d("检测到包含action=login的链接，需要重新登录");
    return this.getFieldData(r, this.metadata.userInfo?.selectors?.id);
  }
  async getUserInfoFromDetailsPage() {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: r } = await this.request({ url: "/account.php", responseType: "document" });
    if (!r || !r.title) throw new d("请求未获取到数据，需要重新登录");
    return this.getFieldsData(
      r,
      this.metadata.userInfo?.selectors,
      Object.keys(c(this.metadata.userInfo?.selectors, ["id", "seedingSize"])),
    );
  }
  async getUserSeedingFields(r) {
    if ((await this.sleepAction(this.metadata.userInfo?.requestDelay), (r.seedingSize = 0), r && r.seedingPage))
      for (let e = 0; e < r.seedingPage; e++) {
        const { data: a } = await this.request({
            url: `/get_account_peers.php?uid=&p=${e}&type=seed&searchstr=`,
            responseType: "text",
          }),
          i = `<table><tbody>${a}</tbody></table>`,
          l = new DOMParser().parseFromString(i, "text/html");
        r.seedingSize += this.getFieldData(l, this.metadata.userInfo?.selectors?.seedingSize);
      }
    return r;
  }
  async getTorrentDownloadLink(r) {
    const e = await super.getTorrentDownloadLink(r);
    if (e && !e.includes("download.php")) {
      const { data: a } = await this.request({ url: e, responseType: "document" });
      return this.getFieldData(a, this.metadata.search?.selectors?.link);
    }
    return e;
  }
}
export { H as default, _ as siteMetadata };
