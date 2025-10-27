/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/acgrip.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "acgrip",
  name: "ACG.RIP",
  description: "与动漫花园类似的日漫资源站点",

  type: "public",
  urls: ["https://acg.rip/"],

  search: {
    keywordPath: "params.term",
    requestConfig: { url: "/" },
    advanceKeywordParams: { imdb: false },
    selectors: {
      rows: { selector: "table.post-index > tbody > tr" },
      id: {
        selector: "td.title span.title a",
        attr: "href",
        filters: [
          (q: string) => {
            const match = q.match(/(\d+)/);
            return match ? match[0] : null;
          },
        ],
      },
      title: { selector: "td.title span.title a" },
      url: { selector: "td.title span.title a", attr: "href" },
      link: { selector: "td.action a", attr: "href" },
      time: { selector: "td.date time", attr: "datetime" },
      size: { selector: "td.size", filters: [{ name: "parseSize" }] },
      // seeders: { selector: "td:nth-child(5) div.seed" },
      // leechers: { selector: "td:nth-child(5) div.leech" },
      // completed: { selector: "td:nth-child(5) div.done" },
    },
  },

  list: [
    {
      urlPattern: ["/team/", "/user/", "/series/", "/page/", "rip/\\d+$", "/\?term="],
      excludeUrlPattern: ["/t/"],
      mergeSearchSelectors: true,
      selectors: {
        keywords: { selector: 'input[name="term"]', attr: "value" },
      },
    },
  ],

  detail: {
    urlPattern: ["/t/"],
    selectors: {
      title: { selector: "ol.breadcrumb a[href]" },
      link: { selector: "a[href]:contains('下载种子')", attr: "href" },
    },
  },
};
