/**
 * 使用TJUPT的 progress 和 status 解析，未作检查
 * Rhilip, 2021.4.12
 */
import type { ISiteMetadata } from "../types";
import { selectorSearchProgress, selectorSearchStatus } from "./tjupt";

export const siteMetadata: ISiteMetadata = {
  name: "爱薇网",
  timezoneOffset: "+0800",
  type: "private",
  schema: "NexusPHP",
  url: "https://avgv.cc/",
  description: "新加坡华人PT站，很有特色。",
  tags: ["成人", "AV", "GAY", "LES"],
  collaborator: ["xiazhou8", "匿名网友"],
  search: {
    selectors: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
    },
  },
};
