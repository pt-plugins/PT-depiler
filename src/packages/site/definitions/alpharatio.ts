/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/AlphaRatio.cs
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "alpharatio",
  name: "AlphaRatio",
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
      imdb: false,
    },
  },
};
