import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "@ptd/site/schemas/Unit3D.ts";
import { rot13 } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "asiancinema",
  name: "AsianCinema",
  description: "综合",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://rvtn.zbv/"],
  formerHosts: [rot13("nfvnapvarzn.zr")],

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
