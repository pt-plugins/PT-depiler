/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/cgpeers.yml
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/cgpeers.com/config.json
 */
import { type ISiteMetadata, type IElementQuery, type IUserInfo, ETorrentStatus } from "../types";
import Luminance, { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromDict, definedFilters } from "../utils";

const categoryMap: Record<number, string> = {
  17: "3D Printing",
  1: "Applications",
  8: "Audio",
  7: "Game Development",
  5: "Materials",
  6: "Miscellaneous",
  4: "Models",
  2: "Plugins",
  3: "Tutorials",
  9: "Web Development",
};

const linkSelector = { selector: "a[href*='torrent/download/']", attr: "href" };
const idSelector = {
  ...linkSelector,
  filters: [{ name: "split", args: ["/", 3] }, { name: "split", args: ["?", 0] }, { name: "parseNumber" }],
};

// 资料页 Torrents 面板中的「Seeding size」行
const seedingSizeSelector: IElementQuery = {
  selector: "dt:contains('Seeding size') + dd",
  filters: [{ name: "parseSize" }],
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 4,
  id: "cgpeers",
  name: "CGPeers",
  aka: ["CGP"],
  description: "CGPeers 是一个专注于计算机图形资源的私有站点",
  tags: ["设计", "教育", "软件", "学习", "素材"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Luminance", // CGPeers

  urls: ["https://cgpeers.to/"],
  legacyUrls: ["https://www.cgpeers.com/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "appendQuote" },
    },
    {
      name: "优惠",
      key: "filter_freeleech",
      options: [{ name: "Free", value: 1 }],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      ...SchemaMetadata.search!.requestConfig!,
      url: "/torrent/browse",
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      id: idSelector,
      title: { selector: "span + a[href*='torrent/']" },
      url: { selector: "span + a[href*='torrent/']", attr: "href" },
      link: linkSelector,
      category: {
        selector: "td.cats_col > div[title] > a",
        attr: "href",
        filters: [
          (query: string) => {
            const match = query.match(/filter_cat\[(\d+)\]=/);
            if (!match) return "";
            return categoryMap[Number(match[1])];
          },
        ],
      },
      author: { text: "N/A" },
      status: {
        selector: ["a[href*='torrents.php?action=download'] > i"],
        text: ETorrentStatus.unknown,
        case: {
          "i.seeding-torrent": ETorrentStatus.seeding, // 做种!
          "i.leeching-torrent": ETorrentStatus.downloading, // 吸血!
          "i.grabbed-torrent": ETorrentStatus.inactive, // 未完成!
        },
      },
      progress: {
        selector: ["a[href*='torrents.php?action=download'] > i"],
        text: 0,
        case: {
          "i.seeding-torrent": 100,
        },
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    // 改版后站点的上传量、下载量、分享率、积分等信息展示在全局顶栏的用户菜单（div.user-dropdown-menu）中，
    // 任意已登录页面（含 /）均可获取，故第一步只请求首页；等级、入站时间、做种统计等再取资料页（/user/{id}）。
    // 各步骤需要获取的字段由该步骤 selectors 的键决定。
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: {
            selector: ["div.user-dropdown-section a[href^='/user/']", "a.quick-action-btn[href^='/user/']"],
            attr: "href",
            filters: [(query: string) => query.match(/\/user\/(\d+)/)?.[1] ?? ""],
          },
          name: {
            selector: ["a#userDropdownTrigger", "span.user_name"],
            switchFilters: { "span.user_name": [{ name: "split", args: ["\n", 0] }] },
          },
          uploaded: {
            selector: "a.stat-card[href*='/seeding'] span.stat-card-value",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "a.stat-card[href*='/leeching'] span.stat-card-value",
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "a.stat-card[href*='/ratio'] span.stat-card-value",
            filters: [
              (query: string) => {
                if (query === "∞") return -1; // Infinity 不能通过 sendMessage 传递，会导致无返回，使用 -1 替代，前端会自动处理的
                return definedFilters.parseNumber(query.replace(/,/g, ""));
              },
            ],
          },
          bonus: {
            selector: "#header-credits-balance",
            filters: [{ name: "parseNumber" }],
          },
          invites: {
            selector: "a[href*='/invite'] span.link-badge",
            filters: [{ name: "parseNumber" }],
          },
          messageCount: {
            text: 0,
            selector: "a#userDropdownTrigger .user-notification-badge",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        // 改版后的资料页（div.profile-shell）
        requestConfig: { url: "/user/$id$", responseType: "document" },
        assertion: { id: "url" },
        selectors: {
          joinTime: {
            selector: ".profile-hero__since .small:contains('Joined') .time",
            attr: "title",
            filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm"] }],
          },
          lastAccessAt: {
            selector: ".profile-hero__since .small:contains('Last seen') .time",
            attr: "title",
            filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm"] }],
          },
          levelName: { selector: ".userclass-badge" },
          uploads: {
            selector: "dt:contains('Uploads') + dd",
            filters: [{ name: "parseNumber" }],
          },
          seeding: {
            // dd 形如「5 <span title="Of unique snatches">50%</span> <a>view</a>」，
            // 取首个空白分隔片段，避免 50% 被并进数字（parseNumber 会去掉空格）
            selector: "dt:contains('Seeding'):not(:contains('size')) + dd",
            filters: [{ name: "split", args: [" ", 0] }, { name: "parseNumber" }],
          },
          // 该字段由文件末尾的 parseUserInfoForSeedingSize 覆写解析（钩子优先于本步骤的 selector）
          seedingSize: seedingSizeSelector,
          leeching: {
            selector: "dt:contains('Leeching') + dd",
            filters: [{ name: "parseNumber" }],
          },
          snatches: {
            selector: "dt:contains('Snatched') + dd",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },

  detail: {
    ...SchemaMetadata.detail!,
    selectors: {
      ...SchemaMetadata.detail!.selectors,
      title: { selector: "div.page-header h2" },
      id: idSelector,
      link: linkSelector,
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "Member",
      interval: "P4W",
      uploaded: "100GiB",
      ratio: 1,
      privilege: "Access Top 10; Can (anonymously) upload torrents; Can make requests",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P20W",
      uploaded: "500GiB",
      ratio: 2,
      uploads: 5,
      privilege: "Can view advanced site stats.",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P52W",
      uploaded: "2TiB",
      ratio: 4,
      uploads: 50,
      privilege: "Can download multiple torrents at once. Can delete tags. Can view torrent peerlists.",
    },
    {
      id: 5,
      name: "Legend",
      interval: "P260W",
      uploaded: "100TiB",
      ratio: 4,
      uploads: 100,
      privilege: "Can have a personal collage. Can create collages.",
    },
  ],
};

export default class CGPeers extends Luminance {
  // 父类 parseUserInfoForSeedingSize 在资料页取不到做种量时会回落到 Gazelle 的做种列表接口
  // /torrents.php?userid=...，而本站没有该接口（资料页上取到的 0 也会触发回落并导致采集报错），
  // 故这里只按资料页上的「Seeding size」行取值。
  protected override async parseUserInfoForSeedingSize(
    flushUserInfo: Partial<IUserInfo>,
    dataDocument: Document,
  ): Promise<Partial<IUserInfo>> {
    return {
      ...flushUserInfo,
      seedingSize: this.getFieldData(dataDocument, seedingSizeSelector),
    };
  }
}
