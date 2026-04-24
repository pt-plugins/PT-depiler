import { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  id: "gtorg",
  version: 2,
  name: "Gay-Torrents.Org",
  tags: ["成人"],
  type: "private",
  urls: ["https://gay-torrents.org/"],

  category: [
    {
      name: "Status",
      key: "active",
      options: [
        { name: "All", value: 0 },
        { name: "Active only", value: 1 },
        { name: "Dead only", value: 2 },
        { name: "Free", value: 3 },
        { name: "-50%", value: 4 },
        { name: "-25%", value: 5 },
        { name: "Packs", value: 6 },
      ],
    },
    {
      name: "Options",
      key: "options",
      options: [
        { name: "Title & Tag", value: 0 },
        { name: "Title & Desc.", value: 1 },
      ],
    },
    {
      name: "Category",
      key: "category",
      options: [
        { name: "Amateur", value: 15 },
        { name: "Anal", value: 16 },
        { name: "Animation", value: 42 },
        { name: "Asian", value: 18 },
        { name: "Bareback", value: 19 },
        { name: "Bears", value: 20 },
        { name: "Bisexual", value: 22 },
        { name: "Black", value: 21 },
        { name: "Chubs", value: 23 },
        { name: "Cross Generation", value: 25 },
        { name: "Doctor/Medical", value: 51 },
        { name: "Fan Sites", value: 71 },
        { name: "Fetish", value: 27 },
        { name: "Group Sex", value: 28 },
        { name: "Hunks", value: 30 },
        { name: "Interracial", value: 52 },
        { name: "Homo Erotic", value: 68 },
        { name: "Latino", value: 32 },
        { name: "Middle Eastern", value: 50 },
        { name: "Military", value: 33 },
        { name: "Oral-Sex", value: 34 },
        { name: "Other", value: 40 },
        { name: "Solo", value: 35 },
        { name: "Trans", value: 36 },
        { name: "Twinks", value: 37 },
        { name: "Vintage", value: 38 },
        { name: "Wrestling", value: 39 },
        { name: "Applications", value: 17 },
        { name: "Images", value: 31 },
        { name: "Books", value: 49 },
        { name: "Non-Porn", value: 41 },
      ],
      cross: { mode: "brackets", key: "category[]" },
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents_beta.php",
      params: { active: 0, options: 0 },
    },
    keywordPath: "params.search",
    selectors: {
      rows: { selector: "div.torrentsContainer > div.torrent" },
      id: {
        selector: "a.torrent_link",
        attr: "href",
        filters: [(q: string) => q.match(/id=([a-f0-9]+)/)?.[1] ?? q],
      },
      title: { selector: "a.torrent_link" },
      url: { selector: "a.torrent_link", attr: "href" },
      link: { selector: "a.downloadLink", attr: "href" },
      time: {
        selector: "div.date > div",
        filters: [
          (q: string) => q.replace(/^\s*on\s+/i, "").trim(),
          { name: "parseTime", args: ["HH:mm dd-MMM-yyyy"] },
        ],
      },
      size: { selector: "div.size", filters: [{ name: "parseSize" }] },
      seeders: { selector: "div.downloadPeers a.green", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "div.downloadPeers a.red", filters: [{ name: "parseNumber" }] },
      completed: {
        selector: "div.downloadTimes a",
        filters: [{ name: "parseNumber" }],
      },
      category: { selector: "div.categoryNew a" },
      tags: [
        { name: "Free", selector: "a.specsIn.Freee" },
        { name: "Pack", selector: "a.specsIn.Pack, span.specsIn.Pack" },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents_beta\\.php"],
      selectors: {
        keywords: { selector: "input[name='search']", attr: "value" },
      },
    },
  ],

  detail: {
    urlPattern: ["/details\\.php\\?id=[a-f0-9]+"],
    selectors: {
      link: { selector: "a[href*='download.php']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id"],

    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='usercp.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          bonus: {
            selector: ["a[href*='seedbonus']:first"],
            filters: [{ name: "parseNumber" }],
          },
          seeding: {
            selector: ["span[title='Seed']"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/usercp.php" },
        assertion: { id: "params.uid" },
        selectors: {
          name: {
            selector: "td:contains('User') + td",
          },
          levelName: {
            selector: ["td:contains('Rank') + td"],
          },
          downloaded: {
            selector: ["td:contains('Downloaded') + td"],
            filters: [{ name: "parseSize" }],
          },
          uploaded: {
            selector: ["td:contains('Uploaded') + td"],
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "td:contains('Ratio') + td",
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: ["td:contains('Joined on') + td"],
            filters: [
              (query: string) => {
                return query.includes(" ") ? query.split(" ")[0] : query;
              },
              { name: "parseTime" },
            ],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      ratio: 0.4,
    },
    {
      id: 2,
      name: "Poweruser",
      ratio: 1.05,
      uploaded: "50GB",
      privilege: "Access to: Online Users, Tracker info",
    },
    {
      id: 3,
      name: "Extrauser",
      ratio: 2,
      uploaded: "250GB",
      privilege: "Access to: Online Users, Tracker info, Requests, Top 10 and Users",
    },
  ],
};
