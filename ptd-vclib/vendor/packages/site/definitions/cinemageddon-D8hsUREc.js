import { S as t } from "../index-COeZNva1.js";
import { p as i } from "../utils/filesize-D_1hx4u8.js";
const s = {
    1: "Action",
    2: "Horror",
    3: "Martial Arts",
    4: "Comedy",
    5: "Other",
    6: "Hidden Gems",
    7: "Sci-Fi",
    8: "Gore",
    9: "Exploitation",
    11: "OST",
    12: "XXX",
    13: "Thriller",
    14: "Adventure",
    15: "Documentary",
    16: "Western",
    17: "Family",
    18: "Drama",
    19: "Ebooks",
    20: "Softcore",
    21: "Tinfoil Hat",
    22: "Trailers",
  },
  c = {
    version: 1,
    id: "cinemageddon",
    name: "Cinemageddon",
    description: "Cinemageddon is a Private Torrent Tracker for B-movies",
    tags: ["影视"],
    timezoneOffset: "-0700",
    collaborator: ["DXV5"],
    type: "private",
    urls: ["https://cinemageddon.net/"],
    category: [
      {
        name: "Category",
        key: "c",
        options: Object.entries(s).map(([e, r]) => ({ value: Number(e), name: r })),
        cross: { mode: "append" },
      },
    ],
    search: {
      keywordPath: "params.search",
      requestConfig: { url: "/browse.php", params: { proj: 0 } },
      advanceKeywordParams: { imdb: { enabled: !0 } },
      selectors: {
        rows: { selector: 'table.torrenttable > tbody > tr:has(a[href*="browse.php?cat="])' },
        id: { selector: 'a[href*="details.php?id="]', attr: "href", filters: [{ name: "querystring", args: ["id"] }] },
        title: { selector: 'a[href*="details.php?id="]' },
        url: { selector: 'a[href*="details.php?id="]', attr: "href" },
        link: { selector: 'a[href*="download.php?id="]', attr: "href" },
        time: {
          selector: "td:nth-child(4)",
          filters: [
            { name: "append", args: [" -07:00"] },
            { name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss XXX"] },
          ],
        },
        size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
        author: { selector: "td:eq(8)" },
        category: {
          selector: 'a[href*="browse.php?cat="]',
          attr: "href",
          filters: [{ name: "querystring", args: ["cat"] }, (e) => s[Number(e)] || "Other"],
        },
        seeders: { selector: "td:nth-child(7)" },
        leechers: { selector: "td:nth-child(8)" },
        completed: { selector: "td:nth-child(6)" },
        ext_imdb: { selector: 'a[href*="imdb.com/title/"]', attr: "href" },
        tags: [
          { selector: 'img[src$="/golden10.gif"]', name: "2xFree" },
          { selector: 'img[src$="/golden1.gif"]', name: "grey coin" },
          { selector: 'img[src$="/golden2.gif"]', name: "silver coin" },
          { selector: 'img[src$="/golden3.gif"]', name: "gold coin" },
        ],
      },
    },
    userInfo: {
      pickLast: ["id", "name"],
      process: [
        {
          requestConfig: { url: "/" },
          selectors: {
            id: {
              selector: ".statusbar a[href*='/userdetails.php?id=']",
              attr: "href",
              filters: [{ name: "querystring", args: ["id"] }],
            },
            name: { selector: ".statusbar a[href*='/userdetails.php?id=']" },
          },
        },
        {
          requestConfig: { url: "/userdetails.php" },
          assertion: { id: "params.id" },
          selectors: {
            uploaded: {
              selector: ["td.clx > .frames td.rowhead:contains('Uploaded') + td:first"],
              filters: [{ name: "parseSize" }],
            },
            downloaded: {
              selector: ["td.clx > .frames td.rowhead:contains('Downloaded') + td:first"],
              filters: [{ name: "parseSize" }],
            },
            levelName: { selector: "td.clx > .frames td.rowhead:contains('Class') + td:first" },
            messageCount: { selector: ["div.alert a[href*='messages.php']"], filters: [{ name: "parseNumber" }] },
            bonus: { selector: ["a[href='/credits.php']"], filters: [{ name: "parseNumber" }] },
            joinTime: {
              selector: "td.clx > .frames td.rowhead:contains('Join') + td:first",
              filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
            },
            seeding: { selector: ["div#ka2 table:first"], elementProcess: (e) => t("tr:gt(0)", e).length },
            seedingSize: {
              selector: ["div#ka2 table:first tr:not(:eq(0))"],
              elementProcess: (e) => {
                let r = 0;
                return (
                  t("tr:gt(0)", e).forEach((a) => {
                    const o = t("td:eq(2)", a);
                    r += i(o[0].innerText.trim());
                  }),
                  r
                );
              },
            },
          },
        },
      ],
    },
    levelRequirements: [
      {
        id: 1,
        name: "Power User",
        uploaded: "25GB",
        downloaded: "20GB",
        ratio: 1.2,
        privilege: "Maximum of 8 concurrent downloads",
      },
      {
        id: 2,
        name: "CG Superfan",
        uploaded: "200GB",
        downloaded: "20GB",
        ratio: 1.5,
        privilege: "Maximum of 12 concurrent downloads",
      },
    ],
  };
export { c as siteMetadata };
