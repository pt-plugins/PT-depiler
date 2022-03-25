import { ISiteMetadata, IUserInfo } from "../types";
import { parseSizeString } from "../utils";
import Sizzle from "sizzle";
import PrivateSite from "../schema/AbstractPrivateSite";

export const siteMetadata: ISiteMetadata = {
  name: "Cinematik",
  type: "private",
  timezoneOffset: "+0000",
  url: "https://www.cinematik.net/",
  tags: ["影视"],
  host: "www.cinematik.net",
  collaborator: "DXV5",
  search: {
    keywordsParam: "search",
    requestConfig: {
      url: "/browse.php",
      params: {
        incldead: 1,
      },
    },
    selectors: {
      rows: { selector: 'table[border="1"] tr:not(:first-child)' },
      id: {
        selector: 'a[href^="details.php?id="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "td:nth-child(2) a" },
      url: { selector: 'a[href^="details.php?id="]', attr: "href" },
      link: {
        selector: 'a[href^="details.php?id="]',
        attr: "href",
        filters: [(q: string) => q.replace("details.php?id=", "download.php?id=")],
      },
      time: { selector: "td:nth-child(11) div.addedtor" },
      size: { selector: "td:nth-child(7)" },
      category: { text: "ALL" },
      seeders: { selector: "td:nth-child(9)" },
      leechers: { selector: "td:nth-child(10)" },
      completed: {
        selector: "td:nth-child(8)",
        filters: [{ name: "parseNumber" }],
      },
      tags: [
        { name: "Free", selector: "img[src*='freedownload.png']" },
        { name: "2xFree", selector: "img[src*='platinumdownload.png']" },
        { name: "25%", selector: "img[src*='silverdownload.png']" },
      ],
    },
  },
  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        fields: ["id"],
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "id" },
        fields: ["name", "uploaded", "downloaded", "levelName", "bonus", "joinTime"],
      },
      /**
       * 需要翻页，不能这样处理
      {
        requestConfig: { url: '/userdetails-tab.php', params: { SID: '', mode: 7, page: 0 } },
        assertion: { id: 'id' },
        fields: ['seeding', 'seedingSize']
      }
       */
    ],
    selectors: {
      id: {
        selector: "div#menu a[href*='userdetails.php']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: "table.mainouter > tbody > tr > td > table.main h1",
      },
      uploaded: {
        selector: "#user-default td.rowhead:contains('Uploaded') + td",
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: "#user-default td.rowhead:contains('Downloaded') + td",
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: "#user-default td.rowhead:contains('Class') + td",
      },
      bonus: {
        text: "N/A",
      },
      joinTime: {
        selector: "#user-default td.rowhead:contains('Join') + td",
        filters: [(query: string) => query.split(" (")[0], { name: "parseTime" }],
      },
      seeding: {
        selector: "table:first",
        elementProcess: (table: HTMLTableElement) => {
          const trAnothers = Sizzle("tr:not(:eq(0))", table);
          return trAnothers.length;
        },
      },
      seedingSize: {
        selector: "table:first",
        elementProcess: (table: HTMLTableElement) => {
          let seedingSize = 0;
          const trAnothers = Sizzle("tr:not(:eq(0))", table);
          trAnothers.forEach((trAnother) => {
            const sizeAnother = Sizzle("td:eq(4)", trAnother)[0];
            seedingSize += parseSizeString((sizeAnother as HTMLElement).innerText.trim());
          });
        },
      },
    },
  },
};

export default class cinematik extends PrivateSite {
  public override async flushUserInfo(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let userInfo = await super.flushUserInfo();
    if (userInfo.id && (!userInfo.seeding || !userInfo.seedingSize)) {
      userInfo = { seeding: 0, seedingSize: 0, ...userInfo };
      for (const pageInfo = { current: 0, count: 0 }; pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const { data: TLDocument } = await this.request<Document>({
          url: "/userdetails-tab.php",
          params: { SID: "", mode: 7, page: pageInfo.current },
          responseType: "document",
        });

        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TLDocument, {
            selector: "a[href*='type=seeding']:contains('1'):last",
            attr: "href",
            filters: [(q: string) => parseInt((new URL(q)).searchParams.get('page') || '-1')],
          });
        }

        const { seeding, seedingSize } = this.getFieldsData(TLDocument, "userInfo", ["seeding", "seedingSize"]);
        userInfo.seeding += seeding;
        userInfo.seedingSize += seedingSize;
      }
    }
    return userInfo;
  }
}
