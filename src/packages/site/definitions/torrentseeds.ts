/**
 * @JackettIssue https://github.com/Jackett/Jackett/issues/4842
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/torrentseeds.org/config.json
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentseeds",
  name: "TorrentSeeds",
  favicon: "./_default_unit3d.ico",

  collaborator: ["ian"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://www.torrentseeds.org/"],

  isDead: true,
};
