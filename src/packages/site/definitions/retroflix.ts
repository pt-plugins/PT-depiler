import { set } from "es-toolkit/compat";

import { type ISiteMetadata } from "../types.ts";
import { SchemaMetadata, CategorySpstate, CategoryInclbookmarked } from "../schemas/NexusPHP.ts";
import { parseValidTimeString } from "../utils.ts";
import Sizzle from "sizzle";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "retroflix",
  name: "RetroFlix",
  aka: ["RF"],
  description: "RetroFlix is a Private site for Classic Movies / TV / General Releases",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://ergebsyvk.pyho/"],

  legacyUrls: ["https://retroflix.net/"],

  category: [
    {
      name: "Categories",
      key: "categories",
      options: [
        { value: 401, name: "Movies" },
        { value: 402, name: "TV Series" },
        { value: 406, name: "Music Videos" },
        { value: 407, name: "Sports" },
        { value: 409, name: "Books" },
        { value: 408, name: "HQ Audio" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Genres",
      key: "genres",
      options: [
        { value: 1, name: "Action" },
        { value: 2, name: "Adventure" },
        { value: 3, name: "Animation" },
        { value: 4, name: "Comedy" },
        { value: 5, name: "Crime" },
        { value: 6, name: "Documentary" },
        { value: 7, name: "Drama" },
        { value: 8, name: "Family" },
        { value: 9, name: "Fantasy" },
        { value: 10, name: "History" },
        { value: 11, name: "Horror" },
        { value: 12, name: "Music" },
        { value: 13, name: "Mystery" },
        { value: 14, name: "Romance" },
        { value: 15, name: "Sci-Fi" },
        { value: 16, name: "Thriller" },
        { value: 17, name: "War" },
        { value: 18, name: "Western" },
        { value: 19, name: "Film-Noir" },
        { value: 20, name: "Biography" },
        { value: 21, name: "Short" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "显示断种/活种？",
      key: "includingDead",
      options: [
        { name: "全部", value: 1 },
        { name: "仅活种", value: 0 },
        { name: "仅断种", value: 2 },
      ],
    },
    {
      ...CategorySpstate,
      key: "promotionType",
      options: [...CategorySpstate.options, { name: "Free & 3X", value: 8 }],
    },
    {
      ...CategoryInclbookmarked,
      key: "bookmarked",
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      url: "/browse",
      params: {
        includingDead: 1,
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.searchIn", 4);
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: { selector: "div.row > div.col-12 > div.row:gt(0)" },
      url: {
        ...SchemaMetadata.search!.selectors!.url!,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/browse/t/"] },
        ],
      },
      title: { selector: "a[href^='/browse/t/']" },
      subTitle: {
        selector: "div[data-content]:has(a[href^='/browse/t/'])",
        elementProcess: (el: HTMLElement) => {
          const props: string[] = [];

          // 收集 props
          Sizzle("a[href^='/browse/t/'] ~ a", el).forEach((e) => props.push(e.textContent.trim()));

          // 收集 genres
          const genres: string[] = [];
          Sizzle("div[class]:contains('Genre:') > a[href^='/browse']", el).forEach((e) =>
            genres.push(e.textContent.trim()),
          );

          // 合并 genres + props
          const parts = [...genres, ...props].filter(Boolean);

          // 如果都没有，返回空字符串
          if (parts.length === 0) return "";

          // 如果有 genres 才加 "Genres: "
          const prefix = genres.length > 0 ? "Genres: " : "";

          return prefix + parts.join(" / ");
        },
      },
      comments: { selector: "div.row > div:nth-child(1)" },
      time: {
        text: 0,
        selector: "div.row > div:nth-child(2)",
        elementProcess: (el: HTMLElement) => {
          let time: number | string = 0;
          try {
            time = el.getAttribute("title") || el.dataset.originalTitle || 0;
            if (time) {
              time = parseValidTimeString(time as string);
            }
          } catch (e) {}
          return time;
        },
      },
      size: { selector: "div.row > div:nth-child(3)", filters: [{ name: "parseSize" }] },
      completed: { selector: "div.row > div:nth-child(4)" },
      seeders: { selector: "div.row > div:nth-child(5)" },
      leechers: { selector: "div.row > div:nth-child(6)" },
      author: { selector: "div.row > div:nth-child(7)" },
    },
  },

  list: [{ urlPattern: ["/browse"], excludeUrlPattern: ["/browse/t/"] }],

  detail: {
    urlPattern: ["/browse/t/"],
    selectors: {
      ...SchemaMetadata.detail!.selectors!,
      title: {
        selector: "table h3",
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      seedingBonus: undefined,
      joinTime: {
        ...SchemaMetadata.userInfo!.selectors!.joinTime!,
        filters: [
          { name: "split", args: ["(", 0] },
          { name: "parseTime", args: ["dd-MM-yyyy HH:mm:ss"] },
        ],
      },
      lastAccessAt: {
        selector: "td.rowhead:contains('Last'):contains('seen') + td",
        filters: [
          { name: "split", args: ["(", 0] },
          { name: "parseTime", args: ["dd-MM-yyyy HH:mm:ss"] },
        ],
      },
      averageSeedingTime: { selector: "td.rowhead:contains('Seed avg.') + td", filters: [{ name: "parseDuration" }] },
      hnrUnsatisfied: {
        selector: "td.rowhead:contains('Need to Seed') + td",
        filters: [{ name: "split", args: ["(", 0] }, { name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Film Dummy",
    },
    {
      id: 2,
      name: "Film Stunt",
    },
    {
      id: 3,
      name: "Movie Lover",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege: "Can view Topten, ask for reseed, section.",
    },
    {
      id: 4,
      name: "Cinema Addicted",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Cinema Addicted or above would never be deleted if parked.",
    },
    {
      id: 5,
      name: "Film Critic",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege:
        "Can view torrent structure and can set an userbar. Film Critic or above would never be deleted when parked.",
    },
    {
      id: 6,
      name: "VIP",
      groupType: "vip",
    },
    {
      id: 7,
      name: "Uploader",
      groupType: "manager",
      privilege: "Can upload torrents, view anonymous uploaders and view banned torrents.",
    },
  ],
};
