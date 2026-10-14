/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/magnetdownload.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { type ISiteMetadata, type ITorrent } from "../types";

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/**
 * 详情页的 Creation Time 是 `Oct. 13, 2026, 2:22 p.m.`（12 小时制、英文月份）。
 * 站点时间就是 UTC：该页面同时由前端请求 `/api/json_info`，接口里同一颗种子返回
 * `"create_time": "2026-10-13T14:22:11"`，与页面上的 `2:22 p.m.` 完全对得上，故按 UTC 解析。
 */
function parseCreationTime(text: string): number {
  const match = /([A-Za-z]{3})\.?\s+(\d{1,2}),\s*(\d{4}),\s*(\d{1,2}):(\d{2})\s*([ap])\.?m/i.exec(String(text));
  const month = match ? MONTHS[match[1].toLowerCase()] : undefined;
  if (!match || month === undefined) {
    return 0;
  }
  const hour = (+match[4] % 12) + (match[6].toLowerCase() === "p" ? 12 : 0);
  return Date.UTC(+match[3], month, +match[2], hour, +match[5]);
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "magnetdownload",
  name: "MagnetDownload",
  description: "MagnetDownload 是基于 DHT 抓取的公开磁力索引站，按文件名检索磁力链接",
  tags: ["综合"],

  type: "public",
  urls: ["https://www.magnetdownload.com/"],

  search: {
    // 关键词直接拼进路径 `/search/<关键词>/`，由 requestConfigTransformer 组装
    keywordPath: "params.keywords",
    requestConfig: {
      url: "/",
      responseType: "document",
      params: {},
      // ⚠️ 站点极不稳定：`/search/<关键词>/` 单次实测 22s → 40s 不等（首页也要 ~17s），
      // 也多次出现 502/504 或 >60s 无响应。默认 30s 超时基本必失败，这里放宽到 60s；
      // 实测**多次重试里会有成功的一次**（`tr > td.x-item` 命中 10 行），但整体可用性偏低。
      // 若在真实浏览器里始终超时，说明该站不值得收录，可直接删除本文件。
      timeout: 60_000,
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      requestConfig!.url = keywords ? `/search/${encodeURIComponent(keywords)}/` : "/";
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "tr > td.x-item" },
      id: {
        selector: "a.title",
        attr: "href",
        filters: [(href: string) => /\/info\/(\d+)/.exec(String(href))?.[1]],
      },
      // 元素文本里的关键词两侧被插入了 <span class="highlight">，完整文件名只在 title 属性里
      title: { selector: "a.title", attr: "title" },
      url: { selector: "a.title", attr: "href" },
      // 站点只有 「Last access time」（相对时间，如 "17 minutes" / "2 days, 5 hours"），没有绝对时间
      time: { selector: "span.ctime", filters: [{ name: "parseFuzzyTime" }] },
      // `div.tail` 形如 "Files: 1 Total size: 2.2 GB  Total requests: 1 Last access time: 17 minutes"
      size: {
        selector: "div.tail",
        filters: [
          (text: string) => /Total size:\s*([\d.]+\s*[KMGT]?B)/i.exec(String(text))?.[1] ?? "",
          { name: "parseSize" },
        ],
      },
      // DHT 索引站没有分类、做种/下载/完成人数；"Total requests" 是 DHT 请求数，语义上不等于完成数，一并留空
    },
  },

  list: [
    {
      urlPattern: ["/search/"],
      selectors: {
        keywords: { selector: 'input[name="s"]', attr: "value" },
      },
    },
  ],

  // 详情页 /info/<id>：页面上的 magnet 由前端调 `/api/json_info?hashes=<id>` 后填进 href="#"，静态 HTML 取不到，
  // 所以 link 由下面的 getTorrentDownloadLink 覆写来补
  detail: {
    urlPattern: ["/info/\\d+"],
    selectors: {
      // 整页只有详情脚本里这一个地方带条目 id（`var url = '/api/json_info?hashes=' + '25989821';`）
      id: {
        selector: 'script:contains("json_info?hashes=")',
        filters: [(text: string) => /json_info\?hashes='\s*\+\s*'(\d+)'/.exec(String(text))?.[1]],
      },
      title: { selector: "h4" },
      time: { selector: 'th:contains("Creation Time") + td', filters: [parseCreationTime] },
      // 这里只有四舍五入后的体积，精确字节数在 api/json_info 的 length 字段里
      size: { selector: 'th:contains("File Size") + td', filters: [{ name: "parseSize" }] },
    },
  },
};

export default class MagnetDownload extends BittorrentSite {
  /**
   * 该站没有 .torrent 文件，下载链接只能是 magnet，而静态 HTML 里没有 infohash ——
   * 详情页自己也是前端调用 `/api/json_info?hashes=<id>` 拿到 `info_hash` 后再拼 magnet 的，
   * 这里沿用同一个接口。接口返回 `{"result":[{"info_hash":"…","length":…}],"ret":0}`。
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (torrent.link) {
      return torrent.link;
    }

    const { data } = await this.request<{ result?: { info_hash?: string }[] }>({
      url: "/api/json_info",
      params: { hashes: torrent.id },
      responseType: "json",
    });
    const infoHash = data?.result?.[0]?.info_hash ?? "";

    torrent.link = infoHash ? `magnet:?xt=urn:btih:${infoHash}` : torrent.link;
    return torrent.link ?? "";
  }
}
