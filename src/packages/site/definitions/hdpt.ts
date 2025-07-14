import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdpt",
  name: "明教",
  description: "综合性的PT论坛    欢迎您的加入！",
  tags: ["影视", "综合"],
  collaborator: ["koal", "zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  favicon: "./_default_nexusphp.png",
  urls: ["https://hdpt.xyz/"],

  isDead: true,

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 2,
      seedingBonus: 50000,
      privilege: "得到一个邀请名额；可以直接发布种子；可以请求续种； 可以发送邀请。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "400GB",
      ratio: 3,
      seedingBonus: 110000,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "700GB",
      ratio: 4,
      seedingBonus: 200000,
      privilege: "得到二个邀请名额。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 5,
      seedingBonus: 300000,
      privilege: "得到二个邀请名额；",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 6,
      seedingBonus: 500000,
      privilege:
        "得到二个邀请名额。神蛇 (Veteran User)及以上等级的账号如果在封存后将保留，封存的账号如果连续400天不登录，将被封禁；未封存的账号如果连续90天不登录，将被封禁；没有流量的用户（即上传/下载数据都为0）如果连续90天不登录，将被封禁账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 7,
      seedingBonus: 700000,
      privilege:
        "得到二个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。紫微 (Extreme User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 8,
      seedingBonus: 1000000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "8TB",
      ratio: 9,
      seedingBonus: 1500000,
      privilege: "得到七个邀请名额。",
    },
  ],
};
