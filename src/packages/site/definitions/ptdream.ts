import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "ptdream",
  name: "PTDream",
  aka: ["PT梦想"],
  tags: ["剧集", "电影", "综合"],
  collaborator: ["iceyuamao0510", "DXV5"],

  type: "private",
  schema: "NexusPHP", // meanTorrent

  urls: ["https://www.ptdream.net/", "https://plus.ptdream.net/"],

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/db87ee0843f474d31edb84bbe92f82dafb3236ad
  isDead: true,
};
