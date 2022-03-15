import { ISiteMetadata, ETorrentStatus } from "../types";
import { parseSizeString } from "../utils";

export const siteMetadata: ISiteMetadata = {
  name: "PTer",
  timezoneOffset: "+0800",
  description: "PT之友俱乐部",
  url: "https://pterclub.com/",
  tags: ["影视", "综合"],
  schema: "NexusPHP",
  type: "private",
  formerHosts: ["pter.club"],
  search: {
    selectors: {
      title: {
        selector: ["a[href*='details.php?id='][title]:first"],
      },
      subTitle: {
        selector: ["a[href*='details.php?id='][title]:first"],
        elementProcess: (element: HTMLElement) => {
          let subTitle = "";
          const lastSibling = element.parentElement!.lastChild;
          if (lastSibling?.nodeName === "#text") {
            subTitle = lastSibling.textContent || subTitle;
          }
          return subTitle.trim();
        },
      },

      /**
       * <img class="progbargreen" src="pic/trans.gif" style="width: 98%;" alt="">  正在做种
       * <img class="progbarred" src="pic/trans.gif" style="width: 98%;" alt="">   已下载，未做种
       * <img class="progbarred" src="pic/trans.gif" style="width: 5.9407952394121%;" alt=""><img class="progbarrest" src="pic/trans.gif" style="width: 92.059204760588%;" alt="">   正在下载，需修正下载进度
       * <img class="progbarrest" src="pic/trans.gif" style="width: 98%;" alt="">  正在下载，但是无进度
       */
      progress: {
        selector: ['img[class^="progbar"][style*="width"]:first'],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("progbargreen")) {
            return 100;
          } else if (
            element.classList.contains("progbarred") ||
            element.classList.contains("progbarred")
          ) {
            const elementStyle = element.getAttribute("style") || "";
            const widthMatch = elementStyle.match(/width:([ \d.]+)%/);
            const progress =
              widthMatch && widthMatch.length >= 2
                ? (parseFloat(widthMatch[1]) / 98) * 100 /* 修正下载进度 */
                : 0;
            return element.classList.contains("progbarred")
              ? progress
              : 100 - progress; // 如果是 .progbarred 则代表已完成进度，而 .progbarred 则为未完成进度，取反
          } else {
            return 0;
          }
        },
      },
      status: {
        selector: ['img[class^="progbar"][style*="width"]:first'],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("progbargreen")) {
            return ETorrentStatus.seeding;
          } else if (
            element.classList.contains("progbarred") ||
            element.classList.contains("progbarred")
          ) {
            const widthMatch = (element.getAttribute("style") || "").match(
              /width:([ \d.]+)%/
            );
            const progress =
              widthMatch && widthMatch.length >= 2
                ? (parseFloat(widthMatch[1]) / 98) * 100
                : 0;
            const realProgress = element.classList.contains("progbarred")
              ? progress
              : 100 - progress;
            // FIXME 不能判断是否在下载状态，所以直接设成 inactive
            return realProgress >= 100
              ? ETorrentStatus.completed
              : ETorrentStatus.inactive;
          } else {
            return ETorrentStatus.unknown;
          }
        },
      },
      tags: [
        {
          name: "Excl.",
          selector: "a[href*='torrents.php?tag_exclusive=yes']",
        },
      ],
    },
  },
  userInfo: {
    selectors: {
      bonus: {
        selector: [
          "td.rowhead:contains('猫粮') + td, td.rowhead:contains('Karma Points') + td, td.rowhead:contains('貓糧') + td",
        ],
      },
      // 从顶端用户栏获取做种数量，这样就可以避免对 /getusertorrentlist.php 页面的请求
      seeding: {
        selector: [
          "#info_block a[href*='getusertorrentlist.php'][href*='type=seeding']",
        ],
        filters: [parseInt],
      },
      seedingSize: {
        selector: [
          "td.rowhead:contains('做种大小') + td, td.rowhead:contains('Seeding Size') + td, td.rowhead:contains('做種大小') + td",
        ],
        filters: [parseSizeString],
      },
    },
  },
};
