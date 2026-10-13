/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/xxxclub.yml
 */
import { type ISiteMetadata } from "../types";

// Jackett categorymappings 中的 id -> 描述（列表页 a.catah 的 href 里只有数字 id）
// 注意：AbstractBittorrentSite 会用 tryToNumber 处理 category，字符串中的空格与逗号会被去掉，
// 所以这里用 `/` 而不是空格分隔（"XXX 2160p" 会被吞成 "XXX2160p"）
const categoryMap: Record<string, string> = {
  "0": "XXX/480p/SD",
  "1": "XXX/720p/HD",
  "2": "XXX/1080p/FullHD",
  "3": "XXX/Movies/DVD/WEB",
  "4": "XXX/2160p/UHD/4K",
  "5": "XXX/IMAGESET",
  "6": "XXX/VR",
  "7": "XXX/Pack",
};

const parseCategory = (href: string): string => {
  const id = href.match(/\/(\d+)\/?$/)?.[1] ?? "";
  return categoryMap[id] ?? href;
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "xxxclub",
  name: "XXXClub",
  description:
    "XXXClub is a Public torrent site for 3X（成人向公开站，站点使用 Cloudflare，必要时需配置 FlareSolverr）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://kkkpyho.gb/", "uggcf://kkkpyho.pp/", "uggcf://kkkpyho.zr/"],

  requestDelay: 3000, // Jackett requestDelay: 3（秒），站点对频繁请求有限制

  search: {
    requestConfig: { url: "/torrents/browse/all/", responseType: "document" },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // Jackett: torrents/{{ if .Keywords }}search/all/{{ .Keywords }}{{ else }}browse/all/{{ end }}
      requestConfig!.url = keywords ? `/torrents/search/all/${encodeURIComponent(keywords)}` : "/torrents/browse/all/";
      delete requestConfig!.params.keywords;
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "div.browsetableinside > ul > li:not(:first-child)" },
      category: { selector: "a.catah", attr: "href", filters: [parseCategory] },
      title: { selector: 'a[href^="/torrents/details/"]' },
      url: { selector: 'a[href^="/torrents/details/"]', attr: "href" },
      time: { selector: "span.adde", filters: [{ name: "parseTime", args: ["dd MMM yyyy HH:mm:ss"] }] },
      size: { selector: "span.siz", filters: [{ name: "parseSize" }] },
      seeders: { selector: "span.see" },
      leechers: { selector: "span.lee" },
      // 列表页不含下载链接，link 由 detail.selectors.link 在详情页获取（对应 Jackett 的 download 段）
    },
  },

  detail: {
    urlPattern: ["/torrents/details/"],
    selectors: {
      link: {
        selector: ['a[href^="/torrents/download/"]', 'a[href^="magnet:?xt="]'],
        attr: "href",
      },
      title: { selector: "h1" },
      // 详情页把各项信息放在 <li><span>标签</span><span> : </span><span>值</span></li> 里，
      // 取每个 li 的最后一个 span 就是值
      // 分类复用列表页那套 parseCategory（值同样是 /torrents/browse/<id>/ 链接），保证两边分类字符串一致
      category: {
        selector: ["li:contains('Category') span:last-child a"],
        attr: "href",
        filters: [parseCategory],
      },
      // 日期格式与列表页的 span.adde 相同，沿用同一条 parseTime 格式
      time: {
        selector: ["li:contains('Added Date') span:last-child"],
        filters: [{ name: "parseTime", args: ["dd MMM yyyy HH:mm:ss"] }],
      },
      size: { selector: ["li:contains('Size') span:last-child"], filters: [{ name: "parseSize" }] },
      // 做种/下载用的是与列表页同名的 font.see / font.lee
      seeders: { selector: ["li:contains('Peers') font.see"] },
      leechers: { selector: ["li:contains('Peers') font.lee"] },
      completed: { selector: ["li:contains('Downloads') span:last-child"] },
      author: { selector: ["li:contains('Uploader') span:last-child"] },
    },
  },

  list: [
    {
      urlPattern: ["/torrents/search", "/torrents/browse"],
      selectors: {
        keywords: { selector: 'input[name="q"]', attr: "value" },
      },
    },
  ],
};
