import type { ISiteMetadata } from "../types";

const categoryMap = {
  29: "Anime",
  28: "Appz/Packs",
  42: "Audio Books",
  20: "Books",
  30: "Documentary",
  47: "Fonts",
  43: "Mac",

  96: "Movie/4K",
  25: "Movies/480p",
  11: "Movies/Bluray",
  5: "Movies/Bluray-Full",
  3: "Movies/DVD-R",
  21: "Movies/MP4",
  22: "Movies/Non-English",
  13: "Movies/Packs",
  44: "Movies/SD/x264",
  48: "Movies/x265",
  1: "Movies/XviD",

  17: "Music/Audio",
  23: "Music/Non-English",
  41: "Music/Packs",
  16: "Music/Video",
  27: "Music/Flac",

  45: "Podcast",

  4: "PC/Games",
  18: "PS3",
  8: "PSP",
  10: "Wii",
  9: "Xbox-360",

  24: "TV/480p",
  32: "TV/Bluray",
  31: "TV/DVD-R",
  33: "TV/DVD-Rip",
  46: "TV/Mobile",
  14: "TV/Packs",
  26: "TV/SD/x264",
  7: "TV/x264",
  34: "TV/x265",
  2: "TV/XviD",

  6: "XXX/Movies",
  15: "XXX/Packs",
};

export const siteMetadata: ISiteMetadata = {
  name: "TorrentsTD",
  type: "private",
  timezoneOffset: "+0000",
  description: "Torrents - TD",
  url: "https://www.torrentday.com/",
  tags: ["综合"],
  search: {
    keywordsParam: "q",
    requestConfig: {
      url: "t.json",
      responseType: "json",
    },
    selectors: {
      rows: { selector: ":self" },
      id: { selector: "t" },
      title: { selector: "name" },
      url: {
        selector: "t",
        filters: [(torrentId: number) => `/details.php?id=${torrentId}`],
      },
      link: {
        selector: "t",
        filters: [(torrentId: number) => `/download.php/${torrentId}/${torrentId}.torrent`],
      },
      time: { selector: "ctime" },
      size: { selector: "size" },
      // author: { selector: '' }  // FIXME
      category: {
        selector: "c",
        filters: [(q: keyof typeof categoryMap) => categoryMap[q] || "Other"],
      },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
    },
  },
  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/" },
        fields: ["id"],
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "id" },
        fields: [
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime",
          "seeding",
          "seedingSize",
          "messageCount",
        ],
      },
    ],
    selectors: {
      id: {
        selector: ["a[href*='/u/']:first", "a[href*='userdetails.php']:first"],
        attr: "href",
        switchFilters: [
          (query: string) => {
            const queryMatch = query.match(/u\/(.+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : "";
          },
          { name: "querystring", args: ["id"] },
        ],
      },
      uploaded: {
        selector: ["span.detailsInfoSpan:contains('Up: ') > span"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["span.detailsInfoSpan:contains('Down: ') > span"],
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: "span.detailsInfoSpan:contains('Ratio: ') > span",
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: "span.detailsInfoSpan:contains('Class: ') > span",
      },
      bonus: {
        selector: ["a[href='/mybonus.php']"],
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: "span.detailsInfoSpan:contains('Joined: ') > span",
        filters: [{ name: "parseTime" }],
      },
      seeding: {
        selector: ["a[href*='/peers?u='] > img[alt='downloads'] + span"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        text: "N/A",
      },
      messageCount: {
        selector: ["a[href='/m']:contains('You have')"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
};
