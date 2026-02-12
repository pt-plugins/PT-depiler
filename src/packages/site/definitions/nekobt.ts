import type { ISearchConfig, ISiteMetadata, ITorrent, ITorrentTag } from "../types";
import BittorrentSite from "../schemas/AbstractBittorrentSite";

const subLevelTags: Record<number, ITorrentTag> = {
  0: { name: "L0 - Official", color: "purple" },
  1: { name: "L1 - Slight Modifications", color: "purple" },
  2: { name: "L2 - Small-scale Fansubs", color: "purple" },
  3: { name: "L3 - Full-scale Fansubs", color: "purple" },
  4: { name: "L4 - Full-scale Batch", color: "purple" },
};

const subLangs = [
  { name: "English", value: "en" },
  { name: "English (Weeb)", value: "enm" },
  { name: "Japanese", value: "ja" },
  { name: "Chinese (Simplified)", value: "zh-hans" },
  { name: "Chinese (Traditional)", value: "zh-hant" },
  { name: "Cantonese", value: "yue" },
];

export const siteMetadata: ISiteMetadata = {
  id: "nekobt",
  version: 1,
  name: "nekoBT",
  description: "nekoBT is a Public Torrent Tracker for ANIME",
  tags: ["动漫"],
  timezoneOffset: "+0800", // uses local timezone

  type: "public",

  urls: ["https://nekobt.to/"],
  favicon: "./nekobt.webp",

  category: [
    {
      name: "字幕级别",
      key: "levels",
      options: Object.entries(subLevelTags).map(([k, v]) => ({
        name: v.name,
        value: k,
      })),
      cross: { mode: "comma" },
    },
    {
      name: "原创翻译字幕",
      key: "otl",
      options: [
        { name: "是", value: "true" },
        { name: "否", value: "false" },
      ],
    },
    {
      name: "机翻字幕",
      key: "mtl",
      options: [
        { name: "是", value: "true" },
        { name: "否", value: "false" },
      ],
    },
    {
      name: "字幕语言（字幕组）",
      key: "fansub_lang",
      options: subLangs,
      cross: { mode: "comma" },
    },
    {
      name: "字幕语言（官方字幕）",
      key: "sub_lang",
      options: subLangs,
      cross: { mode: "comma" },
    },
  ],

  search: {
    keywordPath: "params.query",
    requestConfig: {
      responseType: "json",
      url: "/api/v1/torrents/search",
      params: {
        limit: 100,
        sort_by: "latest",
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "data.results" },
      id: { selector: "id" },
      time: { selector: "uploaded_at" },
      title: { selector: "title" },
      size: { selector: "filesize" },
      category: {
        text: "Anime",
        // not currently used
        // selector: "category"
      },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/torrents/"] }] },
      link: { selector: "magnet" },
      author: { selector: "uploader.username" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      comments: { selector: "comment_count" },
      tags: [
        {
          name: "OTL",
          selector: "otl",
          color: "green",
        },
        {
          name: "MTL",
          selector: "mtl",
          color: "red",
        },
        {
          name: "Hardsub",
          selector: "hardsub",
          color: "red",
        },
        {
          name: "Imported",
          selector: "imported",
          color: "#0c4a6e",
        },
      ],
    },
  },

  list: [
    {
      urlPattern: [
        /\/$/,
        "/search",
        "/users/\\d+/peers",
        "/users/\\d+/torrents",
        "/users/\\d+\$",
        "/groups/\\d+\$",
        "/media/",
      ],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "table.table tr:has(a[href^='/torrents/'])" },
        id: { selector: "a[href^='/torrents/']", attr: "href", filters: [{ name: "parseNumber" }] },
        time: { selector: "> td:nth-child(6)" },
        title: { selector: "span.wrap-anywhere" },
        size: { selector: "> td:nth-child(5)" },
        category: { text: "Anime" },
        url: { selector: "a[href^='/torrents/']", attr: "href" },
        link: { selector: "a[title~='Public'][href^='magnet:?xt=']", attr: "href" },
        author: { selector: "a[href^='/users/']" },
        seeders: { selector: "> td:nth-child(7)" },
        leechers: { selector: "> td:nth-child(8)" },
        completed: { selector: "> td:nth-child(9)" },
        comments: { selector: "span.wrap-anywhere ~ span.tag:has(svg) > span" },
        tags: [
          ...Object.values(subLevelTags).map((tag) => ({
            ...tag,
            selector: `span.tag:contains('${tag.name}')`,
          })),
          {
            name: "OTL",
            selector: "span.tag:contains('OTL')",
            color: "green",
          },
          {
            name: "MTL",
            selector: "span.tag:contains('MTL')",
            color: "red",
          },
          {
            name: "Hardsub",
            selector: "span.tag:contains('Hardsub')",
            color: "red",
          },
          {
            name: "Imported",
            selector: "span.tag:contains('Imported')",
            color: "#0c4a6e",
          },
        ],
      },
    },
  ],

  detail: {
    urlPattern: ["/torrents/\\d+"],
    selectors: {
      title: { selector: "h2.card-title span:not([class])" },
      link: { selector: "a[href^='magnet:?xt=']:last", attr: "href" },
    },
  },
};

export default class NekoBT extends BittorrentSite {
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | { level: number },
    searchConfig: ISearchConfig,
  ): Partial<ITorrent> {
    const { tags } = super.parseTorrentRowForTags(torrent, row, searchConfig);
    if (row instanceof Element) {
      return { ...torrent, tags };
    }

    const tag = subLevelTags[row.level];
    torrent.tags = tag ? [tag, ...torrent.tags!] : torrent.tags;
    return torrent;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("/download/") && !downloadLink.startsWith("magnet:?xt=")) {
      const mockRequestConfig = torrent.url?.startsWith("http") ? { url: torrent.url } : { baseURL: this.url };
      return this.fixLink(`/api/v1/torrents/${torrent.id}/download`, mockRequestConfig);
    }

    return downloadLink;
  }
}
