import { a3 as f } from "../index-COeZNva1.js";
import { f as y } from "../utils/datetime-DQxMK7bP.js";
import { b as G, a as I } from "../utils/helper-OCngMtkv.js";
import { u as c } from "../../../url-join/url-join-Cu798wIg.js";
import v, { SchemaMetadata as u } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const d = { 1: "Games", 2: "Applications", 3: "E-Books", 4: "OST" },
  U = {
    ...u,
    version: 1,
    id: "gazellegames",
    name: "GazelleGames",
    aka: ["GGn"],
    description: "GazelleGames is a Private gaming tracker",
    tags: ["游戏"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "GazelleJSONAPI",
    urls: ["uggcf://tnmryyrtnzrf.arg/"],
    category: [
      {
        name: "使用组名搜索",
        key: "use_groupname",
        notes: "可以获得更精确的搜索结果",
        options: [
          { name: "不使用", value: 0 },
          { name: "使用", value: 1 },
        ],
      },
      { name: "类别", key: "filter_cat", options: G(d), cross: { mode: "appendQuote" } },
      { name: "评级", key: "rating", options: I(["3+", "7+", "12+", "16+", "18+", "N/A"]) },
      {
        name: "促销方案",
        key: "freetorrent",
        options: [
          { name: "Free", value: 1 },
          { name: "Neutral", value: 2 },
          { name: "Either", value: 3 },
          { name: "Normal", value: 4 },
        ],
      },
    ],
    search: {
      keywordPath: "params.searchstr",
      requestConfig: {
        url: "/api.php",
        params: { request: "search", search_type: "torrents", order_by: "time", order_way: "desc" },
      },
      advanceKeywordParams: { imdb: !1 },
      requestConfigTransformer: ({ requestConfig: n }) => (
        n?.params.searchstr && (n.params.searchstr = n.params.searchstr.replace(/\./g, " ")),
        n
      ),
    },
    userInfo: {
      ...u.userInfo,
      selectors: {
        ...u.userInfo.selectors,
        bonus: { selector: "response.stats.gold" },
        bonusPerHour: { selector: "response.community.hourlyGold" },
        seedingSize: { selector: "response.community.seedSize" },
        seedingBonus: { selector: "response.achievements.totalPoints" },
      },
    },
    levelRequirements: [
      { id: 1, name: "Amateur" },
      { id: 2, name: "Gamer", seedingBonus: 600, privilege: "Can send invites" },
      {
        id: 3,
        name: "Pro Gamer",
        seedingBonus: 1200,
        isKept: !0,
        privilege: "Access to the Pro Gamers forum and Invites forum; Immunity from inactivity pruning",
      },
      {
        id: 4,
        name: "Elite Gamer",
        seedingBonus: 2100,
        isKept: !0,
        privilege: "Edit any torrent; Immunity from Hit 'n' Runs",
      },
      {
        id: 5,
        name: "Legendary Gamer",
        seedingBonus: 3e3,
        isKept: !0,
        privilege: "Access to the Legendary Gamer Invites forum",
      },
      { id: 6, name: "Master Gamer", seedingBonus: 4200, isKept: !0 },
      { id: 7, name: "Gaming God", seedingBonus: 6e3, isKept: !0, privilege: "Can send unlimited Invites" },
    ],
    userInputSettingMeta: [
      { name: "token", label: "Token", hint: "请在用户设置中生成 API key，指定权限 User 和 Torrents", required: !0 },
    ],
  };
class X extends v {
  async getSearchResult(r, t = {}) {
    const s = t?.requestConfig?.params;
    return (
      s && "use_groupname" in s && (s.use_groupname && (t.keywordPath = "params.groupname"), delete s.use_groupname),
      super.getSearchResult(r, t)
    );
  }
  async request(r, t = !0) {
    return (
      (r.responseType = "json"),
      (r.headers = { ...(r.headers ?? {}), "X-API-Key": this.userConfig.inputSetting.token ?? "" }),
      super.request(r, t)
    );
  }
  async requestApi(r, t) {
    return await this.request({ url: "/api.php", params: { request: r, ...t } });
  }
  async requestApiInfo() {
    const { data: r } = await this.requestApi("quick_user", {});
    return r;
  }
  transformGGnTorrents(r, t, s) {
    const o = [];
    for (const a of s)
      if (a.Torrents)
        for (const e of Object.values(a.Torrents)) {
          const i = [];
          switch (e.FreeTorrent) {
            case "1": {
              i.push({ name: "Free", color: "blue" });
              break;
            }
            case "2": {
              i.push({ name: "Neutral", color: "cyan" });
              break;
            }
          }
          const m = [],
            g =
              e.Miscellaneous === "GameDOX"
                ? ""
                : (e.RemasterYear !== "0" && e.RemasterYear) ||
                  (a.Year !== "0" && a.Year) ||
                  (e.Remastered === "1" && "Unknown Release(s)") ||
                  "",
            h = e.Miscellaneous === "GameDOX" ? e.GameDOXType : e.RemasterTitle;
          ([g, h, e.Language, e.Region, e.Format, e.Encoding, e.Miscellaneous].forEach((l) => {
            l && m.push(l);
          }),
            parseInt(e.Scene) && m.push("Scene"));
          const p = a.Artists.length > 0 ? a.Artists[0].name : "";
          o.push({
            site: this.metadata.id,
            id: parseInt(e.ID),
            title: f(e.ReleaseTitle),
            subTitle: m.join(" / "),
            seeders: e.Seeders,
            leechers: e.Leechers,
            completed: e.Snatched,
            category: p || d[parseInt(e.CategoryID)],
            size: parseInt(e.Size),
            time: y(e.Time),
            url: c(this.url, `torrents.php?id=${e.GroupID}&torrentid=${e.ID}`),
            link: c(this.url, `torrents.php?action=download&id=${e.ID}&authkey=${r}&torrent_pass=${t}`),
            tags: i,
          });
        }
    return o;
  }
  async transformSearchPage(r, t) {
    if (r.status === "success") {
      const { authkey: s, passkey: o } = await this.getAuthKey(),
        a = Object.values(r.response);
      return this.transformGGnTorrents(s, o, a);
    }
    return [];
  }
  async getUserExtendInfo(r) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: t } = await this.requestApi("user", { id: r });
    return this.getFieldsData(t, this.metadata.userInfo.selectors, [
      "joinTime",
      "seeding",
      "uploads",
      "invited",
      "bonus",
      "bonusPerHour",
      "seedingSize",
      "seedingBonus",
      "lastAccessAt",
    ]);
  }
}
export { X as default, U as siteMetadata };
