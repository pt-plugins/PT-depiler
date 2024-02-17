import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "BT.etree",
  type: "public",
  description: "BT.etree is a Public Tracker dedicated to Bootleg FLAC MUSIC",
  url: "https://bt.etree.org/",
  search: {
    keywordsParam: "searchzzzz",
    requestConfig: {
      params: { cat: 0 },
    },
    selectors: {
      rows: { selector: 'table[bgcolor="#CCCCCC"] tbody tr:gt(1)' }, // 不要第一行
      id: {
        selector: "td:nth-child(2) a.details_link",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "td:nth-child(2) a.details_link b" },
      url: { selector: "td:nth-child(2) a.details_link", attr: "href" },
      link: { selector: "td:nth-child(3) a", attr: "href" },
      time: { selector: "td:nth-child(6)" },
      size: { selector: "td:nth-child(7)" },
      author: { selector: "td:nth-child(11)" },
      seeders: { selector: "td:nth-child(9)" },
      leechers: { selector: "td:nth-child(10)" },
      completed: {
        selector: "td:nth-child(8)",
        filters: [(q: string) => q.replace("times", "")],
      },
      comments: { selector: "td:nth-child(5)" },
      category: { selector: "td:nth-child(1) a" },
    },
  },
};
