import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "qingyingpt",
  name: "清影PT",
  description: "哈尔滨工业大学维护的PT站",
  tags: ["教育网", "影视", "综合"],
  collaborator: ["bentleyxia"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hitpt.org/"],

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/d5b58d2dba5286a1e35205f1c8ad37d3e8f22f9f
  isDead: true,
};
