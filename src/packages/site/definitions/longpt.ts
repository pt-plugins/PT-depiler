import { ETorrentStatus, type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "longpt",
  name: "LongPT",
  aka: ["LongPT"],
  description: "长长久久，平平安安！",
  tags: ["综合", "影视", "动漫", "有声书"],
  timezoneOffset: "+0800",

  collaborator: ["wiiii"],
  type: "private",
  schema: "NexusPHP",
  urls: ["https://longpt.org/", "https://wiiii.dpdns.org/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "剧集", value: 402 },
        { name: "综艺", value: 403 },
        { name: "纪录片", value: 404 },
        { name: "动画", value: 405 },
        { name: "音乐视频", value: 406 },
        { name: "体育", value: 407 },
        { name: "音频", value: 408 },
        { name: "其他", value: 409 },
        { name: "有声书", value: 410 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "source",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "HD DVD", value: 2 },
        { name: "DVD", value: 3 },
        { name: "HDTV", value: 4 },
        { name: "TV-DL", value: 5 },
        { name: "Other", value: 6 },
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
        { name: "AV1", value: 5 },
        { name: "其他", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "FLAC", value: 1 },
        { name: "APE", value: 2 },
        { name: "DTS", value: 3 },
        { name: "MP3", value: 4 },
        { name: "OGG", value: 5 },
        { name: "AAC", value: 6 },
        { name: "Other", value: 7 },
        { name: "M4A", value: 8 },
        { name: "TrueHD Atmos", value: 9 },
        { name: "DDP", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "2K/1440p/1440i", value: 1 },
        { name: "1080p/1080i", value: 2 },
        { name: "720p/720i", value: 3 },
        { name: "480p/480i", value: 4 },
        { name: "4K/2160p/2160i", value: 5 },
        { name: "8K/4320p/4320i", value: 6 },
        { name: "Other", value: 7 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "LongA", value: 1 },
        { name: "LongWeb", value: 2 },
        { name: "LongPT", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "Other", value: 5 },
        { name: "RL", value: 6 },
        { name: "CMCT", value: 7 },
        { name: "HHWEB", value: 8 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag_id",
      options: [
        { name: "禁转", value: 1 },
        { name: "首发", value: 2 },
        { name: "官方", value: 3 },
        { name: "DIY", value: 4 },
        { name: "国语", value: 5 },
        { name: "中字", value: 6 },
        { name: "HDR", value: 7 },
        { name: "完结", value: 8 },
        { name: "英字", value: 9 },
        { name: "杜比", value: 10 },
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
        selector: ["td.rowhead:contains('魔力') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
  levelRequirements: [
    {
      id: 0,
      name: "鹰角龙",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "甲龙",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 1.5,
      seedingBonus: 40000,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；" +
        '可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "迅猛龙",
      interval: "P8W",
      downloaded: "400GB",
      ratio: 2.5,
      seedingBonus: 80000,
      privilege: "迅猛龙及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "双嵴龙",
      interval: "P20W",
      downloaded: "800GB",
      ratio: 3.5,
      seedingBonus: 150000,
      privilege: "得到一个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "神翼龙",
      interval: "P30W",
      downloaded: "1TB",
      ratio: 5,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "棘龙",
      interval: "P50W",
      downloaded: "2TB",
      ratio: 6,
      seedingBonus: 400000,
      privilege: "得到一个邀请名额；可以查看其它用户的评论、帖子历史。棘龙及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "泰坦巨龙",
      interval: "P70W",
      downloaded: "3TB",
      ratio: 7,
      seedingBonus: 700000,
      privilege: "得到一个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "沧龙",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 8,
      seedingBonus: 1200000,
      privilege: "得到两个邀请名额。",
    },
    {
      id: 8,
      name: "霸王龙",
      interval: "P130W",
      downloaded: "5TB",
      ratio: 9,
      seedingBonus: 1600000,
      privilege: "得到三个邀请名额。",
    },
  ],
};
