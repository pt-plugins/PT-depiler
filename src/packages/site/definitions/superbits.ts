/**
 * Superbits - 基于 rartracker 的瑞典 BT 站点
 */
import type { ISiteMetadata, ITorrent, ISearchInput, ITorrentTag } from "../types";
import Rartracker from "../schemas/Rartracker";
import { SchemaMetadata } from "../schemas/Rartracker";

// rartracker API 返回的种子数据结构（Superbits 特有字段）
interface ISuperbitsTorrent {
  frileech: number;
  swesub: number;
  pack: number;
}

const levelIdMap: Record<number, string> = {
  0: "Medlem",
  1: "Fullvärdig medlem",
  2: "Trogen medlem",
  3: "Veteran",
  4: "Legend",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "superbits",
  name: "Superbits",
  description: "Sveriges största bittorrent tracker.",
  tags: ["综合", "影视", "瑞典"],
  timezoneOffset: "+0100",

  collaborator: [],

  type: "private",
  schema: "Rartracker",

  urls: ["uggcf://fhcreovgf.bet/"],

  category: [
    {
      name: "Category",
      key: "section",
      options: [
        { name: "Nytt", value: "nytt" },
        { name: "P2P", value: "p2p" },
        { name: "Musik", value: "musik" },
        { name: "TV-Serier", value: "tvserier" },
        { name: "Arkiv", value: "arkiv" },
        { name: "Movie", value: "movie" },
        { name: "Swedish TV", value: "swetv" },
      ],
      cross: { mode: "append" },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      ...SchemaMetadata.search!.requestConfig,
      params: {
        ...SchemaMetadata.search!.requestConfig!.params,
        order: "desc",
        sort: "d",
        freeleech: false,
        stereoscopic: false,
        swesub: false,
        dksub: false,
        nosub: false,
        fisub: false,
        enaudio: false,
        p2p: false,
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      completed: { selector: "timesCompleted" },
      author: { text: "" },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    process: [
      {
        ...SchemaMetadata.userInfo!.process![0],
        selectors: {
          ...SchemaMetadata.userInfo!.process![0].selectors,
          levelId: { selector: "user.class" },
          levelName: {
            selector: "user.class",
            filters: [(classId: number) => levelIdMap[classId] ?? `Class ${classId}`],
          },
        },
      },
      {
        ...SchemaMetadata.userInfo!.process![1],
        selectors: {
          ...SchemaMetadata.userInfo!.process![1].selectors,
          seeding: { selector: "peersSeeder" },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 0, name: levelIdMap[0], privilege: "新用户的默认等级。" },
    {
      id: 1,
      name: levelIdMap[1],
      interval: "P14D",
      uploaded: "50GiB",
      ratio: 1.05,
      privilege: "可以创建和上传 requests，使用积分系统及站点其他功能。",
    },
    {
      id: 2,
      name: levelIdMap[2],
      interval: "P15W",
      uploaded: "300GiB",
      ratio: 1.1,
      privilege: "访问所有排行榜，使用邀请系统。IP 日志被清除且关闭 IP 记录。可在 P2P 和 Arkiv 上传种子。",
    },
    {
      id: 3,
      name: levelIdMap[3],
      interval: "P30W",
      uploaded: "1.2TiB",
      ratio: 1.1,
      privilege: "可以查看 Veteran 论坛。",
    },
    { id: 4, name: levelIdMap[4], interval: "P3Y", uploaded: "30TiB", ratio: 2.1, privilege: "访问大部分功能。" },
  ],
};

// 处理 Superbits 特有的 freeleech / swesub 等标签
export default class Superbits extends Rartracker {
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    _searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = torrent.tags || [];

    if (!(row instanceof Node)) {
      const raw = row as unknown as ISuperbitsTorrent;
      if (raw.frileech === 1) tags.push({ name: "Free", color: "blue" });
      if (raw.swesub === 1) tags.push({ name: "SweSub" });
      if (raw.pack === 1) tags.push({ name: "Pack" });
    }

    if (tags.length > 0) torrent.tags = tags;
    return torrent;
  }
}
