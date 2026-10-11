/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/onejav.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "onejav",
  name: "OneJAV",
  description: "OneJAV 是一个公开的日本成人影片（JAV）BT 站（公开站点，无需登录）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://barwni.pbz/"],

  search: {
    // 站点没有查询串形式的搜索接口，关键词是路径的一段：/search/<关键词>，无关键词时是 /new
    requestConfig: { url: "/search/", responseType: "document" },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      requestConfig!.url = keywords ? `/search/${encodeURIComponent(keywords)}` : "/new";
      delete requestConfig!.params;
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "div.mb-3" },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.split("/").pop() ?? q],
      },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href*="/download/"]', attr: "href" },
      // 列表只给出 "2022/08/03" 这一级的日期（在 href 里），按 UTC 当日 00:00 处理；
      // 取不到时回落到 0，避免空串进入 parseTimeWithZone。
      time: {
        selector: "p.is-6 > a",
        attr: "href",
        text: 0,
        filters: [
          (q: string) => {
            const matched = /^\/(\d{4})\/(\d{2})\/(\d{2})$/.exec(String(q).trim());
            return matched ? Date.UTC(+matched[1], +matched[2] - 1, +matched[3]) : 0;
          },
        ],
      },
      size: { selector: "span.is-size-6", filters: [{ name: "parseSize" }] },
      // 站点不提供做种/下载人数（Jackett 在此硬编码 1/1），故留空
      category: { text: "XXX" },
    },
  },

  list: [
    {
      urlPattern: ["/search/", "/new"],
      selectors: {
        keywords: { selector: 'input[name="q"]', attr: "value" },
      },
    },
  ],

  // 详情页 /torrent/<id>，与列表页是同一套 Bulma 模板、服务端渲染。
  // 各字段刻意复用列表页那一套选择器/filter，保证同一颗种子从搜索页与详情页进来得到同一个 id 与同样的值。
  detail: {
    urlPattern: ["/torrent/[\\w-]+"],
    selectors: {
      // 卡片标题里的 /torrent/<id> 链接文本（如 "SSIS960"），与列表页 selectors.title 同源
      title: { selector: 'h5.title.is-4 a[href^="/torrent/"]' },
      // 与列表页 selectors.id 同一套 filter：href 末段就是 id
      id: {
        selector: 'h5.title.is-4 a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.split("/").pop() ?? q],
      },
      // 与列表页 selectors.link 同一个下载按钮（/torrent/<id>/download/<n>/onejav.<id>.torrent）
      link: { selector: 'a[href*="/download/"]', attr: "href" },
      // 详情页只有日级日期（面包屑 "March 8, 2024" → /2024/03/08），与列表页完全相同，站点没有提供更精确的时间，
      // 故沿用列表页的 filter（按 UTC 当日 00:00 处理）
      time: {
        selector: "p.is-6 > a",
        attr: "href",
        text: 0,
        filters: [
          (q: string) => {
            const matched = /^\/(\d{4})\/(\d{2})\/(\d{2})$/.exec(String(q).trim());
            return matched ? Date.UTC(+matched[1], +matched[2] - 1, +matched[3]) : 0;
          },
        ],
      },
      // 标题旁的体积，如 "6.5 GB"；与列表页 selectors.size 同为 span.is-size-6
      size: { selector: "h5.title span.is-size-6", filters: [{ name: "parseSize" }] },
      // 与搜索页保持一致：站点不提供做种/下载人数，分类固定为 XXX
      category: { text: "XXX" },
    },
  },
};
