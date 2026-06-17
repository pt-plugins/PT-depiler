import r from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
const b = {
  version: 1,
  id: "ehentai",
  name: "E-Hentai",
  aka: ["EH"],
  description: "E-Hentai is a Public site for Hentai doujinshi, manga.",
  tags: ["漫画", "成人"],
  timezoneOffset: "+0000",
  type: "public",
  urls: ["https://e-hentai.org/", "https://exhentai.org/"],
  search: {
    keywordPath: "params.search",
    requestConfig: { url: "/torrents.php", responseType: "document" },
    advanceKeywordParams: { imdb: !1 },
    selectors: {
      rows: { selector: "table.itg > tbody > tr:has(td)" },
      id: { selector: "a[href*='/g/']" },
      title: { selector: "a[href*='/gallerytorrents.php?gid=']" },
      url: { selector: "a[href*='/g/']", attr: "href" },
      link: { selector: "a[href*='/gallerytorrents.php?gid=']", attr: "href" },
      time: { selector: "td:first-child", filters: [{ name: "parseFuzzyTime" }] },
      size: { selector: "td:nth-child(4)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(5)" },
      leechers: { selector: "td:nth-child(6)" },
      completed: { selector: "td:nth-child(7)" },
    },
  },
};
class k extends r {
  async getTorrentDownloadLink(e) {
    const t = await this.request({ url: e.link, responseType: "document" });
    return this.getFieldData(t.data, { selector: "a[href*='.torrent']:first-of-type", attr: "href" });
  }
}
export { k as default, b as siteMetadata };
