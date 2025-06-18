import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "pt99",
  name: "PT99",
  description: "An Average PT",
  tags: ["综合", "记录片", "影视", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.j99.info/"],

  favicon: "./_default_nexusphp.png", // 实在找不到favicon了

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/2c9591371523ad237f5c6f34335cb118738ea9ba
  isDead: true,
};
