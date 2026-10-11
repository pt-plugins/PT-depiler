/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/showrss.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { type ISearchInput, type ISiteMetadata, type ITorrent } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "showrss",
  name: "showRSS",
  description: "showRSS is a service that allows you to keep track of your favorite TV shows",
  tags: ["电视剧"],

  type: "public",
  urls: ["https://showrss.info/"],

  search: {
    // showRSS 只提供「全部剧集」的全局 feed（text/xml），没有任何服务端关键词参数
    // （实测 ?q= / ?search= / ?show= / ?keyword= 均被忽略，返回内容完全相同），
    // Jackett 的做法是取回整个 feed 后用 rows 的 andmatch 在本地筛行，这里同样在
    // transformSearchPage 中做客户端过滤（见文件末尾的 default class）。
    keywordPath: "params.q",
    requestConfig: { url: "/other/all.rss", responseType: "document" },
    selectors: {
      rows: { selector: "rss > channel > item" },
      // tv:info_hash 才是真正的种子 hash；guid 是 showRSS 自己的 episode hash，两者在同一 item 里并不相同
      id: { selector: "tv\\:info_hash" },
      // Jackett 的 title 取 raw_title（完整发布名），而 <title> 是站点简写（如 "The Voice (UK) 14x07 1080p"）
      title: { selector: "tv\\:raw_title" },
      // 站点没有单种子详情页（Jackett 的 details 用 "/" 占位），故不定义 url
      link: { selector: "enclosure", attr: "url" },
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      // Jackett: raw_title 含 720p/1080p -> TV/HD(2)，否则 TV/SD(1)
      category: {
        selector: "tv\\:raw_title",
        filters: [(query: string) => (/(?:720|1080)p/i.test(query) ? "TV/HD" : "TV/SD")],
      },
      // size / seeders / leechers：feed 与页面都不提供（Jackett 里是 512 MB / 1 / 1 的硬编码假值），留空
    },
  },
};

/**
 * showRSS 没有服务端搜索，全局 feed 里的条目与关键词无关，
 * 因此按 Jackett 的 andmatch 语义在本地过滤：大小写不敏感、按空格分词、要求所有词都出现在标题中。
 * 关键词为空时原样返回全部，不做过滤。
 */
export default class ShowRss extends BittorrentSite {
  public override async transformSearchPage(
    doc: Document | object | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const torrents = await super.transformSearchPage(doc, searchConfig);

    const keywords = String(searchConfig.keywords ?? "").trim();
    if (!keywords) {
      return torrents;
    }

    const terms = keywords.toLowerCase().split(/\s+/).filter(Boolean);
    return torrents.filter((torrent) => {
      const title = String(torrent.title ?? "").toLowerCase();
      return terms.every((term) => title.includes(term));
    });
  }
}
