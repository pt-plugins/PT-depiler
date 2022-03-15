import type { AxiosRequestConfig } from "axios";
import type { ISearchFilter, ISiteMetadata } from "../types";
import PrivateSite from "../schema/AbstractPrivateSite";
import { parseSizeString } from "../utils";

export const siteMetadata: ISiteMetadata = {
  name: "Pornbits",
  description: "Pornbits",
  url: "https://pornbits.net/",
  legacyUrl: ["https://pornbits.org/"],
  type: "private",
  tags: ["Adult"],
  host: "pornbits.net",
  collaborator: "ian",
  search: {
    selectors: {
      rows: { selector: "#content > table > tbody > tr" },
      title: { selector: 'a[href*="/torrent/details/"]' },
      url: { selector: 'a[href*="/torrent/details/"]', attr: "href" },
      link: { selector: 'a[href*="/torrent/download/"]', attr: "href" },
      time: {
        selector: 'td:nth-child(4) div:nth-child(2):contains("-")',
        filters: [(query: string) => query.split("m")[1].trim()],
      },
      size: { selector: "td:nth-child(5) div:nth-child(1)" },
      category: { text: "XXX" },
      seeders: { selector: "td:nth-child(6)" },
      leechers: { selector: "td:nth-child(7)" },
      completed: { selector: "td:nth-child(8)" },
      tags: [
        {
          name: "Free",
          selector: 'img[src="/images/glyphicons_069_gift.png"]',
        },
      ],
    },
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: "/" },
        fields: ["name", "uploaded", "downloaded"],
      },
      {
        requestConfig: { url: "/user/details" },
        fields: ["levelName", "joinTime", "seeding"],
      },
    ],
    selectors: {
      name: {
        selector:
          "#subnav > div > div > ul > li.dropdown.pull-right > a > span.hidden-sm",
      },
      uploaded: {
        selector:
          "#header > div > div > div > span.navbar-text.stats.hidden-sm",
        filters: [
          (query: string) => {
            query = query.split(":")[1].split("D")[0].trim();
            return parseSizeString(query);
          },
        ],
      },
      downloaded: {
        selector:
          "#header > div > div > div > span.navbar-text.stats.hidden-sm",
        filters: [
          (query: string) => {
            query = query
              .split(":")[2]
              .split("R")[0]
              .replace(/Bytes/g, "")
              .trim();
            return parseSizeString(query);
          },
        ],
      },
      levelName: {
        selector: "#content > div > div.col-md-3 > div:nth-child(3) > span",
      },
      joinTime: {
        selector: "#content div.col-md-3 strong:contains('Member Since:')",
        elementProcess: (element: HTMLElement) =>
          (element.nextSibling as Text).wholeText.replace(/\s/g, ""),
        filters: [{ name: "parseTime" }],
      },
      seeding: {
        selector:
          "#content > div > div.col-md-9 > div:nth-child(5) > div.panel-heading > h4",
        filters: [(query: string) => query.split(":")[1].split("L")[0].trim()],
      },
      seedingSize: { text: -1 },
      bonus: { text: "N/A" },
    },
  },
  feature: {
    skipImdbSearch: true,
  },
};

export default class pornbits extends PrivateSite {
  protected override async transformSearchFilter(
    filter: ISearchFilter
  ): Promise<AxiosRequestConfig> {
    const config: AxiosRequestConfig = {};
    if (filter.keywords) {
      config.url = `/browse/search/date/name_tags/${filter.keywords}`;
    } else {
      config.url = "/browse/index/date/name";
    }

    return config;
  }
}
