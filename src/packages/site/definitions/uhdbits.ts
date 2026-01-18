import Sizzle from "sizzle";
import type { ISiteMetadata, ISearchInput, ITorrent } from "../types";
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import GazelleJSONAPI, { SchemaMetadata } from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "uhdbits",
  name: "UHDBits",
  aka: ["UHD"],
  tags: ["影视"],
  timezoneOffset: "+0000",
  collaborator: ["bimzcy", "enigamz", "haowenwu"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://uhdbits.org/"],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { value: 1, name: "Movie" },
        { value: 2, name: "Music" },
        { value: 3, name: "TV" },
      ],
      cross: { mode: "appendQuote" },
    },
  ],

  search: {
    keywordPath: "params.searchstr",
    requestConfig: {
      url: "/torrents.php",
      params: { group_results: 0, searchsubmit: 1 }, // 取消分组
      responseType: "document",
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig }) => {
          if (requestConfig?.params?.searchstr) {
            requestConfig.params.imdbid = requestConfig.params.searchstr.replace("tt", "");
            delete requestConfig.params.searchstr;
          }

          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "table.torrent_table:last > tbody > tr.torrent" },
      id: {
        selector: "a[href*='torrents.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["torrentid", "id"] }],
      },
      title: {
        selector: "div.group_info:has(> a[href*='torrents.php?id='])",
        elementProcess: (element: HTMLElement) => {
          const cloneElement = element.cloneNode(true) as HTMLElement;
          Sizzle(">span, div.torrent_info", cloneElement).forEach((e) => e.remove());
          return cloneElement.innerText.trim();
        },
      },
      subTitle: { selector: "div.group_info > div.torrent_info:first" },
      url: { selector: "a[href*='torrents.php?id=']", attr: "href" },
      link: {
        selector: "a[href*='torrents.php?action=download'][title='Download']:first",
        attr: "href",
      },
      time: {
        selector: [">td:eq(4) span.time[title]", ">td:eq(4) time[title]"],
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm"] }],
      },
      size: { selector: ">td:eq(5)" },
      completed: { selector: ">td:eq(6)" },
      seeders: { selector: ">td:eq(7)" },
      leechers: { selector: ">td:eq(8)" },
      comments: { selector: ">td:eq(3)" },
      author: { text: "" },
      category: {
        text: "Other",
        selector: "td.cats_col > a > div",
        case: {
          ".cats_movie": "Movie",
          ".cats_tv": "TV",
          ".cats_music": "Music",
        },
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["[href='bonus.php'] + span"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Peasant",
    },
    {
      id: 1,
      name: "User",
      interval: "P1W",
      ratio: 0.7,
      privilege: "Access to Top 10; Can create and edit Wiki pages.",
    },
    {
      id: 2,
      name: "Power",
      interval: "P4W",
      downloaded: "100GB",
      snatches: 20,
      ratio: 1.5,
      privilege:
        "Ability to make New Requests; Enable Users online and Users on IRC on front page; Access to full Staff page.",
    },
    {
      id: 3,
      name: "Extreme",
      interval: "P8W",
      downloaded: "300GB",
      snatches: 60,
      ratio: 2,
      privilege: "Access to the Invite Forum.",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P16W",
      downloaded: "900GB",
      snatches: 180,
      ratio: 2.5,
    },
    {
      id: 5,
      name: "Guru",
      interval: "P32W",
      downloaded: "2700GB",
      snatches: 540,
      ratio: 3,
    },
    {
      id: 6,
      name: "Master",
      interval: "P64W",
      downloaded: "8100GB",
      snatches: 1620,
      ratio: 3.5,
    },
  ],
};

export default class UHDBits extends GazelleJSONAPI {
  // 使用 AbstractBittorrentSite 的解析方法 (HTML)
  public override async transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    return BittorrentSite.prototype.transformSearchPage.call(this, doc, searchConfig);
  }
}
