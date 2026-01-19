import Sizzle from "sizzle";
import { toMerged } from "es-toolkit";

import PrivateSite from "./AbstractPrivateSite";
import { parseValidTimeString, parseSizeString } from "../utils";
import { ETorrentStatus, type ISiteMetadata, type ITorrent, type ISearchInput, type IUserInfo } from "../types";

const commonTagKeywords = ["Freeleech", "Neutral", "Seeding", "Snatched", "Reported"];

export function extractSubTitle(tags: string, tagKeywords?: string[]): string {
  const tagParts = tags.split(" / ");
  if (tagParts.length < 1) return "";

  const filteredParts: string[] = [];
  // 只保留种子自身属性
  tagParts.forEach((tag) => {
    if (!(tagKeywords || commonTagKeywords).some((keyword) => tag.includes(keyword))) filteredParts.push(tag);
  });
  return filteredParts.join(" / ");
}

function genStatBoxSelector(section: string | string[], itemSel: string | string[], suffixSel?: string): string[] {
  const sections = Array.isArray(section) ? section : [section];
  const itemSels = Array.isArray(itemSel) ? itemSel : [itemSel];
  return sections.flatMap((s) =>
    itemSels.map(
      (iSel) => `div:contains('${s}') + ul.stats > li:contains('${iSel}')${suffixSel ? ` ${suffixSel}` : ""}`,
    ),
  );
}

const statsBoxName = ["Stats", "Statistics"];
const personalBoxName = ["Personal"];
const communityBoxName = ["Community"];

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
      link: { selector: "a[href*='torrents.php?action=download']:first", attr: "href" },
      // TODO category: {}
      time: {
        text: 0,
        elementProcess: (element: HTMLElement) => {
          let time: number | string = 0;
          try {
            const AccurateTimeAnother = element.querySelector("span[title], time[title]");
            if (AccurateTimeAnother) {
              time = AccurateTimeAnother.getAttribute("title")!;
            } else if (element.getAttribute("title")) {
              time = element.getAttribute("title")!;
            } else {
              time = element.innerText.trim();
            }
            time = parseValidTimeString(time);
          } catch (e) {}
          return time;
        },
      },
      progress: { text: 0 },
      status: { text: ETorrentStatus.unknown },
    },
  },
  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id"],
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
          "name",
          "messageCount",
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime", // Gazelle 基础项
          "seeding",
          "seedingSize",
          "uploads",
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
        selector: ":self",
        elementProcess: (doc: Document) => {
          const notifRegex = /have (\d+|a) new/;
          let messages = 0;

          const pargeMessage = (el: Element) => {
            const match = el.textContent.match(notifRegex);
            messages += match ? (match[1] === "a" ? 1 : parseInt(match[1])) : 0;
          };

          // 1. Traditional
          const alert = doc.querySelector("div#alert");
          if (alert) {
            const alerts = alert.querySelectorAll("a[href*='inbox.php'], a[href*='staffpm.php']");
            alerts.forEach(pargeMessage);
          }

          // 2. Pop-Up
          if (!alert || !messages) {
            const notifSpans = doc.querySelectorAll(
              ".noty-notification[data-noty-url*='inbox.php'], .noty-notification[data-noty-url*='staffpm.php']",
            );
            notifSpans.forEach(pargeMessage);
          }

          return messages;
        },
      },
      // "page": "/user.php?id=$user.id$",
      uploaded: {
        selector: genStatBoxSelector(statsBoxName, "Uploaded"),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: genStatBoxSelector(statsBoxName, "Downloaded"),
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: genStatBoxSelector(statsBoxName, "Ratio:"),
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: genStatBoxSelector(personalBoxName, "Class:"),
        filters: [{ name: "split", args: [":", 1] }],
      },
      bonus: {
        selector: genStatBoxSelector(statsBoxName, "Bonus Points:"),
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: genStatBoxSelector(statsBoxName, "Joined:", "> span"),
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      lastAccessAt: {
        selector: genStatBoxSelector(statsBoxName, ["Last seen", "Last Seen"], "> span"),
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploads: {
        selector: genStatBoxSelector(communityBoxName, "Uploaded"),
        filters: [{ name: "parseNumber" }],
      },
    },
  },
};

export class GazelleBase extends PrivateSite {
  // Gazelle 通用做种量获取方法，用于先前方法没获取到 seedingSize 的情况
  protected async getSeedingSize(userId: number, sizeIndex: number = 0): Promise<Partial<IUserInfo>> {
    const userSeedingTorrent: Partial<IUserInfo> = { seedingSize: 0 };
    const pageInfo = { count: 1, current: 1 }; // 生成页面信息
    for (; pageInfo.current <= pageInfo.count; pageInfo.current++) {
      await this.sleepAction(this.metadata.userInfo?.requestDelay);
      const TListDocument = await this.getUserTorrentList(userId, pageInfo.current);
      // 更新最大页数
      if (pageInfo.current === 1) {
        pageInfo.count = this.getFieldData(TListDocument, {
          // https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/classes/format.class.php#L296
          selector: ["a[href*='torrents.php?page=']:contains('Last'):first"],
          attr: "href",
          filters: [{ name: "querystring", args: ["page"] }, (query: string) => (query ? parseInt(query) : -1)],
        });
      }

      if (sizeIndex === 0) {
        const targetTd: Element = this.getFieldData(TListDocument, {
          selector: [
            "tr.colhead > td > a:contains('Size')",
            "tr.colhead > td > a[href*='Size']",
            "tr.colhead > td > a[href*='size']", // OPS
            "tr.colhead > td > a[href*='s4']", // JPS
          ],
          elementProcess: (el: Element) => el.parentNode,
        });
        if (targetTd && targetTd.parentNode) {
          const allTds = Array.from(targetTd.parentNode.children);
          sizeIndex = allTds.indexOf(targetTd as Element);
        } else {
          return userSeedingTorrent;
        }
      }

      const torrentAnothers = Sizzle("tr.torrent", TListDocument);
      torrentAnothers.forEach((element) => {
        const sizeAnother = Sizzle(`td:nth-child(${sizeIndex + 1})`, element);
        if (sizeAnother && sizeAnother.length >= 0) {
          userSeedingTorrent.seedingSize! += parseSizeString(
            (sizeAnother[0] as HTMLElement).innerText.trim().replace(/,/g, ""),
          );
        }
      });
    }

    return userSeedingTorrent;
  }

  // 起始页面为 1
  // https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/torrents/user.php#L29-L35
  protected async getUserTorrentList(userId: number, page: number = 1, type: string = "seeding"): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: "/torrents.php",
      params: { userid: userId, page, type },
      responseType: "document",
    });
    return TListDocument;
  }
}

export default class Gazelle extends GazelleBase {
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

    const rowsSelector = searchEntry!.selectors!.rows;
    const trs = this.findElementsBySelectors(rowsSelector.selector, doc);

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

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);
    if (flushUserInfo.id && !flushUserInfo.seedingSize) {
      flushUserInfo = toMerged(flushUserInfo, await this.getSeedingSize(flushUserInfo.id as number));
    }
    return flushUserInfo;
  }
}
