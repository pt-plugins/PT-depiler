import Sizzle from "sizzle";
import { toMerged } from "es-toolkit";

import PrivateSite from "./AbstractPrivateSite";
import { parseValidTimeString, parseSizeString } from "../utils";
import { ETorrentStatus, type ISiteMetadata, type ITorrent, type ISearchInput } from "../types";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  search: {
    keywordPath: "params.searchstr",
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: { searchsubmit: 1 },
    },
    selectors: {
      rows: { selector: "table.torrent_table:last tr:gt(0)" },
      id: {
        selector: "a[href*='torrents.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["torrentid", "id"] }],
      },
      title: { selector: "a[href*='torrents.php?id=']" },
      url: { selector: "a[href*='torrents.php?id=']", attr: "href" },
      link: {
        selector: "a[href*='torrents.php?action=download'][title='Download']:first",
        attr: "href",
      },
      // TODO category: {}
      time: {
        elementProcess: (element: HTMLElement) => {
          const AccurateTimeAnother = element.querySelector("span[title], time[title]");
          if (AccurateTimeAnother) {
            return AccurateTimeAnother.getAttribute("title")! + ":00";
          } else if (element.getAttribute("title")) {
            return element.getAttribute("title")! + ":00";
          } else {
            return element.innerText.trim() + ":00";
          }
        },
      },

      progress: { text: 0 },
      status: { text: ETorrentStatus.unknown },
    },
  },
  userInfo: {
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
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime", // Gazelle 基础项
          "seeding",
          "seedingSize",
        ],
      },
    ],
    selectors: {
      // "page": "/index.php",
      id: {
        selector: ["a.username[href*='user.php']:first"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: ["a.username[href*='user.php']:first"],
      },
      messageCount: {
        selector: ["div.alert-bar > a[href*='inbox.php']", "div.alertbar > a[href*='inbox.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },

      // "page": "/user.php?id=$user.id$",
      uploaded: {
        selector: "div:contains('Stats') + ul.stats > li:contains('Uploaded')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/Upload.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          },
        ],
      },
      downloaded: {
        selector: "div:contains('Stats') + ul.stats > li:contains('Downloaded')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/Download.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          },
        ],
      },
      ratio: {
        selector: "div:contains('Stats') + ul.stats > li:contains('Ratio:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/Ratio.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      levelName: {
        selector: "div:contains('Personal') + ul.stats > li:contains('Class:')",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/Class:.+?(.+)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
          },
        ],
      },
      bonus: {
        selector: [
          "div:contains('Stats') + ul.stats > li:contains('Bonus Points:')",
          "div:contains('Stats') + ul.stats > li:contains('SeedBonus:')",
        ],
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            const queryMatch = query.match(/Bonus Points.+?([\d.]+)/) || query.match(/SeedBonus.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      joinTime: {
        selector: ["div:contains('Stats') + ul.stats > li:contains('Joined:') > span"],
        elementProcess: (element: HTMLElement) => {
          const query = (element.getAttribute("title") || element.innerText).trim();
          return parseValidTimeString(query, ["yyyy-MM-dd HH:mm:ss"]);
        },
      },
    },
  },
};

export default class Gazelle extends PrivateSite {
  protected guessSearchFieldIndexConfig(): Record<string, string[]> {
    return {
      time: ["a[href*='order_by=time']"], // 发布时间
      size: ["a[href*='order_by=size']"], // 大小
      seeders: ["a[href*='order_by=seeders']"], // 种子数
      leechers: ["a[href*='order_by=leechers']"], // 下载数
      completed: ["a[href*='order_by=snatched']"], // 完成数
    } as Record<keyof ITorrent, string[]>;
  }

  public override async transformSearchPage(doc: Document | any, searchConfig: ISearchInput): Promise<ITorrent[]> {
    const { keywords, searchEntry, requestConfig } = searchConfig;
    // 如果配置文件没有传入 search 的选择器，则我们自己生成
    const legacyTableSelector = "table.torrent_table:last";

    // 生成 rows的
    if (!searchEntry!.selectors?.rows) {
      searchEntry!.selectors!.rows = {
        selector: `${legacyTableSelector} tr:gt(0)`,
      };
    }

    // 对于 Gazelle ，一般来说，表的第一行应该是标题行，即 ` > tr:nth-child(1)`
    const headSelector = `${legacyTableSelector} tr:first > td`;
    const headAnother = Sizzle(headSelector, doc) as HTMLElement[];
    headAnother.forEach((element, elementIndex) => {
      // 比较好处理的一些元素，都是可以直接获取的
      let updateSelectorField;
      for (const [dectField, dectSelector] of Object.entries(this.guessSearchFieldIndexConfig())) {
        for (const dectFieldElement of dectSelector) {
          if (Sizzle(dectFieldElement, element).length > 0) {
            updateSelectorField = dectField;
            break;
          }
        }
      }

      if (updateSelectorField) {
        // @ts-ignore
        searchEntry.selectors[updateSelectorField] = toMerged(
          {
            selector: [`> td:eq(${elementIndex})`],
          },
          // @ts-ignore
          searchEntry.selectors[updateSelectorField] || {},
        );
      }
    });

    // 遍历数据行
    const torrents: ITorrent[] = [];
    const trs = Sizzle(searchEntry!.selectors!.rows.selector as string, doc);

    for (const tr of trs) {
      // 对 url 和 link 结果做个检查，检查通过的再进入 parseRowToTorrent
      const url = this.getFieldData(tr, searchEntry!.selectors!.url!);
      const link = this.getFieldData(tr, searchEntry!.selectors!.link!);
      if (url && link) {
        try {
          const torrent = (await this.parseWholeTorrentFromRow({ url, link }, tr, {
            keywords,
            searchEntry,
            requestConfig,
          })) as ITorrent;
          torrents.push(torrent);
        } catch (e) {
          console.warn(`Failed to parse torrent from row:`, e, tr);
        }
      }
    }

    return torrents;
  }
}
