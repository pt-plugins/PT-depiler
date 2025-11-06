import urlJoin from "url-join";
import Sizzle from "sizzle";
import { mergeWith } from "es-toolkit";

import type { ISearchInput, ISiteMetadata, ITorrent, IUserInfo } from "../types";
import { EResultParseStatus } from "../types";
import { parseSizeString, createDocument } from "../utils";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

const categoryOptions = [
  { value: 8, name: "Movies :: Cam" },
  { value: 9, name: "Movies :: TS/TC" },
  { value: 11, name: "Movies :: DVDRip/DVDScreener" },
  { value: 37, name: "Movies :: WEBRip" },
  { value: 43, name: "Movies :: HDRip" },
  { value: 14, name: "Movies :: BlurayRip" },
  { value: 12, name: "Movies :: DVD-R" },
  { value: 13, name: "Movies :: Bluray" },
  { value: 47, name: "Movies :: 4K" },
  { value: 15, name: "Movies :: Boxsets" },
  { value: 29, name: "Movies :: Documentaries" },
  { value: 26, name: "TV :: Episodes" },
  { value: 32, name: "TV :: Episodes HD" },
  { value: 27, name: "TV :: Boxsets" },
  { value: 17, name: "Games :: PC" },
  { value: 42, name: "Games :: Mac" },
  { value: 18, name: "Games :: XBOX" },
  { value: 19, name: "Games :: XBOX360" },
  { value: 40, name: "Games :: XBOXONE" },
  { value: 20, name: "Games :: PS2" },
  { value: 21, name: "Games :: PS3" },
  { value: 39, name: "Games :: PS4" },
  { value: 22, name: "Games :: PSP" },
  { value: 28, name: "Games :: Wii" },
  { value: 30, name: "Games :: Nintendo DS" },
  { value: 48, name: "Games :: Nintendo Switch" },
  { value: 23, name: "Apps :: PC-ISO" },
  { value: 24, name: "Apps :: Mac" },
  { value: 25, name: "Apps :: Mobile" },
  { value: 33, name: "Apps :: 0-day" },
  { value: 38, name: "Education" },
  { value: 34, name: "Animation :: Anime" },
  { value: 35, name: "Animation :: Cartoons" },
  { value: 45, name: "Books :: EBooks" },
  { value: 46, name: "Books :: Comics" },
  { value: 31, name: "Music :: Audio" },
  { value: 16, name: "Music :: Music videos" },
  { value: 36, name: "Foreign :: Movies" },
  { value: 44, name: "Foreign :: TV Series" },
];

interface ITorrentLeechTorrent {
  fid: string;
  filename: string;
  name: string;
  addedTimestamp: string;
  categoryID: number;
  size: number;
  completed: number;
  seeders: number;
  leechers: number;
  numComments: number;
  tags: string;
  new: boolean;
  imdbID: string;
  rating: number;
  genres: string;
  tvmazeID: string;
  igdbID: string;
  animeID: string;
  download_multiplier: number;
  commentsDisabled: number;
}

interface IUploadsResponse {
  aaData: any[][];
  iTotalRecords: number;
  iTotalDisplayRecords: number;
  sEcho: number;
}

export const siteMetadata: ISiteMetadata = {
  id: "torrentleech",
  version: 1,
  name: "TorrentLeech",
  aka: ["TL"],
  description: "TorrentLeech (TL) is a Private Torrent Tracker for 0DAY / GENERAL. not here _ not scene",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: [
    "https://www.torrentleech.org/",
    "https://www.torrentleech.cc/",
    "https://www.torrentleech.me/",
    "https://www.tleechreload.org/",
    "https://www.tlgetin.cc/",
  ],

  category: [
    {
      name: "Category",
      key: "category",
      options: categoryOptions,
      cross: { mode: "custom" },
      generateRequestConfig(value) {
        const categoryString = Array.isArray(value) ? value.join(",") : value;
        return {
          requestConfig: {
            url: `/torrents/browse/list/categories/${categoryString}/query`,
          },
        };
      },
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents/browse/list/query",
      responseType: "json",
    },
    advanceKeywordParams: {
      imdb: { enabled: true },
    },

    requestConfigTransformer: ({ keywords, searchEntry, requestConfig }) => {
      const baseUrl = requestConfig!.url || "";
      if (keywords) {
        delete requestConfig!.params?.keywords;

        keywords = keywords.replace(/(^|\s)-/, "");
        requestConfig!.url = urlJoin(baseUrl, `${keywords}`);
      }

      return requestConfig!;
    },
    selectors: {
      rows: { selector: "torrentList" },
      id: { selector: "fid" },
      title: { selector: "name" },
      url: { selector: "fid", filters: [{ name: "prepend", args: ["/torrent/"] }] },
      link: {
        selector: ":self",
        filters: [(row: ITorrentLeechTorrent) => "/download/" + row.fid + "/" + row.filename],
      },
      time: { selector: "addedTimestamp", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      author: { selector: "uploader" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "numComments" },
      category: {
        selector: "categoryID",
        filters: [(categoryId: number) => categoryOptions.find((cat) => cat.value == categoryId)?.name ?? "Unknown"],
      },

      ext_imdb: { selector: "imdbID" },
    },
  },

  list: [
    {
      urlPattern: ["/torrents/browse"],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "table.torrents tr.torrent" },
        id: { selector: ":self", data: "tid" },
        category: { selector: "a.category[data-ccid]", data: "ccid" },
        title: {
          selector: "div.name",
          elementProcess: (el) => {
            el?.querySelectorAll("span")?.forEach((span: HTMLSpanElement) => span?.remove());
            return el?.textContent?.trim() ?? "";
          },
        },
        url: { selector: "div.name a", attr: "href" },
        link: { selector: "a.download", attr: "href" },
        seeders: { selector: "td.td-seeders" },
        leechers: { selector: "td.td-leechers" },
        completed: { selector: "td.td-snatched" },
        size: { selector: "td.td-size", filters: [{ name: "parseSize" }] },
        time: { selector: "td.td-uploaded-time", filters: [{ name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss"] }] },
      },
    },
  ],

  detail: {
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      id: { selector: 'input[name="torrentID"]', attr: "value" },
      title: { selector: ["#torrentnameid", "#torrentName"] },
      link: { selector: "#detailsDownloadButton", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          name: { selector: "span.centerTopBar span[onclick*='/profile/'][onclick*='view']" },
          uploaded: { selector: "span.centerTopBar div[title^='Uploaded'] span", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "span.centerTopBar div[title^='Downloaded'] span", filters: [{ name: "parseSize" }] },
          bonus: { selector: "span.centerTopBar span.total-TL-points", filters: [{ name: "parseNumber" }] },
          messageCount: {
            text: "0",
            selector: "span.div-menu-item[onclick*='/notifications'] div.notificatinTooltip span.tooltip-title",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/profile/$name$", responseType: "document" },
        assertion: { name: "url" },
        selectors: {
          id: {
            selector: "div.has-support-msg script",
            filters: [(text: string) => text.match(/var userLogUserID = '(\d+)';/)?.[1] ?? ""],
          },
          levelName: { selector: "div.profile-details div.label-user-class" },
          joinTime: {
            selector: "table.profileViewTable td:contains('Registration date') + td",
            filters: [{ name: "parseTime", args: ["EEEE do MMMM yyyy"] }],
          },
        },
      },
      {
        requestConfig: { 
          url: "/user/account/uploadedtorrents", 
          method: "POST",
          responseType: "json",
          data: {
            sEcho: "1",
            iColumns: "6",
            sColumns: "categoryID,name,size,completed,seeders,leechers",
            iDisplayStart: "0",
            iDisplayLength: "50",
            mDataProp_0: "0",
            sSearch_0: "",
            bRegex_0: "false",
            bSearchable_0: "true",
            bSortable_0: "false",
            mDataProp_1: "1",
            sSearch_1: "",
            bRegex_1: "false",
            bSearchable_1: "true",
            bSortable_1: "false",
            mDataProp_2: "2",
            sSearch_2: "",
            bRegex_2: "false",
            bSearchable_2: "true",
            bSortable_2: "true",
            mDataProp_3: "3",
            sSearch_3: "",
            bRegex_3: "false",
            bSearchable_3: "true",
            bSortable_3: "true",
            mDataProp_4: "4",
            sSearch_4: "",
            bRegex_4: "false",
            bSearchable_4: "true",
            bSortable_4: "true",
            mDataProp_5: "5",
            sSearch_5: "",
            bRegex_5: "false",
            bSearchable_5: "true",
            bSortable_5: "true",
            sSearch: "",
            bRegex: "false",
            iSortCol_0: "0",
            sSortDir_0: "asc",
            iSortingCols: "1",
            userID: "$id$"
          },
          headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
          }
        },
        assertion: { id: "valid" },
        selectors: {
          uploads: {
            selector: ":self",
            filters: [
              (response: IUploadsResponse) => response.iTotalRecords || 0
            ]
          }
        },
      },
    ],
  },
  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P2W",
      uploaded: "200GB",
      ratio: 1.1,
      privilege: "Increased Points: 3%, Minimum Seeding Time: 8 days",
    },
    {
      id: 2,
      name: "Super User",
      interval: "P12W",
      uploaded: "1TB",
      ratio: 2.0,
      privilege: "Increased Points: 5%, Minimum Seeding Time: 7 days",
    },
    {
      id: 3,
      name: "Extreme User",
      interval: "P24W",
      uploaded: "10TB",
      ratio: 5.0,
      privilege: "Increased Points: 6%, Minimum Seeding Time: 6 days",
    },
    {
      id: 4,
      name: "TL GOD",
      interval: "P52W",
      uploaded: "50TB",
      ratio: 8.0,
      privilege: "Increased Points: 8%, Minimum Seeding Time: 4 days",
    },
  ],
};

export default class TorrentLeech extends PrivateSite {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);

    if (
      flushUserInfo.status === EResultParseStatus.success &&
      (typeof flushUserInfo.seeding === "undefined" || typeof flushUserInfo.seedingSize === "undefined")
    ) {
      flushUserInfo = await this.parseUserInfoForSeedingStatus(flushUserInfo);
    }

    if (
      flushUserInfo.status === EResultParseStatus.success &&
      flushUserInfo.id &&
      (typeof flushUserInfo.uploads === "undefined" || typeof flushUserInfo.uploads === "number")
    ) {
      flushUserInfo = await this.parseUserInfoForUploads(flushUserInfo);
    }

    return flushUserInfo;
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: ITorrentLeechTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    torrent.tags ??= [];
    if (row.tags?.includes("FREELEECH")) {
      torrent.tags.push({ name: "Free", color: "blue" });
    }
    torrent.tags.push({ name: "H&R", color: "red" });

    return torrent;
  }

  protected async parseUserInfoForSeedingStatus(flushUserInfo: Partial<IUserInfo>): Promise<IUserInfo> {
    let seedStatus = { seeding: 0, seedingSize: 0 };

    const userName = flushUserInfo.name as string;
    const { data } = await this.request<string>({
      url: `/profile/${userName}/seeding`,
    });

    if (data && data.includes("profile-seedingTable")) {
      const userSeedingPage = createDocument(data);

      const sizeElements = Sizzle(
        "table#profile-seedingTable > tbody > tr > td:nth-child(2)",
        userSeedingPage as Document,
      );

      seedStatus.seeding = sizeElements.length;

      sizeElements.forEach((sizeElement) => {
        const sizeText = sizeElement.textContent?.trim() || "0";
        seedStatus.seedingSize += parseSizeString(sizeText);
      });
    }

    return mergeWith(flushUserInfo, seedStatus, (objValue, srcValue) => {
      return typeof srcValue === "undefined" ? objValue : srcValue;
    }) as IUserInfo;
  }

  protected async parseUserInfoForUploads(flushUserInfo: Partial<IUserInfo>): Promise<IUserInfo> {
    const userId = flushUserInfo.id as string;
    
    if (!userId) {
      return flushUserInfo as IUserInfo;
    }

    try {
      const { data } = await this.request<IUploadsResponse>({
        url: "/user/account/uploadedtorrents",
        method: "POST",
        data: {
          sEcho: "1",
          iColumns: "6",
          sColumns: "categoryID,name,size,completed,seeders,leechers",
          iDisplayStart: "0",
          iDisplayLength: "50",
          mDataProp_0: "0",
          sSearch_0: "",
          bRegex_0: "false",
          bSearchable_0: "true",
          bSortable_0: "false",
          mDataProp_1: "1",
          sSearch_1: "",
          bRegex_1: "false",
          bSearchable_1: "true",
          bSortable_1: "false",
          mDataProp_2: "2",
          sSearch_2: "",
          bRegex_2: "false",
          bSearchable_2: "true",
          bSortable_2: "true",
          mDataProp_3: "3",
          sSearch_3: "",
          bRegex_3: "false",
          bSearchable_3: "true",
          bSortable_3: "true",
          mDataProp_4: "4",
          sSearch_4: "",
          bRegex_4: "false",
          bSearchable_4: "true",
          bSortable_4: "true",
          mDataProp_5: "5",
          sSearch_5: "",
          bRegex_5: "false",
          bSearchable_5: "true",
          bSortable_5: "true",
          sSearch: "",
          bRegex: "false",
          iSortCol_0: "0",
          sSortDir_0: "asc",
          iSortingCols: "1",
          userID: userId
        },
        headers: {
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      if (data && data.aaData) {
        const uploadsData = {
          uploads: data.iTotalRecords || 0,
          uploadsList: data.aaData.map((item: any[]) => ({
            category: item[0] || "",
            name: item[1] || "",
            size: item[2] || "",
            completed: item[3] || "",
            seeders: item[4] || "",
            leechers: item[5] || ""
          }))
        };

        return mergeWith(flushUserInfo, uploadsData, (objValue, srcValue) => {
          return typeof srcValue === "undefined" ? objValue : srcValue;
        }) as IUserInfo;
      }
    } catch (error) {
      // 静默处理错误，不影响主要功能
    }

    return flushUserInfo as IUserInfo;
  }
}
