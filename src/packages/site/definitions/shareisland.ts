import { EResultParseStatus, type ISiteMetadata, type IUserInfo } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "shareisland",
  name: "ShareIsland",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",
  collaborator: ["haowenwu"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://funervfynaq.bet/"],

  userInfo: {
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      name: {
        selector: ["a[href*='/users/']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/users\/(.+)\//);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
          },
        ],
      },
      levelName: {
        selector: "div.panel__body a.user-tag__link",
        attr: "title",
      },
      seedingSize: {
        selector: 'dt:has(abbr[title*="Seeding Size"]) + dd',
        filters: [{ name: "parseSize" }],
      },
      joinTime: {
        selector: ["time"],
        attr: "datetime",
        filters: [{ name: "parseTime" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      ratio: 0.4,
      privilege: "4下载槽",
    },
    {
      id: 2,
      name: "ShareUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "8下载槽",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "10下载槽",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "自动通过候选 无限下载槽",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      interval: "P6M",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      interval: "P12M",
    },
    {
      id: 7,
      name: "ShareArchivist",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
    },
    {
      id: 8,
      name: "Seeder",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P60D",
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      url: "/torrents",
    },
    keywordPath: "params.name",
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.imdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
    },
  },
};
