import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";
import { userInfoWithInvitesInUserDetailsPage } from "./kunlun.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "yinguskg",
  name: "樱花",
  aka: ["YingUSKG", "ying.us.kg"],
  description: "YingUSKG PT站点",
  tags: ["综合", "影视"],
  timezoneOffset: "+0800",
  favicon: "./_default_nexusphp.png", // 使用NP架构默认图标

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.ying.us.kg/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "电视剧", value: 402 },
        { name: "综艺", value: 403 },
        { name: "动漫", value: 404 },
        { name: "纪录片", value: 405 },
        { name: "体育", value: 406 },
        { name: "MV", value: 407 },
        { name: "音轨", value: 408 },
        { name: "软件", value: 409 },
        { name: "游戏", value: 410 },
        { name: "其他", value: 411 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "视频类",
      key: "medium",
      options: [
        { name: "UHD Blu-ray", value: 11 },
        { name: "Blu-ray", value: 1 },
        { name: "Remux", value: 3 },
        { name: "WEB-DL", value: 10 },
        { name: "Encode", value: 6 },
        { name: "HDTV", value: 5 },
        { name: "MiniBD", value: 4 },
        { name: "HD DVD", value: 7 },
        { name: "DVD", value: 8 },
        { name: "Other", value: 12 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4320P/8K/FUHD", value: 7 },
        { name: "2160P/4K/UHD", value: 8 },
        { name: "1080p/1080i/FHD", value: 1 },
        { name: "720p/720i/HD", value: 6 },
        { name: "360p/360i/SD", value: 5 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频类",
      key: "audiocodec",
      options: [
        { name: "DTS-HD MA", value: 1 },
        { name: "TrueHD Atmos", value: 2 },
        { name: "DTS-HD", value: 3 },
        { name: "TrueHD", value: 4 },
        { name: "DTS", value: 5 },
        { name: "AC-3", value: 6 },
        { name: "AAC", value: 7 },
        { name: "FLAC", value: 8 },
        { name: "APE", value: 9 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "HDS", value: 1 },
        { name: "CHD", value: 2 },
        { name: "MySiLU", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "CMCT", value: 5 },
        { name: "FRDS", value: 6 },
        { name: "Other", value: 7 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: false, // 暂不支持IMDB搜索
    },
  },

  userInfo: userInfoWithInvitesInUserDetailsPage,

  levelRequirements: [
    {
      id: 0,
      name: "User",
      groupType: "user",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 1,
      name: "Power User",
      groupType: "user",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为强)；可以删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      groupType: "user",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      groupType: "user",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      groupType: "user",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      groupType: "user",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      groupType: "user",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      groupType: "user",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      groupType: "user",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
    // VIP以上等级通过系统智能识别机制自动处理
  ],
};
