/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/opensharing.yml
 *
 * 整站成人站（tags 含「成人 / XXX」）：`urls` / `legacyUrls` 全部按仓库约定写 rot13
 * （`src/packages/site/index.ts:53-59` 加载时还原），文件里不再出现本站域名明文。
 *
 * ⚠️ 截至 2026-10-13 该站被 Cloudflare 拦截（实测 3 次根域 + 1 次 search.php 全部 403，
 * 响应约 5.5KB、标题 "Just a moment..."，即 CF 的 JS 挑战页），**未取得任何真机样本**。
 * 本文件的选择器/参数依据 Jackett 定义（phpBB 论坛式布局），**未经真机验证**。
 */
import { type ISiteMetadata } from "../types";

/**
 * 论坛分类（phpBB 的 `fid[]`），id 来自 Jackett categorymappings。
 *
 * Jackett 里 112 个 id 绝大多数是「同一版块的不同子版」且描述带缩进（如
 * 「  Сцены и ролики」挂在「Зарубежные ролики по жанрам」下），整份照抄会在界面上
 * 变成 112 个看不出层级的条目；这里按「顶级版块」合并成 10 组，**描述文字仍照抄 Jackett 原文**，
 * 未做翻译/改写（多个同名子版合并时取顶级版的描述）。合并关系写在每项的 value 里（逗号分隔的 fid）。
 * 其中「Общий форум / Правила & FAQ / Новости / Архив …」等 7 个论坛版块没有种子意义，已剔除。
 */
export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "opensharing",
  name: "OpenSharing",
  description: "OpenSharing is a RUSSIAN Public Torrent Tracker for 3X",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://bcrafunevat.bet/"],

  // Jackett 把分类拼成 `$raw: &fid[]=6&fid[]=7…`；这里让选项值直接等于那串 fid，
  // 由 generateRequestConfig 展开成 phpBB 搜索表单要求的 `fid[]` 数组
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "全部", value: "" },
        { name: "Полнометражные XXX фильмы / Full Length Movies", value: "6,7,8,9,11,36,37,39,83" },
        {
          name: "Зарубежные ролики по жанрам / Foreign videos by genre",
          value: "28,27,26,19,21,20,29,30,35,32,33,40,34",
        },
        { name: "Русское порно / Russian - Фильмы и ролики", value: "12,13,14,15" },
        { name: "Этническое порно / Ethnic Porn", value: "64,65,68,66,67,105" },
        { name: "Оральный секс / Blowjob & Deep Throat, Licking", value: "84,86,87,85" },
        { name: "Masturbation, Solo & Posing", value: "61,62,63" },
        { name: "Любительское порно / Amateur & Homemade", value: "2,3,18,4,10,5" },
        { name: "Только для зарегистрированных / For Registered Members Only", value: "110,112,113,114,116,115,117" },
        {
          name: "Фетиш и Нетрадиционное порно / Special Interest",
          value: "16,43,17,46,41,45,44,47,49,109,99,106,53,54,48,55,56,60,98,51,50,57,52,107,58,104,59,108,42",
        },
        { name: "Лесбиянки / Lesbians", value: "69,70,71,72,73" },
        { name: "Анимация, игры, фото и картинки", value: "24,23,74,75,76,77,79,80,81,82,78,102,103" },
      ],
      cross: false,
      generateRequestConfig: (selected) => {
        const value = String(selected ?? "");
        if (!value) {
          return { requestConfig: { params: { "fid[]": [] } } };
        }
        return { requestConfig: { params: { "fid[]": value.split(",").map(Number) } } };
      },
    },
  ],

  search: {
    // Jackett: keywords 缺省时用当前年份搜索
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      requestConfig!.params.keywords = keywords || String(new Date().getFullYear());
      return requestConfig!;
    },
    requestConfig: {
      url: "/search.php",
      responseType: "document",
      params: {
        tracker_search: "torrent",
        keywords: "",
        terms: "all",
        author: "",
        sc: 1,
        sf: "titleonly",
        sr: "topics",
        sk: "t",
        sd: "d",
        st: 0,
        ch: 300,
        t: 0,
        // phpBB 搜索表单的分类过滤参数，形如 fid[]=6&fid[]=13
        "fid[]": [] as number[],
      },
    },
    selectors: {
      // Jackett 的原始选择器
      rows: { selector: 'table.tablebg > tbody > tr:has(a[href^="./download/file.php?id="])' },
      id: {
        selector: "a.topictitle",
        attr: "href",
        filters: [(query: string) => /[?&]t=(\d+)/.exec(String(query))?.[1] ?? String(query)],
      },
      title: { selector: "a.topictitle" },
      url: { selector: "a.topictitle", attr: "href" },
      link: { selector: 'a[href^="./download/file.php?id="]', attr: "href" },
      // Jackett 的 category 是 `a[href^="./viewtopic.php?f="]` + querystring f：取种子所在版块的数字 id
      category: {
        selector: 'a[href^="./viewtopic.php?f="]',
        attr: "href",
        filters: [(query: string) => /[?&]f=(\d+)/.exec(String(query))?.[1] ?? String(query)],
      },
      // Jackett 用 replace 把 ТБ/ГБ/МБ/КБ 换成 TB/GB/MB/KB 再解析；仓库的 parseSize 走
      // parseSizeString，无法确认其对西里尔单位的行为，因此沿用 Jackett 的写法并追加 parseSize
      size: {
        selector: "p.gensmall > b",
        filters: [
          { name: "replace", args: ["ТБ", "TB"] },
          { name: "replace", args: ["ГБ", "GB"] },
          { name: "replace", args: ["МБ", "MB"] },
          { name: "replace", args: ["КБ", "KB"] },
          { name: "parseSize" },
        ],
      },
      seeders: { selector: "span.seed", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "span.leech", filters: [{ name: "parseNumber" }] },
      completed: { selector: "span.complet", filters: [{ name: "parseNumber" }] },
      // Jackett 的 date 选择器是 a.topictitle + optional + default now，从标题里正则抓 (09.03.2020)，
      // 找不到就用「当前时间」——这里 1:1 照搬；日期按站点时区（MSK，UTC+3）折算成时间戳，
      // 不让 parseTime 按运行主机时区解析（本仓库第二批补充说明第 4 条）
      time: {
        selector: "a.topictitle",
        filters: [
          (query: string) => {
            const matched = /(\d{2})\.(\d{2})\.(\d{4})/.exec(String(query));
            if (!matched) {
              return Date.now();
            }
            const [, day, month, year] = matched;
            return Date.UTC(+year, +month - 1, +day) - 3 * 3600 * 1000;
          },
        ],
      },
    },
  },

  // 未声明 detail：Jackett 定义里没有独立的 details 段，也没有给出详情页（viewtopic.php）的字段选择器；
  // 叠加该站被 CF 拦截拿不到样本，凭空推断页面结构会违反「禁止编造」。
};
