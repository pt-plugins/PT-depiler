import { ISiteMetadata, ITorrent } from "../types";
import BittorrentSite from "../schemas/AbstractBittorrentSite";

export const ehentaiSearchSelector = {
  rows: { selector: "table.itg > tbody > tr:has(td)" },
  id: { selector: "td:nth-child(3)" }, // 我个人认为应该使用 Gallery Id作为 EH 的id
  title: { selector: 'a[href*="/gallerytorrents.php?gid="]' },
  url: { selector: "td:nth-child(3) a", attr: "href" }, // 而详情页链接应该使用 Gallery 的
  link: { selector: 'a[href*="/gallerytorrents.php?gid="]', attr: "href" },
  time: { selector: "td:first-child" },
  size: { selector: "td:nth-child(4)" },
  seeders: { selector: "td:nth-child(5)" },
  leechers: { selector: "td:nth-child(6)" },
  completed: { selector: "td:nth-child(7)" },
  author: { selector: "td:nth-child(8)" },
};

export const siteMetadata: ISiteMetadata = {
  name: "E-Hentai",
  type: "public",
  description: "E-Hentai is a Public site for Hentai doujinshi, manga.",
  timezoneOffset: "+0000",
  url: "https://e-hentai.org/",
  search: {
    requestConfig: { url: "/torrents.php" },
    keywordsParam: "search",
    selectors: ehentaiSearchSelector,
  },
};

// noinspection JSUnusedGlobalSymbols
export default class EHentai extends BittorrentSite {
  override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const { link } = torrent;
    if (/gallerytorrents\.php/.test(link)) {
      const gtPage = await this.request({
        url: link,
        responseType: "document",
      });
      // 优先考虑使用 私有种子，如果没有 再使用 可再分发种子
      return this.getFieldData(gtPage.data as Document, {
        selector: 'a[href*=".torrent"]:first-of-type',
        attr: "href",
      });
    }

    return super.getTorrentDownloadLink(torrent);
  }
}
