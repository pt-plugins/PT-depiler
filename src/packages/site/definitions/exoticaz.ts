import { ISiteMetadata, ISearchInput, IAdvancedSearchRequestConfig, ITorrent, ITorrentTag } from "../types";
import AvistazNetwork, {
  SchemaMetadata,
  IAvzNetRawTorrent,
  listHistoryPageMetadata,
} from "../schemas/AvistazNetwork.ts";

const categoryMap: Record<number, string> = {
  1: "Video Clips",
  2: "Video Pack",
  3: "Siterip Pack",
  4: "Pornstar Pack",
  5: "DVD",
  6: "BluRay",
  7: "Photo Pack",
  8: "Books & Magazines",
};

const resolutionMap: Record<number, string> = {
  1: "240p",
  2: "360p",
  3: "480p",
  4: "720p",
  5: "1080p",
  6: "2160p",
  7: "4320p",
  8: "VR 180°",
  9: "VR 360°",
};

const discountMap: Record<number, string> = {
  1: "Free-Download",
  2: "Half-Download",
  3: "Double Upload",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "exoticaz",
  name: "ExoticaZ",
  aka: ["Exo", "YourExotic"],
  description: "ExoticaZ (YourExotic) is a Private Torrent Tracker of AvistaZ Network for porn",
  tags: ["成人"],
  timezoneOffset: "+0100",

  type: "private",
  schema: "AvistazNetwork",

  urls: ["uggcf://rkbgvpnm.gb/"],
  formerHosts: ["https://torrents.yourexotic.com/"],

  collaborator: [""],

  category: [
    {
      name: "搜索入口",
      key: "entry",
      notes: "请选中成人以开启搜索",
      options: [{ name: "成人", value: "adult" }],
      cross: false,
      generateRequestConfig: (selectedCategories) => {
        return { params: {} } as IAdvancedSearchRequestConfig;
      },
    },
    {
      name: "分类",
      key: "category",
      keyPath: "params",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "分辨率",
      key: "res",
      keyPath: "params",
      options: Object.entries(resolutionMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "促销",
      key: "discount",
      keyPath: "params",
      options: Object.entries(discountMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "类型",
      key: "type",
      keyPath: "params",
      options: [
        { name: "Popular", value: "popular" },
        { name: "Asian", value: "asian" },
        { name: "Non-asian", value: "non_asian" },
        { name: "Softcore", value: "softcore" },
        { name: "Uncensored", value: "uncensored" },
        { name: "Censored", value: "censored" },
        { name: "Transexual", value: "transexual" },
      ],
      cross: { mode: "append", key: "" },
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: { enabled: false },
      tvdb: { enabled: false },
      tmdb: { enabled: false },
    },
  },

  searchEntry: {
    area_adult: { name: "成人", enabled: false },
  },

  list: [
    // 种子列表页
    {
      urlPattern: ["/torrents"],
      mergeSearchSelectors: false,
      selectors: {
        rows: {
          selector: "#content-area > div.card.mt-2 > div.card-body.p-2 > div.table-responsive > table > tbody > tr",
        },

        id: {
          selector: "div.mb-1 a[href*='/torrent/']",
          attr: "href",
          filters: [
            (href: string) => {
              const torrentIdMatch = href.match(/\/torrent\/(\d+)/);
              if (torrentIdMatch && torrentIdMatch[1]) {
                return torrentIdMatch[1];
              }
              return undefined;
            },
          ],
        },
        title: { selector: "div.mb-1 a[href*='/torrent/']" },
        category: { selector: ".category-icon[data-original-title]", attr: "data-original-title" },
        url: { selector: "div.mb-1 a[href*='/torrent/']", attr: "href" },
        link: { selector: "div.align-top a[href*='/download/torrent/']", attr: "href" },
        // time显示为1 minute/1 hour，放弃获取
        size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },

        seeders: { selector: "td:nth-child(6)" },
        leechers: { selector: "td:nth-child(7)" },
        completed: { selector: "td:nth-child(8)" },
      },
    },
    listHistoryPageMetadata,
  ],

  detail: {
    urlPattern: ["/torrent/"],
    selectors: {
      ...SchemaMetadata.detail!.selectors!,
      title: {
        selector: "table.table tr:contains('Title') td:nth-child(2)",
        elementProcess: (element) => {
          const text = element.textContent.trim();
          // 匹配 [xxxx-xxxx] 格式
          const match = text.match(/\[([^\]]+)\]/);
          // 如果匹配到就返回括号内的内容,否则返回原文本
          return match ? match[1] : text;
        },
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Leech",
      privilege: "Can download 1 torrent a day. Limited to download torrents uploaded 1 week ago. Cannot upload.",
    },
    {
      id: 2,
      name: "Newbie",
      privilege: "Can download 5 torrents a day. Cannot upload. Cannot use RSS.",
    },
    {
      id: 3,
      name: "Member",
      alternative: [{ ratio: 1 }, { interval: "P1W" }],
      privilege: "Can download 100 torrents a day. Can upload. Can use RSS (must enable it in My Account settings).",
    },
    {
      id: 100,
      name: "V.I.P.",
      groupType: "vip",
      privilege: "Can download 200 torrents a day. Can upload.",
    },
    // Staff Classes
    {
      id: 200,
      name: "Uploader",
      groupType: "manager",
      privilege: "Can upload.",
    },
    {
      id: 201,
      name: "Editor",
      groupType: "manager",
      privilege: "Can upload.",
    },
    { id: 203, name: "Moderator", groupType: "manager" },
    { id: 204, name: "Admin", groupType: "manager" },
    { id: 205, name: "Super Admin", groupType: "manager" },
  ],

  userInputSettingMeta: [...SchemaMetadata.userInputSettingMeta!],
};

export interface IExoRawTorrent extends IAvzNetRawTorrent {
  asian: boolean;
  softcore: boolean;
  censored: boolean;
  gay: boolean;
  transexual: boolean;
  studios: string[];
  performers: {
    [key: string]: string;
  };
  tags: {
    [key: string]: string;
  };
}

export default class Exoticaz extends AvistazNetwork {
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IExoRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const extendTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);

    // 处理副标题相关逻辑
    const performersObject = row.performers;
    const performersNames = performersObject ? Object.values(performersObject) : [];
    const performersStr = performersNames.join(" / ");
    const tagsObject = row.tags;
    const tagsNames = tagsObject ? Object.values(tagsObject) : [];
    const tagsStr = tagsNames.map((name) => `#${name}`).join(" ");
    const subTitle = [performersStr, tagsStr].filter(Boolean).join(" | ");
    extendTorrent.subTitle = subTitle;

    const tags: ITorrentTag[] = [];
    const statusTags: Record<string, { name: string }> = {
      asian: { name: "亚洲" },
      softcore: { name: "擦边" },
      censored: { name: "有码" },
      gay: { name: "gay" },
      transexual: { name: "trans" },
    };
    for (const key of Object.keys(statusTags)) {
      if (key in row && (row as Record<string, any>)[key] === true) {
        tags.push(statusTags[key as keyof typeof statusTags]);
      }
    }
    extendTorrent.tags = tags;

    return extendTorrent;
  }
}
