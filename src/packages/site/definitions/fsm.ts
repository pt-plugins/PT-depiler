import { type ILevelRequirement, ISearchInput, ISiteMetadata, ITorrent, ITorrentTag, ETorrentStatus } from "@ptd/site";
import PrivateSite from "@ptd/site/schemas/AbstractPrivateSite.ts";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const levelRequirements: (ILevelRequirement & { levelId?: number })[] = [
  {
    id: 1,
    name: "封禁用户",
    privilege: "无法解封，感谢曾经来过",
  },
  {
    id: 3,
    name: "注册成员",
    privilege: "投票中拥有1票权",
  },
  {
    id: 4,
    name: "特殊贡献成员",
    privilege: "投票中拥有3票权，不计下载量",
  },
  {
    id: 5,
    name: "自制委员会",
    privilege: "投票中拥有10票权",
  },
];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "fsm",
  name: "FSM",
  aka: ["飞天拉面神教"],
  description: "FSM（飞天拉面神教）是一家专注于R18内容的PT站点，需要配置搜索入口才可搜索",
  tags: ["成人"],
  timezoneOffset: "+0800",

  collaborator: [""],

  type: "private",
  schema: "FSM",

  urls: [ "aHR0cHM6Ly9mc20ubmFtZS8=" ],
  formerHosts: [""],

  category: [
    {
      name: "搜索入口",
      notes: "请勾选成人以开启搜索",
      key: "tags",
      keyPath: "params",
      options: [
        { name: "成人", value: "[]" }
      ],
      cross: false
    },
    {
      name: "分类",
      key: "type",
      keyPath: "params",
      options: [
        { name: "所有分类", value: "0" },
        { name: "日本AV", value: "1" },
        { name: "国产视频", value: "2" },
        { name: "写真", value: "3" },
        { name: "黄油", value: "4" },
        { name: "里番", value: "5" },
        { name: "黄漫", value: "6" },
        { name: "欧美视频", value: "7" },
        { name: "其他涩涩", value: "8" },
      ],
      cross: false
    },
    {
      name: "促销",
      key: "systematics",
      keyPath: "params",
      options: [
        { name: "Normal", value: "0" },
        { name: "2xFREE", value: "1" },
        { name: "FREE", value: "2" },
      ],
      cross: false
    },
  ],

  search: {
    keywordPath: "params.keyword",
    requestConfig: {
      method: "GET",
      url: "/Torrents/listTorrents",
      responseType: "json",
    },
    selectors: {
      rows: { selector: "data.list" },
      id: { selector: "tid" },
      title: { selector: "title" },
      // subtitle: 不返回，在 class 中单独构造
      url: { selector: "tid", filters: [{ name: "perpend", args: ["Torrents/details?tid="] }] },
      // link: 不返回，在 class 中单独构造
      time: { selector: "createdTs" },
      size: { selector: "fileRawSize" },
      author: { text: "FSMer" }, // 该站点强制匿名发布
      seeders: { 
        selector: "peers.upload",
        // 该站点在种子列表搜索 API 中返回的做种数在0的状态下非string
        filters: [
          (value: any) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
          }
        ]
      },
      leechers: { 
        selector: "peers.download",
        filters: [
          (value: any) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
          }
        ]
      },
      completed: { selector: "finish" },
      comments: { text: 0 }, // 该站点在种子列表搜索 API 中没有返回 torrentCommentNum
      category: { selector: "type.name" },
    },
  },

  searchEntry: {
    area_adult: { name: "成人", enabled: false },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/Users/infos", method: "GET", responseType: "json" },
        fields: ["id", "name"],
        selectors: {
          id: { selector: "data.uid" },
          name: { selector: "data.username" },
        },
      },
      {
        requestConfig: { url: "/Users/profile", params: { uid: "$id$" }, method: "GET", responseType: "json" },
        assertion: { id: "params.uid" },
        fields: ["joinTime", "uploaded", "downloaded", "levelName", "levelId", "bonus", "seedingBonus", "bonusPerHour", "seeding", "seedingSize", "uploads"],
        selectors: {
          joinTime: { 
            selector: "data.createdTs",
            // 该站点在用户信息 API 中返回的加入时间为timestamp
            filters: [
              (query: string) => {
                const ts = Number(query);
                if (isNaN(ts)) return query;
                return new Date(ts * 1000).toISOString().split("T")[0];
              },
            ],
          },
          uploaded: { selector: "data.upload", filters: [{ name: "parseNumber" }] },
          downloaded: { selector: "data.download", filters: [{ name: "parseNumber" }] },
          levelName: {
            selector: "data.userRank.name",
            filters: [(q: number) => levelRequirements.find((x) => x.id === q)?.name ?? q],
          },
          levelId: { selector: "data.userRank.id" },
          bonus: { selector: "data.point" },
          seedingBonus: { selector: "data.totalSeedGH" },
          seeding: { selector: "data.nowActiveUpload" },
          seedingSize: { selector: "data.nowActiveUploadSize", filters: [{ name: "parseNumber" }] },
          uploads: { selector: "data.torrent" },
        },
      },
      {
        requestConfig: { url: "/Mail/countUnRead", method: "GET", responseType: "json" },
        selectors: {
          messageCount: { selector: "data.count" },
        },
      },
    ],
  },

  levelRequirements,

  userInputSettingMeta: [
    {
      name: "token",
      label: "Token",
      hint: "在网页底部-API生成APITOKEN并填入此处，每次APITOKEN有效期28天",
      required: true,
    },
  ],
} as const;

interface IFsmActress {
  id: number;
  name: string;
  avatar: string;
}

interface IFsmRawTorrent {
  actress?: IFsmActress[];
  tags?: string[];  
  status: {
    hasStatus: boolean;
    upCoefficient: number;
    downCoefficient: number;
    class: string | null;
    name: "Free" | "2xFree" | null;
  };
  snatchInfo?: {
    status: string | null;
    progress: number | null;
  };
}

interface IFsmRawResp<T> {
  success: boolean;
  data: T;
  msg: string;
}

/**
 * FSM 站点类，交互通过 API 进行
 */
export default class Fsm extends PrivateSite {
  // 使用api.域名
  get apiBaseUrl(): string {
    return this.url.replace(/https:\/\//, "https://api.");
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 将请求的 baseUrl 设置为 api. 域名
    axiosConfig.baseURL = this.apiBaseUrl;

    // 设置默认的 method 和 responseType ， 这样其他配置不需要显式声明
    axiosConfig.method = "GET"; // 站点的请求方式为 POST
    axiosConfig.responseType = "json";

    // 在请求的 headers 中添加 存取令牌
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "APITOKEN": this.userConfig.inputSetting!.token ?? "", // FIXME 是否允许我们设置一个空字符？
    };
    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override loggedCheck(raw: AxiosResponse<IFsmRawResp<any>>): boolean {
    return !!raw.data?.success;
  }

  protected override fixLink(uri: string, requestConfig: AxiosRequestConfig): string {
    return super.fixLink(uri, { ...requestConfig, baseURL: this.url }); // 将 baseURL 重新指向回 web 页面
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IFsmRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    // 生成副标题（演员名与标签）
    const tagsArray = Array.isArray(row.tags) ? row.tags : [];
    const actressArray = Array.isArray(row.actress) ? row.actress : [];
    const actressNames = actressArray.map((a: any) => a.name).filter(Boolean);
    const tagList = tagsArray.filter(Boolean);
    const actressStr = actressNames.join(",");
    const tagStr = tagList.join(",");
    const subTitle = [actressStr, tagStr].filter(Boolean).join(" | ");

    // 增加促销标签
    const tags: ITorrentTag[] = [];
    const discount = row.status.name ?? "Normal";
    switch (discount) {
      case "Free":
        tags.push({ name: "Free", color: "blue" });
        break;
      case "2xFree":
        tags.push({ name: "2xFree", color: "green" });
        break;
    }

    // 展示下载进度/做种状态
    const progress = Number(row.snatchInfo?.progress ?? 0);
    const rawStatus = row.snatchInfo?.status ?? "UNKNOWN";

    let status: ETorrentStatus;
    switch (rawStatus.toUpperCase()) {
      case "DOWNLOAD":
        status = ETorrentStatus.downloading;
        break;
      case "SEED":
        status = ETorrentStatus.seeding;
        break;
      case "STOP":
        status = progress === 100 ? ETorrentStatus.completed : ETorrentStatus.inactive;
        break;
      default:
        status = ETorrentStatus.unknown;
    }

    torrent.subTitle = subTitle;
    torrent.tags = tags;
    torrent.progress = progress;
    torrent.status = status;

    return torrent;
  }
  
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 获取passkey
    const { data } = await this.request<IFsmRawResp<{ passkey: string }>>({
      method: "GET",
      url: "/Users/infos",
      headers: { "Content-Type": "application/json" },
    });

    // 生成下载链接
    const downloadUrl = `${this.apiBaseUrl}Torrents/download?tid=${torrent.id}&passkey=${data.data.passkey}&source=direct`;

    return downloadUrl;
  }
}
