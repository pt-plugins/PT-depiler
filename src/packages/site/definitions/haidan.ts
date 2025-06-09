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
  aka: ["海胆之家"],
  tags: ["电影", "电视剧"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

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
      levelName: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "title",
        filters: [
          (query: string) => {
            return query.split(")")[1];
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
  ],
};
