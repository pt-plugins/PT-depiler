/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/internetarchive.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "internetarchive",
  name: "Internet Archive",
  aka: ["archive.org"],
  description:
    "Internet Archive is a non-profit digital library offering free universal access to books, movies & music（含 Archive BitTorrent 种子）",
  tags: ["综合", "影视", "音乐", "图书"],

  type: "public",
  urls: ["https://archive.org/"],

  category: [
    {
      name: "Media Type",
      key: "mediatype",
      options: [
        { name: "Audio", value: "audio" },
        { name: "Etree (Live Music)", value: "etree" },
        { name: "Movies", value: "movies" },
        { name: "Image", value: "image" },
        { name: "Texts", value: "texts" },
        { name: "Software", value: "software" },
        { name: "Web", value: "web" },
        { name: "Data", value: "data" },
        { name: "Collection", value: "collection" },
      ],
      cross: { mode: "comma" },
    },
  ],

  search: {
    // 关键词不是独立参数，而是拼进 q；这里以 params.q 作占位，防止多出 keywords 参数
    // （archive.org 的接口遇到未支持的参数会直接返回 error）
    keywordPath: "params.q",
    requestConfig: {
      url: "/advancedsearch.php",
      responseType: "json",
      params: {
        "fl[]": "identifier,title,mediatype,item_size,downloads,btih,publicdate",
        "sort[]": "-publicdate",
        rows: 100,
        output: "json",
      },
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      const params = requestConfig!.params!;

      // mediatype 由 category 选择生成，需要折叠进 q（对应 Jackett inputs.q 的 mediatype:(... OR ...)）
      const mediaTypes = String(params.mediatype ?? "")
        .split(",")
        .filter(Boolean);
      delete params.mediatype;

      const queryParts: string[] = [];
      if (keywords) {
        queryParts.push(`title:(${keywords})`);
      }
      queryParts.push('format:("Archive BitTorrent")');
      if (mediaTypes.length > 0) {
        queryParts.push(`mediatype:(${mediaTypes.join(" OR ")})`);
      }

      params.q = queryParts.join(" AND ");
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "response.docs" },
      id: { selector: "identifier" },
      title: { selector: "title", filters: [(q: any) => (Array.isArray(q) ? q[0] : q)] }, // IA 的 title 可能是数组
      url: { selector: "identifier", filters: [(q: string) => `https://archive.org/details/${q}`] },
      link: {
        // btih 存在时用 magnet，缺失时回落到 .torrent（对应 Jackett 的 infohash + download 两个字段）
        selector: ":self",
        filters: [
          (doc: any) =>
            doc?.btih
              ? `magnet:?xt=urn:btih:${doc.btih}`
              : `https://archive.org/download/${doc?.identifier}/${doc?.identifier}_archive.torrent`,
        ],
      },
      time: { selector: "publicdate", filters: [{ name: "parseTime" }] },
      size: { selector: "item_size" },
      completed: { selector: "downloads" },
      category: { selector: "mediatype" },
    },
  },

  /**
   * 详情页 https://archive.org/details/<identifier>：**服务端渲染，静态 HTML 里就有完整元数据，不依赖 JS**
   * （2026-10 实测单页 ~180KB），所以下面这组选择器可以直接在 harness 里验证。依据的真实结构：
   *   <h1 class="item-title"><span class="breaker-breaker" itemprop="name">标题</span></h1>
   *   <dl class="metadata-definition" aria-label="Additional item metadata">
   *     <dt>Addeddate</dt><dd><span itemprop="uploadDate">2026-10-09 08:23:29</span></dd>
   *     <dt>Identifier</dt><dd><span itemprop="identifier"><identifier></span></dd>
   *   </dl>
   *   （audio 类条目的 Addeddate dd 里没有 span，只有纯文本日期；Identifier 的 span 一直都有）
   *   <dt>Item Size</dt><dd>2.5G</dd>
   *   <a class="format-summary download-pill" href="/download/<id>/<id>_archive.torrent">TORRENT</a>
   *   <meta property="mediatype" content="movies">（页面 <head>）
   */
  detail: {
    // /details/<identifier>：搜索结果的 url 也是这个形态（collection 页面同样是 /details/xxx）
    urlPattern: ["/details/[\\w.-]+"],
    selectors: {
      title: { selector: 'h1.item-title span[itemprop="name"]' },
      // Identifier，与搜索页 selectors.id（advancedsearch 的 identifier）一致
      id: { selector: 'span[itemprop="identifier"]' },
      // Archive BitTorrent 的直链（页面里没有 btih，所以这里只能给 .torrent；fixLink 会自动补成绝对地址）
      link: { selector: 'a.download-pill[href$="_archive.torrent"]', attr: "href" },
      // Addeddate 与 metadata API 的 publicdate 是同一个值（UTC 墙上时间，如 "2026-10-09 08:23:29"）；
      // 注意不能用 <time itemprop="uploadDate">（上传者信息区那个只有 "September 3, 2026"、没有时分秒），
      // 也不能用 dd 里的 <span itemprop="uploadDate">（audio 类条目根本没有这层 span，只有纯文本日期）。
      // 这里取 dt+dd 的文本，显式按 UTC 解析，结果与搜索页 publicdate（parseTimeWithZone + "+0000"）一致
      time: {
        selector: "dt:contains('Addeddate') + dd",
        filters: [(q: string) => new Date(`${q.replace(" ", "T")}Z`).getTime()],
      },
      // 站点只显示四舍五入过的 "2.5G" / "435.6M"（省略了 B，且不是精确字节数），补一个 B 再交给 parseSize
      size: {
        selector: "dt:contains('Item Size') + dd",
        filters: [{ name: "replace", args: [/([KMGTPE])$/, "$1B"] }, { name: "parseSize" }],
      },
      // 与搜索页的 category（mediatype）对齐
      category: { selector: 'meta[property="mediatype"]', attr: "content" },
    },
  },
};
