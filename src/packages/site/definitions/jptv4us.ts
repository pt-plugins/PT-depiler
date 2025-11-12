import { type ISiteMetadata } from "../types.ts";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptions } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "jptv4us",
  version: 1,
  name: "JPTV4us",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://wcgi4.hf/"],
  favicon: "./_default_unit3d.ico",
  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Anime Movie", value: 1 },
        { name: "Anime Series", value: 2 },
        { name: "Documentary", value: 3 },
        { name: "Drama", value: 4 },
        { name: "Infomational", value: 5 },
        { name: "Movie", value: 6 },
        { name: "Music", value: 7 },
        { name: "News", value: 8 },
        { name: "Variety", value: 9 },
        { name: "Other", value: 10 },
        { name: "Audio Only", value: 11 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "Full Disc", value: 1 },
        { name: "Remux", value: 2 },
        { name: "Encode", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "TS (Raw)", value: 7 },
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
      name: "题材",
      key: "genreIds",
      options: [
        { name: "Action", value: 28 },
        { name: "Action & Adventure", value: 10759 },
        { name: "Adventure", value: 12 },
        { name: "Animation", value: 16 },
        { name: "Comedy", value: 35 },
        { name: "Crime", value: 80 },
        { name: "Documentary", value: 99 },
        { name: "Drama", value: 18 },
        { name: "Family", value: 10751 },
        { name: "Fantasy", value: 14 },
        { name: "History", value: 36 },
        { name: "Horror", value: 27 },
        { name: "Kids", value: 10762 },
        { name: "Music", value: 10402 },
        { name: "Musical", value: 22 },
        { name: "Mystery", value: 9648 },
        { name: "News", value: 10763 },
        { name: "Reality", value: 10764 },
        { name: "Romance", value: 10749 },
        { name: "Sci-Fi & Fantasy", value: 10765 },
        { name: "Science Fiction", value: 878 },
        { name: "Soap", value: 10766 },
        { name: "Talk", value: 10767 },
        { name: "Thriller", value: 53 },
        { name: "TV Movie", value: 10770 },
        { name: "War", value: 10752 },
        { name: "War & Politics", value: 10768 },
        { name: "Western", value: 37 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Freeleech", value: 0 },
        { name: "25% Freeleech", value: 25 },
        { name: "50% Freeleech", value: 50 },
        { name: "75% Freeleech", value: 75 },
        { name: "100% Freeleech", value: 100 },
        { name: "Double Upload", value: "doubleup" }, // 双倍上传
        { name: "Featured", value: "featured" }, // 精选
        { name: "Refundable", value: "refundable" }, //可退还的
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
            params[value] = 1; // 双倍上传和精选使用 1 来表示
          } else {
            params.free.push(value); // 其他优惠使用 free 数组
          }
        });
        return { requestConfig: { params } };
      },
    },
    {
      name: "标签",
      key: "tags",
      options: [
        { name: "内部组", value: "internal" },
        { name: "个人发布", value: "personalRelease" },
        { name: "Trumpable", value: "trumpable" },
        { name: "高速", value: "highspeed" },
        { name: "收藏", value: "bookmarked" },
        { name: "想要", value: "wished" },
      ],
      cross: { mode: "append", key: "" }, //  站点构造为  &exclusive=true ，但实际上与  &exclusive=1 相同
    },
    {
      name: "活跃度",
      key: "health",
      options: [
        { name: "存活", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "坟场", value: "graveyard" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "记录",
      key: "record",
      options: [
        { name: "Not Downloaded", value: "notDownloaded" },
        { name: "Downloaded", value: "downloaded" },
        { name: "Seeding", value: "seeding" },
        { name: "Leeching", value: "leeching" },
        { name: "Incomplete", value: "incomplete" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Primary Language",
      key: "primaryLanguageNames",
      options: buildCategoryOptions([["cn", "en", "es", "fr", "it", "ja", "ko", "ms", "ru", "tl", "tr", "xx", "zh"]]),
      cross: { mode: "brackets" },
    },
  ],

};

export default class JPTV4us extends Unit3D {
  protected override async getUserNameFromSite(): Promise<string> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: indexDocument } = await this.request<Document>(
      {
        url: "/torrents",
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(
      indexDocument,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      this.metadata.userInfo?.selectors?.name!,
    );
  }
};
