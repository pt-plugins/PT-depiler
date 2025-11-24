/**
 * @PTPPDefinitions HDRoute 完全自定义采集配置 - 合并架构和配置
 */
import PrivateSite from "../schemas/AbstractPrivateSite";
import { type ISiteMetadata, type ITorrent, type ISearchInput } from "../types";
import { parseValidTimeString, parseTimeToLive } from "../utils/datetime";

const stripDecorativeText = (element?: Element | null): string => {
  if (!element) return "";
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("span, small, i, em").forEach((el) => el.remove());
  return (clone.textContent || "").trim();
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
          // 处理 IMDb ID 搜索
          // 注意：在执行此 transformer 之前，系统已经将 keywords（去除 "imdb|" 前缀后）设置到 params.s 了
          if (requestConfig?.params) {
            // 获取 IMDb ID（优先从 params.s 获取，因为系统已经设置了它）
            let imdbId = (requestConfig.params.s as string)?.trim() || keywords?.trim() || "";

            // 移除 tt 前缀（如果存在），站点需要纯数字格式
            if (imdbId.startsWith("tt")) {
              imdbId = imdbId.substring(2);
            }

            // 设置 IMDb 参数（纯数字格式，如 2245171）
            if (imdbId) {
              requestConfig.params.imdb = imdbId;
              // 清除普通搜索关键词（根据站点 URL 格式，设置为空字符串）
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
        filters: [
          (query: string) => {
            const match = query.match(/dl_torrent_(\d+)/);
            return match ? match[1] : "";
          },
        ],
      },
      title: {
        selector: [
          "dt .title_chs",
          "dd .title_chs",
          ".title_chs",
          "dt a[href*='details.php?id=']",
          "dd a[href*='details.php?id=']",
          "a[href*='details.php?id=']",
        ],
        elementProcess: (element: HTMLElement) => stripDecorativeText(element),
      },
      subTitle: {
        selector: ["dt .title_eng", "dd .title_eng", ".title_eng"],
        elementProcess: (element: HTMLElement) => stripDecorativeText(element),
      },
      url: {
        selector: [
          "a[href*='details.php?id=']",
          "dt a[href*='details.php?id=']",
          "dd a[href*='details.php?id=']",
          "dt .torrent_detail_icon a",
          "dd .torrent_detail_icon a",
          ".torrent_detail_icon a",
          "#main > div.details-download-section > div > div.buttonDownloadSection.fl a[href*='details.php?id=']",
          "div.buttonDownloadSection a[href*='details.php?id=']",
        ],
        attr: "href",
      },
      link: {
        selector: [
          "dd .buttonDownloadSection .buttonDownload",
          ".buttonDownloadSection .buttonDownload",
          ".buttonDownload",
        ],
        attr: "onclick",
        filters: [
          (query: string) => {
            // 从 onclick="location.href='download.php?id=144621'" 中提取 download.php?id=144621
            const match = query.match(/location\.href=['"](download\.php\?id=\d+)/);
            return match ? match[1] : "";
          },
        ],
      },
      size: {
        selector: ["dd .torrent_size", "dt .torrent_size", ".torrent_size"],
        filters: [
          (query: string) => {
            if (!query) return "";
            // 清理 HTML 标签
            let cleaned = query.replace(/<br\s*\/?>/gi, " ").trim();
            // 提取数字和单位
            const match = cleaned.match(/([\d.]+)\s*(\w+)/i);
            if (match) {
              return `${match[1]} ${match[2].toUpperCase()}`;
            }
            return cleaned;
          },
          { name: "parseSize" },
        ],
      },
      time: {
        selector: ["dd .torrent_added", "dt .torrent_added", ".torrent_added"],
        filters: [
          (query: any) => {
            // 确保是字符串类型
            if (!query || typeof query !== "string") return null;
            // 清理 HTML 并修复时间格式
            let cleaned = query.replace(/<br\s*\/?>/gi, " ").trim();
            cleaned = cleaned.replace(/(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})/, "$1 $2");
            // 如果清理后为空，返回 null
            return cleaned || null;
          },
          // 自定义 parseFuzzyTime 包装器，处理 null/undefined/空字符串
          (query: any) => {
            // 如果 query 是 null、undefined 或空字符串，返回 undefined（不设置时间字段）
            if (!query || typeof query !== "string" || query.trim() === "") {
              return undefined;
            }
            // 手动调用 parseFuzzyTime 逻辑
            try {
              const time = parseValidTimeString(query, ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss"]);
              // 如果 parseValidTimeString 返回原始值（解析失败），尝试 parseTimeToLive
              if (time === query) {
                // parseTimeToLive 需要字符串类型，我们已经确保 query 是字符串
                return parseTimeToLive(query);
              }
              return time;
            } catch (e) {
              // 如果解析失败（例如 parseTimeToLive 报错），返回 undefined
              return undefined;
            }
          },
        ],
      },
      author: {
        selector: ["dd .torrent_owner", "dt .torrent_owner", ".torrent_owner"],
        filters: [
          (query: string) => {
            if (!query) return "";
            if (query.includes("(匿名)")) {
              return "(匿名)";
            }
            return query.trim();
          },
        ],
      },
      seeders: {
        selector: ["dd .torrent-content-right", "dt .torrent-content-right", ".torrent-content-right"],
        elementProcess: (element: HTMLElement) => {
          if (!element) return 0;
          const strongElements = element.querySelectorAll(".torrent_count.strong");
          if (strongElements.length === 0) return 0;
          const span = strongElements[0]?.querySelector("span");
          const text = span?.textContent?.trim() || "";
          if (text === "---" || !text) return 0;
          return parseInt(text) || 0;
        },
      },
      leechers: {
        selector: ["dd .torrent-content-right", "dt .torrent-content-right", ".torrent-content-right"],
        elementProcess: (element: HTMLElement) => {
          if (!element) return 0;
          const strongElements = element.querySelectorAll(".torrent_count.strong");
          if (strongElements.length < 2) return 0;
          const span = strongElements[1]?.querySelector("span");
          const text = span?.textContent?.trim() || "";
          if (text === "---" || !text) return 0;
          return parseInt(text) || 0;
        },
      },
      completed: {
        selector: [
          "dd .torrent_count strong a span.count-color0",
          "dt .torrent_count strong a span.count-color0",
          ".torrent_count strong a span.count-color0",
          "a span.count-color0",
        ],
        filters: [{ name: "parseNumber" }],
      },
      comments: {
        selector: [
          "dd .torrent_comments_count",
          "dt .torrent_comments_count",
          ".torrent_comments_count",
          "a[href*='details.php?id='] .torrent_comments_count",
        ],
        filters: [{ name: "parseNumber" }],
      },
      category: {
        selector: [
          "dd .torrent_category figure",
          "dt .torrent_category figure",
          ".torrent_category figure",
          "figure.torrent_category",
        ],
        attr: "class",
        filters: [
          (query: string) => {
            if (!query) return "";
            if (query.includes("sprite_r4k2k")) return "4K/2K";
            if (query.includes("sprite_mbluray")) return "Blu-ray原盘";
            if (query.includes("sprite_r1080p")) return "1080P";
            if (query.includes("sprite_mremux")) return "Remux";
            return query;
          },
        ],
      },
      ext_imdb: {
        selector: ["dd .torrent-imdb a", "dt .torrent-imdb a", ".torrent-imdb a", "a[href*='imdb.com']"],
        attr: "href",
        filters: [{ name: "extImdbId" }],
      },
    },
  },

  // 列表页配置（用于 /browse.php 等页面）
  list: [
    {
      urlPattern: ["/browse\\.php"],
      // 合并 search.selectors，这样可以使用相同的选择器配置
      mergeSearchSelectors: true,
      selectors: {
        // 如果列表页的结构与搜索页相同，这里可以留空，会自动使用 search.selectors
        // 如果需要特殊处理，可以在这里覆盖 search.selectors 中的配置
      },
    },
  ],

  // 详情页配置
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
    // 基于实际 HDRoute 页面结构的用户信息配置
    selectors: {
      // 用户名 - 从头部信息获取
      name: {
        selector: ".headerRightInfo span a[href*='userdetail.php']",
      },
      // 用户ID - 从头部链接获取
      id: {
        selector: ".headerRightInfo span a[href*='userdetail.php']",
        attr: "href",
        filters: [
          (query: string) => {
            const match = query.match(/id=(\d+)/);
            return match ? match[1] : "";
          },
        ],
      },
      // 上传量 - 从头部信息获取
      uploaded: {
        selector: ".headerRightInfo span:contains('上传量:') .header-user-data",
        filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }],
      },
      // 下载量 - 从头部信息获取
      downloaded: {
        selector: ".headerRightInfo span:contains('下载量:') .header-user-data",
        filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }],
      },
      // 分享率 - 从头部信息获取
      ratio: {
        selector: ".headerRightInfo span:contains('分享率:') .header-user-data",
        filters: [{ name: "replace", args: [/&nbsp;/g, " "] }, { name: "trim" }, { name: "parseNumber" }],
      },
      // 用户等级 - 从头部信息获取 (Uploader) 这样的文本
      levelName: {
        selector:
          ".headerRightInfo span:contains('('):not(:contains('上传量')):not(:contains('下载量')):not(:contains('分享率'))",
        filters: [
          (query: string) => {
            // 从 (Uploader) 这样的文本中提取等级
            const match = query.match(/\(([^)]+)\)/);
            return match ? match[1] : "";
          },
        ],
      },
      // 消息数量 - 从消息区域获取
      messageCount: {
        selector: "#nav_unread_msg_count",
        filters: [{ name: "trim" }, { name: "parseNumber" }],
      },
      // 发布数量 - 从发布页面获取
      uploads: {
        selector: "#pager-top a:last-of-type b",
        filters: [
          (query: string) => {
            const match = query.match(/(\d+)\s*-\s*(\d+)/);
            return match ? match[2] : query;
          },
          { name: "parseNumber" },
        ],
      },
      // 做种数量 - 从头部信息获取
      seeding: {
        selector: ".header-user-data a[href*='list_seeding.php']",
        filters: [{ name: "parseNumber" }],
      },
      // 做种大小 - 从头部信息获取
      seedingSize: {
        selector: ".header-user-data a[href*='list_seeding.php'] + .peering-size",
        filters: [
          (query: string) => {
            // 从 (62.071 GB) 这样的文本中提取大小
            const match = query.match(/\(([^)]+)\)/);
            return match ? match[1].trim() : "0 B";
          },
        ],
      },
      // 加入时间 - 从用户详情页面获取
      joinTime: {
        selector: ".userdetail-list-title:contains('注册日期') + .userdetail-list-content",
        filters: [{ name: "trim" }, { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] }],
      },
    },
    // 添加 process 配置 - 这是必需的，告诉系统如何获取用户信息
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: [
          "id",
          "name",
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "messageCount",
          "seeding",
          "seedingSize",
        ],
      },
      {
        requestConfig: { url: "/list_uploaded.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: ["uploads"],
      },
      {
        requestConfig: { url: "/userdetail.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: ["joinTime"],
      },
    ],
  },

  // 鉴权配置 - 告诉系统如何检测登录状态
  noLoginAssert: {
    urlPatterns: [/login|signin|auth|verify|checkpoint|returnto/gi],
    httpStatusCodes: [401, 403, 302],
  },
};

/**
 * HDRoute 自定义站点类
 * 继承自 PrivateSite 以支持完整的搜索和用户信息功能
 */
export default class HDRoute extends PrivateSite {
  /**
   * 重写解析种子行的方法，处理 HDRoute 的特殊情况
   */
  protected override async parseWholeTorrentFromRow(
    torrent: Partial<ITorrent> = {},
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Promise<Partial<ITorrent>> {
    const parsedTorrent = await super.parseWholeTorrentFromRow(torrent, row, searchConfig);

    // 确保必需字段存在
    if (row instanceof Element) {
      const detailLink = row.querySelector<HTMLAnchorElement>("a[href*='details.php?id=']");
      const detailHref = detailLink?.getAttribute("href")?.trim() || "";

      // 确保 id 存在
      if (!parsedTorrent.id) {
        const idFromAttr = row.getAttribute("id")?.match(/dl_torrent_(\d+)/)?.[1];
        const idFromHref = detailHref.match(/details\.php\?id=(\d+)/)?.[1];
        parsedTorrent.id = idFromAttr || idFromHref || parsedTorrent.id;
      }

      // 确保 title 存在 - 如果没有，尝试从 URL 链接中获取
      if (!parsedTorrent.title) {
        const titleText = stripDecorativeText(detailLink);
        if (titleText) {
          parsedTorrent.title = titleText;
        }
      }

      // 确保 url 存在 - 优先从页面元素提取，然后从 id 构造
      if (!parsedTorrent.url) {
        const fallbackHref =
          row
            .querySelector<HTMLAnchorElement>(".buttonDownloadSection a[href*='details.php?id=']")
            ?.getAttribute("href")
            ?.trim() || "";

        parsedTorrent.url =
          detailHref || fallbackHref || (parsedTorrent.id ? `details.php?id=${parsedTorrent.id}` : undefined);
      }

      // 对于搜索页面，link 字段不需要在这里设置
      // getTorrentDownloadLink 方法会从 id 构造下载链接（格式：download.php?id=${id}）
      // 并自动追加用户配置的 downloadLinkAppendix 后缀
    }

    // 确保 site 字段存在
    parsedTorrent.site = this.metadata.id;

    // 如果 title 或 id 仍然为空，返回空对象（这会导致种子被跳过）
    if (!parsedTorrent.title || !parsedTorrent.id) {
      return {} as Partial<ITorrent>;
    }

    return parsedTorrent;
  }

  /**
   * 重写详情页解析方法，从 textarea 提取完整下载链接
   */
  public override async transformDetailPage(doc: Document): Promise<ITorrent> {
    const torrent = await super.transformDetailPage(doc);

    // 从文档中提取完整链接（包含 :COOKIE: 信息）
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
        .map((value) => value?.trim())
        .find((value) => value && value.length > 0) || "";

    if (fullLink) {
      torrent.link = fullLink;
    }

    // 确保至少有一个基础的 link（前端需要这个字段）
    if (!torrent.link && torrent.id) {
      torrent.link = `/download.php?id=${torrent.id}`;
    }

    return torrent;
  }

  /**
   * 重写获取下载链接方法，如果链接已包含 :COOKIE:，直接返回
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 如果 link 已经包含 :COOKIE:，说明是从详情页 textarea 获取的完整链接
    // 直接返回，不要追加用户配置的后缀
    if (
      torrent.link &&
      typeof torrent.link === "string" &&
      torrent.link.trim().length > 0 &&
      torrent.link.includes(":COOKIE:")
    ) {
      return torrent.link.trim();
    }

    // 调用父类方法处理后续逻辑（包括从 id 构造链接和追加用户配置的后缀）
    return await super.getTorrentDownloadLink(torrent);
  }
}
