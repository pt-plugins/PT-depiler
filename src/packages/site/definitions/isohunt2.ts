import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "Isohunt2",
  type: "public",
  description: "Isohunt2 is a Public torrent search engine for MOVIES / TV / GENERAL",
  url: "https://isohunt.nz/",
  legacyUrls: ["https://isohunt.fun/", "https://isohunt.tv/", "https://isohunt.ch/"],
  category: {
    key: "iht",
    options: [
      { value: 0, name: "All" },
      { value: 1, name: "Anime" },
      { value: 2, name: "Software" },
      { value: 3, name: "Games" },
      { value: 4, name: "Adult" },
      { value: 5, name: "Movies" },
      { value: 6, name: "Music" },
      { value: 7, name: "Other" },
      { value: 8, name: "Series & TV" },
      { value: 9, name: "Books" },
    ],
  },
  search: {
    requestConfig: { url: "/torrent/" },
    keywordsParam: "ihq",
    selectors: {
      rows: { selector: 'table > tbody > tr[data-key="0"]' },
      id: {
        selector: 'td.title-row > a[href^="/torrent_details"]',
        attr: "href",
        filters: [(q: string) => q.match(/torrent_details\/([^/])\//)![1]],
      },
      title: { selector: 'td.title-row > a[href^="/"] > span' },
      url: {
        selector: 'td.title-row > a[href^="/torrent_details"]',
        attr: "href",
      },
      time: { selector: "td.date-row", filters: [{ name: "parseTTL" }] },
      size: { selector: "td.size-row" },
      seeders: { selector: "td.sn" },
      category: { selector: "td.category-row > span", attr: "title" },
    },
  },
  detail: {
    selectors: {
      link: {
        selector: "a.btn-magnet",
        attr: "href",
        filters: [{ name: "querystring", args: ["url"] }],
      },
    },
  },
};
