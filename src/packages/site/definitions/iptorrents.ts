import {
  type IAdvancedSearchRequestConfig,
  type ISearchCategories,
  type ISiteMetadata,
  type TSelectSearchCategoryValue,
} from "../types";
import { parseTimeToLive } from "../utils";
import { set } from "es-toolkit/compat";

// 自定义解析函数：处理IPTorrents的用户统计信息
const parseIPTorrentsStats = (query: string) => {
  if (!query) return 0;

  // 尝试解析各种格式的大小信息
  const sizeMatch = query.match(/([\d.]+)\s*(GB|MB|TB|KB|B)/i);
  if (sizeMatch) {
    const value = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toUpperCase();

    switch (unit) {
      case "TB":
        return value * 1024 * 1024 * 1024 * 1024;
      case "GB":
        return value * 1024 * 1024 * 1024;
      case "MB":
        return value * 1024 * 1024;
      case "KB":
        return value * 1024;
      case "B":
        return value;
      default:
        return value;
    }
  }

  // 如果只是数字，直接返回
  const numberMatch = query.match(/[\d.]+/);
  if (numberMatch) {
    return parseFloat(numberMatch[0]);
  }

  return 0;
};

// 专门用于做种大小的解析函数
const parseIPTorrentsSeedingSize = (query: string) => {
  if (!query) return 0;

  // 清理文本，移除多余的空格和换行
  const cleanQuery = query.trim().replace(/\s+/g, " ");

  // 尝试解析各种格式的大小信息
  const sizeMatch = cleanQuery.match(/([\d.]+)\s*(GB|MB|TB|KB|B)/i);
  if (sizeMatch) {
    const value = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toUpperCase();

    switch (unit) {
      case "TB":
        return value * 1024 * 1024 * 1024 * 1024;
      case "GB":
        return value * 1024 * 1024 * 1024;
      case "MB":
        return value * 1024 * 1024;
      case "KB":
        return value * 1024;
      case "B":
        return value;
      default:
        return value;
    }
  }

  // 尝试解析纯数字（可能是字节数）
  const numberMatch = cleanQuery.match(/[\d.]+/);
  if (numberMatch) {
    const num = parseFloat(numberMatch[0]);
    // 如果数字很大，可能是字节数
    if (num > 1000000) {
      return num;
    }
    // 如果数字较小，可能是GB或MB
    return num;
  }

  return 0;
};

// 更智能的做种大小解析函数
const parseIPTorrentsSeedingSizeAdvanced = (query: string) => {
  if (!query) return 0;

  // 清理文本，移除多余的空格和换行
  const cleanQuery = query.trim().replace(/\s+/g, " ");

  // 尝试解析各种格式的大小信息
  const sizeMatch = cleanQuery.match(/([\d.]+)\s*(GB|MB|TB|KB|B)/i);
  if (sizeMatch) {
    const value = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toUpperCase();

    switch (unit) {
      case "TB":
        return value * 1024 * 1024 * 1024 * 1024;
      case "GB":
        return value * 1024 * 1024 * 1024;
      case "MB":
        return value * 1024 * 1024;
      case "KB":
        return value * 1024;
      case "B":
        return value;
      default:
        return value;
    }
  }

  // 尝试解析纯数字（可能是字节数）
  const numberMatch = cleanQuery.match(/[\d.]+/);
  if (numberMatch) {
    const num = parseFloat(numberMatch[0]);
    // 如果数字很大，可能是字节数
    if (num > 1000000) {
      return num;
    }
    // 如果数字较小，可能是GB或MB
    return num;
  }

  return 0;
};

// 超级智能的做种大小解析函数
const parseIPTorrentsSeedingSizeUltra = (query: string) => {
  if (!query) return 0;

  // 清理文本，移除多余的空格和换行
  const cleanQuery = query.trim().replace(/\s+/g, " ");

  // 尝试解析各种格式的大小信息
  const sizeMatch = cleanQuery.match(/([\d.]+)\s*(GB|MB|TB|KB|B)/i);
  if (sizeMatch) {
    const value = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toUpperCase();

    switch (unit) {
      case "TB":
        return value * 1024 * 1024 * 1024 * 1024;
      case "GB":
        return value * 1024 * 1024 * 1024;
      case "MB":
        return value * 1024 * 1024;
      case "KB":
        return value * 1024;
      case "B":
        return value;
      default:
        return value;
    }
  }

  // 尝试解析纯数字
  const numberMatch = cleanQuery.match(/[\d.]+/);
  if (numberMatch) {
    const num = parseFloat(numberMatch[0]);

    // 如果数字很大，可能是字节数
    if (num > 1000000) {
      return num;
    }

    // 如果数字较小（1-1000），很可能是GB单位
    // 因为做种大小通常以GB为单位显示
    if (num >= 1 && num <= 1000) {
      return num * 1024 * 1024 * 1024; // 转换为字节
    }

    // 其他情况直接返回
    return num;
  }

  return 0;
};

// 邀请数量解析函数
const parseIPTorrentsInvites = (query: string) => {
  if (!query) return 0;

  // 清理文本
  const cleanQuery = query.trim();

  // 匹配 "Available: 5" 格式
  const availableMatch = cleanQuery.match(/Available:\s*(\d+)/i);
  if (availableMatch) {
    return parseInt(availableMatch[1], 10);
  }

  // 备选：直接匹配数字
  const numberMatch = cleanQuery.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0], 10);
  }

  return 0;
};

// 做种大小计算函数
const parseIPTorrentsSeedingSizeManual = (query: string) => {
  // 简单的测试：在页面上显示调试信息
  const debugDiv = document.createElement("div");
  debugDiv.style.cssText =
    "position:fixed;top:10px;left:10px;background:#ff6b6b;color:#fff;padding:10px;border-radius:5px;z-index:99999;font-size:14px;max-width:400px;";
  debugDiv.innerHTML = "🔍 过滤器函数被调用了！";
  document.body.appendChild(debugDiv);

  // 3秒后移除调试框
  setTimeout(() => debugDiv.remove(), 3000);

  // 返回一个测试值
  return 123456789;
};

const categoryPart: Pick<ISearchCategories, "cross" | "generateRequestConfig"> = {
  cross: { mode: "custom" },
  generateRequestConfig: (value: TSelectSearchCategoryValue): IAdvancedSearchRequestConfig => {
    const ret = { requestConfig: { params: {} } };
    (value as string[]).forEach((v) => {
      set(ret, `requestConfig.params.${v}`, "");
    });
    return ret as IAdvancedSearchRequestConfig;
  },
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "iptorrents",
  name: "IPTorrents",
  aka: ["IPT"],
  description: "IPTorrents - #1 Private Tracker",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://iptorrents.com/"],

  category: [
    {
      name: "Category/Main",
      key: "category_main",
      notes: "For Movies, TV, Games, Music, Miscellaneous, XXX , you dont need to select subcategories.",
      options: [
        { name: "Movies", value: 72 },
        { name: "TV", value: 73 },
        { name: "Games", value: 74 },
        { name: "Music", value: 75 },
        { name: "Miscellaneous", value: 76 },
        { name: "XXX", value: 88 },
        { name: "Bookmarks", value: "bookmarks" },
        { name: "Subscriptions", value: "subscriptions" },
        { name: "Freeleech", value: "free" },
        { name: "New", value: "new" },
        { name: "Staff Picks", value: "pinned" },
        { name: "Top of the Day", value: "top-of-the-day" },
        { name: "Top of the Week", value: "top" },
        { name: "Top of the Month", value: "top-of-the-month" },
        { name: "Top of the Quarter", value: "top-of-the-quarter" },
        { name: "Top of the Year", value: "top-of-the-year" },
        { name: "720p", value: "720p" },
        { name: "1080p", value: "1080p" },
        { name: "2160p", value: "2160p" },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Movies",
      key: "category_movies",
      options: [
        { name: "Movie/3D", value: 87 },
        { name: "Movie/480p", value: 77 },
        { name: "Movie/4K", value: 101 },
        { name: "Movie/BD-R", value: 89 },
        { name: "Movie/BD-Rip", value: 90 },
        { name: "Movie/Cam", value: 96 },
        { name: "Movie/DVD-R", value: 6 },
        { name: "Movie/HD/Bluray", value: 48 },
        { name: "Movie/Kids", value: 54 },
        { name: "Movie/MP4", value: 62 },
        { name: "Movie/Non-English", value: 38 },
        { name: "Movie/Packs", value: 68 },
        { name: "Movie/Web-DL", value: 20 },
        { name: "Movie/x265", value: 100 },
        { name: "Movie/Xvid", value: 7 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/TV",
      key: "category_tv",
      options: [
        { name: "Documentaries", value: 26 },
        { name: "Sports", value: 55 },
        { name: "TV/480p", value: 78 },
        { name: "TV/BD", value: 23 },
        { name: "TV/DVD-R", value: 24 },
        { name: "TV/DVD-Rip", value: 25 },
        { name: "TV/Mobile", value: 66 },
        { name: "TV/Non-English", value: 82 },
        { name: "TV/Packs", value: 65 },
        { name: "TV/Packs/Non-English", value: 83 },
        { name: "TV/SD/x264", value: 79 },
        { name: "TV/Web-DL", value: 22 },
        { name: "TV/x264", value: 5 },
        { name: "TV/x265", value: 99 },
        { name: "TV/Xvid", value: 4 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Games",
      key: "category_games",
      options: [
        { name: "Games/Mixed", value: 2 },
        { name: "Games/Nintendo", value: 47 },
        { name: "Games/PC-ISO", value: 43 },
        { name: "Games/PC-Rip", value: 45 },
        { name: "Games/Playstation", value: 71 },
        { name: "Games/Wii", value: 50 },
        { name: "Games/Xbox", value: 44 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Music",
      key: "category_music",
      options: [
        { name: "Music/Audio", value: 3 },
        { name: "Music/Flac", value: 80 },
        { name: "Music/Packs", value: 93 },
        { name: "Music/Video", value: 37 },
        { name: "Podcast", value: 21 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Miscellaneous",
      key: "category_miscellaneous",
      options: [
        { name: "Anime", value: 60 },
        { name: "Appz", value: 1 },
        { name: "Appz/Non-English", value: 86 },
        { name: "AudioBook", value: 64 },
        { name: "Books", value: 35 },
        { name: "Books/Non-English", value: 102 },
        { name: "Comics", value: 94 },
        { name: "Educational", value: 95 },
        { name: "Fonts", value: 98 },
        { name: "Mac", value: 69 },
        { name: "Magazines / Newspapers", value: 92 },
        { name: "Mobile", value: 58 },
        { name: "Pics/Wallpapers", value: 36 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/XXX",
      key: "category_xxx",
      options: [
        { name: "XXX/Magazines", value: 85 },
        { name: "XXX/Movie", value: 8 },
        { name: "XXX/Movie/0Day", value: 81 },
        { name: "XXX/Packs", value: 91 },
        { name: "XXX/Pics/Wallpapers", value: 84 },
      ],
      ...categoryPart,
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/t",
    },
    selectors: {
      rows: {
        selector: [
          "table#torrents > tbody > tr",
          "table.torrents > tbody > tr",
          "table > tbody > tr:has(td.al)",
          "tr:has(td.al)",
        ],
      },
      id: {
        selector: " > td.al > a",
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/\/t\/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : "";
          },
        ],
      },
      title: { selector: " > td.al > a" },
      subTitle: {
        selector: "div.sub",
        filters: [
          (query: string) => {
            if (/ \| /.test(query)) {
              return query.split(" | ")[0];
            }
            return "";
          },
        ],
      },
      url: { selector: " > td.al > a", attr: "href" },
      link: { selector: 'a[href*="/download.php"]', attr: "href" },
      time: {
        selector: "div.sub",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(?:\| )?([\d.]+ .+? ago)/);
            return queryMatch && queryMatch.length >= 2 ? parseTimeToLive(queryMatch[1]) : "";
          },
        ],
      },
      size: {
        selector: ["> td:nth-child(6)", "td:contains('MB')", "td:contains('GB')", "td:contains('TB')"],
        filters: [{ name: "parseSize" }],
      },
      author: {
        selector: "div.sub",
        filters: [
          (query: string) => {
            if (query.includes(" by ")) {
              const queryMatch = query.match(/by (.+)$/);
              return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
            }
            return "";
          },
        ],
      },
      category: { selector: ["td:eq(0) img", "td:first-child img"], attr: "alt" },
      seeders: {
        selector: ["td:nth-last-child(2)", "td:contains('seeders')", "td.seeders"],
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: ["td:nth-last-child(1)", "td:contains('leechers')", "td.leechers"],
        filters: [{ name: "parseNumber" }],
      },
      completed: {
        selector: ["td:nth-last-child(3)", "td:contains('snatched')", "td.completed"],
        filters: [{ name: "parseNumber" }],
      },
      /**
       * 部分用戶可能开启 “Torrents - Show files count”，此时在 Size 和 Snatched (即 completed ) 中间会添加 文件数 列，
       * 所以对于 seeders， leechers， completed 应该从后往前取，
       * 而 size，comments 应该从前往后取
       */
      comments: {
        selector: "> td:nth-child(5)",
        filters: [(q: string) => q.replace(/Go ?to ?comments/, "")],
      },
      tags: [
        { name: "Free", selector: "span.free" },
        { name: "Free", selector: "span.t_tag_free_leech" },
      ],
    },
  },

  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: ["a[href*='/u/']:first", "a[href*='userdetails.php']:first"],
            attr: "href",
            switchFilters: {
              "a[href*='/u/']:first": [
                (query: string) => {
                  const queryMatch = query.match(/u\/(.+)/);
                  return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : "";
                },
              ],
              "a[href*='userdetails.php']:first": [{ name: "querystring", args: ["id"] }],
            },
          },
        },
      },
      {
        requestConfig: { url: "/user.php" },
        assertion: { id: "params.u" },
        selectors: {
          messageCount: {
            selector: ["td[style*='background: red'] a[href*='messages.php']"],
            filters: [{ name: "parseNumber" }],
          },
          name: {
            selector: "h1.c0",
          },
          uploaded: {
            selector: [
              "th:contains('Uploaded') + td",
              "td:contains('Uploaded')",
              "tr:contains('Uploaded') td:last-child",
              "table tr:has(th:contains('Uploaded')) td:last-child",
            ],
            filters: [parseIPTorrentsStats],
          },
          downloaded: {
            selector: [
              "th:contains('Downloaded') + td",
              "td:contains('Downloaded')",
              "tr:contains('Downloaded') td:last-child",
              "table tr:has(th:contains('Downloaded')) td:last-child",
            ],
            filters: [parseIPTorrentsStats],
          },
          ratio: {
            selector: [
              "th:contains('Share ratio') + td",
              "td:contains('Share ratio')",
              "tr:contains('Share ratio') td:last-child",
            ],
            filters: [{ name: "parseNumber" }],
          },
          levelName: {
            selector: "th:contains('Class') + td",
          },
          bonus: {
            selector: "a[href='/mybonus.php']",
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: "th:contains('Join date') + td",
            filters: [(query: string) => query.split(" (")[0], { name: "parseTime" }],
          },
          seeding: {
            selector: "th:contains('Seeding') + td",
            filters: [{ name: "parseNumber" }],
          },
          seedingSize: {
            selector: "body",
            filters: [() => "N/A"],
          },
          invites: {
            selector: [
              // 🎯 精确匹配IPTorrents的"Available:"格式（基于实际HTML结构）
              "th:contains('Invites') + td",
              "tr:has(th:contains('Invites')) td",
              "td:contains('Available:')",

              // 🔍 备选匹配格式
              "th:contains('Available') + td",
              "td:contains('Available')",
              "tr:contains('Available') td:last-child",
            ],
            filters: [parseIPTorrentsInvites],
          },
        },
      },
    ],
  },
};
