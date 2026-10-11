/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/mixtapetorrent.yml
 */
import { type ISiteMetadata } from "../types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * 站点按 PDT（UTC-07:00）显示时间，如 "Jul 5 2008 - 4:11pm"（与 Jackett 追加 " -07:00" 的假定一致）。
 * 这里显式按该偏移换算成 UTC 时间戳，避免 parseTime 依赖运行主机的时区。
 */
const parseMixtapeTime = (query: string): number => {
  const match = String(query).match(/([A-Z][a-z]{2}) (\d{1,2}) (\d{4}) - (\d{1,2}):(\d{2})([ap])m/);
  if (!match) {
    return 0;
  }
  const [, month, day, year, hour, minute, meridiem] = match;
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex < 0) {
    return 0;
  }
  const hour24 = (Number(hour) % 12) + (meridiem === "p" ? 12 : 0);
  return Date.UTC(Number(year), monthIndex, Number(day), hour24 + 7, Number(minute)); // 站点本地时间 + 7h = UTC
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "mixtapetorrent",
  name: "MixtapeTorrent",
  description: "MixtapeTorrent is a Public Music site for MixTapes",
  tags: ["音乐"],

  type: "public",
  urls: ["http://www.mixtapetorrent.com/"], // 站点不支持 https（证书无效），Jackett 亦使用 http

  search: {
    keywordPath: "params.q", // 关键词实际拼进 URL 路径，见 requestConfigTransformer
    requestConfig: { url: "/search/node/", responseType: "document" },
    skipWhiteSpacePlaceholder: true,
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // Jackett: search/node/{{ .Keywords }} type:story（"+" 即空格；站点自身的搜索表单亦用 + 表示空格）
      requestConfig!.url = `/search/node/${encodeURIComponent(keywords ?? "")}+type:story`;
      delete requestConfig!.params!.q;
      return requestConfig!;
    },
    selectors: {
      // 结果由 dt（标题）+ dd（摘要 / 时间）成对组成，merge: 2 把每对包进一个 div
      rows: { selector: "dl.search-results > dt, dl.search-results > dd", merge: 2 },
      title: { selector: "dt > a" },
      url: { selector: "dt > a", attr: "href" }, // Drupal 节点页，下载链接在详情页里
      time: { selector: "p.search-info", filters: [parseMixtapeTime] },
      category: { text: "Audio" }, // 站点全是 mixtape，Jackett 亦固定为 Audio
      // 列表页不提供体积 / 做种数，下载链接需到详情页取（见 detail）
    },
  },

  list: [
    {
      urlPattern: ["/search/node"],
      selectors: {
        keywords: {
          selector: "input#edit-keys",
          attr: "value",
          filters: [(query: string) => query.replace(/\s*type:story\s*$/i, "")], // 去掉站点搜索框里的类型限定
        },
      },
    },
  ],

  detail: {
    urlPattern: ["^https?://www\\.mixtapetorrent\\.com/(?!search|user|node|system)[^/?#]+$"],
    selectors: {
      title: { selector: "h1.title" }, // Drupal 节点标题（<title> 里带站点名后缀，故显式取 h1）
      // 列表页没有写 id，框架会回落到「地址相对路径」（`/dj-drama-…`）；详情页的回落是整条 URL，
      // 两者会不一致，这里显式取 URL 的 pathname 与列表页对齐
      id: {
        selector: ":self",
        elementProcess: (el: any) => {
          try {
            return new URL(el.URL).pathname.replace(/\/+$/, "") || el.URL;
          } catch {
            return el.URL || "";
          }
        },
      },
      // Jackett 的 download.selectors 即详情页里的附件表
      link: { selector: "table#attachments > tbody > tr.odd > td > a", attr: "href" },
    },
  },
};
