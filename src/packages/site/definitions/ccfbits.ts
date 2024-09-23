import type { ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";
import Sizzle from "sizzle";

export const siteMetadata: ISiteMetadata = {
  name: "CCFBits",
  type: "private",
  timezoneOffset: "+0800",
  description: "",
  url: "https://ccfbits.org/",
  tags: ["影视", "剧集", "综合"],
  collaborator: ["Rhilip"],
  search: {
    requestConfig: {
      url: "/browse.php",
      params: { notnewword: 1 },
    },
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
    selectors: {
      rows: {
        selector:
          'table[border="1"][cellpadding="5"] > tbody > tr:has(a[href^="details.php?id="])',
      },
      id: {
        selector: 'a[title][href^="details.php?id="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: 'a[title][href^="details.php?id="]',
        attr: "title",
        filters: [(title: `${string}\n${string}`) => title.split("\n")[0]],
      },
      subTitle: {
        selector: 'a[title][href^="details.php?id="]',
        attr: "title",
        filters: [(title: `${string}\n${string}`) => title.split("\n")[1] || ""],
      },
      url: { selector: 'a[title][href^="details.php?id="]', attr: "href" },
      link: { selector: 'a[href^="download.php/"]', attr: "href" },
      time: { selector: "td:nth-child(5)" },
      size: { selector: "td:nth-child(7)" },
      seeders: { selector: "td:nth-child(8)" },
      leechers: { selector: "td:nth-child(9)" },
      completed: {
        selector: 'a[href^="snatches.php?id"]',
        filters: [(query: `${number} 次`) => query.replace("次", "")],
      },
      comments: { selector: 'a[href*="tocomm=1"]' },

      tags: [
        {
          name: "Free",
          selector:
            "font[color='#C20603']:has( > img[href*='arrowdown1.gif']):contains('免费')",
        },
        {
          name: "30%",
          selector:
            "font[color='#C20603']:has( > img[href*='arrowdown1.gif']):contains('0.3x')",
        },
        {
          name: "50%",
          selector:
            "font[color='#C20603']:has( > img[href*='arrowdown1.gif']):contains('0.5x')",
        },
        {
          name: "2xUp",
          selector:
            "font[color='#4A8D04']:has( > img[href*='arrowup1.gif']):contains('2x')",
        },
      ],
    },
  },
  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "id" },
        fields: [
          "uploaded",
          "downloaded",
          "levelName",
          "bonus",
          "joinTime",
          "seeding",
          "seedingSize",
        ],
      },
    ],
    selectors: {
      // url: '/index.php',
      id: {
        selector: "a[href*='userdetails.php']:first",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: "a[href*='userdetails.php']:first",
      },
      // url: '/userdetails.php'
      uploaded: {
        selector: ["上传量", "上傳量"].map((x) => `td.rowhead:contains('${x}') + td`),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["下载量", "下載量"].map((x) => `td.rowhead:contains('${x}') + td`),
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: ["等级", "等級"].map((x) => `td.rowhead:contains('${x}') + td`),
      },
      bonus: {
        selector: ["积分", "積分"].map((x) => `td.rowhead:contains('${x}') + td`),
        filters: [parseFloat],
      },
      joinTime: {
        selector: ["注册日期", "註冊日期"].map(
          (x) => `td.rowhead:contains('${x}') + td`,
        ),
        filters: [{ name: "parseTime" }],
      },
      seeding: {
        text: 0,
        selector: "div#ka1 table tbody",
        filters: [
          (tbody: HTMLElement) => {
            const trAnothers = Sizzle("tr:gt(0)", tbody);
            return trAnothers.length;
          },
        ],
      },
      seedingSize: {
        text: 0,
        selector: "div#ka1 table tbody",
        filters: [
          (tbody: HTMLElement) => {
            let seedingSize = 0;
            const trAnothers = Sizzle("tr:gt(0)", tbody);
            trAnothers.forEach((trAnother) => {
              const sizeAnother = Sizzle("td:eq(3)", trAnother)[0];
              seedingSize += parseSizeString(
                (sizeAnother as HTMLElement).innerText.trim(),
              );
            });
            return seedingSize;
          },
        ],
      },
    },
  },
};
