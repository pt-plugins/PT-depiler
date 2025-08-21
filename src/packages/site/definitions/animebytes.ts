import type { ISiteMetadata } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "animebytes",
  name: "AnimeBytes",
  aka: ["AB"],
  description: "动漫",
  tags: ["动漫"],
  timezoneOffset: "+0000",
  collaborator: ["MewX", "sabersalv"],

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://navzrolgrf.gi/"],

  levelRequirements: [
    {
      id: 0,
      name: "Aka-chan",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "User",
      interval: "P1D",
      uploaded: "10.5GB",
      ratio: 0.5,
      privilege: "发送邀请",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P2D",
      uploads: 10,
      uploaded: "25GB",
      ratio: 0.7,
      privilege: "访问邀请区，每月固定邀请名额，免于非活动修剪",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P30D",
      uploads: 50,
      uploaded: "100GB",
      ratio: 0.8,
      privilege: "",
    },
    {
      id: 4,
      name: "Torrent Master",
      interval: "P90D",
      uploads: 100,
      uploaded: "500GB",
      ratio: 0.9,
      privilege: "超出用户限制也可以发送邀请",
    },
    {
      id: 5,
      name: "Legend",
      interval: "P180D",
      uploads: 500,
      uploaded: "1TB",
      ratio: 1.0,
      privilege: "",
    },
  ],

  userInfo: {
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["id", "name"],
      },
      {
        requestConfig: {
          url: "/user.php",
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: [
          "messageCount",
          "uploads",
          "uploaded",
          "downloaded",
          "ratio",
          "seeding",
          "seedingSize",
          "levelName",
          "bonus",
          "bonusPerHour",
          "joinTime",
          "hnrUnsatisfied",
          "hnrPreWarning",
        ],
      },
    ],
    pickLast: ["id", "name", "joinTime"],
    selectors: {
      id: {
        selector: "#stats_menu > a:first",
        attr: "href",
        filters: [{ name: "querystring", args: ["userid"] }],
      },
      name: { selector: "a.username:first" },

      messageCount: {
        selector: ".alertbar.notice span.new_count",
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: "dt:contains('Torrents Uploaded:') + dd",
        filters: [{ name: "parseNumber" }],
      },
      uploaded: {
        selector: "dt:contains('Uploaded:') + dd > span",
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      downloaded: {
        selector: "dt:contains('Downloaded:') + dd > span",
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      ratio: {
        selector: "dt:contains('Ratio:') + dd > span",
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: "dt:contains('Seeding:') + dd",
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: "dt:contains('Total seed size:') + dd > span",
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: "dt:contains('Class:') + dd",
      },
      bonus: {
        selector: "#yen_count > a",
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: "dt:contains('Yen per day:') + dd",
        filters: [
          (query: string) => query.replace(/,/g, "").match(/[\d.]+/),
          (query: string[]) => (query ? parseFloat(query[0]) / 24 : 0),
        ],
      },
      joinTime: {
        selector: "dt:contains('Joined:') + dd > span",
        filters: [{ name: "parseFuzzyTime" }],
      },
      hnrUnsatisfied: {
        selector: "ul.stats li:contains('H&Rs:')",
        attr: "title",
        filters: [
          (query: string) => {
            const numbers = query.match(/\d+/g);
            return numbers && numbers.length >= 1 ? parseInt(numbers[0]) : 0;
          },
        ],
      },
      hnrPreWarning: {
        selector: "ul.stats li:contains('H&Rs:')",
        attr: "title",
        filters: [
          (query: string) => {
            const numbers = query.match(/\d+/g);
            return numbers && numbers.length >= 2 ? parseInt(numbers[1]) : 0;
          },
        ],
      },
    },
  },
};

export default class AnimeBytes extends PrivateSite {}
