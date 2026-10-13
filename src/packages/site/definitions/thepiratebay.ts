/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/thepiratebay.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { type ISearchInput, type ISiteMetadata, type ITorrent } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "thepiratebay",
  name: "The Pirate Bay",
  aka: ["TPB", "海盗湾"],
  description: "The Pirate Bay (TPB) 是最具韧性的公共 BT 索引站，通过 apibay JSON 接口提供搜索",
  tags: ["综合"],

  type: "public",

  urls: [
    "https://thepiratebay.org/",
    "https://thepiratebay.ninjaproxy1.com/",
    "https://tpb.proxyninja.org/",
    "https://thepiratebay.torrentbay.st/",
    "https://thehiddenbay.com/",
    "https://tpb.party/",
    "https://thepiratebay10.xyz/",
  ],
  legacyUrls: [
    "https://tpb.surf/",
    "https://tpb.monster/",
    "https://thepiratebay.host/",
    "https://piratetoday.xyz/",
    "https://tpb.wtf/",
    "https://piratebayproxy.live/",
    "https://pirateproxy.live/",
    "https://ukpiratebay.org/",
    "https://piratebay.by/",
    "https://thepirateproxy.net/",
    "https://pirate-proxy.page/",
    "https://piratehaven.xyz/",
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      // apibay 是 Jackett 默认的 API 域名，也是目前唯一提供 JSON 接口的域名（官网 /apibay/ 路径已失效）
      url: "https://apibay.org/q.php",
      responseType: "json",
      params: { cat: "" },
    },
    skipWhiteSpacePlaceholder: true,
    selectors: {
      // apibay 返回的是**顶层 JSON 数组**，用 `:self` 直接把数组本身作为行集合
      rows: {
        selector: ":self",
        // 无结果时 TPB 会返回 `[{"name":"No results returned", ...}]` 这样的哨兵对象，按 info_hash 过滤掉
        filter: (rows: any[]) => (Array.isArray(rows) ? rows.filter((row) => row?.info_hash) : []),
      },
      id: { selector: "id" },
      title: {
        selector: "name",
        filters: [
          // "xxx -GROUP" -> "xxx-GROUP"
          (title: string) => title.replace(/-\s(\w+-?\w*)$/, "-$1"),
          // Season X / Season X Complete -> S0X；Season XX -> SXX
          (title: string) =>
            title
              .replace(/\bSeason[\s.]+(\d)([\s.]+Complete)?\b/gi, "S0$1")
              .replace(/\bSeason[\s.]+(\d{1,2})([\s.]+Complete)?\b/gi, "S$1"),
        ],
      },
      link: {
        selector: "info_hash",
        filters: [(hash: string) => `magnet:?xt=urn:btih:${hash}`],
      },
      time: { selector: "added", filters: [{ name: "parseNumber" }] },
      size: { selector: "size", filters: [{ name: "parseNumber" }] },
      seeders: { selector: "seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "leechers", filters: [{ name: "parseNumber" }] },
      category: { selector: "category", filters: [{ name: "parseNumber" }] },
      ext_imdb: { selector: "imdb" },
    },
  },

  /**
   * 详情页 https://thepiratebay.org/description.php?id=<id> 的**静态 HTML 里没有任何种子数据**：
   * 页面上的 <label id="name"> / #size / #uld / #s / #l / #d 全是空壳，由站点自己的
   * https://thepiratebay.org/static/main.js 里的 make_details() 同步请求
   * https://apibay.org/t.php?id=<id> 之后逐个 innerHTML 填充（main.js:183-205）。
   * 因此下面这组选择器针对的是「站点 JS 执行完之后」的 DOM，在真实浏览器里才成立：
   *   #name   标题（= t.php 的 name）
   *   #size   "3.4 GiB (3654957056 Bytes)"（print_size(size, 1)）
   *   #uld    <label title="…">2022-05-18</label>（print_date(added)，只有 UTC 日期）
   *   #s / #l 做种 / 下载数
   *   #d #d2  由 print_download2() 生成的磁力链接（同一个 magnet 各一份）
   *   #user   发布者（print_username()，可能带一个 &nbsp; 权限图标）
   * 验证方式见 .research-jackett/detail-reports/batch-c.md：抓真实页面 + 真实 apibay 数据，
   * 在 linkedom 里执行站点自己的 main.js 把 DOM 渲染成浏览器中的样子，再跑 transformDetailPage。
   */
  detail: {
    // 只吃 /description.php?id=<数字>，不要误伤列表页
    urlPattern: ["/description\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: "#name" },
      // 这里**不写 id**：transformDetailPage 会从 url 的 ?id= 兜底解析出 id，
      // 再由下面的 transformDetailPage 覆写统一成数字，与搜索页 selectors.id（apibay 的纯数字 id）一致。
      // 体积取括号里的精确字节数（"3.4 GiB" 是 round_to_precision 之后的结果，不要拿它反推）
      size: { selector: "#size", filters: [(q: string) => Number(q.match(/\((\d+) Bytes\)/)?.[1])] },
      // #uld 只有 UTC 日期（YYYY-MM-DD），显式按 UTC 零点解析，避免依赖运行主机的本地时区
      time: { selector: "#uld", filters: [(q: string) => new Date(`${q}T00:00:00Z`).getTime()] },
      seeders: { selector: "#s" },
      leechers: { selector: "#l" },
      // #d 里除 magnet 外还有一个广告 <a href="http://ikeanangelsaidthe.com/...">，用 href 前缀排除
      link: { selector: "#d a[href^='magnet:']", attr: "href" },
      author: { selector: "#user" },
    },
  },
};

export default class ThePirateBay extends BittorrentSite {
  public override async transformSearchPage(
    doc: Document | object | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const torrents = await super.transformSearchPage(doc, searchConfig);

    // apibay 不返回详情页地址，用站点地址 + 种子 id 拼出 TPB 官方详情页
    const siteUrl = String(this.url).replace(/\/+$/, "");
    return torrents.map((torrent) => ({ ...torrent, url: `${siteUrl}/description.php?id=${torrent.id}` }));
  }

  public override async transformDetailPage(doc: Document): Promise<ITorrent> {
    const torrent = await super.transformDetailPage(doc);

    // 搜索页的 id 是 apibay JSON 里的数字（59191690），详情页的 id 是从 url 的 ?id= 解析出来的字符串
    // （"59191690"）。两者统一成数字，保证同一颗种子从搜索页 / 详情页进来是同一个 id。
    if (torrent.id !== undefined && /^\d+$/.test(String(torrent.id))) {
      torrent.id = Number(torrent.id);
    }

    return torrent;
  }
}
