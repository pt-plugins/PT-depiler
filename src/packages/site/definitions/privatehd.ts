import { ISiteMetadata, ISearchInput, ITorrent, ITorrentTag } from "../types";
import AvistazNetwork, { SchemaMetadata, IAvzNetRawTorrent } from "../schemas/AvistazNetwork.ts";

const categoryMap: Record<number, string> = {
  0: "All",
  1: "Movie",
  2: "TV-Show",
};

const resolutionMap: Record<number, string> = {
  1: "720p",
  2: "1080p",
  3: "2160p",
  4: "1080i",
  5: "4320p",
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
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "privatehd",
  name: "PrivateHD",
  aka: ["PHD"],
  description: "PrivateHD is a Private Torrent Tracker of AvistaZ Network",
  tags: ["电影", "高清"],
  timezoneOffset: "+0100",

  type: "private",
  schema: "AvistazNetwork",

  urls: ["uggcf://cevingruq.gb/"],
  favicon: "./privatehd.png",

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
      ],
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

  userInputSettingMeta: [...SchemaMetadata.userInputSettingMeta!],
};

interface IPrivateHDRawTorrent extends IAvzNetRawTorrent {
  adult: boolean;
  video_quality_id: number;
  video_quality: string;
  rip_type_id: number;
  rip_type: string;
  music_type: string;
}

export default class PrivateHD extends AvistazNetwork {
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IPrivateHDRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const extendTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);
    const tags: ITorrentTag[] = extendTorrent.tags || [];

    if (row.movie_tv?.tv_complete) {
      tags.push({ name: "完结" });
    }

    if (row.audio?.some((a: any) => /Chinese|Cantonese/i.test(a.language))) {
      tags.push({ name: "中配" });
    }

    if (row.subtitle?.some((s: any) => /Chinese/i.test(s.language))) {
      tags.push({ name: "中字" });
    }
    extendTorrent.tags = tags;

    return extendTorrent;
  }
}
