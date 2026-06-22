import { ISearchInput, ISiteMetadata, ITorrent, ITorrentTag, IUserInfo } from "../types";
import AvistazNetwork, { SchemaMetadata, IAvzNetRawTorrent } from "../schemas/AvistazNetwork.ts";
import { definedFilters } from "../utils/filter.ts";

const profileRootSelector = "main > div > div > div:first-child";
const profileHeaderSelector = `${profileRootSelector} > div > div > div > div`;

function parseAnimeZNumber(value: string): number {
  if (/^inf\.?$/i.test(value.trim())) {
    return Infinity;
  }
  return definedFilters.parseNumber(value);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getText(element?: Element | null): string {
  return element ? normalizeText((element as HTMLElement).innerText ?? element.textContent ?? "") : "";
}

function getAnimeZDatagridValue(document: Document, label: string): string {
  const labelPattern = new RegExp(`^${label}$`, "i");
  for (const item of Array.from(document.querySelectorAll(".datagrid-item"))) {
    const title = getText(item.querySelector(".datagrid-title"));
    if (labelPattern.test(title)) {
      return getText(item.querySelector(".datagrid-content"));
    }
  }
  return "";
}

const formatMap: Record<string, string> = {
  TV: "Anime/TV",
  TV_SHORT: "Anime/TV Short",
  MOVIE: "Anime/Movie",
  SPECIAL: "Anime/Special",
  OVA: "Anime/OVA",
  ONA: "Anime/ONA",
  MUSIC: "Anime/Music",
  MANGA: "Manga/Manga",
  NOVEL: "Manga/Novel",
  ONE_SHOT: "Manga/One-Shot",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 3,
  id: "animez",
  name: "AnimeZ",
  aka: ["AnimeTorrents"],
  description: "AnimeZ (ex-AnimeTorrents) is a Private Torrent Tracker for ANIME / MANGA",
  tags: ["动漫", "漫画"],
  timezoneOffset: "+0100",

  type: "private",
  schema: "AvistazNetwork",

  urls: ["uggcf://navzrm.gb/"],

  category: [
    {
      name: "格式",
      key: "format",
      keyPath: "params",
      options: Object.entries(formatMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "促销",
      key: "freeleech",
      options: [{ name: "Freeleech", value: 1 }],
      generateRequestConfig: () => ({ requestConfig: { params: { freeleech: 1 } } }),
    },
    {
      name: "特殊",
      key: "special",
      options: [
        { name: "Newbie Downloadable", value: "newbie" },
        { name: "Dying Torrents", value: "dying" },
        { name: "Dead Torrents", value: "dead" },
        { name: "Big Torrents (10GB+)", value: "big" },
        { name: "Huge Torrents (99GB+)", value: "huge" },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      ...SchemaMetadata.search!.requestConfig!,
      params: { limit: 50 },
    },
    advanceKeywordParams: {
      imdb: { enabled: false },
      tvdb: { enabled: false },
      tmdb: { enabled: false },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      title: { selector: "release_title" },
      category: { selector: "format" },
    },
  },

  userInputSettingMeta: [...SchemaMetadata.userInputSettingMeta!],

  userInfo: {
    pickLast: ["name"],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      name: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getText(document.querySelector(`${profileHeaderSelector} > div:first-child`)) ||
          document.title.split(" - ")[0],
      },
      levelName: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getText(document.querySelector(`${profileHeaderSelector} > div:nth-child(2) > span.badge.badge-sm`)) ||
          getText(document.querySelector(`${profileHeaderSelector} span.badge.badge-sm`)),
      },
      uploaded: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Uploaded"),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Downloaded"),
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Ratio"),
        filters: [parseAnimeZNumber],
      },
      bonus: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Bonus Points"),
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Uploads"),
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Seeding"),
        filters: [{ name: "parseNumber" }],
      },
      leeching: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Leeching"),
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Member Since"),
        filters: [{ name: "parseTime", args: ["MMMM dd, yyyy"] }],
      },
      lastAccessAt: {
        selector: ":self",
        elementProcess: (document: Document) => getAnimeZDatagridValue(document, "Last Seen"),
        filters: [{ name: "parseTTL" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Leech",
      privilege:
        "Can only download torrents older than 7 days. Cannot upload. Any Hit & Runs disable downloading until cleared.",
    },
    {
      id: 2,
      name: "Newbie",
      privilege:
        "Newly registered users. Can only download torrents older than 7 days. Cannot use RSS or upload torrents.",
    },
    {
      id: 3,
      name: "Member",
      uploaded: "5GB",
      ratio: 1,
      alternative: [{ interval: "P1W" }],
      privilege: "Registered users in good standing with 5 GB+ upload and a ratio of 1.0 or above.",
    },
    {
      id: 4,
      name: "Power User",
      privilege: "Experienced members with strong upload history and consistently good ratio.",
    },
    {
      id: 100,
      name: "VIP",
      groupType: "vip",
      privilege: "Distinguished member, donator, or retired staff.",
    },
    {
      id: 200,
      name: "Uploader",
      groupType: "manager",
      privilege: "Promoted by staff for quality and quantity of uploads. Access to the upload API and tag creation.",
    },
    {
      id: 201,
      name: "Editor",
      groupType: "manager",
      privilege: "Promoted by staff. Can create and edit anime database entries.",
    },
    {
      id: 202,
      name: "Staff",
      groupType: "manager",
      privilege: "Site assistant with access to the admin panel and moderation tools.",
    },
    { id: 203, name: "Moderator", groupType: "manager", privilege: "Moderates the site and its users." },
    { id: 204, name: "Administrator", groupType: "manager", privilege: "Administers and moderates the site." },
    { id: 205, name: "Super Admin", groupType: "manager", privilege: "Site owner." },
  ],
};

interface IAnimeZRawTorrent extends IAvzNetRawTorrent {
  format?: string;
  release_title?: string;
  complete?: boolean;
  dual_audio?: boolean;
  languages?: Array<{ name?: string; language?: string } | string>;
  tags?: {
    [key: string]: string;
  };
}

export default class AnimeZ extends AvistazNetwork {
  protected override async getBaseInfoFromSite(
    userName: string = this.userConfig.inputSetting?.username ?? "",
  ): Promise<Partial<IUserInfo>> {
    const { data: pageDocument } = await this.request<Document>({
      url: `/profile/${userName}`,
      responseType: "document",
    });

    return this.getFieldsData(pageDocument, this.metadata.userInfo?.selectors!, [
      "name",
      "levelName",
      "uploaded",
      "downloaded",
      "ratio",
      "bonus",
      "uploads",
      "seeding",
      "leeching",
      "lastAccessAt",
    ]) as Partial<IUserInfo>;
  }

  protected override async getExtendInfoFromProfile(userName: string): Promise<Partial<IUserInfo>> {
    const { data: pageDocument } = await this.request<Document>({
      url: `/profile/${userName}`,
      responseType: "document",
    });

    return this.getFieldsData(pageDocument, this.metadata.userInfo?.selectors!, [
      "joinTime",
      "lastAccessAt",
    ]) as Partial<IUserInfo>;
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IAnimeZRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const extendTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);
    const tags: ITorrentTag[] = extendTorrent.tags || [];

    extendTorrent.title = row.release_title?.trim() || row.file_name;

    if (row.format) {
      extendTorrent.category = formatMap[row.format] ?? row.format;
    }

    if (row.complete || row.movie_tv?.tv_complete) {
      tags.push({ name: "完结" });
    }

    if (row.dual_audio) {
      tags.push({ name: "双语" });
    }

    if (row.subtitle?.some((subtitle) => /Chinese/i.test(subtitle.language))) {
      tags.push({ name: "中字" });
    }

    const apiTags = row.tags ? Object.values(row.tags) : [];
    for (const tag of apiTags) {
      if (/batch/i.test(tag)) {
        tags.push({ name: "Batch" });
        break;
      }
    }

    extendTorrent.tags = tags;
    return extendTorrent;
  }
}
