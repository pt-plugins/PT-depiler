import { GazelleBase as u } from "./Gazelle-C72SbirH.js";
import { a3 as n } from "../index-COeZNva1.js";
import { e as c } from "../utils/datetime-DQxMK7bP.js";
import { E as i, N as d } from "../types/base-Dy_28wGT.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "./AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const j = {
  version: 0,
  search: {
    keywordPath: "params.searchstr",
    requestConfig: { url: "/ajax.php", responseType: "json", params: { action: "browse" } },
  },
  userInfo: {
    selectors: {
      id: { selector: ["response.id"] },
      name: { selector: ["response.username"] },
      messageCount: { selector: ["response.notifications.messages"] },
      uploaded: { selector: ["response.userstats.uploaded"] },
      downloaded: { selector: ["response.userstats.downloaded"] },
      ratio: { selector: ["response.userstats.ratio"] },
      levelName: { selector: ["response.userstats.class"] },
      bonus: { selector: ["response.userstats.bonusPoints"] },
      bonusPerHour: {
        selector: ["response.userstats.bonusPointsPerHour", "response.userstats.seedingBonusPointsPerHour"],
      },
      seedingSize: { selector: ["response.userstats.seedingSize"] },
      joinTime: { selector: ["response.stats.joinedDate"], filters: [{ name: "parseTime" }] },
      seeding: { selector: ["response.community.seeding"] },
      uploads: { selector: ["response.community.uploaded"] },
      perfectFlacs: { selector: ["response.community.perfectFlacs"] },
      groups: { selector: ["response.community.groups"] },
      invited: { selector: ["response.community.invited"] },
      lastAccessAt: { selector: ["response.stats.lastAccess"], filters: [{ name: "parseTime" }] },
    },
  },
};
class C extends u {
  _authKey;
  async requestApi(s, e) {
    return await this.request({ url: "/ajax.php", params: { action: s, ...e } });
  }
  async requestApiInfo() {
    const { data: s } = await this.requestApi("index", {});
    return s;
  }
  async getAuthKey() {
    if (!this._authKey) {
      const s = await this.requestApiInfo();
      this._authKey = { authkey: s.response.authkey, passkey: s.response.passkey };
    }
    return this._authKey;
  }
  async transformUnGroupTorrent(s) {
    const { authkey: e, passkey: t } = await this.getAuthKey(),
      a = [];
    return (
      (s.isFreeleech || s.isPersonalFreeleech) && a.push({ name: "Free", color: "blue" }),
      s.isNeutralLeech && a.push({ name: "Neutral", color: "cyan" }),
      {
        site: this.metadata.id,
        id: s.torrentId,
        title: n(s.groupName),
        subTitle: s.tags.join(", "),
        url: `${this.url}torrents.php?id=${s.groupId}&torrentid=${s.torrentId}`,
        link: `${this.url}torrents.php?action=download&id=${s.torrentId}&authkey=${e}&torrent_pass=${t}`,
        time: c(s.groupTime, this.metadata.timezoneOffset),
        size: s.size,
        author: "",
        seeders: s.seeders,
        leechers: s.leechers,
        completed: s.snatches,
        tags: a,
        category: s.category,
      }
    );
  }
  async transformGroupTorrent(s, e) {
    const { authkey: t, passkey: a } = await this.getAuthKey(),
      r = [];
    ((e.isFreeleech || e.isPersonalFreeleech) && r.push({ name: "Free", color: "blue" }),
      e.isNeutralLeech && r.push({ name: "Neutral", color: "cyan" }));
    const o = s.artist ? `${s.artist} - ` : "";
    return {
      site: this.metadata.id,
      id: e.torrentId,
      title: `${o}${n(s.groupName)} [${s.groupYear}] [${s.releaseType}]`,
      subTitle:
        `${e.format} / ${e.encoding} / ${e.media}` +
        (e.hasLog ? ` / Log(${e.logScore})` : "") +
        (e.hasCue ? " / Cue" : "") +
        (e.remastered ? ` / ${e.remasterYear}` : "") +
        (e.remasterTitle ? ` / ${n(e.remasterTitle)}` : "") +
        (e.scene ? " / Scene" : ""),
      url: `${this.url}torrents.php?id=${s.groupId}&torrentid=${e.torrentId}`,
      link: `${this.url}torrents.php?action=download&id=${e.torrentId}&authkey=${t}&torrent_pass=${a}`,
      time: c(e.time, this.metadata.timezoneOffset),
      size: e.size,
      author: "",
      seeders: e.seeders,
      leechers: e.leechers,
      completed: e.snatches,
      category: s.releaseType || "",
      tags: r,
    };
  }
  async transformSearchPage(s, e) {
    const t = [];
    if (s.status === "success") {
      const a = s.response.results;
      for (const r of a)
        if ("torrents" in r)
          for (const o of r.torrents) {
            const l = await this.transformGroupTorrent(r, o);
            t.push(l);
          }
        else {
          const o = await this.transformUnGroupTorrent(r);
          t.push(o);
        }
    }
    return t;
  }
  async getTorrentDownloadLink(s) {
    return this.getTorrentDownloadLinkFactory("torrentid")(s);
  }
  async getUserInfoResult(s = {}) {
    let e = { status: i.unknownError, updateAt: +new Date(), site: this.metadata.id };
    if (!this.allowQueryUserInfo) return ((e.status = i.passParse), e);
    try {
      ((e = { ...e, ...(await this.getUserBaseInfo()) }),
        e.id &&
          ((e = { ...e, ...(await this.getUserExtendInfo(e.id)) }),
          e.seedingSize || (e = { ...e, ...(await this.getSeedingSize(e.id)) }),
          (e = this.cleanupUserInfo(e))),
        this.metadata.levelRequirements &&
          e.levelName &&
          typeof e.levelId > "u" &&
          (e.levelId = this.guessUserLevelId(e)),
        (e.status = i.success));
    } catch (t) {
      ((e.status = i.parseError), t instanceof d && (e.status = i.needLogin));
    }
    return e;
  }
  async getUserBaseInfo() {
    const s = await this.requestApiInfo();
    return this.getFieldsData(s, this.metadata.userInfo.selectors, [
      "id",
      "name",
      "messageCount",
      "uploaded",
      "downloaded",
      "ratio",
      "levelName",
      "bonus",
      "bonusPerHour",
      "seedingSize",
    ]);
  }
  async getUserExtendInfo(s) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: e } = await this.requestApi("user", { id: s });
    return this.getFieldsData(e, this.metadata.userInfo.selectors, [
      "joinTime",
      "seeding",
      "uploads",
      "perfectFlacs",
      "groups",
      "invited",
      "lastAccessAt",
    ]);
  }
  cleanupUserInfo(s) {
    return (
      s.bonus || (s.bonus = "N/A"),
      s.bonusPerHour || (s.bonusPerHour = "N/A"),
      s.perfectFlacs || delete s.perfectFlacs,
      s
    );
  }
}
export { j as SchemaMetadata, C as default };
