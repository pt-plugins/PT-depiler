import { type ISiteMetadata } from "../types";

const categoryOptions = [
  { name: "AudioBooks - Action/Adventure", value: 39 },
  { name: "AudioBooks - Art", value: 49 },
  { name: "AudioBooks - Biographical", value: 50 },
  { name: "AudioBooks - Business", value: 83 },
  { name: "AudioBooks - Computer/Internet", value: 51 },
  { name: "AudioBooks - Crafts", value: 97 },
  { name: "AudioBooks - Crime/Thriller", value: 40 },
  { name: "AudioBooks - Fantasy", value: 41 },
  { name: "AudioBooks - Food", value: 106 },
  { name: "AudioBooks - General Fiction", value: 42 },
  { name: "AudioBooks - General Non-Fic", value: 52 },
  { name: "AudioBooks - Historical Fiction", value: 98 },
  { name: "AudioBooks - History", value: 54 },
  { name: "AudioBooks - Home/Garden", value: 55 },
  { name: "AudioBooks - Horror", value: 43 },
  { name: "AudioBooks - Humor", value: 99 },
  { name: "AudioBooks - Instructional", value: 84 },
  { name: "AudioBooks - Juvenile", value: 44 },
  { name: "AudioBooks - Language", value: 56 },
  { name: "AudioBooks - Literary Classics", value: 45 },
  { name: "AudioBooks - Math/Science/Tech", value: 57 },
  { name: "AudioBooks - Medical", value: 85 },
  { name: "AudioBooks - Mystery", value: 87 },
  { name: "AudioBooks - Nature", value: 119 },
  { name: "AudioBooks - Philosophy", value: 88 },
  { name: "AudioBooks - Pol/Soc/Relig", value: 58 },
  { name: "AudioBooks - Recreation", value: 59 },
  { name: "AudioBooks - Romance", value: 46 },
  { name: "AudioBooks - Science Fiction", value: 47 },
  { name: "AudioBooks - Self-Help", value: 53 },
  { name: "AudioBooks - Travel/Adventure", value: 89 },
  { name: "AudioBooks - True Crime", value: 100 },
  { name: "AudioBooks - Urban Fantasy", value: 108 },
  { name: "AudioBooks - Western", value: 48 },
  { name: "AudioBooks - Young Adult", value: 111 },
  { name: "E-Books - Action/Adventure", value: 60 },
  { name: "E-Books - Art", value: 71 },
  { name: "E-Books - Biographical", value: 72 },
  { name: "E-Books - Business", value: 90 },
  { name: "E-Books - Comics/Graphic novels", value: 61 },
  { name: "E-Books - Computer/Internet", value: 73 },
  { name: "E-Books - Crafts", value: 101 },
  { name: "E-Books - Crime/Thriller", value: 62 },
  { name: "E-Books - Fantasy", value: 63 },
  { name: "E-Books - Food", value: 107 },
  { name: "E-Books - General Fiction", value: 64 },
  { name: "E-Books - General Non-Fiction", value: 74 },
  { name: "E-Books - Historical Fiction", value: 102 },
  { name: "E-Books - History", value: 76 },
  { name: "E-Books - Home/Garden", value: 77 },
  { name: "E-Books - Horror", value: 65 },
  { name: "E-Books - Humor", value: 103 },
  { name: "E-Books - Illusion/Magic", value: 115 },
  { name: "E-Books - Instructional", value: 91 },
  { name: "E-Books - Juvenile", value: 66 },
  { name: "E-Books - Language", value: 78 },
  { name: "E-Books - Literary Classics", value: 67 },
  { name: "E-Books - Magazines/Newspapers", value: 79 },
  { name: "E-Books - Math/Science/Tech", value: 80 },
  { name: "E-Books - Medical", value: 92 },
  { name: "E-Books - Mixed Collections", value: 118 },
  { name: "E-Books - Mystery", value: 94 },
  { name: "E-Books - Nature", value: 120 },
  { name: "E-Books - Philosophy", value: 95 },
  { name: "E-Books - Pol/Soc/Relig", value: 81 },
  { name: "E-Books - Recreation", value: 82 },
  { name: "E-Books - Romance", value: 68 },
  { name: "E-Books - Science Fiction", value: 69 },
  { name: "E-Books - Self-Help", value: 75 },
  { name: "E-Books - Travel/Adventure", value: 96 },
  { name: "E-Books - True Crime", value: 104 },
  { name: "E-Books - Urban Fantasy", value: 109 },
  { name: "E-Books - Western", value: 70 },
  { name: "E-Books - Young Adult", value: 112 },
  { name: "Musicology - Guitar/Bass Tabs", value: 19 },
  { name: "Musicology - Individual Sheet", value: 20 },
  { name: "Musicology - Individual Sheet MP3", value: 24 },
  { name: "Musicology - Instructional Book with Video", value: 126 },
  { name: "Musicology - Instructional Media - Music", value: 22 },
  { name: "Musicology - Lick Library - LTP/Jam With", value: 113 },
  { name: "Musicology - Lick Library - Techniques/QL", value: 114 },
  { name: "Musicology - Music - Complete Editions", value: 17 },
  { name: "Musicology - Music Book", value: 26 },
  { name: "Musicology - Music Book MP3", value: 27 },
  { name: "Musicology - Sheet Collection", value: 30 },
  { name: "Musicology - Sheet Collection MP3", value: 31 },
  { name: "Radio - Comedy", value: 127 },
  { name: "Radio - Drama", value: 130 },
  { name: "Radio - Factual/Documentary", value: 128 },
  { name: "Radio - Reading", value: 132 },
];

const commonDocumentSelectors = {
  id: { selector: "a[href*='/t/']", attr: "href", filters: [{ name: "parseNumber" }] },
  title: { selector: "a.torTitle" },
  url: { selector: "a.torTitle", attr: "href" },
  link: { selector: "a.directDownload", attr: "href" },
};

interface IMyAnonamouseLoadItem {
  count: number;
  red: boolean;
  size: number | null;
}

interface INotifs {
  pms: number;
  aboutToDropClient: number;
  tickets: number;
  waiting_tickets: number;
  requests: number;
  topics: number;
  unseededUploads: number;
}

type IMyAnonamouseLoadResp = {
  [K in
    | "inactHnr"
    | "inactSat"
    | "inactUnsat"
    | "leeching"
    | "sSat"
    | "seedHnr"
    | "seedUnsat"
    | "unsat"
    | "upAct"
    | "upInact"]: IMyAnonamouseLoadItem;
} & {
  notifs: INotifs;
};

// 做种中种子的所有类型
const seedingKeys = ["seedUnsat", "seedHnr", "sSat", "upAct"] as const;

// 已上传种子的所有类型
const uploadKeys = ["upAct", "upInact"] as const;

export const siteMetadata: ISiteMetadata = {
  id: "myanonamouse",
  version: 1,
  name: "MyAnonamouse",
  aka: ["MAM"],
  description: "Friendliness, Warmth and Sharing",
  tags: ["电子书", "有声书"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "TBDev",

  urls: ["uggcf://jjj.zlnabanzbhfr.arg/"],

  category: [
    {
      name: "主类别",
      key: "tor[main_cat]",
      options: [
        { name: "Audiobooks", value: 13 },
        { name: "E-Books", value: 14 },
        { name: "Musicology", value: 15 },
        { name: "Radio", value: 16 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "子类别",
      key: "tor[cat]",
      options: categoryOptions,
      cross: { mode: "brackets" },
    },
    {
      name: "种子类型",
      key: "tor[searchType]",
      options: [
        { name: "活种", value: "active" },
        { name: "死种", value: "inactive" },
        { name: "免费（含 VIP）", value: "fl-VIP" },
        { name: "免费（不含 VIP）", value: "fl" },
        { name: "VIP", value: "VIP" },
        { name: "非 VIP", value: "nVIP" },
      ],
    },
  ],

  search: {
    keywordPath: "params.tor[text]",
    requestConfig: {
      url: "/tor/js/loadSearchJSONbasic.php",
      responseType: "json",
      params: {
        "tor[srchIn][title]": true,
        "tor[srchIn][author]": true,
        "tor[srchIn][narrator]": true,
        "tor[searchIn]": "torrents",
        "tor[cat][]": 0,
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "data" },
      id: { selector: "id" },
      title: { selector: "title" },
      subTitle: { selector: "tags" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/t/"] }] },
      link: { selector: "id", filters: [{ name: "prepend", args: ["/tor/download.php?tid="] }] },
      time: { selector: "added" },
      size: { selector: "size" },
      author: { selector: "owner_name" },
      category: { selector: "catname" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      comments: { selector: "comments" },
      tags: [
        {
          name: "Free",
          selector: "free",
          color: "blue",
        },
        {
          name: "VIP",
          selector: "fl_vip",
          color: "yellow",
        },
        {
          name: "H&R",
          selector: "id", // 一个一定会出现的字段，这里用于添加 HR tag
          color: "red",
        },
      ],
    },
  },

  list: [
    {
      urlPattern: [/\/tor\/browse\.php(\?.*)?$/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "tr[id]" },
        ...commonDocumentSelectors,
      },
    },
    {
      urlPattern: [/\/stats\/top10Tor\.php(\?.*)?$/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "table.newTorTable > tbody > tr" },
        ...commonDocumentSelectors,
      },
    },
  ],

  detail: {
    urlPattern: [/\/t\/\d+(\?.*)?$/],
    selectors: {
      id: { selector: "input[name=tid]", attr: "value" },
      title: { selector: ".TorrentTitle" },
      link: { selector: "a.torFormButton", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: {
          url: "/jsonLoad.php?snatch_summary&notif",
          responseType: "json",
        },
        selectors: {
          id: { selector: "uid" },
          name: { selector: "username" },
          ratio: { selector: "ratio" },
          bonus: { selector: "seedbonus" },
          uploaded: { selector: "uploaded_bytes" },
          downloaded: { selector: "downloaded_bytes" },
          levelName: { selector: "classname" },
          seeding: {
            selector: ":self",
            filters: [
              (loadResp: IMyAnonamouseLoadResp) => {
                return seedingKeys.map((key) => loadResp[key].count).reduce((sum, count) => sum + count, 0);
              },
            ],
          },
          seedingSize: {
            selector: ":self",
            filters: [
              (loadResp: IMyAnonamouseLoadResp) => {
                return seedingKeys.map((key) => loadResp[key].size ?? 0).reduce((sum, size) => sum + size, 0);
              },
            ],
          },
          uploads: {
            selector: ":self",
            filters: [
              (loadResp: IMyAnonamouseLoadResp) => {
                return uploadKeys.map((key) => loadResp[key].count).reduce((sum, count) => sum + count, 0);
              },
            ],
          },
          messageCount: {
            selector: "notifs",
            filters: [
              (notifs: INotifs) => {
                return Object.values(notifs).reduce((sum, val) => sum + val, 0);
              },
            ],
          },
          lastAccessAt: { selector: "update", filters: [(query: number) => query * 1000] },
        },
      },
      {
        requestConfig: { url: "/u/$id$", responseType: "document" },
        assertion: { id: "url" },
        selectors: {
          joinTime: {
            selector: "td.rowhead:contains('Join'):contains('date') + td",
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
          trueDownloaded: {
            selector: "td.rowhead:contains('Real Downloaded') + td",
            filters: [{ name: "parseSize" }],
          },
          trueUploaded: {
            selector: "td.rowhead:contains('Real Uploaded') + td",
            filters: [{ name: "parseSize" }],
          },
          trueRatio: {
            selector: "td.rowhead:contains('Real share ratio') + td",
            filters: [{ name: "parseNumber" }],
          },
          bonusPerHour: {
            selector: "td.rowhead:contains('Points earning') + td",
            elementProcess: (element: any) => {
              if (!element || typeof element.innerText !== "string") return 0;
              const match = element.innerText.match(/worth\s+([\d.]+)\s+per hour/);
              if (!match || !match[1]) return 0;
              return parseFloat(match[1]);
            },
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Mouse",
    },
    {
      id: 2,
      name: "User",
      ratio: 1.0,
      privilege: "Receive 1 request per month; Can have 50 unsatisfied torrents at maximum",
    },
    {
      id: 3,
      name: "Power User",
      ratio: 2,
      uploaded: "25GB",
      interval: "P4W",
      privilege: "Receive 2 requests per month; Can have 100 unsatisfied torrents at maximum",
    },
    {
      id: 4,
      name: "VIP",
      privilege: "Receive 4 requests per month; Can have 150 unsatisfied torrents at maximum",
    },
  ],
};
