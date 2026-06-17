import { bD as n } from "../index-COeZNva1.js";
import { p as l } from "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
const s = {
    ROWS: ["table#torrents > tbody > tr:has(td.al)"],
    SIZE: ["> td:nth-child(6)", "td:contains('MB')", "td:contains('GB')", "td:contains('TB')"],
    SEEDERS: ["td:nth-last-child(2)", "td:contains('seeders')", "td.seeders"],
    LEECHERS: ["td:nth-last-child(1)", "td:contains('leechers')", "td.leechers"],
    COMPLETED: ["td:nth-last-child(3)", "td:contains('snatched')", "td.completed"],
    CATEGORY: ["td:eq(0) img", "td:first-child img"],
  },
  t = {
    cross: { mode: "custom" },
    generateRequestConfig: (a) => {
      const e = { requestConfig: { params: {} } };
      return (
        a.forEach((r) => {
          n(e, `requestConfig.params.${r}`, "");
        }),
        e
      );
    },
  },
  p = {
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
        ...t,
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
        ...t,
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
        ...t,
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
        ...t,
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
        ...t,
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
        ...t,
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
        ...t,
      },
    ],
    search: {
      keywordPath: "params.q",
      requestConfig: { url: "/t" },
      requestDelay: 1e3,
      selectors: {
        rows: { selector: s.ROWS },
        id: {
          selector: " > td.al > a",
          attr: "href",
          filters: [
            (a) => {
              const e = a.match(/\/t\/(\d+)/);
              return e && e.length >= 2 ? parseInt(e[1]) : "";
            },
          ],
        },
        title: { selector: " > td.al > a" },
        subTitle: { selector: "div.sub", filters: [(a) => (/ \| /.test(a) ? a.split(" | ")[0] : "")] },
        url: { selector: " > td.al > a", attr: "href" },
        link: { selector: 'a[href*="/download.php"]', attr: "href" },
        time: {
          selector: "div.sub",
          filters: [
            (a) => {
              const e = a.match(/(?:\| )?([\d.]+ .+? ago)/);
              return e && e.length >= 2 ? l(e[1]) : "";
            },
          ],
        },
        size: { selector: s.SIZE, filters: [{ name: "parseSize" }] },
        author: {
          selector: "div.sub",
          filters: [
            (a) => {
              if (a.includes(" by ")) {
                const e = a.match(/by (.+)$/);
                return e && e.length >= 2 ? e[1] : "";
              }
              return "";
            },
          ],
        },
        category: { selector: s.CATEGORY, attr: "alt" },
        seeders: { selector: s.SEEDERS, filters: [{ name: "parseNumber" }] },
        leechers: { selector: s.LEECHERS, filters: [{ name: "parseNumber" }] },
        completed: { selector: s.COMPLETED, filters: [{ name: "parseNumber" }] },
        comments: { selector: "> td:nth-child(5)", filters: [(a) => a.replace(/Go ?to ?comments/, "")] },
        tags: [{ name: "Free", selector: "span.free, span.t_tag_free_leech" }],
      },
    },
    list: [
      {
        urlPattern: ["/t"],
        excludeUrlPattern: ["/t/\\d+", "/torrent\\.php\\?id=\\d+"],
        selectors: {
          title: {
            selector: " > td.al > a",
            elementProcess: (a) => (
              a.querySelectorAll("div.tTip").forEach((e) => e.remove()),
              a.innerText || a.textContent
            ),
          },
        },
      },
      {
        urlPattern: ["/indexipt\\.php"],
        selectors: {
          size: {
            selector: "div.ar.c3",
            filters: [{ name: "split", args: ["|", 0] }, { name: "trim" }, { name: "parseSize" }],
          },
          time: {
            selector: "span.elapsedDate",
            attr: "title",
            filters: [{ name: "parseTime", args: ["EEEE, MMMM d, yyyy 'at' h:mmaa"] }],
          },
          seeders: { selector: "> td:nth-child(5)" },
          leechers: { selector: "> td:nth-child(6)" },
          completed: { selector: "> td:nth-child(7)" },
          comments: { selector: "> td:nth-child(8)" },
        },
      },
    ],
    detail: {
      urlPattern: ["/t/\\d+", "/torrent\\.php\\?id=\\d+"],
      selectors: {
        title: { selector: "div.dBox > h2" },
        link: { selector: "div.info a[href*='download.php']", attr: "href" },
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
                  (a) => {
                    const e = a.match(/u\/(.+)/);
                    return e && e.length >= 2 ? parseInt(e[1]) : "";
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
              text: 0,
              selector: ["td[style*='background: red'] a[href*='messages.php']"],
              filters: [{ name: "parseNumber" }],
            },
            name: { selector: "h1.up-username" },
            uploaded: { selector: "div[style*='up-stat-up'] ~ div.up-stat-sub", filters: [{ name: "parseNumber" }] },
            downloaded: {
              selector: "div[style*='up-stat-down'] ~ div.up-stat-sub",
              filters: [{ name: "parseNumber" }],
            },
            ratio: { selector: "div.up-stat-value:has(svg.up-ratio-icon) > span", filters: [{ name: "parseNumber" }] },
            levelName: { selector: "span.up-class-badge" },
            bonus: { selector: "a[href='/mybonus.php']", filters: [{ name: "parseNumber" }] },
            joinTime: {
              selector: "span.up-field-label:contains('Join Date') + span span.elapsedDate",
              attr: "title",
              filters: [{ name: "parseTime", args: ["EEEE, MMMM d, yyyy 'at' h:mmaa"] }],
            },
            lastAccessAt: {
              selector: "span.up-field-label:contains('Last Seen') + span span.elapsedDate",
              attr: "title",
              filters: [{ name: "parseTime", args: ["EEEE, MMMM d, yyyy 'at' h:mmaa"] }],
            },
            seeding: {
              selector: "span.up-field-label:contains('Seeding') + span a[href^='/peers']",
              filters: [{ name: "parseNumber" }],
            },
            uploads: { selector: "span a[href^='/t?u=']" },
            seedingSize: { text: "N/A" },
            invites: { text: 0, selector: ["a.tTipWrap[href='/invite.php'] > b"], filters: [{ name: "parseNumber" }] },
            isDonor: { text: !1, selector: "h1.up-username > img[alt='Donor']", elementProcess: () => !0 },
          },
        },
      ],
    },
    levelRequirements: [
      { id: 0, name: "Peasant" },
      { id: 1, name: "User" },
      {
        id: 2,
        name: "Power User",
        interval: "P4W",
        uploaded: "50GB",
        downloaded: "5GB",
        ratio: 1.05,
        privilege: "Are able to make requests for torrents, view the Top 10, and apply for Uploader status.",
      },
      { id: 3, name: "VIP", groupType: "vip", privilege: "Immune from H&R." },
    ],
  };
export { p as siteMetadata };
