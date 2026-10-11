/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/limetorrents.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "limetorrents",
  name: "LimeTorrents",
  description: "LimeTorrents 是一个公共 BT 索引站，以「已验证种子」为主提供全站搜索",
  tags: ["综合"],

  type: "public",

  urls: [
    "https://www.limetorrents.fun/",
    "https://limetorrents.torrentbay.st/",
    "https://limetorrents.torrentsbay.org/",
  ],
  legacyUrls: [
    "https://www.limetorrents.lol/",
    "https://limetorrents.ninjaproxy1.com/",
    "https://limetorrents.proxyninja.org/",
    "https://limetorrents.proxyninja.net/",
    "https://limetorrents.unblockninja.com/",
    "https://limetorrents.mrunblock.bond/",
    "https://limetorrents.nocensor.cloud/",
    "https://limetorrents.abcproxy.org/",
    "https://limetorrents.unblockit.download/",
  ],

  category: [
    {
      name: "排序",
      key: "sort",
      options: [
        { name: "发布时间", value: "date" },
        { name: "做种数", value: "seeds" },
        { name: "体积", value: "size" },
      ],
      cross: false,
    },
  ],

  search: {
    keywordPath: "q", // 关键词放在路径中，实际由 requestConfigTransformer 拼装
    requestConfig: {
      url: "/latest100",
      params: {},
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      const sort = (requestConfig!.params?.sort as string) || "date";
      requestConfig!.url = keywords ? `/search/all/${encodeURIComponent(keywords)}/${sort}/1/` : "/latest100";
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "table.table2 > tbody > tr[bgcolor]" },
      id: {
        selector: 'div.tt-name > a[href^="/"]',
        attr: "href",
        filters: [(href: string) => href.match(/-torrent-(\d+)\.html/)?.[1] ?? href],
      },
      // 列表页的可见标题会被截断成 ".."，完整的标题只存在于详情页链接里（Jackett 同样从 href 还原）
      title: {
        selector: 'div.tt-name > a[href^="/"]',
        attr: "href",
        filters: [
          (href: string) =>
            (href.match(/\/(.+?)-torrent-\d+\.html/)?.[1] ?? href).replace(/-/g, " ").replace(/\s+/g, " ").trim(),
        ],
      },
      url: { selector: 'div.tt-name > a[href^="/"]', attr: "href" },
      // 列表页没有 magnet，只有一个指向 itorrents 的 .torrent 生成站链接（属于「种子生成站」），
      // 因此直接由其 infohash 拼出 magnet
      link: {
        selector: "a.csprite_dl14",
        attr: "href",
        filters: [
          (href: string) => {
            const hash = href.match(/torrent\/([0-9A-Fa-f]{40})\.torrent/)?.[1];
            return hash ? `magnet:?xt=urn:btih:${hash}` : href;
          },
        ],
      },
      time: {
        selector: "td:nth-child(2)",
        filters: [
          { name: "split", args: ["-", 0] }, // "2 days ago - in Music" -> "2 days ago "
          { name: "replace", args: [/\+/g, " ago"] }, // "1 Year+" -> "1 Year ago"
          { name: "replace", args: [/right now/i, "0 minutes ago"] },
          { name: "replace", args: [/today/i, "0 minutes ago"] },
          { name: "replace", args: [/yesterday/i, "1 day ago"] },
          { name: "replace", args: [/last month/i, "1 month ago"] },
          { name: "replace", args: [/last week/i, "1 week ago"] },
          { name: "replace", args: [/last year/i, "1 year ago"] },
          { name: "toLower" }, // 站点混用 "1 Year+" / "2 Months ago" 这类大小写
          { name: "parseFuzzyTime" },
          // 站点偶尔会换文案，解析不出来时置空，避免个别行导致整页搜索失败
          (time: number | string) => (typeof time === "string" ? undefined : time),
        ],
      },
      size: { selector: "td:nth-child(3)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td.tdseed" },
      leechers: { selector: "td.tdleech" },
      category: {
        selector: "td:nth-child(2)",
        filters: [(text: string) => text.match(/\bin\s+(.+?)\.?\s*$/)?.[1]?.trim() || "Other"],
      },
    },
  },

  list: [
    {
      urlPattern: ["/search/all/", "/latest100", "/browse-torrents/"],
      selectors: {
        keywords: { selector: 'input.searchfield[name="q"]', attr: "value" },
      },
    },
  ],

  // 详情页 `/xxx-torrent-<id>.html`（实测 https://www.limetorrents.fun/...-torrent-19999186.html 等）：
  // - 标题是页面 <h1>，列表页的标题被截断成 `..`，只有详情页是完整的；
  // - 做种/下载数在标题下方（`<span class="greenish">Seeders : 14</span>` /
  //   `<span class="reddish">Leechers : 7</span>`），页面下方 trackers 表里也有 greenish/reddish，
  //   故限定 :contains('Seeders') / :contains('Leechers') 以免取到 tracker 的状态文字；
  // - 体积在 `.torrentinfo` 表的「Torrent Size」行（`<td>694.45 MB</td>`）；
  // - 「Torrent Added」是相对时间（`3 days ago    in Music - Music`、`1 Year+    in Applications - Windows`），
  //   与列表页的 `2 days ago - in Music` 只差一个短横线，所以先截掉 ` in <分类>` 再套列表页那套归一化；
  // - 全站不给 .torrent 直链，只有 itorrents 生成站的链接（列表页同样如此），因此由 infohash 拼 magnet；
  // - 正文里唯一的纯数字 id 在「Update trackers info」按钮的 onclick（`torrent_id=19999186`）里，
  //   与列表页从 `-torrent-<id>.html` 取的 id 一致。
  detail: {
    urlPattern: ["-torrent-\\d+\\.html"],
    selectors: {
      title: { selector: "h1" },
      id: {
        selector: "div#updatestatslink a",
        attr: "onclick",
        filters: [(q: string) => q.match(/torrent_id=(\d+)/)?.[1]],
      },
      link: {
        selector: 'a.csprite_dltorrent[href*=".torrent"]',
        attr: "href",
        filters: [
          (href: string) => {
            const hash = href.match(/torrent\/([0-9A-Fa-f]{40})\.torrent/)?.[1];
            return hash ? `magnet:?xt=urn:btih:${hash}` : href;
          },
        ],
      },
      time: {
        selector: "td:contains('Torrent Added') + td",
        filters: [
          (q: string) => String(q ?? "").split(/\s+in\s+/i)[0], // `3 days ago  in Music - Music` -> `3 days ago`
          { name: "replace", args: [/\+/g, " ago"] }, // `1 Year+` -> `1 Year ago`
          { name: "replace", args: [/right now/i, "0 minutes ago"] },
          { name: "replace", args: [/today/i, "0 minutes ago"] },
          { name: "replace", args: [/yesterday/i, "1 day ago"] },
          { name: "replace", args: [/last month/i, "1 month ago"] },
          { name: "replace", args: [/last week/i, "1 week ago"] },
          { name: "replace", args: [/last year/i, "1 year ago"] },
          { name: "toLower" },
          { name: "parseFuzzyTime" },
          (time: number | string) => (typeof time === "string" ? undefined : time),
        ],
      },
      size: { selector: "td:contains('Torrent Size') + td", filters: [{ name: "parseSize" }] },
      seeders: { selector: "span.greenish:contains('Seeders')", filters: [(q: string) => q.match(/(\d+)/)?.[1]] },
      leechers: { selector: "span.reddish:contains('Leechers')", filters: [(q: string) => q.match(/(\d+)/)?.[1]] },
    },
  },
};
