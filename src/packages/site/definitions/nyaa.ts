/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/nyaasi.yml
 */
import { type ISiteMetadata, type ITorrent } from "../types";
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { rot13 } from "../utils";

const WORK_SAFE_URL = rot13("uggcf://alnn.fv/");
const NON_WORK_SAFE_URL = rot13("uggcf://fhxrorv.alnn.fv/");

export const siteMetadata: ISiteMetadata = {
  id: "nyaa",
  version: 1,
  name: "Nyaa",
  tags: ["综合"],
  collaborator: ["hyuan280"],

  type: "public",

  urls: [
    "uggcf://alnn.fv/",
    "uggcf://fhxrorv.alnn.fv/",
    // 官方镜像（Jackett 的 links 中另有 nyaa.iss.ink / nyaa.land，实测搜索接口 502/403，故不收录）
    "uggcf://alnn.zbz/",
    "uggcf://alnn.zrqvn/",
    "uggcf://fhxrorv.alnn.zbz/",
  ],

  category: [
    {
      name: "搜索站点",
      key: "url",
      options: [
        { name: "表站", value: WORK_SAFE_URL },
        { name: "里站", value: NON_WORK_SAFE_URL },
      ],
      generateRequestConfig: (selectedOptions) => {
        return { requestConfig: { baseURL: selectedOptions.toString() } };
      },
    },
    {
      name: "过滤",
      key: "f",
      options: [
        { name: "No filter", value: "0" },
        { name: "No remakes", value: "1" },
        { name: "Trusted only", value: "2" },
      ],
    },
    {
      name: "类别（表站）",
      key: "c_safe",
      options: [
        { name: "All categories", value: "0_0" },
        { name: "Anime", value: "1_0" },
        { name: "Anime - AMV", value: "1_1" },
        { name: "Anime - English", value: "1_2" },
        { name: "Anime - Non-English", value: "1_3" },
        { name: "Anime - Raw", value: "1_4" },
        { name: "Audio", value: "2_0" },
        { name: "Audio - Lossless", value: "2_1" },
        { name: "Audio - Lossy", value: "2_2" },
        { name: "Literature", value: "3_0" },
        { name: "Literature - English", value: "3_1" },
        { name: "Literature - Non-English", value: "3_2" },
        { name: "Literature - Raw", value: "3_3" },
        { name: "Live Action", value: "4_0" },
        { name: "Live Action - English", value: "4_1" },
        { name: "Live Action - Idol/PV", value: "4_2" },
        { name: "Live Action - Non-English", value: "4_3" },
        { name: "Live Action - Raw", value: "4_4" },
        { name: "Pictures", value: "5_0" },
        { name: "Pictures - Graphics", value: "5_1" },
        { name: "Pictures - Photos", value: "5_2" },
        { name: "Software", value: "6_0" },
        { name: "Software - Apps", value: "6_1" },
        { name: "Software - Games", value: "6_2" },
      ],
      generateRequestConfig: (selectedOptions) => {
        return { requestConfig: { params: { c: selectedOptions.toString() } } };
      },
    },
    {
      name: "类别（里站）",
      key: "c_unsafe",
      options: [
        { name: "All categories", value: "0_0" },
        { name: "Art", value: "1_0" },
        { name: "Art - Anime", value: "1_1" },
        { name: "Art - Doujinshi", value: "1_2" },
        { name: "Art - Games", value: "1_3" },
        { name: "Art - Manga", value: "1_4" },
        { name: "Art - Pictures", value: "1_5" },
        { name: "Real Life", value: "2_0" },
        { name: "Real Life - Pictures", value: "2_1" },
        { name: "Real Life - Videos", value: "2_2" },
      ],
      generateRequestConfig: (selectedOptions) => {
        return { requestConfig: { params: { c: selectedOptions.toString() } } };
      },
    },
  ],

  search: {
    // 一页75个，没试出怎么改，就用默认的吧
    requestConfig: {
      url: "/",
    },
    keywordPath: "params.q",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table.torrent-list > tbody > tr" },
      id: {
        selector: ["a[href*='/view/']:not([href*='#'])"],
        attr: "href",
        filters: [(query: string) => query.match(/\/view\/(\d+)/)![1]],
      },
      title: { selector: ["a[href*='/view/']:not([href*='#'])"] },
      subTitle: {
        // 详细的分类显示到副标题
        selector: ["img.category-icon"],
        attr: "alt",
      },
      url: { selector: ["a[href*='/view/']:not([href*='#'])"], attr: "href" },
      link: { selector: ["a[href*='/download/']"], attr: "href" },
      time: { selector: ["td[data-timestamp]"], attr: "data-timestamp", filters: [{ name: "parseNumber" }] },
      size: { selector: ["td:nth-child(4)"], filters: [{ name: "parseSize" }] },
      seeders: { selector: ["td:nth-child(6)"], filters: [{ name: "parseNumber" }] },
      leechers: { selector: ["td:nth-child(7)"], filters: [{ name: "parseNumber" }] },
      completed: { selector: ["td:nth-child(8)"], filters: [{ name: "parseNumber" }] },
      comments: {
        // 评论数在评论链接文本里，图标元素本身没有数字
        selector: ["a[href*='/view/'][href*='#comments']", "a[href*='/view/'][href*='#com-']"],
        filters: [{ name: "parseNumber" }],
      },
      category: {
        // 简洁显示分类的大类 Anime - AMV => Anime
        selector: ["img.category-icon"],
        attr: "alt",
        filters: [(query: string) => query.split("-")[0].trim()],
      },
    },
  },

  searchEntry: {
    area_work_safe: {
      name: "表站",
      requestConfig: {
        baseURL: WORK_SAFE_URL,
      },
    },
    area_non_work_safe: {
      name: "里站",
      requestConfig: {
        baseURL: NON_WORK_SAFE_URL,
      },
      enabled: false,
    },
  },

  list: [
    {
      // 不要写死 https://nyaa.si/，镜像域（nyaa.mom / nyaa.iss.ink 等）同样要能识别为列表页
      urlPattern: ["nyaa\\.[a-z.]+/?(\\?.*)?$"],
    },
  ],

  detail: {
    urlPattern: ["/view/\\d+"],
    selectors: {
      title: { selector: ["div.container div.panel-heading > h3.panel-title"] },
      // 详情页的下载链里就是同一个数字 id，比 :self + element.URL 更稳（transformDetailPage 会 clone 文档）
      id: {
        selector: ["a[href*='/download/']"],
        attr: "href",
        filters: [(query: string) => query.match(/\/download\/(\d+)\.torrent/)?.[1]],
      },
      link: { selector: ["a[href*='/download/']"], attr: "href" },
      // 详情页把各项信息放在 `div.col-md-1`（标签）+ `div.col-md-5`（值）的相邻行里
      // 注意 transformDetailPage 不做类型转换，所以时间戳要自己 ×1000（页面给的是秒）
      time: {
        selector: [".col-md-1:contains('Date:') + .col-md-5"],
        attr: "data-timestamp",
        filters: [(query: number | string) => Number(query) * 1000],
      },
      size: {
        selector: [".col-md-1:contains('File size:') + .col-md-5"],
        filters: [{ name: "parseSize" }],
      },
      seeders: { selector: [".col-md-1:contains('Seeders:') + .col-md-5"] },
      leechers: { selector: [".col-md-1:contains('Leechers:') + .col-md-5"] },
      completed: { selector: [".col-md-1:contains('Completed:') + .col-md-5"] },
      // 与搜索页保持一致：搜索页从 img.category-icon 的 alt 取 `Anime - AMV` 再按 `-` 截断
      category: {
        selector: [".col-md-1:contains('Category:') + .col-md-5"],
        filters: [(query: string) => query.split("-")[0].trim()],
      },
      author: { selector: [".col-md-1:contains('Submitter:') + .col-md-5"] },
    },
  },
};

export default class Nyaa extends BittorrentSite {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("/download/")) {
      const mockRequestConfig = torrent.url?.startsWith("http") ? { url: torrent.url } : { baseURL: this.url };
      return this.fixLink(`/download/${torrent.id}.torrent`, mockRequestConfig);
    }

    return downloadLink;
  }
}
