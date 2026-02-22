import type { ISiteMetadata, ITorrent } from "../types";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import PrivateSite from "../schemas/AbstractPrivateSite";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
  3: "Music",
  4: "Games",
  5: "Ebook",
  6: "Apps",
  7: "Adult",
};

export const siteMetadata: ISiteMetadata = {
  id: "milkie",
  version: 1,
  name: "Milkie",
  aka: ["ME", "奶昔"],
  description: "Milkie.cc (ME) is Private Torrent Tracker for 0DAY / GENERAL",
  tags: ["综合"],
  timezoneOffset: "+0200",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://milkie.cc/"],

  category: [
    {
      name: "类别",
      key: "categories",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "comma" },
    },
  ],

  search: {
    keywordPath: "params.query",
    requestConfig: {
      url: "/api/v1/torrents",
      params: {
        ps: 50,
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "torrents" },
      id: { selector: "id" },
      title: { selector: "releaseName" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/browse/"] }] },
      category: { selector: "category", filters: [(catId: number) => categoryMap[catId]] },
      time: {
        selector: "createdAt",
        filters: [{ name: "split", args: ["+", 0] }],
      },
      size: { selector: "size" },
      leechers: { selector: "leechers" },
      seeders: { selector: "seeders" },
      completed: { selector: "downloaded" },

      // API 存在此字段，但大部分时间为 null
      ext_imdb: { selector: "externals.imdb" },
    },
  },

  list: [
    {
      urlPattern: [/\/browse(\?.*)?$/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "tor-browse-list > div > tor-torrent-release" },
        id: { selector: "a.mat-caption", attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
        title: { selector: "a.mat-caption", attr: "title" },
        url: { selector: "a.mat-caption", attr: "href" },
        link: { selector: "a.mat-icon-button", attr: "href" },
        size: { selector: "div.size > span" },
        completed: { selector: "div.nos > span:nth-child(1)" },
        seeders: { selector: "div.nos > span:nth-child(2)" },
        leechers: { selector: "div.nos > span:nth-child(3)" },
      },
    },
  ],

  detail: {
    urlPattern: ["/browse/"],
    selectors: {
      title: { selector: "tor-details-page h1" },
      link: { selector: "tor-torrent-details a.download", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["name", "joinTime"],
    process: [
      {
        requestConfig: {
          url: "/api/v1/auth",
        },
        selectors: {
          name: { selector: "user.displayName" },
          uploaded: { selector: "user.uploaded" },
          downloaded: { selector: "user.downloaded" },
          joinTime: { selector: "user.createdAt", filters: [{ name: "parseTime" }] },
          levelName: { text: "Early bird" },
        },
      },
    ],
  },

  userInputSettingMeta: [
    {
      name: "token",
      label: "Token",
      hint: "在 https://milkie.cc/settings/security 获取 API key",
      required: true,
    },
  ],
};

export default class Milkie extends PrivateSite {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 设置默认的 responseType，这样其他配置不需要显式声明
    axiosConfig.responseType = "json";

    // 在请求的 headers 中添加 存取令牌
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "x-milkie-auth": this.userConfig.inputSetting!.token ?? "",
    };

    return super.request<T>(axiosConfig, checkLogin);
  }

  protected parseTorrentRowForLink(torrent: Partial<ITorrent>, row: { id: number }): Partial<ITorrent> {
    torrent.link = `/api/v1/torrents/${row.id}/torrent?key=${encodeURIComponent(this.userConfig.inputSetting!.token)}`;
    return torrent;
  }
}
