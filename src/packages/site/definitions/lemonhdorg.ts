import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "lemonhdorg",
  name: "LemonHD",
  aka: ["柠檬"],
  description:
    "LemonHD（原名 LeagueHD）是一个专注于高清资源的中文私密种子分享站点，主要提供电影、电视剧以及综合类别内容。",
  tags: ["影视", "综合"],
  collaborator: ["enigmaz", "timyuan"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://lemonhd.org/"],
  formerHosts: ["leaguehd.com"],

  isDead: true,

  officialGroupPattern: [/(-LHD|League(WEB|CD|NF|HD|TV|MV))$/i],
};
