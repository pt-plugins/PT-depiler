/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/chdbits.yml
 */
import { ETorrentStatus, type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "chdbits",
  name: "CHDBits",
  aka: ["彩虹岛", "CHD"],
  description: "彩虹岛",
  tags: ["影视", "综合"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cgpuqovgf.pb/"],
  formerHosts: ["chdbits.co"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 401, name: "Movies电影" },
        { value: 402, name: "TV Series电视剧" },
        { value: 404, name: "Documentaries纪录片" },
        { value: 405, name: "Animations动漫" },
        { value: 403, name: "TV Shows综艺" },
        { value: 406, name: "Music Videos" },
        { value: 407, name: "Sports体育" },
        { value: 408, name: "HQ Audio音乐" },
        { value: 410, name: "Games游戏" },
        { value: 411, name: "Study学习" },
        { value: 409, name: "Others其他" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { value: 1, name: "官方" },
        { value: 7, name: "转载" },
        { value: 8, name: "复活区" },
        { value: 9, name: "原创" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 1, name: "Blu-ray" },
        { value: 19, name: "UHD Blu-ray" },
        { value: 3, name: "Remux" },
        { value: 4, name: "Encode" },
        { value: 6, name: "HDTV" },
        { value: 18, name: "WEB-DL" },
        { value: 8, name: "CD" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264/AVC" },
        { value: 5, name: "H.265" },
        { value: 6, name: "MPEG-4" },
        { value: 4, name: "MPEG-2" },
        { value: 2, name: "VC-1" },
        { value: 3, name: "AV1" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 3, name: "DTS" },
        { value: 7, name: "AC3" },
        { value: 10, name: "DTS-HD" },
        { value: 11, name: "True-HD" },
        { value: 13, name: "LPCM" },
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 12, name: "WAV" },
        { value: 6, name: "AAC" },
        { value: 14, name: "ALAC" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 5, name: "Others" },
        { value: 7, name: "8K" },
        { value: 6, name: "4K" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { value: 1, name: "3D" },
        { value: 3, name: "美剧" },
        { value: 4, name: "日剧" },
        { value: 5, name: "港剧" },
        { value: 6, name: "韩剧" },
        { value: 7, name: "英剧" },
        { value: 8, name: "国剧" },
        { value: 9, name: "台剧" },
        { value: 10, name: "新剧" },
        { value: 11, name: "马剧" },
        { value: 13, name: "合集" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 4, name: "CHDBits" },
        { value: 3, name: "SGNB" },
        { value: 1, name: "REMUX" },
        { value: 2, name: "CHDTV" },
        { value: 5, name: "CHDPAD" },
        { value: 12, name: "CHDWEB" },
        { value: 11, name: "CHDHKTV" },
        { value: 8, name: "OneHD" },
        { value: 16, name: "blucook" },
        { value: 19, name: "KAN" },
        { value: 22, name: "JKCT" },
        { value: 23, name: "BMDru" },
        { value: 25, name: "Destiny" },
      ],
    },
  ],

  officialGroupPattern: [/-(CHD|.*@CHDBits)|@CHDWEB/i],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      progress: {
        selector: ["td.rowfollow:last"],
        elementProcess: (element: HTMLElement) => {
          const text = element.textContent?.trim() || "";
          // 如果是"--"表示未知
          if (text === "--") {
            return 0;
          }
          const percentMatch = text.match(/(\d+)%/);
          return percentMatch ? parseInt(percentMatch[1]) : 0;
        },
      },
      status: {
        selector: ["td.rowfollow:last"],
        elementProcess: (element: HTMLElement) => {
          const text = element.textContent?.trim() || "";
          const style = element.getAttribute("style");

          // 如果是"--"表示未知状态
          if (text === "--") {
            return ETorrentStatus.unknown;
          }

          // 检查是否包含百分比
          const percentMatch = text.match(/(\d+)%/);
          if (!percentMatch) {
            return ETorrentStatus.unknown;
          }

          const percentage = parseInt(percentMatch[1]);
          if (style) {
            if (percentage === 100) {
              return ETorrentStatus.seeding;
            } else {
              return ETorrentStatus.downloading;
            }
          } else {
            if (percentage === 100) {
              return ETorrentStatus.completed;
            } else {
              return ETorrentStatus.inactive;
            }
          }
        },
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
      name: "Power User",
      interval: "P5W",
      downloaded: "200GB",
      ratio: 2.0,
      bonus: 80000,
      privilege:
        '可以查看NFO文档；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P10W",
      downloaded: "500GB",
      ratio: 3.0,
      bonus: 150000,
      privilege: "",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "800GB",
      ratio: 4.0,
      bonus: 300000,
      privilege:
        '可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。可以在做种/下载/发布的时候选择匿名模式。',
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P20W",
      downloaded: "999GB",
      ratio: 5.0,
      bonus: 650000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "1500GB",
      ratio: 6.0,
      bonus: 1000000,
      privilege: "可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P30W",
      downloaded: "2TB",
      ratio: 7.0,
      bonus: 2200000,
      privilege:
        "首次升级赠送邀请1枚，可以更新过期的外部信息；可以查看Extreme User论坛。Extreme User及以上等级用户封存账号（在控制面板）后不会被删除账号。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: "3TB",
      ratio: 8.0,
      bonus: 3500000,
      privilege: "首次升级赠送邀请2枚，保留帐号，在官方活动期间可发放邀请；Ultimate User及以上等级用户会永远保留；",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P52W",
      downloaded: "4TB",
      ratio: 10,
      bonus: 5000000,
      privilege: "首次升级赠送邀请3枚，保留帐号，在官方活动期间可发放邀请；",
    },
  ],
};
