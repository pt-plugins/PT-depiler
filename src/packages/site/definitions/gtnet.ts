import type { AxiosRequestConfig } from "axios";
import type { ISiteMetadata, ITorrent, ISearchResult, ISearchEntryRequestConfig } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";

export const siteMetadata: ISiteMetadata = {
  id: "gtnet",
  version: 1,
  name: "Gay-Torrents.net",
  tags: ["成人"],
  type: "private",
  timezoneOffset: "+0800",
  urls: ["https://www.gay-torrents.net/"],

  search: {
    requestConfig: {
      url: "/search.php?do=process",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        do: "process",
        securitytoken: "",
      },
      responseType: "document",
    },
    keywordPath: "data.query",
    selectors: {
      rows: {
        selector: "div#display ul.TorrentList",
      },
      id: {
        selector: "li.TorrentList2 a[href*='torrentdetails.php']",
        attr: "href",
        filters: [(q: string) => q.match(/torrentid=([a-f0-9]+)/)?.[1] ?? q],
      },
      title: { selector: "li.TorrentList2 a[href*='torrentdetails.php']" },
      url: {
        selector: "li.TorrentList2 a[href*='torrentdetails.php']",
        attr: "href",
      },
      link: {
        selector: "a[href*='download.php']",
        attr: "href",
      },
      size: {
        selector: "li.TorrentList3",
        filters: [{ name: "parseSize" }],
      },
      seeders: {
        selector: "li.TorrentList6",
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: "li.TorrentList7",
        filters: [{ name: "parseNumber" }],
      },
      time: {
        selector: "li.TorrentList8",
        filters: [(q: string) => q.trim(), { name: "parseTime", args: ["HH:mm dd-MMM-yyyy"] }],
      },
      category: {
        selector: "li.TorrentList1 a[href*='torrentslist.php']",
        attr: "href",
        filters: [
          (q: string) => {
            const match = q.match(/type=([^&]+)/);
            return match ? decodeURIComponent(match[1]).replace(/\//g, " > ") : "";
          },
        ],
      },
    },
  },

  list: [
    {
      urlPattern: ["/torrentslist\\.php", "/search\\.php"],
      selectors: {
        rows: {
          selector: "div#display ul.TorrentList",
        },
        keywords: { selector: "input[name='query']", attr: "value" },
      },
    },
  ],

  detail: {
    urlPattern: ["/torrentdetails\\.php\\?torrentid=[a-f0-9]+"],
    selectors: {
      link: { selector: "a[href*='download.php']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],

    process: [
      {
        requestConfig: { url: "/member.php" },
        selectors: {
          id: {
            selector: "ul.isuser li.welcomelink a[href*='member.php?']",
            attr: "href",
            filters: [
              (q: string) => {
                const match = q.match(/member\.php\?(\d+)/);
                return match ? match[1] : q;
              },
            ],
          },
          name: {
            selector: "ul.isuser li.welcomelink a[href*='member.php?']",
          },
        },
      },
      {
        requestConfig: { url: "/member.php?$id$-$name$" },
        assertion: { id: "url", name: "url" },
        selectors: {
          uploaded: {
            selector: "dl.stats:has(dt:contains('Uploaded')) dd",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "dl.stats:has(dt:contains('Downloaded')) dd",
            filters: [
              (q: string) => {
                if (q.trim() === "0") return "0 B";
                return q;
              },
              { name: "parseSize" },
            ],
          },
          ratio: {
            selector: "dl.stats:has(dt:contains('Ratio')) dd",
            filters: [
              (q: string) => {
                const trimmed = q.trim();
                if (trimmed === "??" || trimmed === "∞" || trimmed === "Inf") {
                  return -1;
                }
                return parseFloat(trimmed) || 0;
              },
            ],
          },
          bonus: {
            selector: "dl.stats:has(dt:contains('Juices')) dd",
            filters: [{ name: "parseNumber" }],
          },
          levelName: {
            selector: "#userinfo span.usertitle",
          },
          joinTime: {
            selector: "dl.stats:has(dt:contains('Join Date')) dd",
            filters: [(q: string) => q.trim(), { name: "parseTime", args: ["HH:mm dd-MMM-yyyy"] }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Newbie",
    },
  ],
};

export default class Gtnet extends PrivateSite {
  /**
   * 从页面中获取 vBulletin 的 securitytoken
   */
  private async getSecurityToken(): Promise<string> {
    const { data: doc } = await this.request<Document>({
      url: "/torrentslist.php",
      responseType: "document",
    });

    // 从页面 JS 变量中提取 SECURITYTOKEN
    const scripts = doc.querySelectorAll("script");
    for (const script of scripts) {
      const text = script.textContent || "";
      const match = text.match(/SECURITYTOKEN\s*=\s*"([^"]+)"/);
      if (match) {
        return match[1];
      }
    }

    // 备选：从搜索表单的 hidden input 中获取
    const tokenInput = doc.querySelector('input[name="securitytoken"]') as HTMLInputElement | null;
    if (tokenInput?.value) {
      return tokenInput.value;
    }

    return "";
  }

  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    // 搜索前先获取 securitytoken
    if (keywords) {
      const token = await this.getSecurityToken();
      if (token) {
        // 将 token 注入到搜索配置中
        if (!this.metadata.search!.requestConfig!.data) {
          this.metadata.search!.requestConfig!.data = {};
        }
        (this.metadata.search!.requestConfig!.data as Record<string, string>).securitytoken = token;
      }
    }

    return super.getSearchResult(keywords, searchEntry);
  }

  public override async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig> {
    const detailUrl = `/torrentdetails.php?torrentid=${torrent.id}`;
    const { data: doc } = await this.request<Document>({
      url: detailUrl,
      responseType: "document",
    });

    let token = "";
    const scripts = doc.querySelectorAll("script");
    for (const script of scripts) {
      const text = script.textContent || "";
      const match = text.match(/SECURITYTOKEN\s*=\s*"([^"]+)"/);
      if (match) {
        token = match[1];
        break;
      }
    }
    if (!token) {
      const tokenInput = doc.querySelector('input[name="securitytoken"]') as HTMLInputElement | null;
      if (tokenInput?.value) {
        token = tokenInput.value;
      }
    }

    return {
      baseURL: this.url,
      url: "/torrentdetails.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: `${this.url}torrentdetails.php?torrentid=${torrent.id}`,
      },
      data: `do=download&securitytoken=${token}&torrentid=${torrent.id}&download=as+Torrent`,
      timeout: this.userConfig.timeout ?? 30e3,
    };
  }
}
