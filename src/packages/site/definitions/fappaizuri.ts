/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/fappaizuri.yml
 */
import {
  ETorrentStatus,
  EResultParseStatus,
  type ISiteMetadata,
  type IUserInfo,
  type ITorrent,
  NeedLoginError,
} from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";
import { buildCategoryOptionsFromList } from "../utils";

/**
 * Fappaizuri —— 成人向私有 PT 站（HENTAI / JAV / Manga / H-games）
 *
 * 引擎：Jackett 定义末尾标注 `# evolution`（其收录请求 Jackett#14438 的 Tracker details 中
 * 亦写明 "Engine: evolution"），本仓库没有该引擎，故按 aidoruonline 的做法采用自定义
 * schema 名 + 本文件导出的 default class 承载解析逻辑。
 *
 * 站点特征（与 aidoruonline 高度同构，同属 evolution 系）：
 *  - 登录 `account-login.php`（POST username/password，另有隐藏字段 browser_fingerprint）；
 *  - 检索 `torrents-search.php`，分类参数为 `c{id}=1`，另有 incldead/freeleech/lang/sort/order；
 *  - 详情 `torrents-details.php?id=`，下载 `download.php?id=`，用户页 `account-details.php`。
 *
 * ⚠️ 选择器来源说明：本站全站需登录（未登录时 torrents-search.php / index.php 返回空体），
 * 且站点位于 Cloudflare JS 挑战之后（Jackett 标注需 FlareSolverr），本机无法登录核对真实 DOM。
 * 因此下述 search/detail/userInfo 选择器**全部直译自 Jackett 定义**，并由同引擎的 aidoruonline
 * 交叉印证路径形态；未在真实登录态下验证，若站点改版需以实际页面为准。
 *
 * 另：站点有配套的 fappaizuri2fa.yml（启用 2FA 时使用），本定义未覆盖 2FA 流程。
 */
const categoryMap: Record<number, string> = {
  5: "JAV",
  6: "Manga",
  7: "H-games",
  8: "Hentai",
  9: "OFFS",
};

export const siteMetadata: ISiteMetadata = {
  id: "fappaizuri",
  version: 1,
  name: "Fappaizuri",
  description: "Fappaizuri is a Private Torrent Tracker for HENTAI / JAV",
  tags: ["成人", "xxx"],

  type: "private",
  schema: "Fappaizuri",

  // links / legacylinks 取自 Jackett：www 为主域，裸域为旧域
  urls: ["uggcf://jjj.snccnvmhev.zr/"],
  legacyUrls: ["uggcf://snccnvmhev.zr/"],

  category: [
    {
      name: "类别",
      // Jackett inputs.$raw = "&c{{.}}=1&"，即以 c{id}=1 形式追加
      key: "cat",
      options: [
        { name: "JAV", value: "c5" },
        { name: "Manga", value: "c6" },
        { name: "H-games", value: "c7" },
        { name: "Hentai", value: "c8" },
        { name: "OFFS", value: "c9" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = {};
        (selectedOptions as string[]).forEach((value) => {
          params[value] = "1";
        });
        return { requestConfig: { params } };
      },
    },
    {
      name: "语言",
      // Jackett: lang (0 All / 4 Japanese / 5 Chinese / 6 Malaysia / 7 North Korea / 8 English)
      key: "lang",
      options: [
        { name: "All", value: "0" },
        { name: "Japanese", value: "4" },
        { name: "Chinese", value: "5" },
        { name: "Malaysia", value: "6" },
        { name: "North Korea", value: "7" },
        { name: "English", value: "8" },
      ],
    },
    {
      name: "活跃度",
      // Jackett: incldead (0 active / 1 incldead / 2 onlydead)
      key: "incldead",
      options: [
        { name: "仅活种", value: "0" },
        { name: "包括断种", value: "1" },
        { name: "仅断种", value: "2" },
      ],
    },
    {
      name: "免费",
      // Jackett: freeleech (0 all / 1 notfree / 2 onlyfree)
      key: "freeleech",
      options: [
        { name: "全部", value: "0" },
        { name: "非免费", value: "1" },
        { name: "仅免费", value: "2" },
      ],
    },
    {
      name: "排序",
      // Jackett: sort (id/seeders/size/name) + order (desc/asc)
      key: "sort",
      options: buildCategoryOptionsFromList(["id", "seeders", "size", "name"]),
    },
    {
      name: "排序方向",
      key: "order",
      options: buildCategoryOptionsFromList(["desc", "asc"]),
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents-search.php",
      // Jackett inputs 的默认值：incldead=1、freeleech=0、lang=0、sort=id、order=desc
      params: {
        incldead: 1,
        freeleech: 0,
        lang: 0,
        sort: "id",
        order: "desc",
      },
    },
    keywordPath: "params.search",
    selectors: {
      rows: { selector: "tr.t-row" },
      id: {
        selector: ["a[href^='torrents-details.php?id=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: ["a[href^='torrents-details.php?id='] > b"] },
      url: {
        selector: ["a[href^='torrents-details.php?id=']"],
        attr: "href",
      },
      link: {
        selector: ["a[href^='download.php?id=']"],
        attr: "href",
      },
      // Jackett fields.size: td:nth-child(3)
      size: { selector: ["td:nth-child(3)"], filters: [{ name: "parseSize" }] },
      // Jackett fields.seeders: td:nth-child(5)
      seeders: { selector: ["td:nth-child(5)"], filters: [{ name: "parseNumber" }] },
      // Jackett fields.leechers: td:nth-child(6)
      leechers: { selector: ["td:nth-child(6)"], filters: [{ name: "parseNumber" }] },
      // Jackett fields.grabs: td:nth-child(7)
      completed: { selector: ["td:nth-child(7)"], filters: [{ name: "parseNumber" }] },
      // Jackett fields.date: td:nth-child(8) + filters timeago -> 对应本仓库 parseTTL
      time: { selector: ["td:nth-child(8)"], filters: [{ name: "parseTTL" }] },
      category: {
        selector: ["a[href^='torrents-search.php?cat=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }, (query: string) => categoryMap[Number(query)] ?? query],
      },
      author: { selector: ["a[href*='account-details.php?id=']"] },
      // Jackett 的 downloadvolumefactor / uploadvolumefactor 以图片判定
      tags: [
        { name: "Free", selector: "img[src='images/free.png']", color: "blue" },
        { name: "2xUp", selector: "img[src='images/doubleupload.gif']", color: "green" },
      ],
      status: { text: ETorrentStatus.unknown },
    },
  },

  list: [
    {
      urlPattern: ["/(index.php|torrents-search.php)"],
    },
  ],

  detail: {
    urlPattern: ["/torrents-details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: ["a[href^='download.php?id=']"] },
      id: {
        selector: ["a[href^='download.php?id=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      link: { selector: ["a[href^='download.php?id=']"], attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    selectors: {
      id: {
        selector: ["a[href*='account-details.php?id=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: { selector: ["td.prof-lbl:contains('Username:') + td"] },
      uploaded: { selector: ["td.prof-lbl:contains('Uploaded:') + td"], filters: [{ name: "parseSize" }] },
      downloaded: { selector: ["td.prof-lbl:contains('Downloaded:') + td"], filters: [{ name: "parseSize" }] },
      ratio: { selector: ["td.prof-lbl:contains('Ratio:') + td"], filters: [{ name: "parseNumber" }] },
      levelName: { selector: ["td.prof-lbl:contains('User Class:') + td"] },
      joinTime: { selector: ["td.prof-lbl:contains('Joined:') + td"], filters: [{ name: "parseTime" }] },
      bonus: { text: "0" }, // 站点无积分系统
    },
  },

  // Jackett 未给出各等级门槛，故只保留默认等级占位，不编造数值
  levelRequirements: [{ id: 1, name: "User", privilege: "默认等级" }],
};

export default class Fappaizuri extends PrivateSite {
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
      // 站点未登录时各页面返回空体（而非跳转），因此以「是否取到页面标题」判定登录态
      const { data: userDetailDocument } = await this.request<Document>(
        {
          url: "/account-details.php",
          responseType: "document",
        },
        true,
      );

      if (!userDetailDocument || !userDetailDocument.title) {
        throw new NeedLoginError("请求未获取到数据，需要重新登录");
      }

      flushUserInfo = {
        ...flushUserInfo,
        ...(this.getFieldsData(userDetailDocument, this.metadata.userInfo?.selectors!, [
          "name",
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "joinTime",
          "bonus",
        ]) as Partial<IUserInfo>),
      };

      if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (e) {
      flushUserInfo.status = e instanceof NeedLoginError ? EResultParseStatus.needLogin : EResultParseStatus.parseError;
    }

    return flushUserInfo;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    // 列表页已给出 download.php?id= 直链；若拿到的是详情页，则再取一次真实下载链接
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
