import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "snakepop",
  name: "Snakepop",
  tags: ["音乐"],
  collaborator: ["timyuan"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["uggcf://fanxrcbc.neg/"],

  // NOTE 这个站实在没有找到 favicon

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/d9516f1bb5b9551caf251c4c2a6bbd6dcf332f89
  isDead: true,
};
