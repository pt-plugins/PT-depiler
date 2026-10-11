/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/torrentkitty.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentkitty",
  name: "TorrentKitty",
  description:
    "TorrentKitty is a Public torrent indexer（公开 BT 索引站，站点使用 Cloudflare，必要时需配置 FlareSolverr）",

  type: "public",
  urls: [
    // 实测仅 .ink 可达，故置于首位；其余为 Jackett 给出的镜像
    "https://www.torrentkitty.ink/",
    "https://www.torrentkitty.cam/",
    "https://www.torrentkitty.io/",
    "https://www.torrentkitty.vip/",
    "https://www.torrentkitty.app/",
    "https://www.torrentkitty.red/",
    "https://www.torrentkitty.lol/",
    "https://www.torrentkitty.best/",
    "https://www.torrentkitty.tv/",
    "https://torkitty.com/",
  ],
  legacyUrls: ["https://www.torrentkitty.se/"],

  search: {
    // 关键词实际拼进 url，此处的 keywordPath 仅作占位，由 requestConfigTransformer 消费后删除
    keywordPath: "params.keywords",
    requestConfig: { url: "/", responseType: "document", params: {} },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      delete requestConfig!.params.keywords;

      // Jackett: search/{{ if .Keywords }}{{ .Keywords }}{{ else }}{{ .Today.Year }}{{ end }}/
      const keyword = keywords || String(new Date().getFullYear());
      requestConfig!.url = `/search/${encodeURIComponent(keyword)}/`;
      return requestConfig!;
    },
    selectors: {
      // 该页面的 table 没有显式 tbody，不能用 `table#archiveResult tbody tr`
      rows: { selector: 'table#archiveResult tr:has(a[href^="magnet:?xt="])' },
      title: { selector: "td.name" },
      url: { selector: "td.action a", attr: "href" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      time: { selector: "td.date", filters: [{ name: "parseTime", args: ["yyyy-MM-dd"] }] },
      // 站点体积为小写（如 "4.19 mb"），parseSize 只认大写单位，需先 toUpper
      size: { selector: "td.size", filters: [{ name: "toUpper" }, { name: "parseSize" }] },
      // Jackett 将 seeders/leechers 硬编码为 1，此处不写以保留「未知」语义
    },
  },

  list: [
    {
      urlPattern: ["/search/"],
      selectors: {
        // 页面标题形如 "Search result for penny "
        keywords: {
          selector: "div.wrapper > h2",
          elementProcess: (element: Element) =>
            (element.textContent ?? "").replace(/^Search result for\s*/i, "").trim(),
        },
      },
    },
  ],

  // 详情页是列表页 action 列指向的 /information/<大写十六进制 infohash>，服务端渲染（实测未被 Cloudflare 拦截）。
  // 不写 id：搜索页没有 id 选择器，框架会回落到 url；这里同样回落到 doc.URL，两处取值才能一致。
  detail: {
    urlPattern: ["/information/[0-9A-Fa-f]+"],
    selectors: {
      // <h2>Details for torrent: Life As We Know It 2010 1080p BluRay x264-SECTOR7</h2>
      // 列表页的标题选择器是 td.name（不带前缀），这里剥掉站点自己加的前缀，两个入口才对同一颗种子给出同一个 title
      title: {
        selector: "div.wrapper > h2",
        filters: [(q: string) => q.replace(/^Details for torrent:\s*/i, "")],
      },
      // "Open with BT Client" 的 href 就是 magnet，与列表页 a[href^="magnet:?xt="] 同值
      link: { selector: 'a[href^="magnet:"]', attr: "href" },
      // "Content Size:" 行，如 "8.01 GB"（列表页是小写 "4.19 mb"，详情页是大写，无需 toUpper）
      size: { selector: 'th:contains("Content Size") + td', filters: [{ name: "parseSize" }] },
      // "Created On:" 行。站点自己给的值就不正常（2026-10 实测：列表页 td.date 是 2069-12-31，详情页是 2070-01-01，
      // 同一颗种子差一天，应为站点两处按不同时区渲染）。这里沿用列表页同样的 parseTime filter 原样解析，不额外修正
      time: {
        selector: 'th:contains("Created On") + td',
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd"] }],
      },
      // 站点不提供做种/下载人数（trackers 表格在 HTML 里被整段注释掉），也没有分类，均留空
    },
  },
};
