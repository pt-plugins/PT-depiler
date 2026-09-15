/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/concen.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "concen",
  name: "Concen",
  aka: ["Conspiracy Central"],
  description: "ConCen (Conspiracy Central) is a Private conspiracy related torrent index",

  type: "private",

  urls: ["https://concen.org/"],

  category: [
    {
      name: "Order",
      key: "order",
      options: [
        { name: "Title", value: "title" },
        { name: "Uploaded", value: "created" },
        { name: "Size", value: "size" },
        { name: "Seeds", value: "seeds" },
        { name: "Peers", value: "peers" },
        { name: "Completed", value: "completed" },
      ],
    },
    {
      name: "Sort",
      key: "sort",
      options: [
        { name: "Descending", value: "desc" },
        { name: "Ascending", value: "asc" },
      ],
    },
  ],

  search: {
    keywordPath: "params.title",
    requestConfig: {
      url: "/torrents",
      params: {
        title_op: "allwords",
        title_1_op: "not",
        title_1: "",
        seeds: 1,
      },
    },

    selectors: {
      rows: { selector: "table  > tbody > tr:has(td.views-field-title)" },
      id: {
        selector: "td.views-field-field-torrent a",
        attr: "href",
        filters: [(q: string) => q.match(/(\d+)\.torrent$/)![1]],
      },
      category: { text: "Other" },
      title: { selector: "td.views-field-title a" },
      url: { selector: "td.views-field-title a", attr: "href" },
      link: {
        selector: ["td.views-field-field-torrent a", "td.views-field-name a"],
        attr: "href",
      },
      time: {
        selector: "td.views-field-created",
        filters: [{ name: "parseTTL" }],
      },
      size: { selector: "td.views-field-size", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td.views-field-seeds" },
      leechers: { selector: "td.views-field-peers" },
      completed: { selector: "td.views-field-completed" },
    },
  },
};
