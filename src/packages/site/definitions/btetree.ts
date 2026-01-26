import type { ISearchInput, ISiteMetadata, ITorrent } from "../types";
import BittorrentSite from "../schemas/AbstractBittorrentSite.ts";
import { parseValidTimeString } from "../utils/datetime.ts";

const torrentYearMap = [
  // year, min torrent_id in this year
  [2004, 2204],
  [2005, 10368],
  [2006, 21306],
  [2007, 502958],
  [2008, 512029],
  [2009, 521346],
  [2010, 531218],
  [2011, 541379],
  [2012, 551321],
  [2013, 561096],
  [2014, 569309],
  [2015, 577205],
  [2016, 584158],
  [2017, 590609],
  [2018, 597003],
  [2019, 603585],
  [2020, 608148],
  [2021, 611609],
  [2022, 614780],
  [2023, 617776],
  [2024, 621061],
  [2025, 623102],
  [2026, 625197],
];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "btetree",
  name: "BT.etree",
  description: "BT.etree is a Public Tracker dedicated to Bootleg FLAC MUSIC",
  tags: ["音乐"],
  timezoneOffset: "-0500",

  type: "public",
  urls: ["https://bt.etree.org/"],

  search: {
    keywordPath: "params.searchzzzz",
    requestConfig: {
      params: { cat: 0 },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: 'table[bgcolor="#CCCCCC"] tbody tr:gt(0)' }, // 不要第一行
      id: {
        selector: "td:nth-child(2) a.details_link",
        attr: "href",
        filters: [{ name: "querystring", args: ["torrentId"] }],
      },
      title: { selector: "td:nth-child(2) a.details_link b" },
      url: { selector: "td:nth-child(2) a.details_link", attr: "href" },
      link: { selector: "td:nth-child(3) a", attr: "href" },
      time: { selector: "td:nth-child(5)" },
      size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },
      author: { selector: "td:nth-child(1)" },
      seeders: { selector: "td:nth-child(8)" },
      leechers: { selector: "td:nth-child(9)" },
      completed: { selector: "td:nth-child(7)", filters: [{ name: "parseNumber" }] },
      category: { text: "Music" },
    },
  },

  list: [{ urlPattern: [/\/$/, "/index.php"], mergeSearchSelectors: true }],
  detail: {
    urlPattern: ["/details.php"],
    selectors: {
      title: { selector: "td.heading:contains('Show') + td" },
      link: { selector: "a.index[href^='download.php/']", attr: "href" },
    },
  },
};

export default class BtEtree extends BittorrentSite {
  /**
   * 这个站的 time 格式为 MM/dd HH:mm ，缺少 year 信息，所以需要hack下时间解析的方法
   * @param torrent
   * @param row
   * @param searchConfig
   * @protected
   */
  protected parseTorrentRowForTime(torrent: Partial<ITorrent> = {}, row: Element, searchConfig: ISearchInput) {
    // 如果还没解析出来id，则强行解析一次，以保证能拿到id
    if (!torrent.id) {
      torrent.id = this.getFieldData(row, searchConfig!.searchEntry!.selectors!.id!);
    }
    const torrentId = torrent.id ? parseInt(torrent.id as string) : 0;

    // 首先尝试查表得到 year
    let torrentYear = 2003; // 2003年之前的都归为2003年
    for (const [testYear, testTid] of torrentYearMap) {
      if (torrentId < testTid) {
        break;
      }
      torrentYear = testYear;
    }

    // 按照默认方式获取 MM/dd HH:mm 信息
    const torrentTimeByString = this.getFieldData(row, searchConfig!.searchEntry!.selectors!.time!);

    torrent.time = parseValidTimeString(`${torrentYear}/${torrentTimeByString}`, ["yyyy/MM/dd HH:mm"]) as number;
    return torrent;
  }
}
