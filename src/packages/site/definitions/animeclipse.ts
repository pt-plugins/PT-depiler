import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "animeclipse",
  name: "AnimeClipse",
  description:
    "AnimeClipse（Hellenic Fansubs United）是一个希腊的公开动漫 BT 站，基于 BTITracker 模块，无需登录即可检索与下载 .torrent",
  type: "public",
  tags: ["动漫"],
  urls: ["https://www.animeclipse.com/"],
  // 站点时间按 EET/EEST 显示（希腊），与服务端渲染出的「DD/MM/YYYY HH:mm:ss」一致
  timezoneOffset: "+0200",

  category: [
    {
      name: "Category",
      key: "category",
      cross: false,
      options: [
        { name: "----", value: "0" },
        { name: "Area 88", value: "16" },
        { name: "Black Lagoon", value: "13" },
        { name: "Bleach", value: "11" },
        { name: "Broken Blade", value: "137" },
        { name: "Candy Candy", value: "14" },
        { name: "Claymore", value: "20" },
        { name: "Danshi Koukousei no Nichijou", value: "156" },
        { name: "Darker than Black", value: "22" },
        { name: "Death Note", value: "19" },
        { name: "Devil May Cry", value: "129" },
        { name: "Dragonball Kai", value: "29" },
        { name: "Elfen Lied", value: "1" },
        { name: "Ergo Proxy", value: "15" },
        { name: "Fairy Tail", value: "30" },
        { name: "Ghost in the Shell: Arise", value: "135" },
        { name: "Golden Boy", value: "5" },
        { name: "Great Teacher Onizuka", value: "26" },
        { name: "Gungrave", value: "18" },
        { name: "Hajime no ippo", value: "24" },
        { name: "Highschool Of The Dead", value: "126" },
        { name: "Hunter X Hunter", value: "130" },
        { name: "Karas", value: "12" },
        { name: "Kenja no Mago", value: "155" },
        { name: "Movies", value: "8" },
        { name: "Plawres Sanshiro", value: "2" },
        { name: "Robin Hood no Daibouken", value: "32" },
        { name: "Rurouni Kenshin", value: "10" },
        { name: "SDF Macross", value: "131" },
        { name: "Seirei No Moribito", value: "21" },
        { name: "Shinrei Tantei Yakumo", value: "128" },
        { name: "Soul Eater", value: "28" },
        { name: "Suisei no Gargantia", value: "133" },
        { name: "Sword Art Online", value: "154" },
        { name: "Uchuu Kaizoku Captain Harlock", value: "127" },
        { name: "UFO Robo Grendizer", value: "31" },
      ],
    },
    {
      name: "Status",
      key: "active",
      cross: false,
      options: [
        { name: "ALL", value: "0" },
        { name: "Active Only", value: "1" },
        { name: "Dead Only", value: "2" },
      ],
    },
    {
      name: "Sort",
      key: "order",
      cross: false,
      options: [
        { name: "Date Added", value: "added" },
        { name: "Category", value: "cname" },
        { name: "Size", value: "size" },
        // 这三个实际是 active=5/3/4，会由 requestConfigTransformer 搬走，并覆盖上面的 Status
        { name: "Completed", value: "5" },
        { name: "Seeders", value: "3" },
        { name: "Leechers", value: "4" },
      ],
    },
    {
      name: "Order",
      key: "by",
      cross: false,
      options: [
        { name: "Descending", value: "DESC" },
        { name: "Ascending", value: "ASC" },
      ],
    },
  ],

  search: {
    // 站点的搜索表单是 GET /index.php，关键词字段名 search（同时压着 ind=btitracker 等模块参数）
    keywordPath: "params.search",
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: {
        ind: "btitracker",
        active: 0,
        category: 0,
        // 实测 100 会被 WAF 拦成 HTTP 403（13 字节），50 是站点当前可用的最大值
        tor_page: 50,
      },
    },
    requestConfigTransformer: (input) => {
      const requestConfig = input.requestConfig!;
      const params = (requestConfig.params ?? {}) as Record<string, unknown>;
      const order = String(params.order ?? "");
      // 站点把「按完成数 / 做种数 / 下载数排序」实现为复用 active 参数（active=5/3/4），
      // 对应的表头链接是 index.php?...&active=5&by=DESC，所以这里把伪装的排序值搬回 active
      if (["3", "4", "5"].includes(order)) {
        params.active = order;
        delete params.order;
      }
      requestConfig.params = params;
      return requestConfig;
    },
    selectors: {
      // 数据行是 tr.torrentRow；表头行是 tr.taburlo，排序单元格才是 td.torrentRow，不会误命中
      rows: { selector: "tr.torrentRow" },
      // 每颗种子在 td[2] 里内嵌两张表：第一张是标题行，第二张是 [size]/[Added]/[Downloaded]/[Completed]/Seeders/Leechers
      id: {
        selector: 'a[href$=".torrent"]',
        attr: "href",
        filters: [
          (href: string) => {
            const filename = decodeURIComponent(String(href).split("/").pop() ?? "");
            return filename.replace(/\.torrent$/i, "");
          },
        ],
      },
      title: { selector: 'a[href$=".torrent"]' },
      url: { selector: 'a[href$=".torrent"]', attr: "href" },
      link: { selector: 'a[href$=".torrent"]', attr: "href" },
      // 分类只以图标形式给出，名称在 img 的 alt 里
      category: { selector: "td:nth-child(1) img", attr: "alt" },
      // 信息行的标签（[size:]/[Added:]/...）与数值在同一个 td 内，按标签内容定位比数第几个 td 更稳
      size: {
        selector: 'td:contains("[size:") > span.torrentInfoData',
        filters: [{ name: "parseSize" }],
      },
      time: {
        selector: 'td:contains("[Added:") > span.torrentInfoData',
        filters: [{ name: "parseTime", args: ["dd/MM/yyyy HH:mm:ss"] }],
      },
      // 同一个 td 里还有 [Downloaded: 1.13 TB]（累计流量，不是次数），完成数只认 [Completed:
      completed: {
        selector: 'td:contains("[Completed:") > span.torrentInfoData',
        filters: [{ name: "parseNumber" }],
      },
      seeders: {
        selector: 'td:contains("Seeders") > span.torrentInfoData',
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: 'td:contains("Leechers") > span.torrentInfoData',
        filters: [{ name: "parseNumber" }],
      },
    },
  },
};
