/**
 * TODO： 限时免费标签 https://github.com/ronggang/PT-Plugin-Plus/commit/828bfa956538985726402ac774459506a2df0c2b#diff-ad10712862bc6ca7e4b5261f8b90f6de21e7444346d6f3fab311f44f2d2a1032R360-R374
 */
import { ISiteMetadata, ETorrentStatus } from "../types";
import { parseSizeString } from "../utils";

export const siteMetadata: ISiteMetadata = {
  name: "LemonHD",
  timezoneOffset: "+0800",
  schema: "NexusPHP",
  type: "private",
  url: "https://lemonhd.org/",
  description: "LemonHD",
  tags: ["影视", "综合"],
  formerHosts: ["leaguehd.com"],
  collaborator: ["enigmaz", "timyuan"],
  search: {
    requestConfig: {
      params: {
        stype: "s", // 强行更改输出类型为 NexusPHP
      },
    },
    categories: [
      {
        name: "搜索入口",
        key: "#changePath",
        options: [
          { name: "全站", value: "/torrents.php" },
          { name: "电影", value: "/torrents_movie.php" },
          { name: "电视综艺", value: "/torrents_tv.php" },
          { name: "音乐", value: "/torrents_music.php" },
          { name: "动漫", value: "/torrents_animate.php" },
          { name: "MV", value: "/torrents_mv.php" },
          { name: "纪录片", value: "/torrents_doc.php" },
          { name: "其他", value: "/torrents_other.php" },
        ],
      },
    ],
    advanceKeyword: {
      imdb: {
        transformer: (config) => {
          config.params.search_area = "imdb"; // params "&search_area=imdb"
          return config;
        },
      }
    },
    selectors: {
      id: {
        selector: ['> td:eq(1) a[href*="id="]:first'],
      },
      url: {
        selector: ['> td:eq(1) a[href^="details"][href*="id="]:first'],
        filters: [], // 覆盖掉NPHP默认的处理方式，因为该站点没有办法通过 /details.php?id=xxxx 的方式访问到种子
      },
      link: {
        selector: ['> td:eq(1) a[href^="download.php"][href*="id="]:first'],
      },
      category: {
        selector: ["> td:eq(0) > img"],
        attr: "class",
        filters: [(query: string) => query.replace("cat_", "")],
        elementProcess: null, // 覆盖掉NPHP默认的处理方式
      },
      progress: {
        selector: ["> td:eq(9)"],
        filters: [(query: string) => (query === "--" ? 0 : parseFloat(query))],
      },
      status: {
        selector: ["> td:eq(9)"],
        elementProcess: (element: HTMLElement) => {
          const query = element.innerText.trim(); // 100% or --
          if (query === "--") {
            return ETorrentStatus.unknown;
          } else if (element.classList.contains("peer-active")) {
            return parseFloat(query) > 100 ? ETorrentStatus.seeding : ETorrentStatus.downloading;
          } else {
            return parseFloat(query) > 100 ? ETorrentStatus.completed : ETorrentStatus.inactive;
          }
        },
      },
    },
  },
  userInfo: {
    selectors: {
      seeding: {
        selector: ["td.rowfollow:contains('总做种数')"], // 这里站点并没有i18n，所以就先这样
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            const queryMatch = query.match(/(?:总做种数|seeding).+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },
      seedingSize: {
        selector: ["td.rowfollow:contains('总做种数')"],
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            const queryMatch = query.match(/(?:总做种体积|seedingSize).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          },
        ],
      },
    },
  },
};
