import Sizzle from "sizzle";
import { toMerged } from "es-toolkit";
import type { AxiosRequestConfig } from "axios";

import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import { EResultParseStatus, ETorrentStatus, type ISiteMetadata, type IUserInfo } from "../types";

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
  urls: ["uggcf://jjj.fxlrl2.pbz/", "uggcf://fxlrlfabj.pbz/"],
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
      ext_anidb: {
        selector: 'span[style="float:right;font-style:italic"] > a[href*="torrents&search=%24"]:nth-child(1)', // 取第一个 anidbid
      },
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
    pickLast: ["id", "name"],
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
            filters: [
              (query: string) => {
                const queryMatch = query.replace(/[\s,]/g, "").match(/上传量.+\/\s*([\d.]+[ZEPTGMK]?i?B)/i);
                return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : query;
              },
              { name: "parseSize" },
            ],
          },
          downloaded: {
            selector: "#psts li:contains('下载量')",
            filters: [
              (query: string) => {
                const queryMatch = query.replace(/[\s,]/g, "").match(/下载量.+\/\s*([\d.]+[ZEPTGMK]?i?B)/i);
                return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : query;
              },
              { name: "parseSize" },
            ],
          },
          levelName: {
            selector: "a[href='home.php?mod=spacecp&ac=usergroup']",
            filters: [(query: string) => query.replace("用户组: ", "").trim()],
          },
          ratio: {
            selector: "ul.bbda",
            filters: [
              (query: string) => {
                const queryMatch = query.match(/分享率\s*([\d.]+)/);
                return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
              },
            ],
          },
          bonus: {
            selector: "#ratio",
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: "#pbbs > li:contains('注册时间')",
            filters: [
              (query: string) => query.replace("注册时间", "").trim(),
              { name: "parseTime", args: ["yyyy-MM-dd HH:mm"] },
            ],
          },
          lastAccessAt: {
            selector: "#pbbs > li:contains('最后访问')",
            filters: [
              (query: string) => query.replace("最后访问", "").trim(),
              { name: "parseTime", args: ["yyyy-MM-dd HH:mm"] },
            ],
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
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);
    if (flushUserInfo.status == EResultParseStatus.success) {
      // Skyeysnow 的 seeding, seedingSize, uploads 需要额外处理
      let seedAndUploadsStatus = { seeding: 0, seedingSize: 0, uploads: 0 } as Required<
        Pick<IUserInfo, "seeding" | "seedingSize" | "uploads">
      >;

      // 遍历 /forum.php?mod=torrents&cat_5up=on&page=<page> 页面，获取 seeding 和 seedingSize
      for (
        const pageInfo = { count: 0, current: 0 }; // 生成页面信息
        pageInfo.current <= pageInfo.count;
        pageInfo.current++
      ) {
        const requestConfig = {
          url: "/forum.php",
          params: { mod: "torrents", cat_5up: "on", page: pageInfo.current },
          responseType: "document",
        } as AxiosRequestConfig;

        const { data: pageDocument } = await this.request<Document>(requestConfig);

        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(pageDocument, {
            selector: ["a[onclick*='page=']:contains('-'):last"],
            attr: "onclick", // javascript:ajax_refreash('/torrents_list_ajax.php?mod=torrents&diy=&page=250',)
            filters: [(query: string) => query.match(/page=(\d+)/)?.[1] ?? 0],
          });
        }

        // 因为这个页面其实是搜索页面，所以我们可以直接使用 search 的解析器来解析
        try {
          const thisPageTorrents = await this.transformSearchPage(pageDocument, {
            searchEntry: this.metadata.search,
            requestConfig,
            keywords: "",
          });
          seedAndUploadsStatus.seeding += thisPageTorrents.length;
          seedAndUploadsStatus.seedingSize += thisPageTorrents.reduce((acc, torrent) => {
            return acc + (torrent.size ?? 0);
          }, 0);
        } catch (e) {
          break; // 这里常见的报错为 NoTorrentsError， 这种情况可以直接跳出循环
        }
      }

      // 通过 /forum.php?mod=torrents&search=#<uid> 获取 uploads
      const { data: uploadsDocument } = await this.request<Document>({
        url: "/forum.php",
        params: { mod: "torrents", search: `#${flushUserInfo.id!}` },
        responseType: "document",
      });
      seedAndUploadsStatus.uploads = this.getFieldData(uploadsDocument, {
        text: 0,
        selector: ["a[onclick*='page=']:contains('-'):last"],
        filters: [(query: string) => parseInt(query.split("-")?.[1] ?? "0")],
      });

      // 合并数据
      flushUserInfo = toMerged(flushUserInfo, seedAndUploadsStatus);
    }

    return flushUserInfo;
  }
}
