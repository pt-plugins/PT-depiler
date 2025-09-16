import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

const linkQuery = {
  selector: ['a[href*="download.php?id="]'],
  attr: "href",
};

function findParentByClass(element: HTMLElement, className: string): HTMLElement {
  if (!element || element.classList.contains(className)) {
    return element; // 找到或到达根元素时返回当前元素
  } else {
    return findParentByClass(element.parentNode as HTMLElement, className); // 继续向上查找
  }
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "haidan",
  name: "海胆",
  aka: ["海胆之家", "HaiDan"],
  tags: ["电影", "电视剧", "影视", "综合"],
  timezoneOffset: "+0800",

  collaborator: ["rsj", "zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://jjj.unvqna.ivqrb/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Documentaries(纪录片)", value: 404 },
        { name: "Movies(电影)", value: 401 },
        { name: "Animations(动画片)", value: 405 },
        { name: "TV Series(电视剧)", value: 402 },
        { name: "TV Shows(综艺)", value: 403 },
        { name: "Music Videos(MV)", value: 406 },
        { name: "Sports(体育)", value: 407 },
        { name: "Misc(其他)", value: 409 },
        { name: "HQ Audio(音乐)", value: 408 },
      ],
      cross: { mode: "comma" },
    },
    {
      ...CategorySpstate,
      cross: { mode: "comma" },
    },
    CategoryIncldead,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: { selector: ".torrent_item" },
      link: linkQuery,
      url: {
        ...linkQuery,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/details.php?id="] },
        ],
      },
      id: {
        ...linkQuery,
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: ":self",
        elementProcess: (element: HTMLElement) => {
          const group = findParentByClass(element, "group_content");
          return group.querySelector(".name_col > .name > .video_name")?.textContent?.trim() || "";
        },
      },
      subTitle: {
        selector: [".torrent_name_col a[href*='details.php']"],
      },
      time: {
        selector: [".time_col span[title]"],
        attr: "title",
        filters: [{ name: "parseValidTimeString" }],
      },
      size: { selector: ".video_size", filters: [{ name: "parseSize" }] },
      author: { selector: [".time_col>i, .time_col>.username-center"] },
      seeders: { selector: ".seeder_col" },
      leechers: { selector: ".leecher_col" },
      completed: { selector: ".snatched_col" },

      // FIXME progress status 未实现

      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "官方", selector: "label:contains('官方')", color: "#ff0000" },
        { name: "中字", selector: "label:contains('中字')", color: "#0000ff" },
        { name: "外语", selector: "label:contains('外语')", color: "#004040" },
        { name: "禁转", selector: "label:contains('禁转')", color: "#800040" },
        { name: "DIY", selector: "label:contains('DIY')", color: "#0080ff" },
        { name: "国语", selector: "label:contains('国语')", color: "#8000ff" },
        { name: "原盘", selector: "label:contains('原盘')", color: "#0080c0" },
        { name: "粤语", selector: "label:contains('粤语')", color: "#00ff00" },
        { name: "HDR", selector: "label:contains('HDR')", color: "#d4ff00" },
        { name: "杜比视界", selector: "label:contains('杜比视界')", color: "#e20ae6" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      levelId: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "src",
        filters: [
          (query: string) => {
            const match = query.match(/\/class\/(\d+)\.gif/);
            return match ? parseInt(match[1]) - 1 : 0;
          },
        ],
      },
      levelName: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "title",
        filters: [
          (query: string) => {
            if (query && query.includes(")")) {
              return query.split(")")[1].trim();
            }
            return query || "";
          },
        ],
      },
      seedingBonus: {
        selector: ["td.rowhead:contains('等级积分') + td"],
        filters: [
          (query: string) => {
            query = query.replace(/[,\s]/g, "");
            return parseFloat(query.split("[")[0]);
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别，仅能下载免费种子，可以直接发布种子",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P2W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 100,
      privilege: "允许购买邀请码，可以直接发布种子，可以删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 200,
      privilege: "Elite User允许发送邀请码，并拥有低于该等级以下权限。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P8W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 500,
      privilege: "查看种子结构，并拥有低于该等级以下权限。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P16W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 1000,
      privilege: "发布趣味盒，并拥有低于该等级以下权限。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P28W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 2000,
      privilege: "Veteran User永远保留账号，并拥有低于该等级以下权限。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P32W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 5000,
      privilege: "查看日志权限，并拥有低于该等级以下权限。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 8000,
      privilege: "查看排行榜，并拥有低于该等级以下权限",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P52W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingBonus: 10000,
      privilege: "允许匿名，拥有发布主题推荐权限，并拥有低于该等级以下权限",
    },
    {
      id: 9,
      name: "贵宾(VIP)",
      privilege: "海胆尊贵会员期间，拥有以上全部权限，并且拥有独有标识。和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 10,
      name: "养老族(Retiree)",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 11,
      name: "发布员(Uploader)",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 12,
      name: "总版主(Moderator)",
      privilege: "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 13,
      name: "管理员(Administrator)",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 14,
      name: "维护开发员(Sysop)",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 15,
      name: "主管(Staff Leader)",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
