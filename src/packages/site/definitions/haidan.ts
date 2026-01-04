import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";
import { userInfoWithInvitesInUserDetailsPage } from "./kunlun.ts";
import { parseSizeString, sizePattern } from "../utils/filesize";
import Sizzle from "sizzle";
import { createDocument } from "../utils/html";

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

  urls: ["https://www.haidan.video/"],

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
    ...userInfoWithInvitesInUserDetailsPage,
    selectors: {
      ...userInfoWithInvitesInUserDetailsPage.selectors,
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
            query = query.replace(/[\s,]/g, "");
            return parseFloat(query.split("[")[0]);
          },
        ],
      },
      // 从 ajax 页面获取做种信息（这些选择器仅用于 userdetails.php 页面，实际上会在 process 步骤中从 getusertorrentlistajax.php 获取）
      seeding: {
        selector: [":self"],
        filters: [
          (query: any) => {
            // 这个选择器实际上不会被用到，因为会在 process 步骤中从 ajax 页面获取
            return 0;
          },
        ],
      },
      seedingSize: {
        selector: [":self"],
        elementProcess: (element: HTMLElement) => {
          // 这个选择器实际上不会被用到，因为会在 process 步骤中从 ajax 页面获取
          return 0;
        },
      },
    },
    process: [
      // 第一步：获取用户ID
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id"],
      },
      // 第二步：获取用户详细信息（但不包含seeding和seedingSize）
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "name",
          "messageCount",
          "uploaded",
          "trueUploaded",
          "downloaded",
          "trueDownloaded",
          "levelName",
          "bonus",
          "seedingBonus",
          "joinTime",
          "hnrUnsatisfied",
          "hnrPreWarning",
          // 注意：这里不包含 seeding 和 seedingSize
        ],
      },
      // 第三步：获取做种信息（使用文本响应类型，因为返回的是 HTML 片段）
      {
        requestConfig: {
          url: "/getusertorrentlistajax.php",
          params: { type: "seeding" },
          responseType: "text", // 使用文本响应，因为返回的是 HTML 片段
        },
        assertion: { id: "params.userid" },
        fields: ["seeding", "seedingSize"],
        // 使用自定义选择器，直接从文本响应中解析
        selectors: {
          seeding: {
            selector: [":self"], // :self 会返回整个响应对象（字符串）
            filters: [
              (query: any) => {
                // 当 responseType 为 "text" 时，query 就是响应字符串
                const text = typeof query === "string" ? query : String(query || "");
                // 从文本中创建 Document，然后解析表格并去重统计行数
                if (!text || !text.includes("<table")) {
                  return 0;
                }
                const doc = createDocument(text);
                const trAnothers = Sizzle("tr:not(:first-child)", doc);
                if (trAnothers.length === 0) {
                  return 0;
                }

                // 使用 Set 存储已处理的种子ID，用于去重
                const processedTorrentIds = new Set<string>();

                trAnothers.forEach((trAnother) => {
                  // 尝试从行中提取种子ID（从 details.php?id=XXX 链接中）
                  const linkElement = Sizzle("a[href*='details.php?id=']", trAnother)[0] as HTMLAnchorElement;
                  let torrentId: string | null = null;
                  if (linkElement && linkElement.href) {
                    const idMatch = linkElement.href.match(/details\.php\?id=(\d+)/);
                    if (idMatch && idMatch[1]) {
                      torrentId = idMatch[1];
                    }
                  }

                  // 如果没有找到ID，使用行的innerHTML作为唯一标识（备用方案）
                  if (!torrentId) {
                    torrentId = (trAnother as HTMLElement).innerHTML.trim();
                  }

                  // 标记为已处理（Set会自动去重）
                  processedTorrentIds.add(torrentId);
                });

                // 返回去重后的数量
                return processedTorrentIds.size;
              },
            ],
          },
          seedingSize: {
            selector: [":self"],
            filters: [
              (query: any) => {
                // 当 responseType 为 "text" 时，query 就是响应字符串
                const text = typeof query === "string" ? query : String(query || "");
                // 从文本中创建 Document，然后解析表格
                if (!text || !text.includes("<table")) {
                  return 0;
                }
                const doc = createDocument(text);
                const trAnothers = Sizzle("tr:not(:first-child)", doc);
                if (trAnothers.length === 0) {
                  return 0;
                }

                // 根据自动判断应该用 td:eq(?)
                let sizeIndex = 2;
                const tdAnothers = Sizzle("> td", trAnothers[0]);
                for (let i = 0; i < tdAnothers.length; i++) {
                  const tdText = (tdAnothers[i] as HTMLElement).innerText.trim();
                  if (sizePattern.test(tdText)) {
                    sizeIndex = i;
                    break;
                  }
                }

                // 使用 Set 存储已处理的种子ID，用于去重
                const processedTorrentIds = new Set<string>();
                let totalSize = 0;

                trAnothers.forEach((trAnother) => {
                  // 尝试从行中提取种子ID（从 details.php?id=XXX 链接中）
                  const linkElement = Sizzle("a[href*='details.php?id=']", trAnother)[0] as HTMLAnchorElement;
                  let torrentId: string | null = null;
                  if (linkElement && linkElement.href) {
                    const idMatch = linkElement.href.match(/details\.php\?id=(\d+)/);
                    if (idMatch && idMatch[1]) {
                      torrentId = idMatch[1];
                    }
                  }

                  // 如果没有找到ID，使用行的innerHTML作为唯一标识（备用方案）
                  if (!torrentId) {
                    torrentId = (trAnother as HTMLElement).innerHTML.trim();
                  }

                  // 如果这个种子ID已经处理过，跳过（去重）
                  if (processedTorrentIds.has(torrentId)) {
                    return;
                  }

                  // 标记为已处理
                  processedTorrentIds.add(torrentId);

                  // 累加大小
                  const sizeSelector = Sizzle(`td:eq(${sizeIndex})`, trAnother)[0] as HTMLElement;
                  if (sizeSelector) {
                    totalSize += parseSizeString(sizeSelector.innerText.trim());
                  }
                });

                return totalSize;
              },
            ],
          },
        },
      },
      // 第四步：获取魔力值相关信息
      {
        requestConfig: { url: "/mybonus.php", responseType: "document" },
        fields: ["bonusPerHour", "seedingBonusPerHour"],
      },
    ],
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
    // VIP以上等级通过系统智能识别机制自动处理，不在此处配置详细权限信息
  ],
};