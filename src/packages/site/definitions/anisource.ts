/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/anisource.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
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
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: { url: "/" },
    selectors: {
      rows: { selector: 'div.torrents > div[class^="item"]' },
      id: {
        selector: ":self",
        attr: "id",
        filters: [(q: string) => q.replace("item_", "")],
      },
      title: {
        selector: "span.info > a",
        attr: "title",
        filters: [(q: string) => q.replace(/^Download /, "")],
      },
      url: { selector: "span.info > a", attr: "href" },
      link: {
        selector: ":self",
        attr: "id",
        filters: [(q: string) => "magnet:?xt=urn:btih:" + q.replace("item_", "")],
      },
      time: {
        selector: "span.info > font:last-of-type",
        filters: [
          (q: string) => {
            // 2010-06-07 at 13:29 Central US (UTC -9:00)
            const rawDate = q.split(" | ")[0].replace("Date: ", "").split(" ");
            return `${rawDate[0]} ${rawDate[2]} -0900`;
          },
          { name: "parseTime", args: ["yyyy-MM-dd HH:mm XX"] },
        ],
      },
      comments: {
        text: 0,
        selector: 'span.stats font:contains("Comments: ") b',
      },
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
