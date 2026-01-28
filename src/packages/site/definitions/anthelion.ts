import Gazelle, { SchemaMetadata, GazelleUtils, commonPagesList, detailPageList } from "../schemas/Gazelle.ts";
import { ISiteMetadata, ITorrent, ISearchInput, ETorrentStatus } from "../types.ts";
import { buildCategoryOptionsFromList } from "../utils.ts";

const tagKeywords = ["Freeleech", "Neutral", "Seeding", "Snatched", "Internal", "Pollen", "Reported", "Trumpable"];
const extractTags = (tags: string) => GazelleUtils.extractTags(tags, tagKeywords);

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

const detailPageSelectors = {
  ...detailPageList.selectors,
  category: { text: "N/A" }, // 没有相关信息
  time: {
    ...detailPageList!.selectors!.time!,
    selector: ["+ tr span.time[title]", "+ tr span.time"],
    switchFilters: {
      "+ tr span.time": [
        (ts?: number) => {
          const offsetMinutes = new Date().getTimezoneOffset();
          const offsetMs = offsetMinutes * 60 * 1000;
          return (ts ?? 0) + offsetMs;
        },
      ],
    },
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
      options: buildCategoryOptionsFromList(["AVI", "MPG", "MKV", "MP4", "VOB IFO", "ISO", "m2ts", "Other"]),
    },
    {
      name: "Codec",
      key: "codec",
      options: buildCategoryOptionsFromList(["MPEG1", "MPEG2", "Xvid", "DivX", "H264", "H265", "VC-1"]),
    },
    {
      name: "Source",
      key: "media",
      options: buildCategoryOptionsFromList([
        "Blu-ray",
        "DVD",
        "WEB",
        "LaserDisc",
        "HD-DVD",
        "HDTV",
        "TV",
        "VHS",
        "Unknown",
      ]),
    },
    {
      name: "Resolution",
      key: "resolution",
      options: buildCategoryOptionsFromList(["SD", "720p", "1080i", "1080p", "2160p"]),
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
      title: {
        ...SchemaMetadata.search!.selectors!.title!,
        elementProcess: GazelleUtils.genTitleElementProcess({ extractTagsFunc: extractTags }),
      },
      subTitle: {
        selector: [".tags", "> td:has(a[href*='torrents.php']) a:not(span a):last"],
        switchFilters: {
          // 对应单种行，直接返回 tags
          ".tags": [],
          // 对应组内种子，提取并返回种子属性
          "> td:has(a[href*='torrents.php']) a:not(span a):last": [extractTags],
        },
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
      tags: [
        {
          name: "Free",
          selector: "strong:contains('Freeleech')",
        },
        {
          name: "Internal",
          selector: "strong:contains('Internal')",
        },
      ],
      progress: {
        selector: ["div.torrent_info:first", "a[data-toggle-target*='torrent']"],
        filters: [(query: string) => (query.includes("Seeding") ? 100 : 0)],
      },
      status: {
        selector: ["div.torrent_info:first", "a[data-toggle-target*='torrent']"],
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

      ext_imdb: { selector: "a[href*='imdb.com/title/tt']", attr: "href", filters: [{ name: "extImdbId" }] },
    },
  },

  list: [
    {
      ...commonPagesList,
      urlPattern: [...commonPagesList.urlPattern!, "/artist\\.php\\?tmdb=\\d+"],
      selectors: {
        time: {
          text: 0,
          selector: "span.time",
          filters: [
            { name: "parseTTL" },
            (ts: number) => {
              const offsetMinutes = new Date().getTimezoneOffset();
              const offsetMs = offsetMinutes * 60 * 1000;
              return ts + offsetMs;
            },
          ],
        },
      },
    },
    {
      ...detailPageList,
      selectors: detailPageSelectors,
    },
    // Top 10 不显示种子
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
        requestConfig: { url: "/ajax.php", params: { action: "community_stats" }, responseType: "json" },
        assertion: { id: "params.userid" },
        fields: ["seeding"],
      },
    ],
    selectors: {
      ...SchemaMetadata!.userInfo!.selectors!,
      bonusPerHour: {
        selector: "h3.float_right",
        filters: [
          (query: string) => {
            const match = query.replace(",", "").match(/making ([\d]+) Orbs/);
            return match && match.length > 1 ? parseFloat(match[1]) : 0;
          },
        ],
      },
      adoptions: { selector: "li:contains('Adopted: ') span" },
      joinTime: {
        selector: "ul.stats li:contains('Joined:') span",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm 'UTC'"] }],
      },
      seedingSize: { selector: "li:contains('Seeding Size: ') span", filters: [{ name: "parseSize" }] },
      bonus: { selector: "a[href*='store.php']", filters: [{ name: "replace", args: [/,/g, ""] }] },
      seeding: { selector: "response.seeding", filters: [{ name: "parseNumber" }] },
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
      privilege: "Can have a up to 3 personal collages; Can edit torrents",
    },
  ],
};

export default class Anthelion extends Gazelle {
  /**
   * Anthelion 特性：直接搜索 IMDB 或 TMDB id 会直接跳转到详情（种子组）页面
   * 需要判断当前页面类型以选择对应的解析方式
   */
  public override transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    if (!!doc.querySelector("div#covers")) {
      searchConfig = {
        ...searchConfig,
        searchEntry: {
          ...searchConfig.searchEntry!,
          selectors: { ...searchConfig.searchEntry!.selectors!, ...detailPageSelectors },
        },
      };
    }

    return super.transformSearchPage(doc, searchConfig);
  }

  protected override getTorrentGroupInfo(group: HTMLTableRowElement, searchConfig: ISearchInput): Partial<ITorrent> {
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "category", "ext_imdb"]);
  }
}
