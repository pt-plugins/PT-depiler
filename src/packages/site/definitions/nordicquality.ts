import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "nordicquality",
  name: "NordicQuality",
  tags: ["北欧"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://abeqvpd.bet/"],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      ratio: 0.4,
      privilege: "4下载槽 上传种子 发送邀请",
    },
    {
      id: 2,
      name: "Power User",
      uploaded: "250GiB",
      ratio: 1.0,
      interval: "P1M",
      privilege: "10下载槽 上传种子 发送邀请",
    },
    {
      id: 3,
      name: "Super User",
      uploaded: "750GiB",
      ratio: 1.2,
      interval: "P2M",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "Extreme User",
      uploaded: "4TiB",
      ratio: 1.4,
      interval: "P3M",
      privilege: "35下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "Insane User",
      uploaded: "15TiB",
      ratio: 1.5,
      interval: "P6M",
      privilege: "50下载槽 上传种子 发送邀请",
    },
    {
      id: 6,
      name: "Super Seeder",
      groupType: "user",
      ratio: 1.0,
      averageSeedingTime: "P1W",
      seedingSize: "5TiB",
      privilege: "50下载槽 上传种子 发送邀请 免疫HR",
    },
    {
      id: 7,
      name: "Torrent King",
      groupType: "user",
      ratio: 1.0,
      averageSeedingTime: "P4W",
      seedingSize: "10TiB",
      privilege: "50下载槽 上传种子 发送邀请 不计算下载量 免疫HR",
    },
  ],
};
