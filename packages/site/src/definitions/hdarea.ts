import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDArea",
  timezoneOffset: "+0800",
  schema: "NexusPHP",
  type: "private",
  url: "https://www.hdarea.co/",
  description: "高清世界",
  tags: ["影视", "综合"],
  collaborator: "lzl20110",
  category: {
    key: "cat",
        options: [
          { value: 401, name: "Movies Blu-ray" },
          { value: 415, name: "Movies REMUX" },
          { value: 416, name: "Movies 3D" },
          { value: 410, name: "Movies 1080p" },
          { value: 411, name: "Movies 720p" },
          { value: 414, name: "Movies DVD" },
          { value: 412, name: "Movies WEB-DL" },
          { value: 413, name: "Movies HDTV" },
          { value: 417, name: "Movies iPad" },
          { value: 404, name: "Documentaries" },
          { value: 405, name: "Animations" },
          { value: 402, name: "TV Series" },
          { value: 403, name: "TV Shows" },
          { value: 406, name: "Music Videos" },
          { value: 407, name: "Sports" },
          { value: 409, name: "Misc" },
          { value: 408, name: "HQ Audio" },
        ],
        cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: {
        selector: [
          "table[title='downloading'] > tbody > tr > td > div",
          "table[title='seeding'] > tbody > tr > td > div",
          "table[title='Stopped'] > tbody > tr > td > div",
          "table[title='completed'] > tbody > tr > td > div",
        ],
        attr: "style",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/width:.?(\d.+)%/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: [
          "table[title='downloading']:has( > tbody > tr > td > div)",
          "table[title='seeding']:has( > tbody > tr > td > div)",
          "table[title='Stopped']:has( > tbody > tr > td > div)",
          "table[title='completed']:has( > tbody > tr > td > div)",
        ],
        case: {
          "table[title='downloading']": ETorrentStatus.downloading,
          "table[title='seeding']": ETorrentStatus.seeding,
          "table[title='Stopped']": ETorrentStatus.inactive,
          "table[title='completed']": ETorrentStatus.completed,
        },
      },
    },
  },
};
