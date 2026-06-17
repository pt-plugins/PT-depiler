import l from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
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
const M = {
  id: "gtnet",
  version: 1,
  name: "Gay-Torrents.net",
  tags: ["成人"],
  type: "private",
  timezoneOffset: "+0800",
  urls: ["https://www.gay-torrents.net/"],
  search: {
    requestConfig: {
      url: "/search.php?do=process",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { do: "process", securitytoken: "" },
      responseType: "document",
    },
    keywordPath: "data.query",
    selectors: {
      rows: { selector: "div#display ul.TorrentList" },
      id: {
        selector: "li.TorrentList2 a[href*='torrentdetails.php']",
        attr: "href",
        filters: [(t) => t.match(/torrentid=([a-f0-9]+)/)?.[1] ?? t],
      },
      title: { selector: "li.TorrentList2 a[href*='torrentdetails.php']" },
      url: { selector: "li.TorrentList2 a[href*='torrentdetails.php']", attr: "href" },
      link: { selector: "a[href*='download.php']", attr: "href" },
      size: { selector: "li.TorrentList3", filters: [{ name: "parseSize" }] },
      seeders: { selector: "li.TorrentList6", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "li.TorrentList7", filters: [{ name: "parseNumber" }] },
      time: {
        selector: "li.TorrentList8",
        filters: [(t) => t.trim(), { name: "parseTime", args: ["HH:mm dd-MMM-yyyy"] }],
      },
      category: {
        selector: "li.TorrentList1 a[href*='torrentslist.php']",
        attr: "href",
        filters: [
          (t) => {
            const e = t.match(/type=([^&]+)/);
            return e ? decodeURIComponent(e[1]).replace(/\//g, " > ") : "";
          },
        ],
      },
    },
  },
  list: [
    {
      urlPattern: ["/torrentslist\\.php", "/search\\.php"],
      selectors: {
        rows: { selector: "div#display ul.TorrentList" },
        keywords: { selector: "input[name='query']", attr: "value" },
      },
    },
  ],
  detail: {
    urlPattern: ["/torrentdetails\\.php\\?torrentid=[a-f0-9]+"],
    selectors: { link: { selector: "a[href*='download.php']", attr: "href" } },
  },
  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/member.php" },
        selectors: {
          id: {
            selector: "ul.isuser li.welcomelink a[href*='member.php?']",
            attr: "href",
            filters: [
              (t) => {
                const e = t.match(/member\.php\?(\d+)/);
                return e ? e[1] : t;
              },
            ],
          },
          name: { selector: "ul.isuser li.welcomelink a[href*='member.php?']" },
        },
      },
      {
        requestConfig: { url: "/member.php?$id$-$name$" },
        assertion: { id: "url", name: "url" },
        selectors: {
          uploaded: { selector: "dl.stats:has(dt:contains('Uploaded')) dd", filters: [{ name: "parseSize" }] },
          downloaded: {
            selector: "dl.stats:has(dt:contains('Downloaded')) dd",
            filters: [(t) => (t.trim() === "0" ? "0 B" : t), { name: "parseSize" }],
          },
          ratio: {
            selector: "dl.stats:has(dt:contains('Ratio')) dd",
            filters: [
              (t) => {
                const e = t.trim();
                return e === "??" || e === "∞" || e === "Inf" ? -1 : parseFloat(e) || 0;
              },
            ],
          },
          bonus: { selector: "dl.stats:has(dt:contains('Juices')) dd", filters: [{ name: "parseNumber" }] },
          levelName: { selector: "#userinfo span.usertitle" },
          joinTime: {
            selector: "dl.stats:has(dt:contains('Join Date')) dd",
            filters: [(t) => t.trim(), { name: "parseTime", args: ["HH:mm dd-MMM-yyyy"] }],
          },
        },
      },
    ],
  },
  levelRequirements: [{ id: 1, name: "Newbie" }],
};
class N extends l {
  async getSecurityToken() {
    const { data: e } = await this.request({ url: "/torrentslist.php", responseType: "document" }),
      i = e.querySelectorAll("script");
    for (const o of i) {
      const s = (o.textContent || "").match(/SECURITYTOKEN\s*=\s*"([^"]+)"/);
      if (s) return s[1];
    }
    const r = e.querySelector('input[name="securitytoken"]');
    return r?.value ? r.value : "";
  }
  async getSearchResult(e, i = {}) {
    if (e) {
      const r = await this.getSecurityToken();
      r &&
        (this.metadata.search.requestConfig.data || (this.metadata.search.requestConfig.data = {}),
        (this.metadata.search.requestConfig.data.securitytoken = r));
    }
    return super.getSearchResult(e, i);
  }
  async getTorrentDownloadRequestConfig(e) {
    const i = `/torrentdetails.php?torrentid=${e.id}`,
      { data: r } = await this.request({ url: i, responseType: "document" });
    let o = "";
    const a = r.querySelectorAll("script");
    for (const s of a) {
      const n = (s.textContent || "").match(/SECURITYTOKEN\s*=\s*"([^"]+)"/);
      if (n) {
        o = n[1];
        break;
      }
    }
    if (!o) {
      const s = r.querySelector('input[name="securitytoken"]');
      s?.value && (o = s.value);
    }
    return {
      baseURL: this.url,
      url: "/torrentdetails.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: `${this.url}torrentdetails.php?torrentid=${e.id}`,
      },
      data: `do=download&securitytoken=${o}&torrentid=${e.id}&download=as+Torrent`,
      timeout: this.userConfig.timeout ?? 3e4,
    };
  }
}
export { N as default, M as siteMetadata };
