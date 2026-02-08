import { omit, toMerged } from "es-toolkit";
import {
  ETorrentStatus,
  EResultParseStatus,
  type ISiteMetadata,
  type IUserInfo,
  type ITorrent,
  type ISearchInput,
  NeedLoginError,
} from "../types";
import { GazelleBase } from "./Gazelle";
import { parseSizeString, definedFilters } from "../utils";
import Sizzle from "sizzle";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  search: {
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        action: "advanced",
      },
    },
    keywordPath: "params.title",
    selectors: {
      rows: { selector: "table#torrent_table:last tr:gt(0)" },
      id: {
        selector: ["a[href*='torrents.php?id=']"],
        attr: "href",
        filters: [(query: string) => query.match(/torrents\.php\?id=(\d+)/)![1]],
      },
      title: { selector: ["a[href*='torrents.php?id=']"] },
      subTitle: {
        // 将站点的大量标签做为副标题
        selector: ["div.tags"],
        elementProcess: (element: any) => {
          if (!element) return 0;
          // 查找所有a元素
          const a_elements = element.querySelectorAll("a[href]");
          // 提取所有a元素中的文本内容
          const allText = Array.from(a_elements)
            .map((a: any) => (a.textContent || a.innerText || "").trim())
            .filter((text) => text.length > 0)
            .join(", ");

          return allText;
        },
      },
      url: { selector: ["a[href*='torrents.php?id=']"], attr: "href" },
      link: { selector: ["a[href*='torrents.php?action=download']"], attr: "href" },
      time: { selector: ["span.time[title]"], attr: "title", filters: [{ name: "parseTime" }] },
      // category: {},
      status: {
        selector: ["a[href*='torrents.php?action=download'] span"],
        text: ETorrentStatus.unknown,
        case: {
          "span.icon_disk_seed": ETorrentStatus.seeding, // 做种!
          "span.icon_disk_leech": ETorrentStatus.downloading, // 吸血!
          "span.icon_disk_grabbed": ETorrentStatus.inactive, // 未完成!
        },
      },
      progress: {
        selector: ["a[href*='torrents.php?action=download'] span"],
        text: 0,
        case: {
          "span.icon_disk_seed": 100,
        },
      },
      tags: [
        {
          name: "Free",
          selector:
            "span.icon[title*='Freeleech'], img[alt='Freeleech'], img[src*='freedownload.gif'], i.unlimited_leech",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "span.icon[title*='DoubleSeed'], img[alt='DoubleSeed'], img[src*='doubleseed.gif']",
          color: "lime",
        },
      ],
    },
  },

  userInfo: {
    pickLast: ["id"],
    selectors: {
      // "/user.php?id="
      name: { selector: ["a.username"] },
      id: {
        selector: ["a.username"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      joinTime: {
        selector: ["ul.stats > li:contains('Joined:') > span.time"],
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      lastAccessAt: {
        selector: ["ul.stats > li:contains('Last Seen:') > span"],
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploaded: {
        selector: ["ul.stats > li:contains('Uploaded:')"],
        filters: [(query: string) => parseSizeString(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      downloaded: {
        selector: ["ul.stats > li:contains('Downloaded:')"],
        filters: [(query: string) => parseSizeString(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      levelName: {
        selector: ["span.rank", "ul.stats > li:contains('Class:')"],
        switchFilters: {
          "ul.stats > li:contains('Class:')": [{ name: "split", args: [":", 1] }],
        },
      },
      bonus: {
        selector: ["div[id='bonusdiv'] > h4", "h4:contains('Credits:')"],
        filters: [(query: string) => parseFloat(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      ratio: {
        selector: ["ul.stats > li:contains('Ratio:') > span"],
        filters: [
          (query: string) => {
            if (query === "∞") return -1; // Infinity 不能通过 sendMessage 传递，会导致无返回，使用 -1 替代，前端会自动处理的
            const ratioStr = query.replace(/,/g, "");
            return definedFilters.parseNumber(ratioStr);
          },
        ],
      },
      uploads: {
        selector: ["ul.stats > li[title]:contains('Uploaded:')"],
        filters: [{ name: "split", args: ["[", 0] }, { name: "parseNumber" }],
      },
      bonusPerHour: {
        // 没找到显示的地方，通过log计算出来
        selector: ["div[id='bonuslog']"],
        elementProcess: (element: HTMLElement) => {
          if (!element) return 0;

          const firstLine = element.innerHTML.split("<br/>").find((log) => log.includes("hrs"));
          const creditsMatch = firstLine?.match(/\|\s*[+-]?([\d.,]+)\s*credits\s*\|/);
          const credits = creditsMatch ? parseFloat(creditsMatch?.[1].replace(/,/g, "")) : 0;
          return credits / 24;
        },
      },
      seeding: {
        selector: ["a[id='nav_seeding'] span[id='nav_seeding_r']", "ul.stats > li:contains('Seeding:')"],
        switchFilters: {
          "a[id='nav_seeding'] span[id='nav_seeding_r']": [
            (query: string) => parseInt(query.trim().replace(/,/g, "") || "0"),
          ],
          "ul.stats > li:contains('Seeding:')": [{ name: "split", args: ["(", 0] }, { name: "parseNumber" }],
        },
      },
      messageCount: {
        selector: ":self",
        elementProcess: (doc: Document) => {
          // https://github.com/Empornium/Luminance/blob/23b568c157a58f36305cf447a3617bf2e4a2ca2e/application/Templates/snippets/header_bottom.html.twig#L93
          const messageEls = Sizzle("a[onmousedown*='inbox'], a[onmousedown*='staffpm']", doc);
          return messageEls.reduce((sum, el) => sum + definedFilters.parseNumber(el.textContent), 0);
        },
      },
      posts: { selector: "ul.stats > li:contains('Forum Posts:')", filters: [{ name: "parseNumber" }] },
    },
  },

  list: [
    {
      urlPattern: ["/torrents\\.php(?!\\?id=\\d+$)"],
    },
  ],

  detail: {
    urlPattern: ["/torrents\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: ["table.torrent_table tr[id] strong"] },
      id: {
        selector: ["a[href*='/torrents.php?action=download']"],
        attr: "href",
        filters: [(query: string) => query.match(/id=(\d+)/)![1]],
      },
      link: {
        selector: ["a[href*='/torrents.php?action=download']"],
        attr: "href",
      },
    },
  },
};

export default class Luminance extends GazelleBase {
  protected guessSearchFieldIndexConfig(): Record<string, string[]> {
    return {
      size: ["td:has(a[href*='order_by=size'])", "td:contains('Size')"], // 大小
      seeders: ["td:has(a[href*='order_by=seeders'])"], // 种子数
      leechers: ["td:has(a[href*='order_by=leechers'])"], // 下载数
      completed: ["td:has(a[href*='order_by=snatched'])"], // 完成数
      comments: ["td:contains('Comm')", "td:has(i.fa-comment)"], // 评论数
      author: ["td:contains('Uploader')"], // 上传者
    } as Record<keyof ITorrent, string[]>;
  }

  public override async transformSearchPage(
    doc: Document | object | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const { keywords, searchEntry, requestConfig } = searchConfig;

    // 返回是 Document 的情况才自动生成选择器
    if (doc instanceof Document) {
      // 如果配置文件没有传入 search 的选择器，则我们自己生成
      const legacyTableSelector = "table#torrent_table:last";

      // 生成 rows的
      if (!searchEntry!.selectors?.rows) {
        searchEntry!.selectors!.rows = {
          selector: `${legacyTableSelector} tr:gt(0)`,
        };
      }

      // 对于 Luminance，一般来说，表的第一行应该是标题行，即 ` > tr:nth-child(1)`
      const headSelector = `${legacyTableSelector} tr:first > td`;
      const headAnother = Sizzle(headSelector, doc) as HTMLElement[];
      headAnother.forEach((element, elementIndex) => {
        // 比较好处理的一些元素，都是可以直接获取的
        let updateSelectorField;
        for (const [dectField, dectSelector] of Object.entries(this.guessSearchFieldIndexConfig())) {
          for (const dectFieldElement of dectSelector) {
            if (Sizzle.matchesSelector(element, dectFieldElement)) {
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
    }

    // !!! 其他一些比较难处理的，我们把他 hack 到 parseWholeTorrentFromRow 中 !!!
    return await super.transformSearchPage(doc, { keywords, searchEntry, requestConfig });
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 种子链接格式是 torrent.php?id=123
    return this.getTorrentDownloadLinkFactory("id")(torrent);
  }

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

    // 如果定义了 process，则按照 AbstractPrivateSite 的方式处理
    if (Array.isArray(this.metadata.userInfo?.process)) {
      return await super.getUserInfoResult(lastUserInfo);
    }

    // 否则直接使用 Luminance 的方式获取用户信息
    try {
      let id: number;
      if (lastUserInfo !== null && lastUserInfo.id) {
        id = lastUserInfo.id as number;
      } else {
        // 如果没有 id 信息，则访问一次 主页
        id = await this.getUserIdFromSite();
      }
      flushUserInfo.id = id;

      const { data: userDetailDocument } = await this.request<Document>({
        url: `/user.php?id=${id}`,
        responseType: "document",
      });

      // 导入基本 Details 页面获取到的用户信息
      flushUserInfo = toMerged(flushUserInfo, await this.getUserInfoFromDetailsPage(userDetailDocument));

      if (flushUserInfo.seeding) {
        // 对有 Seeding Size 行的站点直接解析对应元素
        const seedingList = Sizzle("ul.stats > li:contains('Seeding Size:')", userDetailDocument);
        if (seedingList.length > 0) {
          flushUserInfo.seedingSize = definedFilters.parseSize(seedingList[0].textContent);
        } else {
          // 否则则尝试解析做种列表计算获取
          flushUserInfo = toMerged(flushUserInfo, await this.getSeedingSize(id));
        }
      }

      // 如果前面没有获取到用户等级的id，则尝试通过定义的 levelRequirements 来获取
      if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (e) {
      flushUserInfo.status = EResultParseStatus.parseError;

      if (e instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }

  protected async getUserIdFromSite(): Promise<number> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: indexDocument } = await this.request<Document>(
      {
        url: "/",
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(indexDocument, this.metadata.userInfo?.selectors?.id!);
  }

  protected async getUserInfoFromDetailsPage(userDetailDocument: Document): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    return this.getFieldsData(
      userDetailDocument,
      this.metadata.userInfo?.selectors!,
      Object.keys(omit(this.metadata.userInfo?.selectors!, ["id"])),
    ) as Partial<IUserInfo>;
  }
}
