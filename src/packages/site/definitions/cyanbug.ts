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
