import type { ISiteMetadata } from "../types.ts";
import { SchemaMetadata } from "../schemas/Gazelle.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,

  search: {
    ...SchemaMetadata.search,
    keywordPath: "params.artistname", // 修复搜索参数
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        action: "advanced", // BTN需要的参数
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      url: {
        selector: "a[href*='torrents.php?id='][href*='torrentid=']", // 更精确的种子链接选择器
        attr: "href",
      },
      title: {
        selector: "span[style='float:none;']", // BTN的种子标题选择器
      },
      category: {
        selector: "a[href*='filter_cat'] img", // BTN的分类选择器
        attr: "title",
      },
      time: {
        selector: "div.nobr:contains('Added:')",
        filters: [
          (query: string) => {
            // 从 "Up: Anonymous - Added: 1 hour and 50 minutes ago" 中提取时间部分
            const match = query.match(/Added:\s*(.+)/);
            return match ? match[1].trim() : query.trim();
          },
          { name: "parseTTL" }, // 使用parseTTL转换相对时间为绝对时间
        ],
      },
    },
  },
  id: "broadcasthenet",
  name: "BroadcastTheNet",
  aka: ["BTN"],
  description: "BroadcastTheNet is a private tracker for TV shows.",
  tags: ["电视剧"],
  timezoneOffset: "+0000",
  collaborator: ["Sunhelter"],

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://oebnqpnfgur.arg/"],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id", "name", "messageCount"],
      },
      {
        requestConfig: {
          url: "/user.php",
          params: {
            /* id: flushUserInfo.id */
          },
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime",
          "seeding",
          "seedingSize",
          "totalTraffic",
          "snatches",
        ],
      },
    ],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      uploaded: {
        selector: "ul.nobullet > li:contains('Upload:')",
        filters: [{ name: "parseSize" }],
      },
      uploads: {
        selector: "ul.nobullet > li:contains('Uploaded:')",
        filters: [{ name: "parseNumber" }],
      },
      downloaded: {
        selector: "ul.nobullet > li:contains('Downloaded:')",
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: "ul.nobullet > li:contains('User Class:')",
        filters: [
          (query: string) => {
            return query.replace("User Class:", "").trim();
          },
        ],
      },
      bonus: {
        selector: "ul.nobullet > li:contains('Bonus Points:') > a",
        filters: [{ name: "parseNumber" }],
      },
      ratio: undefined,
      joinTime: {
        selector: "ul.nobullet > li:contains('Joined:') > span",
        filters: [{ name: "parseTTL" }],
      },
      seeding: {
        selector: "ul.nobullet > li:contains('Seeding:')",
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: "ul.nobullet > li:contains('Seeding Size:')",
        filters: [{ name: "parseSize" }],
      },
      totalTraffic: {
        selector: "ul.nobullet > li:contains('Total Traffic:')",
        filters: [{ name: "parseSize" }],
      },
      snatches: {
        selector: "ul.nobullet:has( > li:contains('Snatched:'))",
        elementProcess: (element: HTMLElement) => {
          // 查找所有包含 "Snatched:" 的元素
          const snatchedElements = Array.from(element.querySelectorAll("li")) as HTMLElement[];
          let totalSnatches = 0;

          snatchedElements.forEach((el) => {
            const text = el.textContent || "";
            if (text.includes("Snatched:")) {
              const match = text.match(/Snatched:\s*(\d+)/);
              if (match) {
                totalSnatches += parseInt(match[1]);
              }
            }
          });

          return totalSnatches;
        },
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      totalTraffic: "100GB",
      bonus: 100000,
      snatches: 100,
      interval: "P2W",
      privilege: "Can access the XXX forum.",
    },
    {
      id: 2,
      name: "Power User",
      totalTraffic: "250GB",
      bonus: 250000,
      snatches: 250,
      interval: "P4W",
      privilege:
        "Has access to the Power User forum, Official and Unofficial Invites forums, Top 10 filters, and can access notifications.",
    },
    {
      id: 3,
      name: "Extreme User",
      totalTraffic: "500GB",
      bonus: 500000,
      snatches: 500,
      interval: "P2M3W",
      privilege: "Has access to the Extreme User forum.",
    },
    {
      id: 4,
      name: "Elite",
      totalTraffic: "1TB",
      bonus: 850000,
      snatches: 1000,
      interval: "P5M2W",
      privilege:
        "Has access to the Elite forum and can set own Custom Title, and the ability to send invites purchased from the Lumens Store.",
    },
    {
      id: 5,
      name: "Guru",
      totalTraffic: "2.5TB",
      bonus: 1500000,
      snatches: 1500,
      interval: "P8M1W",
      privilege: "Has access to the Guru forum.",
    },
    {
      id: 6,
      name: "Master",
      totalTraffic: "7.5TB",
      bonus: 3000000,
      snatches: 3000,
      interval: "P11M4W",
      privilege: "Has access to the Master forum.",
    },
    {
      id: 7,
      name: "Overlord",
      totalTraffic: "100TB",
      bonus: 250000000,
      snatches: 35000,
      interval: "P2Y11M",
      privilege: "Has access to the Overlord forum, Custom Title, Unlimited Invites, and more to come!",
    },
  ],
};
