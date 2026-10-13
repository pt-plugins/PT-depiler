/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/xxxtor.yml
 */
import { type ISiteMetadata } from "../types";

const EN_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * 列表页的时间形如 `26 Сен 26`（月份缩写已在前面的 replace 里换成英语）。
 *
 * 不能用 `parseTime`：它按**运行主机所在时区**解析，站点标注的是 MSK（UTC+3），
 * 用户在 UTC+8 就会整体偏早 5 小时（且不同用户看到的时刻不一致）。
 * 这里显式按 UTC+3 折算成时间戳，结果与主机时区无关；解析不出来退化为 0，不让整页失败。
 */
function parseXxxTorListTime(raw: string): number {
  const matched = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{2})$/.exec(String(raw).trim());
  const month = matched ? EN_MONTHS.indexOf(matched[2].toLowerCase()) : -1;
  if (!matched || month < 0) {
    return 0;
  }
  const [day, , year] = matched.slice(1);
  return Date.UTC(2000 + +year, month, +day) - 3 * 3600 * 1000;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "xxxtor",
  name: "xxxtor",
  description: "xxxtor is a RUSSIAN Public Torrent Tracker for 3X（俄语成人向公开站）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://kkkgbe.pbz/"],
  // Jackett 中另有 https://xxxtor.info/，实测已跳转至域名停放商（expireddomains.com），不再收录
  legacyUrls: ["uggcf://kkkgbe.bet/"],

  timezoneOffset: "+0300", // 站点时间使用 MSK（UTC+3）

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/b.php",
      responseType: "document",
      params: { search: "" },
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // Jackett: 无关键词时以当年年份作为搜索词
      if (!keywords) {
        requestConfig!.params.search = String(new Date().getFullYear());
      }
      return requestConfig!;
    },
    selectors: {
      // 该页面的 table 没有显式 tbody，不能用 `table > tbody > tr`
      rows: { selector: "table tr.gai" },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/(\d+)/)?.[1] ?? q],
      },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      time: {
        selector: "td:first-of-type",
        filters: [
          // 俄语月份缩写 -> 英语
          { name: "replace", args: ["Янв", "Jan"] },
          { name: "replace", args: ["Фев", "Feb"] },
          { name: "replace", args: ["Мар", "Mar"] },
          { name: "replace", args: ["Апр", "Apr"] },
          { name: "replace", args: ["Май", "May"] },
          { name: "replace", args: ["Июн", "Jun"] },
          { name: "replace", args: ["Июл", "Jul"] },
          { name: "replace", args: ["Авг", "Aug"] },
          { name: "replace", args: ["Сен", "Sep"] },
          { name: "replace", args: ["Окт", "Oct"] },
          { name: "replace", args: ["Ноя", "Nov"] },
          { name: "replace", args: ["Дек", "Dec"] },
          parseXxxTorListTime,
        ],
      },
      size: { selector: "td:nth-of-type(3)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:last-of-type span:first-of-type" },
      leechers: { selector: "td:last-of-type span:last-of-type" },
      category: { text: "XXX" }, // 该站只有 3X 内容（Jackett categorymappings 仅 XXX）
    },
  },

  // 详情页形如 https://xxxtor.com/torrent/117732/：标题是 h1，下载入口在 #download，
  // 其余元信息都在 <table id="details"> 里，一行一对「<td class='header'>标签</td><td>值</td>」。
  // 注意 transformDetailPage 不做任何类型转换（AbstractBittorrentSite.ts:737-769），
  // 体积与时间必须在这里自己转成 number / 毫秒时间戳，纯数字字符串才会被自动转 int。
  detail: {
    // 列表页是 /b.php、/search.php、/tag/...，只有详情页带 /torrent/<数字>，不会把列表页吃进来
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      title: { selector: "h1" },
      // id 取 /download/117732/ 里的数字，与搜索页 selectors.id（从 /torrent/117732/ 取）结果一致
      id: {
        selector: 'a[href^="/download/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/download\/(\d+)/)?.[1]],
      },
      // 与搜索页一致优先给 magnet（同一颗种子两个入口拿到的 link 相同），没有 magnet 时回落到 .torrent 直链
      link: { selector: ['a[href^="magnet:?xt="]', 'a[href^="/download/"]'], attr: "href" },
      // "Добавлен" 的值形如 "10-10-2026 23:49:45  (17 часов назад)"，第二颗种子实测是 "10-10-2026 3:37:43"
      // （小时不补零），故小时用 \d{1,2}。d-m-Y 是站点写法，时区是站点标注的 MSK（UTC+3），
      // transformDetailPage 不会套 timezoneOffset，这里自己减 3 小时折算；解析失败退化为 0，不让整页失败。
      time: {
        selector: "#details tr:has(td.header:contains('Добавлен')) td:last-child",
        filters: [
          (q: string) => {
            const matched = /^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/.exec(String(q).trim());
            if (!matched) {
              return 0;
            }
            const [, day, month, year, hour, minute, second] = matched;
            return Date.UTC(+year, +month - 1, +day, +hour, +minute, +second) - 3 * 3600 * 1000;
          },
        ],
      },
      // "Размер" 的值形如 "2.40 GB (2572661148 B)"：parseSize 自带的正则吃不下括号里的第二段字节数
      // （实测会返回 0），先把括号整段去掉再交给 parseSize，得到与列表页一致的 2.40 GB。
      // 用 td.header 限定：table#details 里还嵌着一张 table#files，其 "Размер" 单元格没有 header 类。
      size: {
        selector: "#details tr:has(td.header:contains('Размер')) td:last-child",
        filters: [(q: string) => q.replace(/\([^)]*\)/g, ""), { name: "parseSize" }],
      },
      seeders: { selector: "#details tr:has(td.header:contains('Раздают')) td:last-child" },
      leechers: { selector: "#details tr:has(td.header:contains('Качают')) td:last-child" },
      // "Торрент взят" = 下载完成次数，值形如 "1852 раз"，用 parseNumber 取数字
      completed: {
        selector: "#details tr:has(td.header:contains('Торрент взят')) td:last-child",
        filters: [{ name: "parseNumber" }],
      },
      // 详情页的分类是具体值（"Видео" / "Фильмы"），比搜索页的硬编码 "XXX" 更细
      category: { selector: "#details tr:has(td.header:contains('Категория')) td:last-child" },
      // 该站是匿名发布，页面里没有上传者行，author 留空
    },
  },
};
