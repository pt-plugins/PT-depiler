import type { AxiosRequestConfig } from "axios";
import type { ISearchFilter, ISiteMetadata } from "../types";
import Sizzle from "sizzle";
import PrivateSite from "../schema/AbstractPrivateSite";
import { parseSizeString, extractContent } from "../utils";

const categoryMap = [
  "电影DVDRip",
  "电影720p",
  "电影1080i/p",
  "BluRay原盘",
  "影视2160p",
  "UHD原盘",
  "纪录片720p",
  "纪录片1080i/p",
  "纪录片BluRay原盘",
  "欧美剧720p",
  "欧美剧1080i/p",
  "高清日剧",
  "大陆港台剧1080i/p",
  "大陆港台剧720p",
  "高清韩剧",
  "欧美剧包",
  "日剧包",
  "华语剧包",
  "韩剧包",
  "(电影原声&Game)OST",
  "无损音乐FLAC&APE",
  "MV&演唱会",
  "高清体育节目",
  "高清动漫",
  "韩国综艺",
  "高清综艺",
  "日本综艺",
  "MiniVideo",
  "补充音轨",
  "iPhone/iPad视频",
];

export const siteMetadata: ISiteMetadata = {
  name: "ToTheGlory",
  type: "private",
  aka: ["TTG"],
  timezoneOffset: "+0800",
  url: "https://totheglory.im/",
  tags: ["影视", "音乐", "游戏", "综合"],
  category: {
    key: "分类",
    notes: "`影视&音乐` 入口时的分类，错误选择可能导致无法搜索",
    options: categoryMap.map((cat) => {
      return { name: cat, value: cat };
    }),
    cross: { mode: "brackets" }, // 具体处理方式见下
  },
  search: {
    keywordsParam: "search_field",
    requestConfig: {
      url: "/browse.php",
      params: {
        c: "M", // 默认搜索 影视&音乐 板块，除非category覆写
      },
    },
    advanceKeyword: {
      imdb: {
        transformer: (config) => {
          config.params.search_field = config.params.search_field.replace("tt", "IMDB");
          return config;
        },
      }
    },
    categories: [
      {
        name: "Entry",
        key: "c",
        options: [
          { name: "影视&音乐", value: "M" },
          { name: "游戏&软件", value: "G" },
        ],
      },
    ],
    selectors: {
      rows: { selector: "table#torrent_table > tbody > tr[id]" },
      id: { selector: ":self", attr: "id" },
      title: {
        selector: "div.name_left > a > b",
        elementProcess: (e: HTMLElement) => e.innerHTML.split("<br>")[0],
      },
      subTitle: {
        selector: "div.name_left > a > b",
        elementProcess: (e: HTMLElement) => extractContent(e.innerHTML.split("<br>")[1] || ""),
      },
      url: { selector: "div.name_left > a", attr: "href" },
      link: { selector: "a.dl_a", attr: "href" },
      time: { selector: "td:nth-child(5)" },
      size: { selector: "td:nth-child(7)" },
      author: { selector: "td:nth-last-child(1)" },
      category: { selector: "td:nth-child(1) > a > img", attr: "alt" },
      seeders: {
        selector: "td:nth-child(9)",
        filters: [(q: `${number}/${number}`) => q.split("/")[0]],
      },
      leechers: {
        selector: "td:nth-child(9)",
        filters: [(q: `${number}/${number}`) => q.split("/")[1]],
      },
      completed: { selector: "td:nth-child(8)", filters: [parseInt] },
      comments: { text: 0, selector: 'a[href*="tocomm=1"]' },

      tags: [
        { name: "Free", selector: "img[alt='free']" },
        { name: "30%", selector: "img[alt='30%']" },
        { name: "50%", selector: "img[alt='50%']" },
        { name: "Excl.", selector: "span.browse.excl" },
      ],
    },
  },
  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "id" },
        fields: [
          "messageCount",
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime",
          "seeding",
          "seedingSize",
        ],
      },
    ],
    selectors: {
      id: {
        selector: "a[href*='userdetails.php']:first",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: "a[href*='userdetails.php']:first",
      },
      messageCount: {
        selector: "td[style*='background'] > b > a[href*='messages.php'], a[href='#notice']",
        filters: [{ name: "parseNumber" }],
      },
      uploaded: {
        selector: ["td.rowhead:contains('上传量') + td", "td.rowhead:contains('上傳量') + td"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["td.rowhead:contains('下载量') + td", "td.rowhead:contains('下載量') + td"],
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: "td.rowhead:contains('分享率') + td",
        filters: [parseFloat],
      },
      levelName: {
        selector: ["td.rowhead:contains('等级') + td", "td.rowhead:contains('等級') + td"],
      },
      bonus: {
        selector: ["td.rowhead:contains('积分') + td", "td.rowhead:contains('積分') + td"],
        filters: [parseFloat],
      },
      joinTime: {
        selector: ["td.rowhead:contains('注册日期') + td", "td.rowhead:contains('註冊日期') + td"],
        filters: [{ name: "parseTime" }],
      },
      seeding: {
        text: 0,
        selector: "div#ka2",
        elementProcess: (element: HTMLElement) => {
          const trAnothers = Sizzle("tr:not(:eq(0))", element);
          return trAnothers.length;
        },
      },
      seedingSize: {
        text: 0,
        selector: "div#ka2",
        elementProcess: (element: HTMLElement) => {
          let seedingSize = 0;
          const trAnothers = Sizzle("tr:not(:eq(0))", element);
          trAnothers.forEach((trAnother) => {
            const sizeAnother = Sizzle("td:eq(3)", trAnother)[0];
            seedingSize += parseSizeString((sizeAnother as HTMLElement).innerText.trim());
          });
          return seedingSize;
        },
      },
    },
  },
};

export default class totheglory extends PrivateSite {
  protected override async transformSearchFilter(filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const category = filter.extraParams?.find((x) => x.key === "分类");
    if (category) {
      const categoryValue: string[] =
        typeof category.value === "string" ? [category.value] : (category.value as string[]);
      filter.keywords += " " + categoryValue.map((v) => `分类:\`${v}\``).join(" ");
      filter.extraParams?.splice(
        filter.extraParams?.findIndex((x) => x.key === "分类"),
        1
      );
    }
    return super.transformSearchFilter(filter);
  }
}
