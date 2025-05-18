/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/et8.org/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "torrentccf",
  name: "TorrentCCF",
  description: "兼有学习资源和软件资源的影视PT站点",
  tags: ["影视", "学习", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["Rhilip", "cnsunyour"],

  urls: ["https://et8.org/"],

  levelRequirements: [
    {
      id: 1,
      name: "士官(Power User)",
      interval: "P2W",
      downloaded: "64GB",
      ratio: 1.05,
      privilege: "可以上传种子; 可以删除自己上传的字幕; 可以在做种/下载/上传的时候选择匿名模式.",
    },
    {
      id: 2,
      name: "尉官(Elite User)",
      interval: "P6W",
      downloaded: "128GB",
      ratio: 1.55,
      privilege: "购买邀请; 可以查看邀请论坛; 可以查看NFO文档; 可以更新外部信息; 可以请求续种; 可以使用个性条.",
    },
    {
      id: 3,
      name: "少校(Crazy User)",
      interval: "P14W",
      downloaded: "256GB",
      ratio: 2.05,
      privilege: '可以查看排行榜;可以查看其它用户的种子历史(如果用户隐私等级未设置为"强").',
    },
    {
      id: 4,
      name: "中校(Insane User)",
      interval: "P26W",
      downloaded: "512GB",
      ratio: 2.55,
      privilege: "中校及以上用户Park后不会被删除帐号.",
    },
    {
      id: 5,
      name: "上校(Veteran User)",
      interval: "P38W",
      downloaded: "1TB",
      ratio: 3.05,
      privilege: "可以发送邀请; 上校及以上用户会永远保留账号.",
    },
    {
      id: 6,
      name: "少将(Extreme User)",
      interval: "P54W",
      downloaded: "2TB",
      ratio: 3.55,
      privilege: "可以查看种子文件结构.",
    },
    {
      id: 7,
      name: "中将(Ultimate User)",
      interval: "P70W",
      downloaded: "4TB",
      ratio: 4.05,
      privilege: "可以查看其它用户的评论、帖子历史;得到五个邀请名额.",
    },
    {
      id: 8,
      name: "上将(Nexus Master)",
      interval: "P88W",
      downloaded: "8TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
  ],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "Movies.电影",
          value: 622,
        },

        {
          name: "TV.电视剧",
          value: 623,
        },

        {
          name: "Documentaries.纪录片",
          value: 624,
        },

        {
          name: "Appz.软件",
          value: 625,
        },

        {
          name: "Music&MusicVideos.音乐及MV",
          value: 626,
        },

        {
          name: "Others.其他(非学习类)",
          value: 627,
        },

        {
          name: "Elearning - 杂项学习",
          value: 628,
        },

        {
          name: "Elearning - 电子书/小说",
          value: 629,
        },

        {
          name: "Elearning - 电子书/非小说",
          value: 630,
        },

        {
          name: "Elearning - 杂志",
          value: 631,
        },

        {
          name: "Elearning - 漫画",
          value: 632,
        },

        {
          name: "Elearning - 有声书",
          value: 633,
        },

        {
          name: "Elearning - 公开课",
          value: 634,
        },

        {
          name: "Elearning - 视频教程",
          value: 635,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
