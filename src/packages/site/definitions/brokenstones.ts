import { ISearchInput, ISiteMetadata, ITorrent } from "../types.ts";
import GazelleJSONAPI, { SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";
import { SchemaMetadata as GazelleSchemaMetadata, extractSubTitle } from "../schemas/Gazelle.ts";
import BittorrentSite from "../schemas/AbstractBittorrentSite.ts";

const brksCategories = [
  { name: "MacOS Apps", class: "macosapps", value: 1 },
  { name: "MacOS Games", class: "macosgames", value: 2 },
  { name: "iOS Apps", class: "iosapps", value: 3 },
  { name: "iOS Games", class: "iosgames", value: 4 },
  { name: "Graphics", class: "graphics", value: 5 },
  { name: "Audio", class: "audio", value: 6 },
  { name: "Tutorials", class: "tutorials", value: 7 },
  { name: "Other", class: "other", value: 8 },
] as const;

const catClassMap = brksCategories.reduce<Record<string, string>>((map, item) => {
  map[item.class] = item.name;
  return map;
}, {});

const categoryOptions = brksCategories.map(({ name, value }) => ({ name, value }));

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "brokenstones",
  name: "BrokenStones",
  aka: ["BRKs"],
  description: "Broken Stones is a Private site for MacOS and iOS APPS / GAMES",
  tags: ["软件", "游戏"],
  timezoneOffset: "-0100",

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["uggcf://oebxrafgbarf.vf/"],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: categoryOptions,
      cross: { mode: "appendQuote" },
    },
    {
      name: "Leech Status",
      key: "freetorrent",
      options: [
        { value: 0, name: "Normal" },
        { value: 1, name: "Free" },
        { value: 2, name: "Neutral" },
        { value: 3, name: "Either" },
      ],
    },
  ],

  search: {
    ...GazelleSchemaMetadata.search,
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        group_results: 0,
        order_way: "desc",
        searchsubmit: 1,
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...GazelleSchemaMetadata.search!.selectors!,
      subTitle: {
        selector: "div.torrent_info:first",
        filters: [extractSubTitle],
      },
      category: {
        text: "Other",
        selector: "div[class^='tooltip cats_']",
        attr: "class",
        filters: [
          (cat: string) => {
            const match = cat.match(/cats_(\w+)/);
            if (!match) return "";
            return catClassMap[match[1]];
          },
        ],
      },
      time: {
        selector: "span.time[title]",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
      },
      link: {
        selector: "a[href*='torrents.php?action=download']:first",
        attr: "href",
      },
      size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
      comments: { selector: "td:nth-child(6) > a" },
      seeders: { selector: "td:nth-child(8)" },
      leechers: { selector: "td:nth-child(9)" },
      completed: { selector: "td:nth-child(7)" },
      tags: [
        {
          name: "Free",
          selector: "strong.tl_free:not(.tl_neutral)",
        },
        {
          name: "Neutral",
          selector: "strong.tl_neutral",
          color: "cyan",
        },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
      excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid)=\d+/, /searchstr=(?:tt)?\d+/],
      selectors: {
        time: {
          selector: "span.time",
          filters: [
            { name: "parseTTL" },
            (ts: number) => {
              const offsetMinutes = new Date().getTimezoneOffset();
              const offsetMs = offsetMinutes * 60 * 1000;
              return ts - 1 * 3600000 + offsetMs; // UTC-1
            },
          ],
        },
      },
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "Live searching/suggestions, Can edit collages, make requests",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      uploaded: "50GB",
      uploads: 1,
      ratio: 1.05,
      privilege: "Receives invites, create new collages, immune from inactivity disabling",
    },
    {
      id: 4,
      name: "Extreme User",
      interval: "P4W",
      uploaded: "75GB",
      uploads: 10,
      ratio: 1.05,
      privilege: "Can upload freeware (set to Neutral Leech)",
    },
    {
      id: 5,
      name: "Elite",
      interval: "P4W",
      uploaded: "100GB",
      uploads: 50,
      ratio: 1.05,
      privilege: "Top 10 filters & Can edit any torrent and any torrent group.",
    },
    {
      id: 6,
      name: "VIP",
      groupType: "vip",
      privilege: "Custom title & Unlimited Invites",
    },
  ],
};

export default class BrokenStones extends GazelleJSONAPI {
  // 使用 AbstractBittorrentSite 的解析方法 (HTML)
  public override async transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    return BittorrentSite.prototype.transformSearchPage.call(this, doc, searchConfig);
  }
}
