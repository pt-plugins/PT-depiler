import type { ISiteMetadata, ITorrent } from "../types";
import Sizzle from "sizzle";
import dayjs from "../utils/datetime";
import PrivateSite from "../schemas/AbstractPrivateSite";

export const siteMetadata: ISiteMetadata = {
  name: "MoreThanTV",
  type: "private",
  timezoneOffset: "+0000",
  description: "MTV",
  // schema: 'Luminance',
  tags: ["电视剧", "剧集"],
  url: "https://www.morethantv.me/",
  collaborator: ["luckiestone"],
  formerHosts: ["www.morethan.tv"],
  search: {
    keywordsParam: "searchtext",
    requestConfig: {
      url: "/torrents.php",
      params: {
        order_by: "time",
        order_way: "desc",
      },
    },
    advanceKeyword: {
      imdb: {
        skip: true
      }
    },
    selectors: {
      // 建立group基本信息: category, title, url, time, size, author , seeders, leechers, completed, comments
      // rows: '#torrent_table > tbody > tr.torrent'
      category: { selector: ".cats_col div", attr: "title" },
      title: { selector: 'a[href^="/torrents.php?id="]' },
      url: { selector: 'a[href^="/torrents.php?id="]', attr: "href" },
      time: {
        selector: "span.time[title]",
        attr: "title",
        filters: [(query: string) => query + ":00"],
      },
      size: { selector: "> td:nth-last-child(5)" },
      author: { selector: "> td:nth-last-child(1)" },
      seeders: { selector: "> td:nth-last-child(3)" },
      leechers: { selector: "> td:nth-last-child(2)" },
      completed: { selector: "> td:nth-last-child(4)" },
      comments: { selector: "> td:nth-last-child(7)" },

      // 建立种子相关信息： id, link, subTitle
      // 这里有个顶层 selector: 'td:has(> .torrent_icon_container:has(a[href^="/torrents.php?action=download"]))'
      id: {
        selector: 'a[href^="/torrents.php?action=download"]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      link: {
        selector: 'a[href^="/torrents.php?action=download"]',
        attr: "href",
      },
      subTitle: { selector: ":self" },
    },
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: "/index.php" },
        fields: ["id", "name", "messageCount"],
      },
      {
        requestConfig: { url: "/user.php" },
        assertion: { id: "id" },
        fields: [
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime",
          "bonus",
          "seeding",
          "seedingSize",
        ],
      },
    ],
    selectors: {
      id: {
        selector: ["a.username[href*='user.php']:first"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }, parseInt],
      },
      name: {
        selector: ["a.username[href*='user.php']:first"],
      },
      messageCount: {
        selector: ["div.alert-bar > a[href*='inbox.php']", "div.alertbar > a[href*='inbox.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },
      // 'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus', 'joinTime', 'bonus', 'seeding', 'seedingSize'
      uploaded: {
        selector: "ul.stats > li:contains('Uploaded'):contains('B')",
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: "ul.stats > li:contains('Downloaded')",
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: "ul.stats > li:contains('Ratio:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/Ratio.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      levelName: {
        selector: "ul.stats > li:contains('Class:')",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/Class:.+?(.+)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : 0;
          },
        ],
      },
      bonus: {
        selector: "#stats_credits",
        filters: [(query: string) => parseFloat(query.replace(",", ""))],
      },
      joinTime: {
        selector: ["ul.stats > li:contains('Joined:') > span"],
        elementProcess: (element: HTMLElement) => {
          const time = element.getAttribute("title") || element.innerText;
          return dayjs(time).isValid() ? dayjs(time).valueOf() : time;
        },
      },
      seeding: {
        selector: 'ul.stats > li:contains("Seeding:")',
        filters: [
          (query: string) => {
            const queryMatch = query.replace(",", "").match(/Seeding:.+?(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },
      seedingSize: {
        selector: 'ul.stats > li:contains("Seeding Size:")',
        filters: [{ name: "parseSize" }],
      },
    },
  },
};

export default class morethantv extends PrivateSite {
  protected override async transformSearchPage(doc: Document): Promise<ITorrent[]> {
    const torrents: ITorrent[] = [];
    const trs = Sizzle("#torrent_table > tbody > tr.torrent", doc);
    trs.forEach((tr) => {
      // 建立group基本信息: category, title, url, time, size, author , seeders, leechers, completed, comments
      const groupInfo = this.getFieldsData(tr, "search", [
        "category",
        "title",
        "url",
        "time",
        "size",
        "author",
        "seeders",
        "leechers",
        "completed",
        "comments",
      ]);

      // 搜索种子信息 id, link, subTitle
      const torrentAnother = Sizzle(
        'td:has(> .torrent_icon_container:has(a[href^="/torrents.php?action=download"]))',
        tr
      );
      torrentAnother.forEach((t) => {
        const torrentInfo = this.getFieldsData(t, "search", ["id", "link", "subTitle"]);
        torrents.push({ ...groupInfo, ...torrentInfo } as ITorrent); // 将 groupInfo 和 torrentInfo 合并作为种子信息
      });
    });

    return torrents;
  }
}
