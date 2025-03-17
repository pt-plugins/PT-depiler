import PrivateSite from "./AbstractPrivateSite";
import { ISiteMetadata, IUserInfo, ETorrentStatus, ITorrent, ISearchInput } from "../types";
import Sizzle from "sizzle";
import { mergeWith, toMerged } from "es-toolkit";
import {
  createDocument,
  extractContent,
  parseSizeString,
  parseTimeToLive,
  parseValidTimeString,
  sizePattern,
} from "../utils";
import { set } from "es-toolkit/compat";

const baseLinkQuery = {
  selector: 'a[href*="download.php?id="]:has(> img[alt="download"])',
  attr: "href",
};

/**
 * NexusPHP 模板默认配置，对于大多数NPHP站点都通用
 * @protected
 */
export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  timezoneOffset: "+0800", // NPHP 一般都是国内用，时区多为 +0800
  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/torrents.php",
      params: { notnewword: 1 },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.search_area", 4); // params "&search_area=4"
          return config!;
        },
      },
    },
    selectors: {
      // row 等信息由 transformSearchPage 根据搜索结果自动生成
      link: baseLinkQuery, // 种子下载链接
      url: {
        ...baseLinkQuery,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "perpend", args: ["/details.php?id="] },
        ],
      }, // 种子页面链接
      id: {
        ...baseLinkQuery,
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        text: "",
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        elementProcess: (element) => {
          return (element.getAttribute("title") || element.textContent || "").trim();
        },
      },
      subTitle: {
        text: "",
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        elementProcess: (element) => {
          const testSubTitle = element.parentElement!.innerHTML.split("<br>");
          if (testSubTitle && testSubTitle.length > 1) {
            return extractContent(testSubTitle[testSubTitle.length - 1]).trim();
          }
          return "";
        },
      },
      progress: {
        text: 0,
      },
      status: {
        text: ETorrentStatus.unknown,
      },
      category: {
        text: "Other",
        selector: ["a:first"],
        elementProcess: (element: HTMLElement) => {
          let category = "Other";
          const categoryImgAnother = element.querySelector("img:nth-child(1)"); // img:first
          if (categoryImgAnother) {
            category = categoryImgAnother.getAttribute("title") || categoryImgAnother.getAttribute("alt") || category;
          } else {
            return element.textContent || category;
          }

          return category.trim();
        },
      },
      time: {
        text: 0,
        elementProcess: (element: HTMLElement) => {
          let time: number | string = 0;
          try {
            const AccurateTimeAnother = element.querySelector("span[title], time[title]");
            if (AccurateTimeAnother) {
              time = AccurateTimeAnother.getAttribute("title")!;
            } else {
              time = extractContent(element.innerHTML.replace("<br>", " "));
            }

            if (time.match(/\d+[分时天月年]/g)) {
              time = parseTimeToLive(time);
            } else {
              time = parseValidTimeString(time);
            }
          } catch (e) {}
          return time as number;
        },
      },
      tags: [
        { name: "Free", selector: "img.pro_free", color: "blue" },
        { name: "2xFree", selector: "img.pro_free2up", color: "green" },
        { name: "2xUp", selector: "img.pro_2up", color: "lime" },
        { name: "2x50%", selector: "img.pro_50pctdown2up", color: "light-green" },
        { name: "30%", selector: "img.pro_30pctdown", color: "indigo" },
        { name: "50%", selector: "img.pro_50pctdown", color: "deep-orange-darken-1" },
      ],
    },
  },

  userInfo: {
    /**
     * 我们认为NPHP站的 id, joinTime 的情况永远不变（实质上对于所有站点都应该是这样的）
     * 部分 NPHP 站点允许修改 name，所以 name 不能视为不变 ！！！
     */
    pickLast: ["id", "joinTime"],
    selectors: {
      // "page": "/index.php",
      id: {
        selector: ["a[href*='userdetails.php'][class*='Name']:first", "a[href*='userdetails.php']:first"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: ["a[href*='userdetails.php'][class*='Name']:first", "a[href*='userdetails.php']:first"],
      },
      messageCount: {
        text: 0,
        selector: "td[style*='background: red'] a[href*='messages.php']",
        filters: [
          (query: string | number) => {
            const queryMatch = String(query || "").match(/(\d+)/); // query 有时会直接传入 0
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },

      // "page": "/userdetails.php?id=$user.id$",
      uploaded: {
        selector: [
          "td.rowhead:contains('传输') + td",
          "td.rowhead:contains('傳送') + td",
          "td.rowhead:contains('Transfers') + td",
          "td.rowfollow:contains('分享率')",
        ],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/(上[传傳]量|Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length === 3 ? parseSizeString(queryMatch[2]) : 0;
          },
        ],
      },
      downloaded: {
        selector: [
          "td.rowhead:contains('传输') + td",
          "td.rowhead:contains('傳送') + td",
          "td.rowhead:contains('Transfers') + td",
          "td.rowfollow:contains('分享率')",
        ],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/(下[载載]量|Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length === 3 ? parseSizeString(queryMatch[2]) : 0;
          },
        ],
      },
      levelName: {
        selector: [
          "td.rowhead:contains('等级') + td > img",
          "td.rowhead:contains('等級')  + td > img",
          "td.rowhead:contains('Class')  + td > img",
        ],
        attr: "title",
      },
      bonus: {
        selector: [
          "td.rowhead:contains('魔力') + td",
          "td.rowhead:contains('Karma'):contains('Points') + td",
          "td.rowhead:contains('麦粒') + td",
          "td.rowfollow:contains('魔力值')",
        ],
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            if (/(魅力值|沙粒|魔力值):?/.test(query)) {
              query = query.match(/(魅力值|沙粒|魔力值).+?([\d.]+)/)![2];
              return parseFloat(query);
            } else if (/[\d.]+/.test(query)) {
              return parseFloat(query.match(/[\d.]+/)![0]);
            }
            return query;
          },
        ],
      },
      joinTime: {
        selector: ["td.rowhead:contains('加入日期') + td", "td.rowhead:contains('Join'):contains('date') + td"],
        filters: [
          (query: string) => {
            query = query.split(" (")[0];
            return parseValidTimeString(query);
          },
        ],
      },

      /**
       * 如果指定 seeding 和 seedingSize，则会尝试从 "/userdetails.php?id=$user.id$" 页面获取，
       * 否则将使用方法 getUserSeedingStatus 进行获取
       *
       */
      // seeding: { }
      // seedingSize: { }
    },
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id"],
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "name",
          "levelName",
          "uploaded",
          "downloaded",
          "seeding",
          "seedingSize",
          "bonus",
          "messageCount",
          "joinTime",
        ],
      },
    ],
  },
};

export default class NexusPHP extends PrivateSite {
  protected override async transformSearchPage(
    doc: Document | object | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const { keywords, searchEntry, requestConfig } = searchConfig;

    // 返回是 Document 的情况才自动生成
    if (doc instanceof Document) {
      // 如果配置文件没有传入 search 的选择器，则我们自己生成
      const legacyTableSelector = "table.torrents:last";

      // 对于NPHP，一般来说，表的第一行应该是标题行，即 `> tbody > tr:nth-child(1)` ，但是也有部分站点为 `> thead > tr`
      const legacyTableHasThead = Sizzle(`${legacyTableSelector} > thead > tr`, doc).length > 0;

      if (!searchEntry!.selectors!.rows) {
        searchEntry!.selectors!.rows = {
          // 对于有thead的站点，认为 > tbody > tr 均为种子信息，而无 thead 的站点则为 > tbody > tr:gt(0)
          selector: `${legacyTableSelector} > tbody > tr` + (legacyTableHasThead ? "" : ":gt(0)"),
        };
      }

      // 开始遍历我们的head行，并设置其他参数
      const headSelector =
        legacyTableSelector + (legacyTableHasThead ? " > thead > tr > th" : " > tbody > tr:eq(0) > td");
      const headAnother = Sizzle(headSelector, doc) as HTMLElement[];
      headAnother.forEach((element, elementIndex) => {
        // 比较好处理的一些元素，都是可以直接获取的
        let updateSelectorField;
        if (/(cat|类型|類型|分类|分類|Тип)/gi.test(element.innerText)) {
          updateSelectorField = "category";
        } else {
          for (const [dectField, dectSelector] of Object.entries({
            author: 'a[href*="sort=9"]', // 发布者
            comments: "img.comments", // 评论数
            completed: "img.snatched", // 完成数
            leechers: "img.leechers", // 下载数
            seeders: "img.seeders", // 种子数
            size: "img.size", // 大小
            time: "img.time", // 发布时间 （仅生成 selector， 后面会覆盖）
          } as Record<keyof ITorrent, string>)) {
            if (Sizzle(dectSelector, element).length > 0) {
              updateSelectorField = dectField;
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
    return super.transformSearchPage(doc, { keywords, searchEntry, requestConfig });
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult();

    // 导入用户做种信息
    if (typeof flushUserInfo.seeding === "undefined" || typeof flushUserInfo.seedingSize === "undefined") {
      flushUserInfo = mergeWith(
        flushUserInfo,
        await this.parseUserInfoForSeedingStatus(flushUserInfo.id as number),
        (objValue, srcValue) => {
          return objValue > 0 ? objValue : srcValue;
        },
      );
    }

    return flushUserInfo as IUserInfo;
  }

  /**
   * 鉴于NexusPHP这里使用ajax交互，如果强行指定 responseType: 'document' ，
   * 由于返回字段并不是 valid-html, 此时会解析失败（即 data = undefined ），
   * 所以此处不指定 responseType，而是返回文本形式的 string，交由 getUserSeedingStatus
   * 生成 Document
   *
   * @param userId
   * @param type
   * @protected
   */
  protected async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const { data } = await this.request<string>({
      url: "/getusertorrentlistajax.php",
      params: { userid: userId, type },
    });
    return data || null;
  }

  protected async parseUserInfoForSeedingStatus(userId: number): Promise<{ seeding: number; seedingSize: number }> {
    let seedStatus = { seeding: 0, seedingSize: 0 };

    const userSeedingRequestString = await this.requestUserSeedingPage(userId);

    if (userSeedingRequestString) {
      const userSeedingDocument = createDocument(userSeedingRequestString);
      const trAnothers = Sizzle("table:last tr:not(:eq(0))", userSeedingDocument);
      if (trAnothers.length > 0) {
        seedStatus.seeding = trAnothers.length;

        // 根据自动判断应该用 td.rowfollow:eq(?)
        let sizeIndex = 2;
        const tdAnothers = Sizzle("> td", trAnothers[0]);
        for (let i = 0; i < tdAnothers.length; i++) {
          if (sizePattern.test((tdAnothers[i] as HTMLElement).innerText)) {
            sizeIndex = i;
            break;
          }
        }

        trAnothers.forEach((trAnother) => {
          const sizeSelector = Sizzle(`td.rowfollow:eq(${sizeIndex})`, trAnother)[0] as HTMLElement;
          seedStatus.seedingSize += parseSizeString(sizeSelector.innerText.trim());
        });
      }
    }

    return seedStatus;
  }
}
