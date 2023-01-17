import type { AxiosRequestConfig } from "axios";
import type { ISearchFilter, ISiteMetadata } from "../types";
import BittorrentSite from "../schema/AbstractBittorrentSite";

export const siteMetadata: ISiteMetadata = {
  name: "ETTV",
  type: "public",
  description: "ETTV is a Public torrent site for TV / MOVIES, home of the  ETTV, ETHD and DTOne groups.",
  url: "https://www.ettvcentral.com/",
  legacyUrls: ["https://www.ettv.tv/", "https://www.ettv.to/", "https://www.ettvdl.com/", "https://www.ettv.be/"],
  category: {
    key: "cat",
    options: [
      { value: 88, name: "Adult - Books" },
      { value: 84, name: "Adult - Games" },
      { value: 82, name: "Adult - HD-Movies" },
      { value: 83, name: "Adult - Hentai" },
      { value: 86, name: "Adult - Magazines" },
      { value: 81, name: "Adult - Movies" },
      { value: 87, name: "Adult - Other" },
      { value: 85, name: "Adult - Pictures" },
      { value: 74, name: "Anime - Dubbed/Subbed" },
      { value: 73, name: "Anime - Movies" },
      { value: 75, name: "Anime - Others" },
      { value: 56, name: "Books - Audio" },
      { value: 55, name: "Books - Comics" },
      { value: 53, name: "Books - Ebooks" },
      { value: 54, name: "Books - Magazines" },
      { value: 68, name: "Books - Others" },
      { value: 90, name: "Books - Others" },
      { value: 58, name: "Games - Android" },
      { value: 71, name: "Games - Others" },
      { value: 57, name: "Games - Windows" },
      { value: 49, name: "Movies - 3D" },
      { value: 66, name: "Movies - BluRay Disc/Remux" },
      { value: 91, name: "Movies - Bollywood" },
      { value: 65, name: "Movies - CAM/TS" },
      { value: 80, name: "Documentary" },
      { value: 51, name: "Movies - Dubs/Dual Audio" },
      { value: 67, name: "Movies - DVDR" },
      { value: 1, name: "Movies - HD 1080p" },
      { value: 2, name: "Movies - HD 720p" },
      { value: 76, name: "Movies - HEVC/x265" },
      { value: 47, name: "Movies - X264/H264" },
      { value: 3, name: "Movies - UltraHD/4K" },
      { value: 42, name: "Movies - XviD" },
      { value: 60, name: "Music - FLAC" },
      { value: 59, name: "Music - MP3" },
      { value: 61, name: "Music - Music Videos" },
      { value: 69, name: "Music - Others" },
      { value: 95, name: "Others - Misc" },
      { value: 78, name: "Others - Unsorted" },
      { value: 63, name: "Software - Android" },
      { value: 64, name: "Software - Mac" },
      { value: 70, name: "Software - Others" },
      { value: 62, name: "Software - Windows" },
      { value: 94, name: "Tutorials - Tutorials" },
      { value: 79, name: "Documentary" },
      { value: 41, name: "TV - HD/X264/H264" },
      { value: 77, name: "TV - HEVC/x265" },
      { value: 5, name: "TV - SD/X264/H264" },
      { value: 50, name: "TV - SD/XVID" },
      { value: 72, name: "TV - Sport" },
      { value: 7, name: "TV - TV Packs" },
      { value: 89, name: "TV - UltraHD/4K" },
    ],
    cross: { mode: "append", key: "c" },
  },
  search: {
    requestConfig: {
      url: "/torrents-search.php",
      params: { lang: 0 },
    },
    keywordsParam: "search",
    selectors: {
      rows: {
        selector: "div.myFrame-content > div > table > tbody > tr[class]",
      },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/(\d+)/)![1]],
      },
      title: {
        selector: 'a[href^="/torrent/"][title]',
        attr: "title",
        filters: [(q: string) => q.replace(/ torrent$/, "")],
      },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      time: { selector: "td:nth-child(3)", filters: [{ name: "parseTTL" }] },
      size: { selector: "td:nth-child(4)" }, // 当值为 N/A 时 sizeToNumber 直接返回0 ，不用额外处理
      seeders: { selector: "td:nth-child(5)" },
      leechers: { selector: "td:nth-child(6)" },
      completed: { selector: "td:nth-child(7)" },
      category: {
        selector: "td:nth-child(1) a",
        attr: "href",
        filters: [
          (q: string) => (new URL(q)).searchParams.get("cat") || "Other",
        ],
      },
      author: { selector: "td:nth-child(8)" },
    },
  },
  detail: {
    selectors: {
      link: { selector: "a.download_link:last-of-type", attr: "href" },
    },
  },
};

// noinspection JSUnusedGlobalSymbols
export default class Ettv extends BittorrentSite {
  protected override async transformSearchFilter(filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords ? "/torrents-search.php" : "/torrents.php";

    return config;
  }
}
