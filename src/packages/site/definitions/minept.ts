import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "minept",
  name: "MINE.pt",
  aka: ["MINE", "地雷站", "矿站"],
  description: "国内首个使用meanTorrent架构站点",
  tags: ["影视", "综合"],

  type: "private",
  schema: "meanTorrent",

  urls: ["uggcf://zvar.cg/"],

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/ef7a885c052a9dc23286fb54e33dbef3dd9431ed
  isDead: true,
};
