/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/aidoruonline.yml
 */
import { omit, toMerged } from "es-toolkit";
import {
  ETorrentStatus,
  EResultParseStatus,
  type ISiteMetadata,
  type IUserInfo,
  type ITorrent,
  NeedLoginError,
} from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";
import { buildCategoryOptions, parseSizeString } from "../utils";
import { parseValidTimeString } from "../utils/datetime.ts";

export const siteMetadata: ISiteMetadata = {
  id: "aidoruonline",
  version: 1,
  name: "Aidoru!Online",
  tags: ["偶像"],
  collaborator: ["hyuan280"],

  type: "private",
  schema: "AidoruOnline",

  urls: ["uggcf://nvqbeh-bayvar.zr/"],

  category: [
    {
      name: "类别",
      key: "pcat",
      options: buildCategoryOptions(["Show All", "48G", "Games", "Stardust", "Other"]),
    },
    {
      name: "规格",
      key: "scat",
      options: [
        { name: "BD/DVDISO", value: "1" },
        { name: "BD/DVD-RIP", value: "2" },
        { name: "TV", value: "3" },
        { name: "Perf", value: "4" },
        { name: "PV", value: "5" },
        { name: "Webstream", value: "6" },
        { name: "Image", value: "7" },
        { name: "Audio", value: "8" },
        { name: "Album", value: "9" },
        { name: "Single", value: "10" },
        { name: "Radio", value: "11" },
        { name: "Misc", value: "12" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { name: "Resurrected", value: "resd" }, // Torrents dead for over 6 months brought back to life
        { name: "Freeleech", value: "fl" },
        { name: "Subtitled", value: "subbed" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = {};
        (selectedOptions as Array<number | string>).forEach((value) => {
          params[value] = "1";
        });
        return { requestConfig: { params } };
      },
    },
    {
      name: "搜索类型",
      key: "typ",
      options: [
        { name: "Name", value: "name" }, // Torrents dead for over 6 months brought back to life
        { name: "Description", value: "descr" },
        { name: "Name & Descr", value: "both" },
      ],
    },
    {
      name: "活跃度",
      key: "deadlive",
      options: [
        { name: "Active Transfers", value: 0 },
        { name: "Include Dead", value: 1 },
        { name: "Only Dead", value: 2 },
        { name: "Need Seed", value: 3 },
      ],
    },
  ],

  search: {
    //get_ttable.php?pcat=Show+All&typ=name&scat=&subbed=&fl=&resd=&p=0&searchstr=&deadlive=0
    requestConfig: {
      url: "/get_ttable.php",
      params: {
        pcat: "Show+All",
        typ: "name",
        scat: "",
        subbed: "",
        fl: "",
        resd: "",
        p: 0,
        searchstr: "",
        deadlive: 0,
      },
    },
    keywordPath: "params.searchstr",
    selectors: {
      rows: { selector: "tr.t-row" },
      id: {
        selector: ["a[href*='torrents-details.php?id=']:not([href*='#'])"],
        attr: "href",
        filters: [(query: string) => query.match(/torrents-details\.php\?id=(\d+)/)![1]],
      },
      title: { selector: ["a[href*='torrents-details.php?id=']:not([href*='#']) b"] },
      url: { selector: ["a[href*='torrents-details.php?id=']:not([href*='#'])"], attr: "href" },
      link: { selector: ["a[href*='download.php?id=']"], attr: "href" },
      time: {
        selector: ["td.ttable_timestamp"],
        filters: [(query: string) => parseValidTimeString(query, ["MMddyy HH:mm:ss"])],
      },
      size: { selector: ["td.ttable_size"], filters: [{ name: "parseSize" }] },
      author: { selector: ["a[href*='account-details.php?id=']"] },
      seeders: { selector: ["font[color='green'] > b"], filters: [{ name: "parseNumber" }] },
      leechers: { selector: ["font[color='#ff0000'] > b"], filters: [{ name: "parseNumber" }] },
      completed: { selector: ["font[color='black'] > b"], filters: [{ name: "parseNumber" }] },
      comments: { selector: ["a.comment-link"], filters: [{ name: "parseNumber" }] },
      category: {
        selector: ["a.category-link"],
        filters: [(query: string) => query.split(":")[1].trim()],
      },
      tags: [
        {
          name: "Free",
          selector: "img[title='freeleech']",
          color: "blue",
        },
        {
          name: "sub",
          selector: "img[title='subtitled']",
          color: "orange",
        },
      ],
      status: {
        selector: ":self",
        elementProcess: (element: any) => {
          if (!element) return ETorrentStatus.unknown;
          if (element.querySelector("td.ttable_seeding font[color='green']")) {
            return ETorrentStatus.seeding; // 做种!
          }
          if (element.querySelector("td.ttable_seeding font[color='#ff0000']")) {
            return ETorrentStatus.downloading; // 吸血!
          }
          if (element.querySelector("td.ttable_seeding font[color='black']")) {
            return ETorrentStatus.completed; // 撤种!
          }
          return ETorrentStatus.unknown;
        },
      },
      progress: {
        selector: ":self",
        elementProcess: (element: any) => {
          if (!element) return ETorrentStatus.unknown;
          if (
            element.querySelector("td.ttable_seeding font[color='green']") ||
            element.querySelector("td.ttable_seeding font[color='black']")
          ) {
            return 100;
          }
          return ETorrentStatus.unknown;
        },
      },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    selectors: {
      // "/forum/usercp.php"
      id: {
        selector: ["a[href*='member.php?action=profile']"],
        attr: "href",
        filters: [(query: string) => query.match(/uid=(\d+)/)![1]],
      },
      // "/account.php"
      name: { selector: ["td.prof-lbl:contains('Username:') + td"] },
      joinTime: {
        selector: ["td.prof-lbl:contains('Joined:') + td"],
        filters: [{ name: "parseTime" }],
      },
      uploaded: {
        selector: ["td.prof-lbl:contains('Uploaded:') + td"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["td.prof-lbl:contains('Downloaded:') + td"],
        filters: [{ name: "parseSize" }],
      },
      levelName: { selector: ["td.prof-lbl:contains('User Class:') + td"] },
      ratio: {
        selector: ["td.prof-lbl:contains('Ratio:') + td"],
        filters: [(query: string) => (query.trim() === "---" ? Infinity : parseFloat(query))],
      },
      uploads: {
        selector: ["td.prof-lbl:contains('Uploads:') + td"],
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ["span[id='seed-count']"],
        filters: [{ name: "parseNumber" }],
      },
      seedingPage: {
        selector: ["div[id='seed-search-stat']"],
        filters: [(query: string) => parseInt(query?.match(/Page (\d+) \//)?.[1] ?? "0")],
      },
      // 没有积分系统
      bonus: { text: "0" },
      // "/get_account_peers.php"
      seedingSize: {
        selector: ":self",
        elementProcess: (element: any) => {
          if (!element) return 0;
          const tr_elements = element.querySelectorAll("tr");

          let sumSizes: number = 0;
          tr_elements.forEach((tr: any) => {
            // 获取当前 tr 下的所有 td
            const tdElements = tr.querySelectorAll("td");
            // 第 4 个 td（索引 3）是文件大小
            if (tdElements.length >= 4) {
              const sixthTd = tdElements[3];
              const sizeText = sixthTd.textContent?.trim() || "";
              sumSizes += parseSizeString(sizeText.replace(/,/g, ""));
            }
          });

          return sumSizes;
        },
      },
    },
  },

  // TODO userInfo 中的messageCount 等其他字段

  list: [
    {
      urlPattern: ["/(index.php|torrents-search.php)$"],
    },
  ],

  detail: {
    urlPattern: ["/torrents-details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: ["div.myFrame td:contains('Name:') + td"] },
      id: {
        selector: ["a[href*='download.php?id=']"],
        attr: "href",
        filters: [(query: string) => query.match(/id=(\d+)/)![1]],
      },
      link: {
        selector: ["a[href*='download.php?id=']"],
        attr: "href",
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      privilege: "Can download, upload torrents；Ratio effects availability of new torrents",
    },
    {
      id: 2,
      name: "Sharer ",
      uploads: 50,
      averageSeedingTime: "P20H",
      interval: "P6M",
      privilege:
        "Can download, upload torrents；Ratio has no effect on availability of new torrents；Notification and highlighting of new comments",
    },
    {
      id: 3,
      name: "Distributor",
      uploads: 500,
      averageSeedingTime: "P5D",
      ratio: 1.0,
      privilege:
        "Can download, upload torrents；Ratio has no effect on availability of new torrents；Notification and highlighting of new comments；Can view peers on torrents；Can view user list of who completed downloading a torrent",
    },
    {
      id: 4,
      name: "Uploader",
      privilege: "user who uploads new content to the site on a regular basis",
    },
    {
      id: 5,
      name: "Uploader+",
      privilege: "uploader who has a low freeleech ratio",
    },
  ],
};

export default class AidoruOnline extends PrivateSite {
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

    try {
      let id: number;
      if (lastUserInfo !== null && lastUserInfo.id) {
        id = lastUserInfo.id as number;
      } else {
        // 如果没有 id 信息，则访问一次 用户CP页面
        id = await this.getUserIdFromUserCP();
      }
      flushUserInfo.id = id;

      // 导入基本 Details 页面获取到的用户信息
      flushUserInfo = toMerged(flushUserInfo, await this.getUserInfoFromDetailsPage());
      flushUserInfo = await this.getUserSeedingFields(flushUserInfo);

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

  protected async getUserIdFromUserCP(): Promise<number> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: indexDocument } = await this.request<Document>(
      {
        url: "/forum/usercp.php",
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(indexDocument, this.metadata.userInfo?.selectors?.id!);
  }

  protected async getUserInfoFromDetailsPage(): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userDetailDocument } = await this.request<Document>({
      url: "/account.php",
      responseType: "document",
    });

    return this.getFieldsData(
      userDetailDocument,
      this.metadata.userInfo?.selectors!,
      Object.keys(omit(this.metadata.userInfo?.selectors!, ["id", "seedingSize"])),
    ) as Partial<IUserInfo>;
  }

  protected async getUserSeedingFields(flushUserInfo: IUserInfo): Promise<IUserInfo> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    flushUserInfo.seedingSize = 0;
    if (flushUserInfo && flushUserInfo.seedingPage) {
      for (let p = 0; p < flushUserInfo.seedingPage; p++) {
        const { data: userDetailText } = await this.request<Document>({
          url: `/get_account_peers.php?uid=&p=${p}&type=seed&searchstr=`,
          responseType: "text",
        });
        // 请求获取的是tr片段，添加表头再解析
        const wrappedHTML = `<table><tbody>${userDetailText}</tbody></table>`;

        const parser = new DOMParser();
        const userDetailDocument = parser.parseFromString(wrappedHTML, "text/html");

        flushUserInfo.seedingSize += this.getFieldData(
          userDetailDocument,
          this.metadata.userInfo?.selectors?.seedingSize!,
        );
      }
    }

    return flushUserInfo;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("download.php")) {
      const { data: detailDocument } = await this.request<Document>({
        url: downloadLink,
        responseType: "document",
      });
      return this.getFieldData(detailDocument, this.metadata.search?.selectors?.link!);
    }

    return downloadLink;
  }
}
