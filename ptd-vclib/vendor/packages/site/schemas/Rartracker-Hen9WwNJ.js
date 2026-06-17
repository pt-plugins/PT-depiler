import o from "./AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import { G as a } from "../utils/filesize-D_1hx4u8.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const r = { url: "/api/v1/status", responseType: "json" },
  x = {
    version: 0,
    schema: "Rartracker",
    type: "private",
    search: {
      keywordPath: "params.searchText",
      requestConfig: {
        url: "/api/v1/torrents",
        responseType: "json",
        params: { limit: 100, index: 0, section: "all", extendedSearch: !1, watchview: !1 },
      },
      advanceKeywordParams: { imdb: { enabled: !0 } },
      selectors: {
        rows: { selector: ":self" },
        id: { selector: "id" },
        title: { selector: "name" },
        url: { selector: "id", filters: [(s) => `/torrent/${s}/`] },
        time: { selector: "added" },
        size: { selector: "size" },
        seeders: { selector: "seeders" },
        leechers: { selector: "leechers" },
        comments: { selector: "comments" },
        category: { selector: "category" },
      },
    },
    userInfo: {
      pickLast: ["id", "joinTime"],
      process: [
        {
          requestConfig: r,
          selectors: {
            id: { selector: "user.id" },
            name: { selector: "user.username" },
            uploaded: { selector: "user.uploaded" },
            downloaded: { selector: "user.downloaded" },
            messageCount: { selector: "user.newMessages" },
            bonus: { selector: "user.bonuspoang" },
            seedingSize: { selector: "user.currentGbSeed", filters: [(s) => s * a] },
          },
        },
        {
          requestConfig: { url: "/api/v1/users/$id$", responseType: "json" },
          assertion: { id: "url" },
          selectors: {
            joinTime: { selector: "added", filters: [{ name: "parseTime" }] },
            lastAccessAt: { selector: "last_access", filters: [{ name: "parseTime" }] },
            uploaded: { selector: "uploaded" },
            downloaded: { selector: "downloaded" },
            trueDownloaded: { selector: "downloaded_real" },
            bonus: { selector: "bonuspoang" },
          },
        },
      ],
    },
  };
class C extends o {
  _passKey;
  async getPassKey() {
    if (!this._passKey) {
      const { data: e } = await this.request(r);
      this._passKey = e.user.passkey;
    }
    return this._passKey;
  }
  async parseTorrentRowForLink(e) {
    const t = await this.getPassKey();
    return ((e.link = `/api/v1/torrents/download/${e.id}/${t}`), e);
  }
}
export { x as SchemaMetadata, C as default, r as statusRequestConfig };
