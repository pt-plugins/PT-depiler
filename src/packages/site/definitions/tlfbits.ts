/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/pt.eastgame.org/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "tlfbits",
  name: "TLFBits",
  description: "水管虽小，坚持则大！宛如TLF，虽弱却奢华",
  tags: ["影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["waldens"],

  urls: ["https://pt.eastgame.org/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.5,
      privilege: "可以查看NFO文档；可以请求续种；  查看种子结构; 可以删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 2.55,
      privilege:
        "可以查看用户的种子历史记录，如下载种子的历史记录（只有用户的隐私等级没有设为’强‘时才生效）; 可以查看高级会员区 . Elite User +论坛。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3.05,
      privilege: "可以查看排行榜；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 4.55,
      privilege: "可以发送邀请；查看一般日志，不能查看机密日志; Insane User及以上等级的账号如果在封存后将永远保留。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 5.05,
      privilege:
        '得到一个邀请名额；可以查看其它用户的评论、帖子历史(如果用户隐私等级未设置为"强"); Veteran User及以上等级的账号将永远保留。',
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P45W",
      downloaded: "1TB",
      ratio: 6.55,
      privilege: "得到三个邀请名额；可以更新过期的外部信息。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P50W",
      downloaded: "1.5TB",
      ratio: 7.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P55W",
      downloaded: "3TB",
      ratio: 8.55,
      privilege: "得到十个邀请名额。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
