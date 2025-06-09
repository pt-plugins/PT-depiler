import { ETorrentStatus, type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "tlfbits",
  name: "The Last Fantasy",
  description: "",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cg.rnfgtnzr.bet/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 438, name: "电影 (Movie)" },
        { value: 440, name: "电视剧(TV series)" },
        { value: 441, name: "综艺 (TV Show)" },
        { value: 442, name: "动漫 (Anime)" },
        { value: 443, name: "纪录片 (Documentary)" },
        { value: 444, name: "体育 (Sport)" },
        { value: 445, name: "音乐视频 (Music Video)" },
        { value: 446, name: "音乐(Music)" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      status: {
        text: ETorrentStatus.unknown,
        selector: ["td[bgcolor='#bce672']", "td[bgcolor='#44cef6']", "td[bgcolor='#d0d0d0']"],
        case: {
          "td[bgcolor='#bce672']": ETorrentStatus.seeding,
          "td[bgcolor='#44cef6']": ETorrentStatus.downloading,
          "td[bgcolor='#d0d0d0']": ETorrentStatus.completed,
        },
      },
      progress: {
        selector: ["td[bgcolor]"],
        filters: [
          (query: string) => {
            const progressText = query.split("%")[0];
            return progressText ? parseFloat(progressText) : 0;
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Peasant",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
    },
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别。",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.5,
      privilege: "可以查看NFO文档；可以请求续种； 查看种子结构; 可以删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 2.55,
      privilege: "可以查看用户的种子历史记录，如下载种子的历史记录（只有用户的隐私等级没有设为’强‘时才生效）; 可以查看高级会员区 . Elite User +论坛。",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3.05,
      privilege: '可以查看排行榜；可以在做种/下载/发布的时候选择匿名模式。',
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 4.55,
      privilege: "可以发送邀请；查看一般日志，不能查看机密日志; Insane User及以上等级的账号如果在封存后将永远保留。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 5.05,
      privilege: "得到一个邀请名额；可以查看其它用户的评论、帖子历史(如果用户隐私等级未设置为\"强\"); Veteran User及以上等级的账号将永远保留。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P45W",
      downloaded: "1TB",
      ratio: 6.55,
      privilege: "得到三个邀请名额；可以更新过期的外部信息。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P50W",
      downloaded: "1.5TB",
      ratio: 7.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P55W",
      downloaded: "3TB",
      ratio: 8.55,
      privilege: "得到十个邀请名额。",
    },
  ],
};
