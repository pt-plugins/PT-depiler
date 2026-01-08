/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/AlphaRatio.cs
 */
import type { ISiteMetadata, ITorrent, IUserInfo } from "../types";
import GazelleJSONAPI, { SchemaMetadata, torrentBrowseResult } from "../schemas/GazelleJSONAPI";
import { set, unset } from "es-toolkit/compat";
import { toMerged } from "es-toolkit";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "alpharatio",
  name: "AlphaRatio",
  aka: ["AR"],
  description: "AlphaRatio (AR) is a Private Torrent Tracker for 0DAY / GENERAL",
  tags: ["综合", "0day"],
  timezoneOffset: "+0000",

  collaborator: ["enigamz"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://alpharatio.cc/"],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { value: 1, name: "Tv/SD" },
        { value: 2, name: "Tv/HD" },
        { value: 3, name: "Tv/UHD" },
        { value: 4, name: "Tv/DVDRip" },
        { value: 5, name: "Tv/PackSD" },
        { value: 6, name: "Tv/PackHD" },
        { value: 7, name: "Tv/PackUHD" },
        { value: 8, name: "Movie/SD" },
        { value: 9, name: "Movie/HD" },
        { value: 10, name: "Movie/UHD" },
        { value: 11, name: "Movie/PackSD" },
        { value: 12, name: "Movie/PackHD" },
        { value: 13, name: "Movie/PackUHD" },
        { value: 14, name: "Movie/XXX" },
        { value: 15, name: "Bluray" },
        { value: 16, name: "Anime/SD" },
        { value: 17, name: "Anime/HD" },
        { value: 18, name: "Games/PC" },
        { value: 19, name: "Games/xBox" },
        { value: 20, name: "Games/PS" },
        { value: 21, name: "Games/Nin" },
        { value: 22, name: "Apps/Windows" },
        { value: 23, name: "Apps/MAC" },
        { value: 24, name: "Apps/Linux" },
        { value: 25, name: "Apps/Mobile" },
        { value: 26, name: "0day/XXX" },
        { value: 27, name: "eBook" },
        { value: 28, name: "AudioBook" },
        { value: 29, name: "Music" },
        { value: 30, name: "Misc" },
      ],
      cross: { mode: "append" },
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          if (keywords) {
            unset(requestConfig!, SchemaMetadata.search!.keywordPath!);
            set(requestConfig!, "params.taglist", keywords);
          }
          return requestConfig!;
        },
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      donation: { selector: "li:contains('Donated:')", filters: [{ name: "parseNumber" }] },
      seedingBonus: { selector: "li:contains('SeedBonus:')", filters: [{ name: "parseNumber" }] },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Mortal",
    },
    {
      id: 2,
      name: "Philosopher",
      interval: "P4W",
      uploaded: "80GB",
      seedingBonus: 60000,
      // 普通用户无法查看 H&R 信息
      // hnrUnsatisfied: 0,
      privilege: "Mortal privileges plus can invite users, upload torrents, and submit requests.",
    },
    {
      id: 3,
      name: "Gladiator",
      interval: "P8W",
      uploaded: "260GB",
      seedingBonus: 120000,
      // hnrUnsatisfied: 0,
      privilege: "Philosopher privileges plus can use bookmarks and view top ten user/torrent stats.",
    },
    {
      id: 4,
      name: "Giant",
      interval: "P12W",
      uploaded: "600GB",
      seedingBonus: 360000,
      // hnrUnsatisfied: 0,
      privilege: "Gladiator privileges plus can create polls in the forum.",
    },
    {
      id: 5,
      name: "Centaur",
      interval: "P18W",
      uploaded: "1.6TB",
      seedingBonus: 720000,
      // hnrUnsatisfied: 0,
      privilege: "Giant privileges.",
    },
    {
      id: 6,
      name: "Sphinx",
      interval: "P26W",
      uploaded: "3.2TB",
      seedingBonus: 1440000,
      // hnrUnsatisfied: 0,
      privilege: "Centaur privileges plus access to the Invite Forum.",
    },
    {
      id: 7,
      name: "Harpy",
      interval: "P38W",
      uploaded: "6TB",
      seedingBonus: 1920000,
      // hnrUnsatisfied: 0,
      privilege: "Sphinx privileges.",
    },
    {
      id: 8,
      name: "Satyr",
      interval: "P60W",
      uploaded: "12TB",
      seedingBonus: 2400000,
      // hnrUnsatisfied: 0,
      privilege: "Harpy privileges plus exemption from hit and runs and can see other users' active torrents.",
    },
    {
      id: 9,
      name: "Adonis",
      interval: "P60W",
      uploaded: "12TB",
      seedingBonus: 2000000,
      // hnrUnsatisfied: 0,
      donation: 50,
      privilege: "Harpy privileges plus exemption from hit and runs and can see other users' active torrents.",
    },
    {
      id: 10,
      name: "Cyclops",
      interval: "P90W",
      uploaded: "18TB",
      seedingBonus: 4800000,
      // hnrUnsatisfied: 0,
      privilege: "Satyr privileges.",
    },
    {
      id: 11,
      name: "Chimera",
      interval: "P90W",
      uploaded: "18TB",
      seedingBonus: 4000000,
      // hnrUnsatisfied: 0,
      donation: 200,
      privilege: "Satyr privileges.",
    },
    {
      id: 12,
      name: "Deity",
      groupType: "vip",
      privilege:
        "Given by Staff at their discretion. Same as Satyr privileges plus can send invites even when invites are closed.",
    },
    {
      id: 13,
      name: "Spartan",
      groupType: "vip",
      interval: "P120W",
      uploaded: "10TB",
      seedingBonus: 6200000,
      // hnrUnsatisfied: 0,
      donation: 400,
      privilege: "Same as Deity privileges.",
    },
  ],
};

export default class AlphaRatio extends GazelleJSONAPI {
  protected override async transformUnGroupTorrent(group: torrentBrowseResult): Promise<ITorrent> {
    const torrent = await super.transformUnGroupTorrent(group);
    torrent.tags?.push({ name: "H&R" });

    const imdbRe = /tt\d+/;
    const imdbId = group.tags.find((tag) => imdbRe.test(tag))?.match(imdbRe)?.[0];
    if (imdbId) {
      torrent.ext_imdb = imdbId;
    }

    return torrent;
  }

  protected override async getUserExtendInfo(userId: number): Promise<Partial<IUserInfo>> {
    const flushUserInfo = await super.getUserExtendInfo(userId);

    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userPage } = await this.request<Document>({
      url: "/user.php",
      params: {
        id: userId,
      },
      responseType: "document",
    });

    return toMerged(
      flushUserInfo,
      this.getFieldsData(userPage, this.metadata.userInfo!.selectors!, [
        "donation",
        "seedingBonus",
      ] as (keyof Partial<IUserInfo>)[]) as Partial<IUserInfo>,
    );
  }
}
