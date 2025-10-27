/**
 * @JackettIssue https://github.com/Jackett/Jackett/issues/13211
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "baconbits",
  name: "baconBits",
  aka: ["bB"],
  description: "bB is a Private Torrent Tracker for 0DAY / GENERAL",
  tags: ["综合"],

  type: "private",

  urls: ["https://baconbits.org/"],

  isDead: true,
};
