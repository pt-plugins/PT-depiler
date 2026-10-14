/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pornxlab.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { ITorrent, type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";

/**
 * 站点没有单独的数字 id：列表页只有详情页链接（/<slug>-<文章id>.html），
 * 但**图片文件名前缀**才是这颗种子的内部 id —— 详情页的中转页最终给出的
 * `.torrent` 文件名就是它（`[<本站域名>].3313393.torrent`），且列表页（/mini/）
 * 与详情页（/pic/）使用的是同一个编号，所以拿它当 id 两个入口天然一致。
 */
const parseImageId = (raw: string): string | undefined => /^(\d+)/.exec(String(raw).split("/").pop() ?? "")?.[1];

/**
 * 标题形如 `[BrattySis.com] Juniper Ren, ... [21.08.2026, ...]`，Jackett 用 `^.+?\] ` 去掉开头的站点方括号段。
 * 这里写成「只剥离开头那一对方括号」：Jackett 的 `^.+?\] ` 在标题**不以 `[` 开头**时
 * 会一路吃到后面第一个 `] `（把 `[SSIS-984]` 之前的内容整段删掉），实测详情页存在这种标题。
 */
const stripLeadingBracket = (raw: string): string =>
  String(raw)
    .trim()
    .replace(/^\[[^\]]*\]\s+/, "");

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "pornxlab",
  name: "PornXLab",
  description: "PornXLab is a Public tracker for 3X（公开成人向 BT 站，前身为 ptorrents，老域名见 legacyUrls）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://jjj.cbeakyno.pbz/"],
  // Jackett 的 legacylinks：老域名仍在线且是同一套模板
  legacyUrls: ["uggcf://jjj.cgbeeragf.pbz/"],

  search: {
    // 站点自己的搜索框是 GET /s.php?search=<关键词>（input name=search）
    keywordPath: "params.search",
    requestConfig: { url: "/s.php", responseType: "document", params: { search: "" } },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // Jackett: 无关键词时走首页；实测 /s.php?search= 返回空结果页
      if (!keywords) {
        delete requestConfig!.params;
        requestConfig!.url = "/";
      }
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "div.image-container > div.image-wrapper" },
      // 每行只有一张缩略图，编号即种子内部 id（见 parseImageId）
      id: { selector: "img", attr: "src", filters: [parseImageId] },
      title: { selector: "a.overlay", filters: [stripLeadingBracket] },
      url: { selector: "a.overlay", attr: "href" },
      size: { selector: "div.catalog span.size", filters: [parseSizeString] },
      category: { text: "XXX" }, // Jackett 的 caps 只有 XXX 一个分类
      // 列表页没有 .torrent / magnet，下载链接见下方 class 覆写
      // 站点不提供发布时间、做种 / 下载 / 完成人数（Jackett 硬编码 1/1），留空
    },
  },

  list: [
    {
      // 首页 /、/s.php?search= 搜索结果页、/catalog/<分类> 分类页都是同一套 image-wrapper 模板
      urlPattern: ["^https?://[^/]+/(?:[?#].*)?$", "/s\\.php", "/catalog/"],
      // 不声明 keywords：搜索框是静态 HTML 里没有 value 的 input（name=search），
      // 声明了反而会顶掉框架按 params.search 从 URL 查询串回落的逻辑
    },
  ],

  // 详情页 /<slug>-<文章id>.html，服务端渲染、每页一颗种子。
  // 注意 transformDetailPage 不做类型转换（AbstractBittorrentSite.ts:731-769），体积要在 filters 里自己转。
  detail: {
    // 排除 /page/*.html（tracker、allsite、contact-us 等静态页）与 /catalog/、/site/
    urlPattern: ["^https?://[^/]+/(?!page/|catalog/|site/)[^/]+\\.html$"],
    selectors: {
      title: { selector: "h1", filters: [stripLeadingBracket] },
      // 与列表页同一套编号规则：详情页主图在 div.categories 后面的第一张 <img>
      // （不能直接用 `img`，文档里第一张图是页头的语言国旗图标）
      id: { selector: "div.categories + img", attr: "src", filters: [parseImageId] },
      size: { selector: "div.categories span.size-label", filters: [parseSizeString] },
      category: { text: "XXX" },
      // url 由 transformDetailPage 用 doc.URL 自动补全；link 由 getTorrentDownloadLink 覆写补全
    },
  },
};

export default class PornXLab extends BittorrentSite {
  /**
   * 站点拿到 .torrent 需要三跳：
   *   1. 详情页（torrent.url）
   *   2. 页内 `a.download-button` → `/dl.php?t=<文章id>`，这是一个返回 HTML 的中转页，不是种子
   *   3. 中转页里的 `a.download-button` 才指向真正的 `.torrent`（在 dl.<域名> 上）
   * 列表页与详情页本身都没有 .torrent / magnet，所以只能在这里补。
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (!torrent.link && torrent.url) {
      const detailPage = await this.request<Document>({ url: torrent.url, responseType: "document" });
      const relayUrl = this.getFieldData(detailPage.data, {
        selector: "a.download-button",
        attr: "href",
      }) as string;

      if (relayUrl) {
        const relayPage = await this.request<Document>({ url: relayUrl, responseType: "document" });
        torrent.link = this.getFieldData(relayPage.data, {
          selector: "a.download-button",
          attr: "href",
        }) as string;
      }
    }

    // 与基类保持一致（AbstractBittorrentSite.ts:787-790）
    if (this.userConfig.downloadLinkAppendix) {
      torrent.link = `${torrent.link ?? ""}${this.userConfig.downloadLinkAppendix}`;
    }

    return torrent.link!;
  }
}
