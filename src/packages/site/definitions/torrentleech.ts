import type { ISearchInput, ISiteMetadata, ITorrent } from "../types";
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
        // format: /torrents/browse/list/categories/<category1>,<category2>,.../query/<query>
        const categoryString = Array.isArray(value) ? value.join(",") : value;
        return {
          requestConfig: {
            url: `/torrents/browse/list/categories/${categoryString}`,
          },
        };
      },
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents/browse/list",
      responseType: "json",
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, searchEntry, requestConfig }) => {
          if (keywords) {
            delete requestConfig!.params?.keywords; // 移除 AbstractBittorrentSite 自动添加的 keywords 参数
            requestConfig!.url += `/facets/${encodeURIComponent("tags:" + keywords)}`;
          }
          return requestConfig!;
        },
      },
    },

    requestConfigTransformer: ({ keywords, searchEntry, requestConfig }) => {
      if (keywords) {
        delete requestConfig!.params?.keywords; // 移除 AbstractBittorrentSite 自动添加的 keywords 参数

        // remove dashes at the beginning of keywords as they exclude search strings (see Jackett/Jackett#3096)
        keywords = keywords.replace(/(^|\s)-/, "");

        requestConfig!.url += `/query/${encodeURIComponent(keywords)}`;
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
            el?.querySelectorAll("span")?.forEach((span: HTMLSpanElement) => span?.remove()); // 移除 span 标签
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
          // id: { selector: "span.centerTopBar span[onclick*='/profile/'][onclick*='view']" },
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
        assertion: { name: "url" }, // 替换之前获取的用户名
        selectors: {
          id: {
            selector: "div.has-support-msg script",
            filters: [(text: string) => text.match(/var userLogUserID = '(\\d+)';/)?.[1] ?? ""],
          },
          levelName: { selector: "div.profile-details div.label-user-class" },
          joinTime: {
            selector: "table.profileViewTable td:contains('Registration date') + td",
            filters: [{ name: "parseTime", args: ["EEEE do MMMM yyyy" /* 'Saturday 6th May 2017' */] }],
          },
        },
      },
      // FIXME 暂未实现 seeding, seedingSize, uploads （需要参照 uhdbits 构造翻页）
    ],
  },
  levelRequirements: [
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
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: ITorrentLeechTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    torrent.tags ??= [];
    if (row.tags?.includes("FREELEECH")) {
      torrent.tags.push({ name: "Free", color: "blue" });
    }

    return torrent;
  }
}
