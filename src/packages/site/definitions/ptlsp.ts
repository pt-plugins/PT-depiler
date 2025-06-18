import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "ptlsp",
  name: "PTLSP",
  description:
    "PTLSP是一个集刮削音乐专辑、影视、剧集、游戏、纪录片、动漫、MV等众多资源为一体的综合PT站，本站旗下有着独家音乐专辑刮削制作小组以及独家压制小组",
  tags: ["综合", "音乐"],
  collaborator: ["CosmoGao", "null"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://www.ptlsp.com/"],
  host: "ptlsp.com",

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/ef7a885c052a9dc23286fb54e33dbef3dd9431ed
  isDead: true,

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 1.2,
      seedingPoints: "80000",
      privilege: "",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "200GB",
      ratio: 1.5,
      seedingPoints: "160000",
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "350GB",
      ratio: 2,
      seedingPoints: "320000",
      privilege: "得到1个邀请名额；",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.5,
      seedingPoints: "600000",
      privilege: "得到1个邀请名额；可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3,
      seedingPoints: "780000",
      privilege: "得到2个邀请名额；Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 4,
      seedingPoints: "1100000",
      privilege: "得到2个邀请名额；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 5,
      seedingPoints: "1400000",
      privilege: "得到2个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 6,
      seedingPoints: "1700000",
      privilege: "得到5个邀请名额。",
    },
  ],
};
