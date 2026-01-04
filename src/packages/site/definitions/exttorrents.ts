import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { ITorrent, type ISiteMetadata } from "../types";
import Sizzle from "sizzle";
import CryptoJS from "crypto-js";
import { set } from "es-toolkit/compat";
import { parseTimeToLive, parseValidTimeString } from "../utils";

const extCategories = [
  { uri: "/anime/", cat: 7, value: "Anime" },
  { uri: "/anime/english-translated/", cat: 7, subCat: 7, value: "Anime English Translated" },
  { uri: "/anime/music-video/", cat: 7, subCat: 58, value: "Anime Music Video" },
  { uri: "/anime/subs/", cat: 7, subCat: 59, value: "Anime Subs" },
  { uri: "/anime/raw/", cat: 7, subCat: 60, value: "Anime Raw" },
  { uri: "/anime/audio-lossless/", cat: 7, subCat: 61, value: "Anime Audio Lossless" },
  { uri: "/anime/audio-lossy/", cat: 7, subCat: 62, value: "Anime Audio Lossy" },
  { uri: "/anime/live-action-english/", cat: 7, subCat: 65, value: "Anime Live Action English" },
  { uri: "/anime/live-action-non-english/", cat: 7, subCat: 67, value: "Anime Live Action Non-English" },
  { uri: "/anime/live-action-raw/", cat: 7, subCat: 66, value: "Anime Live Action Raw" },
  { uri: "/anime/pictures/", cat: 7, subCat: 68, value: "Anime Pictures" },
  { uri: "/applications/", cat: 5, value: "Apps" },
  { uri: "/applications/android/", cat: 5, subCat: 25, value: "Apps Android" },
  { uri: "/applications/ios/", cat: 5, subCat: 24, value: "Apps iOS" },
  { uri: "/applications/linux/", cat: 5, subCat: 23, value: "Apps Linux" },
  { uri: "/applications/mac/", cat: 5, subCat: 22, value: "Apps Mac" },
  { uri: "/applications/other-applications/", cat: 5, subCat: 51, value: "Apps Other" },
  { uri: "/applications/windows/", cat: 5, subCat: 5, value: "Apps Windows" },
  { uri: "/books/", cat: 6, value: "Books" },
  { uri: "/books/ebooks/", cat: 6, subCat: 6, value: "Books Ebooks" },
  { uri: "/books/comics/", cat: 6, subCat: 19, value: "Books Comics" },
  { uri: "/books/magazines/", cat: 6, subCat: 75, value: "Books Magazines" },
  { uri: "/books/audio-books/", cat: 6, subCat: 20, value: "Books Audiobooks" },
  { uri: "/books/manga-english/", cat: 6, subCat: 63, value: "Books Manga English" },
  { uri: "/books/manga-raw/", cat: 6, subCat: 64, value: "Books Manga Raw" },
  { uri: "/games/", cat: 4, value: "Games" },
  { uri: "/games/pc-games/", cat: 4, subCat: 31, value: "Games PC" },
  { uri: "/games/xbox360/", cat: 4, subCat: 26, value: "Games Xbox360" },
  { uri: "/games/ps4/", cat: 4, subCat: 29, value: "Games PS4" },
  { uri: "/games/ps3/", cat: 4, subCat: 30, value: "Games PS3" },
  { uri: "/games/wii/", cat: 4, subCat: 27, value: "Games Wii" },
  { uri: "/games/psp/", cat: 4, subCat: 28, value: "Games PSP" },
  { uri: "/games/nds/", cat: 4, subCat: 33, value: "Games NDS" },
  { uri: "/games/switch/", cat: 4, subCat: 41, value: "Games Switch" },
  { uri: "/games/mac/", cat: 4, subCat: 52, value: "Games Mac" },
  { uri: "/games/other-games/", cat: 4, subCat: 32, value: "Games Other" },
  { uri: "/movies/", cat: 1, value: "Movies" },
  { uri: "/movies/3d-movies/", cat: 1, subCat: 1, value: "Movies 3D" },
  { uri: "/movies/dubbed-movies/", cat: 1, subCat: 39, value: "Movies Dubbed" },
  { uri: "/movies/mp4/", cat: 1, subCat: 9, value: "Movies MP4" },
  { uri: "/movies/highres-movies/", cat: 1, subCat: 11, value: "Movies Highres" },
  { uri: "/movies/ultrahd/", cat: 1, subCat: 12, value: "Movies UltraHD" },
  { uri: "/movies/bollywood/", cat: 1, subCat: 13, value: "Movies Bollywood" },
  { uri: "/movies/documentary/", cat: 1, subCat: 40, value: "Movies Documentary" },
  { uri: "/movies/dvd/", cat: 1, subCat: 42, value: "Movies DVD" },
  { uri: "/movies/music-videos/", cat: 1, subCat: 48, value: "Movies Music videos" },
  { uri: "/movies/movie-clips/", cat: 1, subCat: 49, value: "Movies Movie clips" },
  { uri: "/movies/other-movies/", cat: 1, subCat: 50, value: "Movies Other Movies" },
  { uri: "/music/", cat: 3, value: "Music" },
  { uri: "/music/mp3/", cat: 3, subCat: 36, value: "Music MP3" },
  { uri: "/music/aac/", cat: 3, subCat: 38, value: "Music AAC" },
  { uri: "/music/radio-shows/", cat: 3, subCat: 34, value: "Music Radio Shows" },
  { uri: "/music/lossless/", cat: 3, subCat: 37, value: "Music Lossless" },
  { uri: "/music/other-music/", cat: 3, subCat: 35, value: "Music Other" },
  { uri: "/other/", cat: 8, value: "Other" },
  { uri: "/tv/", cat: 2, value: "TV" },
  { uri: "/tv/episodes-sd/", cat: 2, subCat: 69, value: "TV Episodes SD" },
  { uri: "/tv/episodes-hd/", cat: 2, subCat: 70, value: "TV Episodes HD" },
  { uri: "/tv/episodes-4k-uhd/", cat: 2, subCat: 71, value: "TV Episodes 4K UHD" },
  { uri: "/tv/season-packs/", cat: 2, subCat: 72, value: "TV Season Packs" },
  { uri: "/tv/big-season-packs/", cat: 2, subCat: 73, value: "TV Big Season Packs" },
  { uri: "/tv/sports/", cat: 2, subCat: 74, value: "TV Sports" },
  { uri: "/xxx/", cat: 10, value: "XXX" },
  { uri: "/xxx/games/", cat: 10, subCat: 43, value: "XXX Games" },
  { uri: "/xxx/hentai/", cat: 10, subCat: 44, value: "XXX Hentai" },
  { uri: "/xxx/magazines/", cat: 10, subCat: 45, value: "XXX Magazines" },
  { uri: "/xxx/pictures/", cat: 10, subCat: 46, value: "XXX Pictures" },
  { uri: "/xxx/video/", cat: 10, subCat: 47, value: "XXX Video" },
];

const categoryMap = extCategories.reduce<Record<string, string>>((map, item) => {
  map[item.uri] = item.value;
  return map;
}, {});

const categoryOptions = extCategories.map(({ cat, subCat, value }) => ({ name: value, value: `${cat}|${subCat}` }));

const parseId = (uri: string) => {
  const parts = uri.split("-");
  const last = parts[parts.length - 1];
  const id = last.replace("/", "");
  return parseInt(id);
};

interface extGetMagnetResp {
  success: boolean;
  magnet?: string;
  error?: string;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "exttorrents",
  name: "EXT Torrents",
  description: "EXT Torrents is a Public torrent site for MOVIES / TV / GENERAL",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "public",

  urls: ["https://ext.to/", "https://search.extto.com/", "https://extranet.torrentbay.st/"],

  category: [
    {
      name: "Category",
      key: "cat",
      options: categoryOptions,
      generateRequestConfig: (selectedCategories) => {
        const params: { cat?: string; sub_cat?: string } = {};
        const idParts = (selectedCategories as string).split("|");
        params.cat = idParts[0];
        if (idParts.length > 1) params.sub_cat = idParts[1];
        return { requestConfig: { params } };
      },
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/browse/",
      responseType: "document",
      params: {
        with_adult: 1,
        sort: "age",
        order: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          delete requestConfig!.params.q;
          set(requestConfig!, "params.imdb_id", keywords);
          return requestConfig!;
        },
      },
    },
    requestConfigTransformer: ({ requestConfig }) => {
      if (!(requestConfig?.params.cat || requestConfig?.params.imdb_id || requestConfig?.params.q)) {
        set(requestConfig!, "params.age", 0);
      }
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "table.table-striped > tbody > tr" },
      category: {
        selector: ["td:nth-child(1) div div a:nth-child(3)", "td:nth-child(1) div div a:nth-child(2)"],
        attr: "href",
        filters: [(uri: string) => categoryMap[uri]],
      },
      id: {
        selector: "td:nth-child(1) div a",
        attr: "href",
        filters: [parseId],
      },
      title: { selector: "td:nth-child(1) div a" },
      url: { selector: "td:nth-child(1) div a", attr: "href" },
      link: {
        selector: "a.search-magnet-btn",
        elementProcess: (el: HTMLElement) => {
          const infoHash = el.dataset.hash;
          const title = encodeURIComponent(el.dataset.name || "");
          return `magnet:?xt=urn:btih:${infoHash}&dn=${title}`;
        },
      },
      size: { selector: "span:contains('Size') + span", filters: [{ name: "parseSize" }] },
      time: {
        selector: "span:contains('Age') + span",
        elementProcess: (el: Element) => {
          if (el.textContent.match(/minute|hour/)) {
            return parseTimeToLive(el.textContent);
          }
          return parseValidTimeString(el.getAttribute("title")!, ["dd MMMM yyyy"]);
        },
      },
      seeders: { selector: "span:contains('Seeds') + span" },
      leechers: { selector: "span:contains('Leechs') + span" },
      comments: { selector: "a.comments-torrents-btn" },

      ext_imdb: {
        selector: "a[href*='imdb_id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["imdb_id"] }],
      },
    },
  },

  detail: {
    urlPattern: [/-\d+\//],
    selectors: {
      title: { selector: "h1.card-title:first" },
      link: { text: "N/A" }, // 后续方法中会获取到正确链接
    },
  },
};

export default class ExtTorrents extends BittorrentSite {
  public override async transformDetailPage(doc: Document): Promise<ITorrent> {
    const torrent = await super.transformDetailPage(doc);
    torrent.id = parseId(torrent.url!);

    const injectScriptSelector = "script:not([defer])[src]:last + script";

    const pageToken = this.extractWindowVar(Sizzle(injectScriptSelector, doc)[0], "pageToken");
    const csrfToken = this.extractWindowVar(Sizzle(`${injectScriptSelector} + script`, doc)[0], "csrfToken");

    const timestamp = Math.floor(Date.now() / 1000);
    const hmacToken = this.computeHMAC(torrent.id as number, timestamp, pageToken!);

    const getMagnetResp = await this.request<extGetMagnetResp>({
      url: "/ajax/getTorrentMagnet.php",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      responseType: "json",
      data: {
        torrent_id: torrent.id,
        action: "get_magnet",
        timestamp,
        hmac: hmacToken,
        sessid: csrfToken,
      },
    });

    if (getMagnetResp.data.success) {
      torrent.link = getMagnetResp.data.magnet!;
    }

    return torrent;
  }

  private extractWindowVar(scriptEl: Element, varName: string): string | null {
    const regex = new RegExp(`window\\.${varName}\\s*=\\s*['"]([^'"]+)['"]`);
    const match = scriptEl.textContent?.match(regex);
    return match ? match[1] : null;
  }

  private computeHMAC(torrentId: number, timestamp: number, token: string) {
    const data = `${torrentId}|${timestamp}|${token}`;
    return CryptoJS.SHA256(data).toString();
  }
}
