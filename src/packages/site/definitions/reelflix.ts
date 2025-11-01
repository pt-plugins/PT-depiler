import type { ISiteMetadata, ITorrent, ITorrentTag, ISearchInput } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "reelflix",
  name: "ReelFliX",
  aka: ["RFX"],
  description: "Keep it Reel",
  tags: ["电影"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://errysyvk.pp/", "uggcf://errysyvk.klm/"],

  category: [
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "Full Disc", value: 43 },
        { name: "Remux", value: 40 },
        { name: "Encode", value: 41 },
        { name: "WEB-DL", value: 42 },
        { name: "WEBRip", value: 45 },
        { name: "HDTV", value: 35 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "4320p", value: 1 },
        { name: "2160p", value: 2 },
        { name: "1080p", value: 3 },
        { name: "1080i", value: 4 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Buff",
      key: "free",
      options: [
        { name: "0% Freeleech", value: 0 },
        { name: "25% Free", value: 25 },
        { name: "50% Free", value: 50 },
        { name: "75% Free", value: 75 },
        { name: "100% Free", value: 100 },
        { name: "双倍上传", value: "doubleup" },
        { name: "精选", value: "featured" },
        { name: "Refundable", value: "refundable" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
            params[value] = 1;
          } else {
            params.free.push(value);
          }
        });
        return { requestConfig: { params } };
      },
    },
  ],

  levelRequirements: [
    {
      id: 0,
      name: "Leech",
    },
    {
      id: 1,
      name: "User",
      ratio: 0.8,
      uploaded: "50GiB",
      privilege: "1下载槽",
    },
    {
      id: 2,
      name: "Member",
      interval: "P5D",
      ratio: 0.9,
      uploaded: "100GiB",
      averageSeedingTime: "P1D",
      privilege: "5下载槽",
    },
    {
      id: 3,
      name: "Pro",
      interval: "P2W",
      ratio: 1,
      uploaded: "500GiB",
      averageSeedingTime: "P5D",
      privilege: "上传种子 10下载槽 求种",
    },
    {
      id: 4,
      name: "Expert",
      interval: "P1M",
      ratio: 1.1,
      uploaded: "1TiB",
      averageSeedingTime: "P15D",
      privilege: "上传种子 无限下载槽 求种 自动通过候选",
    },
    {
      id: 5,
      name: "Elite",
      interval: "P3M",
      ratio: 1.2,
      uploaded: "2.5TiB",
      averageSeedingTime: "P1M",
      privilege: "上传种子 无限下载槽 发送邀请 自动通过候选 邀请论坛",
    },
    {
      id: 6,
      name: "Distributor",
      interval: "P6M",
      ratio: 1.25,
      uploaded: "5TiB",
      seedingSize: "1TiB",
      averageSeedingTime: "P45D",
      privilege: "上传种子 无限下载槽 发送邀请 自动通过候选 邀请论坛 所有种子可退款",
    },
    {
      id: 7,
      name: "Curator",
      interval: "P1Y",
      ratio: 1.5,
      uploaded: "10TiB",
      seedingSize: "2.5TiB",
      averageSeedingTime: "P3M",
      privilege: "上传种子 无限下载槽 发送邀请 自动通过候选 邀请论坛 全站25%免费",
    },
    {
      id: 8,
      name: "Archivist",
      interval: "P2Y",
      ratio: 1.75,
      uploaded: "25TiB",
      seedingSize: "5TiB",
      averageSeedingTime: "P6M",
      privilege: "上传种子 无限下载槽 发送邀请 自动通过候选 邀请论坛 全站50%免费",
    },
  ],
};

export default class ReelFliX extends Unit3D {
  // 可能会出现匹配到多个优惠 tag 的情况（比如站免），二次处理以只保留最高优惠类型 tag
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const torrents = super.parseTorrentRowForTags(torrent, row, searchConfig);

    const discountType: Record<string, number> = {
      Free: 100,
      "75%": 75,
      "50%": 50,
      "25%": 25,
    };

    if (Array.isArray(torrents.tags)) {
      let maxDiscountTag: ITorrentTag | undefined;
      let maxValue = -1;

      for (const tag of torrents.tags) {
        const value = discountType[tag.name];
        if (value !== undefined && value > maxValue) {
          maxValue = value;
          maxDiscountTag = tag;
        }
      }

      if (maxDiscountTag) {
        torrents.tags = torrents.tags.filter((tag) => {
          const isDiscount = tag.name in discountType;
          return !isDiscount || tag.name === maxDiscountTag.name;
        });
      }
    }

    return torrents;
  }
}
