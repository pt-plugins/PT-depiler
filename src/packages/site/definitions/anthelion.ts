import Sizzle from "sizzle";
import Gazelle, { SchemaMetadata } from "../schemas/Gazelle.ts";
import type { ISiteMetadata, ITorrent, ISearchInput } from "../types";
import { definedFilters, buildCategoryOptions } from "../utils.ts";

const extractSubTitle = (tags: string) => {
  const tagParts = tags.split(" / ");
  if (tagParts.length < 1) return "";

  const filteredParts: string[] = [];
  // 只保留种子自身属性
  tagParts.forEach((tag) => {
    if (!tagKeywords.some((keyword) => tag.includes(keyword))) filteredParts.push(tag);
  });
  return filteredParts.join(" / ");
};

const tagKeywords = ["Freeleech", "Neutral", "Seeding", "Snatched", "Pollen", "Reported"];

const antCategories = [
  { name: "Feature Film", class: "featurefilm", value: 1 },
  { name: "Short Film", class: "shortfilm", value: 2 },
  { name: "Miniseries", class: "miniseries", value: 3 },
  { name: "Other", class: "other", value: 4 },
];

const catClassMap = antCategories.reduce<Record<string, string>>((map, item) => {
  map[item.class] = item.name;
  return map;
}, {});

const categoryOptions = antCategories.map(({ name, value }) => ({ name, value }));

const linkSelector = {
  selector: "a[href*='torrents.php?action=download']:first",
  attr: "href",
};

const commonDocumentSelectors = {
  id: {
    ...linkSelector,
    filters: [{ name: "querystring", args: ["id"] }],
  },
  link: linkSelector,
  url: {
    ...linkSelector,
    filters: [
      (dlLink: string) => {
        const tid = definedFilters.querystring(dlLink, ["id"]);
        return `/torrents.php?torrentid=${tid}`;
      },
    ],
  },
  size: { selector: "> td.number_column.nobr" },
};

const detailPageSelectors = {
  ...commonDocumentSelectors,
  rows: { selector: "table.torrent_table > tbody > tr.torrent_row" },
  title: { selector: "div.header > h2", filters: [{ name: "split", args: ["by", 0] }] },
  subTitle: { selector: "a[data-toggle-target*='torrent']", filters: [extractSubTitle] },
  completed: { selector: "td.number_column:nth-child(3)" },
  seeders: { selector: "td.number_column:nth-child(4)" },
  leechers: { selector: "td.number_column:nth-child(5)" },
  time: {
    selector: "+ tr.torrentdetails span.time",
    attr: "title",
    filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm 'UTC'"] }],
  },
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "anthelion",
  name: "Anthelion",
  aka: ["ANT"],
  description: "Anthelion (ANT) is a Private site for MOVIES",
  tags: ["电影"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "Gazelle",
  urls: ["uggcf://naguryvba.zr/"],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: categoryOptions,
      cross: { mode: "appendQuote" },
    },
    {
      name: "Container",
      key: "container",
      options: buildCategoryOptions(["AVI", "MPG", "MKV", "MP4", "VOB IFO", "ISO", "m2ts", "Other"]),
    },
    {
      name: "Codec",
      key: "codec",
      options: buildCategoryOptions(["MPEG1", "MPEG2", "Xvid", "DivX", "H264", "H265", "VC-1"]),
    },
    {
      name: "Source",
      key: "media",
      options: buildCategoryOptions(["Blu-ray", "DVD", "WEB", "LaserDisc", "HD-DVD", "HDTV", "TV", "VHS", "Unknown"]),
    },
    {
      name: "Resolution",
      key: "resolution",
      options: buildCategoryOptions(["SD", "720p", "1080i", "1080p", "2160p"]),
    },
    {
      name: "Leech Status",
      key: "freetorrent",
      options: [
        { value: "0", name: "Normal" },
        { value: "1", name: "Free" },
        { value: "2", name: "Neutral" },
        { value: "3", name: "Either" },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search,
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
      imdb: { enabled: true },
      tmdb: { enabled: true },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      ...commonDocumentSelectors,
      title: {
        selector: "div.group_info:has(> a[href*='torrents.php?id='])",
        elementProcess: (element: HTMLElement) => {
          const cloneElement = element.cloneNode(true) as HTMLElement;
          Sizzle("> :not(a[href*='torrents.php?id='])", cloneElement).forEach((e) => e.remove());
          return cloneElement.innerText.trim();
        },
      },
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
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm 'UTC'"] }],
      },
      seeders: { selector: "> td:nth-child(6)" },
      leechers: { selector: "> td:nth-child(8)" },
      completed: { selector: "> td:nth-child(7)" },
      tags: [
        {
          name: "Free",
          selector: "strong:contains('Freeleech')",
        },
      ],

      ext_imdb: { selector: "a[href*='imdb.com/title/tt']", attr: "href", filters: [{ name: "extImdbId" }] },
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
      excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid)=\d+/, /searchstr=(?:tt)?\d+/],
      mergeSearchSelectors: false,
      selectors: {
        ...SchemaMetadata.search!.selectors!,
        time: {
          selector: "span.time",
          filters: [{ name: "parseTTL" }],
        },
        link: linkSelector,
      },
    },
  ],

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/store.php", responseType: "document" },
        fields: ["id", "name", "messageCount", "bonusPerHour"],
      },
      {
        requestConfig: { url: "/user.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "uploads",
          "downloaded",
          "adoptions",
          "ratio",
          "joinTime",
          "seedingSize",
          "bonus",
          "levelName",
        ],
      },
      {
        requestConfig: {
          url: "/torrents.php",
          responseType: "document",
          params: {
            type: "seeding",
          },
        },
        assertion: { id: "params.userid" },
        fields: ["seeding"],
      },
    ],
    selectors: {
      ...SchemaMetadata!.userInfo!.selectors!,
      id: { selector: "#nav_user a.username", attr: "href", filters: [{ name: "querystring", args: ["id"] }] },
      name: { selector: "#nav_user a.username" },
      messageCount: {
        selector: "span.noty-notification",
        filters: [
          (query: string) => {
            const match = query.match(/have (\d+|a) new/);
            return match && match.length > 1 ? (match[1] == "a" ? 1 : parseInt(match[1])) : 0;
          },
        ],
      },
      bonusPerHour: {
        selector: "h3.float_right",
        filters: [
          (query: string) => {
            const match = query.replace(",", "").match(/making ([\d]+) Orbs/);
            return match && match.length > 1 ? parseFloat(match[1]) : 0;
          },
        ],
      },
      uploaded: { selector: "li.tooltip:contains('Uploaded: ')", filters: [{ name: "parseSize" }] },
      downloaded: { selector: "li.tooltip:contains('Downloaded: ')", filters: [{ name: "parseSize" }] },
      adoptions: { selector: "li:contains('Adopted: ') span" },
      ratio: { selector: "li:contains('Ratio: ') span.tooltip", attr: "title", filters: [{ name: "parseNumber" }] },
      joinTime: {
        selector: "ul.stats li:contains('Joined:') span",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm 'UTC'"] }],
      },
      seedingSize: { selector: "li:contains('Seeding Size: ') span", filters: [{ name: "parseSize" }] },
      bonus: { selector: "a[href*='store.php']", filters: [{ name: "replace", args: [",", ""] }] },
      seeding: { selector: "#search_results", filters: [{ name: "parseNumber" }] },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "Can download, upload, vote on requests, use advanced search, access top 10, and bookmark content.",
    },
    {
      id: 2,
      name: "Member",
      interval: "P2W",
      uploaded: "0.5TiB",
      ratio: 0.8,
      bonus: 5000,
      privilege: "Create & manage collections; Send invites",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P1M",
      uploaded: "1TiB",
      ratio: 1.0,
      alternative: [{ uploads: 5 }, { adoptions: 10 }],
      bonus: 25000,
      privilege: "Upload images; Access Top 10; Purchase Invites; Invite forums",
    },
    {
      id: 4,
      name: "Fanatic",
      interval: "P3M",
      uploaded: "1TiB",
      ratio: 1.0,
      uploads: 5,
      alternative: [{ uploads: 25 }, { adoptions: 50 }],
      bonus: 25000,
      privilege: "Can have 1 personal collage; Receives periodic invites (max 1)",
    },
    {
      id: 5,
      name: "Elite",
      interval: "P6M",
      uploaded: "5TiB",
      ratio: 2.5,
      uploads: 10,
      alternative: [{ uploads: 100 }, { adoptions: 200 }],
      bonus: 250000,
      privilege:
        "Can have a up to 2 personal collages; Can edit film descriptions/trailers; Receives periodic invites (max 2)",
    },
    {
      id: 6,
      name: "Guru",
      interval: "P1Y",
      uploaded: "5TiB",
      ratio: 3.0,
      uploads: 25,
      alternative: [{ uploads: 250 }, { adoptions: 500 }],
      bonus: 500000,
      privilege: "Immune from being put on ratio watch; Receives periodic invites (max 4)",
    },
    {
      id: 7,
      name: "Torrent Master",
      interval: "P2Y",
      uploaded: "10TiB",
      ratio: 3.5,
      uploads: 50,
      alternative: [{ uploads: 500 }, { adoptions: 1000 }],
      bonus: 1000000,
      privilege: "Can have a up to 3 personal collages; Can edit torrents; Receives periodic invites (max 2)",
    },
  ],
};

export default class Anthelion extends Gazelle {
  /**
   * Anthelion 特性：直接搜索 IMDB 或 TMDB id 会直接跳转到详情（种子组）页面
   * 需要判断当前页面类型以选择对应的解析方式
   */
  public override async transformSearchPage(doc: Document | any, searchConfig: ISearchInput): Promise<ITorrent[]> {
    // 根据特定元素是否存在判断是否跳转了详情页
    if (!(Sizzle(`${detailPageSelectors.title.selector} > span`, doc).length > 0)) {
      return super.transformSearchPage(doc, searchConfig);
    }

    const torrents: ITorrent[] = [];

    // 需要提前从整个页面获取标题和 IMDB id
    const title = this.getFieldData(doc, detailPageSelectors.title);
    const imdbId = this.getFieldData(doc, searchConfig.searchEntry!.selectors!.ext_imdb!);

    const trs = Sizzle(detailPageSelectors.rows.selector, doc);
    searchConfig.searchEntry!.selectors = detailPageSelectors;
    for (const tr of trs) {
      try {
        const torrent = (await this.parseWholeTorrentFromRow(
          { title, ext_imdb: imdbId },
          tr,
          searchConfig,
        )) as ITorrent;
        torrents.push(torrent);
      } catch (e) {
        console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, tr);
      }
    }

    return torrents;
  }
}
