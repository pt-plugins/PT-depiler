import { type ISiteMetadata } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { rot13 } from "../utils";
import { set } from "es-toolkit/compat";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "asiancinema",
  name: "AsianCinema",
  aka: ["ACM"],
  description: "综合",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://rvtn.zbv/"],
  formerHosts: [rot13("nfvnapvarzn.zr")],

  userInfo: {
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      bonusPerHour: {
        selector: ["div.text-orange > h2 > strong"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  search: {
    ...SchemaMetadata.search,
    keywordPath: "params.search",
    requestConfig: {
      url: "/torrents/filter",
      responseType: "document",
      params: {
        view: "list", // 强制使用 种子列表 的形式返回
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.imdb", config!.params.search.replace("tt", ""));
          delete config!.params.search;
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search?.selectors,
      tags: [
        {
          name: "H&R",
          selector: "*",
          color: "red",
        },
      ],
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      uploaded: "1TB",
      ratio: 1.0,
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      uploaded: "1TB",
      interval: "P1M",
      ratio: 1.0,
      privilege: "",
    },
    {
      id: 2,
      name: "Super User",
      uploaded: "5TB",
      interval: "P2M",
      ratio: 1.0,
      privilege: "",
    },
    {
      id: 3,
      name: "Extreme User",
      uploaded: "20TB",
      interval: "P3M",
      ratio: 1.0,
      privilege: "Trusted member",
    },
    {
      id: 4,
      name: "Insane User",
      uploaded: "50TB",
      interval: "P6M",
      ratio: 1.0,
      privilege: "Trusted member",
    },
    {
      id: 5,
      name: "Veteran",
      uploaded: "100TB",
      interval: "P1Y",
      ratio: 1.0,
      privilege: "Special freeleech",
    },
    {
      id: 6,
      name: "Seeder",
      seedingSize: "5TB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      ratio: 1.0,
      privilege: "Trusted member",
    },
    {
      id: 7,
      name: "Archivist",
      seedingSize: "10TB",
      interval: "P6M",
      averageSeedingTime: "P60D",
      ratio: 1.0,
      privilege: "Immunity from H&Rs & Special freeleech",
    },
  ],
};

export default class AsianCinema extends Unit3D {
  protected override async getUserBonusPerHour(): Promise<number> {
    const { data: document } = await this.request<Document>(
      {
        url: `/bonus`,
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(document, this.metadata.userInfo?.selectors?.bonusPerHour!);
  }
}
