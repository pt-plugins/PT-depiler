/**
 * 旧版直接迁移，未测试Gazelle模板匹配性
 * Rhilip, 2021.4.22
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "LzTr",
  timezoneOffset: "+0000",
  description: "music",
  url: "https://lztr.me/",
  tags: ["音乐"],
  schema: "Gazelle",
  type: "private",
  collaborator: "ylxb2016",
  feature: {
    skipImdbSearch: true,
  },
};
