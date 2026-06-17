import "../index-COeZNva1.js";
import { d as s } from "../utils/filter-Dko2hrfF.js";
import i from "./AbstractPrivateSite-kkMcHSoo.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const A = {
  version: 0,
  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: { incldead: 1, titleonly: 1, nonboolean: 0 },
    },
    advanceKeywordParams: { imdb: !1 },
    selectors: {
      rows: {
        selector:
          "table[border='0'] > tbody > tr.ttable:has(a[href^='browse.php?cat=']):not(:has(font[color='blue'])):not(:contains('*TCG*'))",
      },
      title: { selector: "a[href^='details.php?id=']", attr: "title" },
      url: { selector: "a[href^='details.php?id=']", attr: "href" },
      link: { selector: "a[href^='download.php/']", attr: "href" },
      time: { selector: "td:nth-child(6)", filters: [{ name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss"] }] },
      size: { selector: "td:nth-child(7)", filters: [{ name: "parseSize" }] },
      completed: {
        selector: "td:nth-child(8)",
        filters: [{ name: "replace", args: ["Never", "0"] }, { name: "parseNumber" }],
      },
      seeders: { selector: "td:nth-child(9)" },
      leechers: { selector: "td:nth-child(10)" },
      comments: { selector: "td:nth-child(5)" },
      subTitle: { selector: "span > em" },
      tags: [{ name: "Neutral", selector: "font[color='green']:contains('NEUTRAL')", color: "green" }],
    },
  },
  detail: {
    urlPattern: ["/details.php"],
    selectors: { title: { selector: "div > h1" }, link: { selector: "a[href^='download.php/']", attr: "href" } },
  },
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/main.php", responseType: "document" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php?id=']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='userdetails.php?id=']:first" },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          joinTime: {
            selector: ".embedded td:contains('Join date') + td:first",
            filters: [{ name: "split", args: ["(", 0] }, { name: "trim" }, { name: "parseTime" }],
          },
          lastAccessAt: {
            selector: ".embedded td:contains('Last seen') + td:first",
            filters: [{ name: "split", args: ["(", 0] }, { name: "trim" }, { name: "parseTime" }],
          },
          messageCount: {
            selector: "a[href='message.php?action=viewmailbox'] + b",
            filters: [{ name: "parseNumber" }],
          },
          uploaded: {
            selector: "td.rowhead:contains('Uploaded') + td",
            filters: [{ name: "split", args: ["(", 0] }, { name: "trim" }, { name: "parseSize" }],
          },
          downloaded: {
            selector: "td.rowhead:contains('Downloaded') + td",
            filters: [{ name: "split", args: ["(", 0] }, { name: "trim" }, { name: "parseSize" }],
          },
          ratio: {
            selector: "td.statuslink span:contains('Ratio:') + span",
            filters: [(e) => (e === "---" ? -1 : s.parseNumber(e))],
          },
          seeding: { selector: "img[title='seeders'] + span:first" },
          levelName: { selector: "td.rowhead:contains('Class') + td" },
          bonus: { text: "N/A" },
          bonusPerHour: { text: "N/A" },
          seedingSize: {
            selector: "div#kd1 > table.details > tbody",
            elementProcess: (e) => {
              if (!e) return 0;
              const a = e.querySelectorAll("tr");
              let t = 0;
              return (
                a.forEach((o) => {
                  const r = o.querySelector("td:not(.colbrowsehead):nth-child(4)");
                  r && (t += s.parseSize(r.innerText));
                }),
                t
              );
            },
          },
        },
      },
    ],
  },
};
class P extends i {}
export { A as SchemaMetadata, P as default };
