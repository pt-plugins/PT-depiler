import { ISiteMetadata, ITorrent } from "@ptd/site";
import PrivateSite from "@ptd/site/schemas/AbstractPrivateSite.ts";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "rousipro",
  name: "Rousi Pro",
  aka: ["Rousi", "肉丝"],

  type: "private",
  schema: "Rousi",

  urls: ["uggcf://ebhfv.ceb/"],
  favicon: "./rousi.ico", // 目前没有单独的图标，先用和 rousi 一样的

  category: [
    {
      name: "分类",
      key: "category",
      options: [
        // (await (await fetch('/api/v1/categories')).json()).data.map(x => ({name: x.label, value: x.name}))
        { name: "电影", value: "movie" },
        { name: "电视剧", value: "tv" },
        { name: "纪录片", value: "documentary" },
        { name: "动漫", value: "animation" },
        { name: "音乐", value: "music" },
        { name: "综艺", value: "variety" },
        { name: "9KG", value: "9kg" },
        { name: "体育", value: "sports" },
        { name: "软件", value: "software" },
        { name: "电子书", value: "ebook" },
        { name: "其它", value: "other" },
      ],
    },
  ],

  search: {
    requestConfig: { url: "/api/v1/search", params: { page_size: 100 } },
    keywordPath: "params.keyword",
    advanceKeywordParams: { imdb: false, douban: false },
    selectors: {
      rows: { selector: "data.torrents" },
      id: { selector: "uuid" }, // 使用 uuid 而不是 id
      title: { selector: "title" },
      subTitle: { selector: "subtitle" },
      url: { selector: "uuid", filters: [{ name: "prepend", args: ["/torrent/"] }] }, // 直接构造 uuid
      // link: { selector: "uuid" }, // 下载链接中有 passkey 参数，此处不构造，由 class 生成
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      author: { selector: "uploader" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "downloads" },
      // comments: { text: "N/A" }, // 不显示该站点的种子评论数
      category: { selector: "category_name" },
    },
  },

  list: [
    {
      urlPattern: ["/categories", "/search"],
      mergeSearchSelectors: false,
      selectors: {
        keywords: { selector: "input[placeholder*='搜索种子']" },
        rows: { selector: 'div.border > a[href^="/torrent/"]' },
        id: { selector: ":self", attr: "href", filters: [{ name: "replace", args: ["/torrents/", ""] }] },
        title: { selector: "span.truncate[title]", attr: "title" },
        url: { selector: ":self", attr: "href" },
        // link 由 getTorrentDownloadLink 方法构造
      },
    },
  ],

  detail: {
    urlPattern: ["/torrent/"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          const url = element.URL;
          const match = url.match(/\/torrent\/([0-9a-z-]+)\/?/);
          return match ? match[1] : url;
        },
      },
      title: { selector: "h1" },
      link: { text: "" },
    },
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: "/api/v1/profile", params: { "include_fields[user]": "seeding_leeching_data" } },
        selectors: {
          id: { selector: "data.id" },
          name: { selector: "data.username" },
          levelId: { selector: "data.level" },
          levelName: { selector: "data.level_text" },
          joinTime: { selector: "data.registered_at", filters: [{ name: "parseTime" }] },
          lastAccessAt: { selector: "data.last_active_at", filters: [{ name: "parseTime" }] },
          messageCount: { text: 0 },
          downloaded: { selector: "data.downloaded" },
          uploaded: { selector: "data.uploaded" },
          ratio: { selector: "data.ratio" },

          seeding: { selector: "data.seeding_leeching_data.seeding_count" },
          seedingSize: { selector: "data.seeding_leeching_data.seeding_size" },
          seedingTime: { selector: "data.seeding_time" },

          bonus: { selector: "data.karma" },
          seedingBonus: { selector: "data.credits" },
          bonusPerHour: { selector: "data.seeding_karma_per_hour" },
          seedingBonusPerHour: { selector: "data.seeding_points_per_hour" },
        },
      },
    ],
  },

  userInputSettingMeta: [
    { name: "passkey", label: "Passkey", hint: "用户的Passkey，可以在 账户设置-Passkey 中复制", required: true },
  ],
};

export default class RousiPro extends PrivateSite {
  get userPasskey(): string {
    return this.userConfig.inputSetting!.passkey ?? "";
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 设置默认的 method 和 responseType ， 这样其他配置不需要显式声明
    axiosConfig.responseType = "json";

    // 在请求的 headers 中添加 Bearer Token
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      Authorization: `Bearer ${this.userPasskey}`,
    };

    return super.request<T>(axiosConfig, checkLogin);
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // fix: 如果 torrent 对象没有 id ，尝试从 link 中提取 (https://github.com/pt-plugins/PT-depiler/issues/600)
    if (!torrent.id && torrent.link) {
      const match = torrent.link.match(/\/torrent\/([0-9a-z-]+)\/?/);
      if (match) {
        torrent.id = match[1];
      }
    }

    return `${this.url}api/torrent/${torrent.id}/download/${this.userPasskey}`;
  }
}
