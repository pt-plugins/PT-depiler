/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/bangumi-moe.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "bangumimoe",
  name: "Bangumi Moe",
  aka: ["番組、萌え", "萌番组", "BangumiMoe"],
  description: "Bangumi Moe 是一个中文动漫 BT 资源站，提供动画 / 音乐 / 漫画 / 游戏等资源的聚合（公开站点，无需登录）",
  tags: ["Anime"],

  type: "public",
  urls: ["https://bangumi.moe/"],

  search: {
    keywordPath: "data.query",
    requestConfig: {
      url: "/api/v2/torrent/search",
      method: "post",
      responseType: "json",
      data: { query: "" },
    },
    // 无关键词时回落到 /api/torrent/latest（与 Jackett 的 path 分支一致）
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords) {
        requestConfig!.url = "/api/torrent/latest";
        requestConfig!.method = "get";
        delete requestConfig!.data;
      }
      return requestConfig!;
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "torrents" },
      id: { selector: "_id" },
      title: { selector: "title" },
      // 站点 AngularJS 路由表中存在 torrent/:torrent_id
      url: { selector: "_id", filters: [{ name: "prepend", args: ["/torrent/"] }] },
      link: { selector: "magnet" },
      // 2021-10-19T06:10:15.772Z
      time: { selector: "publish_time", filters: [{ name: "parseTime" }] },
      size: { selector: "size", filters: [{ name: "parseSize" }] },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "downloads" },
      // 接口返回 category_tag_id（如 549ef207fe682f7549f1ea90），优先取分类的多语言名
      category: { selector: ["category_tag.locale.zh_cn", "category_tag.name", "category_tag_id"] },
    },
  },
};
