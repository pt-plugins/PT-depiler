import type { AxiosRequestConfig } from "axios";
import type { ISearchFilter, ISiteMetadata } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";
import Sizzle from "sizzle";
import urlJoin from "url-join";
import dayjs from "../utils/datetime";
import { parseSizeString } from "../utils";

interface rawTorrent {
  addedTimestamp: string;
  categoryID: number;
  completed: number;
  download_multiplier: number;
  fid: string;
  filename: `${string}.torrent`;
  genres: string;
  igdbID: string;
  imdbID: string;
  leechers: number;
  name: string;
  new: boolean;
  numComments: number;
  rating: number;
  seeders: number;
  size: number;
  tags: string[];
  tvmazeID: string;
}

export const siteMetadata: ISiteMetadata = {
  name: "TorrentLeech",
  type: "private",
  timezoneOffset: "+0000",
  description: "TorrentLeech",
  url: "https://www.torrentleech.org/",
  tags: ["综合"],
  category: {
    key: "category",
    options: [
      { value: 8, name: "Cam" },
      { value: 9, name: "TS/TC" },
      { value: 11, name: "DVDRip/DVDScreener" },
      { value: 37, name: "WEBRip" },
      { value: 43, name: "HDRip" },
      { value: 14, name: "BlurayRip" },
      { value: 12, name: "DVD-R" },
      { value: 13, name: "Bluray" },
      { value: 47, name: "4K" },
      { value: 15, name: "Boxsets" },
      { value: 29, name: "Documentaries" },
      { value: 26, name: "Episodes" },
      { value: 32, name: "Episodes HD" },
      { value: 27, name: "Boxsets" },
      { value: 17, name: "PC" },
      { value: 42, name: "Mac" },
      { value: 18, name: "XBOX" },
      { value: 19, name: "XBOX360" },
      { value: 40, name: "XBOXONE" },
      { value: 20, name: "PS2" },
      { value: 21, name: "PS3" },
      { value: 39, name: "PS4" },
      { value: 22, name: "PSP" },
      { value: 28, name: "Wii" },
      { value: 30, name: "Nintendo DS" },
      { value: 48, name: "Nintendo Switch" },
      { value: 23, name: "PC-ISO" },
      { value: 24, name: "Mac" },
      { value: 25, name: "Mobile" },
      { value: 33, name: "0-day" },
      { value: 38, name: "Education" },
      { value: 34, name: "Anime" },
      { value: 35, name: "Cartoons" },
      { value: 45, name: "EBooks" },
      { value: 46, name: "Comics" },
      { value: 31, name: "Audio" },
      { value: 16, name: "Music videos" },
      { value: 36, name: "Movies" },
      { value: 44, name: "TV Series" },
    ],
  },
  search: {
    selectors: {
      rows: { selector: "torrentList" },
      id: { selector: "fid" },
      title: { selector: "name" },
      url: {
        selector: ":self",
        filters: [(torrent: rawTorrent) => `/torrent/${torrent.fid}`],
      },
      link: {
        selector: ":self",
        filters: [
          (torrent: rawTorrent) => `/download/${torrent.fid}/${torrent.filename}`,
        ],
      },
      time: { selector: "addedTimestamp" },
      size: { selector: "size" },
      author: { text: "" },
      category: { selector: "categoryID" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      comments: { selector: "numComments" },
    },
  },
  userInfo: {
    pickLast: ["name", "id", "joinTime"],
    process: [
      {
        requestConfig: { url: "/" },
        fields: ["name"],
      },
      {
        requestConfig: { url: "/profile/$userName$" },
        assertion: { name: "userName" },
        fields: [
          "id",
          "uploaded",
          "downloaded",
          "bonus",
          "messageCount",
          "levelName",
          "joinTime",
        ],
      },
      {
        requestConfig: { url: "/profile/$userName$/seeding" },
        assertion: { name: "userName" },
        fields: ["seeding", "seedingSize"],
      },
    ],
    selectors: {
      // url: '/'
      name: {
        selector: ["span.centerTopBar span[onclick*='/profile/'][onclick*='view']"],
      },
      // page: '/profile/$user.name$',
      uploaded: {
        selector: ["span.centerTopBar div[title^='Uploaded'] span"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["span.centerTopBar div[title^='Downloaded'] span"],
        filters: [{ name: "parseSize" }],
      },
      bonus: {
        selector: ["span.centerTopBar span.total-TL-points"],
        filters: [(query: string) => query.replace(/,/g, ""), parseFloat],
      },
      messageCount: {
        text: 0,
        selector: ["a[href='/content/articles'] i.news-notify"],
        filters: [() => 255],
      },
      id: {
        selector: ["div.has-support-msg script"],
        filters: [
          (query: string) => query.match(/var userLogUserID = '(\d+)';/)![1],
          parseInt,
        ],
      },
      levelName: {
        selector: ["div.profile-details div.label-user-class"],
      },
      joinTime: {
        selector: ["table.profileViewTable td:contains('Registration date') + td"],
        filters: [
          (query: string) => {
            const date = query.split(" ").slice(1).join(" ");
            return dayjs(date, "Do MMMM YYYY").valueOf();
          },
        ],
      },
      // url: '/profile/$userName$/seeding',
      seeding: {
        selector: "table#profile-seedingTable > tbody",
        elementProcess: (tbody: HTMLElement) => {
          const trAnother = Sizzle("> tr", tbody);
          return trAnother.length;
        },
      },
      seedingSize: {
        selector: "table#profile-seedingTable > tbody",
        elementProcess: (tbody: HTMLElement) => {
          let seedingSize = 0;
          const trAnothers = Sizzle("> tr", tbody);
          trAnothers.forEach((tr) => {
            const sizeTd = Sizzle("> td:nth-child(2)", tr);
            seedingSize += parseSizeString((sizeTd[0] as HTMLElement).innerText.trim());
          });
          return seedingSize;
        },
      },
    },
  },
};

export default class torrentleech extends PrivateSite {
  protected override async transformSearchFilter(
    filter: ISearchFilter,
  ): Promise<AxiosRequestConfig> {
    const urlSearch = ["/torrents/browse/list"];

    if (filter.extraParams?.find((param) => param.key === "category")) {
      const categoryParams = filter.extraParams?.find(
        (param) => param.key === "category",
      );
      urlSearch.push(...["categories", categoryParams!.value as string]);
    }

    if (filter.keywords) {
      if (/tt\d{7,8}/.test(filter.keywords)) {
        urlSearch.push(...["imdbID", filter.keywords]);
      } else {
        urlSearch.push(...["query", filter.keywords]);
      }
    }

    return {
      url: urlJoin(urlSearch),
      responseType: "json",
    };
  }
}
