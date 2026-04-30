import { ISiteMetadata, ISearchInput, ITorrent, ITorrentTag } from "../types";
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
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "cinemaz",
  name: "CinemaZ",
  description: "CinemaZ is a Private Torrent Tracker for FOREIGN NON-ENGLISH MOVIES / TV / GENERAL",
  tags: ["电影", "电视剧", "外语"],
  timezoneOffset: "+0100",

  type: "private",
  schema: "AvistazNetwork",

  urls: ["uggcf://pvarznm.gb/"],

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

  userInputSettingMeta: [...SchemaMetadata.userInputSettingMeta!],
};

interface ICinemaZRawTorrent extends IAvzNetRawTorrent {
  adult: boolean;
  video_quality_id: number;
  video_quality: string;
  rip_type_id: number;
  rip_type: string;
  music_type: string;
}

export default class CinemaZ extends AvistazNetwork {
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: ICinemaZRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const extendTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);
    const tags: ITorrentTag[] = extendTorrent.tags || [];

    // 完结
    if (row.movie_tv?.tv_complete) {
      tags.push({ name: "完结" });
    }

    // 中配
    if (row.audio?.some((a) => /Chinese|Cantonese/i.test(a.language))) {
      tags.push({ name: "中配" });
    }

    // 中字
    if (row.subtitle?.some((s) => /Chinese/i.test(s.language))) {
      tags.push({ name: "中字" });
    }

    extendTorrent.tags = tags;
    return extendTorrent;
  }
}
