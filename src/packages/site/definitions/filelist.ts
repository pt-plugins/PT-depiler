import { type ISearchInput, type ISiteMetadata, type ITorrent, type ITorrentTag } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP.ts";
import { set } from "es-toolkit/compat";
import { parseSizeString, parseValidTimeString } from "@ptd/site";
import PrivateSite from "@ptd/site/schemas/AbstractPrivateSite.ts";

const linkQuery = {
  selector: ['a[href*="download.php?id="]:has(> img)'],
  attr: "href",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "filelist",
  name: "FileList",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "FileList",

  urls: ["uggcf://svyryvfg.vb/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "toate", value: 0 },
        { name: "Anime", value: 24 },
        { name: "Audio", value: 11 },
        { name: "Desene", value: 15 },
        { name: "Diverse", value: 18 },
        { name: "Docs", value: 16 },
        { name: "Filme 3D", value: 25 },
        { name: "Filme 4K", value: 6 },
        { name: "Filme 4K Blu-Ray", value: 26 },
        { name: "Filme Blu-Ray", value: 20 },
        { name: "Filme DVD", value: 2 },
        { name: "Filme DVD-RO", value: 3 },
        { name: "Filme HD", value: 4 },
        { name: "Filme HD-RO", value: 19 },
        { name: "Filme SD", value: 1 },
        { name: "FLAC", value: 5 },
        { name: "Jocuri Console", value: 10 },
        { name: "Jocuri PC", value: 9 },
        { name: "Linux", value: 17 },
        { name: "Mobile", value: 22 },
        { name: "Programe", value: 8 },
        { name: "RO Dubbed", value: 28 },
        { name: "Seriale 4K", value: 27 },
        { name: "Seriale HD", value: 21 },
        { name: "Seriale SD", value: 23 },
        { name: "Sport", value: 13 },
        { name: "Videoclip", value: 12 },
        { name: "XXX", value: 7 },
      ],
      cross: { mode: "comma" },
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.searchin", 1); // params "&search_area=4"
          return config!;
        },
      },
    },
    selectors: {
      rows: { selector: ".torrentrow" },
      link: linkQuery,
      url: {
        ...linkQuery,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/details.php?id="] },
        ],
      },
      id: {
        ...linkQuery,
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: ["a[href*='details.php']:has(>b)"],
        attr: "title",
      },
      subTitle: {
        text: "",
      },
      category: {
        selector: ["div:nth-child(1) img[alt]"],
        attr: "alt",
      },
      comments: { selector: "div:nth-child(5)" },
      time: {
        selector: "div:nth-child(6)",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d{2}:\d{2}:\d{2})[\s\n]*(\d{2}\/\d{2}\/\d{4})/);
            if (queryMatch && queryMatch.length > 2) {
              const [hours, minutes, seconds] = queryMatch[1].split(":");
              const [day, month, year] = queryMatch[2].split("/");
              return parseValidTimeString(
                `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${hours}:${minutes}:${seconds}`,
              );
            }
            return "";
          },
        ],
      },
      size: { selector: "div:nth-child(7)", filters: [{ name: "parseSize" }] },
      completed: {
        selector: "div:nth-child(8)",
        filters: [
          (query: string) => {
            return query.match(/(\d+)/)![1];
          },
        ],
      },
      seeders: { selector: "div:nth-child(9)" },
      leechers: { selector: "div:nth-child(10)" },
      author: { selector: "div:nth-child(11)" },
    },
  },

  userInfo: {
    pickLast: ["id", "joinTime"],
    selectors: {
      // "page": "/index.php",
      id: {
        selector: [".statusbar a[href*='userdetails.php']:has(>span)"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: [".statusbar a[href*='userdetails.php'] span"],
      },
      messageCount: {
        text: 0,
        selector: ".statusbar a[href*='messages.php']",
        filters: [
          (query: string | number) => {
            const queryMatch = String(query || "").match(/(\d+)/); // query 有时会直接传入 0
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },
      uploaded: {
        selector: ["span:has(img[src*='uploaded'])"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/(上[传傳]量|Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length === 3 ? parseSizeString(queryMatch[2]) : 0;
          },
        ],
      },
      downloaded: {
        selector: ["span:has(img[src*='downloaded'])"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/(下[载載]量|Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length === 3 ? parseSizeString(queryMatch[2]) : 0;
          },
        ],
      },
      bonus: {
        selector: [".statusbar a[href*='shop.php']"],
        filters: [
          (query: string) => {
            return query ? parseFloat(query.replace(/[\s,]/g, "")) : 0;
          },
        ],
      },

      // "page": "/userdetails.php",
      levelName: {
        selector: ["td:contains('Class') + td"],
      },
      joinTime: {
        selector: ["td:contains('Join'):contains('date') + td"],
        filters: [
          (query: string) => {
            query = query.split(" (")[0];
            return parseValidTimeString(query);
          },
        ],
      },
      seeding: {
        selector: ["td:contains('Seed'):contains('bonus') + td > div:first"],
        filters: [
          (query: string) => {
            const queryMatch = query?.match(/Seeding (\d+) torrents with a total seed size of ([\d.\s,ZEPTGMKiB]+)\./);
            return queryMatch && queryMatch.length > 2 ? queryMatch[1] : 0;
          },
        ],
      },
      seedingSize: {
        selector: ["td:contains('Seed'):contains('bonus') + td > div:first"],
        filters: [
          (query: string) => {
            const queryMatch = query?.match(/Seeding (\d+) torrents with a total seed size of ([\d.\s,ZEPTGMKiB]+)\./);
            return queryMatch && queryMatch.length > 2 ? parseSizeString(queryMatch[2]) : "0";
          },
        ],
      },
      bonusPerHour: {
        selector: ["td:contains('Seed'):contains('bonus') + td > div:nth-child(3)"],
        filters: [
          (query: string) => {
            const queryMatch = query?.match(/Total: ([\d,.]+) FLCoins \/ hour/);
            return queryMatch && queryMatch.length > 1 ? parseFloat(queryMatch[1].replace(/,/, "")) : "0";
          },
        ],
      },
    },
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id", "name", "messageCount", "uploaded", "downloaded", "bonus"],
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: ["levelName", "joinTime", "seeding", "seedingSize", "bonusPerHour"],
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "This status is obtained by the new user of this tracker.",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "It can download DOX files larger than 1MB. This class has the right to apply to uploader status.",
    },
    {
      id: 2,
      name: "Addict",
      interval: "P6M",
      uploaded: "500GB",
      ratio: 4.0,
      privilege: "This class has the right to request a Custom Title. This class is entitled to requests.",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P4Y",
      uploaded: "4TB",
      ratio: 5.0,
      privilege: "This class gives you the right to give reputation to other users.",
    },
    {
      id: 4,
      name: "VIP",
      privilege:
        "This class always has a minimum ratio equal to 2, regardless of the downloads made, and is exempt from hit&run rules. They can set their own Custom Title.",
    },
  ],
};

export default class FileList extends PrivateSite {
  // 获取种子标签
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const customTags = row.querySelectorAll("img[src*='tags'][alt]");
    if (customTags.length > 0) {
      const tags: ITorrentTag[] = torrent.tags || [];
      customTags.forEach((element) => {
        const alt = element.getAttribute("alt");
        if (alt) {
          tags.push({ name: alt });
        }
      });

      torrent.tags = tags;
    }

    return torrent;
  }
}
