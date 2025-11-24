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
      rows: { selector: "tr.torrent" },
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
      time: { selector: ["td:nth-child(5) > span"], attr: "title", filters: [{ name: "parseTime" }] },
      size: { selector: ["td:nth-child(6)"], filters: [{ name: "parseSize" }] },
      author: { selector: ["td:nth-child(10) > a"] },
      seeders: { selector: ["td:nth-child(8)"], filters: [{ name: "parseNumber" }] },
      leechers: { selector: ["td:nth-child(9)"], filters: [{ name: "parseNumber" }] },
      completed: { selector: ["td:nth-child(7)"], filters: [{ name: "parseNumber" }] },
      comments: { selector: ["td:nth-child(4)"], filters: [{ name: "parseNumber" }] },
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
          selector: "img[src*='freedownload.gif']",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "img[src*='doubleseed.gif']",
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
        selector: ["li:contains('Joined:') > span.time"],
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploaded: {
        selector: ["div:contains('Stats') + div.box > ul.stats > li:contains('Uploaded:')"],
        filters: [(query: string) => parseSizeString(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      downloaded: {
        selector: ["div:contains('Stats') + div.box > ul.stats > li:contains('Downloaded:')"],
        filters: [(query: string) => parseSizeString(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      levelName: {
        selector: ["span.rank", "div:contains('Personal') + div.box > ul.stats > li:contains('Class:')"],
        switchFilters: {
          "div:contains('Personal') + div.box > ul.stats > li:contains('Class:')": [
            { name: "trim" },
            { name: "split", args: [":", 1] },
          ],
        },
      },
      bonus: {
        selector: ["div[id='bonusdiv'] > h4"],
        filters: [(query: string) => parseFloat(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      ratio: {
        selector: ["div:contains('Stats') + div.box > ul.stats > li:contains('Ratio:') > span"],
        filters: [
          (query: string) => {
            if (query === "∞") return -1; // Infinity 不能通过 sendMessage 传递，会导致无返回，使用 -1 替代，前端会自动处理的
            const ratioStr = query.replace(/,/g, "");
            return definedFilters.parseNumber(ratioStr);
          },
        ],
      },
      uploads: {
        selector: ["div:contains('Community') + div.box > ul.stats > li:contains('Uploaded')"],
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        // 没找到显示的地方，通过log计算出来
        selector: ["div[id='bonuslog']"],
        elementProcess: (element: any) => {
          if (!element) return 0;

          const firstLine = element.innerHTML.split("<br/>")[0].trim();
          const creditsMatch = firstLine?.match(/\|\s*[+-]?([\d.,]+)\s*credits\s*\|/);
          const credits = parseFloat(creditsMatch?.[1].replace(/,/g, "") || "0");
          return credits / 24;
        },
      },
      seeding: {
        selector: [
          "a[id='nav_seeding'] span[id='nav_seeding_r']",
          "div:contains('Community') + div.box > ul.stats > li:contains('Seeding')",
        ],
        switchFilters: {
          "a[id='nav_seeding'] span[id='nav_seeding_r']": [
            (query: string) => parseInt(query.trim().replace(/,/g, "") || "0"),
          ],
          "div:contains('Community') + div.box > ul.stats > li:contains('Seeding')": [
            { name: "split", args: ["(", 0] },
            { name: "parseNumber" },
          ],
        },
      },
      messageCount: {
        selector: [
          "a[href*='messages.php']",
          "a[href*='inbox.php']",
          "a[href*='pm.php']",
          ".new-message",
          ".message-notification",
          "span:contains('new messages')",
          "span:contains('new message')",
          "div:contains('You have')",
        ],
        filters: [
          (query: string) => {
            if (!query?.trim()) return 0;
            try {
              // 匹配 "You have 3 new messages" 格式
              const newMessagesMatch = query.match(/You have (\d+) new messages?/i);
              if (newMessagesMatch) return parseInt(newMessagesMatch[1], 10) || 0;

              // 匹配 "3 new messages" 格式
              const messagesMatch = query.match(/(\d+) new messages?/i);
              if (messagesMatch) return parseInt(messagesMatch[1], 10) || 0;

              // 匹配纯数字
              const num = parseInt(query.match(/\d+/)?.[0] || "0", 10);
              return isNaN(num) ? 0 : num;
            } catch {
              return 0;
            }
          },
        ],
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

export default class Luminance extends PrivateSite {
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
        const seedingList = Sizzle("ul.stats.nobullet > li:contains('Seeding Size:')", userDetailDocument);
        if (seedingList.length > 0) {
          flushUserInfo.seedingSize = definedFilters.parseSize(seedingList[0].textContent);
        } else {
          // 否则则尝试解析做种列表计算获取
          flushUserInfo.seedingSize = await this.getUserSeedingSize(id, flushUserInfo.seeding);
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

  protected async getUserSeedingSize(id: number, seedingNum: number): Promise<number> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userSettingDocument } = await this.request<Document>({
      url: "/user.php",
      params: {
        action: "edit",
        userid: id,
      },
      responseType: "document",
    });

    const selectedOption = Sizzle("select[id='torrentsperpage'] > option[selected]", userSettingDocument)[0];
    const torPerPageRaw = selectedOption?.getAttribute("value");
    const torPerPage = Number(torPerPageRaw);
    if (!Number.isFinite(torPerPage) || torPerPage <= 0) return 0;

    const pageNum = Math.ceil(seedingNum / torPerPage);
    let seedingSize = 0;
    let sizeIndex = 0;

    for (let i = 0; i < pageNum; i++) {
      await this.sleepAction(this.metadata.userInfo?.requestDelay);

      const { data: seedingPageDocument } = await this.request<Document>({
        url: "/torrents.php",
        params: {
          type: "seeding",
          page: i + 1,
          userid: id,
        },
        responseType: "document",
      });

      if (sizeIndex === 0) {
        const targetTd = Sizzle("tr.colhead > td > a:contains('Size')", seedingPageDocument)[0]?.parentNode;
        if (targetTd && targetTd.parentNode) {
          const allTds = Array.from(targetTd.parentNode.children);
          sizeIndex = allTds.indexOf(targetTd as Element);
        } else {
          return seedingSize;
        }
      }

      const trs = seedingPageDocument.querySelectorAll("tr.torrent");
      for (const tr of trs) {
        const sizeTd = tr.querySelector(`td:nth-child(${sizeIndex + 1})`);
        const sizeText = sizeTd?.textContent?.trim() || "";
        seedingSize += parseSizeString(sizeText.replace(/,/g, ""));
      }
    }

    return seedingSize;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("action=download")) {
      const { data: detailDocument } = await this.request<Document>({
        url: downloadLink,
        responseType: "document",
      });
      return this.getFieldData(detailDocument, this.metadata.search?.selectors?.link!);
    }

    return downloadLink;
  }
}
