import { IElementQuery, ISiteMetadata, ETorrentStatus } from "../types";

// TJUPT 中的 selector.search.progress 以及 selector.search.status 被其他站公用
export const selectorSearchProgress: IElementQuery = {
  selector: ["div.probar_b1, div.probar_b2, div.probar_b3"],
  attr: "style",
  filters: [
    (query: string) => {
      query = query || "";
      const queryMatch = query.match(/width:([ \d.]+)%/);
      return queryMatch && queryMatch.length >= 2
        ? parseFloat(queryMatch[1])
        : 0;
    },
  ],
};

export const selectorSearchStatus: IElementQuery = {
  selector: ['div[class*="probar_a"]'],
  attr: "class",
  filters: [
    (query: string) => {
      const queryMatch = query.match(/probar_[ab]([123])/);
      if (queryMatch && queryMatch.length >= 2) {
        switch (parseInt(queryMatch[1])) {
          case 1: // "正在下载，进度至"
            return ETorrentStatus.downloading;
          case 2: // "已下载，正在做种";
            return ETorrentStatus.seeding;
          case 3: // "下载过，已完成" or "下载过，未完成，进度至"
            return ETorrentStatus.inactive;
        }
      }
      return ETorrentStatus.unknown;
    },
  ],
};

export const siteMetadata: ISiteMetadata = {
  name: "北洋园",
  schema: "NexusPHP",
  type: "private",
  url: "https://tjupt.org/",
  description: "北洋园PT",
  tags: ["教育网", "影视", "综合"],
  collaborator: "tongyifan",
  legacyUrl: ["https://www.tjupt.org/"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "电影" },
      { value: 402, name: "剧集" },
      { value: 403, name: "综艺" },
      { value: 404, name: "资料" },
      { value: 405, name: "动漫" },
      { value: 406, name: "音乐" },
      { value: 407, name: "体育" },
      { value: 408, name: "软件" },
      { value: 409, name: "游戏" },
      { value: 411, name: "纪录片" },
      { value: 412, name: "移动视频" },
      { value: 410, name: "其他" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
    },
  },
};
