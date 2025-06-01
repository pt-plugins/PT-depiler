import { ETorrentStatus, type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdupt",
  name: "HDU",
  description: "这是一个尊重版权的私有资源PT分享站点HDU。高清有你，你有UPXIN",
  tags: ["影视", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.hdupt.com/", "https://pt.upxin.net/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "Movies/电影" },
        { value: 402, name: "TV Series/电视剧" },
        { value: 403, name: "TV Shows/综艺" },
        { value: 404, name: "Documentaries/纪录片" },
        { value: 405, name: "Animations/动画" },
        { value: 406, name: "Music Videos/音乐 MV" },
        { value: 407, name: "Sports/体育" },
        { value: 408, name: "HQ Audio/无损音乐" },
        { value: 411, name: "Misc/其他" },
        { value: 410, name: "Games/游戏" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 1, name: "Blu-ray" },
        { value: 11, name: "UHD Blu-ray" },
        { value: 5, name: "HDTV" },
        { value: 6, name: "DVD" },
        { value: 3, name: "Remux" },
        { value: 15, name: "UHD Remux" },
        { value: 16, name: "UHD Remux TV" },
        { value: 12, name: "Remux TV" },
        { value: 7, name: "Encode" },
        { value: 14, name: "Encode TV" },
        { value: 10, name: "WEB-DL/WEBRip" },
        { value: 13, name: "WEB-DL/WEBRip TV" },
        { value: 4, name: "MiniBD" },
        { value: 8, name: "CD" },
        { value: 9, name: "Track" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264/AVC" },
        { value: 14, name: "H.265/HEVC" },
        { value: 2, name: "VC-1" },
        { value: 16, name: "x264" },
        { value: 3, name: "Xvid" },
        { value: 18, name: "MPEG/MPEG-2" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 16, name: "DTS:X" },
        { value: 1, name: "DTS-HDMA" },
        { value: 3, name: "TrueHD" },
        { value: 11, name: "LPCM" },
        { value: 4, name: "DTS" },
        { value: 2, name: "AC3/EAC3" },
        { value: 6, name: "AAC" },
        { value: 7, name: "FLAC" },
        { value: 10, name: "APE" },
        { value: 17, name: "WAV" },
        { value: 18, name: "MPEG" },
        { value: 13, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 5, name: "4K/2160p" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
        { value: 6, name: "iPad" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { value: 1, name: "CN/中国内地" },
        { value: 3, name: "HK/TW/港台" },
        { value: 2, name: "US/EU/欧美" },
        { value: 4, name: "JP/日本" },
        { value: 5, name: "KR/韩国" },
        { value: 6, name: "India/印度" },
        { value: 8, name: "SEA/东南亚" },
        { value: 7, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 2, name: "HDU" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    {
      name: "促销种子？",
      key: "spstate",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "免费", value: 2 },
        { name: "2X", value: 3 },
        { name: "2X免费", value: 4 },
        { name: "50%", value: 5 },
        { name: "2X 50%", value: 6 },
        { name: "30%", value: 7 },
        { name: "永久免费", value: 8 },
      ],
      cross: false,
    },
    CategoryInclbookmarked,
  ],
  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      progress: {
        selector: [
          "td[class='embedded'][style*='color: blue;font-weight: bold']",
          "td[class='embedded'] img[src*='zuozhong.gif']",
        ],
        elementProcess: (element: HTMLElement) => {
          if (element.getAttribute("src")) {
            return 100;
          } else {
            const text = element.innerText;
            return text ? parseInt(text.replace(/%/, "")) : 0;
          }
        },
      },
      status: {
        selector: [
          "td[class='embedded'][style*='color: blue;font-weight: bold']",
          "td[class='embedded'] img[src*='zuozhong.gif']",
        ],
        elementProcess: (element: HTMLElement) => {
          if (element.getAttribute("src")) {
            return ETorrentStatus.seeding;
          } else {
            const text = element.innerText;
            return text.includes("100%") ? ETorrentStatus.completed : ETorrentStatus.inactive;
          }
        },
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      bonus: {
        selector: ["td.rowhead:contains('魔力值') + td"],
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ["img.arrowup"],
        elementProcess: (element: HTMLElement) => {
          return parseInt((element.nextSibling?.textContent ?? "0").trim());
        },
      },
      seedingSize: {
        selector: ["td.rowhead:contains('Seeding Size') + td"],
        filters: [{ name: "parseSize" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: `新用户的默认级别。`,
    },
    {
      id: 2,
      name: "初窥门径(Power User)",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 2,
      privilege:
        "可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请；" +
        '可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "略有小成(Elite User)",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 2.5,
      privilege: "略有小成(Elite User)及以上用户封存账号后不会被删除，可以进入论坛邀请区。",
    },
    {
      id: 4,
      name: "驾轻就熟(Crazy User)",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 5,
      name: "渐入佳境(Insane User)",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 3.85,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 6,
      name: "炉火纯青(Veteran User)",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 5.95,
      privilege: "得到一个邀请名额；可以查看其它用户的评论、帖子历史。炉火纯青(Veteran User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "登峰造极(Extreme User)",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 6.55,
      privilege: "得到一个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "举世无双(Ultimate User)",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 7.05,
      privilege: "得到两个邀请名额。",
    },
    {
      id: 9,
      name: "超凡入圣(Nexus Master)",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 8.85,
      privilege: "得到三个邀请名额。",
    },
  ],
};
