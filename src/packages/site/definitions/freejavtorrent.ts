/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/freejavtorrent.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { ITorrent, type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";

/**
 * 站点没有单独的数字 id：详情页链接（/<slug>.html）在**一部分条目上根本没有数字后缀**
 * （实测搜索页 60 行里有 38 行是纯 slug），所以不能像 Jackett 那样用 `-(\d+).html` 取。
 * 图片文件名前缀才是这颗种子的内部 id —— 中转页给出的 `.torrent` 文件名就是它
 * （`[<本站域名>].3064581.torrent`），且列表页（/mini/）与详情页（/pic/）
 * 用同一个编号，因此拿它当 id 两个入口天然一致。
 */
const parseImageId = (raw: string): string | undefined => /^(\d+)/.exec(String(raw).split("/").pop() ?? "")?.[1];

/**
 * 标题形如 `[4.47 GB] Uta Hayano - ... [1080p]`，Jackett 用 `^.+?\] ` 去掉开头的体积方括号段。
 * 这里写成「只剥离开头那一对方括号」：Jackett 的 `^.+?\] ` 在标题**不以 `[` 开头**时
 * 会一路吃到后面第一个 `] `（把 `[SSIS-984]` 之前的内容整段删掉）——实测搜索页 60 行里
 * 有 45 行、详情页也存在这种没有体积前缀的标题。
 */
const stripLeadingBracket = (raw: string): string =>
  String(raw)
    .trim()
    .replace(/^\[[^\]]*\]\s+/, "");

/**
 * 体积只写在标题最前面的方括号里（`[4.47 GB] ...`）。有的条目没有这一段
 * （实测搜索页 22 行里 7 行没有，列表页确实无处可取）—— Jackett 这种情况硬编码 "5GB"，
 * 这里不抄，取不到就返回 0（未知），不编造数值。
 */
const parseTitleSize = (raw: string): number => {
  const matched = /^\s*\[\s*([\d.]+\s*[KMGT]i?B)\s*\]/i.exec(String(raw));
  return matched ? parseSizeString(matched[1]) : 0;
};

/**
 * 分类名带空格（`Japanese Movies`），但搜索链路收尾时框架会对字符串跑 `tryToNumber`
 * （AbstractBittorrentSite.ts:617 → utils/filter.ts:7-16，其中 `replace(/[, ]/gi, "")`），
 * transformDetailPage 却不跑。为了不让同一颗种子在搜索页拿到 `JapaneseMovies`、
 * 在详情页拿到 `Japanese Movies`，这里两边统一去掉空白。
 */
const normalizeCategory = (raw: string): string => String(raw).trim().replace(/\s+/g, "");

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "freejavtorrent",
  name: "Free JAV Torrent",
  description: "Free JAV Torrent is a Public tracker for Asian 3X (JAV)（公开日本成人影片 BT 站）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://jjj.serrwnigbeerag.pbz/"],

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
      // 与同模板的姊妹站不同：这里 div.catalog 里没有 span.size，体积只在标题开头的方括号里
      size: { selector: "a.overlay", filters: [parseTitleSize] },
      // Jackett 的 caps.categories 就是 div.catalog 里的这些名字（Japanese Movies / ... Packs / Chinese Movies 等）
      category: { selector: "div.catalog a", filters: [normalizeCategory] },
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

  // 详情页 /<slug>.html（slug 可能带也可能不带 `-<数字>` 后缀），服务端渲染、每页一颗种子。
  // 注意 transformDetailPage 不做类型转换（AbstractBittorrentSite.ts:731-769），体积要在 filters 里自己转。
  detail: {
    // 排除 /page/*.html（contact-us 等静态页）与 /catalog/
    urlPattern: ["^https?://[^/]+/(?!page/|catalog/|site/)[^/]+\\.html$"],
    selectors: {
      title: { selector: "h1", filters: [stripLeadingBracket] },
      // 与列表页同一套编号规则：详情页主图在 div.categories 后面的第一张 <img>
      // （不能直接用 `img`，文档里第一张图是页头的语言国旗图标）
      id: { selector: "div.categories + img", attr: "src", filters: [parseImageId] },
      // 详情页同样只有标题开头的方括号里有体积（没有 span.size / span.size-label）
      size: { selector: "h1", filters: [parseTitleSize] },
      category: { selector: "div.categories a", filters: [normalizeCategory] },
      // url 由 transformDetailPage 用 doc.URL 自动补全；link 由 getTorrentDownloadLink 覆写补全
    },
  },
};

export default class FreeJavTorrent extends BittorrentSite {
  /**
   * 站点拿到 .torrent 需要三跳：
   *   1. 详情页（torrent.url）
   *   2. 页内 `a.download-button` → `/dl.php?t=<文章id>`，这是一个返回 HTML 的中转页，不是种子
   *      （注意这个「文章 id」与种子内部 id 不同，列表页也拿不到，所以只能从详情页读）
   *   3. 中转页里的 `a.download-button` 才指向真正的 `.torrent`（在 dl.<域名> 上）
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
