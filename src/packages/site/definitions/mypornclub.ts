/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/mypornclub.yml
 */
import { type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";

const RELATIVE_UNITS: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000, // 站点自己按 30 天算
  year: 31536000, // 站点自己按 365 天算
};

/**
 * 列表页与详情页的时间都是站点渲染出来的**相对时间文案**：
 *   `42 seconds ago`、`1 minutes ago`、`5 months ago`（数字为 1 时站点仍写复数）
 *   `Hour ago`（数字为 1 时站点把数字整个省掉）、`Yesterday`、`Last month`
 * 相对时间以「现在」为基准，本身与运行主机时区无关；
 * 不能用 `parseTime`/`parseTimeWithZone`（它们会把文案当绝对时间按某个时区解析）。
 * 解析不出来返回 0，避免 0 以外的脏值进入后续流程。
 */
function parseMyPornClubTime(raw: string): number {
  const text = String(raw).trim().toLowerCase().replace(/\s+/g, " ");

  const normalized = text
    .replace(/^last\s+(second|minute|hour|day|week|month|year)$/, "1 $1 ago")
    .replace(/^yesterday$/, "1 day ago")
    .replace(/^(second|minute|hour|day|week|month|year) ago$/, "1 $1 ago");

  const matched = /^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/.exec(normalized);
  if (!matched) {
    return 0;
  }

  return Date.now() - parseInt(matched[1], 10) * RELATIVE_UNITS[matched[2]] * 1000;
}

/**
 * 标题里被上传者塞进了外链与一大堆 `#tag`（tag 在 HTML 里是 `<i class="hash_link">` 元素），
 * Jackett 用 `remove: i` 去掉它们；这里等价地克隆节点、删掉 `<i>` 再取文本，并压平空白。
 * 搜索页的行与详情页的 `h1` 结构一致，两处共用同一个处理函数，保证同一颗种子拿到同一个标题。
 */
function extractTitle(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll("i.hash_link").forEach((node) => node.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "mypornclub",
  name: "MyPornClub",
  description: "MyPornClub is a Public Torrent Tracker for 3X（公开成人向 BT 站）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://zlcbea.pyho/"],

  search: {
    // 关键词是路径的一段（/s/<关键词>，空格换成 `-`），无关键词时回落 /ts
    requestConfig: { url: "/ts", responseType: "document" },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      delete requestConfig!.params;
      requestConfig!.url = keywords ? `/s/${encodeURIComponent(keywords.trim().replace(/\s+/g, "-"))}` : "/ts";
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "div.torrents_list > div.torrent_element" },
      // /t/<alphaid> 里的一段就是种子 id；行内还有第二个 a[href^="/t/"]（时间链接），
      // 用 div.torrent_element_text_div 限定，避免命中的元素随站点改动而漂移
      id: {
        selector: 'div.torrent_element_text_div a[href^="/t/"]',
        attr: "href",
        filters: [(q: string) => /\/t\/([^/?#]+)/.exec(q)?.[1]],
      },
      title: {
        selector: 'div.torrent_element_text_div a[href^="/t/"] span.torrent_element_text_span',
        elementProcess: extractTitle,
      },
      url: { selector: 'div.torrent_element_text_div a[href^="/t/"]', attr: "href" },
      // 列表页不提供 magnet / .torrent，下载链接由 detail.selectors.link 去详情页取
      time: { selector: "div.torrent_element_info a.linkadd", filters: [parseMyPornClubTime] },
      // 站点渲染的是 "445.42 Mb"（小写 b）；`parseSize` filter 的正则区分大小写、匹配不到，
      // 故直接用 parseSizeString（它的 sizePattern 带 i 标志）
      size: {
        selector: "div.torrent_element_info span.teis:contains('[size]:') + span",
        filters: [parseSizeString],
      },
      // [hits] 就是 Jackett 的 grabs（下载完成次数）
      completed: { selector: "div.torrent_element_info span.teis:contains('[hits]:') + span" },
      seeders: { selector: "div.torrent_element_info span.teiv_seeders" },
      leechers: { selector: "div.torrent_element_info span.teiv_leechers" },
      category: { text: "XXX" }, // 该站只有 3X 内容（Jackett categorymappings 仅 XXX）
      // 站点不提供发布者以外的其它元信息，author 是上传者昵称但行内只在链接文本里，留空
    },
  },

  list: [
    {
      // 列表页有两套入口：/ts... 全站列表、/s/<关键词> 搜索结果，都是同一份 DOM
      urlPattern: ["/ts(/|$)", "/s/"],
      selectors: {
        // 搜索框是 JS 填充的（静态 HTML 里 value 恒为空），关键词只能从路径里取回来；
        // `:self` 在 Document 上下文中就是文档本身，借它读 URL
        keywords: {
          selector: ":self",
          elementProcess: (doc: Document) =>
            decodeURIComponent(/\/s\/([^/?#]+)/.exec(String(doc?.URL ?? ""))?.[1] ?? ""),
        },
      },
    },
  ],

  // 详情页 /t/<alphaid>，服务端渲染，信息比列表页全（infohash、大小、做种、下载、上传时间等）。
  // 注意 transformDetailPage 不做任何类型转换（AbstractBittorrentSite.ts:731-769），
  // 体积/时间必须在这里的 filters 里自己转。
  detail: {
    urlPattern: ["/t/[^/?#]+"],
    selectors: {
      // 与列表页同一个 extractTitle：详情页 h1 里同样塞着 <i class="hash_link"> 标签元素
      title: { selector: "h1", elementProcess: extractTitle },
      // 下载按钮 href 形如 //ct1.<域名>/download.php?uid=...&tid=ff3zGBDo&fn=...，
      // 其中的 tid 与搜索页从 /t/<alphaid> 取到的 id 完全一致
      id: {
        selector: 'a.d_btn[href*="download.php"]',
        attr: "href",
        filters: [(q: string) => /[?&]tid=([^&]+)/.exec(q)?.[1]],
      },
      // 详情页直接给了 magnet（另一个 a.d_btn 是 .torrent 直链，优先 magnet）
      link: { selector: 'a.d_btn[href^="magnet:?xt="]', attr: "href" },
      // "[uploaded]:1 minutes ago"，取冒号后的相对时间文案，与列表页共用解析
      time: {
        selector: "div.torrent_info_div div:contains('[uploaded]')",
        filters: [(q: string) => q.replace(/^.*?:\s*/, ""), parseMyPornClubTime],
      },
      size: { selector: "div.torrent_info_div span.tsize_span", filters: [parseSizeString] },
      seeders: { selector: "div.torrent_info_div span.teiv_seeders" },
      leechers: { selector: "div.torrent_info_div span.teiv_leechers" },
      // "[hits]:0"，与搜索页的 completed 同源
      completed: {
        selector: "div.torrent_info_div div:contains('[hits]')",
        filters: [(q: string) => q.replace(/^.*?:\s*/, "")],
      },
      category: { text: "XXX" },
    },
  },
};
