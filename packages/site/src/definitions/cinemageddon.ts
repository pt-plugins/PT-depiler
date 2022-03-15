import type { ISiteMetadata } from "../types";
import { findThenParseSizeString } from "../utils";
import dayjs from "../utils/datetime";
import Sizzle from "sizzle";

export const siteMetadata: ISiteMetadata = {
  name: "CinemaGeddon",
  type: "private",
  timezoneOffset: "-0700", // FIXME 按照 Jackett 的情况修正
  url: "https://cinemageddon.net/",
  tags: ["影视"],
  collaborator: "DXV5",
  category: {
    key: "c",
    options: [
      { value: 1, name: "Action" },
      { value: 2, name: "Horror" },
      { value: 3, name: "Martial Arts" },
      { value: 4, name: "Comedy" },
      { value: 5, name: "Other" },
      { value: 6, name: "Hidden Gems" },
      { value: 7, name: "Sci-Fi" },
      { value: 8, name: "Gore" },
      { value: 9, name: "Exploitation" },
      { value: 11, name: "OST" },
      { value: 12, name: "XXX" },
      { value: 13, name: "Thriller" },
      { value: 14, name: "Adventure" },
      { value: 15, name: "Documentary" },
      { value: 16, name: "Western" },
      { value: 17, name: "Family" },
      { value: 18, name: "Drama" },
      { value: 19, name: "Ebooks" },
      { value: 20, name: "Softcore" },
      { value: 21, name: "Tinfoil Hat" },
      { value: 22, name: "Trailers" },
    ],
    cross: { mode: "append" },
  },
  search: {
    keywordsParam: "search",
    requestConfig: {
      url: "/browse.php",
      params: { proj: 0 },
    },
    selectors: {
      rows: {
        selector: 'table.torrenttable > tbody > tr:has(a[href*="browse.php?cat="])',
      },
      id: {
        selector: 'a[href*="details.php?id="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: 'a[href*="details.php?id="]' },
      url: { selector: 'a[href*="details.php?id="]', attr: "href" },
      link: { selector: 'a[href*="download.php?id="]', attr: "href" },
      time: { selector: "td:nth-child(4)" },
      size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
      author: { selector: "td:eq(8)" },
      category: {
        selector: 'a[href*="browse.php?cat="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }],
      },
      seeders: { selector: "td:nth-child(7)" },
      leechers: { selector: "td:nth-child(8)" },
      completed: { selector: "td:nth-child(6)" },
    },
  },
  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/" },
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "id" },
        fields: ["uploaded", "downloaded", "levelName", "messageCount", "bonus", "joinTime", "seeding", "seedingSize"],
      },
    ],
    selectors: {
      // page: '/'
      id: {
        selector: ".statusbar a[href*='/userdetails.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: ".statusbar a[href*='/userdetails.php?id=']",
      },
      // page: '/userdetails.php?id=$user.id$',
      uploaded: {
        selector: ["td.clx > .frames td.rowhead:contains('Uploaded') + td:first"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["td.clx > .frames td.rowhead:contains('Downloaded') + td:first"],
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: "td.clx > .frames td.rowhead:contains('Class') + td:first",
      },
      messageCount: {
        selector: ["div.alert a[href*='messages.php']"],
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: ["a[href='/credits.php']"],
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: "td.clx > .frames td.rowhead:contains('Join') + td:first",
        filters: [
          (query: string) => {
            const timeString = query.split(" (")[0];
            return dayjs(timeString).isValid() ? dayjs(timeString).valueOf() : timeString;
          },
        ],
      },
      // FIXME 我对这两块情况暂时存疑，不过先抄过来吧
      seeding: {
        selector: ["div#ka2 table:first"],
        elementProcess: (table: HTMLTableElement) => {
          const trAnothers = Sizzle("tr:gt(0)", table);
          return trAnothers.length;
        },
      },
      seedingSize: {
        selector: ["div#ka2 table:first tr:not(:eq(0))"],
        elementProcess: (table: HTMLTableElement) => {
          let seedingSize = 0;
          const trAnothers = Sizzle("tr:gt(0)", table);
          trAnothers.forEach((trAnother) => {
            const sizeAnother = Sizzle("td:eq(2)", trAnother);
            seedingSize += findThenParseSizeString((sizeAnother[0] as HTMLTableCellElement).innerText.trim());
          });
          return seedingSize;
        },
      },
    },
  },
};
