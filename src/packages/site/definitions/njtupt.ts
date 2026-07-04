import type { ISiteMetadata } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  xiaomloveDefaultUserLevelRequirements,
} from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "njtupt",
  name: "浦园",
  collaborator: ["koal"],
  type: "private",
  schema: "NexusPHP",

  urls: ["https://njtupt.top/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
