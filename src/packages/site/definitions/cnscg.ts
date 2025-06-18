import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "cnscg",
  name: "圣城家园PT",
  tags: ["影视", "综合"],
  description: "hdscg，cnscg圣城家园PT站点",
  collaborator: ["DXV5"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://www.cnscg.club/"],
  formerHosts: ["www.hdscg.cc"],

  favicon: "./_default_nexusphp.png", // 实在找不到favicon了

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/3d984c939484c571448745c6141051f6dbd6639e
  isDead: true,
};
