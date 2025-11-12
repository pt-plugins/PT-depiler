import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { ITorrent, type ISiteMetadata } from "../types";
import Sizzle from "sizzle";
import CryptoJS from "crypto-js";
import { set } from "es-toolkit/compat";
import { parseTimeToLive, parseValidTimeString } from "../utils";

const extCategories = [
  { uri: "/anime/", cat: 7, value: "Anime" },
  { uri: "/anime/audio-lossless/", cat: 7, subCat: 61, value: "Anime Audio Lossless" },
  { uri: "/anime/english-translated/", cat: 7, subCat: 7, value: "Anime English Translated" },
  { uri: "/anime/raw/", cat: 7, subCat: 60, value: "Anime Raw" },
  { uri: "/anime/subs/", cat: 7, subCat: 59, value: "Anime Subs" },
  { uri: "/applications/", cat: 5, value: "Apps" },
  { uri: "/applications/android/", cat: 5, subCat: 25, value: "Apps Android" },
  { uri: "/applications/ios/", cat: 5, subCat: 24, value: "Apps iOS" },
  { uri: "/applications/linux/", cat: 5, subCat: 23, value: "Apps Linux" },
  { uri: "/applications/mac/", cat: 5, subCat: 22, value: "Apps Mac" },
  { uri: "/applications/other-applications/", cat: 5, subCat: 51, value: "Apps Other" },
  { uri: "/applications/windows/", cat: 5, subCat: 5, value: "Apps Windows" },
  { uri: "/books/", cat: 6, value: "Books" },
  { uri: "/books/audio-books/", cat: 6, subCat: 20, value: "Books Audiobooks" },
  { uri: "/books/comics/", cat: 6, subCat: 19, value: "Books Comics" },
  { uri: "/books/ebooks/", cat: 6, subCat: 6, value: "Books Ebooks" },
  { uri: "/games/", cat: 4, value: "Games" },
  { uri: "/games/mac/", cat: 4, subCat: 52, value: "Games Mac" },
  { uri: "/games/nds/", cat: 4, subCat: 33, value: "Games NDS" },
  { uri: "/games/other-games/", cat: 4, subCat: 32, value: "Games Other" },
  { uri: "/games/pc-games/", cat: 4, subCat: 31, value: "Games PC" },
  { uri: "/games/ps3/", cat: 4, subCat: 30, value: "Games PS3" },
  { uri: "/games/ps4/", cat: 4, subCat: 29, value: "Games PS4" },
  { uri: "/games/psp/", cat: 4, subCat: 28, value: "Games PSP" },
  { uri: "/games/switch/", cat: 4, subCat: 41, value: "Games Switch" },
  { uri: "/games/wii/", cat: 4, subCat: 27, value: "Games Wii" },
  { uri: "/games/xbox360/", cat: 4, subCat: 26, value: "Games Xbox360" },
  { uri: "/movies/", cat: 1, value: "Movies" },
  { uri: "/movies/3d-movies/", cat: 1, subCat: 1, value: "Movies 3D" },
  { uri: "/movies/bollywood/", cat: 1, subCat: 13, value: "Movies Bollywood" },
  { uri: "/movies/documentary/", cat: 1, subCat: 40, value: "Movies Documentary" },
  { uri: "/movies/dubbed-movies/", cat: 1, subCat: 39, value: "Movies Dubbed" },
  { uri: "/movies/dvd/", cat: 1, subCat: 42, value: "Movies DVD" },
  { uri: "/movies/highres-movies/", cat: 1, subCat: 11, value: "Movies Highres" },
  { uri: "/movies/movie-clips/", cat: 1, subCat: 49, value: "Movies Movie clips" },
  { uri: "/movies/mp4/", cat: 1, subCat: 9, value: "Movies MP4" },
  { uri: "/movies/music-videos/", cat: 1, subCat: 48, value: "Movies Music videos" },
  { uri: "/movies/other-movies/", cat: 1, subCat: 50, value: "Movies Other Movies" },
  { uri: "/movies/ultrahd/", cat: 1, subCat: 12, value: "Movies UltraHD" },
  { uri: "/music/", cat: 3, value: "Music" },
  { uri: "/music/aac/", cat: 3, subCat: 38, value: "Music AAC" },
  { uri: "/music/lossless/", cat: 3, subCat: 37, value: "Music Lossless" },
  { uri: "/music/mp3/", cat: 3, subCat: 36, value: "Music MP3" },
  { uri: "/music/other-music/", cat: 3, subCat: 35, value: "Music Other" },
  { uri: "/music/radio-shows/", cat: 3, subCat: 34, value: "Music Radio Shows" },
  { uri: "/other/", cat: 8, value: "Other" },
  { uri: "/tv/", cat: 2, value: "TV" },
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
    return torrent;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const detailPage = await this.request<Document>({ url: torrent.url!, responseType: "document" });

    const injectScriptSelector = "script[src]:last + script";

    const pageToken = this.extractWindowVar(Sizzle(injectScriptSelector, detailPage.data)[0], "pageToken");
    const csrfToken = this.extractWindowVar(
      Sizzle(`${injectScriptSelector} + script`, detailPage.data)[0],
      "csrfToken",
    );

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
      return getMagnetResp.data.magnet!;
    }
    return super.getTorrentDownloadLink(torrent);
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
