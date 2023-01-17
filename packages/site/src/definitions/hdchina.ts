import type { AxiosResponse } from "axios";
import { IElementQuery, ISiteMetadata, ETorrentStatus } from "../types";
import Sizzle from "sizzle";
import NexusPHP from "../schema/NexusPHP";
import { parseSizeString } from "../utils";

// HDChina 中的部分选择器和处理方法被其他站公用
export const selectorSearchProgress: IElementQuery = {
  selector: [".progress:eq(0) > div"],
  attr: "style",
  filters: [
    (query: string) => {
      const queryMatch = query.match(/width:([ \d.]+)%/);
      return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
    },
  ],
};

export const selectorSearchStatus: IElementQuery = {
  text: ETorrentStatus.unknown,
  selector: [".progress:eq(0) > div"],
  case: {
    ".progress_seeding": ETorrentStatus.seeding,
    ".progress_completed": ETorrentStatus.completed,
    ".progress_no_downloading": ETorrentStatus.inactive,
    ".progress_downloading": ETorrentStatus.downloading,
  },
};

export const selectorUserInfoSeeding: IElementQuery = {
  selector: ["td:has( > div#ka1)"],
  filters: [
    (query: string) => {
      const queryMatch = query.match(/([\d.]+)个种子/);
      return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
    },
  ],
};

export const selectorUserInfoSeedingSize: IElementQuery = {
  selector: ["td:has( > div#ka1)"],
  filters: [
    (query: string) => {
      const queryMatch = query.match(/共计([\d.]+ ?[ZEPTGMK]?i?B)/);
      return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
    },
  ],
};

export const siteMetadata: ISiteMetadata = {
  name: "HDChina",
  description: "高清影音人士分享乐园",
  url: "https://hdchina.org/",
  tags: ["影视", "音乐", "纪录片", "综合"],
  schema: "NexusPHP",
  type: "private",
  category: {
    key: "cat",
    options: [
      { value: 20, name: "原盘(Full BD)" },
      { value: 17, name: "电影Movie(1080p)" },
      { value: 16, name: "电影Movie(1080i)" },
      { value: 9, name: "电影Movie(720p)" },
      { value: 13, name: "欧美剧(EU/US TV series)" },
      { value: 25, name: "中港台剧集(Chinese TV series)" },
      { value: 26, name: "韩剧(Kor Drama)" },
      { value: 24, name: "日剧(Jpn Drama)" },
      { value: 21, name: "欧美剧集包(EU/US TV series pack)" },
      { value: 22, name: "中港台剧集包(Chinese TV series pack)" },
      { value: 23, name: "日韩剧集包(JPN/KOR drama pack)" },
      { value: 27, name: "iPad视频(iPad Video)" },
      { value: 5, name: "纪录片(Documentary)" },
      { value: 15, name: "体育节目(Sports)" },
      { value: 14, name: "动画片(Animation)" },
      { value: 401, name: "综艺(TV Shows)" },
      { value: 402, name: "演唱会(Vocal Concert)" },
      { value: 406, name: "MV(Music Video)" },
      { value: 408, name: "音乐(Music)" },
      { value: 19, name: "补充音轨(Audio Track)" },
      { value: 405, name: "戏剧(Drama)" },
      { value: 404, name: "书籍(Book)" },
      { value: 409, name: "其他(Other)" },
      { value: 410, name: "4K UltraHD" },
      { value: 411, name: "旅游(Travel)" },
      { value: 412, name: "饮食(Food)" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [
        { selector: "img[src*='pic/share_rule_1.gif']", name: "Excl." }, // 禁转
      ],
    },
  },
  userInfo: {
    selectors: {
      // 如果页面能直接获取到的话
      seeding: selectorUserInfoSeeding,
      seedingSize: selectorUserInfoSeedingSize,
    },
  },
};

export default class HDChina extends NexusPHP {
  protected override async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const userDetailsPage: AxiosResponse<Document> = this._runtime.cacheRequest.get("/userdetails.php");  // FIXME
    const csrfAnother = Sizzle("meta[name='x-csrf']", userDetailsPage.data);
    if (csrfAnother.length > 0) {
      const csrf = csrfAnother[0].getAttribute("content") as string;

      const { data } = await this.request<{ status: number; message: string }>({
        method: "post",
        url: "/ajax_getusertorrentlist.php",
        // responseType: 'json',
        data: new URLSearchParams([
          ["userid", String(userId)],
          ["type", "seeding"],
          ["csrf", csrf],
        ]),
      });

      return data.message;
    }
    return null;
  }
}
