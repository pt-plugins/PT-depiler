import { a3 as e } from "../index-COeZNva1.js";
const s = {
  version: 1,
  id: "0magnet",
  name: "0Magnet",
  aka: ["ØMagnet", "无极磁链"],
  description: "ØMagnet 是一个专注于高清电影和电视剧的私人种子站点，提供高质量的影视资源下载服务。",
  tags: ["成人", "XXX"],
  type: "public",
  urls: [
    "uggcf://16znt.arg/",
    "uggcf://0zntarg.pbz/",
    "uggcf://8pv.yv/",
    "uggcf://7znt.arg/",
    "uggcf://13znt.arg/",
    "uggcf://trgznt.arg/",
    "uggcf://kpvyv.arg/",
    "uggcf://1pvyv.pbz/",
    "uggcf://pvyv.vasb/",
    "uggcf://pvyv.hx/",
    "uggcf://jhwv.zr/",
    "uggcf://0pvyv.pbz/",
    "uggcf://0pvyv.zl/",
  ],
  legacyUrls: ["https://6mag.net/", "https://9mag.net/", "https://0mag.net/"],
  search: {
    keywordPath: "params.q",
    requestConfig: { url: "/search" },
    requestConfigTransformer: (t) => (t.keywords || (t.requestConfig.url = "/listing"), t.requestConfig),
    selectors: {
      rows: { selector: "table.file-list > tbody > tr:has(td)" },
      id: { selector: "a", attr: "href" },
      title: { selector: "a", elementProcess: (t) => e(t.innerHTML.split('<p class="sample">')[0]).trim() },
      subTitle: { selector: "p.sample" },
      url: { selector: "a", attr: "href" },
      size: { selector: "td.td-size", filters: [{ name: "parseSize" }] },
      category: { text: "XXX" },
    },
  },
  list: [{ urlPattern: ["/listing", "/search"] }],
  detail: {
    urlPattern: ["/!"],
    selectors: {
      title: { selector: "h2.magnet-title" },
      link: { selector: "input#input-magnet", attr: "value" },
      time: {
        selector: ["dt:contains('Date') + dd", "dt:contains('发布日期') + dd"],
        filters: [{ name: "parseTime" }],
      },
      size: {
        selector: ["dt:contains('Size') + dd", "dt:contains('文件大小') + dd"],
        filters: [{ name: "parseSize" }],
      },
    },
  },
};
export { s as siteMetadata };
