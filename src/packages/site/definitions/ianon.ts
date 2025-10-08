/**
 * @JackettIssue https://github.com/Jackett/Jackett/issues/14219
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "ianon",
  name: "iAnon",
  description: "iAnon is a Private MacOS software tracker",
  tags: ["Apple", "macOS", "软件"],

  collaborator: ["welladam"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://ianon.app/"],

  isDead: true,
};
