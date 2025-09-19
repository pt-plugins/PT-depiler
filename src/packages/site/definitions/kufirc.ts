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

export const siteMetadata: ISiteMetadata = {
  id: "kufirc",
  version: 1,
  name: "kufirc",
  aka: ["kf"],
  tags: ["成人", "XXX"],
  description: "XXX Animal",

  type: "private",
  schema: "Kufirc",

  urls: ["uggcf://xhsvep.pbz/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Amateur", value: "30" },
        { name: "Anal", value: "29" },
        { name: "Animal", value: "5" },
        { name: "Asian", value: "27" },
        { name: "BBW", value: "26" },
        { name: "BDSM", value: "44" },
        { name: "Big Ass", value: "25" },
        { name: "Big Tits", value: "24" },
        { name: "Black", value: "34" },
        { name: "Busty", value: "35" },
        { name: "Classic", value: "23" },
        { name: "Creampie", value: "33" },
        { name: "Cumshot", value: "22" },
        { name: "Feature", value: "36" },
        { name: "Fetish", value: "21" },
        { name: "Film/Cam/Hun", value: "31" },
        { name: "Film/Xvid/hun", value: "46" },
        { name: "Foreign", value: "37" },
        { name: "Gay / Bi", value: "19" },
        { name: "Hardcore", value: "18" },
        { name: "HD porn", value: "32" },
        { name: "Hentai / 3D", value: "28" },
        { name: "Homemade", value: "17" },
        { name: "Image", value: "11" },
        { name: "Interracial", value: "38" },
        { name: "Latina", value: "48" },
        { name: "Lesbian", value: "16" },
        { name: "Magazines", value: "56" },
        { name: "Magyar", value: "6" },
        { name: "Masturbation", value: "15" },
        { name: "Mature", value: "14" },
        { name: "Megapack", value: "13" },
        { name: "Milf", value: "55" },
        { name: "Natural Tits", value: "49" },
        { name: "Old + Young", value: "39" },
        { name: "Oral", value: "12" },
        { name: "Orgia / Gang Bang", value: "20" },
        { name: "Other", value: "42" },
        { name: "Parody", value: "50" },
        { name: "Paysite", value: "41" },
        { name: "Piss", value: "40" },
        { name: "Porn Music Videos", value: "43" },
        { name: "Pov", value: "54" },
        { name: "Pregnant / Preggo", value: "45" },
        { name: "Scat/Puke", value: "57" },
        { name: "Shemale / TS", value: "10" },
        { name: "Siterip", value: "51" },
        { name: "Softcore", value: "52" },
        { name: "Squirt", value: "53" },
        { name: "Straight", value: "9" },
        { name: "Teen", value: "8" },
        { name: "VR", value: "47" },
        { name: "XXX Games / Applications", value: "7" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "标签和分辨率",
      key: "taglist",
      options: buildCategoryOptions([
        ["1080p", "1on1", "2160p", "720p", "amateur", "anal", "big.ass"],
        ["big.tits", "brunette", "cowgirl", "cumshot", "doggy", "facial", "family.strokes"],
        ["hardcore", "hd", "homemade", "horse", "hungarian", "hungary", "natural.tits", "oral"],
      ]),
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        // tag参数是taglist=tag1+tag2+...
        const params: Record<string, any> = {};
        const taglist: string[] = [];
        (selectedOptions as Array<number | string>).forEach((value) => {
          const strValue = value.toString();
          taglist.push(strValue);
        });
        if (taglist.length > 0) {
          params.taglist = taglist.join("+");
        }
        return { requestConfig: { params } };
      },
    },
    {
      name: "优惠",
      key: "free",
      options: [{ name: "100% Freeleech", value: "filter_freeleech" }],
      cross: { mode: "append", key: "" },
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents.php",
      params: {
        perPage: 100,
      },
    },
    keywordPath: "params.title",
    advanceKeywordParams: {
      // 支持站点的高级搜索
      terms: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.title) {
            config.params.searchtext = config.params.title;
            delete config.params.title;
          }
          return config!;
        },
      },
    },
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
          return Array.from(a_elements)
            .map((a: any) => (a.textContent || a.innerText || "").trim())
            .filter((text) => text.length > 0)
            .join(", ");
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
      category: {
        selector: ["td.cats_col > div"],
        attr: "title",
        filters: [
          (query: string) => {
            if (query.toLowerCase() === "vr") {
              return "VR";
            }
            return query.toLowerCase().replace(/\b\w/g, (char: any) => char.toUpperCase());
          },
        ],
      },
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
    pickLast: ["id", "name"],
    selectors: {
      // "/user.php?id="
      name: { selector: ["a.username"] },
      id: {
        selector: ["a.username"],
        attr: "href",
        filters: [(query: string) => query.match(/user\.php\?id=(\d+)/)![1]],
      },
      joinTime: {
        selector: ["ul.stats.nobullet > li:first-child > span"],
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploaded: {
        selector: ["ul.stats.nobullet > li:nth-child(3)"],
        filters: [(query: string) => parseSizeString(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      downloaded: {
        selector: ["ul.stats.nobullet > li:nth-child(4)"],
        filters: [(query: string) => parseSizeString(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      levelName: {
        selector: ["div.sidebar"],
        elementProcess: (element: any) => {
          if (!element) return undefined;
          const allUls = element.querySelectorAll("ul.stats.nobullet");

          if (allUls.length >= 3) {
            const thirdUl = allUls[2];
            const firstLi = thirdUl.querySelector("li:first-child");
            const levelName = firstLi?.textContent?.split(":")[1].trim();

            return levelName?.toLowerCase().replace(/\b\w/g, (char: any) => char.toUpperCase()) || undefined;
          }
          return undefined;
        },
      },
      bonus: {
        selector: ["div[id='bonusdiv'] > h4"],
        filters: [(query: string) => parseFloat(query.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      ratio: {
        selector: ["ul.stats.nobullet > li:nth-child(5) > span"],
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: ["div.sidebar"],
        elementProcess: (element: any) => {
          if (!element) return 0;
          const allLiElements = element.querySelectorAll("ul.stats.nobullet li[title]");

          let uploadedTitle: string = "0";
          for (const li of allLiElements) {
            const text = li.textContent?.trim() || "";
            if (text.includes("Torrents uploaded")) {
              uploadedTitle = li.getAttribute("title") || "0";
              break;
            }
          }
          return parseInt(uploadedTitle);
        },
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
        selector: ["a[id='nav_seeding'] span[id='nav_seeding_r']"],
        filters: [(query: string) => parseInt(query.trim().replace(/,/g, "") || "0")],
      },
      // "/torrents.php?type=seeding&userid="
      seedingSize: {
        selector: ["table.torrent_table"],
        elementProcess: (element: any) => {
          if (!element) return 0;
          const tr_elements = element.querySelectorAll("tr.torrent");

          let sumSizes: number = 0;
          tr_elements.forEach((tr: any) => {
            // 获取当前 tr 下的所有 td
            const tdElements = tr.querySelectorAll("td");
            // 第 6 个 td（索引 5）是文件大小
            if (tdElements.length >= 6) {
              const sixthTd = tdElements[5];
              const sizeText = sixthTd.textContent?.trim() || "";
              sumSizes += parseSizeString(sizeText.replace(/,/g, ""));
            }
          });

          return sumSizes;
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

  levelRequirements: [
    {
      id: 1,
      name: "Apprentice",
      privilege: "The default class of new members.",
    },
    {
      id: 2,
      name: "Perv",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "Must have been be a member for at least 1 week, uploaded 10GB+, ratio 0.7+",
    },
    {
      id: 3,
      name: "Good Perv",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Must have been be a member for at least 4 weeks, uploaded 25GB+, ratio 1.05+",
    },
    {
      id: 4,
      name: "Sextreme Perv",
      interval: "P13W",
      uploaded: "1TB",
      uploads: 50,
      ratio: 1.05,
      privilege: "Must have been be a member for at least 13 weeks, uploaded 1TB+, uploaded 50+ torrents, ratio 1.05+",
    },
    {
      id: 5,
      name: "Smut Peddler",
      interval: "P26W",
      uploaded: "10TB",
      uploads: 250,
      ratio: 1.05,
      privilege:
        "Must have been be a member for at least 26 weeks, uploaded 10TB+, uploaded 250+ torrents, ratio 1.05+",
    },
    {
      id: 6,
      name: "Legenda",
      privilege: "Legendary user with special privileges.",
    },
  ],
};

export default class Kufirc extends PrivateSite {
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
        // 如果没有 id 信息，则访问一次 主页
        id = await this.getUserIdFromSite();
      }
      flushUserInfo.id = id;

      // 导入基本 Details 页面获取到的用户信息
      flushUserInfo = toMerged(flushUserInfo, await this.getUserInfoFromDetailsPage(id));
      flushUserInfo.seedingSize = await this.getUserSeedingSize(id);

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

  protected async getUserInfoFromDetailsPage(id: number): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userDetailDocument } = await this.request<Document>({
      url: `/user.php?id=${id}`,
      responseType: "document",
    });

    return this.getFieldsData(
      userDetailDocument,
      this.metadata.userInfo?.selectors!,
      Object.keys(omit(this.metadata.userInfo?.selectors!, ["id"])),
    ) as Partial<IUserInfo>;
  }

  protected async getUserSeedingSize(id: number): Promise<number> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: userDetailDocument } = await this.request<Document>({
      url: `/torrents.php?type=seeding&userid=${id}`,
      responseType: "document",
    });

    return this.getFieldData(userDetailDocument, this.metadata.userInfo?.selectors?.seedingSize!);
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
