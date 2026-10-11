/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/therarbg.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "therarbg",
  name: "TheRARBG",
  aka: ["RARBG"],
  description: "TheRARBG 是继承 RARBG.to 风格的公开 BT 站点，覆盖电影、剧集、游戏、音乐等",
  tags: ["综合"],

  type: "public",

  urls: ["https://therarbg.to/", "https://therarbg.com/"],
  legacyUrls: [
    "https://t-rb.org/",
    "https://the.rarbg.club/",
    "https://trb.archivebay.online/",
    "https://trb.t-pb.org/",
    "https://trb.themirror.wiki/",
    "https://rarbg.ninjaproxy1.com/",
    "https://rarbg.proxyninja.org/",
    "https://rarbg.torrentbay.st/",
  ],

  category: [
    {
      name: "Category",
      key: "c",
      options: [
        { name: "Movies", value: "Movies" },
        { name: "TV", value: "TV" },
        { name: "Games", value: "Games" },
        { name: "Music", value: "Music" },
        { name: "Anime", value: "Anime" },
        { name: "Documentaries", value: "Documentaries" },
        { name: "Apps", value: "Apps" },
        { name: "Books", value: "Books" },
        { name: "XXX", value: "XXX" },
        { name: "Other", value: "Other" },
      ],
      cross: { mode: "comma" },
    },
  ],

  search: {
    // 关键词实际拼进 URL 路径（见 requestConfigTransformer），这里只是占位
    keywordPath: "params.q",
    requestConfig: {
      url: "/get-posts/order:-a:time:10D:paginate_by:100:format:json/",
      responseType: "json",
      params: {},
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      const params = requestConfig!.params!;

      const categories = String(params.c ?? "")
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean)
        .map((item: string) => `:category:${item}`)
        .join("");

      // Jackett 的 keywordsfilters：非单词字符归一化成空格后 trim
      const keyword = String(keywords ?? "")
        .replace(/\W+/g, " ")
        .trim();

      delete params.c;
      delete params.q;

      requestConfig!.url =
        `/get-posts/order:-a${categories}` +
        (keyword ? `:keywords:${encodeURIComponent(keyword)}` : ":time:10D") +
        ":paginate_by:100:format:json/";

      return requestConfig!;
    },
    selectors: {
      rows: { selector: "results" },
      id: { selector: "pk" },
      title: { selector: "n" },
      // 详情页形如 /post-detail/<pk>/<slug>/，slug 的内容站点不校验、但**必须是一整段**。
      // Jackett（以及本站原先的写法）只把空格换成短横线，标题里含 `/` 时会多出一段路径，
      // 实测那颗种子的 URL 会被 302 回首页；这里把路径分隔符一类的字符一并归一成短横线。
      url: {
        selector: ":self",
        filters: [
          (row: any) =>
            `/post-detail/${row.pk}/${String(row.n ?? "")
              .toLowerCase()
              .replace(/[/\\?#%\s]+/g, "-")}/`,
        ],
      },
      link: { selector: "h", filters: [(hash: string) => `magnet:?xt=urn:btih:${hash}`] },
      time: { selector: "a" },
      size: { selector: "s" },
      seeders: { selector: "se" },
      leechers: { selector: "le" },
      category: { selector: "c" },
    },
  },

  // 详情页 /post-detail/<pk>/<slug>/，是服务端渲染的 HTML（与 JSON 接口无关）。
  // 注意 transformDetailPage 不跑 parseTimeWithZone，所以时间必须在 filters 里显式按 UTC 换算。
  detail: {
    // slug 段可以不填内容，但整段不能省（/post-detail/<pk>/ 会被 302 回首页），故 urlPattern 带上斜杠
    urlPattern: ["/post-detail/[0-9A-Za-z]+/"],
    selectors: {
      // 页面顶部 <h4 class="text-center m-4"> 就是种子名（与接口的 n 字段一致）
      title: { selector: "h4.text-center.m-4" },
      // 与搜索的 id（接口 pk 字段，如 8b1413）一致：详情页把它放在隐藏 input#post-id 的 value 里
      id: { selector: "input#post-id", attr: "value" },
      // "Magnet Download" 按钮 a.btn-download.magnet-btn 的 href 就是 magnet 链接
      link: { selector: "a.magnet-btn", attr: "href" },
      // "Added:" 行形如 "April 21, 2026, 2:26 p.m."，也有缩写的 "Aug. 31, 2026, 12:37 p.m."（月份带点）；
      // 站点按 UTC 渲染（与接口 a 字段的 Unix 秒同值），显式按 UTC 解析
      time: {
        selector: 'th:contains("Added") + td',
        filters: [
          (q: string) => {
            const matched = /([A-Za-z]+)\.? (\d{1,2}), (\d{4}), (\d{1,2}):(\d{2}) ([ap])\.m\./i.exec(q);
            if (!matched) return 0;
            const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(
              matched[1].slice(0, 3).toLowerCase(),
            );
            if (month < 0) return 0;
            const hour = (+matched[4] % 12) + (matched[6].toLowerCase() === "p" ? 12 : 0);
            return Date.UTC(+matched[3], month, +matched[2], hour, +matched[5]);
          },
        ],
      },
      // "Size:" 行，如 "769.4 MB"
      size: { selector: 'th:contains("Size") + td', filters: [{ name: "parseSize" }] },
      // 做种/下载数同在一行："Seeders: 39, Leechers: 23"
      seeders: {
        selector: 'th:contains("Peers") + td',
        filters: [(q: string) => q.match(/Seeders:\s*(\d+)/)?.[1]],
      },
      leechers: {
        selector: 'th:contains("Peers") + td',
        filters: [(q: string) => q.match(/Leechers:\s*(\d+)/)?.[1]],
      },
      // "Category:" 行给出的分类名与接口 c 字段一致（如 TV）
      category: { selector: 'th:contains("Category") + td' },
      // "Uploader:" 行，如 <a href="/get-posts/user:TvTeam/">TvTeam</a>
      author: { selector: 'th:contains("Uploader") + td a' },
      // 站点不提供完成人数，留空
    },
  },
};
