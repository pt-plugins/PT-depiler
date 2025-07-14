import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "railgunpt",
  name: "RailgunPT",
  description: "B站PT",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["hyuan280"],

  urls: ["uggcf://ovyvovyv.qbjaybnq/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "种子", value: "/torrents.php" },
        { name: "9KG", value: "/special.php" },
      ],
    },
    {
      name: "分类（种子）",
      key: "cat_normal",
      options: [
        { name: "音乐", value: 408 },
        { name: "misc", value: 409 },
        { name: "体育", value: 407 },
        { name: "MV", value: 406 },
        { name: "综艺", value: 403 },
        { name: "剧集", value: 402 },
        { name: "动漫", value: 405 },
        { name: "纪录片", value: 404 },
        { name: "下架视频备份", value: 420 },
        { name: "漫画", value: 419 },
        { name: "游戏", value: 412 },
        { name: "学习", value: 411 },
        { name: "软件", value: 410 },
        { name: "电影", value: 401 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分类（9KG）",
      key: "cat_special",
      options: [
        { name: "写真", value: 418 },
        { name: "黄油", value: 417 },
        { name: "H漫", value: 416 },
        { name: "欧美", value: 415 },
        { name: "日韩", value: 414 },
        { name: "国产", value: 413 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Track", value: 9 },
        { name: "Encode", value: 7 },
        { name: "CD", value: 8 },
        { name: "DVD", value: 6 },
        { name: "HDTV", value: 5 },
        { name: "WEB-DL", value: 4 },
        { name: "Remux", value: 3 },
        { name: "UHD", value: 2 },
        { name: "Blu-ray", value: 1 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H264", value: 1 },
        { name: "H265", value: 2 },
        { name: "VC-1", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "XVID", value: 5 },
        { name: "Other", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4K", value: 1 },
        { name: "1080p/i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "Other", value: 5 },
        { name: "2K", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频",
      key: "audio",
      options: [
        { name: "TrueHD/Atmos", value: 1 },
        { name: "DTS-HD/DTS-HDMA", value: 2 },
        { name: "AC3", value: 3 },
        { name: "LPCM", value: 4 },
        { name: "Flac", value: 5 },
        { name: "MP3", value: 6 },
        { name: "AAC", value: 7 },
        { name: "APE", value: 8 },
        { name: "Other", value: 9 },
        { name: "WAV", value: 10 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked
  ],

  searchEntry: {
    area_normal: { name: "种子", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "9KG", enabled: false, requestConfig: { url: "/special.php" } },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Lv0",
      privilege: "新用户的默认级别；可以发送邀请；可以查看排行榜；Lv0级别用户可以发布种子。"
    },
    {
      id: 1,
      name: "Lv1",
      privilege: '得到一个邀请名额；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05
    },
    {
      id: 2,
      name: "Lv2",
      privilege: "得到两个邀请名额。",
      interval: "P7W",
      downloaded: "120GB",
      ratio: 1.55
    },
    {
      id: 3,
      name: "Lv3",
      privilege: "得到三个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
      interval: "P18W",
      downloaded: "300GB",
      ratio: 2.05
    },
    {
      id: 4,
      name: "Lv4",
      privilege: "Lv4及以上用户封存账号后不会被删除。可以查看普通日志。得到四个邀请名额",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 2.55
    },
    {
      id: 5,
      name: "Lv5",
      privilege: "得到五个邀请名额；可以查看其它用户的评论、帖子历史。Lv5及以上用户会永远保留账号。",
      interval: "P20W",
      downloaded: "750GB",
      ratio: 3.05
    },
    {
      id: 6,
      name: "Lv6",
      privilege: "可以更新过期的外部信息；得到六个邀请名额；可以查看Lv6论坛。",
      interval: "P30W",
      downloaded: "1024GB",
      ratio: 3.55
    },
    {
      id: 7,
      name: "Lv7",
      privilege: "得到七个邀请名额。",
      interval: "P40W",
      downloaded: "1536GB",
      ratio: 4.05
    },
    {
      id: 8,
      name: "Lv8",
      privilege: "得到十个邀请名额。",
      interval: "P50W",
      downloaded: "3072GB",
      ratio: 4.55
    },
  ],
};
