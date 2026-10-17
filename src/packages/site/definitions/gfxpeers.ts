/**
 * @JackettIssue https://github.com/Jackett/Jackett/issues/10161
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/gfxpeers.net/config.json
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "gfxpeers",
  name: "GFXPeers",
  // tags 取自上游 PT-Plugin-Plus 的 resource/sites/gfxpeers.net/config.json
  tags: ["设计", "素材"],

  collaborator: ["bimzcy"],

  type: "private",
  schema: "Gazelle",

  urls: ["https://gfxpeers.net/"],

  isDead: true,
};
