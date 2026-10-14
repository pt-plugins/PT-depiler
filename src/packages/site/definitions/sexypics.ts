/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/sexypics.yml
 *
 * 整站成人站（tags 含「成人 / XXX」）：`urls` 全部写 rot13，文件里不出现本站域名明文。
 *
 * ⚠️ 截至 2026-10-13 该站被 Cloudflare 拦截：3 次根域 + `/browse/all/age/desc/` 全部 403
 * （响应 5.5~5.6KB，标题 "Just a moment..."，CF JS 挑战页）。**未取得任何真机样本**，
 * 下列选择器与路径拼法全部依据 Jackett 定义，**未经真机验证**。
 *
 * 另外 Jackett 为该站配了 `info_flaresolverr` 提示，说明 Jackett 侧也是靠 FlareSolverr 才能过 CF。
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "sexypics",
  name: "Sexy-Pics",
  description: "Sexy-Pics is a Public Magnet Links site for 3X MP4",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://jjj.frkl-cvpf.hf/"],

  search: {
    // Jackett 的 keywordfilters：空格换 "-" 再小写
    keywordPath: "params.keywords",
    requestConfig: {
      url: "/browse/all/age/desc/",
      responseType: "document",
      params: {},
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // Jackett 的 path 模板：
      //   {{ if .Keywords }}{{ 关键词首字母 }}/{{ .Keywords }}/{{ else }}browse/all/{{ end }}{{ sort }}/{{ type }}/
      // 即「有关键词走 <首字母>/<关键词>/<排序>/<方向>/，无关键词走 browse/all/…」；
      // 关键词已按 keywordfilters 去空格 + 小写，故首字母直接取第一个字符。
      // 注意：关键词搜索结果无法指定页码，这里只生成第 1 页（Jackett 的第 2 页是它的兜底路径）。
      if (keywords) {
        const slug = keywords.replace(/ /g, "-").toLowerCase();
        requestConfig!.url = `/${slug.charAt(0)}/${slug}/age/desc/`;
      } else {
        requestConfig!.url = "/browse/all/age/desc/";
      }
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "tr:has(td.m)" },
      // 详情链接（td.n a 的 href）就是主键，用它做 id（与 url 同源，保证两个入口 id 一致）
      id: { selector: "td.n a", attr: "href" },
      // Jackett 取的是 a 的 title 属性而不是链接文本
      title: { selector: "td.n a", attr: "title" },
      url: { selector: "td.n a", attr: "href" },
      link: { selector: "td.m a", attr: "href" },
      // Jackett 的 date 是 timeago（如 "2 days ago"），交给判断相对时间的 TTL 过滤器
      time: { selector: "td:nth-child(3)", filters: [{ name: "parseTTL" }] },
      // Jackett 的 files 字段（文件数）本仓库 ITorrent 无对应字段，故略去
      size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td.s", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td.l", filters: [{ name: "parseNumber" }] },
      // Jackett caps 里没有 categorymappings，只有一个恒定的 XXX
      category: { text: "XXX" },
    },
  },

  // 未声明 detail：被 CF 拦截拿不到详情页样本，且 Jackett 定义里也没有 details 段可依据。
};
