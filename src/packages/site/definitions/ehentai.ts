import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { ITorrent, type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
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
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
    },
    advanceKeywordParams: {
      imdb: false,
    },
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

export default class EHentai extends BittorrentSite {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const dlPage = await this.request<Document>({ url: torrent.link, responseType: "document" });
    return this.getFieldData(dlPage.data, { selector: "a[href*='.torrent']:first-of-type", attr: "href" });
  }
}
