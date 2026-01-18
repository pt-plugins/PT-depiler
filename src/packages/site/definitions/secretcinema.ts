import type { ISiteMetadata, ITorrent, IUserInfo, ISearchInput } from "../types";
import {
  parseTimeWithZone,
  parseSizeString,
  definedFilters,
  extractContent,
  buildCategoryOptionsFromList,
} from "../utils";
import Sizzle from "sizzle";
import GazelleJSONAPI, {
  SchemaMetadata,
  groupBrowseResult,
  groupTorrent,
  torrentBrowseResult,
  browseJsonResponse,
} from "../schemas/GazelleJSONAPI";
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { unset, set } from "es-toolkit/compat";

const movieCats = ["SD", "720p", "1080p", "2160p", "4k", "DVD-R", "BDMV"];
const musicCats = ["CD", "DVD", "WEB", "Vinyl"];

const mediaCategorySets = {
  Movies: new Set<string>(movieCats),
  Music: new Set<string>(musicCats),
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "secretcinema",
  name: "Secret Cinema",
  aka: ["SC"],
  description: "Secret Cinema is a Private ratioless site for rare MOVIES.",
  tags: ["电影", "电子书", "音乐"],
  timezoneOffset: `+0100`,

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["uggcf://frperg-pvarzn.cj/"],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { name: "Movies", value: 1 },
        { name: "Music", value: 2 },
        { name: "E-Books", value: 3 },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "Source",
      key: "media",
      options: buildCategoryOptionsFromList([movieCats, musicCats]),
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          if (keywords) {
            unset(requestConfig!, SchemaMetadata.search!.keywordPath!);
            set(requestConfig!, "params.cataloguenumber", keywords);
          }
          return requestConfig!;
        },
      },
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
      excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid)=\d+/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "div.torrent_card > div.torrent_info" },
        title: {
          selector: "a[href*='torrents.php?id=']:first > b",
        },
        url: { selector: "a[href*='torrents.php?id=']:first", attr: "href" },
        link: { selector: "a[href^='torrents.php?action=download']", attr: "href" },
        size: {
          selector: "div.activity_info > div:nth-child(2)",
          filters: [{ name: "parseSize" }],
        },
        seeders: {
          selector: "div.torrent_seed",
          filters: [{ name: "parseNumber" }],
        },
        leechers: {
          selector: "div.torrent_peers",
          filters: [{ name: "parseNumber" }],
        },
        completed: {
          selector: "div.torrent_snatched",
          filters: [{ name: "parseNumber" }],
        },
        time: {
          selector: "span.time",
          filters: [
            { name: "parseTTL" },
            (ts: number) => {
              const offsetMinutes = new Date().getTimezoneOffset();
              const offsetMs = offsetMinutes * 60 * 1000;
              return ts + 1 * 3600000 + offsetMs; // UTC+1
            },
          ],
        },
      },
    },
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      ratio: { text: "N/A" },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Actor",
      privilege: "The default class for all members.",
    },
    {
      id: 1,
      name: "Cinematographer",
      interval: "P2M",
      percentile: 50,
      privilege:
        "Can access the Secret Pharmacy forum and create 1 personal collage. Can also invite new members upon having enough Seeding Points.",
    },
    {
      id: 2,
      name: "Director",
      interval: "P4M",
      percentile: 70,
      privilege:
        "Can access the Secret Pharmacy forum, create 3 personal collages and is awarded an invite occasionally",
    },
    {
      id: 3,
      name: "Cinephile",
      interval: "P6M",
      percentile: 90,
      privilege:
        "Can access the Secret Pharmacy and Ilium Cinephilium forums, create 10 personal collages and is awarded an invite occasionally.",
    },
    {
      id: 4,
      name: "Legend",
      groupType: "vip",
      privilege: "Past staff member. Same perks as Cinephiles, plus a few more.",
    },
  ],
};

export default class SecretCinema extends GazelleJSONAPI {
  protected override async transformUnGroupTorrent(group: torrentBrowseResult): Promise<ITorrent> {
    const torrents = await super.transformUnGroupTorrent(group);
    torrents.tags = []; // ratioless 站点不再额外添加种子优惠相关标签
    return torrents;
  }

  protected override async transformGroupTorrent(group: groupBrowseResult, torrent: groupTorrent): Promise<ITorrent> {
    const { authkey, passkey } = await this.getAuthKey();

    return {
      site: this.metadata.id, // 补全种子的 site 属性
      id: torrent.torrentId,
      title: `${group.artist} - ${extractContent(group.groupName)} [${group.groupYear}]`,
      subTitle:
        `${torrent.media}` +
        (torrent.hasLog ? " / Log" : "") +
        (torrent.hasCue ? " / Cue" : "") +
        (torrent.remastered ? ` / ${torrent.remasterYear}` : "") +
        (torrent.remasterTitle ? ` / ${extractContent(torrent.remasterTitle)}` : "") +
        (torrent.scene ? " / Scene" : ""),
      url: `${this.url}torrents.php?id=${group.groupId}&torrentid=${torrent.torrentId}`,
      link: `${this.url}torrents.php?action=download&id=${torrent.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(torrent.time, this.metadata.timezoneOffset),
      size: torrent.size,
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      completed: torrent.snatches,
      category:
        group.releaseType === "Music"
          ? group.releaseType
          : (Object.entries(mediaCategorySets).find(([_, v]) => v.has(torrent.media))?.[0] ?? "E-Books"),
    } as ITorrent;
  }

  public override async transformSearchPage(
    doc: browseJsonResponse | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    if (doc instanceof Document) {
      return BittorrentSite.prototype.transformSearchPage.call(this, doc, searchConfig);
    }
    return super.transformSearchPage(doc, searchConfig);
  }

  protected override async getSeedingSize(userId: number, sizeIndex: number = 0): Promise<Partial<IUserInfo>> {
    const userSeedingTorrent = await super.getSeedingSize(userId, sizeIndex);

    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userPage } = await this.request<Document>({
      url: "/user.php",
      params: { id: userId },
      responseType: "document",
    });
    userSeedingTorrent.seedingBonus! = definedFilters.parseNumber(
      Sizzle("li:contains('Seeding Points: ')", userPage)[0].textContent,
    );
    userSeedingTorrent.percentile! = definedFilters.parseNumber(
      Sizzle("li:contains('Overall rank: ')", userPage)[0].textContent,
    );

    return userSeedingTorrent;
  }
}
