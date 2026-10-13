/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/world-torrent.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "worldtorrent",
  name: "World-torrent",
  aka: ["Worldivx", "Darkfox", "Vidlox", "Wikibox", "Sharkibox", "Workino", "Oxtorrent", "Torrent911"],
  description:
    "World-torrent is a FRENCH Public site for MOVIES / TV / GENERAL（法语公开站，同一套代码的多个镜像域名）",
  tags: ["影视", "综合"],

  type: "public",
  urls: [
    "https://ww1.darkfox.run/",
    "https://ww1.vidlox.run/",
    "https://ww1.worldivx.run/",
    "https://ww1.wikibox.run/",
    "https://ww1.sharkibox.run/",
    "https://ww1.workino.run/",
    "https://ww1.oxtorrent.run/",
    "https://ww1.torrent911.run/",
  ],

  search: {
    // 关键词实际拼进 url，此处的 keywordPath 仅作占位，由 requestConfigTransformer 消费后删除
    keywordPath: "params.keywords",
    requestConfig: { url: "/derniers", responseType: "document", params: {} },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      delete requestConfig!.params.keywords;

      if (!keywords) {
        requestConfig!.url = "/derniers";
        return requestConfig!;
      }

      // Jackett: 搜索季包时把 S01 换成 saison 1
      const keyword = keywords.replace(/S0(\d{1,2})$/i, "saison $1").replace(/S(\d{1,3})$/i, "saison $1");
      requestConfig!.url = `/recherche/${encodeURIComponent(keyword)}`;
      return requestConfig!;
    },
    selectors: {
      rows: { selector: 'table.table > tbody > tr:has(a[href^="/detail/"])' },
      title: {
        // 标题 a 内还嵌着剧照/简介的 span，需要剔除后再取文本（对应 Jackett 的 remove: span）
        selector: 'a[href^="/detail/"]',
        elementProcess: (element: Element) => {
          const clone = element.cloneNode(true) as Element;
          clone.querySelectorAll("span").forEach((span) => span.parentNode?.removeChild(span));
          return (clone.textContent ?? "").trim();
        },
      },
      url: { selector: 'a[href^="/detail/"]', attr: "href" },
      category: { selector: "td:nth-child(1)", attr: "title" },
      size: { selector: "td:nth-child(3)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(4)" },
      leechers: { selector: "td:nth-child(5)" },
      completed: { selector: "td:nth-child(6)" },
      time: {
        selector: "td:nth-child(7)",
        filters: [
          // 法语相对时间 -> 英语
          { name: "replace", args: ["heures", "hours"] },
          { name: "replace", args: ["heure", "hour"] },
          { name: "replace", args: ["jours", "days"] },
          { name: "replace", args: ["jour", "day"] },
          { name: "replace", args: ["semaines", "weeks"] },
          { name: "replace", args: ["semaine", "week"] },
          { name: "replace", args: ["mois", "months"] },
          { name: "replace", args: ["ans", "years"] },
          { name: "replace", args: ["an", "year"] },
          { name: "parseFuzzyTime" },
        ],
      },
      // 列表页不含下载链接，link 由 detail.selectors.link 在详情页获取（对应 Jackett 的 download 段）
    },
  },

  detail: {
    urlPattern: ["/detail/\\d+"],
    selectors: {
      link: { selector: 'a[href^="magnet:?"]', attr: "href" },
      // 详情页的字段是 `Titre:` / `Catégories:` / `Poids du fichier:` / `Seeders:` … 这样的表格行，
      // 取每行最后一个 td 即值。标题取标题块里的发布名，与列表页 a[href^="/detail/"] 的文本一致
      title: { selector: "div.block-detail > div.title" },
      // 注意 `Catégories:` 也会命中 `Sous-Catégories:`，这里取文档顺序在前的「一级分类」，与列表页 td[title] 一致
      category: { selector: ["tr:contains('Catégories:') td:last-child"] },
      size: { selector: ["tr:contains('Poids du fichier:') td:last-child"], filters: [{ name: "parseSize" }] },
      seeders: { selector: ["tr:contains('Seeders:') td:last-child"] },
      leechers: { selector: ["tr:contains('Leechers:') td:last-child"] },
      completed: { selector: ["tr:contains('Complétés:') td:last-child"] },
      // 页头给出的绝对日期（法语 dd/MM/yyyy）；列表页用的是相对时间，两者口径不同，这里以页面显示为准
      time: {
        selector: ["span.icon_date"],
        filters: [(q: string) => q.replace(/^\D+/, "").trim(), { name: "parseTime", args: ["dd/MM/yyyy"] }],
      },
    },
  },
};
