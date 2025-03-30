import { type ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategorySpstate, SchemaMetadata } from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hudbt",
  name: "蝴蝶-HUDBT",
  description: "HUDBT,教育网高速IPv6BT下载站。",
  tags: ["教育网", "影视", "综合"],

  collaborator: ["Rhilip", "枕头啊枕头", "Yincircle", "yum"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hudbt.hust.edu.cn/"],

  category: [
    {
      name: "类别",
      key: "cat",
      // FIXME 由于目前配置问题，不能在配置文件中做到大分类，可能需要用户自定义
      options: [
        // 电影 cat1=1&cat401=1&cat413=1&cat414=1&cat415=1&cat430=1
        { value: 401, name: "大陆电影" },
        { value: 413, name: "港台电影" },
        { value: 414, name: "亚洲电影" },
        { value: 415, name: "欧美电影" },
        { value: 430, name: "iPad" },
        { value: 433, name: "抢先视频" },
        // 剧集 cat2=1&cat402=1&cat417=1&cat416=1&cat418=1
        { value: 402, name: "大陆剧集" },
        { value: 417, name: "港台剧集" },
        { value: 416, name: "亚洲剧集" },
        { value: 418, name: "欧美剧集" },
        // 纪录片 cat9=1&cat404=1
        { value: 404, name: "纪录片" },
        // 体育 cat7=1&cat407=1
        { value: 407, name: "体育" },
        // 综艺 cat5=1&cat403=1&cat419=1&cat420=1&cat421=1
        { value: 403, name: "大陆综艺" },
        { value: 419, name: "港台综艺" },
        { value: 420, name: "亚洲综艺" },
        { value: 421, name: "欧美综艺" },
        // 音乐 cat8=1&cat408=1&cat422=1&cat423=1&cat424=1&cat425=1
        { value: 408, name: "华语音乐" },
        { value: 422, name: "日韩音乐" },
        { value: 423, name: "欧美音乐" },
        { value: 424, name: "古典音乐" },
        { value: 425, name: "原声音乐" },
        // MV cat11=1&cat406=1
        { value: 406, name: "音乐MV" },
        // 资料 cat409=1
        { value: 409, name: "其他" },
        { value: 412, name: "学习" },
        // 电子书 cat12=1&cat432=1
        { value: 432, name: "电子书" },
        // 动漫 cat3=1&cat405=1&cat427=1&cat428=1&cat429=1
        { value: 405, name: "完结动漫" },
        { value: 427, name: "连载动漫" },
        { value: 428, name: "剧场OVA" },
        { value: 429, name: "动漫周边" },
        // 游戏 cat4=1&cat410=1&cat431=1
        { value: 410, name: "游戏" },
        { value: 431, name: "游戏视频" },
        // 软件 cat10=1&cat411=1&cat426=1
        { value: 411, name: "软件" },
        { value: 426, name: "MAC" },
        // 华中科技大学 cat13=1&cat1037=1
        { value: 1037, name: "HUST" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "Lossy", value: 6 },
        { name: "2160p/4K", value: 7 },
        { name: "Lossless", value: 5 },
      ],
      cross: { mode: "append" },
    },
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "显示断种/活种？",
      key: "incldead",
      options: [
        { name: "包括断种", value: 0 },
        { name: "仅活种", value: 1 },
        { name: "仅断种", value: 2 },
        { name: "占坑党", value: 3 },
      ],
      cross: false,
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        selector: "div.torrent-title > h3",
      },

      tags: [
        { name: "Free", selector: "img.free", color: "blue" },
        { name: "2xFree", selector: "img.twoup", color: "green" },
        { name: "2xUp", selector: "img.twoupfree", color: "lime" },
        { name: "2x50%", selector: "img.twouphalfdown", color: "light-green" },
        { name: "30%", selector: "img.thirtypercent", color: "indigo" },
        { name: "50%", selector: "img.halfdown", color: "deep-orange-darken-1" },
      ],
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "易形(Power User)",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； " +
        '可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "化蛹(Elite User)",
      interval: "P9W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "化蛹(Elite User)及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "破茧(Crazy User)",
      interval: "P16W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege:
        "得到一个邀请名额； 可以发送邀请（注意：网站会视情况提高或者降低允许发送邀请的最低等级，此处不一定会及时修改）；" +
        "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "恋风(Insane User)",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "翩跹(Veteran User)",
      interval: "P36W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到一个邀请名额；可以查看其它用户的评论、帖子历史。翩跹(Veteran User)及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "归尘(Extreme User)",
      interval: "P49W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。（未启用）",
    },
    {
      id: 7,
      name: "幻梦(Ultimate User)",
      interval: "P64W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "",
    },
    {
      id: 8,
      name: "逍遥(Nexus Master)",
      interval: "P81W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "",
    },
  ],
};
