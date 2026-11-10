/**
 * Torznab API 引擎基类。
 *
 * Torznab 是 Newznab 的 BT 变体，是 Jackett / Prowlarr 等索引器的通用协议：
 * 搜索返回 `<rss><channel><item>` 的 XML feed，种子字段通过 `<torznab:attr name="..." value="..."/>`
 * 扩展（seeders / leechers / grabs / category / size / magneturl / infohash ...），
 * `t=search&q=...` 检索、`t=caps` 声明能力（limits、分类表、支持的检索参数）。
 *
 * 仓库内真实用户（2026-11-10）：
 *  - magnetz   public，apikey 必填（d3ff5237 起站方关闭 HTML 抓取）；
 *  - pandacd   public，无需 key；
 *  - pornotorrent public（截至 2026-10 被 CF 拦截，未经真机验证）；
 *  - c411      private，**只复用本文件的 torznabCategoryName helper**——它还有 Bearer + JSON 的
 *              userInfo，类仍走 AbstractPrivateSite（单继承链装不下两套引擎能力，故 helper 独立导出）；
 *  - morethantv / anibt / showrss 虽消费 torznab 风格 / RSS feed，但整站由 Luminance 或
 *              自定义 feed 承载（无 t=search 协议语义），不迁移。
 *
 * 站点间差异集中在两处，交给 definition 覆写而不是做成基类配置：
 *  1. 是否需要 apikey —— `userInputSettingMeta` 声明 `apikey` 且 `required` 即可，
 *     本类自动完成「未填写拦截（NoUserInputError）」与「请求时注入 query 参数」；
 *  2. feed 细节 —— rows 是否带 `rss > channel` 前缀、id/url 取 guid / link / comments、
 *     category 取第一个还是最后一个 attr、size 在元素还是 attr 等。
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";

import BittorrentSite from "./AbstractBittorrentSite";
// noinspection ES6PreferShortImport
import { NoUserInputError, type ISearchCategoryOptions, type ISiteMetadata, type TSchemaMetadata } from "../types";

/** 本引擎一定会提供的键；列出来之后消费方读它们不必再写非空断言 */
type TMetadataKeys = "version" | "search";

export const SchemaMetadata: TSchemaMetadata<TMetadataKeys> = {
  version: -1,
  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/api/torznab", // 大多数站点是 /api/torznab；个别路径不同的站点覆写（如 pornotorrent 的 /torznab/）
      responseType: "document", // feed 是 application/xml，axios 会解析为 Document，选择器按 XML 结构写
      params: { t: "search", limit: 100 }, // torznab caps 惯例：limits max=100（pandacd/magnetz/c411 均声明）
    },
    selectors: {
      rows: { selector: "rss > channel > item" },
      // 标准 torznab：<title> 是种子名、<link> 是详情页、<enclosure url> 是下载链接、<pubDate> 是 RFC 822 时间。
      // title 必须由 SchemaMetadata 提供：基类对列表页的 title 没有任何回退（AbstractBittorrentSite.ts:597-608
      // 无选择器就不赋值，:782 的回退只发生在详情页解析），漏掉会让整站搜索结果没有标题。
      title: { selector: "title" },
      // id（guid 形态各异）与 category（数字 id → 名称的映射表站点自有）由 definition 覆写。
      url: { selector: "link" },
      link: { selector: "enclosure", attr: "url" },
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      // Jackett 口径下 size attr 是带单位的字符串（如 "1.86 GB"），基类对 string 型 size 会自动
      // parseSizeString；个别站点给纯字节数（如 pandacd），须自行覆写为 parseNumber（见其注释）。
      size: { selector: "[name=size]", attr: "value" },
      // 数值字段无需 parseNumber：基类 parseWholeTorrentFromRow 会 tryToNumber 归一
      seeders: { selector: "[name=seeders]", attr: "value" },
      leechers: { selector: "[name=leechers]", attr: "value" },
      completed: { selector: "[name=grabs]", attr: "value" },
      // 优惠系数仅 c411 / morethantv 的 feed 真实携带（magnetz 由 Jackett 写死 0/1）；
      // 这两个不走基类的 tryToNumber，需要显式 parseNumber
      downloadVolumeFactor: {
        selector: "[name=downloadvolumefactor]",
        attr: "value",
        filters: [{ name: "parseNumber" }],
      },
      uploadVolumeFactor: { selector: "[name=uploadvolumefactor]", attr: "value", filters: [{ name: "parseNumber" }] },
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

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const apikey = this.apikey;

    // userInputSettingMeta 声明 apikey 必填而用户未填时不发请求，直接给出「需要输入」状态
    const apikeyRequired = this.metadata.userInputSettingMeta?.some((m) => m.name === "apikey" && m.required);
    if (apikeyRequired && !apikey) {
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
    // torznab 的鉴权失败不走 HTML 登录页，而是 401/403 + XML `<error code="100" description="..."/>`
    // （newznab 规范中 100 = Incorrect user parameters，即 key 缺失或无效；magnetz 实测
    // `<error code="100" description="A valid API key is required...">`）。
    // 把它翻译成 NoUserInputError（「需要输入」状态），否则基类只会抛笼统的
    // `Network Error: 401`，调用方无从得知该去填 key。
    if (raw.status === 401 || raw.status === 403) {
      const body = raw.data;
      const bodyText = body instanceof Document ? body.documentElement.outerHTML : typeof body === "string" ? body : "";
      if (/<error\b/i.test(bodyText)) {
        const description = /<error[^>]*\bdescription="([^"]*)"/i.exec(bodyText)?.[1];
        throw new NoUserInputError(`API Key (${description ?? "rejected by site"})`);
      }
    }

    return super.loggedCheck(raw);
  }
}
