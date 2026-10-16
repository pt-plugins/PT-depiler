/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/BroadcasTheNet.cs
 */
import type { ISiteMetadata, ISearchResult, ISearchEntryRequestConfig, ITorrent } from "../types.ts";
import { SchemaMetadata } from "../schemas/Gazelle.ts";
import Gazelle from "../schemas/Gazelle.ts";
import { CFBlockedError, EResultParseStatus, ETorrentStatus } from "../types.ts";
import { parseSizeString } from "../utils";

interface BTNTorrent {
  TorrentID: string | number;
  GroupID: string | number;
  ReleaseName: string;
  Series: string;
  GroupName: string;
  Category: string;
  Size: string | number;
  Time: string | number;
  Seeders: string | number;
  Leechers: string | number;
  Snatched: string | number;
  DownloadURL: string;
}

interface BTNSearchResponse {
  result: { results: string | number; torrents?: Record<string, BTNTorrent> } | null;
  error?: { code: number; message: string } | null;
}

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

  userInputSettingMeta: [
    {
      name: "apiKey",
      label: "API Key",
      hint: "选填：填写后使用 API 搜索，否则使用网页搜索。请在 BTN 个人设置中生成；新 IP 需在站点通知中授权。",
      required: false,
    },
  ],

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
        attr: "title",
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
          params: {/* id: flushUserInfo.id */},
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
          "lastAccessAt",
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
        // 站点只给「Per Day」，除以 24 得到时魔；这里用内联过滤器 —— 具名过滤器表里没有 divide，
        // 写成 { name: "divide" } 会被 runQueryFilters 静默跳过（该值曾因此偏高 24 倍）
        selector: "ul.nobullet > li:contains('Per Day:')",
        filters: [{ name: "parseNumber" }, (query: number) => query / 24],
      },
      ratio: undefined,
      joinTime: {
        selector: "ul.nobullet > li:contains('Joined:') > span",
        filters: [{ name: "parseTTL" }],
      },
      lastAccessAt: {
        selector: "ul.nobullet > li:contains('Last Seen:') > span",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
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
      interval: "P1M",
      privilege:
        "Has access to the Power User forum, Official and Unofficial Invites forums, Top 10 filters, and can access notifications.",
    },
    {
      id: 3,
      name: "Extreme User",
      totalTraffic: "500GB",
      bonus: 500000,
      snatches: 500,
      interval: "P3M",
      privilege: "Has access to the Extreme User forum.",
    },
    {
      id: 4,
      name: "Elite",
      totalTraffic: "1TB",
      bonus: 850000,
      snatches: 1000,
      interval: "P6M",
      privilege:
        "Has access to the Elite forum and can set own Custom Title, and the ability to send invites purchased from the Lumens Store.",
    },
    {
      id: 5,
      name: "Guru",
      totalTraffic: "2.5TB",
      bonus: 1500000,
      snatches: 1500,
      interval: "P9M",
      privilege: "Has access to the Guru forum.",
    },
    {
      id: 6,
      name: "Master",
      totalTraffic: "7.5TB",
      bonus: 3000000,
      snatches: 3000,
      interval: "P1Y",
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
      isKept: true,
      privilege:
        "Has access to the Overlord forum, Custom Title, Unlimited Invites, and immunity from Inactivity Pruning.",
    },
  ],
};

export default class BroadcastTheNet extends Gazelle {
  private async getAPISearchResult(keywords: string | undefined, apiKey: string): Promise<ISearchResult> {
    try {
      let search: string | { imdb: string } = keywords || "";
      if (keywords?.startsWith("imdb|")) {
        const imdbId = keywords.match(/^imdb\|(?:tt)?(\d+)$/)?.[1];
        if (!imdbId) throw new Error("Invalid IMDb ID");
        search = { imdb: `tt${imdbId}` };
      }

      const { data } = await this.request<BTNSearchResponse>(
        {
          url: "https://api.broadcasthe.net/",
          method: "POST",
          responseType: "json",
          headers: { "Content-Type": "application/json" },
          data: { id: 1, method: "getTorrents", params: { key: apiKey, search, results: 1000, offset: 0 } },
        },
        false,
      );

      if (data?.error) {
        const messages: Record<number, string> = {
          [-32001]: "API Key 无效，请检查 BTN 设置",
          [-32002]: "API 调用次数已达限制，请稍后再试",
          [-32003]: "BTN 账号已被禁用",
          [-32004]: "当前 IP 未获授权，请在 BTN 站点通知中批准后重试",
        };
        return {
          data: [],
          status: EResultParseStatus.parseError,
          statusMsg: messages[data.error.code] || `BTN API error ${data.error.code}: ${data.error.message}`,
        };
      }

      if (!data?.result || !Number.isFinite(Number(data.result.results))) {
        throw new Error("Invalid BTN API response");
      }
      if (Number(data.result.results) > 0 && !data.result.torrents) {
        throw new Error("BTN API response is missing torrents");
      }

      const torrents = Object.values(data.result.torrents || {}).map((torrent): ITorrent => ({
        site: this.metadata.id,
        id: torrent.TorrentID,
        title: torrent.ReleaseName,
        subTitle: [torrent.Series, torrent.GroupName].filter(Boolean).join(" / "),
        category: torrent.Category,
        url: new URL(`torrents.php?id=${torrent.GroupID}&torrentid=${torrent.TorrentID}`, this.url).toString(),
        link: torrent.DownloadURL,
        size: Number(torrent.Size),
        time: Number(torrent.Time) * 1000,
        seeders: Number(torrent.Seeders),
        leechers: Number(torrent.Leechers),
        completed: Number(torrent.Snatched),
        progress: 0,
        status: ETorrentStatus.unknown,
        tags: [{ name: "H&R", color: "red" }],
      }));

      return {
        data: torrents,
        status: torrents.length > 0 ? EResultParseStatus.success : EResultParseStatus.noResults,
      };
    } catch (error) {
      return {
        data: [],
        status: error instanceof CFBlockedError ? EResultParseStatus.CFBlocked : EResultParseStatus.parseError,
        statusMsg: error instanceof Error ? error.message : "BTN API search failed",
      };
    }
  }

  private async getSeriesPageFromIMDB(imdbId: string): Promise<{ document: Document; pageUrl: string } | null> {
    try {
      const response = await this.request({
        url: `/torrents.php?imdb=${imdbId}`,
        responseType: "document",
      });
      const document = response.data as Document;
      const pageUrl = response.request?.responseURL || document.URL || "";

      if (!pageUrl.includes("series.php")) {
        console.log(`[BroadcastTheNet] IMDB search for ${imdbId} did not redirect to series.php, no results found`);
        return null;
      }

      return { document, pageUrl };
    } catch (error) {
      console.log(`[BroadcastTheNet] IMDB search failed for IMDB ID: ${imdbId}. Error:`, error);
      return null;
    }
  }

  private parseSeriesPageTorrents(document: Document, pageUrl: string): ITorrent[] {
    const seriesTitle =
      document.querySelector("div.sidebar > .box > .head > strong")?.textContent?.trim() ||
      document.querySelector("h2")?.textContent?.trim() ||
      "";
    const torrents: ITorrent[] = [];
    let currentSeason = "";
    let currentYear = "";

    const normalizeText = (text: string | null | undefined): string => (text || "").replace(/\s+/g, " ").trim();
    const resolveUrl = (href: string | null | undefined): string | undefined => {
      if (!href) return undefined;

      return new URL(href, pageUrl || "https://broadcasthe.net/series.php").toString();
    };
    const parseNumberCell = (cell: Element | undefined): number | undefined => {
      const value = Number.parseInt(normalizeText(cell?.textContent).replace(/,/g, ""), 10);
      return Number.isNaN(value) ? undefined : value;
    };

    document.querySelectorAll("table.torrent_table tr").forEach((row) => {
      if (row.classList.contains("colhead_dark")) {
        currentSeason = normalizeText(row.querySelector("strong")?.textContent);
        currentYear = "";
        return;
      }

      if (!row.classList.contains("group_torrent")) return;

      const detailLink = row.querySelector<HTMLAnchorElement>("a[href*='torrents.php?id='][href*='torrentid=']");
      const downloadLink = row.querySelector<HTMLAnchorElement>("a[href*='torrents.php?action=download']");
      if (!detailLink || !downloadLink) return;

      const seasonLink = row.querySelector<HTMLAnchorElement>("a.season");
      const year = normalizeText(row.querySelector(".year")?.textContent);
      if (seasonLink) currentSeason = normalizeText(seasonLink.textContent);
      if (year) currentYear = year;

      const cells = Array.from(row.children);
      const size = normalizeText(cells.at(-4)?.textContent);
      const subTitle = normalizeText(detailLink.textContent);
      const title = [seriesTitle, currentYear, currentSeason, subTitle].filter(Boolean).join(" ");
      const url = resolveUrl(detailLink.getAttribute("href"));
      const link = resolveUrl(downloadLink.getAttribute("href"));

      if (!url || !link) return;

      torrents.push({
        site: this.metadata.id,
        id: new URL(link).searchParams.get("id") || new URL(url).searchParams.get("torrentid") || url,
        title,
        subTitle,
        url,
        link,
        size: size ? parseSizeString(size) : undefined,
        completed: parseNumberCell(cells.at(-3)),
        seeders: parseNumberCell(cells.at(-2)),
        leechers: parseNumberCell(cells.at(-1)),
        progress: 0,
        status: ETorrentStatus.unknown,
        tags: [{ name: "H&R", color: "red" }],
      });
    });

    return torrents;
  }

  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    const apiKey = this.userConfig.inputSetting?.apiKey?.trim();
    if (apiKey) return this.getAPISearchResult(keywords, apiKey);

    if (keywords?.startsWith("imdb|")) {
      const imdbId = keywords.replace("imdb|", "");
      const seriesPage = await this.getSeriesPageFromIMDB(imdbId);
      if (!seriesPage) {
        return {
          data: [],
          status: EResultParseStatus.noResults,
        };
      }

      const torrents = this.parseSeriesPageTorrents(seriesPage.document, seriesPage.pageUrl);

      return {
        data: torrents,
        status: torrents.length > 0 ? EResultParseStatus.success : EResultParseStatus.noResults,
      };
    }

    return await super.getSearchResult(keywords, searchEntry);
  }
}
