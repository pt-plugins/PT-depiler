import Sizzle from "sizzle";
import { toMerged } from "es-toolkit";

import PrivateSite from "./AbstractPrivateSite";
import { parseValidTimeString, parseSizeString, parseTimeToLiveToDate } from "../utils";
import { ETorrentStatus, type ISiteMetadata, type ITorrent, type ISearchInput, type IUserInfo } from "../types";

const commonTagKeywords = ["Freeleech", "Neutral", "Seeding", "Snatched", "Reported", "Trumpable"];

export function extractTags(tags: string, tagKeywords?: string[]): string {
  const tagParts = tags.split(" / ");
  if (tagParts.length < 1) return "";

  const filteredParts: string[] = [];
  // 只保留种子自身属性
  tagParts.forEach((tag) => {
    if (!(tagKeywords || commonTagKeywords).some((keyword) => tag.includes(keyword))) filteredParts.push(tag.trim());
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

export function genTitleElementProcess(tdSelector: string, extractTagsFunc: (tags: string) => string) {
  return (row: HTMLElement): string => {
    // 匹配信息格
    const cell = row.querySelector(tdSelector);
    const clone = cell!.cloneNode(true) as HTMLElement;

    // 对于 Gazelle，一般第一个种子页链接对应的 <a> 会包含标题
    const torrentLink = clone.querySelector("a[href*='torrents.php?id=']");
    if (!torrentLink) return "";
    const title = torrentLink.textContent;

    // 移除标题行及之前的元素，只保留后面的属性文本
    let node = torrentLink.previousSibling;
    while (node) {
      const prev = node.previousSibling;
      node.remove();
      node = prev;
    }
    torrentLink.remove();

    let prop = "";
    // [WEB] [2026] [2026.01.01] [WEB / FLAC / Freeleech!]
    const matches = [...clone.textContent.trim().matchAll(/\[([^\]]+)\]/g)];
    if (matches.length > 0) {
      prop = matches
        .map((m) => {
          const tags = extractTagsFunc(m[1]);
          return tags ? `[${tags}]` : "";
        })
        .filter(Boolean)
        .join(" ");
    }

    // 获取艺术家信息
    const artistEls = Sizzle("a[href*='artist.php']", row);
    const artists = artistEls
      .map((el) => el.textContent)
      .filter(Boolean)
      .join(" & ");

    return [artists && `${artists} -`, title, prop].filter(Boolean).join(" ");
  };
}

type boxName = "stats" | "community" | "personal";

const BoxName: Record<boxName, string[]> = {
  stats: ["Stats", "Statistics"],
  personal: ["Personal"],
  community: ["Community"],
} as const;

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
      // seeders, leechers 等信息由 transformSearchPage 根据搜索结果自动生成
      rows: { selector: "table.torrent_table:last tr:gt(0)" },
      id: {
        selector: "a[href*='torrents.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["torrentid", "id"] }],
      },
      title: {
        selector: ":self",
        elementProcess: genTitleElementProcess("td:has(a[href*='torrents.php?id=']):has(.tags)", extractTags),
      },
      subTitle: {
        selector: [".tags", "> td:has(a[href*='torrents.php']) a[href]:not(span a):last"],
        switchFilters: {
          // 对应单种行，直接返回 tags
          ".tags": [],
          // 对应组内种子，提取并返回种子属性
          "> td:has(a[href*='torrents.php']) a[href]:not(span a):last": [extractTags],
        },
      },
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
              time = parseValidTimeString(AccurateTimeAnother.getAttribute("title")!);
            } else if (element.getAttribute("title")) {
              time = parseValidTimeString(element.getAttribute("title")!);
            } else {
              // 2 mins ago or Just now
              time = element.innerText.trim();
              if (time.toLowerCase().includes("just now")) {
                time = "0 seconds";
              }
              time = parseTimeToLiveToDate(time);
            }
          } catch (e) {}
          return time;
        },
      },
      progress: { text: 0 },
      status: { text: ETorrentStatus.unknown },
      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free", color: "blue" }],
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
      excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid)=\d+/],
    },
    // TODO /torrents.php?id=
  ],

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
          "lastAccessAt",
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
        selector: genStatBoxSelector(BoxName.stats, "Uploaded"),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: genStatBoxSelector(BoxName.stats, "Downloaded"),
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: genStatBoxSelector(BoxName.stats, "Ratio:"),
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: genStatBoxSelector(BoxName.personal, "Class:"),
        filters: [{ name: "split", args: [":", 1] }],
      },
      bonus: {
        selector: genStatBoxSelector(BoxName.stats, "Bonus Points:"),
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: genStatBoxSelector(BoxName.stats, "Joined:", "> span"),
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      lastAccessAt: {
        selector: genStatBoxSelector(BoxName.stats, ["Last seen", "Last Seen"], "> span"),
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploads: {
        selector: genStatBoxSelector(BoxName.community, "Uploaded"),
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
  protected get torrentClasses() {
    return {
      group: ["group", "group_redline"], // 种子组行
      unGroupTorrent: ["torrent", "torrent_redline"], // 单种行
      groupTorrent: ["groupid_"], // 组内种子行（使用种子组 ID 选择）
    };
  }

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
          searchEntry.selectors[updateSelectorField] ?? {},
        );
      }
    });

    // 遍历数据行
    const torrents: ITorrent[] = [];

    const rowsSelector = searchEntry!.selectors!.rows;
    const trs = this.findElementsBySelectors(rowsSelector.selector, doc) as HTMLTableRowElement[];

    const trSeq = trs.values();
    for (const tr of trSeq) {
      /**
       * 种子组信息行 + 组内种子行，顺序排列
       * <tr class="group">...</tr>
       * <tr class="group_torrent groupid_${id}">...</tr>
       */
      if (this.torrentClasses.group.some((className) => tr.classList.contains(className))) {
        // 先尝试获取种子组 ID
        const id = this.getFieldData(tr, {
          selector: "a[href*='torrents.php?id=']",
          attr: "href",
          filters: [{ name: "querystring", args: ["id"] }],
        });
        if (!id) continue;

        const groupRows = this.findElementsBySelectors(
          this.torrentClasses.groupTorrent.map((className) => `tr.${className}${id}`),
          doc,
        );

        // 取出此组内的所有种子
        const groupTorrents = await this.transformGroupTorrents(tr, take(trSeq, groupRows.length), {
          keywords,
          searchEntry,
          requestConfig,
        });
        torrents.push(...groupTorrents);
        continue;
      }

      /**
       * 单种行
       * <tr class="torrent">...</tr>
       */
      if (this.torrentClasses.unGroupTorrent.some((className) => tr.classList.contains(className))) {
        // 对 link 结果做个检查，检查通过的再进入 parseRowToTorrent
        const link = this.getFieldData(tr, searchEntry!.selectors!.link!);
        if (!link) continue;

        const torrent = await this.transformUnGroupTorrent(tr, { keywords, searchEntry, requestConfig });
        if (torrent) torrents.push(torrent);
      }

      // 其它没匹配到的 tr 可能包括站点自定义的非种子行，或者使用了别的自定义 class
      // 对于第二种情况，需要将对应 class 添加到 torrentClasses 中，或者在站点定义中覆盖相关方法
    }

    return torrents;
  }

  /**
   * 从种子组行获取种子组信息（标题等）
   * @param group
   * @param searchConfig
   * @returns 获取到的种子组信息
   */
  protected getTorrentGroupInfo(group: HTMLTableRowElement, searchConfig: ISearchInput): Partial<ITorrent> {
    // WhatCD/Gazelle 中可以从种子组行中获取到 title 和 category 信息 (.cats_col > .cats_music)
    // 对于 Gazelle-fork，如有其它信息需要获取可以自行覆盖方法
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "category"]);
  }

  protected async transformGroupTorrents(
    group: HTMLTableRowElement,
    torrentEls: HTMLTableRowElement[],
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    // 获取组信息
    const partTorrent = this.getTorrentGroupInfo(group, searchConfig);

    // 种子组的种子只保证与组信息列对齐，而有些 Gazelle 会在组内添加 td[rowspan] 影响对齐行为，因此需要考虑有 rowspan 的情况
    const rowSpan = Array.from(group.querySelectorAll("td[rowspan]")).reduce((acc, td) => {
      const span = parseInt(td.getAttribute("rowspan") || "1", 10);
      return acc + (span > 1 ? 1 : 0);
    }, 0);

    const torrents: ITorrent[] = [];
    for (const groupTorrentEl of torrentEls) {
      // 对 link 结果做个检查，检查通过的再进入 parseRowToTorrent
      const link = this.getFieldData(groupTorrentEl, searchConfig.searchEntry!.selectors!.link!);
      if (!link) continue;

      // 处理 colspan 的情况
      let padding = rowSpan;
      const colSpanTd = groupTorrentEl.querySelector("td[colspan]");
      if (colSpanTd) {
        const colSpan = colSpanTd.getAttribute("colspan");
        padding += colSpan ? Math.max(0, parseInt(colSpan, 10) - 1) : 0;
      }

      for (let i = 0; i < padding; i++) {
        // 补全前面的单元格，使后续的 selector 能正常生效
        groupTorrentEl.insertCell(0);
      }

      try {
        const torrent = (await this.parseWholeTorrentFromRow(
          { ...partTorrent, link },
          groupTorrentEl,
          searchConfig,
        )) as ITorrent;
        torrents.push(torrent);
      } catch (e) {
        console.warn(`Failed to parse torrent from row:`, e, groupTorrentEl);
      }
    }

    return torrents;
  }

  protected async transformUnGroupTorrent(
    torrentEl: HTMLTableRowElement,
    searchConfig: ISearchInput,
  ): Promise<ITorrent | null> {
    // 获取组信息
    const partTorrent = this.getTorrentGroupInfo(torrentEl, searchConfig);

    // 处理 colspan 的情况
    const tdColSpan = parseInt(
      this.getFieldData(torrentEl, {
        selector: "td[colspan]:first",
        attr: "colspan",
      }),
      10,
    );
    if (tdColSpan) {
      for (let i = 1; i < tdColSpan; i++) {
        // 补全前面的单元格，使后续的 selector 能正常生效
        torrentEl.insertCell(0);
      }
    }

    try {
      const torrent = (await this.parseWholeTorrentFromRow({ ...partTorrent }, torrentEl, searchConfig)) as ITorrent;
      return torrent;
    } catch (e) {
      console.warn(`Failed to parse torrent from row:`, e, torrentEl);
    }
    return null;
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);
    if (flushUserInfo.id && !flushUserInfo.seedingSize) {
      flushUserInfo = toMerged(flushUserInfo, await this.getSeedingSize(flushUserInfo.id as number));
    }
    return flushUserInfo;
  }
}

// Iterator.prototype.take() 的兼容方法
function take<T>(it: IteratorObject<T>, n: number): T[] {
  const result = [];
  while (n-- > 0) {
    const { value, done } = it.next();
    if (done) break;
    result.push(value);
  }
  return result;
}
