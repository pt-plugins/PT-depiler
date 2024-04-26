import type { ISiteMetadata, ITorrent } from "../types";
import type {
  groupBrowseResult,
  groupTorrent as defaultGroupTorrent,
} from "../schemas/GazelleJSONAPI";
import GazelleJSONAPI from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  name: "Anthelion",
  timezoneOffset: "+0000",
  description: "Movies",
  url: "https://anthelion.me/",
  tags: ["电影"],
  type: "private",
  schema: "GazelleJSONAPI",
  collaborator: ["enigamz"],
  userInfo: {
    selectors: {
      bonus: {
        selector: ["a[href*='store.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
    },
  },
  search: {
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
  },
};

interface groupTorrent extends defaultGroupTorrent {
  codec: string;
  container: string;
  resolution: string;
  audio: string;
}

export default class anthelion extends GazelleJSONAPI {
  protected override async transformGroupTorrent(
    group: groupBrowseResult,
    torrent: groupTorrent,
  ): Promise<ITorrent> {
    const parsedTorrent = await super.transformGroupTorrent(group, torrent);

    /**
     * 对比旧版解析文件 getSearchResult.js 与 GazelleJSONAPI 默认解析文件，
     * 可以发现只有 title 和 subTitle 不同，直接覆写
     * https://www.diffchecker.com/iEHRUClF
     */
    parsedTorrent.title = `${group.groupName} [${group.groupYear}]`;
    parsedTorrent.subTitle =
      `${torrent.codec} / ${torrent.container} / ${torrent.media} / ${torrent.resolution} / ${torrent.audio}` +
      (torrent.hasLog ? ` / Log(${torrent.logScore})` : "") +
      (torrent.hasCue ? " / Cue" : "") +
      (torrent.remastered ? ` / ${torrent.remasterYear}` : "") +
      (torrent.scene ? " / Scene" : "") +
      (torrent.isFreeleech || torrent.isNeutralLeech || torrent.isPersonalFreeleech
        ? " / Freeleech"
        : "");

    return parsedTorrent;
  }
}
