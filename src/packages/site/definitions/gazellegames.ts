import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "GGN",
  timezoneOffset: "+0000",
  description: "Game",
  url: "https://gazellegames.net/",
  tags: ["Game"],
  schema: "Gazelle",
  type: "private",
  collaborator: ["ted423"],
  search: {
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
    selectors: {
      time: { selector: "> td:eq(1)" },
      size: { selector: "> td:eq(3)" },
      seeders: { selector: "> td:eq(5)" },
      leechers: { selector: "> td:eq(6)" },
      completed: { selector: "> td:eq(4)" },
      comments: { text: 0 },
      author: { selector: "> td:eq(2)" },

      category: {
        selector: ":self",
        elementProcess: (element: HTMLElement) => {
          let groupElement = element;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            groupElement = groupElement.previousElementSibling as HTMLElement;
            if (!groupElement || groupElement.classList.contains("group")) {
              break;
            }
          }

          if (groupElement && groupElement.querySelector("td.cats_col > div[title]")) {
            return groupElement
              .querySelector("td.cats_col > div[title]")!
              .getAttribute("title")!;
          } else {
            return "Other";
          }
        },
      },

      progress: {
        selector: ":self",
        case: {
          "#color_seeding, #color_snatched": 100,
          "#color_leeching, #color_downloaded": 0,
        },
      },
      status: {
        selector: ":self",
        case: {
          "#color_seeding": ETorrentStatus.seeding,
          "#color_snatched": ETorrentStatus.completed,
          "#color_leeching": ETorrentStatus.downloading,
          "#color_downloaded": ETorrentStatus.inactive,
        },
      },
    },
  },
  userInfo: {
    selectors: {
      // "page": "/index.php",
      messageCount: {
        selector: [".newnoti"],
      },

      // "page": "/user.php?id=$user.id$",
      uploaded: {
        selector: ["#upload .stat.tooltip"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["#download .stat.tooltip"],
        filters: [{ name: "parseSize" }],
      },
      bonus: {
        selector: ["#gold .stat.tooltip"],
      },
      joinTime: {
        selector: [".box_personal_history ul.stats li:nth-child(2) span.time"],
      },
      seeding: {
        selector: ["#seeding"],
      },
      seedingSize: {
        selector: ["#seeding_size"],
        filters: [{ name: "parseSize" }],
      },
    },
  },
};
