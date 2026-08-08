import type { ISiteMetadata } from "../types";
import { buildCategoryOptionsFromDict, parseSizeString, parseValidTimeString } from "../utils";

const categoryMap: Record<number, string> = {
  1: "Retro",
  2: "Modern",
  3: "Feature",
  4: "Anime",
  5: "OVA",
  6: "Shorts",
  7: "Indie",
  8: "Adult",
  9: "CGI",
  10: "Clay",
  11: "Comics",
  12: "Manga",
  13: "Art",
  14: "OST",
  15: "Ads",
};

const downloadLinkQuery = {
  selector: 'a[href^="download.php?id="]',
  attr: "href",
} as const;

const detailLinkQuery = {
  selector: 'a[href^="details.php?id="]',
  attr: "href",
} as const;

const userStatsSelector = 'td.clear:has(a[href*="bonus.php"])';
const peerInfoRootSelector = "html";

function getPeerRows(root: HTMLElement, sectionName: "Seeding" | "Leeching"): HTMLTableRowElement[] {
  const peerSection =
    root.querySelector<HTMLElement>("div[id='k3']") ?? root.querySelector<HTMLElement>("body") ?? root;

  const sectionChildren = Array.from(peerSection.children);
  const headingIndex = sectionChildren.findIndex(
    (element) => element.tagName === "B" && element.textContent?.trim() === `${sectionName}:`,
  );
  if (headingIndex === -1) return [];

  const table = sectionChildren.slice(headingIndex + 1).find((element) => element.tagName === "TABLE");
  if (!table) return [];

  return Array.from(table.querySelectorAll("tr")).filter(
    (row): row is HTMLTableRowElement => !row.querySelector("td.colhead"),
  );
}

export const siteMetadata: ISiteMetadata = {
  id: "retrotoon",
  version: 1,
  name: "RetroToon World",
  aka: ["RetroToon", "RTW"],
  description: "RetroToon World is a Private Torrent Tracker for ANIMATED MOVIES / TV",
  tags: ["动画", "电视剧"],
  timezoneOffset: "+1200",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://ergebgbba.jbeyq/"],
  favicon: "https://retrotoon.world/favicon.ico",

  noLoginAssert: {
    urlPatterns: [/login\.php|takelogin\.php/i],
    matchSelectors: ["form#loginForm"],
  },

  category: [
    {
      name: "类别",
      key: "c",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "append" },
    },
  ],

  search: {
    keywordPath: "params.q",
    skipNonLatinCharacters: true,
    requestConfig: {
      url: "/ajax_tsearch.php",
      responseType: "document",
      params: {
        sort: 4,
        type: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: {
        selector: 'tr.torrent-row:has(a[href^="download.php?id="])',
      },
      id: {
        ...downloadLinkQuery,
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: 'a[href^="details.php?id="]' },
      url: detailLinkQuery,
      link: downloadLinkQuery,
      category: {
        selector: 'a[href^="browse.php?cat="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }, (query: string) => categoryMap[Number(query)] ?? "Other"],
      },
      time: {
        selector: "td:nth-child(6)",
        elementProcess: (element: HTMLElement) =>
          parseValidTimeString(element.textContent?.replace(/\s+/g, "") ?? "", ["yyyy-MM-ddHH:mm:ss"]),
      },
      size: { selector: "td:nth-child(7)", filters: [{ name: "parseSize" }] },
      completed: { selector: "td:nth-child(8)", filters: [{ name: "parseNumber" }] },
      seeders: { selector: "td:nth-child(9)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(10)", filters: [{ name: "parseNumber" }] },
      tags: [{ name: "Free", selector: "span:contains('FREE')", color: "blue" }],
    },
  },

  list: [
    {
      urlPattern: [/\/browse\.php(?:\?.*)?$/i],
    },
  ],

  detail: {
    urlPattern: [/\/details\.php\?id=\d+/i],
    selectors: {
      title: { selector: 'a[href^="download.php?id="]' },
      link: downloadLinkQuery,
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        selectors: {
          id: {
            selector: 'a[href*="userdetails.php?id="]:first',
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: 'a[href*="userdetails.php?id="]:first' },
          messageCount: {
            text: 0,
            selector: ['a[href*="messages.php"]', 'a[href*="inbox.php"]'],
            filters: [{ name: "parseNumber" }],
          },
          uploaded: {
            selector: userStatsSelector,
            filters: [
              (query: string) => query.match(/Uploaded:\s*([\d.]+\s*[A-Z]?i?B)/i)?.[1] ?? "0 B",
              { name: "parseSize" },
            ],
          },
          downloaded: {
            selector: userStatsSelector,
            filters: [
              (query: string) => query.match(/Downloaded:\s*([\d.]+\s*[A-Z]?i?B)/i)?.[1] ?? "0 B",
              { name: "parseSize" },
            ],
          },
          ratio: {
            selector: userStatsSelector,
            filters: [
              (query: string) => {
                const value = query.match(/Ratio:\s*(∞|[\d.]+)/i)?.[1];
                return value === "∞" ? -1 : Number(value ?? 0);
              },
            ],
          },
          bonus: {
            selector: 'a[href*="bonus.php"]',
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          joinTime: {
            selector: "td.rowhead:contains('Join'):contains('date') + td",
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
          lastAccessAt: {
            selector: "td.rowhead:contains('Last'):contains('seen') + td",
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
          uploads: {
            selector: "a[href*=\"klappe_news('4')\"]",
            filters: [{ name: "parseNumber" }],
          },
          posts: {
            selector: "td.rowhead:contains('Forum posts') + td",
            filters: [{ name: "parseNumber" }],
          },
          levelName: {
            selector: "td.rowhead:contains('Class') + td",
          },
        },
      },
      {
        // The peer tables are loaded asynchronously and are absent from the raw user-details response.
        requestConfig: {
          url: "/ajax_peers.php",
          responseType: "document",
          params: {},
        },
        assertion: { id: "params.id" },
        requestConfigTransformer: (config) => {
          config.params = { ...config.params, rand: Date.now() };
          return config;
        },
        selectors: {
          seeding: {
            text: 0,
            selector: peerInfoRootSelector,
            elementProcess: (element: HTMLElement) => getPeerRows(element, "Seeding").length,
          },
          seedingSize: {
            text: 0,
            selector: peerInfoRootSelector,
            elementProcess: (element: HTMLElement) =>
              getPeerRows(element, "Seeding").reduce(
                (sum, row) => sum + parseSizeString(row.children[2]?.textContent?.trim() ?? "0 B"),
                0,
              ),
          },
          leeching: {
            text: 0,
            selector: peerInfoRootSelector,
            elementProcess: (element: HTMLElement) => getPeerRows(element, "Leeching").length,
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: "Sketch",
      nameAka: ["Toon"],
      privilege: "Initial user class.",
    },
    {
      id: 1,
      name: "Toon Hero",
      interval: "P60D",
      uploaded: "50GB",
      ratio: 1.05,
    },
    {
      id: 2,
      name: "Toon Legend",
      interval: "P180D",
      uploaded: "250GB",
      ratio: 2.05,
    },
    {
      id: 3,
      name: "Toon Superstar",
      interval: "P360D",
      uploaded: "1500GB",
      ratio: 2.05,
    },
  ],
};
