/**
 * 0DayFiles is based on UNIT3D 9.2.0 and uses the current data-table layout.
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

const categoryOptions = [
  { name: "Movies/480p", value: 9 },
  { name: "Movies/4K", value: 10 },
  { name: "Movies/Bluray", value: 11 },
  { name: "Movies/Bluray-Full", value: 12 },
  { name: "Movies/Cam", value: 13 },
  { name: "Movies/DVD-R", value: 14 },
  { name: "Movies/Packs", value: 17 },
  { name: "Movies/x264", value: 18 },
  { name: "Movies/x265", value: 19 },
  { name: "Movies/XviD", value: 20 },
  { name: "Movies/WEB", value: 58 },
  { name: "TV/480p", value: 21 },
  { name: "TV/4K", value: 22 },
  { name: "TV/Bluray", value: 23 },
  { name: "TV/DVD-Rip", value: 25 },
  { name: "TV/Mobile", value: 26 },
  { name: "TV/Packs", value: 28 },
  { name: "TV/x264", value: 30 },
  { name: "TV/x265", value: 31 },
  { name: "TV/XviD", value: 32 },
  { name: "TV/WEB", value: 59 },
  { name: "Nintendo", value: 33 },
  { name: "PC/Games", value: 34 },
  { name: "Music/Audio", value: 38 },
  { name: "Music/Flac", value: 39 },
  { name: "Music/Packs", value: 41 },
  { name: "Music/Video", value: 42 },
  { name: "Anime", value: 43 },
  { name: "Audio Books", value: 44 },
  { name: "Books", value: 46 },
  { name: "Documentary", value: 48 },
  { name: "Educational", value: 49 },
  { name: "Mac", value: 51 },
  { name: "Software", value: 1 },
  { name: "XXX/0Day", value: 54 },
  { name: "XXX/Movies", value: 55 },
  { name: "XXX/Packs", value: 56 },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "0dayfiles",
  name: "0DayFiles",
  aka: ["0DF"],
  description: "0DayFiles is a private torrent tracker for movies, TV, music, games, software, books and more.",
  tags: ["影视", "音乐", "游戏", "软件", "综合", "成人"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://0dayfiles.net/"],
  favicon: "https://0dayfiles.net/favicon.ico",

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: categoryOptions,
      cross: { mode: "brackets" },
    },
    {
      name: "状态",
      key: "torrentStatus",
      options: [
        { name: "Alive", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "Graveyard", value: "graveyard" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const values = (Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]) as string[];
        return {
          requestConfig: {
            params: Object.fromEntries(values.map((value) => [value, 1])),
          },
        };
      },
    },
    {
      name: "筛选",
      key: "torrentFilter",
      options: [
        { name: "Freeleech", value: "freeleech" },
        { name: "Bookmarked", value: "bookmarked" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const values = (Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]) as string[];
        return {
          requestConfig: {
            params: Object.fromEntries(values.map((value) => [value, 1])),
          },
        };
      },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      rows: {
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
      category: {
        selector: "div.torrent-search--list__category img",
        attr: "alt",
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        {
          name: "Free",
          selector: "span.torrent-badge--freeleech",
          color: "blue",
        },
        {
          name: "New",
          selector: "span.torrent-badge--new",
          color: "green",
        },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      bonusPerHour: {
        selector: "dl.key-value > div:has(dt:contains('Points per hour')) > dd",
        filters: [{ name: "parseNumber" }],
      },
      seedingTime: {
        selector: "dt:contains('Total seedtime') + dd",
        filters: [{ name: "parseDuration" }],
      },
      isDonor: {
        selector: "dt:contains('Active donor') + dd",
        elementProcess: (element: Element) => element.querySelector("i.fa-check") !== null,
      },
    },
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["name"],
      },
      {
        requestConfig: { url: "/users/$name$", responseType: "document" },
        assertion: { name: "url" },
        fields: [
          "id",
          "uploaded",
          "downloaded",
          "ratio",
          "trueRatio",
          "bonus",
          "seeding",
          "leeching",
          "seedingSize",
          "averageSeedingTime",
          "levelName",
          "messageCount",
          "uploads",
          "joinTime",
          "lastAccessAt",
          "invites",
          "seedingTime",
          "isDonor",
        ],
      },
      {
        requestConfig: { url: "/users/$name$/earnings", responseType: "document" },
        assertion: { name: "url" },
        fields: ["bonusPerHour"],
      },
      {
        // Unit3D exposes the H&R counters on a separate page.
        requestConfig: { url: "/users/$name$/hit-and-runs", responseType: "document" },
        assertion: { name: "url" },
        selectors: {
          hnrUnsatisfied: {
            text: 0,
            selector: [
              "div.hnr-tile:has(span.hnr-tile__label:contains('Torrents needing seeding')) span.hnr-tile__value",
              "div.hnr-tiles > div.hnr-tile:nth-child(1) > span.hnr-tile__value",
            ],
            filters: [{ name: "parseNumber" }],
          },
          // The standard user-info model has no separate active-warning field, so retain this counter in hnrPreWarning.
          hnrPreWarning: {
            text: 0,
            selector: [
              "div.hnr-tile:has(span.hnr-tile__label:contains('Already warned')) span.hnr-tile__value",
              "div.hnr-tiles > div.hnr-tile:nth-child(2) > span.hnr-tile__value",
            ],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },

  // Source: https://0dayfiles.net/pages/2
  levelRequirements: [
    {
      id: 0,
      name: "Leech",
      privilege: "Ratio below 0.40; new downloads are restricted",
    },
    {
      id: 1,
      name: "User",
      ratio: 0.4,
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB", // The promotion calculator displays the live threshold in TiB.
      ratio: 0.4,
      interval: "P1M",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      ratio: 0.4,
      interval: "P2M",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      ratio: 0.4,
      interval: "P3M",
      privilege: "Trusted uploads",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      ratio: 0.4,
      interval: "P6M",
      privilege: "Trusted uploads",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      ratio: 0.4,
      interval: "P1Y",
      privilege: "Freeleech",
    },
    {
      id: 7,
      name: "Seeder",
      seedingSize: "5TiB",
      averageSeedingTime: "P30D",
      ratio: 0.4,
      interval: "P1M",
      privilege: "Trusted uploads; immune to Hit & Run",
    },
    {
      id: 8,
      name: "Archivist",
      seedingSize: "10TiB",
      averageSeedingTime: "P60D",
      ratio: 0.4,
      interval: "P3M",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run",
    },
    {
      id: 100,
      name: "Trustee",
      groupType: "vip",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run",
    },
    {
      id: 101,
      name: "Internal",
      groupType: "vip",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run",
    },
    {
      id: 200,
      name: "Uploader",
      groupType: "manager",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run",
    },
    {
      id: 201,
      name: "Editor",
      groupType: "manager",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run",
    },
    {
      id: 202,
      name: "Torrent Moderator",
      groupType: "manager",
      privilege: "Editor privileges and torrent moderation tools",
    },
    {
      id: 203,
      name: "Moderator",
      groupType: "manager",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run; moderation tools",
    },
    {
      id: 204,
      name: "Administrator",
      groupType: "manager",
      privilege: "Administrator tools",
    },
    {
      id: 205,
      name: "Owner",
      groupType: "manager",
      privilege: "Full site access",
    },
    {
      id: 206,
      name: "Bot",
      groupType: "manager",
      privilege: "Trusted uploads; Freeleech; immune to Hit & Run; full posting tools",
    },
  ],
};
