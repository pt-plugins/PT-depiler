/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/yts.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { type ISearchInput, type ISiteMetadata, type ITorrent } from "../types";

/**
 * YTS 的 list_movies 接口返回的是「电影」层级，每部电影下的 `torrents` 才是种子。
 * 这里按 Jackett 的 title 模板（`..title_long` + 画质 / 压制 / 音轨 / 位深 / 编码 -YTS）拼出标题。
 */
const buildTitle = (movie: any, torrent: any): string => {
  const titleBase = String(movie.title_long || `${movie.title} (${movie.year})`).replace(/:/g, "");
  const parts = [titleBase, torrent.quality, torrent.type === "web" ? "WEBRip" : "BRRip"];

  if (torrent.audio_channels === "5.1") parts.push("5.1");
  if (String(torrent.bit_depth) === "10") parts.push("10Bit");
  parts.push(`${torrent.video_codec} -YTS`);

  return parts.filter(Boolean).join(" ");
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "yts",
  name: "YTS",
  aka: ["YIFY"],
  description: "YTS 是一个专注于小体积高清电影（YIFY 压片组）的公共 BT 站点，提供 JSON API",
  tags: ["电影"],

  type: "public",

  // 只用站点域名；API 走 https://yts.gg/api/v2/list_movies.json
  //（官网公告的 API 新域名 movies-api.accel.li 提供同一接口，如需可自行替换 baseURL）
  urls: ["https://yts.gg/"],
  legacyUrls: [
    "https://yts.mx/",
    "https://yts.bz/",
    "https://yts.am/",
    "https://yts.ag/",
    "https://yts.lt/",
    "https://yts.torrentbay.st/",
    "https://yts.torrentsbay.org/",
    "https://yts.ninjaproxy1.com/",
    "https://yts.proxyninja.org/",
  ],

  // Jackett 的 requestDelay 为 2.5 次/秒，折算成毫秒
  requestDelay: 400,

  search: {
    keywordPath: "params.query_term",
    requestConfig: {
      // yts.gg 与 movies-api.accel.li 均提供该接口（后者是官网公告的新 API 域名），可用 urls 切换
      url: "/api/v2/list_movies.json",
      responseType: "json",
      params: {
        // 不设置 limit 时接口默认只返回 20 部电影
        limit: 50,
        sort_by: "date_added",
        order_by: "desc",
      },
    },
    selectors: {
      rows: { selector: ":self" },
      id: { selector: "hash" },
      title: { selector: "_title" },
      url: { selector: "_movieUrl" },
      link: { selector: "url" },
      time: { selector: "date_uploaded_unix", filters: [{ name: "parseNumber" }] },
      size: { selector: "size_bytes", filters: [{ name: "parseNumber" }] },
      seeders: { selector: "seeds", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "peers", filters: [{ name: "parseNumber" }] },
      category: { selector: "quality" },
      ext_imdb: { selector: "_imdb" },
    },
  },
};

export default class Yts extends BittorrentSite {
  public override async transformSearchPage(
    doc: Document | object | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    // data.movies[].torrents[] 拍平成一行一个种子，并把电影级字段一并带下来供选择器使用
    const movies: any[] = Array.isArray(doc?.data?.movies) ? doc.data.movies : [];
    const rows = movies.flatMap((movie) =>
      (Array.isArray(movie?.torrents) ? movie.torrents : []).map((torrent: any) => ({
        ...torrent,
        _title: buildTitle(movie, torrent),
        _movieUrl: movie.url,
        _imdb: movie.imdb_code,
      })),
    );

    return await super.transformSearchPage(rows, searchConfig);
  }
}
