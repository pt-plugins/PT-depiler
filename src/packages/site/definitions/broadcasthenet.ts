import type { ISiteMetadata, ISearchResult, ISearchEntryRequestConfig } from "../types.ts";
import { SchemaMetadata } from "../schemas/Gazelle.ts";
import Gazelle from "../schemas/Gazelle.ts";
import { EResultParseStatus } from "../types.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,

  id: "broadcasthenet",
  name: "BroadcastTheNet",
  aka: ["BTN"],
  description: "BroadcastTheNet is a private tracker for TV shows.",
  tags: ["电视剧"],
  timezoneOffset: "+0000",
  collaborator: ["Sunhelter"],

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://oebnqpnfgur.arg/"],

  search: {
    ...SchemaMetadata.search,
    skipNonLatinCharacters: true,
    keywordPath: "params.artistname", // 修复搜索参数
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        action: "advanced", // BTN需要的参数
      },
    },
    advanceKeywordParams: {
      imdb: {
        enabled: true,
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      url: {
        selector: "a[href*='torrents.php?id='][href*='torrentid=']", // 更精确的种子链接选择器
        attr: "href",
      },
      title: {
        selector: "span[style='float:none;']", // BTN的种子标题选择器
      },
      category: {
        selector: "a[href*='filter_cat'] img", // BTN的分类选择器
        attr: "title",
      },
      time: {
        selector: "div.nobr:contains('Added:')",
        filters: [
          (query: string) => {
            // 从 "Up: Anonymous - Added: 1 hour and 50 minutes ago" 中提取时间部分
            const match = query.match(/Added:\s*(.+)/);
            return match ? match[1].trim() : query.trim();
          },
          { name: "parseTTL" }, // 使用parseTTL转换相对时间为绝对时间
        ],
      },
      tags: [
        {
          name: "H&R",
          selector: "*",
          color: "red",
        },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id", "name", "messageCount"],
      },
      {
        requestConfig: {
          url: "/user.php",
          params: {
            /* id: flushUserInfo.id */
          },
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "uploads",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "bonusPerHour",
          "joinTime",
          "seeding",
          "seedingSize",
          "seedingTime",
          "totalTraffic",
          "snatches",
          "hnrUnsatisfied",
        ],
      },
      {
        requestConfig: {
          url: "/snatchlist.php",
          params: {
            type: "ajax",
            sort: "seedtimeleft",
            page: 1,
          },
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: ["hnrPreWarning"],
      },
    ],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      uploaded: {
        selector: "ul.nobullet > li:contains('Upload:')",
        filters: [{ name: "parseSize" }],
      },
      uploads: {
        selector: "ul.nobullet > li:contains('Uploaded:')",
        filters: [{ name: "parseNumber" }],
      },
      downloaded: {
        selector: "ul.nobullet > li:contains('Downloaded:')",
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: "ul.nobullet > li:contains('User Class:')",
        filters: [
          (query: string) => {
            return query.replace("User Class:", "").trim();
          },
        ],
      },
      bonus: {
        selector: "ul.nobullet > li:contains('Bonus Points:') > a",
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: "ul.nobullet > li:contains('Per Day:')",
        filters: [{ name: "parseNumber" }, { name: "divide", args: [24] }],
      },
      ratio: undefined,
      joinTime: {
        selector: "ul.nobullet > li:contains('Joined:') > span",
        filters: [{ name: "parseTTL" }],
      },
      seeding: {
        selector: "ul.nobullet > li:contains('Seeding:')",
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: "ul.nobullet > li:contains('Seeding Size:')",
        filters: [{ name: "parseSize" }],
      },
      totalTraffic: {
        selector: "ul.nobullet > li:contains('Total Traffic:')",
        filters: [{ name: "parseSize" }],
      },
      snatches: {
        selector: "ul.nobullet:has( > li:contains('Snatched:'))",
        elementProcess: (element: HTMLElement) => {
          // 查找所有包含 "Snatched:" 的元素
          const snatchedElements = Array.from(element.querySelectorAll("li")) as HTMLElement[];
          let totalSnatches = 0;

          snatchedElements.forEach((el) => {
            const text = el.textContent || "";
            if (text.includes("Snatched:")) {
              const match = text.match(/Snatched:\s*(\d+)/);
              if (match) {
                totalSnatches += parseInt(match[1]);
              }
            }
          });

          return totalSnatches;
        },
      },
      hnrUnsatisfied: {
        selector: "ul.nobullet > li:contains('HnRs:') > a",
        filters: [{ name: "parseNumber" }],
      },
      hnrPreWarning: {
        selector: ["table:has(tr.colhead_dark)"],
        elementProcess: (element: HTMLElement) => {
          // 循环所有 id 以 "snatch" 开头的 tr 元素
          const rows = Array.from(element.querySelectorAll("tr[id^='snatch']")) as HTMLElement[];
          let count = 0;

          rows.forEach((row) => {
            // 查找第5列的 td 元素
            const fifthCell = row.querySelector("td:nth-child(5)") as HTMLElement;
            if (fifthCell && fifthCell.textContent && !fifthCell.textContent.includes("Complete")) {
              count++;
            }
          });

          return count;
        },
      },
      seedingTime: {
        selector: "ul.nobullet > li:contains('Total Time Seeded:')",
        filters: [
          (query: string) => {
            // 从 "Total Time Seeded: 21,238 Days" 中提取天数并转换为秒数
            const match = query.match(/Total Time Seeded:\s*([\d,]+)\s*Days/i);
            if (match) {
              const days = parseInt(match[1].replace(/,/g, ""));
              const seconds = days * 24 * 3600; // 转换为秒数
              return seconds;
            }
            return 0;
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      totalTraffic: "100GB",
      bonus: 100000,
      snatches: 100,
      interval: "P2W",
      privilege: "Can access the XXX forum.",
    },
    {
      id: 2,
      name: "Power User",
      totalTraffic: "250GB",
      bonus: 250000,
      snatches: 250,
      interval: "P4W",
      privilege:
        "Has access to the Power User forum, Official and Unofficial Invites forums, Top 10 filters, and can access notifications.",
    },
    {
      id: 3,
      name: "Extreme User",
      totalTraffic: "500GB",
      bonus: 500000,
      snatches: 500,
      interval: "P2M3W",
      privilege: "Has access to the Extreme User forum.",
    },
    {
      id: 4,
      name: "Elite",
      totalTraffic: "1TB",
      bonus: 850000,
      snatches: 1000,
      interval: "P5M2W",
      privilege:
        "Has access to the Elite forum and can set own Custom Title, and the ability to send invites purchased from the Lumens Store.",
    },
    {
      id: 5,
      name: "Guru",
      totalTraffic: "2.5TB",
      bonus: 1500000,
      snatches: 1500,
      interval: "P8M1W",
      privilege: "Has access to the Guru forum.",
    },
    {
      id: 6,
      name: "Master",
      totalTraffic: "7.5TB",
      bonus: 3000000,
      snatches: 3000,
      interval: "P11M4W",
      privilege: "Has access to the Master forum.",
    },
    {
      id: 7,
      name: "Overlord",
      totalTraffic: "100TB",
      bonus: 250000000,
      snatches: 3000,
      uploads: 500,
      interval: "P3Y",
      seedingTime: "P250000D",
      privilege:
        "Has access to the Overlord forum, Custom Title, Unlimited Invites, and immunity from Inactivity Pruning.",
    },
  ],
};

export default class BroadcastTheNet extends Gazelle {
  /**
   * Get artist name from site's IMDB search
   * @param imdbId - IMDB ID (e.g., "tt3881914")
   * @returns Promise<string | null> - Artist name or null if not found/failed
   */
  private async getArtistNameFromIMDB(imdbId: string): Promise<string | null> {
    try {
      // Search using site's torrents.php?imdb={imdb}
      const response = await this.request({
        url: `/torrents.php?imdb=${imdbId}`,
        responseType: "document",
      });

      const document = response.data as Document;

      // Check if redirected to series.php (successful search)
      if (!response.request?.responseURL?.includes("series.php")) {
        console.log(`[BroadcastTheNet] IMDB search for ${imdbId} did not redirect to series.php, no results found`);
        return null;
      }

      // Extract artist name using selector "div.sidebar > .box> .head > strong"
      const artistElement = document.querySelector("div.sidebar > .box > .head > strong");

      if (!artistElement || !artistElement.textContent?.trim()) {
        console.log(`[BroadcastTheNet] Artist name not found in series page for IMDB ID: ${imdbId}`);
        return null;
      }

      const artistName = artistElement.textContent.trim();
      console.log(`[BroadcastTheNet] Found artist name from site: ${artistName} for IMDB ID: ${imdbId}`);

      return artistName;
    } catch (error) {
      console.log(`[BroadcastTheNet] IMDB search failed for IMDB ID: ${imdbId}. Error:`, error);
      return null;
    }
  }

  /**
   * Override getSearchResult to add IMDB search functionality using advanceKeywordParams
   */
  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    // Check if keywords start with "imdb|" (advance keyword format)
    if (keywords?.startsWith("imdb|")) {
      const imdbId = keywords.replace("imdb|", "");

      // Try to get artist name from site's IMDB search
      const artistName = await this.getArtistNameFromIMDB(imdbId);

      if (!artistName) {
        console.log(
          `[BroadcastTheNet] IMDB search failed or returned empty artist name for IMDB ID: ${imdbId}, returning no results`,
        );
        return {
          data: [],
          status: EResultParseStatus.noResults,
        };
      }

      // Add exactartist parameter for precise matching
      const imdbSearchEntry: ISearchEntryRequestConfig = {
        ...searchEntry,
        requestConfig: {
          ...searchEntry.requestConfig,
          params: {
            ...searchEntry.requestConfig?.params,
            exactartist: 1,
          },
        },
      };

      // Perform search with artist name using normal search (since keywordPath is already set to params.artistname)
      return await super.getSearchResult(artistName, imdbSearchEntry);
    }

    // Fall back to normal search for non-IMDB keywords
    return await super.getSearchResult(keywords, searchEntry);
  }
}
