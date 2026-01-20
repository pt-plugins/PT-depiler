import Sizzle from "sizzle";
import { ISiteMetadata, ITorrent, IUserInfo, IParsedTorrentListPage, ISearchInput } from "../types";
import Gazelle, { SchemaMetadata } from "../schemas/Gazelle.ts";

type boxName = "stats" | "community" | "personal";

const userInfoMap: Record<"en" | "ja", Record<boxName | keyof IUserInfo, string>> = {
  en: {
    stats: "Stats",
    community: "Community",
    personal: "Personal",
    uploaded: "Uploaded",
    downloaded: "Downloaded",
    seeding: "Seeding:",
    bonus: "Bonus Points:",
    levelName: "Class:",
    joinTime: "Joined:",
    lastAccessAt: "Last Seen:",
  },
  ja: {
    stats: "統計情報",
    community: "コミュニティ",
    personal: "個人情報",
    uploaded: "アップロード数",
    seeding: "シード中",
    bonus: "ボーナスポイント",
    levelName: "階級:",
    lastAccessAt: "最後にアクセスした時:",
  },
};

const preTorrentListPageRegex = /torrents?.php.*[?&]id=/;
const preTorrentListPageSelectors = {
  rows: { selector: "tr.group_torrent" },
  id: {
    selector: "a[href*='torrents.php?action=download&id='][title='Download']",
    attr: "href",
    filters: [{ name: "querystring", args: ["id"] }],
  },
  title: {
    selector: ":self",
    elementProcess: (el: HTMLElement) => {
      const bodyElement = el.closest("body");
      if (bodyElement) {
        const titleElement = bodyElement.querySelector("h2");
        return titleElement ? titleElement.textContent?.trim() || "" : "";
      }
      return "";
    },
  },
  subTitle: { selector: ["a[onclick]"], filters: [{ name: "replace", args: ["»", ""] }, { name: "trim" }] },
  link: { selector: ["a[href*='torrents.php?action=download'][title='Download']"], attr: "href" },
  size: { selector: ["td:nth-child(2)"], filters: [{ name: "parseSize" }] },
  seeders: { selector: ["td:nth-child(4)"], filters: [{ name: "parseNumber" }] },
  leechers: { selector: ["td:nth-child(5)"], filters: [{ name: "parseNumber" }] },
  completed: { selector: ["td:nth-child(3)"], filters: [{ name: "parseNumber" }] },
};

function genUserInfoSelector(boxName: boxName, field: keyof IUserInfo): string[] {
  const failBack = userInfoMap.en[field]; // 默认使用英文，这样就可以减小重复字段了
  return Object.values(userInfoMap).map(
    (value) => `div:contains('${value[boxName]}') + ul.stats > li:contains('${value[field] || failBack}')`,
  );
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 2,
  id: "jpopsuki",
  name: "JPopSuki",
  aka: ["JPS", "JPOP"],
  description: "JPopSuki是一个专注于日本音乐的音乐PT站点",
  tags: ["音乐", "日韩"],
  timezoneOffset: "+0000",
  collaborator: ["ronggang", "ted423", "luckiestone", "amorphobia"],
  type: "private",
  schema: "Gazelle",
  urls: ["https://jpopsuki.eu/"],
  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { value: 1, name: "Album" },
        { value: 2, name: "Single" },
        { value: 3, name: "PV" },
        { value: 4, name: "DVD" },
        { value: 5, name: "TV-Music" },
        { value: 6, name: "TV-Variety" },
        { value: 7, name: "TV-Drama" },
        { value: 8, name: "Fansubs" },
        { value: 9, name: "Pictures" },
        { value: 10, name: "Misc" },
      ],
      cross: { mode: "appendQuote" },
    },
  ],

  // FIXME 使用 disablegrouping: 1 参数，可以避免专辑行和单种行的分组
  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      // Apr 01 2025, 15:12
      comments: {
        text: 0,
        selector: 'a[href*="#comments"][title="View Comments"]',
      },
      category: { selector: "> td:eq(1) > a" },

      link: {
        selector: "a[href*='torrents.php?action=download'][title='Download']",
        attr: "href",
      },

      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free", color: "blue" }],
    },
  },

  list: [
    { urlPattern: [preTorrentListPageRegex], selectors: preTorrentListPageSelectors },
    { urlPattern: ["torrents.php"], mergeSearchSelectors: true },
  ],

  noLoginAssert: {
    matchSelectors: ["a[href='login.php']"],
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      uploaded: {
        selector: genUserInfoSelector("stats", "uploaded"),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: genUserInfoSelector("stats", "downloaded"),
        filters: [{ name: "parseSize" }],
      },
      seeding: {
        selector: genUserInfoSelector("community", "seeding"),
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: genUserInfoSelector("personal", "levelName"),
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(Class:|階級:).+?(.+)/);
            return queryMatch && queryMatch.length >= 3 ? queryMatch[2] : "";
          },
        ],
      },
      joinTime: {
        selector: genUserInfoSelector("stats", "joinTime").map((x) => `${x} > span`),
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm"] }],
      },
      lastAccessAt: {
        selector: genUserInfoSelector("stats", "lastAccessAt").map((x) => `${x} > span`),
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMMM dd yyyy, HH:mm"] }],
      },
      uploads: {
        selector: genUserInfoSelector("community", "uploaded"),
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "Can download/upload.",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      downloaded: "1KB",
      privilege:
        "Can use invites, notifications, set a forum signature, access the Top 10 and edit the Knowledge base.",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploaded: "25GB",
      ratio: 1.05,
      downloaded: "1KB",
      uploads: 5,
      privilege:
        "advanced Top 10, can view torrent snatched list, edit torrent's description, " +
        "original title and release date and access the advanced user search. " +
        "Receives a new invite once per month (up to a maximum of 10 available invites).",
    },
  ],
};

export default class Jpopsuki extends Gazelle {
  protected override guessSearchFieldIndexConfig(): Record<string, string[]> {
    return {
      time: ["a[href*='order_by=s3']"], // 发布时间
      size: ["a[href*='order_by=s4']"], // 大小
      seeders: ["a[href*='order_by=s6']"], // 种子数
      leechers: ["a[href*='order_by=s7']"], // 下载数
      completed: ["a[href*='order_by=s5']"], // 完成数
    } as Record<keyof ITorrent, string[]>;
  }

  protected override getTorrentGroupInfo(group: HTMLTableRowElement, searchConfig: ISearchInput): Partial<ITorrent> {
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "comments", "category"]);
  }

  public override async transformListPage(doc: Document): Promise<IParsedTorrentListPage> {
    const parsedListPageUrl = doc.URL || location.href; // 获取当前页面的 URL

    // 单个种子的特殊页面处理
    if (preTorrentListPageRegex.test(parsedListPageUrl)) {
      const retData = { keywords: "", torrents: [] } as IParsedTorrentListPage;
      const searchConfig = {
        searchEntry: { selectors: preTorrentListPageSelectors },
        requestConfig: { url: parsedListPageUrl },
      };

      const trs = Sizzle(preTorrentListPageSelectors.rows.selector, doc);

      for (const tr of trs) {
        try {
          const torrent = (await this.parseWholeTorrentFromRow({}, tr, searchConfig)) as ITorrent;
          torrent.url ??= parsedListPageUrl;
          retData.torrents.push(torrent);
        } catch (e) {
          console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, tr);
        }
      }

      return retData;
    }

    // 其他情况仍交给 super.transformListPage 处理
    return super.transformListPage(doc);
  }
}
