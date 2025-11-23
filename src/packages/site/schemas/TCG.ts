import type { ISiteMetadata } from "../types.ts";
import { definedFilters } from "../utils.ts";
import PrivateSite from "./AbstractPrivateSite.ts";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: {
        incldead: 1,
        titleonly: 1,
        nonboolean: 0, // Exact search
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: {
        // 按 Jackett 备注，TCG 联盟站 搜索结果不能包含禁转和免费种子
        selector:
          "table[border='0'] > tbody > tr.ttable:has(a[href^='browse.php?cat=']):not(:has(font[color='blue'])):not(:contains('*TCG*'))",
      },
      title: { selector: "a[href^='details.php?id=']", attr: "title" },
      url: { selector: "a[href^='details.php?id=']", attr: "href" },
      link: { selector: "a[href^='download.php/']", attr: "href" },
      time: { selector: "td:nth-child(6)", filters: [{ name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss"] }] },
      size: { selector: "td:nth-child(7)", filters: [{ name: "parseSize" }] },
      completed: {
        selector: "td:nth-child(8)",
        filters: [{ name: "replace", args: ["Never", "0"] }, { name: "parseNumber" }],
      },
      seeders: { selector: "td:nth-child(9)" },
      leechers: { selector: "td:nth-child(10)" },
      comments: { selector: "td:nth-child(5)" },
      subTitle: { selector: "span > em" },
      tags: [
        {
          name: "Neutral",
          selector: "font[color='green']:contains('NEUTRAL')",
          color: "green",
        },
      ],
    },
  },

  detail: {
    urlPattern: ["/details.php"],
    selectors: {
      title: { selector: "div > h1" },
      link: { selector: "a[href^='download.php/']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/main.php", responseType: "document" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php?id=']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='userdetails.php?id=']:first" },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          joinTime: {
            selector: ".embedded td:contains('Join date') + td:first",
            filters: [
              // 2023-11-02 08:17:49 (10 months, 26 days, 6 hours, 15 mins ago)
              { name: "split", args: ["(", 0] },
              { name: "trim" },
              { name: "parseTime" },
            ],
          },
          messageCount: {
            selector: "a[href='message.php?action=viewmailbox'] + b",
            filters: [{ name: "parseNumber" }],
          },
          uploaded: {
            selector: "td.rowhead:contains('Uploaded') + td",
            filters: [{ name: "split", args: ["(", 0] }, { name: "trim" }, { name: "parseSize" }],
          },
          downloaded: {
            selector: "td.rowhead:contains('Downloaded') + td",
            filters: [{ name: "split", args: ["(", 0] }, { name: "trim" }, { name: "parseSize" }],
          },
          ratio: {
            selector: "td.statuslink span:contains('Ratio:') + span",
            filters: [(query: string) => (query === "---" ? -1 : definedFilters.parseNumber(query))],
          },
          seeding: { selector: "img[title='seeders'] + span:first" },
          levelName: { selector: "td.rowhead:contains('Class') + td" },
          bonus: {
            text: "N/A",
          },
          bonusPerHour: {
            text: "N/A",
          },
          seedingSize: {
            selector: "div#kd1 > table.details > tbody",
            elementProcess: (el?: HTMLElement) => {
              if (!el) return 0;
              const trs = el.querySelectorAll("tr");
              let seedingSize = 0;
              trs.forEach((tr) => {
                const sizeTd = tr.querySelector("td:not(.colbrowsehead):nth-child(4)");
                if (!sizeTd) return;
                seedingSize += definedFilters.parseSize((sizeTd as HTMLElement).innerText);
              });
              return seedingSize;
            },
          },
        },
      },
    ],
  },
};

export default class TCG extends PrivateSite {}
