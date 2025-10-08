/**
 * @JackettIssue https://github.com/Jackett/Jackett/issues/771
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "sdbits",
  name: "SDBits",
  description: "SDB, HDB姊妹站",
  tags: ["影视", "综合"],

  collaborator: ["luckiestone"],

  type: "private",

  urls: ["https://sdbits.org/"],

  isDead: true,
};
