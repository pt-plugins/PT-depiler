import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "UltraHD",
  type: "private",
  timezoneOffset: "+0800",
  schema: "NexusPHP",
  url: "https://ultrahd.net/",
  description: "韩剧",
  tags: ["电影", "电视剧", "综艺", "纪录片", "动漫"],
  search: {
    categories: [
      {
        name: "类别",
        key: "cat",
        options: [
          { name: "电影", value: 401 },
          { name: "电视剧", value: 402 },
          { name: "综艺", value: 403 },
          { name: "纪录片", value: 404 },
          { name: "动漫", value: 405 },
        ],
        cross: { mode: "append" },
      },
    ],
    selectors: {
      progress: {
        selector: ".torrentname td:first-child > div[title]:last-child",
        attr: "title",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/([.\d]+)%/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      status: {
        selector: ".torrentname td:first-child > div[title]:last-child",
        case: {
          '[title^="leeching"]': ETorrentStatus.downloading,
          '[title^="seeding"]': ETorrentStatus.seeding,
          '[title^="inactivity"]': ETorrentStatus.completed,
        },
      },
    },
  },
};
