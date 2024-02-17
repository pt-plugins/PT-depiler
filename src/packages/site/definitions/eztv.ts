import type { AxiosRequestConfig } from "axios";
import type { ISearchFilter, ISiteMetadata } from "../types";
import BittorrentSite from "../schemas/AbstractBittorrentSite";

export const siteMetadata: ISiteMetadata = {
  name: "EZTV",
  type: "public",
  description: "EZTV is a Public torrent site for TV shows",
  url: "https://eztv.re/",
  legacyUrls: ["https://eztv.wf/", "https://eztv.tf/", "https://eztv.yt/"],
  search: {
    requestConfig: { url: "/search/" },
    keywordsParam: "keywords",
    selectors: {
      rows: {
        selector: 'table.forum_header_border tr[name="hover"].forum_header_border:has(a.magnet)',
      },
      id: {
        selector: "td:nth-child(2) a",
        attr: "href",
        filters: [(q: string) => q.match(/\/ep\/(\d+)/)![1]],
      },
      title: {
        selector: "td:nth-child(2) a",
        attr: "title",
        filters: [(q: string) => q.replace("[eztv]", "").replace(/\(.*\)$/, "")],
      },
      url: { selector: "td:nth-child(2) a", attr: "href" },
      link: {
        selector: "td:nth-child(3) a.magnet, td:nth-child(3) a",
        attr: "href",
      },
      time: { selector: "td:nth-child(5)", filters: [{ name: "parseTTL" }] },
      size: { selector: "td:nth-child(4)" },
      seeders: { selector: "td:nth-child(6)" },
    },
  },
};

// noinspection JSUnusedGlobalSymbols
export default class Eztv extends BittorrentSite {
  protected override async transformSearchFilter(filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords ? `/search/${filter.keywords}` : "/";
    return config;
  }
}
