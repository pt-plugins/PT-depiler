/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/share.ilolicon.com/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ilolicon",
  name: "ilolicon PT",
  description: "如果你也喜欢萝莉的话",
  tags: ["成人", "萝莉"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["AllenPu"],

  urls: ["https://share.ilolicon.com/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 50000,
      privilege: '可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")。可以发布趣味盒内容。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 200000,
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 400000,
      privilege: "Crazy User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 688888,
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingPoints: 1011000,
      privilege: "Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingPoints: 1500000,
      privilege: "允许使用个性条；可以查看NFO文档。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 2000000,
      privilege: "可以请求续种；得到一个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingPoints: 3000000,
      privilege: "可以查看种子结构；得到两个邀请名额。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
