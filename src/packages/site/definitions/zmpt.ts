/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/zmpt.cc/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "zmpt",
  name: "ZmPT(织梦)",
  description: "为爱启航，造就梦想！",
  tags: ["影视", "综合", "游戏"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["yeluoqiuming"],

  urls: ["https://zmpt.cc/"],

  levelRequirements: [
    {
      id: 1,
      name: "中级训练家(PU)",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 30000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "高级训练家(eu)",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
    },
    {
      id: 3,
      name: "精英训练家(CU)",
      interval: "P16W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 150000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "道馆训练家(IU)",
      interval: "P28W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "可以查看普通日志。道馆训练家(IU)及以上用户封存账号后不会被删除;。",
    },
    {
      id: 5,
      name: "专家训练家(VU)",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingPoints: 400000,
      privilege: "可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "冠军训练家(EU)",
      interval: "P56W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "大师训练家(UU)",
      interval: "P76W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 900000,
    },
    {
      id: 8,
      name: "传说训练家(NM)",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingPoints: 1500000,
      privilege: "传说训练家(NM)及以上用户会永远保留账号。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
