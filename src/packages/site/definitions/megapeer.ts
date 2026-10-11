/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/megapeer.yml
 */
import { type ISiteMetadata } from "../types";

// 站点日期形如 "26 Мая 26"（d MMM yy，莫斯科时间），先把俄语月份缩写换掉
const ruMonthMap: Record<string, string> = {
  Янв: "01",
  Фев: "02",
  Мар: "03",
  Апр: "04",
  Мая: "05",
  Июн: "06",
  Июл: "07",
  Авг: "08",
  Сен: "09",
  Окт: "10",
  Ноя: "11",
  Дек: "12",
};

// 详情页的日期是完整俄语月份名（属格）形如 "11 октября 2026 в 04:01:54"，
// 取前三个字母做键即可唯一区分（янв/фев/мар/апр/мая/июн/июл/авг/сен/окт/ноя/дек）。
const ruFullMonthMap: Record<string, string> = {
  янв: "01",
  фев: "02",
  мар: "03",
  апр: "04",
  мая: "05",
  июн: "06",
  июл: "07",
  авг: "08",
  сен: "09",
  окт: "10",
  ноя: "11",
  дек: "12",
};

/**
 * 解析详情页「Добавлен」/「Сид был」这类时间：值形如 "11 октября 2026 в 04:01:54 (12 часов назад)"。
 * transformDetailPage 不会套 timezoneOffset（AbstractBittorrentSite.ts:737-769），
 * 所以这里按站点标注的 MSK（UTC+3）自己折算成时间戳；取不到月份时退化为 0，不让整页解析抛错。
 */
function parseRuDetailTime(raw: string): number {
  const matched = /^(\d{1,2})\s+([^\s]+)\s+(\d{4})\s+в\s+(\d{1,2}):(\d{2}):(\d{2})/.exec(String(raw).trim());
  const month = matched ? ruFullMonthMap[matched[2].slice(0, 3).toLowerCase()] : undefined;
  if (!matched || !month) {
    return 0;
  }

  const [, day, , year, hour, minute, second] = matched;
  return Date.UTC(+year, +month - 1, +day, +hour, +minute, +second) - 3 * 3600 * 1000;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "megapeer",
  name: "MegaPeer",
  aka: ["MegaPeer.vip"],
  description: "MegaPeer 是一个俄罗斯公开 BT 站，主要提供俄语电影 / 剧集 / 音乐等资源（公开站点，无需登录）",
  tags: ["电影", "电视剧"],

  type: "public",
  urls: ["https://megapeer.vip/"],
  legacyUrls: ["http://megapeer.ru/", "http://alt.megapeer.ru/"],

  timezoneOffset: "+0300", // MSK

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      // stype=0 表示按标题搜索；站点不支持多分类搜索，cat 固定为 0（全部）
      params: { search: "", cat: 0, stype: 0, sort: 0, ascdesc: 0 },
      // Jackett 注明需要 Referer 以避免跳转
      headers: { referer: "https://megapeer.vip/browse.php" },
    },
    // 站点在关键词为空时直接返回 404，Jackett 的做法是回落到「当前年份」作为关键词
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords) {
        requestConfig!.params = { ...(requestConfig!.params ?? {}), search: String(new Date().getFullYear()) };
      }
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "tr.table_fon" },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/(\d+)/)?.[1]],
      },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href^="/download/"]', attr: "href" },
      // 列表页只给到「日 月 年」（如 "26 Сен 26"），按当日 00:00（MSK = UTC+3）折算成时间戳。
      // 直接返回时间戳（而不是交给 parseTimeWithZone 解析字符串）：结果不依赖运行主机的时区，
      // 且月份无法识别时退化为 0，不会因为抛出 RangeError 而让整页解析失败。
      time: {
        selector: "td:first-child",
        filters: [
          (q: string) => {
            const matched = /^(\d{1,2})\s+(\S+)\s+(\d{2,4})$/.exec(String(q).trim());
            const month = matched ? ruMonthMap[matched[2]] : undefined;
            if (!matched || !month) {
              return 0;
            }
            const [day, , year] = matched.slice(1);
            return Date.UTC(+`${year.length === 2 ? "20" : ""}${year}`, +month - 1, +day) - 3 * 3600 * 1000;
          },
        ],
      },
      size: { selector: "td:nth-last-child(2)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:last-child font:first-of-type" },
      leechers: { selector: "td:last-child font:last-of-type" },
      // 列表页（cat=0）不返回分类，详情页才有；Jackett 在此硬编码为「Разное」，此处留空
    },
  },

  list: [
    {
      urlPattern: ["/browse.php"],
      selectors: {
        keywords: { selector: 'input[name="search"]', attr: "value" },
      },
    },
  ],

  // 详情页形如 https://megapeer.vip/torrent/214916/<slug>（站点是 windows-1251，浏览器按 <meta charset> 解码，
  // 所以这里可以放心用西里尔文本做 :contains）。标题是 h1，下载入口在 #download，
  // 余下元信息都在 <table id="details"> 里，一行一对「<td class="heading">标签</td><td>值</td>」。
  // 注意 transformDetailPage 不做任何类型转换（AbstractBittorrentSite.ts:737-769），
  // 体积与时间必须在这里自己转成 number / 毫秒时间戳。
  detail: {
    // 列表页是 /browse.php、/search.php、/tag/...，只有详情页带 /torrent/<数字>
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      title: { selector: "h1" },
      // id 取 /download/214916 里的数字，与搜索页 selectors.id（从 /torrent/214916 取）是同一个 id
      id: {
        selector: 'a[href^="/download/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/download\/(\d+)/)?.[1]],
      },
      // 与搜索页一致：站点自己的 .torrent 直链（#download 里的 magnet 排在前面，但那不是搜索页给出的链接）
      link: { selector: 'a[href^="/download/"]', attr: "href" },
      // "Добавлен" 的值形如 "11 октября 2026 в 04:01:54 (12 часов назад)"，按 MSK 折算
      time: {
        selector: "#details tr:has(td.heading:contains('Добавлен')) td:last-child",
        filters: [parseRuDetailTime],
      },
      // "Размер" 的值形如 "2.89 GB (3098731386 Bytes)"：parseSize 自带的正则吃不下括号里的字节数
      // （实测返回 0），先去括号再 parseSize，得到与列表页一致的 2.89 GB
      size: {
        selector: "#details tr:has(td.heading:contains('Размер')) td:last-child",
        filters: [(q: string) => q.replace(/\([^)]*\)/g, ""), { name: "parseSize" }],
      },
      seeders: { selector: "#details tr:has(td.heading:contains('Раздают')) td:last-child" },
      leechers: { selector: "#details tr:has(td.heading:contains('Качают')) td:last-child" },
      // "Категория" 的具体值来自行内链接（如 /cat/52 → "Книги / Журналы"），列表页（cat=0）拿不到分类
      category: { selector: "#details tr:has(td.heading:contains('Категория')) td:last-child" },
      // 有上传者时页面才有 "Загрузил" 行（如 /torrent/214890/... 的 ARI71），匿名发布没有该行
      author: { selector: "#details tr:has(td.heading:contains('Загрузил')) td:last-child" },
      // 站点不提供下载完成次数（completed），留空
    },
  },
};
