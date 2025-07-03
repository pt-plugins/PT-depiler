import Sizzle from "sizzle";
import Gazelle, { SchemaMetadata } from "../schemas/Gazelle.ts";
import { parseValidTimeString, parseSizeString } from "../utils";
import type { ISiteMetadata, ITorrent, ISearchInput } from "../types";
import { ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "passthepopcorn",
  name: "PassThePopcorn",
  aka: ["PTP"],
  description: "PassThePopcorn (PTP) is a Private site for MOVIES",
  tags: ["电影"],
  timezoneOffset: "+0000",
  collaborator: ["enigmaz"],
  type: "private",
  schema: "Gazelle",
  urls: ["uggcf://cnffgurcbcpbea.zr/"],

  // 搜索分类
  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { value: 1, name: "Feature Film" },
        { value: 2, name: "Short Film" },
        { value: 3, name: "Miniseries" },
        { value: 4, name: "Stand-up Comedy" },
        { value: 5, name: "Live Performance" },
        { value: 6, name: "Movie Collection" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "Source",
      key: "encoding",
      options: [
        { value: "AVI", name: "AVI" },
        { value: "MPG", name: "MPG" },
        { value: "MKV", name: "MKV" },
        { value: "MP4", name: "MP4" },
        { value: "VOB IFO", name: "VOB IFO" },
        { value: "ISO", name: "ISO" },
        { value: "m2ts", name: "m2ts" },
      ],
    },
    {
      name: "Codec",
      key: "format",
      options: [
        { value: "XviD", name: "XviD" },
        { value: "DivX", name: "DivX" },
        { value: "H.264", name: "H.264" },
        { value: "x264", name: "x264" },
        { value: "H.265", name: "H.265" },
        { value: "x265", name: "x265" },
        { value: "DVD5", name: "DVD5" },
        { value: "DVD9", name: "DVD9" },
        { value: "BD25", name: "BD25" },
        { value: "BD50", name: "BD50" },
        { value: "BD66", name: "BD66" },
        { value: "BD100", name: "BD100" },
      ],
    },
    {
      name: "Source",
      key: "media",
      options: [
        { value: "CAM", name: "CAM" },
        { value: "TS", name: "TS" },
        { value: "R5", name: "R5" },
        { value: "DVD-Screener", name: "DVD-Screener" },
        { value: "VHS", name: "VHS" },
        { value: "WEB", name: "WEB" },
        { value: "DVD", name: "DVD" },
        { value: "TV", name: "TV" },
        { value: "HDTV", name: "HDTV" },
        { value: "HD-DVD", name: "HD-DVD" },
        { value: "Blu-ray", name: "Blu-ray" },
      ],
    },
    {
      name: "Resolution",
      key: "resolution",
      options: [
        { value: "anysd", name: "Any SD" },
        { value: "anyhd", name: "Any HD" },
        { value: "anyhdplus", name: "Any HD+" },
        { value: "anyuhd", name: "Any UHD" },
        { value: "NTSC", name: "NTSC" },
        { value: "PAL", name: "PAL" },
        { value: "480p", name: "480p" },
        { value: "576p", name: "576p" },
        { value: "720p", name: "720p" },
        { value: "1080i", name: "1080i" },
        { value: "1080p", name: "1080p" },
        { value: "2160p", name: "2160p" },
      ],
    },
    {
      name: "Release type",
      key: "scene",
      options: [
        { value: "2", name: "Golden Popcorn" },
        { value: "3", name: "Personal" },
        { value: "4", name: "Personal GP" },
        { value: "0", name: "Non-Scene" },
        { value: "1", name: "Scene" },
      ],
    },
    {
      name: "Leech type",
      key: "freetorrent",
      options: [
        { value: "0", name: "Normal" },
        { value: "1", name: "Free" },
        { value: "2", name: "Half" },
        { value: "3", name: "Neutral" },
        { value: "4", name: "Any X-Leech" },
      ],
    },
    /* {
      name: "Grouping",
      key: "grouping",
      options: [
        { value: "1", name: "Yes" },
        { value: "0", name: "No"},
      ],
    }, */
  ],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: { noredirect: 1, grouping: 0 },
    },
    selectors: {},
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id", "name", "messageCount"],
      },
      {
        requestConfig: {
          url: "/user.php",
          params: {
            /* id: flushUserInfo.id */
          },
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "bonusPerHour",
          "joinTime", // Gazelle 基础项
          "seeding",
          "seedingSize",
          "uploads",
        ],
      },
    ],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      id: {
        ...SchemaMetadata.userInfo!.selectors!.id!,
        selector: ["a[href*='user.php?id=']:first"],
      },
      name: {
        selector: ["a[href*='user.php?id=']:first"],
      },
      uploaded: {
        ...SchemaMetadata.userInfo!.selectors!.uploaded!,
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Uploaded:')",
      },
      downloaded: {
        ...SchemaMetadata.userInfo!.selectors!.downloaded!,
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Downloaded:')",
      },
      ratio: {
        ...SchemaMetadata.userInfo!.selectors!.ratio!,
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Ratio:')",
      },
      levelName: {
        ...SchemaMetadata.userInfo!.selectors!.levelName!,
        selector: "div.panel__heading:contains('Personal') + div.panel__body > ul.list > li:contains('Class:')",
      },
      bonus: {
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Points:')",
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            const queryMatch = query.match(/Points.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      bonusPerHour: {
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Points per hour:')",
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            const queryMatch = query.match(/Points per hour.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      joinTime: {
        selector: ["div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Joined:') > span"],
        elementProcess: (element: HTMLElement) => {
          const query = (element.getAttribute("title") || element.innerText).trim();
          return parseValidTimeString(query, ["MMM dd yyyy, HH:mm"]);
        },
      },
      seeding: {
        selector: ["div.panel__heading:contains('Community') + div.panel__body > ul.list > li:contains('Seeding:')"],
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            const queryMatch = query.match(/Seeding.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      seedingSize: {
        selector: [
          "div.panel__heading:contains('Community') + div.panel__body > ul.list > li:contains('Seeding size:')",
        ],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/Seeding size.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          },
        ],
      },
      uploads: {
        selector: ["div.panel__heading:contains('Community') + div.panel__body > ul.list > li:contains('Uploaded:')"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/Uploaded:.+?([\d]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
    },
  },
};

export default class PassThePopcorn extends Gazelle {
  protected createTempDiv(rawHtml: string): HTMLDivElement {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawHtml;
    return tempDiv;
  }
  protected parsePageData(movie: any, authKey: string, torrentPass: string): Partial<ITorrent> {
    const torrent = movie.GroupingQualities?.[0]?.Torrents?.[0];
    const movieId = movie.GroupId || "";
    const movieName = movie.Title || "";
    const movieYear = movie.Year || "";
    const movieImdbId = movie.ImdbId ? `tt${movie.ImdbId}` : "";
    const category = movie.CategoryName || "";
    if (torrent) {
      const id = torrent.TorrentId;
      const tempTitleDiv = this.createTempDiv(torrent.Title);
      const rawTitle = Sizzle("a", tempTitleDiv)[0]?.getAttribute("title") || "";
      const titleParts = rawTitle.split("\n");
      const title = titleParts.length > 1 ? titleParts[1].trim() : rawTitle.trim();
      const subTitlePart = Sizzle("a", tempTitleDiv)[0]?.textContent?.trim() || "";
      const subTitle = `${movieName} ${movieYear} ${movieImdbId} ${subTitlePart}`.trim();

      const url = `${this.url}torrents.php?id=${movieId}&torrentid=${id}`;
      const link = `${this.url}torrents.php?action=download&id=${id}&authkey=${authKey}&torrent_pass=${torrentPass}`;

      const tempTimeDiv = this.createTempDiv(torrent.Time);
      const timeStr = Sizzle("span", tempTimeDiv)[0]?.getAttribute("title") || "";
      const time = parseValidTimeString(timeStr, ["MMM dd yyyy, HH:mm"]) as number;
      const size = parseSizeString(torrent.Size);
      const seeders = parseFloat(torrent.Seeders);
      const leechers = parseFloat(torrent.Leechers);
      const completed = parseFloat(torrent.Snatched);

      const colorType = torrent.ColorType;
      const status = colorType === "seeding" ? ETorrentStatus.seeding : ETorrentStatus.unknown;
      const progress = colorType === "seeding" ? 100 : 0;

      return {
        site: this.metadata.id,
        id,
        category,
        title,
        subTitle,
        url,
        link,
        time,
        size,
        seeders,
        leechers,
        completed,
        status,
        progress,
      };
    }
    return {};
  }
  public override async transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    const torrents: ITorrent[] = [];

    const scripts = Sizzle("script", doc) as HTMLScriptElement[];
    let pageDataContent = "";
    for (const script of scripts) {
      if (script.textContent?.includes("var PageData")) {
        pageDataContent = script.textContent;
        break;
      }
    }
    let pageData: any = {};
    if (pageDataContent) {
      const pageDataMatch = pageDataContent.match(/var PageData\s*=\s*({.*?});/s);
      if (pageDataMatch && pageDataMatch[1]) {
        try {
          pageData = JSON.parse(pageDataMatch[1]);
        } catch (error) {
          console.error("[Site] PassThePopcorn Error parsing PageData:", error);
        }
      }
    }

    if (pageData) {
      const authKey = pageData.AuthKey;
      const torrentPass = pageData.TorrentPass;
      pageData.Movies.map((movie: any) => {
        const torrent = this.parsePageData(movie, authKey, torrentPass) as ITorrent;
        torrents.push(torrent);
      });
    }
    return torrents;
  }
}
