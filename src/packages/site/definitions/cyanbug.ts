/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/cyanbug.yml
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/cyanbug.net/config.json
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/cyanbug.json
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata, xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "cyanbug",
  name: "CyanBug",
  aka: ["大青虫"],
  description: "大青虫们在此聚集",
  tags: ["综合", "影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["jinglekang", "hui-shao", "EasonWong"],

  urls: ["uggcf://plnaoht.arg/"],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
