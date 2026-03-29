/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/AnimeBytes.cs
 * @JackettIssue https://github.com/Jackett/Jackett/issues/16062
 */
import type { ISearchInput, ISiteMetadata, ITorrent } from "../types";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import Gazelle, {
  GazelleUtils,
  SchemaMetadata,
  commonPagesList,
  detailPageList,
  top10PageList,
} from "../schemas/Gazelle";
import { extractContent, parseValidTimeString } from "../utils";
import { parse } from "@ptd/social/entity/anidb";

const tagKeywords = ["Episode", "Season"];

interface IAnimeBytesJSONResponse {
  Results: number;
  Matches: number;
  Groups: IAnimeBytesTorrentGroup[];
}

interface IAnimeBytesTorrentGroup {
  ID: number;
  CategoryName: string;
  FullName: string;
  GroupName: string;
  SeriesName: string | null;
  Year: string;
  Description: string;
  Comments: number;
  Links: {
    AniDB: string;
  } | null;
  Tags: string[];
  Torrents: IAnimeBytesTorrent[];
}

interface IAnimeBytesTorrent {
  ID: number;
  EditionData: {
    CatelogNumber: string;
    ReleaseDate: string;
    EditionTitle: string;
  };
  RawDownMultiplier: number;
  RawUpMultiplier: number;
  Link: string;
  Property: string;
  Snatched: number;
  Seeders: number;
  Leechers: number;
  Status: number;
  Size: number;
  UploadTime: string;
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "animebytes",
  name: "AnimeBytes",
  aka: ["AB"],
  description: "动漫",
  tags: ["动漫"],
  timezoneOffset: "+0000",
  collaborator: ["MewX", "sabersalv"],

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://navzrolgrf.gi/"],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      url: "/scrape.php",
      responseType: "json",
      params: {
        sort: "grouptime",
        way: "desc",
        type: "anime",
        limit: 50,
      },
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords || keywords.trim().length == 0) {
        requestConfig!.params!.limit = 15;
      }
      return requestConfig!;
    },
  },

  searchEntry: {
    area_anime: { name: "动漫", requestConfig: { params: { type: "anime" } } },
    area_music: { name: "音乐", enabled: false, requestConfig: { params: { type: "music" } } },
  },

  list: [
    {
      urlPattern: [/\/torrents\.php(?!.*(?:\bid=|torrentid=))/],
      mergeSearchSelectors: false,
      selectors: {
        ...SchemaMetadata.search!.selectors!,
        rows: {
          selector: "div.group_cont",
          filter: (boxes: HTMLElement[] | null): HTMLElement[] | null => {
            if (Array.isArray(boxes) && boxes.length > 0) {
              const rows: HTMLElement[] = [];
              for (const box of boxes) {
                const groupCard = box.querySelector<HTMLElement>("div.group_main");
                if (!groupCard) continue;

                const cat = box.querySelector("span.cat");
                if (cat) {
                  groupCard.dataset.cat = cat.textContent;
                }

                const anidbUrl = box.querySelector("div.group_statbox a[href*='anidb.net/anime/']");
                if (anidbUrl) {
                  groupCard.dataset.anidb = parse(anidbUrl.getAttribute("href")!);
                }

                const torrentRows = Array.from(box.querySelectorAll<HTMLElement>("table.torrent_group > tbody > tr"));
                let currentEpisode = "";
                for (const torrent of torrentRows) {
                  if (torrent.classList.contains("edition_info")) {
                    const rawText = torrent.querySelector("td > strong")?.textContent || "";
                    const match = rawText.match(/Episode\s*(\d+)/i);
                    currentEpisode = match ? match[1] : "";
                    continue;
                  }

                  if (currentEpisode) {
                    torrent.dataset.episode = currentEpisode;
                  }

                  torrent.className = "group_torrent";
                }
                rows.push(groupCard, ...torrentRows);
              }
              return rows;
            }
            return boxes;
          },
        },
        title: { selector: "span.group_title > strong" },
        category: { selector: ":self", data: "cat" },
        ext_anidb: { selector: ":self", data: "anidb" },
        id: { selector: ":self", attr: "id", filters: [{ name: "parseNumber" }] },
        url: { selector: "td.torrent_properties > a[href^='torrents.php']", attr: "href" },
        link: { selector: "span.download_link > a[href^='/torrent/']", attr: "href" },
        subTitle: {
          selector: ":self",
          elementProcess: (el: HTMLElement) => {
            const episode = el.dataset.episode;
            const propsEl = el.querySelector<HTMLElement>("a[href^='torrents.php?id']");
            if (!propsEl) return "";
            const props = GazelleUtils.extractTags(propsEl.innerText || propsEl.textContent, tagKeywords, " | ");
            return `${episode ? `Episode ${episode} |` : ""} ${props}`;
          },
        },
        time: { text: 0 }, // 没有时间信息
        size: { selector: "td.torrent_size > span", filters: [{ name: "parseSize" }] },
        completed: { selector: "td.torrent_snatched > span" },
        seeders: { selector: "td.torrent_seeders > span" },
        leechers: { selector: "td.torrent_leechers > span" },
        tags: [
          {
            name: "Free",
            selector: "td.torrent_properties img[alt='Freeleech!']",
            color: "blue",
          },
        ],
      },
    },
  ],

  userInfo: {
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["id", "name"],
      },
      {
        requestConfig: {
          url: "/user.php",
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: [
          "messageCount",
          "uploads",
          "uploaded",
          "downloaded",
          "ratio",
          "seeding",
          "seedingSize",
          "levelName",
          "bonus",
          "bonusPerHour",
          "joinTime",
          "hnrUnsatisfied",
          "hnrPreWarning",
        ],
      },
    ],
    pickLast: ["id", "name", "joinTime"],
    selectors: {
      id: {
        selector: "#stats_menu > a:first",
        attr: "href",
        filters: [{ name: "querystring", args: ["userid"] }],
      },
      name: { selector: "a.username:first" },

      messageCount: {
        selector: ".alertbar.notice span.new_count",
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: "dt:contains('Torrents Uploaded:') + dd",
        filters: [{ name: "parseNumber" }],
      },
      uploaded: {
        selector: "dt:contains('Uploaded:') + dd > span",
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      downloaded: {
        selector: "dt:contains('Downloaded:') + dd > span",
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      ratio: {
        selector: "dt:contains('Ratio:') + dd > span",
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: "dt:contains('Seeding:') + dd",
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: "dt:contains('Total seed size:') + dd > span",
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: "dt:contains('Class:') + dd",
      },
      bonus: {
        selector: "#yen_count > a",
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: "dt:contains('Yen per day:') + dd",
        filters: [
          (query: string) => query.replace(/,/g, "").match(/[\d.]+/),
          (query: string[]) => (query ? parseFloat(query[0]) / 24 : 0),
        ],
      },
      joinTime: {
        selector: "dt:contains('Joined:') + dd > span",
        filters: [{ name: "parseFuzzyTime" }],
      },
      hnrUnsatisfied: {
        selector: "ul.stats li:contains('H&Rs:')",
        attr: "title",
        filters: [
          (query: string) => {
            const numbers = query.match(/\d+/g);
            return numbers && numbers.length >= 1 ? parseInt(numbers[0]) : 0;
          },
        ],
      },
      hnrPreWarning: {
        selector: "ul.stats li:contains('H&Rs:')",
        attr: "title",
        filters: [
          (query: string) => {
            const numbers = query.match(/\d+/g);
            return numbers && numbers.length >= 2 ? parseInt(numbers[1]) : 0;
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Aka-chan",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "User",
      interval: "P1D",
      uploaded: "10.5GB",
      ratio: 0.5,
      privilege: "发送邀请",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P2D",
      uploads: 10,
      uploaded: "25GB",
      ratio: 0.7,
      isKept: true,
      privilege: "访问邀请区，每月固定邀请名额，免于非活动修剪",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P30D",
      uploads: 50,
      uploaded: "100GB",
      ratio: 0.8,
      isKept: true,
      privilege: "",
    },
    {
      id: 4,
      name: "Torrent Master",
      interval: "P90D",
      uploads: 100,
      uploaded: "500GB",
      ratio: 0.9,
      isKept: true,
      privilege: "超出用户限制也可以发送邀请",
    },
    {
      id: 5,
      name: "Legend",
      interval: "P180D",
      uploads: 500,
      uploaded: "1TB",
      ratio: 1.0,
      isKept: true,
      privilege: "",
    },
  ],
};

export default class AnimeBytes extends Gazelle {
  private _baseUserInfo?: { username: string; passkey: string };

  private async getBaseUserInfo(): Promise<{ username: string; passkey: string }> {
    let userName = this._baseUserInfo?.username;
    let passKey = this._baseUserInfo?.passkey;

    if (!userName || !passKey) {
      const { data: statResp } = await this.request<Document>({
        url: "/",
        responseType: "document",
      });
      const docElement = statResp.documentElement;

      if (!userName) {
        userName = this.getFieldData(docElement, {
          selector: "a.username:first",
        });
      }

      if (!passKey) {
        passKey = this.getFieldData(docElement, {
          selector: "link[href^='/feed/rss_torrents_all/']",
          attr: "href",
          filters: [{ name: "split", args: ["/", 3] }],
        });
      }

      this._baseUserInfo = {
        username: userName!,
        passkey: passKey!,
      };
    }

    return { username: userName!, passkey: passKey! };
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    if (axiosConfig.url?.includes("/scrape.php")) {
      const baseUserInfo = await this.getBaseUserInfo();
      axiosConfig.params = {
        ...axiosConfig.params,
        torrent_pass: baseUserInfo.passkey,
        username: baseUserInfo.username,
      };
    }
    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override get torrentClasses(): Record<"group" | "unGroupTorrent", string[]> {
    return {
      ...super.torrentClasses,
      group: ["group_main", ...super.torrentClasses.group],
    };
  }

  public override async transformSearchPage(
    doc: Document | IAnimeBytesJSONResponse,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    if (doc instanceof Node) {
      return super.transformSearchPage(doc, searchConfig);
    }

    // 处理 API 搜索
    const torrents: ITorrent[] = [];
    const searchType = searchConfig.requestConfig?.params?.type;
    const delimiter = searchType === "music" ? " / " : " | ";
    const torrentPage = searchType === "music" ? "torrents2.php" : "torrents.php";

    const rows = doc.Groups;
    for (const group of rows) {
      const title = extractContent(group.FullName);
      for (const torrent of group.Torrents) {
        const tags: { name: string; color: string }[] = [];
        if (torrent.RawDownMultiplier === 0) {
          tags.push({ name: "Free", color: "blue" });
        }
        try {
          torrents.push({
            site: this.metadata.id, // 补全种子的 site 属性
            id: torrent.ID,
            title,
            subTitle: `${torrent.EditionData.EditionTitle ? `${torrent.EditionData.EditionTitle} ${delimiter.trim()}` : ""} ${GazelleUtils.extractTags(torrent.Property, tagKeywords, delimiter)}`,
            url: `${this.url}${torrentPage}?id=${group.ID}&torrentid=${torrent.ID}`,
            link: torrent.Link,
            time: parseValidTimeString(torrent.UploadTime) as number,
            size: torrent.Size,
            seeders: torrent.Seeders,
            leechers: torrent.Leechers,
            completed: torrent.Snatched,
            comments: group.Comments,
            category: group.CategoryName,
            tags,
            ext_anidb: group.Links?.AniDB ? parse(group.Links.AniDB) : null,
          });
        } catch (e) {
          console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, torrent);
        }
      }
    }
    return torrents;
  }

  protected override getTorrentGroupInfo(group: HTMLElement, searchConfig: ISearchInput): Partial<ITorrent> {
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "category", "ext_anidb"]);
  }
}
