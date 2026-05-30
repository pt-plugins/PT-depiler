import type { AxiosRequestConfig, AxiosResponse } from "axios";

import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import type { ILevelRequirement, ISearchInput, ISiteMetadata, ITorrent, ITorrentTag } from "../types";

const levelRequirements: ILevelRequirement[] = [
  {
    id: 0,
    name: "乱民",
    ratio: 0.3,
    privilege: "无",
  },
  {
    id: 1,
    name: "小卒",
    ratio: 0.5,
    privilege: "注册后默认等级，待系统更新后会自动升级到level2",
  },
  {
    id: 2,
    name: "教谕",
    ratio: 0.6,
    privilege: "可查看站点统计",
  },
  {
    id: 3,
    name: "登仕郎",
    downloaded: "100GB",
    ratio: 1,
    privilege: "新注册用户系统定时更新后的默认等级；可查看种子TOP10排行",
  },
  {
    id: 4,
    name: "修职郎",
    interval: "P4W",
    downloaded: "200GB",
    ratio: 2,
    privilege: "可查看种子TOP250信息；可查看用户TOP10信息",
  },
  {
    id: 5,
    name: "文林郎",
    interval: "P8W",
    downloaded: "400GB",
    ratio: 3,
    privilege: "可查看用户TOP250信息，可匿名发帖",
  },
  {
    id: 6,
    name: "忠武校尉",
    interval: "P12W",
    downloaded: "500GB",
    ratio: 4,
    privilege: "可设定免候选发布种子",
  },
  {
    id: 7,
    name: "承信将军",
    interval: "P16W",
    downloaded: "800GB",
    ratio: 5,
    privilege: "发帖可禁止评论",
  },
  {
    id: 8,
    name: "武毅将军",
    interval: "P20W",
    downloaded: "1TB",
    ratio: 6,
    privilege: "无",
  },
  {
    id: 9,
    name: "武节将军",
    interval: "P24W",
    downloaded: "2TB",
    ratio: 7,
    isKept: true,
    privilege: "此等级及以上用户，账号将永久保留",
  },
  {
    id: 10,
    name: "显威将军",
    interval: "P28W",
    downloaded: "2.5TB",
    ratio: 8,
    isKept: true,
    privilege: "无",
  },
  {
    id: 11,
    name: "宣武将军",
    interval: "P32W",
    downloaded: "3TB",
    ratio: 9,
    isKept: true,
    privilege: "无",
  },
];

interface IFetchUserPointAccResp {
  hourBasePoint: number;
  hourOwnerPoint: number;
  hourPoint: number;
}

const promotionOptions = [
  { name: "无", value: "none" },
  { name: "50%", value: "half" },
  { name: "Free", value: "free" },
];

const uploadPromotionOptions = [
  { name: "无", value: "none" },
  { name: "1.5xUp", value: "one_half" },
  { name: "2xUp", value: "double_upload" },
];

const sorterFields = {
  id: "ID",
  fileSize: "大小",
  leechNum: "下载数",
  seedNum: "做种数",
  completedNum: "完成数",
  listingTime: "发布时间",
  uploadPromotionEndTime: "上传促销结束时间",
  downloadPromotionEndTime: "下载促销结束时间",
};

const sorterOrders = {
  descend: "降序",
  ascend: "升序",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "yemapt",
  name: "YemaPT",
  description:
    "YemaPT 是一个由全新技术架构构建而来的综合类资源PT站点。有分享率和登录要求，可访问 wiki.yemapt.org 查看。",
  tags: ["综合"],
  collaborator: ["Rhilip"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "YemaPT",

  urls: ["https://www.yemapt.org/"],

  category: [
    {
      name: "类目",
      key: "categoryId",
      keyPath: "data",
      options: [
        { name: "影视", value: "1" },
        { name: "影视 / 电影", value: "4" },
        { name: "影视 / 剧集", value: "5" },
        { name: "影视 / 综艺", value: "13" },
        { name: "影视 / 动漫", value: "14" },
        { name: "影视 / 纪录片", value: "15" },
        { name: "影视 / 体育", value: "17" },
        { name: "影视 / 短剧", value: "6" },
        { name: "影视 / MV/演唱会", value: "16" },

        { name: "综合", value: "2" },
        { name: "综合 / 软件", value: "3" },
        { name: "综合 / 游戏", value: "10" },
        { name: "综合 / 书籍", value: "12" },
        { name: "综合 / 其他", value: "22" },

        { name: "音频", value: "7" },
        { name: "音频 / 音乐", value: "8" },
        { name: "音频 / 广播剧", value: "9" },

        { name: "教育", value: "18" },
        { name: "教育 / 教育书籍", value: "19" },
        { name: "教育 / 教育音频", value: "20" },
        { name: "教育 / 教育视频", value: "21" },
      ],
      cross: false,
    },
    {
      name: "下载促销",
      key: "downloadPromotionType",
      keyPath: "data",
      options: promotionOptions,
      cross: false,
    },
    {
      name: "上传促销",
      key: "uploadPromotionType",
      keyPath: "data",
      options: uploadPromotionOptions,
      cross: false,
    },
    {
      name: "排序",
      key: "sorter",
      options: Object.entries(sorterFields).flatMap(([field, fieldName]) =>
        Object.entries(sorterOrders).map(([order, orderName]) => ({
          name: `${fieldName} ${orderName}`,
          value: `${field}:${order}`,
        })),
      ),
      cross: false,
      generateRequestConfig: (selectedCategories) => {
        const [field, order] = String(selectedCategories).split(":");
        return { requestConfig: { data: { sorter: { field, order } } } };
      },
    },
  ],

  search: {
    keywordPath: "data.keyword",
    requestConfig: {
      method: "POST",
      url: "/api/torrent/fetchOpenTorrentList",
      responseType: "json",
      data: {
        pageParam: { current: 1, pageSize: 40, total: 1000 },
        sorter: { order: "descend", field: "listingTime" },
      },
    },
    selectors: {
      rows: { selector: "data" },
      id: { selector: "id" },
      title: { selector: "showName" },
      subTitle: { selector: "shortDesc" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/#/torrent/detail/"] }] },
      link: { selector: "id", filters: [{ name: "prepend", args: ["/api/torrent/download?id="] }] },
      time: { selector: "listingTime", filters: [{ name: "parseTime", args: ["yyyy-MM-dd'T'HH:mm:ss.SSSXXX"] }] },
      size: { selector: "fileSize" },
      author: { selector: "userInfo.name" },
      seeders: { selector: "seedNum" },
      leechers: { selector: "leechNum" },
      completed: { text: 0 }, // 该站点在种子列表搜索 API 中没有返回 completedNum
      comments: { text: 0 }, // 该站点在种子列表搜索 API 中没有返回 torrentCommentNum
      category: { selector: "categoryName" },
      // tags 交由 parseTorrentRowForTags 处理
      ext_douban: { text: "", selector: "douban" },
      ext_imdb: { text: "", selector: "imdb", filters: [{ name: "extImdbId" }] },
    },
  },

  list: [
    {
      urlPattern: ["/#/openTorrent/list"],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "tr[data-row-key]" },
        id: { selector: ":self", attr: "data-row-key" },
        title: { selector: [".torrent-title", "a[href*='#/torrent/detail/']", "a[href*='/#/torrent/detail/']"] },
        subTitle: { selector: ".short-desc" },
        url: {
          selector: ":self",
          attr: "data-row-key",
          filters: [{ name: "prepend", args: ["/#/torrent/detail/"] }],
        },
        link: {
          selector: ":self",
          attr: "data-row-key",
          filters: [{ name: "prepend", args: ["/api/torrent/download?id="] }],
        },
        size: { selector: ".file-size", filters: [{ name: "parseSize" }] },
      },
    },
  ],

  detail: {
    urlPattern: ["/#/torrent/detail/\\d+/?"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          return element.URL.match(/\/#\/torrent\/detail\/(\d+)\/?/)?.[1] ?? element.URL;
        },
      },
      title: { selector: ".torrent-title" },
      link: { text: "" },
    },
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: "/api/consumer/fetchSelfDetail", responseType: "json" },
        selectors: {
          id: { selector: "data.id" },
          name: { selector: "data.name" },
          levelName: {
            selector: "data.level",
            filters: [(q: number) => levelRequirements.find((x) => x.id === q)?.name ?? q],
          },
          levelId: { selector: "data.level" },
          joinTime: {
            selector: "data.registerTime",
            filters: [{ name: "parseTime", args: ["yyyy-MM-dd'T'HH:mm:ss.SSSXXX"] }],
          },
          invites: { selector: "data.invitedNum" },
          uploaded: { selector: "data.promotionUploadSize" },
          downloaded: { selector: "data.promotionDownloadSize" },
          trueUploaded: { selector: "data.uploadSize" },
          trueDownloaded: { selector: "data.downloadSize" },
          bonus: { selector: "data.bonus" },
        },
      },
      {
        requestConfig: {
          url: "/api/torrent/fetchSelfTorrentCount",
          method: "POST",
          data: {}, // 需要传一个空对象，否则请求会报错
          responseType: "json",
        },
        selectors: {
          uploads: { selector: "data" },
        },
      },
      {
        requestConfig: { url: "/api/userTorrent/fetchSeedTorrentInfo", method: "POST", responseType: "json" },
        selectors: {
          seeding: { selector: "data.num" },
          seedingSize: { selector: "data.fileSize" },
        },
      },
      {
        requestConfig: { url: "/api/consumer/fetchUserPointAcc", responseType: "json" },
        selectors: {
          bonusPerHour: {
            selector: "data",
            filters: [
              (query: IFetchUserPointAccResp) =>
                query ? query.hourPoint + query.hourBasePoint + query.hourOwnerPoint : 0,
            ],
          },
        },
      },
    ],
  },

  levelRequirements,

  userInputSettingMeta: [
    {
      name: "token",
      label: "API Auth Key",
      hint: "在个人面板 - 详情 - 安全设定中获取 API Auth Key 并填入此处",
      required: true,
    },
  ],
};

const YemaTagsEnum: Record<string, ITorrentTag> = {
  "1": { name: "禁转" },
  "2": { name: "首发" },
  "3": { name: "官组" },
  "4": { name: "DIY" },
  "5": { name: "国语" },
  "6": { name: "中字" },
  "7": { name: "粤语" },
  "8": { name: "英字" },
  "9": { name: "HDR10" },
  "10": { name: "杜比视界" },
  "11": { name: "连载中" },
  "12": { name: "完结" },
  "13": { name: "多国字幕" },
  "14": { name: "HDR10+" },
  "15": { name: "杜比全景声(Atmos)" },
  "16": { name: "DTS-X" },
  "17": { name: "5.1/7.1声道" },
  "18": { name: "完结全集" },
  "19": { name: "SP/剧场版/OVA" },
} as const;

// docs: https://wiki.yemapt.org/developer/constants
interface IYemaRawTorrent {
  downloadPromotion: "none" | "half" | "free";
  uploadPromotion: "none" | "one_half" | "double_upload";
  tagList: (keyof typeof YemaTagsEnum)[];
}

interface IYemaApiResp<D> {
  success?: boolean;
  showType?: number;
  errorMessage?: string;
  data?: D;
  [key: string]: unknown;
}

export default class YemaPT extends PrivateSite {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      Authorization: this.userConfig.inputSetting!.token ?? "",
    };

    const response = await super.request<T>(axiosConfig, false);
    const responseData = response.data as IYemaApiResp<unknown> | undefined;

    if (checkLogin && responseData && typeof responseData === "object" && responseData.success === false) {
      throw new Error(responseData.errorMessage || "YemaPT API request failed");
    }

    return response;
  }

  protected override fixLink(uri: string, requestConfig: AxiosRequestConfig): string {
    return super.fixLink(uri, { ...requestConfig, baseURL: this.url }); // 将 baseURL 重新指向回 web 页面
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const { data } = await this.request<IYemaApiResp<string | { key?: string; token?: string }>>({
      url: "/api/torrent/generateDownloadKey",
      method: "GET",
      responseType: "json",
      params: { id: torrent.id },
    });

    const rawKey = data?.data;
    const downloadKey = typeof rawKey === "string" ? rawKey : (rawKey?.key ?? rawKey?.token);

    if (!downloadKey) {
      throw new Error(`Failed to generate YemaPT download key for torrent ${torrent.id}`);
    }

    return new URL(`/api/torrent/download1?token=${encodeURIComponent(downloadKey)}`, this.url).toString();
  }

  public override async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig> {
    return {
      url: await this.getTorrentDownloadLink(torrent),
      method: "GET",
      timeout: this.userConfig.timeout ?? 30e3,
    };
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IYemaRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];

    switch (row.uploadPromotion) {
      case "double_upload":
        tags.push({ name: "2xUp", color: "green" });
        break;
      case "one_half":
        tags.push({ name: "1.5xUp", color: "light-green" });
        break;
    }

    switch (row.downloadPromotion) {
      case "free":
        tags.push({ name: "Free", color: "blue" });
        break;
      case "half":
        tags.push({ name: "50%", color: "orange" });
        break;
    }

    for (const rawTag of row.tagList ?? []) {
      if (YemaTagsEnum[rawTag]) {
        tags.push(YemaTagsEnum[rawTag]);
      }
    }

    torrent.tags = tags;
    return torrent;
  }
}
