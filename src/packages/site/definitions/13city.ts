import { type ISiteMetadata } from "../types";
import { CategoryIncldead, CategorySpstate, CategoryInclbookmarked, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "13city",
  name: "13City Online",
  aka: ['13City'],
  description: "一切美好源于分享",
  tags: ["电影", "综合"],
  timezoneOffset: "+0800", // 可根据实际情况修改
  collaborator: ["13City"],
  type: "private",
  schema: "NexusPHP",
  urls: ["https://13city.online/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影/Movies", value: 401 },
        { name: "连续剧/TV Series", value: 402 },
        { name: "综艺/TV Shows", value: 403 },
        { name: "动漫/Animations", value: 405 },
        { name: "演唱会、MV/Music Videos", value: 406 },
        { name: "音乐/Music", value: 408 },
        { name: "有声小说/E-book", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Track", value: 1 },
        { name: "CD", value: 2 },
        { name: "DVDR", value: 3 },
        { name: "HDTV", value: 4 },
        { name: "MiniBD", value: 5 },
        { name: "Encode", value: 6 },
        { name: "RemuxBlu-ray", value: 7 },
        { name: "HD DVD", value: 8 },
        { name: "Blu-ray", value: 9 },
        { name: "Web-DL", value: 10 },
        { name: "Other", value: 11 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "AVC/H.264/x264", value: 1 },
        { name: "HEVC/H.265/x265", value: 2 },
        { name: "MPEG-2", value: 3 },
        { name: "VC-1", value: 4 },
        { name: "VPB/VP9", value: 5 },
        { name: "Xvid", value: 6 },
        { name: "Other", value: 7 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "FLAC", value: 1 },
        { name: "APE", value: 2 },
        { name: "AC3", value: 3 },
        { name: "DTS-HD/DTS", value: 4 },
        { name: "MP3", value: 5 },
        { name: "OGG", value: 6 },
        { name: "AAC", value: 7 },
        { name: "DDP/E-AC3", value: 8 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "8K_UHD", value: 1 },
        { name: "4K_UHD", value: 2 },
        { name: "1080P-HD", value: 3 },
        { name: "Other", value: 4 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "区域",
      key: "Processing",
      options: [
        { name: "中国（含港澳台）", value: 1 },
        { name: "日本", value: 2 },
        { name: "泰国", value: 3 },
        { name: "印度", value: 4 },
        { name: "韩国", value: 5 },
        { name: "欧美", value: 6 },
        { name: "Other（其他）", value: 7 },
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
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
      privilege:
        "当以下情况时将被自动降至本级：1.如果你已经下载了超过50GB，你应该有大于0.4的分享率。2.如果你已经下载了超过100GB，你应该有大于0.5的分享率。3.如果你已经下载了超过200GB，你应该有大于0.6的分享率。4.如果你已经下载了超过400GB，你应该有大于0.7的分享率。5.如果你已经下载了超过800GB，你应该有大于0.8的分享率。",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "128GB",
      ratio: 1.05,
      privilege:
        "必须注册至少4周，并且下载至少128G，分享率大于1.05。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于0.95，你将自动降级。首次升级至此等级的用户将获得1个邀请名额。",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "256GB",
      ratio: 1.55,
      privilege:
        "必须注册至少8周，并且下载至少256G，分享率大于1.55。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.45，你将自动降级。首次升级至此等级的用户将获得2个邀请名额。",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "512GB",
      ratio: 2.05,
      privilege:
        "必须注册至少15周，并且下载至少512G，分享率大于2.05。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.95，你将自动降级。首次升级至此等级的用户将获得3个邀请名额。",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1024GB",
      ratio: 2.55,
      privilege:
        "必须注册至少25周，并且下载至少1024G，分享率大于2.55。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.45，你将自动降级。首次升级至此等级的用户将获得4个邀请名额。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2048GB",
      ratio: 3.05,
      privilege:
        "必须注册至少40周，并且下载至少2048G，分享率大于3.05。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.95，你将自动降级。首次升级至此等级的用户将获得5个邀请名额。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "4096GB",
      ratio: 3.55,
      privilege:
        "必须注册至少60周，并且下载至少4096G，分享率大于3.55。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.45，你将自动降级。首次升级至此等级的用户将获得5个邀请名额。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "8192GB",
      ratio: 4.05,
      privilege:
        "必须注册至少80周，并且下载至少8192G，分享率大于4.05。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.95，你将自动降级。首次升级至此等级的用户将获得5个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "16384GB",
      ratio: 4.55,
      privilege:
        "必须注册至少100周，并且下载至少16384G，分享率大于4.55。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于4.45，你将自动降级。首次升级至此等级的用户将获得10个邀请名额。",
    },
  ],
};
