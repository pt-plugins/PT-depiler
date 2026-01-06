import { set } from "es-toolkit/compat";
import type { IAdvancedSearchRequestConfig, ISiteMetadata, TSelectSearchCategoryValue } from "../types";
import { GB, TB } from "../utils";
import { CategoryIncldead, CategorySpstate, CategoryInclbookmarked, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ubits",
  name: "UBits",
  aka: ["UB"],
  description: "原盘爱好者集散地",
  tags: ["影视"],

  collaborator: ["Seed"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://ubits.club/"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 401, name: "Movies(电影)" },
        { value: 402, name: "TV Series(剧集)" },
        { value: 403, name: "TV Shows(综艺)" },
        { value: 404, name: "Docs(纪录)" },
        { value: 405, name: "Animations(动画)" },
        { value: 406, name: "Music(音乐)" },
        { value: 407, name: "Sports(体育)" },
        { value: 409, name: "MV(音乐视频)" },
        { value: 408, name: "Others(其他)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区",
      key: "source",
      options: [
        { value: 1, name: "Mainland(大陆)" },
        { value: 2, name: "Hongkong(香港)" },
        { value: 3, name: "Taiwan(台湾)" },
        { value: 4, name: "West(欧美)" },
        { value: 5, name: "Japan(日本)" },
        { value: 6, name: "Korea(韩国)" },
        { value: 7, name: "Thailand(泰国)" },
        { value: 8, name: "India(印度)" },
        { value: 8, name: "Russia(俄罗斯)" },
        { value: 99, name: "Other(其他地区)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "格式",
      key: "medium",
      options: [
        { value: 10, name: "4K UHD原盘(UltraHD Blu-ray)" },
        { value: 1, name: "蓝光原盘(Blu-ray)" },
        { value: 4, name: "流媒体(WEB-DL)" },
        { value: 3, name: "REMUX" },
        { value: 7, name: "(压制)Encode" },
        { value: 2, name: "HD DVD" },
        { value: 5, name: "HDTV" },
        { value: 6, name: "DVDR" },
        { value: 8, name: "Lossless Music" },
        { value: 9, name: "Track" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 6, name: "4320p" },
        { value: 5, name: "2160p" },
        { value: 7, name: "1440p" },
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "视频编码",
      key: "codec",
      options: [
        { value: 7, name: "H265(HEVC/X265)" },
        { value: 1, name: "H264(AVC/x264)" },
        { value: 11, name: "AV1" },
        { value: 2, name: "VC-1" },
        { value: 4, name: "MPEG-2" },
        { value: 10, name: "AVS" },
        { value: 3, name: "Xvid" },
        { value: 9, name: "MPEG-4" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 8, name: "Dolby Atmos" },
        { value: 9, name: "DTS:X" },
        { value: 10, name: "TrueHD" },
        { value: 11, name: "DTS-HD MA/HR" },
        { value: 13, name: "LPCM" },
        { value: 12, name: "DD+(Dolby Digital Plus)" },
        { value: 14, name: "DD(AC3)" },
        { value: 3, name: "DTS" },
        { value: 6, name: "AAC" },
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 5, name: "OGG" },
        { value: 4, name: "MP3" },
        { value: 7, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 1, name: "UBits" },
        { value: 6, name: "UBWEB" },
        { value: 7, name: "UBTV" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { value: "1", name: "禁转" },
        { value: "17", name: "原生原盘" },
        { value: "3", name: "官方" },
        { value: "4", name: "DIY" },
        { value: "5", name: "国配" },
        { value: "11", name: "粤语" },
        { value: "6", name: "中字" },
        { value: "21", name: "高分国剧" },
        { value: "12", name: "特效" },
        { value: "8", name: "杜比视界" },
        { value: "10", name: "HDR10+" },
        { value: "18", name: "菁彩HDR" },
        { value: "9", name: "HDR10" },
        { value: "23", name: "连载" },
        { value: "20", name: "合集" },
        { value: "19", name: "HLG" },
        { value: "22", name: "自购" },
        { value: "14", name: "菜单修改" },
        { value: "13", name: "零魔力" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (value: TSelectSearchCategoryValue): IAdvancedSearchRequestConfig => {
        const ret = { requestConfig: { params: {} } };
        (value as string[]).forEach((v) => {
          set(ret, `requestConfig.params.tag_id${v}`, 1);
        });
        return ret as IAdvancedSearchRequestConfig;
      },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "审核状态：",
      key: "audit",
      options: [
        { value: "", name: "全部" },
        { value: 0, name: "未审" },
        { value: 1, name: "通过" },
        { value: 2, name: "拒绝" },
        { value: 3, name: "待定" },
      ],
      cross: false,
    },
  ],

  officialGroupPattern: [/@UBits|-UBits|-UBWEB/i],

  search: {
    ...SchemaMetadata.search,
    advanceKeywordParams: {
      ...SchemaMetadata.search?.advanceKeywordParams!,
      douban: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.search_area", 5); // params "&search_area=4"
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        selector: ["td.embedded:first"],
        elementProcess: (element: HTMLElement) => {
          const br1 = element.querySelector("br");
          const nextNode = br1?.nextSibling;
          if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
            return nextNode.textContent?.trim() || "";
          }
          return "";
        },
      },
    },
  },
  levelRequirements: [
    {
      id: 0,
      groupType: "user",
      name: "Peasant",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
    },
    {
      id: 1,
      groupType: "user",
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 2,
      groupType: "user",
      name: "Power User",
      privilege: `可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。`,
      seedingBonus: 50000,
      ratio: 2.0,
      interval: "P5W",
      downloaded: 200 * GB,
    },
    {
      id: 3,
      groupType: "user",
      name: "Elite User",
      privilege: `Elite User及以上用户封存账号后不会被删除。`,
      seedingBonus: 100000,
      ratio: 3.0,
      interval: "P10W",
      downloaded: 500 * GB,
    },
    {
      id: 4,
      groupType: "user",
      name: "Crazy User",
      privilege: `得到1个邀请名额；可以在做种/下载/发布的时候选择匿名模式。`,
      seedingBonus: 200000,
      ratio: 4.0,
      interval: "P15W",
      downloaded: 800 * GB,
    },
    {
      id: 5,
      groupType: "user",
      name: "Insane User",
      privilege: `得到1个邀请名额；可以查看普通日志。`,
      seedingBonus: 500000,
      ratio: 5.0,
      interval: "P20W",
      downloaded: 1 * TB,
    },
    {
      id: 6,
      groupType: "user",
      name: "Veteran User",
      privilege: `得到1个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。`,
      seedingBonus: 750000,
      ratio: 6.0,
      interval: "P25W",
      downloaded: 1.5 * TB,
    },
    {
      id: 7,
      groupType: "user",
      name: "Extreme User",
      privilege: `得到2个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。`,
      seedingBonus: 1500000,
      ratio: 7.0,
      interval: "P30W",
      downloaded: 2 * TB,
    },
    {
      id: 8,
      groupType: "user",
      name: "Ultimate User",
      privilege: `得到3个邀请名额。`,
      seedingBonus: 2000000,
      ratio: 8.0,
      interval: "P40W",
      downloaded: 3 * TB,
    },
    {
      id: 9,
      groupType: "user",
      name: "Nexus Master",
      privilege: `得到4个邀请名额。`,
      seedingBonus: 3000000,
      ratio: 10.0,
      interval: "P60W",
      downloaded: 4 * TB,
    },
    {
      id: 10,
      groupType: "vip",
      name: "贵宾(VIP)",
      privilege: `和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。`,
    },
    {
      id: 11,
      groupType: "vip",
      name: "养老族(Retiree)",
      privilege: `退休后的管理组成员。`,
    },
  ],
};
