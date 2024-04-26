/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDFans",
  timezoneOffset: "+0800",
  description: "与志同道合之人前行 分享更多值得珍藏的资源",
  url: "https://hdfans.org/",
  tags: ["综合", "电影", "电视剧", "纪录片"],
  schema: "NexusPHP",
  type: "private",
  collaborator: ["csi0n"],
  search: {
    selectors: {
      progress: {
        selector: ["> td:eq(9)"],
        filters: [(query: string) => (query === "--" ? 0 : parseFloat(query))],
      },
      status: {
        selector: ["> td:eq(9)"],
        filters: [
          (query: string) =>
            query === "--"
              ? ETorrentStatus.unknown
              : parseFloat(query) >= 100
                ? ETorrentStatus.completed
                : ETorrentStatus.inactive,
        ],
      },
    },
  },
};
