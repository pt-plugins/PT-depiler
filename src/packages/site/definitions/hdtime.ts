import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDTime",
  schema: "NexusPHP",
  type: "private",
  url: "https://hdtime.org/",
  description: "HDTime, time to forever!",
  tags: ["影视", "综合"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "电影" },
      { value: 424, name: "Blu-Ray原盘" },
      { value: 402, name: "剧集" },
      { value: 403, name: "综艺" },
      { value: 405, name: "动漫" },
      { value: 414, name: "软件" },
      { value: 407, name: "体育" },
      { value: 404, name: "纪录片" },
      { value: 406, name: "MV" },
      { value: 408, name: "音乐" },
      { value: 410, name: "游戏" },
      { value: 411, name: "文档" },
      { value: 409, name: "其他" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: {
        selector: ["div.progressarea"],
        filters: [parseFloat],
      },
      status: {
        selector: ["div.progressarea"],
        filters: [
          // 未交待具体情况，不能准确判断时候是在下载中，所以置 unknown
          (query: string) => (parseFloat(query) >= 100 ? ETorrentStatus.completed : ETorrentStatus.unknown),
        ],
      },
    },
  },
};
