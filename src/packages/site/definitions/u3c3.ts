/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/u3c3.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { type ISearchEntryRequestConfig, type ISearchResult, type ISiteMetadata } from "../types";
import { toMerged } from "es-toolkit";

/**
 * 首页会把「当前有效的 search2 令牌」写在一段内联 JS 里，同时**紧挨着还有一行被注释掉的旧令牌**，
 * 所以正则必须从行首匹配真正的赋值，并且要求该变量随后确实被用在 `search2=" + <var>` 上。
 * 实测该令牌会随时间轮换（Jackett 里硬编码的 `eelja3lfe1a1` 已失效，用旧令牌搜索会退化成未过滤的首页列表）。
 */
const searchTokenPattern = /(?:^|\n)\s*(?:var|const|let)\s+(\w+)\s*=\s*"([^"]+)"[\s\S]{0,200}?search2="\s*\+\s*\1/;

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "u3c3",
  name: "U3C3",
  description: "U3C3 is a CHINESE Public tracker focused on 3X Eastern Asian media",
  tags: ["成人", "XXX"],

  type: "public",
  // 全站为成人站，按仓库惯例整站地址写 rot13
  urls: [
    "uggcf://h3p3.pbz/",
    "uggcf://h001.25vzt.pbz/",
    "uggcf://h002.25vzt.pbz/",
    "uggcf://h003.25vzt.pbz/",
    "uggcf://h3p3h3p3.h3p3h3p3h3p3.pbz/",
  ],
  legacyUrls: [
    "uggcf://h3p3.va/",
    "uggcf://n.h3p3.yvsr/",
    "uggcf://z0z0z0z.zazazazaza.pbz/",
    "uggcf://z0z0z1z.zazazazaza.pbz/",
  ],

  timezoneOffset: "+0800", // 站点时间为 CST

  category: [
    {
      name: "分类",
      key: "type",
      options: [
        { name: "國產原创", value: "U3C3" },
        { name: "Video", value: "Video" },
        { name: "Photo", value: "Photo" },
        { name: "Book", value: "Book" },
        { name: "Game", value: "Game" },
        { name: "Software", value: "Software" },
        { name: "Other", value: "Other" },
      ],
      // 站点只有「带上分页参数 p 时」type 过滤才生效；且关键词搜索时 type 会被站点忽略
      generateRequestConfig: (selectedCategories) => ({
        requestConfig: { params: { type: selectedCategories, p: 1 } },
      }),
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: { url: "/", responseType: "document" },
    selectors: {
      // 首页/列表页第一行是 `<tr class="default">` 的置顶公告，没有 /view?id= 链接，靠 :has 排除
      rows: { selector: "table.torrent-list > tbody > tr:has(a[href^='/view?id='])" },
      id: {
        selector: "a[href^='/view?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      // 标题链接的 textContent 里混着分类图标与 IMG 角标，title 属性才是干净的标题
      title: { selector: "a[href^='/view?id=']", attr: "title" },
      url: { selector: "a[href^='/view?id=']", attr: "href" },
      link: { selector: "a[href^='magnet:?xt=']", attr: "href" },
      size: { selector: "td:nth-child(4)", filters: [{ name: "parseSize" }] },
      time: { selector: "td:nth-child(5)" },
      category: { selector: "a[href^='/?type=']", attr: "title" },
    },
  },

  detail: {
    urlPattern: ["/view\\?id=[0-9a-f]+"],
    selectors: {
      title: { selector: "h3.panel-title" },
      link: { selector: "a[href^='magnet:?xt=']", attr: "href" },
      size: { selector: "div.col-md-1:contains('File size') + div.col-md-5", filters: [{ name: "parseSize" }] },
      category: { selector: "div.col-md-1:contains('Category') + div.col-md-5 a" },
      author: { selector: "div.col-md-1:contains('Submitter') + div.col-md-5" },
      // transformDetailPage 不做时区换算，这里按站点时区（+0800）显式转成时间戳
      time: {
        selector: "div.col-md-1:contains('Date') + div.col-md-5",
        filters: [
          (query: string) => {
            const matched = String(query).match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
            return matched
              ? Date.UTC(+matched[1], +matched[2] - 1, +matched[3], +matched[4] - 8, +matched[5], +matched[6])
              : query;
          },
        ],
      },
    },
  },
};

export default class U3C3 extends BittorrentSite {
  private searchToken: string | null = null;

  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    const search2 = await this.getSearchToken();
    return super.getSearchResult(keywords, toMerged(searchEntry, { requestConfig: { params: { search2 } } }));
  }

  private async getSearchToken(): Promise<string> {
    if (this.searchToken) {
      return this.searchToken;
    }

    const { data } = await this.request<string | Document>({ url: "/", responseType: "document" });
    const html = typeof data === "string" ? data : ((data as Document).documentElement?.outerHTML ?? "");
    const matched = searchTokenPattern.exec(html);
    if (!matched) {
      throw Error("U3C3: 未能从首页解析出 search2 令牌");
    }

    this.searchToken = matched[2];
    return this.searchToken;
  }
}
