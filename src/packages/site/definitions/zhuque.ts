import { type ISearchInput, ISiteMetadata, type ITorrent, type ITorrentTag } from "../types";
import { sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types/storages/metadata.ts";
import PrivateSite from "@ptd/site/schemas/AbstractPrivateSite.ts";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const categoryMap: Record<number, string> = {
  501: "电影",
  502: "剧集",
  503: "动画",
  504: "节目",
  599: "其它",
};

const mediumMap: Record<number, string> = {
  301: "UHD Blu-ray",
  302: "UHD Blu-ray DIY",
  303: "Blu-ray",
  304: "Blu-ray DIY",
  305: "Remux",
  306: "Encode",
  307: "UHDTV",
  308: "HDTV",
  309: "WEB-DL",
  399: "Other",
};

const resolutionMap: Record<number, string> = {
  401: "720p",
  402: "1080i",
  403: "1080p",
  404: "2160p",
  499: "Other",
};

const videoCodingMap: Record<number, string> = {
  101: "H264",
  102: "H265",
  103: "x264",
  104: "x265",
  199: "Other",
};

const tagsMap: Record<number, string> = {
  601: "官方",
  602: "禁转",
  603: "国语",
  604: "中字",
  611: "杜比视界",
  613: "HDR10",
  614: "特效字幕",
  621: "完结",
  622: "分集",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "zhuque",
  name: "朱雀",
  aka: ["zhuque"],
  description: "新架构的影视站点",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "TNode",

  urls: ["uggcf://muhdhr.va/"],

  collaborator: ["hui-shao"],

  category: [
    {
      name: "分类",
      key: "category",
      keyPath: "data",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
    {
      name: "媒介",
      key: "medium",
      keyPath: "data",
      options: Object.entries(mediumMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolution",
      keyPath: "data",
      options: Object.entries(resolutionMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
    {
      name: "视频编码",
      key: "videoCoding",
      keyPath: "data",
      options: Object.entries(videoCodingMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
    {
      name: "标签",
      key: "tags",
      keyPath: "data",
      options: Object.entries(tagsMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
  ],

  search: {
    keywordPath: "data.keyword",
    requestConfig: {
      url: "/api/torrent/advancedSearch",
      method: "POST",
      data: { page: 1, size: 100, type: "title" }, // 搜索标题和副标题
      responseType: "json",
    },

    selectors: {
      rows: { selector: "data.torrents" },
      id: { selector: "id" },
      title: { selector: "title" },
      subTitle: { selector: "subtitle" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/torrent/info/"] }] },
      link: { selector: "id", filters: [{ name: "prepend", args: ["/api/torrent/download/"] }] },
      time: { selector: "upload_time", filters: [(v: number) => v * 1000] },
      size: { selector: "size" },
      category: { selector: "category", filters: [(v: number) => categoryMap[v] ?? String(v)] },
      seeders: { selector: "seeding" },
      leechers: { selector: "leeching" },
      completed: { selector: "complete" },
      comments: { selector: "review" },

      progress: { selector: "progress" },
      ext_imdb: { selector: ["imdb_id"], filters: [{ name: "extImdbId" }] },
      // status 站点似乎未提供
      // tags 交由 parseTorrentRowForTags 处理
    },
  },

  searchEntry: {
    area_all: { name: "全部", enabled: true },
  },

  userInfo: {
    pickLast: ["id", "joinTime"],
    process: [
      {
        requestConfig: { url: "/api/plugins/ptppUserInfo", responseType: "json" },
        selectors: {
          id: { selector: "data.id" },
          name: { selector: "data.name" },
          levelName: { selector: "data.levelName" },
          joinTime: {
            selector: "data.joinTime",
            filters: [(v: string | number) => Number(v) * 1000],
          },
          uploaded: { selector: "data.uploaded" },
          downloaded: { selector: "data.downloaded" },
          bonus: { selector: "data.bonus" },
          seedingBonus: { selector: "data.seedingPoints" },
          bonusPerHour: { selector: "data.bonusPerHour" },
          uploads: { selector: "data.uploadCount" },
          seeding: { selector: "data.seeding" },
          seedingSize: { selector: "data.seedingSize" },
          messageCount: { selector: "data.messageCount" },
          csrfToken: { selector: "data.csrfToken" },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "筑基",
      privilege: "入站初始等级",
    },
    {
      id: 2,
      name: "结丹",
      interval: "P5W",
      downloaded: "10GB",
      ratio: 2,
      privilege: "无",
    },
    {
      id: 3,
      name: "元婴",
      interval: "P10W",
      downloaded: "25GB",
      ratio: 2,
      privilege: "无",
    },
    {
      id: 4,
      name: "出窍",
      interval: "P15W",
      downloaded: "50GB",
      ratio: 2,
      privilege: "无",
    },
    {
      id: 5,
      name: "炼虚",
      interval: "P20W",
      downloaded: "100GB",
      ratio: 2,
      privilege: "无",
    },
    {
      id: 6,
      name: "合体",
      interval: "P25W",
      downloaded: "200GB",
      ratio: 4,
      privilege: "无",
    },
    {
      id: 7,
      name: "大乘",
      interval: "P30W",
      downloaded: "300GB",
      ratio: 6,
      privilege: "无",
    },
    {
      id: 8,
      name: "真仙",
      interval: "P35W",
      downloaded: "400GB",
      ratio: 8,
      privilege: "无",
    },
  ],
};

export default class Zhuque extends PrivateSite {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 在请求的 headers 中添加 csrfToken
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "x-csrf-token": (await this.getCsrfToken()) ?? "",
    };
    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];

    // 处理促销情况
    const { uploadRate, downloadRate } = row as { uploadRate?: number; downloadRate?: number };
    switch (uploadRate) {
      case 2:
        tags.push({ name: "2xUp", color: "green" });
        break;
    }
    switch (downloadRate) {
      case 0:
        tags.push({ name: "Free", color: "blue" });
        break;
    }

    // 处理普通标签
    const tags_array = (row as { tags?: number[] }).tags ?? [];
    if (tags_array.length > 0) {
      for (const tagId of tags_array) {
        const tagName = tagsMap[tagId];
        if (tagName) {
          tags.push({ name: tagName });
        }
      }
    }

    torrent.tags = tags;
    return torrent;
  }

  private async getCsrfToken() {
    const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
    return metadataStore?.lastUserInfo?.zhuque?.csrfToken ?? "";
  }
}
