/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HD4FANS",
  type: "private",
  schema: "NexusPHP",
  url: "https://pt.hd4fans.org/",
  tags: ["影视", "兽组"],
  collaborator: ["lilungpo", "tongyifan"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "电影" },
      { value: 404, name: "纪录片" },
      { value: 405, name: "动漫" },
      { value: 402, name: "电视剧" },
      { value: 403, name: "综艺" },
      { value: 406, name: "MV" },
      { value: 407, name: "体育" },
      { value: 409, name: "其它" },
      { value: 408, name: "音轨" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: {
        selector: ["div[class='progressarea'] > div"],
        attr: "style",
        filters: [(q: string) => (q.match(/(\d+(?:\.\d+)?)%/) || [0, 0])[1]],
      },
    },
  },
};
