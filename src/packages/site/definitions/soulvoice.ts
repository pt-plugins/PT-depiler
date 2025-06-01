import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "soulvoice",
  name: "SoulVoice",
  description: "聆音",
  tags: ["影视", "综合", "电子书", "有声书"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly9wdC5zb3Vsdm9pY2UuY2x1Yi8="],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 409, name: "其它" },
        { value: 408, name: "音乐" },
        { value: 406, name: "音乐视频" },
        { value: 403, name: "综艺" },
        { value: 405, name: "动漫" },
        { value: 404, name: "纪录片" },
        { value: 402, name: "电视剧" },
        { value: 401, name: "电影" },
        { value: 407, name: "教学" },
        { value: 500, name: "电子书-阅听" },
        { value: 499, name: "有声书-阅听" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 12, name: "Other" },
        { value: 11, name: "DSD" },
        { value: 10, name: "APE/FLAC" },
        { value: 4, name: "MiniBD" },
        { value: 7, name: "Encode" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 5, name: "Other" },
        { value: 2, name: "H.265" },
        { value: 1, name: "H.264" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码-阅听",
      key: "audiocodec",
      options: [
        { value: 19, name: "Other" },
        { value: 18, name: "PDF" },
        { value: 3, name: "MOBI" },
        { value: 2, name: "EPUB" },
        { value: 1, name: "AZW/AZW3" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 4, name: "Other" },
        { value: 3, name: "2160P" },
        { value: 2, name: "1080I" },
        { value: 1, name: "1080P" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 1, name: "HDS" },
        { value: 2, name: "CHD" },
        { value: 3, name: "FRDS" },
        { value: 4, name: "CMCT" },
        { value: 5, name: "Other" },
      ],
    },
    {
      name: "语言-阅听",
      key: "source",
      options: [
        { value: 3, name: "其他" },
        { value: 2, name: "英文" },
        { value: 1, name: "中文" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "类别",
      key: "processing",
      options: [
        { value: 9, name: "其它" },
        { value: 13, name: "耽美" },
        { value: 12, name: "漫画" },
        { value: 11, name: "轻小说" },
        { value: 8, name: "英文原版" },
        { value: 10, name: "网络小说" },
        { value: 7, name: "生活时尚" },
        { value: 6, name: "学习教育" },
        { value: 5, name: "经济管理" },
        { value: 4, name: "励志成功" },
        { value: 3, name: "人文社科" },
        { value: 2, name: "小说文学" },
        { value: 1, name: "历史传记" },
      ],
      cross: { mode: "brackets" },
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
      privilege:
        "被降级的用户，有30天时间提升分享率，否则会被封禁。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
    },
    {
      id: 2,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其他用户的种子历史（如果用户隐私等级未设置为“强”）；可以删除自己上传的字幕。",
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 5,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 6,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 7,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "可以查看其他用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 8,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
  ],
};
