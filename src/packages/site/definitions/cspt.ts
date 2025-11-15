import { ETorrentStatus, type ISiteMetadata } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "cspt",
  name: "财神",
  aka: ["CSPT"],
  description: "财神到，八方来财！",
  tags: ["中文", "综合", "影视", "综合"],
  timezoneOffset: "+0800",

  collaborator: ["vanchkong", "Rhilip"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://pfcg.gbc/", "uggcf://pfcg.pp/", "uggcf://pfcg.qngr/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "儿童", value: 417 },
        { name: "HQ音乐", value: 408 },
        { name: "其他", value: 409 },
        { name: "体育", value: 407 },
        { name: "MV", value: 406 },
        { name: "纪录片", value: 404 },
        { name: "综艺", value: 403 },
        { name: "电视剧", value: 402 },
        { name: "电影", value: 401 },
        { name: "动漫", value: 405 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "source",
      options: [
        { name: "Blu-ray", value: 7 },
        { name: "UHD Blu-ray", value: 8 },
        { name: "Remux", value: 9 },
        { name: "Encode", value: 10 },
        { name: "WEB-DL", value: 11 },
        { name: "HDTV", value: 12 },
        { name: "DVD", value: 13 },
        { name: "CD", value: 14 },
        { name: "Track", value: 15 },
        { name: "Other", value: 16 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264/AVC", value: 1 },
        { name: "H.265/HEVC", value: 2 },
        { name: "VC-1", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "AV1", value: 6 },
        { name: "其他", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "ALAC", value: 8 },
        { name: "AAC", value: 9 },
        { name: "APE", value: 10 },
        { name: "TrueHD Atmos", value: 11 },
        { name: "DDP/E-AC3", value: 12 },
        { name: "DD/AC3", value: 13 },
        { name: "LPCM", value: 14 },
        { name: "TrueHD", value: 15 },
        { name: "DTS:X", value: 16 },
        { name: "DTS-HD MA", value: 17 },
        { name: "DTS", value: 18 },
        { name: "M4A", value: 19 },
        { name: "WAV", value: 20 },
        { name: "MP3", value: 21 },
        { name: "FLAC", value: 22 },
        { name: "Other", value: 23 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "480p/480i", value: 4 },
        { name: "720p/720i", value: 5 },
        { name: "1080p/1080i", value: 6 },
        { name: "2K/1440p/1440i", value: 10 },
        { name: "4K/2160p/2160i", value: 7 },
        { name: "8K/4320p/4320i", value: 8 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "CSPT", value: 19 },
        { name: "CSWEB", value: 18 },
        { name: "HSPT", value: 8 },
        { name: "HSWEB", value: 9 },
        { name: "HaresWEB", value: 20 },
        { name: "TPTV", value: 12 },
        { name: "AGSVWEB", value: 21 },
        { name: "HHWEB", value: 17 },
        { name: "FRDS", value: 16 },
        { name: "ADWeb", value: 15 },
        { name: "QHstudIo", value: 14 },
        { name: "MWeb", value: 13 },
        { name: "HDS", value: 1 },
        { name: "TnP", value: 11 },
        { name: "MTeam", value: 10 },
        { name: "Other", value: 5 },
        { name: "WiKi", value: 4 },
        { name: "MySiLU", value: 3 },
        { name: "CHD", value: 2 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag_id",
      options: [
        { name: "驻站", value: 23 },
        { name: "零魔", value: 22 },
        { name: "禁转", value: 1 },
        { name: "首发", value: 2 },
        { name: "官种", value: 3 },
        { name: "DIY", value: 4 },
        { name: "国语", value: 5 },
        { name: "中字", value: 6 },
        { name: "HDR", value: 7 },
        { name: "独家", value: 13 },
        { name: "自压", value: 14 },
        { name: "重制", value: 15 },
        { name: "外挂字幕", value: 16 },
        { name: "Remux", value: 10 },
        { name: "大包", value: 17 },
        { name: "超分", value: 18 },
        { name: "补帧", value: 19 },
        { name: "粤语", value: 12 },
        { name: "特效", value: 20 },
        { name: "杜比", value: 11 },
        { name: "喜剧", value: 8 },
        { name: "分集", value: 21 },
        { name: "完结", value: 9 },
        { name: "儿童", value: 24 },
      ],
      cross: false, // tag_id 没试出来能不能多选，就先不允许 cross 了
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "审核状态",
      key: "approval_status",
      options: [
        { name: "全部", value: "" },
        { name: "未审", value: 0 },
        { name: "通过", value: 1 },
        { name: "拒绝", value: 2 },
      ],
      cross: false,
    },
  ],
  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      rows: { selector: "div.torrent-table-sub-info" },
      subTitle: { selector: ".torrent-info-text-small_name" },
      time: { selector: ".torrent-info-text-added", ...SchemaMetadata.search!.selectors!.time! },
      size: { selector: ".torrent-info-text-size", filters: [{ name: "parseSize" }] },
      author: { selector: ".torrent-info-text-author" },
      seeders: { selector: ".torrent-info-text-seeders" },
      leechers: { selector: ".torrent-info-text-leechers" },
      completed: { selector: ".torrent-info-text-finished" },
      comments: { selector: ".torrent-info-text-comments" },
      // FIXME progress 和 status 未作验证

      status: {
        selector: ["div[title*='leeching']", "div[title*='seeding']", "div[title*='inactivity']"],
        attr: "title",
        filters: [
          (title: string) => {
            if (title.includes("leeching")) return ETorrentStatus.downloading;
            if (title.includes("seeding")) return ETorrentStatus.seeding;
            if (title.includes("inactivity")) {
              return title.includes("100%") ? ETorrentStatus.completed : ETorrentStatus.inactive;
            }
            return ETorrentStatus.unknown;
          },
        ],
      },
      progress: {
        selector: ["div[title*='leeching']", "div[title*='seeding']", "div[title*='inactivity']"],
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },

      // Douban 和 imdb 虽然站点有展示评分，但无法获取到对应的id
    },
  },
  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      bonus: {
        selector: ["td.rowhead:contains('金元宝') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 80000,
      privilege:
        "可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；" +
        '可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 160000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "512GB",
      ratio: 2.05,
      seedingBonus: 300000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 2.55,
      seedingBonus: 600000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 3.05,
      seedingBonus: 1000000,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "4TB",
      ratio: 3.55,
      seedingBonus: 1500000,
      privilege: "得到一个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "8TB",
      ratio: 4.05,
      seedingBonus: 2200000,
      privilege: "得到两个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "16TB",
      ratio: 4.55,
      seedingBonus: 3000000,
      privilege: "得到三个邀请名额。",
    },
  ],
};

export default class CSPT extends NexusPHP {
  protected override get customTagsLocaterSelector() {
    return "div.torrent-title";
  }
}
