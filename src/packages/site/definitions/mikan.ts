/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/mikan.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "mikan",
  name: "Mikan Project",
  aka: ["蜜柑计划", "Mikan"],
  description: "蜜柑计划是一个中文动漫 BT 资源站，提供新番字幕组的种子聚合（公开站点，无需登录）",
  tags: ["Anime"],

  type: "public",
  urls: ["https://mikanani.me/"],

  timezoneOffset: "+0800",

  search: {
    keywordPath: "params.searchstr",
    requestConfig: {
      url: "/Home/Search",
      responseType: "document",
      params: { searchstr: "" },
    },
    selectors: {
      rows: { selector: "table.table-striped > tbody > tr" },
      id: {
        selector: 'a[href^="/Home/Episode/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/Home\/Episode\/([0-9a-f]+)/)?.[1]],
      },
      title: { selector: 'a[href^="/Home/Episode/"]' },
      url: { selector: 'a[href^="/Home/Episode/"]', attr: "href" },
      link: { selector: "a[data-clipboard-text]", attr: "data-clipboard-text" },
      time: { selector: "td:nth-child(4)", filters: [{ name: "parseTime", args: ["yyyy/MM/dd HH:mm"] }] },
      size: { selector: "td:nth-child(3)", filters: [{ name: "parseSize" }] },
    },
  },

  list: [
    {
      urlPattern: ["/Home/Search", "/Home/Classic"],
      selectors: {
        keywords: { selector: 'input[name="searchstr"]', attr: "value" },
      },
    },
  ],

  // 详情页 /Home/Episode/<40 位 hash>。页面同时输出桌面模板（#sk-container，hidden-xs）
  // 与移动模板（#sk-mobile-container，hidden-lg），两者都在 HTML 里，故多数字段用选择器数组取第一个命中的。
  // 注意 transformDetailPage 不跑 parseSizeString / parseTimeWithZone，体积与时间必须在 filters 里自己转。
  detail: {
    urlPattern: ["/Home/Episode/[0-9a-f]{6,}"],
    selectors: {
      // 桌面模板 p.episode-title 的末尾被追加了 "[48.5 GB]"（与搜索页 title 不一致），剥掉；
      // 移动模板 .m-detail-title p.title 本身没有该后缀，作为兜底
      title: {
        selector: ["p.episode-title", ".m-detail-title p.title"],
        filters: [(q: string) => q.replace(/\s*\[[\d.]+\s*[KMGTPE]?i?B\]$/, "")],
      },
      // /Download/20260828/<hash>.torrent 里的 hash 与搜索页从 /Home/Episode/<hash> 取到的 id 相同
      id: {
        selector: 'a[href$=".torrent"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/([0-9a-f]{40})\.torrent/)?.[1]],
      },
      // 下载链接：页面直接给了 magnet（a[href^="magnet:"] 有两个，桌面/移动各一，内容相同）
      link: { selector: 'a[href^="magnet:"]', attr: "href" },
      // 桌面模板的「发布日期」有两种写法，站点时区 +0800，都按偏移换算成 UTC 毫秒时间戳：
      //   · 绝对：`发布日期：2026/08/28 23:15`
      //   · 相对：`发布日期：昨天 20:07`（今天 / 昨天 / 前天，近期发布的条目会走这条）
      time: {
        selector: 'p.bangumi-info:contains("发布日期")',
        filters: [
          (q: string) => {
            const text = String(q)
              .replace(/^[^：:]*[：:]\s*/, "")
              .trim();

            const relative = /^(今天|昨天|前天)\s+(\d{1,2}):(\d{2})/.exec(text);
            if (relative) {
              const backDays = { 今天: 0, 昨天: 1, 前天: 2 }[relative[1] as "今天" | "昨天" | "前天"];
              // 「今天」以站点时区（+0800）为准，避免依赖运行主机的时区
              const nowSite = new Date(Date.now() + 8 * 3600e3);
              return Date.UTC(
                nowSite.getUTCFullYear(),
                nowSite.getUTCMonth(),
                nowSite.getUTCDate() - backDays,
                +relative[2] - 8,
                +relative[3],
              );
            }

            const absolute = /(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})/.exec(text);
            return absolute
              ? Date.UTC(+absolute[1], +absolute[2] - 1, +absolute[3], +absolute[4] - 8, +absolute[5])
              : 0;
          },
        ],
      },
      // 桌面模板 "文件大小：48.5 GB"；移动模板同一数值渲染在 .m-detail-intro 的 .remark 里但没有标签，故只取桌面那条
      size: {
        selector: 'p.bangumi-info:contains("文件大小")',
        filters: [{ name: "parseSize" }],
      },
      // 发布组（字幕组）。有对应番组时是链接形式 "字幕组：<a class="magnet-link-wrap">7³ACG</a>"；
      // 没有番组（如 "生肉/不明字幕"）时同一行只剩纯文本，故回落到整行文本再剥掉标签
      author: {
        selector: ["p.bangumi-info a.magnet-link-wrap", 'p.bangumi-info:contains("字幕组")'],
        filters: [(q: string) => q.replace(/^字幕组[：:]\s*/, "").trim()],
      },
      // 站点不公开做种 / 下载 / 完成人数，留空
    },
  },
};
