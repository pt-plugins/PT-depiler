import type { ISiteMetadata } from "../types";

const nextTextSibling = (element: HTMLElement) => {
  return (element.nextSibling as Text).textContent?.trim() || "";
};

export const siteMetadata: ISiteMetadata = {
  name: "TG",
  type: "private",
  timezoneOffset: "+0000",
  description: "TheGeeks",
  url: "https://thegeeks.click/",
  favicon: "https://thegeeks.click/favicon.ico",
  tags: ["学习"],
  host: "thegeeks.click",
  allowSearch: false,
  userInfo: {
    process: [
      {
        requestConfig: { url: "/main.php" },
        fields: [
          "id",
          "name",
          "messageCount",
          "uploaded",
          "downloaded",
          "ratio",
          "seeding",
          "seedingSize",
          "levelName",
        ],
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "id" },
        fields: ["bonus", "joinTime"],
      },
    ],
    selectors: {
      id: {
        selector: "a[href*='userdetails.php?id=']:first",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: { selector: "a[href*='userdetails.php?id=']:first" },
      messageCount: {
        selector: "a[href='message.php?action=viewmailbox'] + b",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+ New)/);
            return queryMatch && queryMatch.length >= 2
              ? parseInt(queryMatch[1])
              : 0;
          },
        ],
      },
      uploaded: {
        selector: "td.statuslink span:contains('UL:'):first",
        elementProcess: nextTextSibling,
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: "td.statuslink span:contains('DL:'):first",
        elementProcess: nextTextSibling,
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: "td.statuslink span:contains('Ratio:') + span",
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            return query === "---" ? "N/A" : parseFloat(query);
          },
        ],
      },
      seeding: { selector: "img[title='seeders'] + span:first" },
      seedingSize: { text: -1 },
      levelName: {
        selector: "a[href*='userdetails.php?id='] + span:first",
        filters: [(query: string) => query.replace(/[()]/g, "")],
      },
      bonus: { text: "N/A" },
      joinTime: {
        selector: ".embedded td:contains('Join date') + td:first",
        filters: [
          (query: string) => query.replace(/\(.*\)/g, "").trim(),
          { name: "parseTime" },
        ],
      },
    },
  }
};
