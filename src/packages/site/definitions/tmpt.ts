/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/tmpt.json
 */
import type { ISiteMetadata } from "../types";
import { /* SchemaMetadata, */ xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  //...SchemaMetadata,

  version: 1,
  id: "tmpt",
  name: "唐门",
  description: "欢迎来到唐门",
  tags: ["综合", "影视"],
  collaborator: ["Exception"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://tmpt.top/"],

  // dead in 2026-03-23 ( from savept.icu
  isDead: true,

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
