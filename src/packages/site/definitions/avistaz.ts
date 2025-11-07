import { 
  ISiteMetadata,
  ISearchInput,
  IAdvancedSearchRequestConfig,
  ITorrent,
  ITorrentTag,
} from "../types";
import AvistazNetwork, { SchemaMetadata, IAvzNetRawTorrent } from "../schemas/AvistazNetwork.ts";

const categoryMap: Record<number, string> = {
  0: "All",
  1: "Movies",
  2: "TV",
  3: "Music",
};

const resolutionMap: Record<number, string> = {
  1: "SD",
  2: "720p",
  3: "1080p",
  6: "2160p",
  7: "1080i",
  8: "4320p",
};

const tvTypeMap: Record<number, string> = {
  1: "Single Episode",
  2: "Full Season",
  3: "Complete",
};

const discountMap: Record<number, string> = {
  1: "Free-Download",
  2: "Half-Download",
  3: "Double Upload",
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "avistaz",
  name: "AvistaZ",
  aka: ["Avz"],
  description: "AvistaZ (AsiaTorrents) is a Private Torrent Tracker for ASIAN MOVIES / TV / GENERAL",
  tags: ["电影", "电视剧", "综合"],
  timezoneOffset: "+0100",

  type: "private",
  schema: "AvistazNetwork",

  urls: ["uggcf://nivfgnm.gb/"],
  formerHosts: [""],

  collaborator: ["zdm9981"],

  category: [
    {
      name: "分类",
      key: "category",
      keyPath: "params",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "分辨率",
      key: "res",
      keyPath: "params",
      options: Object.entries(resolutionMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "剧集包",
      key: "tv_type",
      keyPath: "params",
      options: Object.entries(tvTypeMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "促销",
      key: "discount",
      keyPath: "params",
      options: Object.entries(discountMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "appendQuote" },
    },
    {
      name: "特殊",
      key: "special",
      options: [
        { name: "Adult Torrents", value: "adult" },
        { name: "Newbie Downloadable", value: "newbie" },
        { name: "Dying Torrents", value: "dying" },
        { name: "Dead Torrents", value: "dead" },
        { name: "Big Torrents (10GB+)", value: "big" },
        { name: "Huge Torrents (99GB+)", value: "huge" },
      ]
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "Leech",
      privilege: "Can download 1 torrent a day. Limited to download torrents uploaded 1 week ago. Cannot upload.",
    },
    {
      id: 2,
      name: "Newbie",
      privilege: "Can download 5 torrents a day. Cannot upload. Cannot use RSS.",
    },
    {
      id: 3,
      name: "Member",
      alternative: [{ ratio: 1 }, { interval: "P1W" }],
      privilege: "Can download 100 torrents a day. Can upload. Can use RSS (must enable it in My Account settings).",
    },
    {
      id: 100,
      name: "V.I.P.",
      groupType: "vip",
      privilege: "Can download 200 torrents a day. Can upload.",
    },
    // Staff Classes
    {
      id: 200,
      name: "Uploader",
      groupType: "manager",
      privilege: "Can upload.",
    },
    {
      id: 201,
      name: "Editor",
      groupType: "manager",
      privilege: "Can upload.",
    },
    { id: 203, name: "Moderator", groupType: "manager" },
    { id: 204, name: "Admin", groupType: "manager" },
    { id: 205, name: "Super Admin", groupType: "manager" },
  ],

  userInputSettingMeta: [
    ...SchemaMetadata.userInputSettingMeta!,
  ],
};

export interface IAvzRawTorrent extends IAvzNetRawTorrent {
  adult: boolean;
  video_quality_id: number;
  video_quality: string;
  rip_type_id: number;
  rip_type: string;
  music_type: string;
}

export default class Avistaz extends AvistazNetwork {

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IAvzRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];
    const extendTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);

  // 完结
  if (row.movie_tv?.tv_complete) {
    tags.push({ name: "完结" });
  }

  // 中配
  const audioArray = row.audio?.map((a: any) => a.language).filter((x: string) => x.trim() !== "") || [];
  if (audioArray.some((audio) => /Chinese|Cantonese/i.test(audio))) {
    tags.push({ name: "中配" });
  }

  // 字幕
  const subtitleArray = row.subtitle?.map((s: any) => s.language).filter((x: string) => x.trim() !== "") || [];
  if (subtitleArray.some((subtitle) => /Chinese/i.test(subtitle))) {
    tags.push({ name: "中字" });
  }
    extendTorrent.tags = tags;

    return extendTorrent;
  }

}
