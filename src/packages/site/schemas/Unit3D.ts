import urlJoin from "url-join";
import { omit, toMerged } from "es-toolkit";

import PrivateSite from "./AbstractPrivateSite";
import {
  ETorrentStatus,
  EResultParseStatus,
  type ISiteMetadata,
  type IUserInfo,
  NeedLoginError,
  ITorrent,
} from "../types";
import { parseSizeString, parseValidTimeString } from "../utils";

/**
 * Trans Array
 * Source: https://github.com/HDInnovations/UNIT3D-Community-Edition/commit/cb1efe0868caf771b9917c090a79b28b4e183b74
 */
const idTrans: string[] = ["User ID", "用户 ID", "用ID", "用户ID"];
const seedingSizeTrans: string[] = ["Seeding Size", "Seeding size", "做种体积", "做種體積"];
const joinTimeTrans: string[] = ["Registration date", "注册日期", "註冊日期"];
const averageSeedingTimeTrans: string[] = ["Average Seedtime", "Average seedtime", "平均做种时间", "平均做種時間"];
const invitesTrans: string[] = ["Invites", "邀请", "邀請"];
const ratioTrans: string[] = ["Ratio", "分享率", "比率"];
const trueRatioTrans: string[] = ["Real Ratio", "真实分享率", "真實比率"];

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  timezoneOffset: "+0000",
  search: {
    keywordPath: "params.name",
    requestConfig: {
      url: "/torrents/",
      responseType: "document",
      params: {
        perPage: 100,
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.imdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.tmdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
    },
    selectors: {
      rows: {
        selector: [
          "div.torrent-search--list__results > table:first > tbody > tr", // 新版布局
          "div.table-responsive table > tbody > tr", // 旧版布局
        ],
      },

      /**
       * 未发现 Unit3D 站点对于种子列表有太大改动，所以直接硬写选择器而不是和 NPHP 一样自动生成
       * based on: https://github.com/HDInnovations/UNIT3D-Community-Edition/blob/cb1efe0868caf771b9917c090a79b28b4e183b74
       */
      id: {
        selector: ["a.view-torrent", "a.torrent-search--list__name"],
        attr: "href",
        filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
      },
      title: {
        selector: ["a.view-torrent", "a.torrent-search--list__name"],
      },
      subTitle: {
        text: "", // Unit3D 并不在种子列表页显示副标题，或者说他们就没有副标题的设计
      },
      url: {
        selector: ["a.view-torrent", "a.torrent-search--list__name"],
        attr: "href",
      },
      // /resources/views/torrent/results.blade.php#L367-L381
      link: {
        selector: ["a[href*='/download/']", "a[href*='/download_check/']"],
        attr: "href",
        filters: [(query: string) => query.replace("/download_check/", "/download/")],
      },
      // /resources/views/torrent/results.blade.php#L399-L401
      time: { selector: ["time"], filters: [{ name: "parseTTL" }] },
      // /resources/views/torrent/results.blade.php#L402-L404
      size: {
        selector: ['td>span.text-blue:contains("B")', "td.torrent-search--list__size"],
      },
      // /resources/views/torrent/results.blade.php#L166-L184
      author: {
        selector: ["span:has( > i.fa-upload)", "span.torrent-search--list__uploader"],
        filters: [
          (query: string) => query.replace(/ +\(/, " ("), // 防止可以看见匿名等级的用户中间有一堆空格。。。
        ],
      },
      // /resources/views/torrent/results.blade.php#L95-L113
      category: {
        selector: [
          'a[href*="/categories/"] > div > img[data-original-title]',
          'a[href*="/categories/"] > div > i[data-original-title]',
          "div.torrent-search--list__category img",
        ],
        elementProcess: (element: any) => {
          if (!element) return "";

          // Handle Unit3D original format (data-original-title)
          if (element.dataset && element.dataset.originalTitle) {
            const title = element.dataset.originalTitle;
            // {{ $torrent->category->name }} {{ strtolower(trans('torrent.torrent')) }}
            return title.split(" ").slice(0, -1).join(" ");
          }

          // Handle Blutopia style (alt attribute)
          if (element.getAttribute && element.getAttribute("alt")) {
            return element.getAttribute("alt");
          }

          return "";
        },
      },

      // /resources/views/torrent/results.blade.php#L405-L426
      seeders: {
        selector: ['a[href*="/peers"] > span.text-green', "td.torrent-search--list__seeders"],
      },
      leechers: {
        selector: ['a[href*="/peers"] > span.text-red', "td.torrent-search--list__leechers"],
      },
      completed: {
        selector: ['a[href*="/history"] > span.text-orange', "td.torrent-search--list__completed"],
      },

      // /resources/views/torrent/results.blade.php#L213-L219
      comments: {
        selector: ['a[href*="#comments"]', "i.torrent-icons__comments"],
      },

      status: {
        selector: ["span.torrent-icons > i.torrent-icons"],
        text: ETorrentStatus.unknown,
        case: {
          "i.fa-arrow-circle-up": ETorrentStatus.seeding, // 做种!
          "i.fa-arrow-circle-down": ETorrentStatus.downloading, // 吸血!
          "i.fa-do-not-enter": ETorrentStatus.inactive, // 未完成!
          "i.fa-thumbs-down": ETorrentStatus.completed, // 撤种!
        },
      },
      progress: {
        selector: ["span.torrent-icons > i.torrent-icons"],
        text: 0,
        case: {
          "i.fa-arrow-circle-up, i.fa-thumbs-down": 100,
        },
      },
      tags: [
        {
          name: "Free",
          selector:
            "i.fa-star.text-gold, i.fa-globe, i[title*='100%'], i.torrent-icons__featured, i[title*='Featured'], i[data-original-title*='Featured'], i[data-original-title*='Free']",
          color: "blue",
        },
        {
          name: "2xUp",
          selector:
            "i.fa-gem.text-green, i.torrent-icons__double-upload, i.torrent-icons__featured, i[title*='Double Upload'], i[title*='Featured'], i[data-original-title*='Double Upload'], i[data-original-title*='Featured']",
          color: "lime",
        },
        {
          name: "75%",
          selector: "i[title*='75%']",
          color: "lime-darken-3",
        },
        {
          name: "50%",
          selector: "i[title*='50%']",
          color: "deep-orange-darken-1",
        },
        {
          name: "25%",
          selector: "i[title*='25%']",
          color: "blue",
        },
        {
          name: "置顶",
          selector: "i.fa-thumbtack",
          color: "red",
        },
        {
          name: "可退款",
          selector: "i.fa-percentage, i[title*='Refundable']",
          color: "gray",
        },
        {
          name: "Internal",
          selector: "i.torrent-icons__internal",
          color: "purple",
        },
        {
          name: "个人发布",
          selector: "i.torrent-icons__personal-release",
          color: "purple",
        },
        {
          name: "Highspeed",
          selector: "i.torrent-icons__highspeed",
          color: "red",
        },
        {
          name: "Trump",
          selector: "i.torrent-icons__torrent-trump",
          color: "red",
        },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents(?:/?$|\\?\[\^/\]*$)"],
      excludeUrlPattern: ["/torrents?view=card", "/torrents?view=grouped", "/torrents/view=poster"],
    },
    {
      urlPattern: ["/torrents/similar/"],
      mergeSearchSelectors: false,
      selectors: {
        rows: {
          selector: [
            "table.similar-torrents__torrents > tbody > tr",
            "table > tbody > tr:has(td a[href*='/torrents/download/'])",
          ],
        },
        id: {
          selector: ["a[href*='/torrents/']:not([href*='/download'])"],
          attr: "href",
          filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
        },
        title: {
          selector: ["a[href*='/torrents/']:not([href*='/download'])"],
        },
        url: {
          selector: ["a[href*='/torrents/']:not([href*='/download'])"],
          attr: "href",
        },
        link: {
          selector: ["a[href*='/download/']", "a[href*='/download_check/']"],
          attr: "href",
          filters: [(query: string) => query.replace("/download_check/", "/download/")],
        },
      },
    },
  ],

  detail: {
    urlPattern: ["/torrents/\\d+"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          // 首先尝试从页面的 URL 中获取 ID
          const url = element.URL;
          const idMatch = url.match(/\/torrents\/(\d+)/);
          if (idMatch && idMatch.length >= 2) {
            return idMatch[1];
          }

          // 如果 URL 中没有 ID，则尝试从页面解析 a[href*='/torrents/']
          const torrentLink = element.querySelector("a[href*='/torrents/']");
          if (torrentLink) {
            const href = torrentLink.getAttribute("href");
            const idMatchFromHref = href?.match(/\/torrents\/(\d+)/);
            if (idMatchFromHref && idMatchFromHref.length >= 2) {
              return idMatchFromHref[1];
            }
          }

          // 如果还是没有，那么我们尽力了，返回underfined
          return undefined;
        },
      },

      title: {
        selector: [
          // refs: https://github.com/HDInnovations/UNIT3D/blob/b5d93fdbe493040a1fa1124d2c8499ee0b180937/resources/views/torrent/show.blade.php#L48-L50
          "h1.torrent__name",
          "html > body > title",
        ],
        switchFilters: {
          "html > body > title": [
            (title: string) => {
              // {{ $torrent->name }} - {{ __('torrent.torrents') }} - {{ config('other.title') }}
              const titleMatch = title.match(/^(.*) - .* - .+$/);
              if (titleMatch && titleMatch.length >= 2) {
                return titleMatch[1];
              }
              return title;
            },
          ],
        },
      },
      link: {
        selector: ["a[href*='/download/']", "a[href*='/download_check/']"],
        attr: "href",
      },
    },
  },

  userInfo: {
    pickLast: ["name"],
    selectors: {
      // '/'
      name: {
        selector: ["a[href*='/users/'][href*='settings']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            // match '/users/{name}' where {name} can be followed by a '/' or end of string
            const queryMatch = query.match(/users\/([^\/]+)(?:\/|$)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
          },
        ],
      },
      // "/users/$user.name$"
      id: {
        selector: idTrans.map((x) => `td:contains('${x}') + td`),
        filters: [(query: string) => parseInt(query || "0")],
      },
      uploaded: {
        selector: ["li.ratio-bar__uploaded a:has( > i.fa-arrow-up)", "span:has( > i.fa-arrow-up)"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["li.ratio-bar__downloaded a:has( > i.fa-arrow-down)", "span:has( > i.fa-arrow-down)"],
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: [
          ...ratioTrans.map((x) => `td:contains('${x}') + td`),
          ...ratioTrans.map((x) => `dt:contains('${x}') + dd`),
          "li.ratio-bar__ratio a:has( > i.fa-sync-alt)",
          "span:has( > i.fa-sync-alt)",
        ],
        filters: [{ name: "parseNumber" }],
      },
      trueRatio: {
        selector: [
          ...trueRatioTrans.map((x) => `td:contains('${x}') + td`),
          ...trueRatioTrans.map((x) => `dt:contains('${x}') + dd`),
        ],
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: ["li.ratio-bar__points a:has( > i.fa-coins)", "span:has( > i.fa-coins)"],
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ["li.ratio-bar__seeding a:has( > i.fa-upload)", "span:has( > i.fa-upload)"],
        filters: [{ name: "parseNumber" }],
      },
      leeching: {
        selector: ["li.ratio-bar__leeching a:has( > i.fa-download)", "span:has( > i.fa-download)"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        // table.table-condensed:first
        selector: [
          ...seedingSizeTrans.map((x) => `td:contains('${x}') + td`),
          ...seedingSizeTrans.map((x) => `dt:contains('${x}') + dd`),
        ],
        filters: [{ name: "parseSize" }],
      },
      averageSeedingTime: {
        // table.table-condensed:first
        selector: [
          ...averageSeedingTimeTrans.map((x) => `td:contains('${x}') + td span.badge-user`),
          ...averageSeedingTimeTrans.map((x) => `dt:contains('${x}') + dd`),
        ],
        filters: [{ name: "parseTTL" }],
      },
      levelName: {
        selector: ["div.content span.badge-user", "a.user-tag__link[title]"],
        elementProcess: (el: HTMLInputElement) => {
          return el.getAttribute("title") || el.textContent;
        },
      },
      messageCount: {
        text: 0,
        selector: ['a[href*="/mail"] .point, a[href*="/notifications"] .point, ul.top-nav__icon-bar circle'],
        elementProcess: () => 11, // 并不能直接知道还有多少个消息未读，所以置为11，会直接出线红点而不是具体数字
      },
      uploads: {
        selector: [".badge-user .fa-upload + span", "li:has(i.fas.fa-upload) a[href*='/uploads']"],
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: ["time.profile__registration", ...joinTimeTrans.map((x) => `div.content h4:contains('${x}')`)],
        filters: [
          (query: string) => {
            query = query.replace(RegExp(joinTimeTrans.join("|")), "");
            query = query.replace(/^:+/g, "").trim();
            return parseValidTimeString(query, ["MMM dd yyyy, HH:mm:ss", "MMM dd yyyy", "yyyy-MM-dd"]);
          },
        ],
      },
      invites: {
        selector: [
          ...invitesTrans.map((x) => `td:contains('${x}'):last + td`),
          ...invitesTrans.map((x) => `dt:contains('${x}'):last + dd`),
        ],
        filters: [{ name: "parseNumber" }],
      },
      // '/users/$user.name$/earnings'
      bonusPerHour: {
        selector: [".panelV2 dl.key-value dd:nth(2)"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
};

export default class Unit3D extends PrivateSite {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    };

    if (!this.allowQueryUserInfo) {
      flushUserInfo.status = EResultParseStatus.passParse;
      return flushUserInfo;
    }

    // 对 Unit3D，如果定义了 process，则按照 AbstractPrivateSite 的方式处理
    if (Array.isArray(this.metadata.userInfo?.process)) {
      return await super.getUserInfoResult(lastUserInfo);
    }

    // 否则直接使用 Unit3D 的方式获取用户信息
    try {
      let userName: string;
      if (lastUserInfo !== null && lastUserInfo.name) {
        userName = lastUserInfo.name as string;
      } else {
        // 如果没有 id 信息，则访问一次 index.php
        userName = await this.getUserNameFromSite();
      }
      flushUserInfo.name = userName;

      // 导入基本 Details 页面获取到的用户信息
      flushUserInfo = toMerged(flushUserInfo, await this.getUserInfoFromDetailsPage(userName));

      // 如果前面没有获取到用户等级的id，则尝试通过定义的 levelRequirements 来获取
      if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
      }

      flushUserInfo.bonusPerHour = await this.getUserBonusPerHour(userName);

      flushUserInfo.status = EResultParseStatus.success;
    } catch (e) {
      flushUserInfo.status = EResultParseStatus.parseError;

      if (e instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }

  protected async getUserNameFromSite(): Promise<string> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: indexDocument } = await this.request<Document>(
      {
        url: "/",
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(
      indexDocument,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      this.metadata.userInfo?.selectors?.name!,
    );
  }

  protected async getUserInfoFromDetailsPage(userName: string): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userDetailDocument } = await this.request<Document>({
      url: urlJoin("/users", userName),
      responseType: "document",
    });

    return this.getFieldsData(
      userDetailDocument,
      this.metadata.userInfo?.selectors!,
      Object.keys(omit(this.metadata.userInfo?.selectors!, ["name"])),
    ) as Partial<IUserInfo>;
  }

  protected async getUserBonusPerHour(name: string): Promise<number> {
    const { data: document } = await this.request<Document>(
      {
        url: `/users/${name}/earnings`,
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(document, this.metadata.userInfo?.selectors?.bonusPerHour!);
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("/download/") && downloadLink.includes("/torrents/")) {
      const mockRequestConfig = torrent.url?.startsWith("http") ? { url: torrent.url } : { baseURL: this.url };
      return this.fixLink(`/torrents/download/${torrent.id}`, mockRequestConfig);
    }

    return downloadLink;
  }
}
