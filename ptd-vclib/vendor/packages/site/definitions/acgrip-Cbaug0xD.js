const r = {
  version: 1,
  id: "acgrip",
  name: "ACG.RIP",
  description: "与动漫花园类似的日漫资源站点",
  type: "public",
  urls: ["https://acg.rip/"],
  search: {
    keywordPath: "params.term",
    requestConfig: { url: "/" },
    advanceKeywordParams: { imdb: !1 },
    selectors: {
      rows: { selector: "table.post-index > tbody > tr" },
      id: {
        selector: "td.title span.title a",
        attr: "href",
        filters: [
          (t) => {
            const e = t.match(/(\d+)/);
            return e ? e[0] : null;
          },
        ],
      },
      title: { selector: "td.title span.title a" },
      url: { selector: "td.title span.title a", attr: "href" },
      link: { selector: "td.action a", attr: "href" },
      time: { selector: "td.date time", attr: "datetime" },
      size: { selector: "td.size", filters: [{ name: "parseSize" }] },
    },
  },
  list: [
    {
      urlPattern: ["/team/", "/user/", "/series/", "/page/", "rip/\\d+$", "/?term="],
      excludeUrlPattern: ["/t/"],
      mergeSearchSelectors: !0,
      selectors: { keywords: { selector: 'input[name="term"]', attr: "value" } },
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
export { r as siteMetadata };
