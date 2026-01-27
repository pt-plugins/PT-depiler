import { ISiteMetadata, ITorrent, IUserInfo, ISearchInput } from "../types";
import Gazelle, {
  SchemaMetadata,
  GazelleUtils,
  commonPagesList,
  detailPageList,
  top10PageList,
} from "../schemas/Gazelle.ts";

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

function genUserInfoSelector(boxName: boxName, field: keyof IUserInfo): string[] {
  const failBack = userInfoMap.en[field]; // 默认使用英文，这样就可以减小重复字段了
  return Object.values(userInfoMap).map(
    (value) => `div:contains('${value[boxName]}') + ul.stats > li:contains('${value[field] || failBack}')`,
  );
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 3,
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

  search: {
    ...SchemaMetadata.search!,
    keywordPath: "params.torrentname",
    requestConfig: {
      url: "/ajax.php",
      params: {
        section: "torrents",
        action: "advanced",
        disablegrouping: 1,
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      title: {
        ...SchemaMetadata.search!.selectors!.title!,
        // 有时候不显示 tags...
        elementProcess: GazelleUtils.genTitleElementProcess({
          tdSelector: "td:has(a[href*='torrents.php?id='][title])",
        }),
      },
      // Apr 01 2025, 15:12
      comments: {
        text: 0,
        selector: 'a[href*="#comments"][title="View Comments"]',
      },
      category: { selector: "a[href*='filter_cat']" },

      link: {
        selector: "a[href*='torrents.php?action=download'][title='Download']",
        attr: "href",
      },

      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free", color: "blue" }],
    },
  },

  list: [
    {
      ...commonPagesList,
    },
    {
      ...detailPageList,
      selectors: {
        ...detailPageList.selectors,
        // 从整个页面获取
        keywords: {
          selector: "div > h2",
          // [Album] Ayumi Hamasaki - Rock'n'Roll Circus [2010.04.14]
          elementProcess: (el: HTMLElement) => {
            const clone = el.cloneNode(true) as HTMLElement;
            clone.querySelectorAll("a[href*='artist.php']").forEach((e) => e.remove());
            const query = clone.innerText ?? clone.textContent;
            const endBracket = query.indexOf("]");
            const dash = query.indexOf("-", endBracket);
            return query.slice(dash + 1).trim();
          },
        },
        title: {
          selector: "div > h2",
          filters: [(query: string) => query.slice(query.indexOf("]") + 1)],
        },
        category: {
          selector: "div > h2",
          // 第一个 [...] 对应分类
          filters: [(query: string) => query.match(/\[([^\]]+)\]/)?.[1] || ""],
        },

        time: {
          // <span title="15 years, 8 months, 1 week ago">May 12 2010, 19:08</span>
          selector: "+tr span[title]",
          filters: [{ name: "parseTime" }],
        },
      },
    },
    // Top 10
    {
      ...top10PageList,
      selectors: {
        ...top10PageList.selectors,
        rows: {
          ...top10PageList.selectors!.rows,
          selector: "table.border tr:gt(0)",
        },
        size: { selector: ">td:eq(3)", filters: [{ name: "parseSize" }] },
        completed: { selector: ">td:eq(4)", filters: [{ name: "parseNumber" }] },
        seeders: { selector: ">td:eq(5)", filters: [{ name: "parseNumber" }] },
        leechers: { selector: ">td:eq(6)", filters: [{ name: "parseNumber" }] },
      },
    },
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
    const base = super.guessSearchFieldIndexConfig();
    return {
      time: ["a[href*='order_by=s3']", ...base.time], // 发布时间
      size: ["a[href*='order_by=s4']", "strong:contains('サイズ')", ...base.size], // 大小
      seeders: ["a[href*='order_by=s6']", ...base.seeders], // 做种数
      leechers: ["a[href*='order_by=s7']", ...base.leechers], // 下载数
      completed: ["a[href*='order_by=s5']", ...base.completed], // 完成数
    } as Record<keyof ITorrent, string[]>;
  }

  protected override getTorrentGroupInfo(group: HTMLTableRowElement, searchConfig: ISearchInput): Partial<ITorrent> {
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "comments", "category"]);
  }

  protected override async getUserTorrentList(
    userId: number,
    page: number = 1,
    type: string = "seeding",
  ): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: "/ajax.php",
      params: { section: "torrents", userid: userId, page, type },
      responseType: "document",
    });
    return TListDocument;
  }
}
