import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import type { ISearchInput, ISiteMetadata, ITorrent, ITorrentTag, IUserInfo } from "../types";
import { parseSizeString, parseValidTimeString } from "../utils";

const categoryOptions = [
  { value: 1, name: "Movie" },
  { value: 2, name: "Music" },
  { value: 3, name: "Literature" },
];

function parseKgDate(query: string): number | string {
  const normalized = query
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(/^([A-Za-z]{3})\s+(\d{1,2})\s+'(\d{2})/);
  if (!match) return normalized;

  return parseValidTimeString(`${match[2]} ${match[1]} ${match[3]}`, ["d MMM yy"]);
}

function getCellText(row: Element, cellIndex: number): string {
  return row.querySelector(`td:nth-child(${cellIndex})`)?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function getElementText(element: Element | undefined): string {
  return element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function getRowSubTitle(row: Element): string {
  const titleCell = row.querySelector("td:nth-child(2)");
  const subs = titleCell?.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const director = getCellText(row, 3);
  const year = getCellText(row, 4);
  const genre = getCellText(row, 5);
  const country = row.querySelector("a[href^='browse.php?country='] img")?.getAttribute("title") ?? "";

  return [director, year, country, genre, subs].filter(Boolean).join(" / ");
}

function getHeaderColumnIndex(table: Element, headerName: string): number | undefined {
  const headerRow = Array.from(table.querySelectorAll("tr")).find((row) =>
    Array.from(row.children).some((cell) => getElementText(cell) === headerName),
  );

  if (!headerRow) {
    return undefined;
  }

  let columnIndex = 0;
  for (const cell of Array.from(headerRow.children)) {
    if (getElementText(cell) === headerName) {
      return columnIndex;
    }

    columnIndex += (cell as HTMLTableCellElement).colSpan || 1;
  }

  return undefined;
}

function getCellByColumnIndex(row: Element, columnIndex: number): Element | undefined {
  let currentColumnIndex = 0;

  for (const cell of Array.from(row.children)) {
    const colSpan = (cell as HTMLTableCellElement).colSpan || 1;
    if (columnIndex >= currentColumnIndex && columnIndex < currentColumnIndex + colSpan) {
      return cell;
    }

    currentColumnIndex += colSpan;
  }

  return undefined;
}

function sumCurrentSeedingTableSize(table: Element): number {
  const sizeColumnIndex = getHeaderColumnIndex(table, "Size") ?? 10;

  return Array.from(table.querySelectorAll("tr"))
    .filter((row) => row.querySelector("a[href^='details.php?id=']"))
    .reduce((total, row) => total + parseSizeString(getElementText(getCellByColumnIndex(row, sizeColumnIndex))), 0);
}

function parseUploadedTorrentCount(query: string): number {
  const normalized = query
    .replace(/,/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const parenthesizedCount = normalized.match(/\((\d+)\s*(?:uploads?|torrents?)?\)/i);
  const labelledCount =
    normalized.match(/(?:uploads?|torrents?)\D+(\d+)/i) ?? normalized.match(/(\d+)\s*(?:uploads?|torrents?)/i);
  const match = parenthesizedCount ?? labelledCount;

  return match ? parseInt(match[1], 10) : 0;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "karagarga",
  name: "KaraGarga",
  aka: ["KG"],
  description: "KaraGarga is a private tracker for non-mainstream movies, music and literature.",
  tags: ["电影", "音乐", "文学"],
  timezoneOffset: "+0000",
  collaborator: ["luckiestone"],

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://karagarga.in/"],
  favicon: "https://karagarga.in/favicon.ico",

  noLoginAssert: {
    urlPatterns: [/login\.php|takelogin\.php/],
    matchSelectors: ["form[action='takelogin.php']"],
  },

  category: [
    {
      name: "Category",
      key: "cat",
      options: categoryOptions,
    },
    {
      name: "Freeleech",
      key: "fl",
      options: [{ value: 1, name: "Freeleech" }],
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: {
        search_type: "torrent",
        cat: 0,
        genre: "",
        subgenre: "",
        country: 0,
        hdrip: "",
        incldead: "",
        source: "",
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfig: {
          params: {
            search_type: "imdb",
          },
        },
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params.search = keywords?.replace(/^tt/i, "") ?? "";
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: 'table#browse > tbody > tr:has(a[href^="details.php?id="])' },
      id: {
        selector: 'a[href^="details.php?id="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: 'a[href^="details.php?id="] > b' },
      subTitle: { selector: ":self", elementProcess: getRowSubTitle },
      url: { selector: 'a[href^="details.php?id="]', attr: "href" },
      link: { selector: 'a[href^="/down.php/"]', attr: "href" },
      time: { selector: "td:nth-child(9)", filters: [parseKgDate] },
      size: { selector: "td:nth-child(11)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(13)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(14)", filters: [{ name: "parseNumber" }] },
      completed: { selector: "td:nth-child(12)", filters: [{ name: "parseNumber" }] },
      comments: { selector: "td:nth-child(7)", filters: [{ name: "parseNumber" }] },
      author: { selector: "td:nth-child(8)" },
      category: {
        selector: 'a[href^="browse.php?genre="] img',
        attr: "title",
        filters: [(query: string) => query.split(":")[0]],
      },
      ext_imdb: {
        selector: 'a[href*="imdb.com/title/tt"]',
        attr: "href",
        filters: [{ name: "extImdbId" }],
      },
      tags: [
        { selector: "span:contains('Freeleech')", name: "Free", color: "blue" },
        { selector: "span:contains('Featured')", name: "Featured", color: "purple" },
        { selector: "font:contains('[NEW!]')", name: "New", color: "green" },
        { selector: "span[title*='dead torrent back to life']", name: "Bumped", color: "green" },
        { selector: "img[title^='CURRENT']", name: "MoM", color: "orange" },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/browse\\.php", "/current\\.php\\?id=\\d+", "/history\\.php\\?id=\\d+"],
      selectors: {
        keywords: {
          selector: 'input[name="search"]',
          elementProcess: (element: HTMLInputElement) => element.value,
        },
      },
    },
  ],

  detail: {
    urlPattern: ["/details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: "table.main h1:first" },
      link: { selector: ["a.index[href*='down.php']", 'a[href^="/down.php/"]'], attr: "href" },
      size: {
        selector: "td.heading:contains('Size') + td",
        filters: [{ name: "split", args: ["(", 0] }, { name: "parseSize" }],
      },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: {
            selector: "a[title='click to see your details page']:last",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[title='click to see your details page']:last" },
          messageCount: {
            selector: "td[style*='background: #DF0101'] a[href*='messages.php']",
            filters: [{ name: "parseNumber" }],
          },
          bonus: { text: "N/A" },
          bonusPerHour: { text: "N/A" },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: { selector: "td.rowhead:contains('Uploaded') + td", filters: [{ name: "parseSize" }] },
          uploads: {
            selector: "td.rowhead:contains('Uploaded') + td",
            filters: [parseUploadedTorrentCount],
          },
          downloaded: { selector: "td.rowhead:contains('Downloaded') + td", filters: [{ name: "parseSize" }] },
          ratio: {
            selector: "td.rowhead:contains('Share ratio') + td > table > tbody > tr > td:nth-child(1) > font",
            filters: [{ name: "parseNumber" }],
          },
          levelName: { selector: "td.rowhead:contains('Class') + td" },
          joinTime: {
            selector: "td.rowhead:contains('Join'):contains('date') + td",
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
        },
      },
      {
        requestConfig: { url: "/current.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          seeding: {
            selector: "table#browse",
            elementProcess: (table: Element) =>
              Array.from(table.querySelectorAll("tr")).filter((row) => row.querySelector("a[href^='details.php?id=']"))
                .length,
          },
          seedingSize: { selector: "table#browse", elementProcess: sumCurrentSeedingTableSize },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P13W",
      uploaded: "50GB",
      ratio: 1.05,
    },
  ],
};

export default class KaraGarga extends PrivateSite {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const userInfo = await super.getUserInfoResult(lastUserInfo);
    const userInfoRecord = userInfo as Record<string, unknown>;

    userInfoRecord.bonus = "N/A";
    userInfoRecord.bonusPerHour = "N/A";

    return userInfo;
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    torrent = super.parseTorrentRowForTags(torrent, row, searchConfig);

    if (row instanceof Element) {
      const tags = (torrent.tags ?? []) as ITorrentTag[];
      if (row.classList.contains("freeleechrow") && !tags.some((tag) => tag.name === "Free")) {
        tags.push({ name: "Free", color: "blue" });
      }
      if (row.classList.contains("featuredrow") && !tags.some((tag) => tag.name === "Featured")) {
        tags.push({ name: "Featured", color: "purple" });
      }
      torrent.tags = tags;
    }

    return torrent;
  }
}
