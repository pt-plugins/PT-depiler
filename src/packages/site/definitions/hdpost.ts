/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/pt.hdpost.top/config.json
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/hdpost.json
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdpost",
  name: "HDPOST",
  tags: ["电影", "电视剧"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://pt.hdpost.top/"],

  isDead: true,
};
