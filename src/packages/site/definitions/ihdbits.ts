import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "ihdbits",
  name: "iHDBits",
  description: "The Ultimate File Sharing Experience",
  collaborator: ["koal"],
  tags: ["影视"],

  type: "private",
  schema: "NexusPHP",

  urls: ["http://ihdbits.me/", "https://pt.newworld.plus/"],

  favicon: "./_default_nexusphp.png",

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/7c9be82dc112cdc93525c2d46296b9454a4a7b1a
  isDead: true,
};
