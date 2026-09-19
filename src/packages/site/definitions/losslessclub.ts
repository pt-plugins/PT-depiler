/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/losslessclub.com/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/losslessclub.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 Кinokрk releaser 系模板。注意：其论坛与 tracker 是两套独立账号
 * （Jackett 的 info_login 提示），PTD 走浏览器 cookie 会话，无需额外处理。
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "losslessclub",
  name: "LosslessClub",
  description: "LosslessClub is a RUSSIAN Private Torrent Tracker for High Quality Music（无损音乐）",
  tags: ["音乐"],
  timezoneOffset: "+0300",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://losslessclub.com/"],

  category: [
    {
      name: "类型",
      key: "t",
      options: [
        { name: "全部", value: "all" },
        { name: "专辑", value: "albums" },
        { name: "单曲", value: "singles" },
      ],
    },
    {
      name: "状态",
      key: "act",
      options: [
        { name: "全部", value: "all" },
        { name: "仅活种", value: "active" },
        { name: "仅死种", value: "dead" },
      ],
    },
  ],

  search: {
    requestConfig: {
      url: "/browse.php",
      params: {
        t: "all",
        act: "all",
      },
    },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "div#releases-table table > tbody > tr:has(a.browselink)" },
      id: {
        selector: "a[href*='details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "a.browselink" },
      url: { selector: "a.browselink", attr: "href" },
      link: { selector: "a[href^='download.php?id=']", attr: "href" },
      category: { selector: "img", attr: "title" },
      size: { selector: "td:nth-child(5)" },
      seeders: {
        selector: "a[href*='list=peers#seeders']",
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: "a[href*='list=peers#leechers']",
        filters: [{ name: "parseNumber" }],
      },
      completed: { selector: "span.green", filters: [{ name: "parseNumber" }] },
      time: {
        selector: "td:nth-child(7)",
        elementProcess: (element: HTMLElement) => {
          const match = (element.textContent ?? "").match(/\d{1,2}\/\d{2}\/\d{2}/);
          return match ? match[0] : undefined;
        },
        filters: [{ name: "parseTime", args: ["MM/DD/YY"] }],
      },
      tags: [{ name: "Free", selector: "img[title='Golden torrent']", color: "blue" }],
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id="],
    selectors: {
      link: { selector: "a[alt='Download'][href*='download.php?id=']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "span.bar_user_welcome + b > a[href*='userdetails.php']",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "span.bar_user_welcome + b > a[href*='userdetails.php'] > span" },
          ratio: { selector: "span.bar_user_ratio", filters: [{ name: "parseNumber" }] },
          bonus: { selector: "td.bottom.bar_user a[href*='mybonus.php']", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: {
            selector: "td.bottom.bar_user:first > span.smallfont",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split("|")[0]?.trim() || undefined,
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "td.bottom.bar_user:first > span.smallfont",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split("|")[1]?.trim() || undefined,
            filters: [{ name: "parseSize" }],
          },
          levelName: { selector: "td.rowhead:contains('Класс') + td" },
          joinTime: {
            selector: "td.rowhead:contains('Зарегистрирован') + td",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split(" (")[0].trim() || undefined,
            filters: [{ name: "parseTime" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.i.php", params: { ajax: "", do: "torrents-seeding" } },
        assertion: { id: "params.id" },
        selectors: {
          seedingSize: {
            selector: "tr:not(:first-child)",
            elementProcess: (element: HTMLElement) => {
              // 逐行累加第 3 列的体积
              const row = element.closest("tr");
              return row?.querySelectorAll("td")[2]?.textContent?.trim() || undefined;
            },
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User" },
    { id: 3, name: "VIP" },
  ],
};
