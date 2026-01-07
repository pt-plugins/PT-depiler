/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hdtorrents.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/1330
 */
import type { ISiteMetadata, IUserInfo } from "../types.ts";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import { parseSizeString, buildCategoryOptionsFromDict } from "../utils.ts";
import Sizzle from "sizzle";

const categoryMap: Record<number, string> = {
  47: "EPL",
  41: "American Football",
  54: "AutoMotoRacing",
  17: "Athletics",
  51: "Baseball",
  34: "Bodybuilding/Fitness",
  50: "Golf",
  29: "Boxing",
  19: "BrainGames",
  36: "BreakDance",
  23: "Cycling",
  31: "Documentary",
  1: "European Basketball",
  37: "Extreme Sports",
  9: "Fight Sports",
  32: "Formula1",
  45: "GAA (Gaelic)",
  22: "Gymnastics",
  59: "UFL",
  39: "Handball",
  2: "International Basket",
  25: "IceHockey",
  4: "International Soccer",
  42: "KHL",
  55: "MotoGP",
  35: "KickBoxing/Muay Thai",
  43: "La Liga",
  15: "MotorSport",
  24: "MLB/Baseball",
  28: "MMA",
  11: "NBA",
  3: "NCAA Basket/Football",
  5: "NFL",
  27: "NHL",
  26: "Olympic games",
  7: "Rugby",
  44: "Serie A",
  38: "Snooker/Pool",
  30: "Streetball",
  18: "Swimming/Aquatics",
  56: "Ligue1",
  46: "AFL(AustralianFB)",
  12: "Tennis",
  20: "Volleyball",
  21: "Weightlifting",
  16: "WinterSport",
  33: "Wrestling/Grapling",
  48: "Uncategorised",
  60: "Champions League",
  61: "Europa League",
  63: "WNBA",
  64: "NASCAR",
  65: "FIBA 3x3 Basketball",
  67: "Bundesliga",
  68: "MLS",
  69: "EuroLeague Basketbal",
  70: "ELC",
  71: "RhythmicGymnastics",
  72: "BeachVolleyball",
  73: "BeachSoccer",
  74: "Chess",
  75: "Bowling",
  76: "BelgianProLeague",
  77: "Bellator",
  78: "Billard",
  79: "Climbing",
  80: "CrossFit",
  81: "DutchEredivisie",
  82: "IndyCar",
  83: "GLeagueNBA",
  84: "NCAABasketball",
  85: "NCAAFootball",
  86: "Sailing",
  87: "Surfing",
  88: "TableTennis",
  89: "TourDeFrance",
  90: "LaVuelta",
  91: "Girod'Italia",
  92: "UefaConferenceLeague",
  93: "UEFAEuro",
  94: "OlympicGamesParis24",
  95: "WRCRally",
  96: "CPL",
  97: "CFL",
  98: "PrimeiraPortugal",
  53: "Cricket",
  99: "Darts",
  100: "ESport",
  6: "European Soccer",
  52: "Field Hockey",
  58: "UFC",
  57: "NRL",
};

const statsFilter = (query?: string) => {
  if (!query || query.startsWith("--")) return 0;
  return Number(query);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "sportscult",
  name: "SportsCult",
  aka: ["SC"],
  description: "SportsCult is a Private Torrent Tracker for SPORTS",
  tags: ["运动"],
  timezoneOffset: "+0300",

  type: "private",
  schema: "XBTIT",

  urls: ["uggcf://fcbegfphyg.bet/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: buildCategoryOptionsFromDict(categoryMap),
    },
    {
      name: "种子状态",
      key: "active",
      options: [
        { name: "活种", value: 1 },
        { name: "死种", value: 2 },
      ],
    },
    {
      name: "促销状态",
      key: "gold",
      options: [
        { name: "0%", value: 1 },
        { name: "50%", value: 2 },
        { name: "100%", value: 3 },
        { name: "50% & 100%", value: 4 },
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
        active: 0,
        order: "created",
        by: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: {
        selector:
          "table.lista:last-of-type:not(:has(td.block:contains('Our Team Recommend'))) > tbody > tr:has(a[href^='index.php?page=torrents&category='])",
      },
      title: {
        selector: "a[href^='index.php?page=torrent-details&id=']",
      },
      url: { selector: "a[href^='index.php?page=torrent-details&id=']", attr: "href" },
      link: {
        selector: "a[href^='download.php?id=']",
        attr: "href",
      },
      size: { selector: "td:nth-child(4)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(6)" },
      leechers: { selector: "td:nth-child(7)" },
      completed: { selector: "td:nth-child(8)", filters: [statsFilter] },
      time: { selector: "td:nth-child(5)", filters: [{ name: "parseTime", args: ["dd/MM/yyyy"] }] },
      category: {
        selector: "a[href^='index.php?page=torrents&category=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["category"] }, (catId: string) => categoryMap[Number(catId)]],
      },
      tags: [
        {
          name: "Free",
          selector: "img[src='gold/gold.gif']",
        },
        {
          name: "50%",
          selector: "img[src='gold/silver.gif']",
        },
      ],
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
          messageCount: {
            selector: ["a[href*='do=pm']"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: {
          url: "/index.php",
          responseType: "document",
          params: { page: "usercp" },
        },
        assertion: { id: "params.uid" },
        fields: ["seeding"],
        selectors: {
          name: { selector: "td.header:contains('User') + td" },
          uploaded: { selector: "td.header:contains('Uploaded:') + td", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "td.header:contains('Downloaded:') + td", filters: [{ name: "parseSize" }] },
          ratio: { selector: "td.header:contains('Ratio:') + td", filters: [{ name: "parseNumber" }] },
          levelName: { selector: "td.header:contains('Rank:') + td" },
          bonus: { selector: "td.green:contains('Bonus')", filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: "td.header:contains('Joined on') + td",
            filters: [{ name: "parseTime", args: ["dd/MM/yyyy HH:mm:ss"] }],
          },
          // FIXME 暂未实现 uploads
        },
      },
      {
        requestConfig: {
          url: "/index.php",
          responseType: "document",
          params: { page: "modules", module: "seedbonus" },
        },
        selectors: {
          bonusPerHour: { selector: "#mcol div.b-content > h3", filters: [{ name: "parseNumber" }] },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Sportsman",
    },
    {
      id: 2,
      name: "Athlete",
      uploaded: "50GB",
      ratio: 0.9,
      privilege: "Access to: Online Users, Tracker info, Live TV",
    },
    {
      id: 3,
      name: "ProAthlete",
      uploaded: "250GB",
      ratio: 1.8,
      privilege: "Access to: Online Users, Tracker info, Live TV, Requests, Top 10, and Users",
    },
    {
      id: 4,
      name: "VIP",
      groupType: "vip",
      privilege:
        "Fancy star, No ratio requirements (as long as you are vip) + Access to: Online Users, Tracker info, Live TV, Requests, Top 10, and Users",
    },
  ],
};

export default class SportsCult extends PrivateSite {
  protected async parseUserInfoForSeeding(
    flushUserInfo: Partial<IUserInfo>,
    dataDocument: any,
  ): Promise<Partial<IUserInfo>> {
    if (!(dataDocument instanceof Document)) return flushUserInfo;

    const seedingTrs = Sizzle("#mcol div.b-content table.lista:eq(2) tbody tr:gt(1)", dataDocument);
    const seedingNum = seedingTrs.length;
    const seedingSize = seedingTrs.reduce((size, tr) => {
      const sizeTd = Sizzle("td:eq(1)", tr);
      if (sizeTd.length < 1) return size;
      return size + parseSizeString(sizeTd[0].textContent || "");
    }, 0);

    flushUserInfo.seeding = seedingNum;
    flushUserInfo.seedingSize = seedingSize;
    return flushUserInfo;
  }
}
