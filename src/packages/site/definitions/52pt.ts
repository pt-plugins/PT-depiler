/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/52pt.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/6763
 */
import type { ISiteMetadata, IUserInfo } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";
import { userInfoWithInvitesInUserDetailsPage } from "./kunlun";
import NexusPHP from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "52pt",
  name: "52PT",
  aka: ["我爱PT"],
  description: "低调地在这个PT校园快乐成长 快乐分享",
  tags: ["高清", "电影", "电视剧"],
  timezoneOffset: "+0800",
  favicon: "./52pt.ico",

  collaborator: ["StarGazerQQD", "zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://52cg.fvgr/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Movies/电影", value: 401 },
        { name: "Documentaries/纪录片", value: 404 },
        { name: "Animations/动漫(画)", value: 405 },
        { name: "TV Series/剧集", value: 402 },
        { name: "TV Shows/综艺", value: 403 },
        { name: "Music Videos/音乐MV(演唱会)", value: 406 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray DIY", value: 2 },
        { name: "Blu-ray Remux", value: 4 },
        { name: "Blu-ray原盘无中文", value: 11 },
        { name: "4K UHD无中文", value: 1 },
        { name: "2K原盘中字（国粤语）", value: 14 },
        { name: "4K原盘中字（国粤语）", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264/AVC", value: 13 },
        { name: "H.265(HEVC)", value: 1 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
        { name: "X264", value: 11 },
        { name: "H.265", value: 14 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "DTS.HDMA", value: 4 },
        { name: "True.HD", value: 12 },
        { name: "TRUE.HD Atoms", value: 10 },
        { name: "DTS:X", value: 3 },
        { name: "AC3/DD", value: 6 },
        { name: "LPCM", value: 14 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "2K/1080p", value: 1 },
        { name: "4K/2160P", value: 5 },
        { name: "1080i", value: 2 },
        { name: "1080P-3D", value: 4 },
        { name: "720p", value: 3 },
        { name: "others", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "52PT DIY/原盘小组", value: 6 },
        { name: "52PT REMUX/重编码小组", value: 7 },
        { name: "BeyondHD", value: 1 },
        { name: "HDSKY", value: 2 },
        { name: "TTG", value: 3 },
        { name: "MTeam", value: 8 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        '得到一个邀请名额；可以查看NFO文档；可以请求续种； 可以发送邀请；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 允许发布新的趣味盒内容及编辑自己发布的趣味盒内容;可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1536GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2560GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "3072GB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "4608GB",
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "5632GB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
    // VIP/管理组等级
    {
      id: 100,
      name: "名誉校长",
      nameAka: ["名誉校长", "名誉校长(VIP)", "VIP", "贵宾"],
      groupType: "vip",
      privilege: "VIP等级，享受特殊权限。",
    },
    {
      id: 101,
      name: "离退休",
      nameAka: ["离退休", "离退休(Retiree)", "Retiree"],
      groupType: "manager",
      privilege: "离退休人员等级。",
    },
    {
      id: 102,
      name: "教员",
      nameAka: ["教员", "教员(Uploader)", "Uploader"],
      groupType: "manager",
      privilege: "教员等级，负责内容上传。",
    },
    {
      id: 103,
      name: "教授",
      nameAka: ["教授", "教授(Moderator)", "Moderator"],
      groupType: "manager",
      privilege: "教授等级，负责内容审核。",
    },
    {
      id: 104,
      name: "校长",
      nameAka: ["校长", "校长(Administrator)", "Administrator"],
      groupType: "manager",
      privilege: "校长等级，最高管理权限。",
    },
    {
      id: 105,
      name: "校区维护",
      nameAka: ["校区维护", "校区维护(Sysop)", "Sysop"],
      groupType: "manager",
      privilege: "校区维护等级，负责系统维护。",
    },
    {
      id: 106,
      name: "校区创始人",
      nameAka: ["校区创始人", "校区创始人(Staff Leader)", "Staff Leader"],
      groupType: "manager",
      privilege: "校区创始人等级，最高权限。",
    },
  ],

  userInfo: userInfoWithInvitesInUserDetailsPage,
};

export default class Site52PT extends NexusPHP {
  // 重写等级匹配逻辑，使用严格匹配避免"校长"被"名誉校长"包含
  protected override guessUserLevelId(userInfo: Partial<IUserInfo>): number {
    if (!userInfo.levelName) return 0;

    const cleanedUserLevelName = userInfo.levelName.replace(/[\s _]+/g, "").toLowerCase();

    // 优先使用精确匹配，避免包含关系导致的错误匹配
    const exactLevel = siteMetadata.levelRequirements?.find((level) => {
      const levelNames = [level.name, ...(level.nameAka ?? [])];
      return levelNames.some((name) => {
        const cleanedLevelName = name.replace(/[\s _]+/g, "").toLowerCase();
        // 使用精确匹配
        return cleanedLevelName === cleanedUserLevelName;
      });
    });

    if (exactLevel) {
      return exactLevel.id;
    }

    // 如果精确匹配失败，尝试包含匹配（但排除可能冲突的等级）
    const includeLevel = siteMetadata.levelRequirements?.find((level) => {
      const levelNames = [level.name, ...(level.nameAka ?? [])];
      return levelNames.some((name) => {
        const cleanedLevelName = name.replace(/[\s _]+/g, "").toLowerCase();

        // 特殊处理：如果用户等级是"校长"，避免匹配到"名誉校长"
        if (cleanedUserLevelName === "校长" && cleanedLevelName.includes("名誉校长")) {
          return false;
        }

        // 特殊处理：如果用户等级是"名誉校长"，避免匹配到"校长"
        if (cleanedUserLevelName === "名誉校长" && cleanedLevelName === "校长") {
          return false;
        }

        return cleanedLevelName.includes(cleanedUserLevelName);
      });
    });

    if (includeLevel) {
      return includeLevel.id;
    }

    // 如果都失败，回退到父类的匹配逻辑
    return super.guessUserLevelId(userInfo as IUserInfo);
  }
}
