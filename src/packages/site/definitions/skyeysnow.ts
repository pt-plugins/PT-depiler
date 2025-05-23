import { EResultParseStatus, ETorrentStatus, ISiteMetadata, IUserInfo } from "@ptd/site";
import Sizzle from "sizzle";
import PrivateSite from "@ptd/site/schemas/AbstractPrivateSite.ts";

export const siteMetadata: ISiteMetadata = {
  id: "skyeysnow",
  version: 1,
  name: "SkyeySnow",
  aka: ["天雪"],
  description: "这是一个高清动漫的完全非盈利论坛，高清动漫是一个很小的圈子 论坛方向为DVD/BDRip和BDMV&BDMV用字幕相关。",
  tags: ["动漫"],
  timezoneOffset: "+0800",
  collaborator: ["栽培者", "MewX", "fzlins", "zhuweitung", "Rhilip"],
  type: "private",
  schema: "Discuz", // 后面再看看需要不需要拆分成 schemas
  urls: ["aHR0cHM6Ly93d3cuc2t5ZXkyLmNvbS8=", "aHR0cHM6Ly9za3lleXNub3cuY29tLw=="],
  category: [
    {
      name: "分类",
      key: "category",
      options: [
        { name: "Source:BDMV", value: "11_8" },
        { name: "Source:DVDISO", value: "11_9" },
        { name: "Source:Others", value: "11_10" },
        { name: "Source:Live/演唱会", value: "11_11" },
        { name: "Source:真人周边", value: "11_12" },
        { name: "Rip:BDRip", value: "10_6" },
        { name: "Rip:DVDRip", value: "10_7" },
        { name: "Rip:Others", value: "10_2" },
        { name: "Rip:Live/演唱会", value: "10_3" },
        { name: "Rip:真人周边", value: "10_4" },
        { name: "字幕:BDMV用字幕", value: "16_19" },
        { name: "字幕:BD用简易字幕", value: "16_130" },
        { name: "字幕:BD用链接字幕", value: "16_20" },
        // { name: "字幕:新字幕区", value: "119" },  不支持新字幕区（因为不是 torrent list）
        { name: "音乐:Lossless", value: "15_18" },
        { name: "音乐:Lossy", value: "15_17" },
        { name: "音乐:cd付mv", value: "15_59_47" },
        { name: "音乐:cd付mvrip", value: "15_59_48" },
        { name: "演唱会:RAW", value: "2_11" },
        { name: "演唱会:RAW-RIP", value: "2_3" },
        { name: "演唱会:RAW(真人周边", value: "3_12" },
        { name: "演唱会:RAW-RIP(真人周边)", value: "3_4" },
        { name: "演唱会:RAW(其他)", value: "3_10" },
        { name: "演唱会:RAW-RIP(其他)", value: "3_2" },
      ],
      cross: { mode: "append", key: "cat_" },
    },
  ],
  search: {
    requestConfig: {
      url: "/forum.php",
      params: {
        // 虽然在站点搜索时构造的链接中含有 &formhash= ，但实际后端并不验证该字段
        mod: "torrents",
      },
    },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: false,
      douban: false,
      anidb: {
        requestConfigTransformer: ({ requestConfig }) => {
          if (requestConfig?.params?.search) {
            requestConfig.params.search = "$" + requestConfig.params.search;
          }

          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "table.torrents > tbody > tr:gt(0)" },
      id: {
        selector: 'a[href^="/forum.php?mod=viewthread"]',
        attr: "href",
        filters: [{ name: "querystring", args: ["tid"] }],
      }, // 帖子id
      title: { selector: "td.torrent_title > a[title]", attr: "title" },
      url: { selector: 'a[href^="/forum.php?mod=viewthread"]', attr: "href" },
      link: { selector: 'a[href^="/download.php?id="]', attr: "href" }, // 种子id
      time: {
        selector: " > td:nth-child(3)",
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd\nHH:mm:ss"] }],
      },
      size: { selector: "> td:nth-child(4)", filters: [{ name: "parseSize" }] },
      author: { selector: "> td:nth-last-child(1)" },
      category: { selector: "> td:nth-child(1)" },
      seeders: { selector: " > td:nth-child(5)" },
      leechers: { selector: " > td:nth-child(6)" },
      completed: { selector: " > td:nth-child(7)" },
      comments: { text: "N/A" },
      progress: {
        selector: ["div.tline1, div.tline2"],
        attr: "style",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/width:([ \d.]+)%/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : null;
          },
        ],
      },
      status: {
        selector: ":self",
        elementProcess: (tr: HTMLElement) => {
          const statusAnothers = Sizzle("> td:eq(4), > td:eq(5), > td:eq(6)", tr);
          const statusStyle: (string | null)[] = statusAnothers.map((e) => e.getAttribute("style"));
          if (statusStyle[0]) {
            return ETorrentStatus.seeding;
          } else if (statusStyle[2]) {
            return ETorrentStatus.completed;
          } else if (statusStyle[1]) {
            return ETorrentStatus.downloading;
          } else {
            return ETorrentStatus.unknown;
          }
        },
      },
    },
  },
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: ".vwmy a",
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          name: { selector: ".vwmy a" },
          messageCount: {
            selector: ["a.a.showmenu.new"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/home.php", params: { mod: "space" } },
        assertion: { id: "params.uid" },
        selectors: {
          uploaded: {
            selector: "#psts li:contains('上传量')",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "#psts li:contains('下载量')",
            filters: [{ name: "parseSize" }],
          },
          levelName: {
            selector: "a[href='home.php?mod=spacecp&ac=usergroup']",
            filters: [(query: string) => query.replace("用户组: ", "").trim()],
          },
          bonus: {
            selector: "#ratio",
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: "#pbbs > li:contains('注册时间')",
            filters: [(query: string) => query.replace("注册时间", "").trim(), { name: "parseTime" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Lv.1 白露",
      bonus: 1000,
      privilege: "自定义头衔；允许发短消息；允许加好友；允许设置回帖奖励；允许参与点评；",
    },
    {
      id: 2,
      name: "Lv.2 秋分",
      bonus: 3000,
      privilege: "",
    },
    {
      id: 3,
      name: "Lv.3 霜降",
      bonus: 5000,
      privilege: "",
    },
    {
      id: 4,
      name: "Lv.4 小雪",
      bonus: 10000,
      privilege: "",
    },
    {
      id: 5,
      name: "Lv.5 大雪",
      bonus: 30000,
      privilege: "",
    },
    {
      id: 6,
      name: "Lv.6 小寒",
      bonus: 100000,
      privilege: "",
    },
    {
      id: 7,
      name: "Lv.7 大寒",
      bonus: 300000,
      privilege: "",
    },
    {
      id: 8,
      name: "Lv.8 立春",
      bonus: 1000000,
      privilege: "",
    },
  ],
};

export default class Skyeysnow extends PrivateSite {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const flushUserInfo = await super.getUserInfoResult(lastUserInfo);
    if (flushUserInfo.status == EResultParseStatus.success) {
      //
    }

    return flushUserInfo;
  }
}
