const a = {
  version: 1,
  id: "anisource",
  name: "AniSource",
  description:
    "Download anime for free. High quality HD raws from Raws-4U, スカーRaws team (4U-Project) and Leopard-Raws.",
  tags: ["Anime"],
  timezoneOffset: "-0900",
  type: "public",
  urls: ["https://asnet.pw/"],
  category: [
    {
      name: "Category",
      key: "mode",
      options: [
        { name: "All", value: "" },
        { name: "Batches", value: 1 },
        { name: "スカーRaws", value: 2 },
        { name: "Raws-4U", value: 3 },
        { name: "Audio-4U", value: 5 },
        { name: "Leopard-Raws", value: 4 },
        { name: "Other", value: 6 },
      ],
      cross: !1,
    },
  ],
  search: {
    keywordPath: "params.search",
    requestConfig: { url: "/" },
    selectors: {
      rows: { selector: 'div.torrents > div[class^="item"]' },
      id: { selector: ":self", attr: "id", filters: [(e) => e.replace("item_", "")] },
      title: { selector: "span.info > a", attr: "title", filters: [(e) => e.replace(/^Download /, "")] },
      url: { selector: "span.info > a", attr: "href" },
      link: { selector: ":self", attr: "id", filters: [(e) => "magnet:?xt=urn:btih:" + e.replace("item_", "")] },
      time: {
        selector: "span.info > font:last-of-type",
        filters: [
          (e) => {
            const t = e.split(" | ")[0].replace("Date: ", "").split(" ");
            return `${t[0]} ${t[2]} -0900`;
          },
          { name: "parseTime", args: ["yyyy-MM-dd HH:mm XX"] },
        ],
      },
      comments: { text: 0, selector: 'span.stats font:contains("Comments: ") b' },
      category: { selector: "span.category" },
    },
  },
  list: [{ urlPattern: [/pw\/(\?(tpage=\d+|search=.+|mode=\d+))?$/] }],
  detail: {
    urlPattern: ["/showprofile/"],
    selectors: {
      title: { selector: 'font[color="DarkRed"]' },
      link: { selector: 'td:contains("Hash") + td', filters: [{ name: "prepend", args: ["magnet:?xt=urn:btih:"] }] },
    },
  },
};
export { a as siteMetadata };
