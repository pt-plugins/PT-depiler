/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/RuTracker.cs
 */
import type { ISiteMetadata } from "../types.ts";
import { set } from "es-toolkit/compat";

function parseSeasonEpisode(input: string): { title: string; season?: number; episode?: string } {
  // Season + Episode
  let match = input.match(/\bS(\d{1,4})E(\d{1,4}[A-Za-z]?)$/);
  if (match) {
    return {
      title: input.slice(0, match.index).trim(),
      season: parseInt(match[1], 10),
      episode: match[2].replace(/^0+/, ""),
    };
  }

  // Only Episode
  match = input.match(/\bE(\d{1,4}[A-Za-z]?)$/);
  if (match) {
    return {
      title: input.slice(0, match.index).trim(),
      episode: match[1].replace(/^0+/, ""),
    };
  }

  // Only Season
  match = input.match(/\bS(\d{1,4})$/);
  if (match) {
    return {
      title: input.slice(0, match.index).trim(),
      season: parseInt(match[1], 10),
    };
  }

  return { title: input.trim() };
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "rutracker",
  name: "RuTracker.org",
  aka: ["RUT"],
  description: "RuTracker.org is a RUSSIAN Semi-Private site with a thriving file-sharing community",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://rutracker.org/", "https://rutracker.net/"],
  legacyUrls: ["https://rutracker.nl/"],

  search: {
    requestConfig: {
      url: "/forum/tracker.php",
      responseType: "document",
    },
    advanceKeywordParams: {
      imdb: false,
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (keywords) {
        delete requestConfig!.params?.keywords; // 移除 AbstractBittorrentSite 自动添加的 keywords 参数

        let { title: searchStr, season, episode } = parseSeasonEpisode(keywords.replace("-", ""));
        if (season) searchStr += ` ТВ | Сезон: ${season}`;
        if (episode) searchStr += ` Серии: ${episode}`;
        set(requestConfig!, "params.nm", searchStr);
      }
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "table#tor-tbl > tbody > tr" },
      link: { selector: "td.tor-size > a.tr-dl", attr: "href" },
      url: { selector: "td.t-title-col > div.t-title > a.tLink", attr: "href" },
      title: { selector: "td.t-title-col > div.t-title > a.tLink", filters: [{ name: "trim" }] },
      // FIXME category 名过长，建议映射为通用分类名
      category: { selector: "td.f-name-col > div.f-name > a" },
      size: { selector: "td.tor-size", data: "ts_text" },
      seeders: { selector: "td:nth-child(7)", data: "ts_text" },
      leechers: { selector: "td.leechmed:nth-child(8)" },
      completed: { selector: "td:nth-child(9)" },
      time: { selector: "td:nth-child(10)", data: "ts_text" },
      author: { selector: "td.u-name-col" },
    },
  },
};
