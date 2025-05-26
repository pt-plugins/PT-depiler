import type { ISiteMetadata } from "@ptd/site";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "piggo",
  name: "Piggo",
  description: "猪猪网",
  tags: ["影视", "综合","少儿"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly9waWdnby5tZS8="],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 912, name: "有声-大众" },
        { value: 408, name: "音乐-大众" },
        { value: 409, name: "其他-大众" },
        { value: 407, name: "体育-大众" },
        { value: 406, name: "MV-大众" },
        { value: 403, name: "综艺-大众" },
        { value: 402, name: "电视剧-大众" },
        { value: 405, name: "动漫-大众" },
        { value: 404, name: "纪录片-大众" },
        { value: 401, name: "电影-大众" },
        { value: 907, name: "纪录片-儿童" },
        { value: 910, name: "读书绘本-儿童" },
        { value: 911, name: "音乐-儿童" },
        { value: 905, name: "有声读物-儿童" },
        { value: 909, name: "儿童电影-儿童" },
        { value: 908, name: "儿童剧集-儿童" }
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 11, name: "Untouched" },
        { value: 3, name: "Remux" },
        { value: 7, name: "Encode" },
        { value: 5, name: "DIY" },
        { value: 8, name: "Other" }
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264/X.264" },
        { value: 6, name: "H.265/X.265" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 3, name: "DTS" },
        { value: 4, name: "MP3" },
        { value: 6, name: "AAC" },
        { value: 7, name: "Other" },
        { value: 8, name: "AC-3" },
        { value: 9, name: "DTS-HD MA" },
        { value: 10, name: "TrueHD" },
        { value: 11, name: "LPCM" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 3, name: "720p" },
        { value: 1, name: "1080p/i" },
        { value: 5, name: "4K" },
        { value: 6, name: "other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 8, name: "PigoWeb" },
        { value: 7, name: "PigoHD" },
        { value: 9, name: "PigoNF" },
        { value: 10, name: "PigoAD" },
        { value: 5, name: "Other" },
      ],
    },
    {
      name: "画质",
      key: "processing",
      options: [
        { value: 4, name: "DV（杜比视界)" },
        { value: 3, name: "HDR10+" },
        { value: 2, name: "HDR10" },
        { value: 1, name: "SDR" }
      ],
      cross: { mode: "brackets" },
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "乳猪",
      privilege: "新用户的默认级别。无法直接发布种子，需添加候选后等待审核。"
    },
    {
      id: 2,
      name: "烤乳猪",
      downgrade: "下载≥20GB且分享率≤0.4，下载≥100GB且分享率≤0.5，下载≥200GB且分享率≤0.6，下载≥400GB且分享率≤0.7，下载≥800GB且分享率≤0.8时自动降级本级。",
      privilege: "限制功能，如发表、申请链接、上传字幕等。"
    },
    {
      id: 3,
      name: "猪仔",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 2,
      seedingBonus: 40000,
      privilege: "可直接发布种子，可查看NFO文档、用户列表，请求续种，查看排行榜，查看他人种子历史（未设强隐私时），可删除自己上传的字幕。"
    },
    {
      id: 4,
      name: "香猪",
      interval: "P8W",
      downloaded: "300GB",
      ratio: 2.5,
      seedingBonus: 80000,
      privilege: "香猪及以上封存账号后不会被删除。"
    },
    {
      id: 5,
      name: "野猪",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 3,
      seedingBonus: 150000,
      privilege: "得到一个永久邀请名额；可做种/下载/发布时选择匿名模式。"
    },
    {
      id: 6,
      name: "猪王",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 3.5,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。"
    },
    {
      id: 7,
      name: "猪妖",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 4,
      seedingBonus: 400000,
      privilege: "得到两个永久邀请名额；可以查看其他用户评论、帖子历史。"
    },
    {
      id: 8,
      name: "二师兄",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 4.5,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息，可以查看二师兄论坛。"
    },
    {
      id: 9,
      name: "净坛使者",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 5,
      seedingBonus: 800000,
      privilege: "得到三个邀请名额。"
    },
    {
      id: 10,
      name: "天蓬元帅",
      interval: "P100W",
      downloaded: "6TB",
      ratio: 6,
      seedingBonus: 1000000,
      privilege: "得到五个邀请名额，天蓬元帅及以上账号永久保留。"
    }
  ],
};
