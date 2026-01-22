/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/BakaBT.cs
 */
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import type { ISiteMetadata, ISearchInput, ITorrent } from "../types.ts";
import { definedFilters, buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Anime Series",
  2: "OVA",
  3: "Soundtrack",
  4: "Manga",
  5: "Anime Movie",
  6: "Live Action",
  7: "Artbook",
  8: "Music Video",
  9: "Light Novel",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "bakabt",
  name: "BakaBT",
  aka: ["BBT"],
  description: "BakaBT is a Private site for the Anime Community",
  tags: ["动漫"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://onxnog.zr/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "append", key: "c" },
    },
    {
      name: "成人内容",
      key: "hentai",
      notes: "请先在站点设置中启用 Browse -> Show adult content",
      options: [
        { name: "显示", value: 1 },
        { name: "不显示", value: 0 },
      ],
      generateRequestConfig: (selectedOption) => ({
        requestConfig: { params: { hentai: selectedOption, reorder: 1 } },
      }),
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: {
        only: 0,
        incomplete: 1,
        lossless: 1,
        hd: 1,
        multiaudio: 1,
        bonus: 1,
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: {
        selector: ".torrents tr.torrent, .torrents tr.torrent_alt",
        filter: (rows: HTMLElement[] | null): HTMLElement[] | null => {
          if (!Array.isArray(rows)) return rows;
          return rows.filter((row) => {
            if (row.classList.contains("torrent_alt") && row.textContent === "Alternative versions: ") {
              return false;
            }
            return true;
          });
        },
      },
      id: { selector: ["a.title", "a.alt_title"], attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
      title: { selector: ["a.title", "a.alt_title"], filters: [{ name: "trim" }] },
      subTitle: { selector: "span.tags" },
      url: { selector: ".peers a", attr: "href" },
      category: {
        selector: "span.torrent_icon",
        attr: "title",
        // torrent_alt 行没有类别信息，会在后续方法处理
        filters: [(query: string) => query || "stub"],
      },
      time: {
        selector: ":self",
        elementProcess: (row: HTMLElement) => {
          // 对有 data-timestamp 属性的行直接返回时间戳
          if (row.dataset.timestamp) return parseInt(row.dataset.timestamp);

          // 其它版本行自身没有 data-timestamp 属性，需从子元素中获取
          const timeTd = row.querySelector(".added")! as HTMLElement;
          const timeSpan = timeTd.querySelector("span.datetime");
          if (timeSpan) {
            return parseInt((timeSpan as HTMLElement).dataset.timestamp!);
          }

          // 其它版本种子上传时间如为 today 或 yesterday，无法获取到时间戳，转为手动解析
          const currentDate = new Date();
          if (timeTd.textContent === "yesterday") {
            currentDate.setDate(currentDate.getDate() - 1);
          }
          return currentDate.getTime();
        },
      },
      size: { selector: ".size", filters: [{ name: "parseSize" }] },
      completed: { selector: ".peers:first", filters: [{ name: "split", args: ["/", 0] }, { name: "trim" }] },
      seeders: { selector: ".peers a:nth-child(1)" },
      leechers: { selector: ".peers a:nth-child(2)" },
      tags: [
        {
          name: "Free",
          selector: "span.freeleech",
        },
        {
          name: "Bonus",
          selector: "span.bonus",
          color: "yellow",
        },
        {
          name: "Incomplete",
          selector: "span.incomplete",
          color: "black",
        },
        {
          name: "Hentai",
          selector: "span.hentai",
          color: "pink",
        },
      ],
    },
  },

  detail: {
    urlPattern: [/\/torrent\/(\d+)\/([^/]+)$/],
    selectors: {
      title: { selector: "div.title" },
      link: { selector: ".download_link", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: { selector: "a.username", attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
        },
      },
      {
        requestConfig: { url: "/bonus.php", responseType: "document" },
        selectors: {
          bonusPerHour: { selector: "b.success", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/user/$id$/", responseType: "document" },
        assertion: { id: "url" },
        selectors: {
          name: { selector: "a.username" },
          levelName: {
            selector: "h2 > span",
            filters: [(query: string) => query.match(/^\((.+?) - (.+?)\)$/)![2]],
          },
          messageCount: { selector: "a[href='/inbox.php'] > strong", filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: "td:contains('Join date') + td > span.datetime",
            data: "timestamp",
            filters: [(query: string) => parseInt(query) * 1000],
          },
          lastAccessAt: {
            selector: "td:contains('Last seen') + td > span.datetime",
            data: "timestamp",
            filters: [(query: string) => parseInt(query) * 1000],
          },
          uploaded: {
            selector: "td:contains('Uploaded') + td",
            filters: [{ name: "split", args: ["-", 0] }, { name: "parseSize" }],
          },
          downloaded: {
            selector: "td:contains('Downloaded') + td",
            filters: [{ name: "split", args: ["-", 0] }, { name: "parseSize" }],
          },
          ratio: {
            selector: "td:contains('Share ratio') + td > span",
            filters: [
              (query: string) => {
                if (query === "∞") return -1; // Infinity 不能通过 sendMessage 传递，会导致无返回，使用 -1 替代，前端会自动处理的
                const ratioStr = query.replace(/,/g, "");
                return definedFilters.parseNumber(ratioStr);
              },
            ],
          },
          bonus: { selector: "td:contains('Bonus Points') + td", filters: [{ name: "parseNumber" }] },
          uploads: { selector: "li#uploaded_tab > a", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "li#active_tab > a", filters: [{ name: "parseNumber" }] },
          seedingSize: {
            selector: "div#tab_content > div#active table.torrents > tbody",
            elementProcess: (el: HTMLElement) => {
              const trs = el.querySelectorAll("tr");
              let seedingSize = 0;
              trs.forEach((tr) => {
                const sizeTd = tr.querySelector("td.size");
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

  levelRequirements: [
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "Power User",
      seedingSize: "25GB",
      downloaded: "25GB",
      ratio: 0.5,
      privilege: "View peer lists & report torrents; Access to RSS; Can make up to 5 torrent offers simultaneously.",
    },
  ],
};

export default class BakaBT extends PrivateSite {
  public override async transformSearchPage(
    doc: Document | object | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const torrents = await super.transformSearchPage(doc, searchConfig);

    let lastCat: string | null = null;
    return torrents.map((tor) => {
      if (tor.category === "stub") {
        tor.category = lastCat ?? "";
        return tor;
      } else {
        lastCat = tor.category as string;
        return tor;
      }
    });
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const link = await super.getTorrentDownloadLink(torrent);
    const mockRequestConfig = torrent.url?.startsWith("http") ? { url: torrent.url } : { baseURL: this.url };
    return this.fixLink(link, mockRequestConfig);
  }
}
