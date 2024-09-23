import type { AxiosRequestConfig } from "axios";
import { ISearchFilter, ISiteMetadata } from "../types";
import dayjs, { parseTimeToLive } from "../utils/datetime";
import BittorrentSite from "../schemas/AbstractBittorrentSite";

const CategoryMap = new Map([
  ["tv0", "Other"],
  ["tv1", "Movies"],
  ["tv2", "Music"],
  ["tv3", "TV Shows"],
  ["tv4", "Games"],
  ["tv5", "Software"],
  ["tv6", "Anime"],
  ["tv7", "Adult"],
  ["tv8", "Books"],
  ["tv9", "Images"],
  ["tv10", "Books"],
  ["tv12", "Audiobook"],
]);

export const siteMetadata: ISiteMetadata = {
  name: "Torlock",
  type: "public",
  description:
    "Torlock is a torrent search site that lists verified torrents only for TV series and movies",
  url: "https://www.torlock.com/",
  legacyUrls: ["https://www.torlock2.com/", "https://www.torlock.icu/"],
  search: {
    selectors: {
      rows: {
        selector: 'table > tbody > tr:has(td:has(div:has(a[href^="/torrent/"])))',
      },
      id: {
        selector: 'td:nth-child(1) > div > a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/(\d+)/)![1]],
      },
      title: { selector: "td:nth-child(1) > div > a" },
      url: {
        selector: 'td:nth-child(1) > div > a[href^="/torrent/"]',
        attr: "href",
      },
      link: {
        selector: 'td:nth-child(1) > div > a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => `/tor/${q.match(/\/torrent\/(\d+)/)![1]}.torrent`],
      },
      time: {
        selector: "td:nth-child(2)",
        filters: [
          (q: string) => {
            if (/\//.test(q)) {
              // 1/2/2006
              return dayjs(`${q} -07:00`, "MM/DD/YYYY Z").valueOf();
            } else {
              return parseTimeToLive(q);
            }
          },
        ],
      },
      size: { selector: "td:nth-child(3)" },
      seeders: { selector: "td:nth-child(4)" },
      leechers: { selector: "td:nth-child(5)" },
      category: {
        selector: 'span[class^="tv"]',
        attr: "class",
        filters: [(q: string) => CategoryMap.get(q) || "Other"],
      },
    },
  },
};

// noinspection JSUnusedGlobalSymbols
export default class Torlock extends BittorrentSite {
  protected override async transformSearchFilter(
    filter: ISearchFilter,
  ): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords
      ? `/all/torrents/${filter.keywords}.html`
      : "/fresh.html";
    return config;
  }
}
