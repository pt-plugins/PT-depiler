/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/myspleen.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/myspleen.json
 *
 * MySpleen —— TV / 喜剧 / 动画 / 80-90 年代 VHS 怀旧题材的私有站。
 *
 * 引擎判定：**自研引擎**（非 NexusPHP —— pre-dessert 笼统标 NexusPHP 不准确；Jackett 定义尾部亦注明
 * `# engine tbd`）。判据来自站点真实结构（browse.php 列表 + td.tor-name / td.tor-down /
 * table#main-torrents / td[class^="cat-"] 这组专有类名）与登录页 "MySpleen :: Login"。
 * 因无现成 schema 承载，故按仓库惯例走 AbstractPrivateSite + 本文件自定义 search 选择器。
 *
 * ⚠️ 适配状态：search 的选择器、参数与分类 id 取自 Jackett myspleen.yml（cookie 登录后页面实证）；
 * userInfo 仅补了三源（cardigann / fourbytes / streamx）一致的 Ratio。detail 与其余用户字段、
 * levelRequirements 依赖登录后页面结构，本次匿名调研无法核实，**不做编造**，待有账号实测后再补。
 */
import { type ISiteMetadata } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

// 分类 id → 名称，取自 Jackett categorymappings（站点 browse.php 的 c<id>=1 勾选参数）
const categoryMap: Record<number, string> = {
  31: "Adult Swim",
  30: "Animation",
  25: "Cartoon Network",
  3: "Comedy",
  26: "Comedy Central",
  24: "MST3K",
  28: "MTV",
  29: "Nick",
  20: "Other",
  32: "Star Wars",
  33: "Fan Edits",
  34: "G4techTV",
  35: "Movies",
  36: "Rage",
  37: "Star Trek",
  38: "WOC",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "myspleen",
  name: "MySpleen",
  aka: ["MSP"],
  description: "MySpleen is a Private Torrent Tracker for TV / COMEDY / ANIMATION / 80-90’S VHS NOSTALGIA",
  tags: ["影视", "动漫"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://www.myspleen.org/"],

  category: [
    {
      name: "分类",
      key: "c", // cross append：多选生成 c<id>=1&c<id>=1...（Jackett `$raw: {{ range .Categories }}c{{.}}=1&{{end}}`）
      options: Object.entries(categoryMap).map(([id, name]) => ({ name, value: Number(id) })),
      cross: { mode: "append" }, // 展开为 { c<id>: 1 }，正好匹配站点的 c{id}=1 勾选式参数
    },
  ],

  search: {
    requestConfig: {
      url: "/browse.php",
      params: {
        incldead: 1,
        title: 0,
      },
    },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table#main-torrents > tbody > tr" },
      id: {
        selector: "td.tor-name > a",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "td.tor-name > a", attr: "title" },
      url: { selector: "td.tor-name > a", attr: "href" },
      link: { selector: "td.tor-down > a", attr: "href" },
      category: {
        selector: "td[class^='cat-'] > a",
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }, (catId: string) => categoryMap[Number(catId)] ?? catId],
      },
      size: { selector: "td:nth-child(8)", filters: [{ name: "parseSize" }] },
      time: { selector: "td:nth-child(7)" },
      completed: {
        selector: "td:nth-child(9)",
        filters: [{ name: "parseNumber" }],
      },
      seeders: { selector: "td:nth-child(10)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(11)", filters: [{ name: "parseNumber" }] },
      tags: [
        { name: "Free", selector: "span.star, span.fltime", color: "blue" },
        {
          name: "Free",
          selector: 'li[id="alert-fl"][class*="alert"]:contains("Freeleech ends in ")',
          color: "blue",
        },
      ],
    },
  },

  // detail / levelRequirements：无跨源实证且匿名无法核实详情页与用户等级结构，
  // 待账号实测后再补，此处不编造（沿用 AbstractPrivateSite 默认 detail 行为）。

  // userInfo.ratio 来自 cardigann + fourbytes + streamx 三源一致的 login test / ratio 锚点；
  // 其余用户字段（id/name/uploaded/downloaded/levelName/joinTime）无跨源实证，待账号实测再补，此处不编造。
  userInfo: {
    process: [
      {
        // 登录后 browse.php 顶部渲染一组 span.key + span.value，Ratio 为其一
        requestConfig: { url: "/browse.php", responseType: "document" },
        selectors: {
          ratio: {
            selector: 'span.key:contains("Ratio") + span.value',
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },
};

// 自研引擎无现成 schema 承载；保留空 class 与 schema 名指向 AbstractPrivateSite，
// 后续若需覆写 getDetail/getTorrentDownloadLink 等再在此扩展（对齐 abtorrents / karagarga 惯例）。
export default class MySpleen extends PrivateSite {}
