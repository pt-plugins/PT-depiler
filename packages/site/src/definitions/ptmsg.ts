/**
 * FIXME 无号，未进行测试，仅依赖老版本说明文件
 * Rhilip, 2021.04.09
 */
import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "PTMSG",
  schema: "NexusPHP",
  type: "private",
  url: "https://pt.msg.vg/",
  description: "The Ultimate File Sharing Experience",
  collaborator: "bjgetite",
  search: {
    selectors: {
      progress: {
        selector: ["div.progressarea"],
        attr: "title",
        filters: [(query: string) => (/做种中/.test(query) ? 100 : 0)],
      },
      status: {
        selector: ["div.progressarea"],
        attr: "title",
        filters: [
          (query: string) => {
            switch (true) {
              case /做种中/.test(query):
                return ETorrentStatus.seeding;
              case /已完成/.test(query):
                return ETorrentStatus.completed;
              case /下载中/.test(query):
                return ETorrentStatus.downloading;
              case /未完成/.test(query):
                return ETorrentStatus.inactive;
              default:
                return ETorrentStatus.unknown;
            }
          },
        ],
      },
    },
  },
};
