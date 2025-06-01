import { ETorrentStatus, type IElementQuery, type ISiteMetadata, type IAdvancedSearchRequestConfig } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  subTitleRemoveExtraElement,
} from "../schemas/NexusPHP.ts";

// HDHOME 中的 selector.search.progress 以及 selector.search.status 被其他站公用
export const selectorSearchProgress: IElementQuery = {
  selector: ["> td:eq(8)"],
  filters: [(query: string) => (query === "-" ? 0 : parseFloat(query))],
};

export const selectorSearchStatus: IElementQuery = {
  selector: ["> td:eq(8)"],
  filters: [
    (query: string) => {
      if (query === "-") {
        return ETorrentStatus.unknown;
      } else {
        const process = parseFloat(query);
        switch (true) {
          case /Noseed|未做种/.test(query):
            return process >= 100 ? ETorrentStatus.completed : ETorrentStatus.inactive;
          case /Seeding|做种中/.test(query):
            return ETorrentStatus.seeding;
          case /Leeching|下载中/.test(query):
            return ETorrentStatus.downloading;
          default:
            return ETorrentStatus.unknown;
        }
      }
    },
  ],
};

export const allCustomTags = [
  { name: "禁转", value: "jz" },
  { name: "限转", value: "xz" },
  { name: "官方", value: "gf" },
  { name: "原创", value: "yc" },
  { name: "首发", value: "sf" },
  { name: "国语", value: "gy" },
  { name: "粤语", value: "yy" },
  { name: "日语", value: "ja" },
  { name: "韩语", value: "ko" },
  { name: "中字", value: "zz" },
  { name: "官字", value: "gz" },
  { name: "特效", value: "tx" },
  { name: "连载", value: "lz" },
  { name: "完结", value: "wj" },
  { name: "DIY", value: "diy" },
  { name: "Dolby Vision", value: "db" },
  { name: "HDR10", value: "hdr10" },
  { name: "HDR10+", value: "hdrm" },
  { name: "HLG", value: "hlg" },
  { name: "HDR Vivid", value: "hdrv" },
  { name: "高码率", value: "hq" },
  { name: "高帧率", value: "hfr" },
  { name: "应求", value: "yq" },
  { name: "零魔", value: "m0" },
];

export const allTagSelectors = [
  { selector: "img.hitandrun", name: "H&R", color: "#000" },
  { selector: "span.tgf", name: "官方", color: "#06c" },
  { selector: "span.tyc", name: "原创", color: "#085" },
  { selector: "span.tgz", name: "官字", color: "#530" },
  { selector: "span.tdb", name: "Dolby Vision", color: "#358" },
  { selector: "span.thdr10", name: "HDR10", color: "#9a3" },
  { selector: "span.thdrm", name: "HDR10+", color: "#9b5" },
  { selector: "span.tgy", name: "国配", color: "#f96" },
  { selector: "span.tyy", name: "粤配", color: "#f66" },
  { selector: "span.tzz", name: "中字", color: "#9c0" },
  { selector: "span.tjz", name: "Excl." }, // 禁转
  { selector: "span.txz", name: "限转", color: "#c03" },
  { selector: "span.tdiy", name: "DIY", color: "#993" },
  { selector: "span.tsf", name: "首发", color: "#339" },
  { selector: "span.tyq", name: "应求", color: "#f90" },
  { selector: "span.tm0", name: "零魔", color: "#096" },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdhome",
  name: "HDHome",
  tags: ["影视", "综合"],
  collaborator: ["tongyifan", "yuanyiwei", "Rhilip"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdhome.org/"],

  category: [
    {
      name: "搜索入口",
      key: "url",
      options: [
        { name: "种子区", value: "/torrents.php" },
        { name: "LIVE区", value: "/live.php" },
      ],
      cross: false,
      generateRequestConfig: (selectedCategories) => {
        const ret = { requestConfig: { url: selectedCategories, params: {} } };
        return ret as IAdvancedSearchRequestConfig;
      },
    },
    {
      name: "类别（种子区）",
      key: "cat_torrent", // 仅作为示例，实际上并没有这个 key
      notes: "请先设置搜索入口为“种子区”！请勿与 LIVE 区类别同时选择！",
      options: [
        { value: 411, name: "Movies SD" },
        { value: 412, name: "Movies IPad" },
        { value: 413, name: "Movies 720p" },
        { value: 414, name: "Movies 1080p" },
        { value: 415, name: "Movies REMUX" },
        { value: 450, name: "Movies Bluray" },
        { value: 499, name: "Movies UHD Blu-ray" },
        { value: 416, name: "Movies 2160p" },
        { value: 417, name: "Doc SD" },
        { value: 418, name: "Doc IPad" },
        { value: 419, name: "Doc 720p" },
        { value: 420, name: "Doc 1080p" },
        { value: 421, name: "Doc REMUX" },
        { value: 451, name: "Doc Bluray" },
        { value: 500, name: "Doc UHD Blu-ray" },
        { value: 422, name: "Doc 2160p" },
        { value: 423, name: "TVMusic 720p" },
        { value: 424, name: "TVMusic 1080i" },
        { value: 425, name: "TVShow SD" },
        { value: 426, name: "TVShow IPad" },
        { value: 471, name: "TVShow IPad" },
        { value: 427, name: "TVShow 720p" },
        { value: 428, name: "TVShow 1080i" },
        { value: 429, name: "TVShow 1080p" },
        { value: 430, name: "TVShow REMUX" },
        { value: 452, name: "TVShows Bluray" },
        { value: 431, name: "TVShow 2160p" },
        { value: 432, name: "TVSeries SD" },
        { value: 433, name: "TVSeries IPad" },
        { value: 434, name: "TVSeries 720p" },
        { value: 435, name: "TVSeries 1080i" },
        { value: 436, name: "TVSeries 1080p" },
        { value: 437, name: "TVSeries REMUX" },
        { value: 453, name: "TVSereis Bluray" },
        { value: 438, name: "TVSeries 2160p" },
        { value: 502, name: "TVSeries 4K Bluray" },
        { value: 439, name: "Musics APE" },
        { value: 440, name: "Musics FLAC" },
        { value: 441, name: "Musics MV" },
        { value: 442, name: "Sports 720p" },
        { value: 443, name: "Sports 1080i" },
        { value: 444, name: "Anime SD" },
        { value: 445, name: "Anime IPad" },
        { value: 446, name: "Anime 720p" },
        { value: 447, name: "Anime 1080p" },
        { value: 448, name: "Anime REMUX" },
        { value: 454, name: "Anime Bluray" },
        { value: 409, name: "Misc" },
        { value: 449, name: "Anime 2160p" },
        { value: 501, name: "Anime UHD Blu-ray" },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "类别（LIVE 区）",
      key: "cat_live", // 仅作为示例，实际上并没有这个 key
      notes: "请先设置搜索入口为“LIVE区”！请勿与种子区类别同时选择！",
      options: [
        { value: 494, name: "LIVE/Movies Bluray" },
        { value: 495, name: "LIVE/Doc Bluray" },
        { value: 469, name: "LIVE/TVMusic 1080i" },
        { value: 472, name: "LIVE/TVShow 720p" },
        { value: 473, name: "LIVE/TVShow 1080i" },
        { value: 474, name: "LIVE/TVShow 1080p" },
        { value: 475, name: "LIVE/TVShow REMUX" },
        { value: 496, name: "LIVE/TVShows Bluray" },
        { value: 476, name: "LIVE/TVShow 2160p" },
        { value: 477, name: "LIVE/TVSeries SD" },
        { value: 478, name: "LIVE/TVSeries IPad" },
        { value: 479, name: "LIVE/TVSeries 720p" },
        { value: 480, name: "LIVE/TVSeries 1080p" },
        { value: 481, name: "LIVE/TVSeries REMUX" },
        { value: 497, name: "LIVE/TVSereis Bluray" },
        { value: 482, name: "LIVE/TVSeries 2160p" },
        { value: 483, name: "LIVE/Musics APE" },
        { value: 484, name: "LIVE/Musics FLAC" },
        { value: 485, name: "LIVE/Musics MV" },
        { value: 486, name: "LIVE/Sports 720p" },
        { value: 487, name: "LIVE/Sports 1080i" },
        { value: 488, name: "LIVE/Anime SD" },
        { value: 489, name: "LIVE/Anime IPad" },
        { value: 490, name: "LIVE/Anime 720p" },
        { value: 491, name: "LIVE/Anime 1080p" },
        { value: 492, name: "LIVE/Anime REMUX" },
        { value: 498, name: "LIVE/Anime Bluray" },
        { value: 493, name: "LIVE/Anime 2160p" },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { name: "UHD Blu-ray", value: 9 },
        { name: "Blu-ray", value: 1 },
        { name: "HDTV", value: 4 },
        { name: "DVD", value: 3 },
        { name: "WEB-DL", value: 7 },
        { name: "Other", value: 8 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "UHD Blu-ray", value: 10 },
        { name: "Blu-ray", value: 1 },
        { name: "Remux", value: 3 },
        { name: "Encode", value: 7 },
        { name: "HDTV", value: 5 },
        { name: "CD", value: 8 },
        { name: "MiniBD", value: 4 },
        { name: "WEB-DL", value: 11 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "AVC/H264/x264", value: 1 },
        { name: "HEVC/H265/x265", value: 2 },
        { name: "VC-1", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "AAC", value: 6 },
        { name: "AC3/DD", value: 15 },
        { name: "APE", value: 2 },
        { name: "WAV", value: 16 },
        { name: "FLAC", value: 1 },
        { name: "DTS", value: 3 },
        { name: "TrueHD", value: 13 },
        { name: "LPCM", value: 14 },
        { name: "DTS-HDMA", value: 11 },
        { name: "DTS-HDHRA", value: 18 },
        { name: "TrueHD Atmos", value: 12 },
        { name: "DTS-HDMA:X 7.1", value: 17 },
        { name: "Other", value: 7 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "2160p/4K", value: 1 },
        { name: "1080p", value: 2 },
        { name: "1080i", value: 3 },
        { name: "720p", value: 4 },
        { name: "SD", value: 5 },
        { name: "4320p/8K", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { name: "Raw", value: 1 },
        { name: "Encode", value: 2 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "HDHome", value: 1 },
        { name: "HDH", value: 2 },
        { name: "HDHTV", value: 3 },
        { name: "HDHPad", value: 4 },
        { name: "HDHWEB", value: 12 },
        { name: "3201", value: 20 },
        { name: "SHMA", value: 17 },
        { name: "TVman", value: 21 },
        { name: "ARiN", value: 19 },
        { name: "TTG", value: 6 },
        { name: "M-Team", value: 7 },
        { name: "Other", value: 11 },
        { name: "969154968", value: 22 },
        { name: "BMDru", value: 23 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "标签",
      key: "tag",
      options: allCustomTags,
      cross: false,
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        text: "",
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        elementProcess: subTitleRemoveExtraElement(["span.tags"], true),
      },
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [...SchemaMetadata.search!.selectors!.tags!, ...allTagSelectors],
    },
  },

  searchEntry: {
    area_torrent: { name: "种子区", requestConfig: { url: "/torrents.php" } },
    area_live: { name: "LIVE区", enabled: false, requestConfig: { url: "/live.php" } },
  },

  levelRequirements: [
    {
      id: 1,
      name: "临时演员(User)",
      privilege: `新用户的默认级别。`,
    },
    {
      id: 2,
      name: "跑龙套(Power User)",
      interval: "P5W",
      downloaded: "256GB",
      ratio: 2.0,
      seedingBonus: 40000,
      privilege: "无",
    },
    {
      id: 3,
      name: "配角(Elite User)",
      interval: "P8W",
      downloaded: "386GB",
      ratio: 2.5,
      seedingBonus: 100000,
      privilege: "无",
    },
    {
      id: 4,
      name: "主演(Crazy User)",
      interval: "P12W",
      downloaded: "512GB",
      ratio: 3.0,
      seedingBonus: 180000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 5,
      name: "领衔主演(Insane User)",
      interval: "P16W",
      downloaded: "768GB",
      ratio: 3.5,
      seedingBonus: 280000,
      privilege: "无",
    },
    {
      id: 6,
      name: "明星(Veteran User)",
      interval: "P20W",
      downloaded: "1TB",
      ratio: 4.0,
      seedingBonus: 400000,
      privilege: "可以查看其它用户的评论、帖子历史",
    },
    {
      id: 7,
      name: "国际大腕(Extreme User)",
      interval: "P24W",
      downloaded: "2TB",
      ratio: 4.5,
      seedingBonus: 540000,
      privilege: "得到1个邀请名额，可以更新过期的外部信息；可以查看Extreme User论坛",
    },
    {
      id: 8,
      name: "影帝(Ultimate User)",
      interval: "P30W",
      downloaded: "8TB",
      ratio: 5.0,
      seedingBonus: 700000,
      privilege: "得到1个邀请名额",
    },
    {
      id: 9,
      name: "终身影帝(Nexus Master)",
      interval: "P36W",
      downloaded: "10TB",
      ratio: 10,
      seedingBonus: 1000000,
      privilege: "得到1个邀请名额，账号永久保留",
    },
  ],
};
