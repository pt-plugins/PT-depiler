import { omit, toMerged } from "es-toolkit";
import { ETorrentStatus, EResultParseStatus, type ISiteMetadata, type IUserInfo, NeedLoginError } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";
import { buildCategoryOptions, parseSizeString } from "../utils";

export const siteMetadata: ISiteMetadata = {
  id: "happyfappy",
  version: 1,
  name: "HappyFappy",
  aka: ["HF"],
  tags: ["成人"],
  collaborator: ["hyuan280"],

  type: "private",
  schema: "HappyFappy",

  urls: ["uggcf://jjj.uncclsnccl.bet/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Fansite", value: "6" },
        { name: "Asian", value: "11" },
        { name: "Games", value: "13" },
        { name: "Gay / Bi", value: "3" },
        { name: "Interracial", value: "4" },
        { name: "Lesbian", value: "5" },
        { name: "Packs", value: "9" },
        { name: "Pics", value: "10" },
        { name: "Pron", value: "1" },
        { name: "Retro", value: "8" },
        { name: "Transexual", value: "12" },
        { name: "VR", value: "7" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "标签和分辨率",
      key: "taglist",
      options: buildCategoryOptions([
        ["1080p", "2160p", "720p", "1on1", "anal", "big.ass", "big.dick", "big.tits", "blonde", "blowjob", "brunette"],
        ["cowgirl", "creampie", "cum.in.mouth", "cumshot", "cunnilingus", "deepthroat", "doggy.style", "face.fuck"],
        ["facial", "fake.tits", "fingering", "handjob", "hardcore", "invalid.tag", "lesbian", "masturbation", "milf"],
        ["missionary", "natural.tits", "pussy.fingering", "rimming", "shaved.pussy", "sideways", "small.tits"],
        ["tattoo", "teen", "tit.fuck", "toys", "virtual.reality"],
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
    pickLast: ["id", "name", "joinTime"],
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
    },
  },

  // TODO userInfo 中的messageCount 等其他字段

  levelRequirements: [
    {
      id: 1,
      name: "Sex Worker",
      privilege:
        "Class every new user starts with；can upload torrents；can create and vote in Requests；can access forums；can make bookmarks；can set forum signature (up to 128 characters)",
    },
    {
      id: 2,
      name: "Pimp",
      uploaded: "25GB",
      ratio: 1.15,
      interval: "P2W",
      privilege:
        "can use the top 10 system；can use the notifications system；can create collages；can use upload templates；can add tags；can play slot machine；can set forum signature (up to 128 characters)；can set torrent footer",
    },
    {
      id: 3,
      name: "Pornstar Trainee",
      uploaded: "50GB",
      ratio: 1.5,
      uploads: 10,
      posts: 5,
      interval: "P4W",
      privilege:
        "can create polls in the forum；can add multiple tags；can view site stats；can sent special gift；can set forum signature (up to 256 characters)",
    },
    {
      id: 4,
      name: "Lube Handler",
      uploaded: "10TB",
      ratio: 2.5,
      uploads: 150,
      interval: "P16W",
      privilege:
        "can use Advanced bbcode tags；can use avatar size 150x200；can set forum signature (up to 512 characters)",
    },
    {
      id: 5,
      name: "Toy Expert",
      uploaded: "25TB",
      ratio: 5.0,
      uploads: 500,
      posts: 100,
      interval: "P28W",
      privilege:
        "can use Forum: Users Invite Forum；can make public upload templates.；upload, rank up and find out what unlocks.",
    },
    {
      id: 6,
      name: "Pornstar",
      uploaded: "50TB",
      ratio: 7.0,
      uploads: 1000,
      interval: "P28W",
      privilege: "upload, rank up and find out what unlocks.",
    },
  ],
};

export default class HappyFappy extends PrivateSite {
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
}
