import {
  type IAdvancedSearchRequestConfig,
  type ISearchCategories,
  type ISiteMetadata,
  type TSelectSearchCategoryValue,
} from "../types";
import { parseTimeToLive } from "../utils";
import { set } from "es-toolkit/compat";

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
      rows: { selector: "table#torrents > tbody > tr" },
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
      size: { selector: "> td:nth-child(6)" },
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
      category: { selector: "td:eq(0) img", attr: "alt" },
      seeders: { selector: "td:nth-last-child(2)" },
      leechers: { selector: "td:nth-last-child(1)" },
      completed: { selector: "td:nth-last-child(3)" },
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
            selector: "th:contains('Uploaded') + td",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "th:contains('Downloaded') + td",
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "th:contains('Share ratio') + td",
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
            text: "N/A",
          },
        },
      },
    ],
  },
};
