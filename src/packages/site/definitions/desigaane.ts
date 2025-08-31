import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "desigaane",
  name: "DesiGaane",
  aka: ["DG"],
  description: "DesiGaane is a private tracker focused on Indian music",
  tags: ["音楽", "印度音乐"],
  timezoneOffset: "+0000",
  collaborator: [], // 若你知道协作者 ID，请填入

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://desigaane.rocks/"],
  formerHosts: [],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "None",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10B", // 例如 "20GB"
      ratio: 0.6, // 例如 0.55
      privilege: "Invites",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploads: 5, // 例如 10
      uploaded: "25GB", // 例如 "100GB"
      ratio: 0.65, // 例如 0.60
      privilege: "",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P4W",
      uploads: 50, // 例如 10
      uploaded: "100GB", // 例如 "100GB"
      ratio: 0.65, // 例如 0.60
      privilege: "",
    },
    {
      id: 5,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 500, // 例如 10
      uploaded: "500GB", // 例如 "100GB"
      ratio: 0.65, // 例如 0.60
      privilege: "",
    },
    {
      id: 6,
      name: "Power TM",
      interval: "P8W",
      uploads: 500, // 例如 10
      uploaded: "500GB", // 例如 "100GB"
      ratio: 0.65, // 例如 0.60
      privilege: "",
    },
    {
      id: 7,
      name: "Elite TM",
      interval: "P8W",
      uploads: 500, // 例如 10
      uploaded: "500GB", // 例如 "100GB"
      ratio: 0.65, // 例如 0.60
      privilege: "",
    },
  ],
};
