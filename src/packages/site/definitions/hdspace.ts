/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hdspace.yml
 */
import type { ISiteMetadata } from "../types.ts";
import { set } from "es-toolkit/compat";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  15: "Movie / Blu-ray",
  40: "Movie / Remux",
  18: "Movie / 720p",
  19: "Movie / 1080p",
  46: "Movie / 2160p",
  21: "TV Show / 720p HDTV",
  22: "TV Show / 1080p HDTV",
  45: "TV Show / 2160p HDTV",
  24: "Documentary / 720p",
  25: "Documentary / 1080p",
  47: "Documentary / 2160p",
  27: "Animation / 720p",
  28: "Animation / 1080p",
  48: "Animation / 2160p",
  30: "Music / HQ Audio",
  31: "Music / Videos",
  33: "XXX / 720p",
  34: "XXX / 1080p",
  49: "XXX / 2160p",
  36: "Trailers",
  37: "Software",
  38: "Others",
  41: "Movie / 4K UHD",
};

const statsFilter = (query?: string) => {
  if (!query || query.startsWith("--")) return 0;
  return Number(query);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdspace",
  name: "HD-Space",
  aka: ["HD-S"],
  description: "HD-Space (HDS) is a Private Torrent Tracker for HD MOVIES / TV",
  tags: ["影视"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "XBTIT",

  urls: ["uggcf://uq-fcnpr.bet/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params = { category: "" };
        params.category = (selectedOptions as string[] | number[]).join(";");
        return { requestConfig: { params } };
      },
    },
    {
      name: "种子状态",
      key: "active",
      options: [
        { name: "活种", value: 1 },
        { name: "死种", value: 2 },
      ],
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: {
        page: "torrents",
        options: 0,
        active: 0,
        order: "created",
        by: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, searchEntry, requestConfig }) => {
          set(requestConfig!, searchEntry!.keywordPath!, keywords?.replace("tt", ""));
          requestConfig!.params!.options = 2;
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "table.lista[width='100%'] > tbody > style ~ tr" },
      category: {
        selector: "td a[href^='index.php?page=torrents&category=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["category"] }, (catId: number) => categoryMap[catId]],
      },
      title: { selector: "td a[href^='index.php?page=torrent-details']" },
      url: { selector: "td a[href^='index.php?page=torrent-details']", attr: "href" },
      link: { selector: "a[href^='download.php?id=']", attr: "href" },
      time: {
        selector: ["td:nth-child(5):contains('day')", "td:nth-child(5):not(:contains('day'))"],
        switchFilters: {
          "td:nth-child(5):contains('day')": [
            // Today at 09:17:08
            // Yesterday at 17:11:03
            (query: string) => {
              const currentDate = new Date();
              const dateParts = query.trim().split("at");
              if (dateParts.length < 2) return null;
              if (dateParts[0].trim() === "Yesterday") {
                currentDate.setDate(currentDate.getDate() - 1);
              }
              currentDate.setHours(...(dateParts[1].trim().split(":").map(Number) as [number, number, number]));
              return currentDate.getTime();
            },
          ],
          "td:nth-child(5):not(:contains('day'))": [
            { name: "trim" },
            { name: "parseTime", args: ["MMMM dd, yyyy,\u00A0HH:mm:ss"] },
          ],
        },
      },
      size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(8)" },
      leechers: { selector: "td:nth-child(9)" },
      completed: { selector: "td:nth-child(9)", filters: [statsFilter] },
      comments: { selector: "td:nth-child(3)", filters: [statsFilter] },
      subTitle: {
        selector: "td:nth-child(2) > span",
        elementProcess: (el: HTMLElement) => {
          const cloneEl = el.cloneNode(true) as HTMLElement;
          cloneEl.querySelectorAll("a").forEach((child) => {
            child.remove();
          });
          return cloneEl.innerText.trim();
        },
      },
      tags: [
        {
          name: "Free",
          selector: "img[src*='gold.png']",
        },
        {
          name: "50%",
          selector: "img[src*='silver.png']",
        },
        {
          name: "Internal",
          selector: "img[src*='internal.png']",
          color: "red",
        },
      ],

      ext_imdb: {
        selector: "td a[href*='imdb.com/title/tt']",
        attr: "href",
        filters: [{ name: "extImdbId" }],
      },
    },
  },

  list: [
    {
      urlPattern: ["/index\\.php\\?page\\=torrents"],
    },
  ],

  detail: {
    urlPattern: ["/index\\.php\\?page\\=torrent-details"],
    selectors: {
      title: { selector: "a[href^='download.php?id=']", filters: [{ name: "trim" }] },
      link: { selector: "a[href^='download.php?id=']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        selectors: {
          id: {
            selector: "a[href*='index.php?page=usercp']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          name: { selector: "td[align='center'][style='text-align:center;']:contains('Welcome back')>span" },
          messageCount: {
            selector: ["a[href*='do=pm']"],
            filters: [{ name: "parseNumber" }],
          },
          uploaded: {
            selector: "td.green:contains('UP')",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "td.red:contains('DL')",
            filters: [{ name: "parseSize" }],
          },
          ratio: { selector: "td.yellow:contains('Ratio')", filters: [{ name: "parseNumber" }] },
          levelName: {
            selector: "td[align='center'][style='text-align:center;']:contains('Rank')",
            filters: [{ name: "replace", args: ["Rank: ", ""] }],
          },
          bonus: {
            selector: "td.green:contains('Bonus')",
            filters: [{ name: "replace", args: ["Bonus: ", ""] }, { name: "parseNumber" }],
          },
          seeding: { selector: "img[src='images/actseed.png'] ~ font[color='green']" },
        },
      },
      {
        requestConfig: {
          url: "/index.php",
          responseType: "document",
          params: { page: "usercp" },
        },
        assertion: { id: "params.uid" },
        selectors: {
          joinTime: {
            selector: "td.header:contains('Joined on') + td",
            filters: [{ name: "trim" }, { name: "parseTime", args: ["MMMM dd, yyyy,\u00A0HH:mm:ss"] }],
          },
          // FIXME 暂未实现 uploads, seedingSize
        },
      },
      {
        requestConfig: {
          url: "/index.php",
          responseType: "document",
          params: { page: "modules", module: "seedbonus" },
        },
        selectors: {
          bonusPerHour: { selector: "td[valign='top'] > h3", filters: [{ name: "parseNumber" }] },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Members",
      privilege: "Have access to Torrents, Seed Bonus, Upload, Helpdesk, Lottery pages.",
    },
    {
      id: 2,
      name: "HD Spacer",
      uploaded: "100GB",
      ratio: 1.05,
      privilege: "Have access to BlackJack, Expected, Catalog, Games pages.",
    },
    {
      id: 3,
      name: "HD Astronaut",
      uploaded: "500GB",
      ratio: 2.25,
      privilege: "Have access to HD Spacer extras and Top 10, Members, Requests, Episode pages.",
    },
    {
      id: 4,
      name: "HD Alien",
      uploaded: "2TB",
      ratio: 4.25,
      privilege: "Same access like HD Astronaut.",
    },
    {
      id: 5,
      name: "HD Internal",
      privilege: "Same access like HD Alien. Plus Golden Status for the uploaded torrents.",
    },
    {
      id: 6,
      name: "VIP",
      groupType: "vip",
      nameAka: ["V.I.P."],
      privilege: "Same access like HD Astronaut, immune to automatic demotion, automated HnR warnings and ratio watch.",
    },
    {
      id: 7,
      name: "Uploader",
      groupType: "manager",
      uploads: 20,
      privilege: "Access to HD Spacer and HD Astronaut extras. May upload and download any torrents.",
    },
    {
      id: 8,
      name: "Elite Uploader",
      groupType: "manager",
      uploaded: "20TB",
      ratio: 7,
      uploads: 100,
      privilege: "Same access like Uploader.",
    },
  ],
};
