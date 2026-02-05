import Sizzle from "sizzle";
import { toMerged } from "es-toolkit";

import PrivateSite from "./AbstractPrivateSite";
import { parseValidTimeString, parseSizeString, parseTimeToLiveToDate } from "../utils";
import {
  ETorrentStatus,
  NoTorrentsError,
  type ISiteMetadata,
  type ITorrent,
  type ISearchInput,
  type IUserInfo,
} from "../types";

/**
 * Gazelle 常用工具函数
 */
export const GazelleUtils = {
  /**
   * 提取种子属性并过滤
   * @param tags
   * @param tagKeywords
   * @returns filtered tags
   */
  extractTags(tags: string, tagKeywords: string[] = []): string {
    const commonTagKeywords = ["Freeleech", "Neutral", "Seeding", "Snatched", "Reported", "Trumpable"];
    const tagParts = tags.split(" / ");
    if (tagParts.length < 1) return "";

    const filteredParts: string[] = [];
    // 只保留种子自身属性
    tagParts.forEach((tag) => {
      if (![...tagKeywords, ...commonTagKeywords].some((keyword) => tag.toLowerCase().includes(keyword.toLowerCase())))
        filteredParts.push(tag.trim());
    });
    return filteredParts.join(" / ");
  },

  /**
   * 生成 title 的 elementProcess
   * @param tdSelector
   * @param extractTagsFunc
   * @returns elementProcess
   */
  genTitleElementProcess({
    tdSelector = "td:has(a[href*='torrents.php?id=']):has(.tags)",
    extractTagsFunc,
  }: {
    tdSelector?: string;
    extractTagsFunc?: (tags: string) => string;
  } = {}) {
    const extractTags = extractTagsFunc ?? this.extractTags;
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
      clone.querySelectorAll("span").forEach((e) => e.remove());

      let prop = "";
      // [WEB] [2026] [2026.01.01] [WEB / FLAC / Freeleech!]
      const matches = Array.from(clone.textContent.trim().matchAll(/\[([^\]]+)\]/g));
      if (matches.length > 0) {
        prop = matches
          .map((m) => {
            const tags = extractTags(m[1]);
            return tags ? `[${tags}]` : "";
          })
          .filter(Boolean)
          .join(" ");
      }

      // 获取艺术家信息
      const artistEls = Array.from(row.querySelectorAll("a[href*='artist.php']"));
      const artists = artistEls
        .map((el) => el.textContent.trim())
        .filter(Boolean)
        .join(" & ");

      return [artists && `${artists} -`, title, prop].filter(Boolean).join(" ");
    };
  },
};

const baseRowSelector = { selector: "table.torrent_table tr:gt(0)" };
const baseTimeSelector = {
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
};

const detailAttr = "isDetailPage";

type TList = Required<ISiteMetadata>["list"][number];

export const commonPagesList: TList = {
  urlPattern: [/\/torrents\.php(?!.*(?:\bid=|torrentid=))/, "/collages\\.php\\?id=\\d+", "/artist\\.php\\?id=\\d+"],
};

export const detailPageList: TList = {
  urlPattern: [/\/torrents\.php\?(?:.*&)?(\bid|torrentid)=\d+/],
  selectors: {
    // 从整个页面获取种子组信息
    keywords: { selector: ["span[dir='ltr']"] },
    title: { selector: ["div > h2"] },

    rows: {
      ...baseRowSelector,
      // 向第一个 row 添加属性，用于表示匹配到了详情页
      filter: (rows: HTMLElement[] | null): HTMLElement[] | null => {
        if (Array.isArray(rows) && rows.length > 0) {
          rows[0].dataset[detailAttr] = "1";
        }
        return rows;
      },
    },
    time: {
      ...baseTimeSelector,
      selector: "+tr span.time", // 在下一个 tr 里（tr.torrentdetails)
    },
  },
};

export const top10PageList: TList = {
  urlPattern: ["/top10\\.php"],
  excludeUrlPattern: [/\/top10\.php\?type=(?!torrents\b).*/], // 只解析种子 Top 10
  selectors: {
    rows: {
      ...baseRowSelector,
      /**
       * 不同站点的 Top 10 种子行可能使用不同的 class，但基本上都是单种行样式
       * 为了保证这些行都能被搜索方法解析，统一替换为单种行的 class
       */
      filter: (rows: HTMLElement[] | null): HTMLElement[] | null => {
        if (Array.isArray(rows)) {
          rows.forEach((row) => {
            row.className = "torrent";
          });
        }
        return rows;
      },
    },
  },
};

type boxName = "stats" | "community" | "personal";

const BoxName: Record<boxName, string[]> = {
  stats: ["Stats", "Statistics"],
  personal: ["Personal"],
  community: ["Community"],
} as const;

function genStatBoxSelector(section: string | string[], itemSel: string | string[], suffixSel?: string): string[] {
  const sections = ([] as string[]).concat(section);
  const itemSels = ([] as string[]).concat(itemSel);
  return sections.flatMap((s) =>
    itemSels.map(
      (iSel) => `div:contains('${s}') + ul.stats > li:contains('${iSel}')${suffixSel ? ` ${suffixSel}` : ""}`,
    ),
  );
}

/**
 * Gazelle 模板默认配置，对于大多数GZ站点都通用
 * 如果站点支持 JSON API 且数据完整，则应该使用 GazelleJSONAPI
 */
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
      rows: baseRowSelector,
      id: {
        // 优先从下载链接获取 id，可以确保获取到的是种子 id 而不是种子组 id
        selector: ["a[href*='torrents.php?action=download']:first", "a[href*='torrents.php?id=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["torrentid", "id"] }],
      },
      title: {
        selector: ":self",
        elementProcess: GazelleUtils.genTitleElementProcess(),
      },
      subTitle: {
        selector: [".tags", "> td:has(a[href*='torrents.php']) a:not(span a):last"],
        switchFilters: {
          // 对应单种行，直接返回 tags
          ".tags": [],
          // 对应组内种子，提取并返回种子属性
          "> td:has(a[href*='torrents.php']) a:not(span a):last": [GazelleUtils.extractTags],
        },
      },
      url: {
        selector: ["a[href*='torrents.php?id=']", "a[href*='torrents.php?torrentid=']"],
        attr: "href",
      },
      link: { selector: "a[href*='torrents.php?action=download']:first", attr: "href" },
      // TODO category: {}
      time: baseTimeSelector,
      progress: { text: 0 },
      status: { text: ETorrentStatus.unknown },
      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free", color: "blue" }],
    },
  },

  list: [
    {
      ...commonPagesList,
    },
    {
      ...detailPageList,
    },
    {
      ...top10PageList,
    },
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

          const parseMessage = (el: Element) => {
            const match = el.textContent.match(notifRegex);
            messages += match ? (match[1] === "a" ? 1 : parseInt(match[1])) : 0;
          };

          // 1. Traditional
          const alert = doc.querySelector("#alerts");
          if (alert) {
            const alerts = alert.querySelectorAll("a[href*='inbox.php'], a[href*='staffpm.php']");
            alerts.forEach(parseMessage);
          }

          // 2. Pop-Up
          if (!alert || !messages) {
            const notifSpans = doc.querySelectorAll(
              ".noty-notification[data-noty-url*='inbox.php'], .noty-notification[data-noty-url*='staffpm.php']",
            );
            notifSpans.forEach(parseMessage);
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

  protected getTorrentDownloadLinkFactory(torrentIdParam: string): (torrent: ITorrent) => Promise<string> {
    return async (torrent: ITorrent): Promise<string> => {
      const raw = await super.getTorrentDownloadLink(torrent);
      const url = URL.parse(raw);
      if (!url) return raw;

      const params = url.searchParams;
      if (params.get("action") === "download") return raw; // 已经是下载链接

      // 对 Gazelle 站点，如果前端拖拽功能发来的种子链接是 torrent.php?${torrentIdParam}=123 的形式，
      const torrentId = params.get(torrentIdParam);
      if (!torrentId) return raw;

      const downloadURL = new URL(url.pathname, this.url);
      downloadURL.searchParams.set("action", "download");
      downloadURL.searchParams.set("id", torrentId);

      return downloadURL.toString();
    };
  }
}

export default class Gazelle extends GazelleBase {
  protected get torrentClasses(): Record<"group" | "unGroupTorrent", string[]> {
    return {
      group: ["group", "group_redline"], // 种子组行
      unGroupTorrent: ["torrent", "torrent_redline"], // 单种行
    };
  }

  protected guessSearchFieldIndexConfig(): Record<string, string[]> {
    return {
      time: ["a[href*='order_by=time']"], // 发布时间
      size: ["a[href*='order_by=size']", "td:contains('Size')"], // 大小
      seeders: ["a[href*='order_by=seeders']", "[alt='Seeders']", "img[src*='seeders']"], // 做种数
      leechers: ["a[href*='order_by=leechers']", "[alt='Leechers']", "img[src*='leechers']"], // 下载数
      completed: ["a[href*='order_by=snatched']", "[alt='Snatches']", "img[src*='snatched']"], // 完成数
    } as Record<keyof ITorrent, string[]>;
  }

  public override async transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
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
    const headAnother = Sizzle(headSelector, doc) as HTMLTableCellElement[];
    let colSpan = 0;
    headAnother.forEach((element, elementIndex) => {
      // 比较好处理的一些元素，都是可以直接获取的
      let updateSelectorField: string | undefined;
      colSpan += Math.max(0, element.colSpan - 1); // 处理 colspan 的情况 (Gazelle-fork)
      for (const [dectField, dectSelector] of Object.entries(this.guessSearchFieldIndexConfig())) {
        for (const dectFieldElement of dectSelector) {
          if (Sizzle(dectFieldElement, element).length > 0 || Sizzle.matchesSelector(element, dectFieldElement)) {
            updateSelectorField = dectField;
            break;
          }
        }
      }

      if (updateSelectorField) {
        // @ts-ignore
        searchEntry.selectors[updateSelectorField] = toMerged(
          {
            selector: [`> td:eq(${elementIndex + colSpan})`],
          },
          // @ts-ignore
          searchEntry.selectors[updateSelectorField] ?? {},
        );
      }
    });

    const rowsSelector = searchEntry!.selectors!.rows;
    let trs = this.findElementsBySelectors(rowsSelector.selector, doc) as HTMLTableRowElement[];
    if (rowsSelector.filter) {
      trs = rowsSelector.filter(trs);
    }

    // 如果没有搜索到种子，则抛出 NoTorrentsError
    if (trs.length === 0) {
      throw new NoTorrentsError();
    }

    // 如果是详情页，直接返回当前种子组的种子
    // 这个属性由 detailPageList.rows.filter 负责添加
    if (trs[0].dataset[detailAttr] === "1") {
      return this.transformGroupTorrents(doc.documentElement, trs, {
        keywords,
        searchEntry,
        requestConfig,
      });
    }

    // 遍历数据行
    const torrents: ITorrent[] = [];

    const trSeq = trs.values();
    const groupClasses = [...this.torrentClasses.group, ...this.torrentClasses.unGroupTorrent];
    for (const tr of trSeq) {
      /**
       * 种子组信息行 + 组内种子行，顺序排列
       * <tr class="group">...</tr>
       * <tr class="group_torrent groupid_${id}">...</tr>
       */
      if (
        this.torrentClasses.group.some((className) => tr.classList.contains(className)) &&
        !groupClasses.some((className) => tr.nextElementSibling?.classList.contains(className)) // 空组
      ) {
        // 取出此组内的所有种子
        const groupTorrentEls = takeElUntilClass(trSeq, groupClasses);

        const groupTorrents = await this.transformGroupTorrents(tr, groupTorrentEls, {
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
  protected getTorrentGroupInfo(group: HTMLElement, searchConfig: ISearchInput): Partial<ITorrent> {
    /**
     * WhatCD/Gazelle 中可以从种子组行中获取到 title 和 category 信息 (.cats_col > .cats_music)
     * https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/torrents/browse.php#L565
     * 对于 Gazelle-fork，如有其它信息需要获取可以自行覆盖方法
     */
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "category"]);
  }

  protected async transformGroupTorrents(
    group: HTMLElement,
    torrentEls: HTMLTableRowElement[],
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    // 获取组信息
    const partTorrent = this.getTorrentGroupInfo(group, searchConfig);

    /**
     * 适配添加了 rowspan 的情况 (Gazelle-fork)
     * <tr class="group">
     *   <td class="poster_wraper" rowspan="2">
     *   ...
     * </tr>
     * <tr class="group_torrent groupid_${id}">...</tr>
     */
    let rowSpan = 0;
    if (group instanceof HTMLTableRowElement) {
      rowSpan = Array.from(group.querySelectorAll<HTMLTableCellElement>("td[rowspan]")).reduce(
        (acc, td) => acc + (td.rowSpan > 1 ? 1 : 0),
        0,
      );
    }

    const torrents: ITorrent[] = [];
    for (const groupTorrentEl of torrentEls) {
      // 对 link 结果做个检查，检查通过的再进入 parseRowToTorrent
      const link = this.getFieldData(groupTorrentEl, searchConfig.searchEntry!.selectors!.link!);
      if (!link) continue;

      // 处理 colspan 的情况
      // https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/torrents/browse.php#L644
      let padding = rowSpan;
      const colSpanTd = groupTorrentEl.querySelector<HTMLTableCellElement>("td[colspan]");
      if (colSpanTd) {
        padding += Math.max(0, colSpanTd.colSpan - 1);
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
        console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, groupTorrentEl);
      }
    }

    return torrents;
  }

  protected async transformUnGroupTorrent(
    torrentEl: HTMLTableRowElement,
    searchConfig: ISearchInput,
  ): Promise<ITorrent | null> {
    // 对 link 结果做个检查，检查通过的再进入 parseRowToTorrent
    const link = this.getFieldData(torrentEl, searchConfig!.searchEntry!.selectors!.link!);
    if (!link) return null;

    // 处理 colspan 的情况 (Gazelle-fork)
    const colSpanTd = torrentEl.querySelector<HTMLTableCellElement>("td[colspan]");
    if (colSpanTd) {
      for (let i = 0; i < colSpanTd.colSpan - 1; i++) {
        // 补全前面的单元格，使后续的 selector 能正常生效
        torrentEl.insertCell(0);
      }
    }

    try {
      const torrent = (await this.parseWholeTorrentFromRow({ link }, torrentEl, searchConfig)) as ITorrent;
      return torrent;
    } catch (e) {
      console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, torrentEl);
    }
    return null;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 种子链接格式是 torrent.php?torrentid=123
    return this.getTorrentDownloadLinkFactory("torrentid")(torrent);
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);
    if (flushUserInfo.id && !flushUserInfo.seedingSize) {
      flushUserInfo = toMerged(flushUserInfo, await this.getSeedingSize(flushUserInfo.id as number));
    }
    return flushUserInfo;
  }
}

function takeElUntilClass<T extends Element>(elSeq: IteratorObject<T>, classNames: string[]): T[] {
  const result: T[] = [];
  for (const el of elSeq) {
    result.push(el);
    if (classNames.some((className) => el.nextElementSibling?.classList.contains(className))) {
      break;
    }
  }

  return result;
}
