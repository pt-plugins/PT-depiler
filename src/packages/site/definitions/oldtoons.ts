import { type ISiteMetadata } from "../types";
import Unit3D, { SchemaMetadata } from "@ptd/site/schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "oldtoons",
  name: "Old Toons",
  aka: ["OTW"],
  description: "Old Toons World is a private site for Cartoons mainly.",
  tags: ["动画"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggc://byqgbbaf.jbeyq/"],

  userInfo: {
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
    },
  },

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search?.selectors,
    },
  },

  levelRequirements: [],
};

export default class OldtoonsWorld extends Unit3D {}
