import type { AxiosRequestConfig } from "axios";
import type { ISearchFilter, ISiteMetadata } from "../types";
import dayjs, { parseTimeToLive } from "../utils/datetime";
import BittorrentSite from "../schemas/AbstractBittorrentSite";

const CategoryMap = new Map([
  [1, "Movies"],
  [2, "Music"],
  [3, "Television"],
  [4, "Games"],
  [5, "Software"],
  [6, "Anime"],
  [7, "Adult"],
  [8, "Ebooks"],
  [9, "Animation"],
  [10, "Other"],
  [0, "TBC"],
]);

export const siteMetadata: ISiteMetadata = {
  name: "TOROS",
  type: "public",
  description: "TOROS is a Public torrent index",
  url: "https://www.toros.co/",
  search: {
    selectors: {
      rows: { selector: 'table.table-responsive tr:has(a[href^="/torrent/"])' },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/torrent\/(\d+)/)![1]],
      },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      time: {
        selector: "td:nth-child(2)",
        filters: [
          (q: string) => {
            if (/ago/.test(q)) {
              return parseTimeToLive(q);
            } else if (/Yesterday/.test(q)) {
              return dayjs().add(-1, "day").valueOf();
            } else {
              return dayjs(q, "DD MMM").valueOf();
            }
          },
        ],
      },
      size: { selector: "td:nth-child(3)" },
      seeders: { selector: "td:nth-child(4)" },
      leechers: { selector: "td:nth-child(5)" },
      category: {
        selector: "td:nth-child(1)",
        attr: "class",
        filters: [
          (q: string) => CategoryMap.get(parseInt(q.replace(/^tv/, ""))),
        ],
      },
      author: { selector: "td:nth-child(6)" },
    },
  },
  detail: {
    selectors: {
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
    },
  },
};

// noinspection JSUnusedGlobalSymbols
export default class Toros extends BittorrentSite {
  protected override async transformSearchFilter(
    filter: ISearchFilter
  ): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords
      ? `all/torrents/${filter.keywords}.html`
      : "top100.html";

    return config;
  }
}
