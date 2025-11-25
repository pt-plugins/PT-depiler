/**
 * @PTPPDefinitions HDRoute 完全自定义采集配置
 */
import PrivateSite from "../schemas/AbstractPrivateSite";
import { type ISiteMetadata, type ITorrent, type ISearchInput } from "../types";

// 辅助函数：去除装饰性文本
const stripDecorativeText = (element?: Element | null): string => {
  if (!element) return "";
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("span, small, i, em").forEach((el) => el.remove());
  return (clone.textContent || "").trim();
};

// 辅助函数：提取种子数量（做种/下载）
const extractTorrentCount = (element: HTMLElement | null, index: number): number => {
  if (!element) return 0;
  const strongElements = element.querySelectorAll(".torrent_count.strong");
  const span = strongElements[index]?.querySelector("span");
  const text = span?.textContent?.trim() || "";
  return text && text !== "---" ? parseInt(text) || 0 : 0;
};

// 辅助函数：生成通用的 dt/dd/self 选择器模式
const makeSelector = (className: string, fallback?: string[]): string[] => {
  const base = [`dd .${className}`, `dt .${className}`, `.${className}`];
  return fallback ? [...base, ...fallback] : base;
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdroute",
  name: "HDRoute",
  description: "HDRoute - 高清影视资源站点",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  type: "private",
  schema: "AbstractPrivateSite", // 虽然导出了自定义类，但保持 schema 字段规范
  urls: ["uggc://uqebhgr.bet/"], // ROT13编码: https://hdrouteo.bet/

  // HDRoute 搜索配置
  search: {
    keywordPath: "params.s",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: {
        action: "s",
        s: "",
        or: 1,
        dp: 0,
        add: 0,
        imdb: "",
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          if (requestConfig?.params) {
            let imdbId = (requestConfig.params.s as string)?.trim() || keywords?.trim() || "";
            if (imdbId.startsWith("tt")) imdbId = imdbId.substring(2);
            if (imdbId) {
              requestConfig.params.imdb = imdbId;
              requestConfig.params.s = "";
            }
          }
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: {
        selector: "dl[id^='dl_torrent_']",
      },
      id: {
        selector: ":self",
        attr: "id",
        filters: [(query: string) => query.match(/dl_torrent_(\d+)/)?.[1] || ""],
      },
      title: {
        selector: makeSelector("title_chs", [
          "dt a[href*='details.php?id=']",
          "dd a[href*='details.php?id=']",
          "a[href*='details.php?id=']",
        ]),
        elementProcess: stripDecorativeText,
      },
      subTitle: {
        selector: makeSelector("title_eng"),
        elementProcess: stripDecorativeText,
      },
      url: {
        selector: [
          "a[href*='details.php?id=']",
          ...makeSelector("torrent_detail_icon a"),
          "div.buttonDownloadSection a[href*='details.php?id=']",
        ],
        attr: "href",
      },
      link: {
        selector: [".buttonDownloadSection .buttonDownload", ".buttonDownload"],
        attr: "onclick",
        filters: [(query: string) => query.match(/location\.href=['"](download\.php\?id=\d+)/)?.[1] || ""],
      },
      size: {
        selector: makeSelector("torrent_size"),
        filters: [{ name: "parseSize" }],
      },
      time: {
        selector: makeSelector("torrent_added"),
        filters: [
          (query: any) => {
            if (!query || typeof query !== "string") return String(Date.now());
            const cleaned = query.trim().replace(/(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})/, "$1 $2");
            return cleaned || String(Date.now());
          },
          { name: "parseFuzzyTime", args: ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss"] },
        ],
      },
      author: {
        selector: makeSelector("torrent_owner"),
        filters: [(query: string) => (!query ? "" : query.includes("(匿名)") ? "(匿名)" : query.trim())],
      },
      seeders: {
        selector: makeSelector("torrent-content-right"),
        elementProcess: (element: HTMLElement) => extractTorrentCount(element, 0),
      },
      leechers: {
        selector: makeSelector("torrent-content-right"),
        elementProcess: (element: HTMLElement) => extractTorrentCount(element, 1),
      },
      completed: {
        selector: makeSelector("torrent_count strong a span.count-color0", ["a span.count-color0"]),
        filters: [{ name: "parseNumber" }],
      },
      comments: {
        selector: makeSelector("torrent_comments_count", ["a[href*='details.php?id='] .torrent_comments_count"]),
        filters: [{ name: "parseNumber" }],
      },
      category: {
        text: "",
        selector: makeSelector("torrent_category figure", ["figure.torrent_category"]),
        case: {
          ".sprite_r4k2k": "4K/2K",
          ".sprite_mbluray": "Blu-ray原盘",
          ".sprite_r1080p": "1080P",
          ".sprite_mremux": "Remux",
        },
      },
      ext_imdb: {
        selector: makeSelector("torrent-imdb a", ["a[href*='imdb.com']"]),
        attr: "href",
        filters: [{ name: "extImdbId" }],
      },
    },
  },

  list: [
    {
      urlPattern: ["/browse\\.php"],
      mergeSearchSelectors: true,
      selectors: {},
    },
  ],

  detail: {
    urlPattern: ["/details.php\\?id=\\d+"],
    selectors: {
      id: {
        selector: ["input[name='tId']", "input[name='id']"],
        attr: "value",
      },
      title: {
        selector: [".details-title-eng", ".details-title-chs", "h1"],
      },
    },
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: {
            selector: ".headerRightInfo span a[href*='userdetail.php']",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: {
            selector: ".headerRightInfo span a[href*='userdetail.php']",
          },
          uploaded: {
            selector: ".headerRightInfo span:contains('上传量:') .header-user-data",
            filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }],
          },
          downloaded: {
            selector: ".headerRightInfo span:contains('下载量:') .header-user-data",
            filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }],
          },
          ratio: {
            selector: ".headerRightInfo span:contains('分享率:') .header-user-data",
            filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }, { name: "parseNumber" }],
          },
          levelName: {
            selector:
              ".headerRightInfo span:contains('('):not(:contains('上传量')):not(:contains('下载量')):not(:contains('分享率'))",
            filters: [(query: string) => query.match(/\(([^)]+)\)/)?.[1] || ""],
          },
          messageCount: {
            selector: "#nav_unread_msg_count",
            filters: [{ name: "trim" }, { name: "parseNumber" }],
          },
          seeding: {
            selector: ".header-user-data a[href*='list_seeding.php']",
            filters: [{ name: "parseNumber" }],
          },
          seedingSize: {
            selector: ".header-user-data a[href*='list_seeding.php'] + .peering-size",
            filters: [{ name: "parseSize" }],
          },
        },
      },
      {
        requestConfig: { url: "/list_uploaded.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          uploads: {
            selector: "#pager-top a:last-of-type b",
            filters: [(query: string) => query.match(/(\d+)\s*-\s*(\d+)/)?.[2] || query, { name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetail.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          joinTime: {
            selector: ".userdetail-list-title:contains('注册日期') + .userdetail-list-content",
            filters: [{ name: "trim" }, { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] }],
          },
        },
      },
    ],
  },

  noLoginAssert: {
    urlPatterns: [/login|signin|auth|verify|checkpoint|returnto/gi],
    httpStatusCodes: [401, 403, 302],
  },
};

export default class HDRoute extends PrivateSite {
  protected override async parseWholeTorrentFromRow(
    torrent: Partial<ITorrent> = {},
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Promise<Partial<ITorrent>> {
    const parsedTorrent = await super.parseWholeTorrentFromRow(torrent, row, searchConfig);

    if (row instanceof Element) {
      const detailLink = row.querySelector<HTMLAnchorElement>("a[href*='details.php?id=']");
      const detailHref = detailLink?.getAttribute("href")?.trim() || "";

      if (!parsedTorrent.id) {
        parsedTorrent.id =
          row.getAttribute("id")?.match(/dl_torrent_(\d+)/)?.[1] ||
          detailHref.match(/details\.php\?id=(\d+)/)?.[1] ||
          parsedTorrent.id;
      }

      if (!parsedTorrent.title) {
        const titleText = stripDecorativeText(detailLink);
        if (titleText) parsedTorrent.title = titleText;
      }

      if (!parsedTorrent.url) {
        const fallbackHref =
          row
            .querySelector<HTMLAnchorElement>(".buttonDownloadSection a[href*='details.php?id=']")
            ?.getAttribute("href")
            ?.trim() || "";
        parsedTorrent.url =
          detailHref || fallbackHref || (parsedTorrent.id ? `details.php?id=${parsedTorrent.id}` : undefined);
      }
    }

    parsedTorrent.site = this.metadata.id;
    return parsedTorrent.title && parsedTorrent.id ? parsedTorrent : ({} as Partial<ITorrent>);
  }

  public override async transformDetailPage(doc: Document): Promise<ITorrent> {
    const torrent = await super.transformDetailPage(doc);

    const downloadLinkContainer = doc.querySelector<HTMLTextAreaElement | HTMLInputElement>("#details-download-link");
    const button = doc.querySelector<HTMLElement>("button.buttonDownload");
    const fullLink =
      [
        downloadLinkContainer?.value,
        downloadLinkContainer?.textContent,
        button?.getAttribute("data-clipboard-text"),
        button?.getAttribute("data-link"),
        button?.getAttribute("data-download-link"),
      ]
        .map((v) => v?.trim())
        .find((v) => v && v.length > 0) || "";

    torrent.link = fullLink || (torrent.id ? `/download.php?id=${torrent.id}` : torrent.link);
    return torrent;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (
      torrent.link &&
      typeof torrent.link === "string" &&
      torrent.link.trim().length > 0 &&
      torrent.link.includes(":COOKIE:")
    ) {
      return torrent.link.trim();
    }
    return await super.getTorrentDownloadLink(torrent);
  }
}
