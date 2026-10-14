/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/byrutor.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * Byrutor 是俄语公共游戏站（DataLife Engine），只有游戏一个分区，不涉及成人内容。
 *
 * - 搜索入口是 DLE 的 `index.php?do=search&subaction=search&story=…`，标题搜索用 `titleonly=3`；
 * - 列表页每行列出的 `search_res` 卡片不含下载链接，`magnet`/`.torrent` 都在详情页的
 *   `a.itemdown_games`（`index.php?do=download&id=…`），因此走 `detail.selectors.link`；
 * - 列表页与详情页都没有“上传/发布时间”（详情页的 `Дата выхода` 是游戏发行年份），
 *   所以不写 `time`，如实留空。
 *
 * Jackett 的 305 条分类映射是站点标签页的全量罗列，PT-depiler 的 `category` 只用于
 * 生成搜索入口，这里不声明（全部标签页本质都是游戏，默认搜索即覆盖），避免抄一大串。
 */
export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "byrutor",
  name: "Byrutor",
  description: "Byrutor 是一个俄语公共游戏 Tracker。",
  tags: ["游戏", "PC"],

  type: "public",

  urls: ["https://byrutgame.org/"],

  legacyUrls: [
    "https://byrutor.org/",
    "https://byrutdb.org/",
    "https://byrut.org/",
    "https://thebyrut.org/",
    "https://byruthub.org/",
  ],

  search: {
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: {
        do: "search",
        subaction: "search",
        search_start: 0,
        full_search: 1,
        result_from: 1,
        showposts: 1,
        titleonly: 3,
        searchdate: 0,
        sortby: "date",
        resorder: "desc",
      },
    },
    keywordPath: "params.story",
    selectors: {
      // 没有体积的行只是“即将发售”的预告，按 Jackett 的做法用第 2 个 chip 过滤掉
      rows: { selector: "a.search_res:has(div.search_res_meta span.search_chip:nth-child(2))" },
      category: { selector: "div.search_res_meta", elementProcess: () => "PC/Games" }, // Jackett YAML: category text 1
      title: {
        selector: "div.search_res_title",
        elementProcess: (element: HTMLElement) => {
          // Jackett 的 title = `<标题> [<年份>] <版本>`，年份/版本在同级 span 里
          const row = element.closest("a.search_res");
          const chips = row ? Array.from(row.querySelectorAll("div.search_res_sub > span")) : [];
          const year = chips[0]?.textContent?.trim() ?? "";
          const ver = chips[1]?.textContent?.trim() ?? "";
          const base = element.textContent?.trim() ?? "";
          return [base, year && `[${year}]`, ver].filter(Boolean).join(" ");
        },
      },
      url: { selector: ":self", attr: "href" },
      id: {
        selector: ":self",
        attr: "href",
        // `/5683-game-of-thrones-….html` -> 5683
        filters: [(href: string) => Number(/\/(\d+)-[^/]*\.html$/.exec(href)?.[1]) || href],
      },
      size: {
        selector: "div.search_res_meta span.search_chip:nth-child(2)",
        filters: [
          { name: "replace", args: ["ТБ", "TB"] },
          { name: "replace", args: ["ГБ", "GB"] },
          { name: "replace", args: ["МБ", "MB"] },
          { name: "replace", args: ["КБ", "KB"] },
        ],
      },
      completed: { selector: "div.search_res_meta span.search_chip:nth-child(1)" },
    },
  },

  list: [{ urlPattern: ["/index.php", "/$"] }],

  detail: {
    urlPattern: ["/\\d+-[^/]+\\.html$"],
    selectors: {
      // 详情页 `a.itemdown_games` 的 download 属性就是发布名（含版本与年份）
      title: { selector: "a.itemtop_games", attr: "download" },
      // 与列表页共用同一套 id 规则（地址末段的 `<id>-<slug>.html`），
      // 否则详情页会回落到整条 URL，同一颗种子会有两个 id
      id: {
        selector: ":self",
        elementProcess: (el: any) => el.URL || "",
        filters: [(href: string) => Number(/\/(\d+)-[^/]*\.html$/.exec(href)?.[1]) || href],
      },
      link: { selector: "a.itemdown_games", attr: "href" },
      size: {
        // `data-size` 实际挂在同页的 `a.itemdown_nottorent1` 上（`a.itemdown_games` 上没有这个属性），
        // 用「首个命中即停」的数组写法同时兼容两种下载按钮
        selector: ["a.itemdown_nottorent1", "a.itemdown_games"],
        attr: "data-size",
        filters: [
          { name: "replace", args: ["ТБ", "TB"] },
          { name: "replace", args: ["ГБ", "GB"] },
          { name: "replace", args: ["МБ", "MB"] },
          { name: "replace", args: ["КБ", "KB"] },
        ],
      },
    },
  },
};
