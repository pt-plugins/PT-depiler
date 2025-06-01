import urlJoin from "url-join";
import { toMerged } from "es-toolkit";
import { set } from "es-toolkit/compat";

import PrivateSite from "./AbstractPrivateSite";
import { ETorrentStatus, EResultParseStatus, type ISiteMetadata, type IUserInfo } from "../types";
import { parseSizeString, parseValidTimeString } from "../utils";

/**
 * Trans Array
 * Source: https://github.com/HDInnovations/UNIT3D-Community-Edition/commit/cb1efe0868caf771b9917c090a79b28b4e183b74
 */
const idTrans: string[] = ["User ID", "用户ID", "用ID"];
const seedingSizeTrans: string[] = ["Seeding Size", "做种体积", "做種體積"];
const joinTimeTrans: string[] = ["Registration date", "注册日期", "註冊日期"];

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  timezoneOffset: "+0000",
  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/torrents/filter",
      responseType: "document",
      params: {
        view: "list", // 强制使用 种子列表 的形式返回
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.imdb", config!.params.search.replace("tt", ""));
          delete config!.params.search;
          return config!;
        },
      },
    },
    selectors: {
      rows: { selector: "div.table-responsive > table:first > tbody > tr" },

      /**
       * 未发现 Unit3D 站点对于种子列表有太大改动，所以直接硬写选择器而不是和 NPHP 一样自动生成
       * based on: https://github.com/HDInnovations/UNIT3D-Community-Edition/blob/cb1efe0868caf771b9917c090a79b28b4e183b74
       */
      id: {
        selector: ["a.view-torrent"],
        attr: "href",
        filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
      },
      title: {
        selector: ["a.view-torrent"],
      },
      subTitle: {
        text: "", // Unit3D 并不在种子列表页显示副标题，或者说他们就没有副标题的设计
      },
      url: {
        selector: ["a.view-torrent"],
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
        selector: ['td:eq(7):contains("B")'],
      },
      // /resources/views/torrent/results.blade.php#L166-L184
      author: {
        selector: ["span:has( > i.fa-upload)"],
        filters: [
          (query: string) => query.replace(/ +\(/, " ("), // 防止可以看见匿名等级的用户中间有一堆空格。。。
        ],
      },
      // /resources/views/torrent/results.blade.php#L95-L113
      category: {
        selector: [
          'a[href*="/categories/"] > div > img[data-original-title]',
          'a[href*="/categories/"] > div > i[data-original-title]',
        ],
        data: "originalTitle", // {{ $torrent->category->name }} {{ strtolower(trans('torrent.torrent')) }}
        filters: [(query: string) => query.split(" ").slice(0, -1).join(" ")],
      },

      // /resources/views/torrent/results.blade.php#L405-L426
      seeders: {
        selector: ['a[href*="/peers"] > span.text-green'],
      },
      leechers: {
        selector: ['a[href*="/peers"] > span.text-red'],
      },
      completed: {
        selector: ['a[href*="/history"] > span.text-orange'],
        filters: [(query: string) => query.split(" ").slice(0, -1).join("")],
      },

      // /resources/views/torrent/results.blade.php#L213-L219
      comments: {
        selector: ['a[href*="#comments"]'],
      },

      status: {
        text: ETorrentStatus.unknown,
        case: {
          "button.btn.btn-success.btn-circle": ETorrentStatus.seeding, // 做种!
          "button.btn.btn-warning.btn-circle": ETorrentStatus.downloading, // 吸血!
          "button.btn.btn-info.btn-circle": ETorrentStatus.inactive, // 未完成!
          "button.btn.btn-danger.btn-circle": ETorrentStatus.completed, // 撤种!
        },
      },
      progress: {
        text: 0,
        case: {
          "button.btn.btn-success.btn-circle": 100,
          // 不清楚非做种情况下的进度信息，统一置为0
          "button.btn.btn-warning.btn-circle, button.btn.btn-info.btn-circle, button.btn.btn-danger.btn-circle": 0,
        },
      },
      tags: [
        { name: "Free", selector: "i.fa-star.text-gold, i.fa-globe.text-blue", color: "blue" },
        { name: "2xUp", selector: "i.fa-gem.text-green", color: "lime" },
      ],
    },
  },
  userInfo: {
    selectors: {
      // '/'
      name: {
        selector: ["a[href*='settings']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/users\/(.+)\/settings/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
          },
        ],
      },
      uploaded: {
        selector: ["div.ratio-bar span:has( > i.fa-arrow-up)"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["div.ratio-bar span:has( > i.fa-arrow-down)"],
        filters: [{ name: "parseSize" }],
      },
      bonus: {
        selector: ["div.ratio-bar span:has( > i.fa-coins)"],
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ["div.ratio-bar span:has( > i.fa-upload)"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/[,\n]/g, "").match(/:.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },
      leeching: {
        selector: ["div.ratio-bar span:has( > i.fa-download)"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/[,\n]/g, "").match(/:.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },

      // "/users/$user.name$"
      id: {
        selector: idTrans.map((x) => `td:contains('${x}') + td`),
        filters: [(query: string) => parseInt(query || "0")],
      },
      seedingSize: {
        // table.table-condensed:first
        selector: seedingSizeTrans.map((x) => `td:contains('${x}') + td`),
        filters: [(query: string) => parseSizeString(query.replace(/,/g, ""))],
      },
      levelName: {
        selector: "div.content span.badge-user",
      },
      messageCount: {
        text: 0,
        selector: ['a[href*="/mail/inbox"] .point'],
        elementProcess: () => 11, // 并不能直接知道还有多少个消息未读，所以置为11，会直接出线红点而不是具体数字
      },
      joinTime: {
        selector: joinTimeTrans.map((x) => `div.content h4:contains('${x}')`),
        filters: [
          (query: string) => {
            query = query.replace(RegExp(joinTimeTrans.join("|")), "").trim();
            return parseValidTimeString(query);
          },
        ],
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

    if (!this.allowQueryUserInfo || !this.metadata.userInfo?.process) {
      flushUserInfo.status = EResultParseStatus.passParse;
      return flushUserInfo;
    }

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
      flushUserInfo.status = EResultParseStatus.success;
    } catch (e) {
      flushUserInfo.status = EResultParseStatus.parseError;
    }

    return flushUserInfo;
  }

  protected async getUserNameFromSite(): Promise<string> {
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
    const { data: userDetailDocument } = await this.request<Document>({
      url: urlJoin("/users", userName),
      responseType: "document",
    });

    return this.getFieldsData(
      userDetailDocument,
      [
        "id",
        "messageCount",
        "uploaded",
        "downloaded",
        "levelName",
        "bonus",
        "joinTime",
        "seeding",
        "seedingSize",
        "leeching",
      ] as (keyof IUserInfo)[],
      this.metadata.userInfo?.selectors!,
    ) as Partial<IUserInfo>;
  }
}
