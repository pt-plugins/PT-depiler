import { ISiteMetadata } from "../types";
import EHentai, { ehentaiSearchSelector } from "./ehentai";

export const siteMetadata: ISiteMetadata = {
  name: "ExHentai",
  type: "private",
  description: "ExHentai is a private site for Hentai doujinshi, manga.",
  timezoneOffset: "+0000",
  url: "https://exhentai.org/",
  search: {
    requestConfig: { url: "/torrents.php" },
    keywordsParam: "search",
    selectors: ehentaiSearchSelector,
  },
};

// noinspection JSUnusedGlobalSymbols
export default class ExHentai extends EHentai {}
