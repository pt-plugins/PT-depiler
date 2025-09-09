import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI";
export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "secretcinema",
  name: "Secret Cinema",
  aka: ["秘密影院", "Secret Cinema PW"],
  description: "专注于高质量电影资源的私人PT站点",
  tags: ["电影", "高清", "蓝光", "4K"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://secretcinema.pw/"],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      // Secret Cinema 特有的搜索选择器
      title: {
        selector: ["a[href*='torrents.php?id=']:first"],
      },
      subTitle: {
        selector: ["a[href*='torrents.php?id=']:first + div"],
      },
      size: {
        selector: ["td:contains('MB')", "td:contains('GB')", "td:contains('TB')"],
        filters: [{ name: "parseSize" }],
      },
      seeders: {
        selector: ["td:nth-child(3)", "td.seeders"],
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: ["td:nth-child(4)", "td.leechers"],
        filters: [{ name: "parseNumber" }],
      },
      completed: {
        selector: ["td:nth-child(5)", "td.completed"],
        filters: [{ name: "parseNumber" }],
      },
      comments: {
        selector: ["td:nth-child(6)", "td.comments"],
        filters: [{ name: "parseNumber" }],
      },
      time: {
        selector: ["td:nth-child(7)", "td.time"],
        filters: [{ name: "parseTime" }],
      },
      tags: [
        { name: "Freeleech", selector: "span[title*='Freeleech']", color: "green" },
        { name: "Neutral", selector: "span[title*='Neutral']", color: "blue" },
        { name: "Personal", selector: "span[title*='Personal']", color: "purple" },
      ],
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Actor",
      privilege: "The default class for all members.",
    },
    {
      id: 1,
      name: "Cinematographer",
      interval: "P2M",
      percentile: 50,
      seedingPercentile: 95,
      privilege:
        "Can access the Secret Pharmacy forum and create 1 personal collage. Can also invite new members upon having enough Seeding Points.",
    },
    {
      id: 2,
      name: "Director",
      interval: "P4M",
      percentile: 70,
      privilege:
        "Can access the Secret Pharmacy forum, create 3 personal collages and is awarded an invite occasionally",
    },
    {
      id: 3,
      name: "Cinephile",
      interval: "P6M",
      percentile: 90,
      privilege:
        "Can access the Secret Pharmacy and Ilium Cinephilium forums, create 10 personal collages and is awarded an invite occasionally.",
    },
    {
      id: 4,
      name: "Legend",
      privilege: "Past staff member. Same perks as Cinephiles, plus a few more.",
    },
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      // Secret Cinema 特有的用户信息字段覆盖
      bonus: {
        selector: ["response.userstats.bonus"],
        filters: [
          (query: string | number) => {
            if (typeof query === "number") {
              return query;
            }
            const match = query.match(/[\d.]+/);
            if (match) {
              const value = parseFloat(match[0]);
              return isNaN(value) ? 0 : value;
            }
            return 0;
          },
        ],
      },
      seedingSize: {
        selector: ["response.userstats.seedingSize"],
        filters: [
          (query: string | number) => {
            if (typeof query === "number") {
              return query;
            }
            const match = query.match(/[\d.]+/);
            if (match) {
              const value = parseFloat(match[0]);
              return isNaN(value) ? 0 : value;
            }
            return 0;
          },
        ],
      },
      leeching: {
        selector: ["response.userstats.leeching"],
        filters: [
          (query: string | number) => {
            if (typeof query === "number") {
              return query;
            }
            const match = query.match(/[\d.]+/);
            if (match) {
              const value = parseFloat(match[0]);
              return isNaN(value) ? 0 : value;
            }
            return 0;
          },
        ],
      },
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
    },
  ],
};
