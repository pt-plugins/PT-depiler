import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "cgpeers",
  name: "CGPeers",
  description: "CGPeers 是一个专注于计算机图形资源的私有站点",
  tags: ["设计", "教育", "软件", "教程", "素材"],
  timezoneOffset: "+0000",
  collaborator: ["bimzcy"],

  type: "private",
  schema: "GazelleJSONAPI",
  urls: ["https://cgpeers.to/", "https://cgpeers.com/"],
  formerHosts: ["www.cgpeers.com"],

  search: {
    ...SchemaMetadata.search,
    advanceKeywordParams: {
      imdb: false,
    },
  },
};
