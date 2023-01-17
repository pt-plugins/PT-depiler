/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDZone",
  type: "private",
  url: "https://hdzone.me/",
  tags: ["电影"],
  schema: "NexusPHP",
  collaborator: ["ian"],
  search: {
    selectors: {
      progress: {
        selector: ["> td:eq(8)"],
        filters: [(query: string) => (query === "-" ? 0 : parseFloat(query))],
      },
    },
  },
};
