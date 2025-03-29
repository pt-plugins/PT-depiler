import { type ISiteMetadata, ETorrentStatus } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, SchemaMetadata } from "../schemas/NexusPHP";
import { extractContent, GB, TB } from "@ptd/site";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ourbits",
  name: "OurBits",
  schema: "NexusPHP",
  type: "private",
  urls: ["https://ourbits.club/"],
  description: "综合性网站，有分享率要求",
  tags: ["影视", "动漫", "纪录片", "综艺"],
  collaborator: ["Rhilip"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Movies", value: 401 },
        { name: "Movies-3D", value: 402 },
        { name: "Concert", value: 419 },
        { name: "TV-Episode", value: 412 },
        { name: "TV-Pack", value: 405 },
        { name: "TV-Show", value: 413 },
        { name: "Documentary", value: 410 },
        { name: "Animation", value: 411 },
        { name: "Sports", value: 415 },
        { name: "Music-Video", value: 414 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "UHD Blu-ray", value: 12 },
        { name: "FHD Blu-ray", value: 1 },
        { name: "Remux", value: 3 },
        { name: "Encode", value: 7 },
        { name: "WEB-DL", value: 9 },
        { name: "HDTV", value: 5 },
        { name: "DVD", value: 2 },
        { name: "CD", value: 8 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264", value: 12 },
        { name: "HEVC", value: 14 },
        { name: "MPEG-2", value: 15 },
        { name: "VC-1", value: 16 },
        { name: "Xvid", value: 17 },
        { name: "Other", value: 18 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "Atmos", value: 14 },
        { name: "DTS X", value: 21 },
        { name: "DTS-HDMA", value: 1 },
        { name: "TrueHD", value: 2 },
        { name: "DTS", value: 4 },
        { name: "LPCM", value: 5 },
        { name: "FLAC", value: 13 },
        { name: "APE", value: 12 },
        { name: "AAC", value: 7 },
        { name: "AC3", value: 6 },
        { name: "WAV", value: 11 },
        { name: "MPEG", value: 32 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "SD", value: 4 },
        { name: "720p", value: 3 },
        { name: "1080i", value: 2 },
        { name: "1080p", value: 1 },
        { name: "2160p", value: 5 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "地区",
      key: "processing",
      options: [
        { name: "CN(中国大陆)", value: 1 },
        { name: "US/EU(欧美)", value: 2 },
        { name: "HK/TW(港台)", value: 3 },
        { name: "JP(日)", value: 4 },
        { name: "KR(韩)", value: 5 },
        { name: "OT(其他)", value: 6 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "OurBits", value: 1 },
        { name: "PbK", value: 2 },
        { name: "OurTV", value: 12 },
        { name: "iLoveTV", value: 42 },
        { name: "FLTTH", value: 46 },
        { name: "Ao", value: 47 },
        { name: "MGs", value: 48 },
        { name: "OurPad", value: 3 },
        { name: "HosT", value: 18 },
        { name: "iLoveHD", value: 31 },
        { name: "原创/原抓", value: 41 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Tags",
      key: "tags",
      options: [
        { name: "官方", value: "gf" },
        { name: "首发", value: "sf" },
        { name: "DIY", value: "diy" },
        { name: "国语", value: "gy" },
        { name: "中字", value: "zz" },
        { name: "应求", value: "yq" },
        { name: "禁转", value: "jz" },
        { name: "杜比视界", value: "db" },
        { name: "HDR10", value: "hdr" },
        { name: "HDR10+", value: "hdrp" },
      ],
      cross: { mode: "brackets" },
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
      ],
      cross: false,
    },
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        text: "",
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        elementProcess: (element) => {
          const testSubTitle = element.parentElement!.innerHTML.split("<br>");
          if (testSubTitle && testSubTitle.length > 1) {
            const subTitleHtml = testSubTitle[testSubTitle.length - 1];

            // 移除 div > a:has(span.tag) 的内容
            const div = document.createElement("div");
            div.innerHTML = subTitleHtml;
            div.querySelectorAll("div > a span.tag").forEach((el) => el.parentElement!.remove());
            return extractContent(div.innerHTML).trim();
          }
          return "";
        },
      },
      ext_imdb: { selector: "label.imdb_rate", data: "imdbid", filters: [{ name: "extImdbId" }] },
      ext_douban: { selector: "label.douban_rate", data: "doubanid" },
      progress: {
        selector: "div.progressBar > div",
        attr: "style",
        filters: [
          (query: string) => {
            const progressMatch = query.match(/width:.?(\d.+)%/);
            return progressMatch && progressMatch.length >= 2 ? parseFloat(progressMatch[1]) : 0;
          },
        ],
      },
      status: {
        selector: "div.progressBar > div",
        attr: "title",
        filters: [
          (query: string) => {
            const progressStatusMatch = query.match(/(\d.+)% (进行中|未开始)/);
            if (progressStatusMatch && progressStatusMatch.length >= 3) {
              const progress = parseFloat(progressStatusMatch[1]);
              const status = progressStatusMatch[2];

              if (status === "进行中") {
                return progress < 100 ? ETorrentStatus.downloading : ETorrentStatus.seeding;
              } else {
                // if (status === '未开始')
                return progress < 100 ? ETorrentStatus.inactive : ETorrentStatus.completed;
              }
            }
            return ETorrentStatus.unknown;
          },
        ],
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { selector: ".tag.tag-gf", name: "官方", color: "blue" },
        { selector: ".tag.tag-diy", name: "DIY", color: "orange" },
        { selector: ".tag.tag-sf", name: "首发", color: "pink" },
        { selector: ".tag.tag-gy", name: "国语", color: "teal" },
        { selector: ".tag.tag-zz", name: "中字", color: "indigo" },
        { selector: ".tag.tag-yq", name: "应求", color: "purple" },
        { selector: ".tag.tag-jz", name: "禁转", color: "red" }, // Excl.
        // { selector: ".tag.tag-bd", name: "蓝光" }, // 不明，这个标签已经不做使用
        { selector: ".tag.tag-db", name: "杜比视界", color: "black" },
        { selector: ".tag.tag-hdr10", name: "HDR10", color: "green" },
        { selector: ".tag.tag-hdr10p", name: "HDR10+", color: "green-darken-3" },
        { selector: ".tag.tag-hlg", name: "HLG", color: "green-lighten-1" },
      ],
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: 100 * GB,
      ratio: 2.0,
      privilege:
        '可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。最多可以同时下载20个种子',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P10W",
      downloaded: 350 * GB,
      ratio: 2.5,
      privilege:
        "Elite User及以上用户封存账号后不会被删除。此等级及以上没有下载数限制。可以查看论坛Elite User(邀请交流版)",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: 500 * GB,
      ratio: 3.0,
      privilege: "可以在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P20W",
      downloaded: 1 * TB,
      ratio: 3.5,
      privilege: "可以查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P25W",
      downloaded: 2 * TB,
      ratio: 4.0,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P30W",
      downloaded: 4 * TB,
      ratio: 4.5,
      privilege: "得到一个永久邀请；可以更新过期的外部信息",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: 6 * TB,
      ratio: 5.0,
      privilege: "得到两个永久邀请",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P52W",
      downloaded: 8 * TB,
      ratio: 5.5,
      privilege: "得到三个永久邀请",
    },
    {
      id: 9,
      name: "贵宾",
      groupType: "vip",
      privilege: "免除自动降级，只计算上传量，不计算下载量。",
    },
    {
      id: 10,
      name: "荣誉会员",
      groupType: "vip",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 11,
      name: "发布员",
      groupType: "manager",
      privilege: "官方小组的成员。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 12,
      name: "总版主",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；" +
        "可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。" +
        "不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 13,
      name: "管理员",
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 14,
      name: "维护开发员",
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 15,
      name: "主管",
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
