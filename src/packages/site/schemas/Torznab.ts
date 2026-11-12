/**
 * Torznab API 引擎基类。
 *
 * Torznab 是 Newznab 的 BT 变体，是 Jackett / Prowlarr 等索引器通用的检索协议。
 * 规范（1.3-draft）：https://torznab.github.io/spec-1.3-draft/torznab/Specification-v1.3.html
 * 错误码见规范的外部引用 Newznab Web API「Newznab Error Codes」（100~999 分组）。
 *
 * 本引擎按规范提供：
 *  - `GET /api?t=search&q=…[&apikey=…]` → `<rss><channel><item>` 的 XML feed（utf-8）；
 *  - 标准 RSS 元素（title / guid / link / comments / pubDate / category / enclosure）与
 *    `<torznab:attr name="..." value="..."/>` 扩展属性的默认映射（见 SchemaMetadata 逐条注释）；
 *  - apikey 的「必填拦截 + 请求注入」；
 *  - `<error code="..." description="..."/>` 翻译：**规范里错误响应同样是 HTTP 200**，正文是根级
 *    `<error>`，只看状态码会把「Key 无效」显示成「没有搜索结果」，因此必须解析正文。
 *
 * 仓库内真实用户（2026-11-11）：
 *  - magnetz / pandacd / pornotorrent / tr4ker：`schema: "Torznab"`，整站走本引擎；
 *  - c411：private，**只复用 torznabCategoryName helper**——它还有 Bearer + JSON 的 userInfo，
 *    单继承链装不下两套引擎能力，故 helper 独立导出；
 *  - morethantv / anibt / showrss 虽消费 torznab 风格 feed，但整站由 Luminance 或自定义 feed
 *    承载（无 t=search 协议语义），不迁移。
 *
 * 规范里**本仓库未映射**的部分（ITorrent 无对应字段，需要时由 definition 用 `ext_*` 或覆写承接）：
 *  - `t=caps`：limits / supportedParams / 分类表 / tags 清单。分类表仍以 definition 里手写的
 *    options 为准（取自 `t=caps` 或 Jackett categorymappings），本引擎不运行期探测；
 *  - `offset` 翻页：搜索只取一页（limit=100），前端没有翻页入口；
 *  - `tag`（1.3 新增）、`peers`、`seedtype` / `minimumratio` / `minimumseedtime`、`files` /
 *    `password` / `nfo` / `info` / `year` / `genre` / `video` / `audio` / `resolution` /
 *    `language` / `subs` / `season` / `episode` / `coverurl` 之外的图片字段等。
 *
 * 站点间差异集中在两处，交给 definition 覆写而不是做成基类配置：
 *  1. 是否需要 apikey —— `userInputSettingMeta` 声明 `apikey` 且 `required` 即可，
 *     本类自动完成「未填写拦截（NoUserInputError）」与「请求时注入 query 参数」；
 *  2. feed 实现细节 —— rows 是否带 `rss > channel` 前缀、id/url 取 guid / link / comments、
 *     category 取第一个还是最后一个 attr、size 是纯字节还是带单位字符串（默认两者都吃）等。
 */

import Sizzle from "sizzle";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import BittorrentSite from "./AbstractBittorrentSite";
import { extractInfoHashFromMagnet, parseSizeString } from "../utils";
// noinspection ES6PreferShortImport
import {
  NoUserInputError,
  type ISearchCategoryOptions,
  type ISearchInput,
  type ITorrent,
  type TSchemaMetadata,
} from "../types";

/** 本引擎一定会提供的键；列出来之后消费方读它们不必再写非空断言 */
type TMetadataKeys = "version" | "search";

/**
 * 解析 `<torznab:attr name="size" value="...">`。
 *
 * 规范要求 size 是**纯字节数**（integer），但现实中两种形态都存在：
 *  - 原生 torznab 实现与 Jackett 的多数输出：`"1996488704"`（纯字节，含千分位的也见过）；
 *  - 部分 indexer / Jackett 的 metalink 输出：带单位字符串 `"1.86 GB"`。
 *
 * 基类的兜底只认「string 型走 parseSizeString」，而 `parseSizeString` 的 sizePattern 要求单位，
 * 纯数字（或带千分位的纯数字）会得 0；反过来 parseSize 的正则又要求 B 后缀。
 * 因此这里先按数字形态解析，剩下的交给 parseSizeString，两种口径都能落到字节数。
 */
export function parseTorznabSize(size: string | number): number {
  if (typeof size === "number") {
    return size;
  }

  const raw = String(size ?? "").trim();
  const plain = raw.replace(/[,\s]/g, "");
  if (/^\d+(\.\d+)?$/.test(plain)) {
    return Number(plain);
  }

  // 允许 `1.86G` / `1.86Gi` 这类省略了 B 的写法（规范外，但实际 feed 里出现过）
  return parseSizeString(raw.replace(/([KMGTPE])i?$/i, "$1B"));
}

/** 读取 `<item>` 上某个 `<torznab:attr name="...">` 的 value；不存在时返回空串 */
function readTorznabAttr(item: Element, name: string): string {
  const element = Sizzle(`[name="${name}"]`, item)[0] as Element | undefined;
  return element?.getAttribute("value")?.trim() ?? "";
}

export interface ITorznabApiError {
  code: number;
  description: string;
}

/**
 * 解析 torznab / newznab 的错误响应。
 *
 * 规范（Newznab Web API「Newznab Error Codes」）明确：错误响应同样是 `HTTP 200`，正文是根级
 * `<error code="100" description="Incorrect user credentials"/>`。所以**不能只看状态码**：
 * 只按状态码判断会把「Key 无效」当成「没有搜索结果」（NoTorrentsError）。
 * 这里只在根元素就是 `<error>` 时判定——正常 feed 的 item 里不会出现根级 error。
 */
export function parseTorznabApiError(data: unknown): ITorznabApiError | null {
  let codeText: string | null | undefined;
  let description: string | null | undefined;

  if (data instanceof Document) {
    const root = data.documentElement;
    if (!root || root.tagName?.toLowerCase() !== "error") {
      return null;
    }
    codeText = root.getAttribute("code");
    description = root.getAttribute("description") ?? root.textContent;
  } else if (typeof data === "string") {
    // 允许前置 BOM / xml 声明 / 注释；带命名空间前缀的 `<torznab:error>` 也一并接受
    const matched = /^\uFEFF?\s*(?:<\?xml[^>]*\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<(?:[\w.-]+:)?error\b([^>]*)>/i.exec(data);
    if (!matched) {
      return null;
    }
    codeText = /\bcode\s*=\s*["']([^"']*)["']/i.exec(matched[1])?.[1];
    description = /\bdescription\s*=\s*["']([^"']*)["']/i.exec(matched[1])?.[1];
  }

  const code = parseInt(String(codeText ?? ""), 10);
  if (Number.isNaN(code)) {
    return null;
  }

  return { code, description: `${description ?? ""}`.trim() };
}

/**
 * 把 torznab 错误码翻译成上层能识别的错误：
 *  - 1xx（100 Incorrect user credentials / 101 Account suspended / 102 Insufficient privileges）：
 *    账号或凭据问题 → `NoUserInputError`，界面提示去检查 API Key，而不是笼统的解析错误；
 *  - 其余（2xx 参数与函数、3xx 内容、9xx 未知 / API 停用）：原样抛出，让搜索结果显示站点的
 *    `description`，不再被静默当成「无结果」。
 */
function torznabApiErrorToError(apiError: ITorznabApiError): Error {
  const detail = apiError.description ? `${apiError.code} ${apiError.description}` : `${apiError.code}`;
  if (apiError.code >= 100 && apiError.code < 200) {
    return new NoUserInputError(`API Key (${detail})`);
  }
  return Error(`Torznab API error: ${detail}`);
}

export const SchemaMetadata: TSchemaMetadata<TMetadataKeys> = {
  version: -1,
  search: {
    keywordPath: "params.q",
    requestConfig: {
      // 规范：`GET /api?t={function}`；多数实现挂在 /api/torznab，个别站点路径不同
      // （pornotorrent 的 /torznab/、tr4ker 的 /api/torznab/all），由 definition 覆写。
      url: "/api/torznab",
      // feed 是 application/xml，axios 解析为 Document，选择器按 XML 结构写
      responseType: "document",
      // t=search 是规范要求的检索入口；limit 的上限与默认值由 `t=caps` 的 `<limits max/>` 声明，
      // 仓库内站点（pandacd / magnetz / c411 / tr4ker）的 caps 都是 max=100。
      // 本仓库不做 offset 翻页，一次取一页即可。
      params: { t: "search", limit: 100 },
    },
    selectors: {
      rows: { selector: "rss > channel > item" },
      // 标准 torznab / newznab：<title> 是种子名。
      // title 必须由 SchemaMetadata 提供：基类对列表页的 title 没有任何回退（AbstractBittorrentSite.ts:597-608
      // 无选择器就不赋值，:782 的回退只发生在详情页解析），漏掉会让整站搜索结果没有标题。
      title: { selector: "title" },
      // 详情页 / 下载页按规范区分（Newznab Web API「Important fields of the returned data (RSS)」）：
      //  - <comments> 是详情（评论）页 URL，Jackett 也把 CommentsUrl 写在这里 → 首选；
      //  - <guid> 是「唯一 release guid」，多数实现就是详情页地址；个别站（pornotorrent）是 magnet；
      //  - <link> 按规范是**下载**地址，只作最后兜底（旧版默认值，保持不变以免回退）。
      url: { selector: ["comments", "guid", "link"] },
      // 下载地址：<enclosure url> 是规范指定的种子/NZB 下载入口，Jackett 同时写 <link>；
      // magnet 型 indexer（magnetz 等）只给 `<torznab:attr name="magneturl" value="magnet:...">`。
      // 三者落到同一个元素上时取值方式不同（attr url / 元素文本 / attr value），故用 elementProcess 统一取。
      link: {
        selector: ["enclosure", "link", "[name=magneturl]"],
        elementProcess: (el: Element) => el.getAttribute("url") || el.getAttribute("value") || el.textContent || "",
      },
      // <pubDate> 是 RFC 822/2822（如 "Sun, 06 Jun 2010 17:29:23 +0100"），parseTime 最终由原生 Date 解析。
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      // size 是规范里唯二必填的扩展属性之一（另一个是 category），规范要求纯字节数。
      // 但部分实现给带单位字符串，parseTorznabSize 两种口径都吃（见该函数注释）。
      size: { selector: "[name=size]", attr: "value", filters: [parseTorznabSize] },
      // 数值字段无需 parseNumber：基类 parseWholeTorrentFromRow 会 tryToNumber 归一
      seeders: { selector: "[name=seeders]", attr: "value" },
      leechers: { selector: "[name=leechers]", attr: "value" },
      // grabs = 该 release 被索引器取走的次数，对应 ITorrent.completed
      completed: { selector: "[name=grabs]", attr: "value" },
      // 评论**数量**（integer）。注意不要写成 RSS 的 <comments> 元素——那是详情页 URL，
      // `[name=comments]` 只匹配带 name 属性的扩展属性，两者不会串。
      comments: { selector: "[name=comments]", attr: "value" },
      // torznab 的 poster 是「把 release 上传到 tracker 的用户」，对应 ITorrent.author
      author: { selector: "[name=poster]", attr: "value" },
      // coverurl 是封面图 URL，对应 ITorrent.cover（配合搜索结果封面开关）
      cover: { selector: "[name=coverurl]", attr: "value" },
      // category 是规范必填属性，可能重复出现（子类在前 / 父类在前由实现决定），默认取第一个；
      // 数字 id → 展示名需要站点自己的映射表，由 definition 用 torznabCategoryName 覆写。
      // 部分 feed 没有扩展属性、只有 RSS 的人类可读 <category>，这里一并兜底。
      category: {
        selector: ["[name=category]", "category"],
        elementProcess: (el: Element) => (el.getAttribute("value") ?? el.textContent ?? "").trim(),
      },
      // 优惠系数（规范 1.2）：decimal，0 = 免费；Jackett 多数站点写 0/1。
      // 这两个不走基类的 tryToNumber，需要显式 parseNumber（选择器未命中时不会应用 filters，保持「未知」）。
      downloadVolumeFactor: {
        selector: "[name=downloadvolumefactor]",
        attr: "value",
        filters: [{ name: "parseNumber" }],
      },
      uploadVolumeFactor: { selector: "[name=uploadvolumefactor]", attr: "value", filters: [{ name: "parseNumber" }] },
      // 规范里的 imdb / tvmazeid 扩展属性落到 ext_* 命名空间（ITorrent 无对应字段）。
      // imdb 在 Jackett 里常写作 imdbid，两种都接受；extImdbId 负责补 tt 前缀 / 从 URL 里剥 id。
      ext_imdb: {
        selector: ["[name=imdb]", "[name=imdbid]"],
        attr: "value",
        filters: [{ name: "extImdbId" }],
      },
      ext_tvmaze: { selector: "[name=tvmazeid]", attr: "value" },
      // 其余 spec 属性（tvdbid / season / episode / genre / subs / ...）默认没映射：
      // ITorrent 没有对应字段，且 ext_tvdb 之类不在前端 social 站点列表里，需要的站点自行声明。
    },
  },
};

/**
 * torznab `<torznab:attr name="category" value="...">` 的 value → 展示名映射闭包。
 * 同一 item 可能出现多个 category attr（先子类后父类或反之），取第一个还是最后一个
 * 由选择器侧（`[name=category]` / `[name=category]:last`）决定，这里只做 value → name。
 * 未收录的 value 退回 fallback，未提供 fallback 时原样透出。
 */
export function torznabCategoryName(categories: ISearchCategoryOptions[], fallback?: string) {
  return (value: string | number): string =>
    categories.find((item) => `${item.value}` === `${value}`)?.name ?? fallback ?? `${value}`;
}

export default class TorznabSite extends BittorrentSite {
  /** 用户在站点设置里填写的 API Key；未声明 userInputSettingMeta.apikey 的站点恒为 undefined */
  protected get apikey(): string | undefined {
    return this.userConfig.inputSetting?.apikey?.trim() || undefined;
  }

  /** 站点是否声明了必填的 apikey（规范：apikey「may be mandatory depending on the indexer」） */
  protected get apikeyRequired(): boolean {
    return !!this.metadata.userInputSettingMeta?.some((m) => m.name === "apikey" && m.required);
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const apikey = this.apikey;

    // userInputSettingMeta 声明 apikey 必填而用户未填时不发请求，直接给出「需要输入」状态
    if (this.apikeyRequired && !apikey) {
      throw new NoUserInputError("API Key");
    }

    // 标准 torznab 的 key 走 query 参数（?apikey=，与 Jackett 一致）；
    // 需要 Bearer 等特殊形式的站点（如 c411 的 userInfo）自行覆写本方法
    if (apikey) {
      axiosConfig.params = { ...(axiosConfig.params ?? {}), apikey };
    }

    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override loggedCheck(raw: AxiosResponse): boolean {
    // 规范：错误响应也是 HTTP 200 + 根级 <error code="..." description="...">，
    // 所以先解析正文再看状态码（magnetz 实测 401 + <error code="100" description="A valid API key is required...">）。
    const apiError = parseTorznabApiError(raw.data);
    if (apiError) {
      throw torznabApiErrorToError(apiError);
    }

    // 401/403 但正文不是规范的 <error>（反代默认页 / 精简实现）：声明了必填 apikey 时同样
    // 按「需要输入」处理，否则基类只会抛笼统的 `Network Error: 401`，用户不知道该去填 key。
    if ((raw.status === 401 || raw.status === 403) && this.apikeyRequired) {
      throw new NoUserInputError("API Key");
    }

    return super.loggedCheck(raw);
  }

  protected override fixParsedTorrent(
    torrent: ITorrent,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): ITorrent {
    // infohash 是规范的**可选**扩展属性：缺失时从 magneturl / 下载链接里的 magnet 反推，
    // 这样「只给 magnet 不给 infohash」的 indexer 也能拿到 infoHash（供 magnet 拼装 / 去重）。
    if (!torrent.infoHash && row instanceof Element) {
      const infoHash =
        readTorznabAttr(row, "infohash") ||
        extractInfoHashFromMagnet(readTorznabAttr(row, "magneturl") || `${torrent.link ?? ""}`);
      if (infoHash) {
        torrent.infoHash = infoHash;
      }
    }

    // 规范要求小写十六进制；pandacd 实测给的是大写（FEC3FA4A...），统一归一。
    if (torrent.infoHash) {
      torrent.infoHash = `${torrent.infoHash}`.trim().toLowerCase();
    }

    return torrent;
  }
}
