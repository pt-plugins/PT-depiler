import { ISiteMetadata, ITorrent, ISearchInput, ETorrentStatus } from "../types";
import Sizzle from "sizzle";
import Gazelle from "../schemas/Gazelle.ts";
import { SchemaMetadata } from "../schemas/Gazelle.ts";
import { createDocument, parseValidTimeString, buildCategoryOptionsFromList } from "../utils.ts";

const nblTimezoneOffset = -11;

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "nebulance",
  name: "Nebulance",
  aka: ["NBL"],
  description: "Nebulance is a Private site. At Nebulance we will change the way you think about TV.",
  tags: ["电视剧"],
  timezoneOffset: `${nblTimezoneOffset}00`,

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://arohynapr.vb/"],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { name: "Episode", value: 1 },
        { name: "Season", value: 3 },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "Tags",
      key: "taglist",
      options: buildCategoryOptionsFromList([
        ["1080p", "2160p", "4k", "720p", "h264", "h265", "hdr", "dovi", "atmos"],
        ["action", "adventure", "comedy", "crime", "drama", "episode", "family", "fantasy"],
        ["history", "horror", "music", "mystery", "sci.fi", "thriller", "children"],
        ["amzn.sourced", "apple.tv", "atvp.sourced", "bbc.one", "disney+"],
        ["dsnp.sourced", "nf.sourced", "paramount+", "prime.video"],
        ["nogrp.release", "p2p", "remux", "scene", "sdtv", "season", "subtitles", "webdl", "webrip"],
      ]),
      cross: { mode: "comma" },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    keywordPath: "params.searchtext",
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        order_by: "time",
        order_way: "desc",
        tags_type: 1,
      },
    },
    advanceKeywordParams: {
      imdb: false, // 只有 API 支持 IMDb 作为搜索参数
      tvmaze: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          const params = {
            action: "show",
            showid: keywords,
          };
          return { ...requestConfig, params };
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      id: { selector: "a[href*='torrents.php?id=']", data: "browseId" },
      title: { selector: "a[href*='torrents.php?id=']", data: "src" },
      size: { selector: "a[href*='torrents.php?id=']", data: "filesize" },
      url: { selector: "a[href*='torrents.php?id=']", attr: "href" },
      link: { selector: "a[href*='torrents.php?action=download']", attr: "href" },
      subTitle: { selector: "div.tags" },
      category: {
        selector: "div.tags",
        elementProcess: (el: HTMLElement) => {
          // 类型只有 Episode 和 Season
          if (el.querySelector("a[href*='taglist=season']")) {
            return "Season";
          } else if (el.querySelector("a[href*='taglist=episode']")) {
            return "Episode";
          }
          return "Other";
        },
      },
      time: {
        selector: "span.time[title]",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
      },
      seeders: { selector: "> td:nth-child(6)" },
      leechers: { selector: "> td:nth-child(7)" },
      completed: { selector: "> td:nth-child(5)" },
      progress: {
        selector: ".Seeding",
        filters: [(query: any) => (query ? 100 : 0)],
      },
      status: {
        selector: "a[href*='torrents.php?id=']",
        attr: "class",
        filters: [
          (query: string) => {
            if (query.includes("Seeding")) {
              return ETorrentStatus.seeding;
            } else if (query.includes("Snatched")) {
              return ETorrentStatus.inactive;
            }
            return ETorrentStatus.unknown;
          },
        ],
      },
      tags: [
        {
          name: "H&R",
          selector: "*",
          color: "red",
        },
      ],

      // tvmazeId: { selector: "a[href*='showid=']", attr: "href", filters: [{ name: "querystring", args: ["showid"] }] },
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
      excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid|showid)=\d+/],
    },
  ],

  detail: {
    urlPattern: ["/torrents\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: ["a[title='View raw mediainfo']"], filters: [{ name: "split", args: [" ", 0] }] },
      link: { selector: ["a:contains('Download')"], attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/ajax.php", params: { action: "index" }, responseType: "json" },
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/user.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "joinTime",
          "messageCount",
          "levelName",
          "lastAccessAt",
          "hnrUnsatisfied",
          "downloaded",
          "uploaded",
          "ratio",
          "uploads",
          "snatches",
          "bonus",
          "bonusPerHour",
          "seeding",
          "seedingSize",
        ],
      },
      // TODO hnrPreWarning
    ],
    selectors: {
      ...SchemaMetadata!.userInfo!.selectors!,
      id: { selector: "response.id" },
      name: { selector: "response.username" },
      joinTime: {
        selector: "li:contains('Joined') > span.time",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
      },
      messageCount: {
        selector: "div.alertbar a[href*='inbox.php']",
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        ...SchemaMetadata!.userInfo!.selectors!.levelName!,
        selector: "li:contains('Class:')",
      },
      lastAccessAt: {
        selector: "li:contains('Last Seen') > span.time",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
      },
      hnrUnsatisfied: {
        selector: "li:contains('HnRs')",
        filters: [{ name: "split", args: ["[", 0] }, { name: "parseNumber" }],
      },
      downloaded: { selector: "li:contains('Downloaded: ')", filters: [{ name: "parseSize" }] },
      uploaded: { selector: "li:contains('Uploaded: ')", filters: [{ name: "parseSize" }] },
      ratio: { text: "N/A" },
      uploads: { selector: "li:contains('Uploaded') > span:nth-child(2)", filters: [{ name: "parseNumber" }] },
      snatches: {
        selector: "li:contains('Snatched') > span:nth-child(2)",
        filters: [{ name: "parseNumber" }],
      },
      bonus: { selector: "a[href='bonus.php']:first", filters: [{ name: "parseNumber" }] },
      bonusPerHour: { selector: "li:contains('Cubits per hour')", filters: [{ name: "parseNumber" }] },
      seeding: { selector: "li:contains('Seeding') > span", filters: [{ name: "parseNumber" }] },
      seedingSize: { selector: "li:contains('Seeding Size')", filters: [{ name: "parseSize" }] },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Colonial",
    },
    {
      id: 2,
      name: "Ensign",
      interval: "P4W",
      uploaded: "100GB",
      snatches: 100,
      bonus: 100000,
      privilege: "Access to recruitment forum",
    },
    {
      id: 3,
      name: "Flattop",
      interval: "P8W",
      uploaded: "250GB",
      snatches: 250,
      bonus: 250000,
      privilege: "Can add tags",
    },
    {
      id: 4,
      name: "Nugget",
      interval: "P16W",
      uploaded: "500GB",
      snatches: 500,
      bonus: 500000,
      privilege: "Can view uploaders; Can edit own torrents after edit timelock",
    },
    {
      id: 5,
      name: "Raptor",
      interval: "P32W",
      uploaded: "1TB",
      snatches: 1000,
      bonus: 850000,
    },
    {
      id: 6,
      name: "Viper",
      interval: "P64W",
      uploaded: "2.5TB",
      uploads: 50,
      snatches: 2500,
      bonus: 2500000,
      privilege: "Can download multiple torrents at once aka (DownThemAll)",
    },
    {
      id: 7,
      name: "Orion",
      interval: "P100W",
      uploaded: "8.5TB",
      uploads: 150,
      snatches: 8500,
      bonus: 3000000,
      privilege: "Can view ratio; Can view downloaded",
    },
    {
      id: 8,
      name: "Valkyrie",
      interval: "P150W",
      uploaded: "100TB",
      uploads: 300,
      snatches: 35000,
      bonus: 250000000,
      privilege: "Can view the site stats page; Can use advanced bbcode tags",
    },
  ],
};

const groupPageSelectors = {
  rows: { selector: "table.torrent_table tr.torrent" },
  size: { selector: "> td:nth-child(2)", filters: [{ name: "parseSize" }] },
  url: { selector: "a[href*='torrents.php?id=']", attr: "href" },
  link: { selector: "a[href*='torrents.php?action=download']", attr: "href" },
  seeders: { selector: "> td:nth-child(4)" },
  leechers: { selector: "> td:nth-child(5)" },
  completed: { selector: "> td:nth-child(3)" },
};

const categorySelector = {
  selector: "div.showname",
  filters: [
    (query: string) => {
      if (!query) {
        return "";
      }
      return query.match(/E\d{2}/) ? "Episode" : "Season";
    },
  ],
};

export default class Nebulance extends Gazelle {
  /**
   * Nebulance 特性：搜索 TVMaze id 会直接跳转到详情（种子组）页面
   * 需要判断当前页面类型以选择对应的解析方式
   */
  public override async transformSearchPage(doc: Document | any, searchConfig: ISearchInput): Promise<ITorrent[]> {
    // 根据搜索参数判断是否跳转了详情页
    if (!searchConfig.requestConfig?.params?.showid) {
      return super.transformSearchPage(doc, searchConfig);
    }

    const torrents: ITorrent[] = [];

    const trs = Sizzle(groupPageSelectors.rows.selector, doc);
    const patchedSearchConfig = {
      ...searchConfig,
      searchEntry: {
        ...searchConfig.searchEntry!,
        selectors: groupPageSelectors,
      },
    };

    let currentCategory = "";

    for (const tr of trs) {
      try {
        const overlayScriptEl = Sizzle("div.tagssh > script", tr)[0];
        const overlayDocRawStr = overlayScriptEl.textContent.match(/"(.*)"/s)![1];
        const overlayDoc = createDocument(JSON.parse(`"${overlayDocRawStr}"`));
        const title = Sizzle("table.overlay tr:nth-child(3) > td", overlayDoc)[0].textContent;

        const rightTd = Sizzle("td.rightOverlay", overlayDoc)[0];
        const dateStr = rightTd.textContent.match(/Uploaded:\s*([0-9-]+\s+[0-9:]+)/)![1];
        const parsedTime = parseValidTimeString(dateStr) as number;
        const time = parsedTime + nblTimezoneOffset * 3600000;

        const cat = this.getFieldData(tr, categorySelector);
        if (cat) currentCategory = cat;

        const torrent = (await this.parseWholeTorrentFromRow(
          { title, time, tags: [{ name: "H&R", color: "red" }], category: currentCategory },
          tr,
          patchedSearchConfig,
        )) as ITorrent;
        torrents.push(torrent);
      } catch (e) {
        console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, tr);
      }
    }

    return torrents;
  }
}
