import type { ISiteMetadata, ITorrent } from "../types";
import { parseSizeString } from "../utils/filesize";
import PrivateSite from "../schemas/AbstractPrivateSite";

export const siteMetadata: ISiteMetadata = {
  id: "gtru",
  version: 1,
  name: "GayTorrent.ru",
  tags: ["成人"],
  type: "private",
  timezoneOffset: "+0800",
  urls: ["uggcf://jjj.tnlgbe.erag/"],
  legacyUrls: ["https://www.gaytorrent.ru/"],

  userInputSettingMeta: [
    {
      name: "passkey",
      label: "Passkey",
      hint: "用于搜索结果下载种子，可在 userdetails 页面的 Announce Url 中找到",
      required: false,
    },
  ],

  category: [
    {
      name: "Status",
      key: "incldead",
      options: [
        { name: "Active", value: 0 },
        { name: "Including dead", value: 1 },
        { name: "Only dead", value: 2 },
      ],
    },
    {
      name: "Category",
      key: "cat",
      options: [
        { name: "AI", value: 69 },
        { name: "Amateur", value: 62 },
        { name: "Anal", value: 29 },
        { name: "Anime Games", value: 46 },
        { name: "Asian", value: 30 },
        { name: "Bareback", value: 43 },
        { name: "BDSM", value: 19 },
        { name: "Bears", value: 17 },
        { name: "Bisexual", value: 59 },
        { name: "Black", value: 44 },
        { name: "Books & Magazines", value: 50 },
        { name: "Chubbies", value: 9 },
        { name: "Clips", value: 7 },
        { name: "Comic & Yaoi", value: 48 },
        { name: "Daddies / Sons", value: 5 },
        { name: "Dildos", value: 67 },
        { name: "Fan Sites", value: 66 },
        { name: "Fetish", value: 34 },
        { name: "Fisting", value: 68 },
        { name: "Grey / Older", value: 27 },
        { name: "Group-Sex", value: 32 },
        { name: "Homemade", value: 63 },
        { name: "Hunks", value: 12 },
        { name: "Images", value: 33 },
        { name: "Interracial", value: 53 },
        { name: "Jocks", value: 57 },
        { name: "Latino", value: 35 },
        { name: "Mature", value: 36 },
        { name: "Media Programs", value: 58 },
        { name: "Member", value: 37 },
        { name: "Middle Eastern", value: 54 },
        { name: "Military", value: 38 },
        { name: "Oral-Sex", value: 39 },
        { name: "Softcore", value: 56 },
        { name: "Solo", value: 40 },
        { name: "Straight older", value: 61 },
        { name: "Straight younger", value: 60 },
        { name: "Themed Movie", value: 45 },
        { name: "Trans", value: 47 },
        { name: "Trans/FTM", value: 70 },
        { name: "TV / Episodes", value: 1 },
        { name: "Twinks", value: 41 },
        { name: "Vintage", value: 42 },
        { name: "Voyeur", value: 51 },
        { name: "Wrestling and Sports", value: 65 },
        { name: "Youngblood", value: 28 },
      ],
      cross: { mode: "append", key: "c" },
    },
    {
      name: "Sort by",
      key: "orderby",
      options: [
        { name: "Upload-Date", value: "added" },
        { name: "Torrent-Name", value: "name" },
        { name: "Category", value: "type" },
        { name: "Size", value: "size" },
        { name: "Times Snatched", value: "snatched" },
        { name: "Seeders", value: "seeds" },
        { name: "Leechers", value: "leeches" },
      ],
    },
    {
      name: "Order",
      key: "sort",
      options: [
        { name: "Descending", value: "desc" },
        { name: "Ascending", value: "asc" },
      ],
    },
  ],

  search: {
    requestConfig: {
      url: "/browse.php",
      params: { incldead: 1, search: "" },
    },
    keywordPath: "params.search",
    selectors: {
      rows: {
        selector: "table.browse_result tr:has(div.browsedesc)",
      },
      id: {
        selector: "div.browsedesc > a[href*='details.php']",
        attr: "href",
        filters: [(q: string) => q.match(/id=([a-f0-9]+)/)?.[1] ?? q],
      },
      title: { selector: "div.browsedesc > a[href*='details.php'] b" },
      url: { selector: "div.browsedesc > a[href*='details.php']", attr: "href" },
      link: { selector: "a.index[href*='download.php/']", attr: "href" },
      time: {
        selector: "div.tadded",
        elementProcess: (element: HTMLElement) => {
          const parts: string[] = [];
          element.childNodes.forEach((node) => {
            if (node.nodeType === 3) {
              const text = node.textContent?.trim();
              if (text) parts.push(text);
            }
          });
          return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0] || "";
        },
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] }],
      },
      size: { selector: "div.tsize", filters: [{ name: "parseSize" }] },
      completed: { selector: "div.tsnatch", filters: [{ name: "parseNumber" }] },
      seeders: {
        selector: "td:has(div.tsnatch) + td",
        elementProcess: (element: HTMLElement) => {
          const text = element.textContent || "";
          const match = text.match(/(\d+)\s*\/\s*\d+/);
          return match ? parseInt(match[1]) : 0;
        },
      },
      leechers: {
        selector: "td:has(div.tsnatch) + td",
        elementProcess: (element: HTMLElement) => {
          const text = element.textContent || "";
          const match = text.match(/\d+\s*\/\s*(\d+)/);
          return match ? parseInt(match[1]) : 0;
        },
      },
      category: { selector: "img.browsemaincatpic", attr: "alt" },
      comments: { selector: "div.tcomments", filters: [{ name: "parseNumber" }] },
    },
  },

  list: [
    {
      urlPattern: ["/search\\.php", "/browse\\.php"],
      selectors: {
        keywords: { selector: "input[name='search']", attr: "value" },
      },
    },
  ],

  detail: {
    urlPattern: ["/details\\.php\\?id=[a-f0-9]+"],
    selectors: {
      link: { selector: "a[href^='download.php/']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id"],

    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: "ul.navbar-right a[href*='userdetails.php?id=']",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          seeding: {
            selector: "span#activeseed",
            filters: [{ name: "parseNumber" }],
          },
          bonus: {
            selector: "span#bonus",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          name: {
            selector: "div[align='center'] font[color='white'][size='+1'] b",
          },
          uploaded: {
            selector: "td:contains('Uploaded') + td",
            filters: [(q: string) => q.split(/\s*\[/)[0].trim(), { name: "parseSize" }],
          },
          downloaded: {
            selector: "td:contains('Downloaded') + td",
            filters: [(q: string) => q.split(/\s*\[/)[0].trim(), { name: "parseSize" }],
          },
          ratio: {
            selector: "td:contains('Share ratio') + td td:first",
            filters: [{ name: "parseNumber" }],
          },
          levelName: {
            selector: "td:contains('Class') + td img",
            attr: "src",
            filters: [
              (q: string) => {
                const match = q.match(/\/([^/]+)\.\w+$/);
                const key = match ? match[1].toLowerCase() : "";
                const map: Record<string, string> = {
                  user: "User",
                  power: "PowerUser",
                  vip: "VIP",
                  mod: "Moderator",
                  sysop: "SysOp",
                  admin: "Admin",
                };
                return map[key] || key;
              },
            ],
          },
          joinTime: {
            selector: "td:contains('Join\u00a0date') + td",
            filters: [
              (q: string) => q.replace(/\s*\(.*\)\s*$/, "").trim(),
              { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] },
            ],
          },
          lastAccessAt: {
            selector: "td:contains('Last\u00a0seen') + td",
            filters: [
              (q: string) => q.replace(/\s*\(.*\)\s*$/, "").trim(),
              { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] },
            ],
          },
          uploads: {
            selector: "div#UploadedTorrents table.table",
            elementProcess: (element: HTMLElement) => {
              const rows = element.querySelectorAll("tr:has(td)");
              return rows.length;
            },
          },
          seedingSize: {
            selector: "div#SeedingTorrents table.table",
            elementProcess: (element: HTMLElement) => {
              let total = 0;
              const rows = element.querySelectorAll("tr:has(td)");
              rows.forEach((row) => {
                const sizeTd = row.querySelectorAll("td")[2];
                if (sizeTd) {
                  const text = (sizeTd.textContent || "").replace(/\s+/g, " ").trim();
                  total += parseSizeString(text);
                }
              });
              return total;
            },
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "PowerUser",
      interval: "P28D",
      uploaded: "40GB",
      ratio: 1.05,
    },
  ],
};

export default class Gtru extends PrivateSite {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const passkey = this.userConfig.inputSetting?.passkey ?? "";
    if (!passkey) {
      return "passkey未配置，请在站点设置中填写以启用下载";
    }
    const name = encodeURIComponent((torrent.title || torrent.id || "") + ".torrent");
    return `${this.url}download.php?id=${torrent.id}&rss=1&n=${name}&k=${passkey}`;
  }
}
