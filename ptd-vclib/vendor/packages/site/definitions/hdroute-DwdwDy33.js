import c from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
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
const d = (e) => {
    if (!e) return "";
    const t = e.cloneNode(!0);
    return (t.querySelectorAll("span, small, i, em").forEach((r) => r.remove()), (t.textContent || "").trim());
  },
  p = (e, t) => {
    if (!e) return 0;
    const s = e.querySelectorAll(".torrent_count.strong")[t]?.querySelector("span")?.textContent?.trim() || "";
    return (s && s !== "---" && parseInt(s)) || 0;
  },
  i = (e, t) => {
    const r = [`dd .${e}`, `dt .${e}`, `.${e}`];
    return t ? [...r, ...t] : r;
  },
  C = {
    version: 1,
    id: "hdroute",
    name: "HDRoute",
    description: "HDRoute - 高清影视资源站点",
    tags: ["影视", "综合"],
    timezoneOffset: "+0800",
    type: "private",
    schema: "AbstractPrivateSite",
    urls: ["uggc://uqebhgr.bet/"],
    search: {
      keywordPath: "params.s",
      requestConfig: {
        url: "/browse.php",
        responseType: "document",
        params: { action: "s", s: "", or: 1, dp: 0, add: 0, imdb: "" },
      },
      advanceKeywordParams: {
        imdb: {
          requestConfigTransformer: ({ keywords: e, requestConfig: t }) => {
            if (t?.params) {
              let r = t.params.s?.trim() || e?.trim() || "";
              (r.startsWith("tt") && (r = r.substring(2)), r && ((t.params.imdb = r), (t.params.s = "")));
            }
            return t;
          },
        },
      },
      selectors: {
        rows: { selector: "dl[id^='dl_torrent_']" },
        id: { selector: ":self", attr: "id", filters: [(e) => e.match(/dl_torrent_(\d+)/)?.[1] || ""] },
        title: {
          selector: i("title_chs", [
            "dt a[href*='details.php?id=']",
            "dd a[href*='details.php?id=']",
            "a[href*='details.php?id=']",
          ]),
          elementProcess: d,
        },
        subTitle: { selector: i("title_eng"), elementProcess: d },
        url: {
          selector: [
            "a[href*='details.php?id=']",
            ...i("torrent_detail_icon a"),
            "div.buttonDownloadSection a[href*='details.php?id=']",
          ],
          attr: "href",
        },
        link: {
          selector: [".buttonDownloadSection .buttonDownload", ".buttonDownload"],
          attr: "onclick",
          filters: [(e) => e.match(/location\.href=['"](download\.php\?id=\d+)/)?.[1] || ""],
        },
        size: { selector: i("torrent_size"), filters: [{ name: "parseSize" }] },
        time: {
          selector: i("torrent_added"),
          filters: [
            (e) =>
              !e || typeof e != "string"
                ? String(Date.now())
                : e.trim().replace(/(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})/, "$1 $2") || String(Date.now()),
            { name: "parseFuzzyTime", args: ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss"] },
          ],
        },
        author: {
          selector: i("torrent_owner"),
          filters: [(e) => (e ? (e.includes("(匿名)") ? "(匿名)" : e.trim()) : "")],
        },
        seeders: { selector: i("torrent-content-right"), elementProcess: (e) => p(e, 0) },
        leechers: { selector: i("torrent-content-right"), elementProcess: (e) => p(e, 1) },
        completed: {
          selector: i("torrent_count strong a span.count-color0", ["a span.count-color0"]),
          filters: [{ name: "parseNumber" }],
        },
        comments: {
          selector: i("torrent_comments_count", ["a[href*='details.php?id='] .torrent_comments_count"]),
          filters: [{ name: "parseNumber" }],
        },
        category: {
          text: "",
          selector: i("torrent_category figure", ["figure.torrent_category"]),
          case: {
            ".sprite_r4k2k": "4K/2K",
            ".sprite_mbluray": "Blu-ray原盘",
            ".sprite_r1080p": "1080P",
            ".sprite_mremux": "Remux",
          },
        },
        ext_imdb: {
          selector: i("torrent-imdb a", ["a[href*='imdb.com']"]),
          attr: "href",
          filters: [{ name: "extImdbId" }],
        },
      },
    },
    list: [{ urlPattern: ["/browse\\.php"], mergeSearchSelectors: !0, selectors: {} }],
    detail: {
      urlPattern: ["/details.php\\?id=\\d+"],
      selectors: {
        id: { selector: ["input[name='tId']", "input[name='id']"], attr: "value" },
        title: { selector: [".details-title-eng", ".details-title-chs", "h1"] },
      },
    },
    userInfo: {
      process: [
        {
          requestConfig: { url: "/", responseType: "document" },
          selectors: {
            id: {
              selector: ".headerRightInfo span a[href*='userdetail.php']",
              attr: "href",
              filters: [{ name: "querystring", args: ["id"] }],
            },
            name: { selector: ".headerRightInfo span a[href*='userdetail.php']" },
            uploaded: {
              selector: ".headerRightInfo span:contains('上传量:') .header-user-data",
              filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }],
            },
            downloaded: {
              selector: ".headerRightInfo span:contains('下载量:') .header-user-data",
              filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }],
            },
            ratio: {
              selector: ".headerRightInfo span:contains('分享率:') .header-user-data",
              filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }, { name: "parseNumber" }],
            },
            levelName: {
              selector:
                ".headerRightInfo span:contains('('):not(:contains('上传量')):not(:contains('下载量')):not(:contains('分享率'))",
              filters: [(e) => e.match(/\(([^)]+)\)/)?.[1] || ""],
            },
            messageCount: { selector: "#nav_unread_msg_count", filters: [{ name: "trim" }, { name: "parseNumber" }] },
            seeding: { selector: ".header-user-data a[href*='list_seeding.php']", filters: [{ name: "parseNumber" }] },
            seedingSize: {
              selector: ".header-user-data a[href*='list_seeding.php'] + .peering-size",
              filters: [{ name: "parseSize" }],
            },
          },
        },
        {
          requestConfig: { url: "/list_uploaded.php", responseType: "document" },
          assertion: { id: "params.id" },
          selectors: {
            uploads: {
              selector: "#pager-top a:last-of-type b",
              filters: [(e) => e.match(/(\d+)\s*-\s*(\d+)/)?.[2] || e, { name: "parseNumber" }],
            },
          },
        },
        {
          requestConfig: { url: "/userdetail.php", responseType: "document" },
          assertion: { id: "params.id" },
          selectors: {
            joinTime: {
              selector: ".userdetail-list-title:contains('注册日期') + .userdetail-list-content",
              filters: [{ name: "trim" }, { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] }],
            },
          },
        },
      ],
    },
    noLoginAssert: {
      urlPatterns: [/login|signin|auth|verify|checkpoint|returnto/gi],
      httpStatusCodes: [401, 403, 302],
    },
  };
class M extends c {
  async parseWholeTorrentFromRow(t = {}, r, a) {
    const s = await super.parseWholeTorrentFromRow(t, r, a);
    if (r instanceof Element) {
      const o = r.querySelector("a[href*='details.php?id=']"),
        n = o?.getAttribute("href")?.trim() || "";
      if (
        (s.id ||
          (s.id =
            r.getAttribute("id")?.match(/dl_torrent_(\d+)/)?.[1] || n.match(/details\.php\?id=(\d+)/)?.[1] || s.id),
        !s.title)
      ) {
        const l = d(o);
        l && (s.title = l);
      }
      if (!s.url) {
        const l =
          r.querySelector(".buttonDownloadSection a[href*='details.php?id=']")?.getAttribute("href")?.trim() || "";
        s.url = n || l || (s.id ? `details.php?id=${s.id}` : void 0);
      }
    }
    return ((s.site = this.metadata.id), s.title && s.id ? s : {});
  }
  async transformDetailPage(t) {
    const r = await super.transformDetailPage(t),
      a = t.querySelector("#details-download-link"),
      s = t.querySelector("button.buttonDownload"),
      o =
        [
          a?.value,
          a?.textContent,
          s?.getAttribute("data-clipboard-text"),
          s?.getAttribute("data-link"),
          s?.getAttribute("data-download-link"),
        ]
          .map((n) => n?.trim())
          .find((n) => n && n.length > 0) || "";
    return ((r.link = o || (r.id ? `/download.php?id=${r.id}` : r.link)), r);
  }
  async getTorrentDownloadLink(t) {
    return t.link && typeof t.link == "string" && t.link.trim().length > 0 && t.link.includes(":COOKIE:")
      ? t.link.trim()
      : await super.getTorrentDownloadLink(t);
  }
}
export { M as default, C as siteMetadata };
