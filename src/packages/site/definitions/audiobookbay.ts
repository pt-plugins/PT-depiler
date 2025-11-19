/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/AudioBookBay.cs
 */
import Sizzle from "sizzle";
import type { ISiteMetadata } from "../types";
import { definedFilters } from "../utils";

const titleSelector = { selector: "div.postTitle" };
const categoryOptions = [
  { name: "(Post)apocalyptic", value: 36021 },
  { name: "Action", value: 101 },
  { name: "Adults", value: 23195 },
  { name: "Adventure", value: 232 },
  { name: "Anthology", value: 151 },
  { name: "Art", value: 30 },
  { name: "Autobiography & Biographies", value: 24289 },
  { name: "Bestsellers", value: 16650 },
  { name: "Business", value: 104 },
  { name: "Children", value: 98 },
  { name: "Classic", value: 85 },
  { name: "Computer", value: 233 },
  { name: "Contemporary", value: 231 },
  { name: "Crime", value: 121 },
  { name: "Detective", value: 122 },
  { name: "Doctor Who", value: 15243 },
  { name: "Documentary", value: 107 },
  { name: "Education", value: 105 },
  { name: "Fantasy", value: 65 },
  { name: "Full Cast", value: 17502 },
  { name: "Gay", value: 17180 },
  { name: "General Fiction", value: 21110 },
  { name: "Historical Fiction", value: 2315 },
  { name: "History", value: 19 },
  { name: "Horror", value: 2551 },
  { name: "Humor", value: 234 },
  { name: "Lecture", value: 115 },
  { name: "Lesbian", value: 20962 },
  { name: "LGBT", value: 20404 },
  { name: "Libertarian", value: 23198 },
  { name: "Light Novel", value: 20738 },
  { name: "Literature", value: 76 },
  { name: "LitRPG", value: 30126 },
  { name: "Military", value: 790 },
  { name: "Misc. Non-fiction", value: 25881 },
  { name: "Mystery", value: 111 },
  { name: "Novel", value: 108 },
  { name: "Other", value: 1 },
  { name: "Paranormal", value: 235 },
  { name: "Plays & Theater", value: 26398 },
  { name: "Poetry", value: 1699 },
  { name: "Political", value: 2010 },
  { name: "Radio Productions", value: 26397 },
  { name: "Romance", value: 103 },
  { name: "Sci-Fi", value: 100 },
  { name: "Science", value: 99 },
  { name: "Self-help", value: 1663 },
  { name: "Sex Scenes", value: 23197 },
  { name: "Short Story", value: 16706 },
  { name: "Spiritual & Religious", value: 22 },
  { name: "Sport & Recreation", value: 432 },
  { name: "Suspense", value: 156 },
  { name: "Teen & Young Adult", value: 2986 },
  { name: "Thriller", value: 102 },
  { name: "True Crime", value: 11685 },
  { name: "Tutorial", value: 110 },
  { name: "Violence", value: 6322 },
  { name: "Westerns", value: 26010 },
  { name: "Zombies", value: 23196 },
];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "audiobookbay",
  name: "AudioBook Bay",
  aka: ["ABB"],
  description: "AudioBook Bay (ABB) is a Public Torrent Tracker for AUDIOBOOKS",
  tags: ["有声书"],
  timezoneOffset: "+0100",

  type: "public",
  urls: [
    "https://audiobookbay.lu/",
    "http://audiobookbay.is/",
    "http://audiobookbay.se/",
    "http://audiobookbay.fi/",
    "http://audiobookbay.ws/",
    "http://theaudiobookbay.se/",
  ],

  category: [
    {
      name: "Categories",
      key: "cat",
      options: categoryOptions,
      cross: { mode: "comma" },
    },
  ],

  search: {
    keywordPath: "params.s",
    requestConfig: {
      url: "/",
      responseType: "document",
      params: {
        tt: 1, // only search for title & author
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    requestConfigTransformer: ({ requestConfig }) => {
      return {
        ...requestConfig,
        params: {
          ...requestConfig?.params,
          s: (requestConfig?.params.s as string | undefined)?.replace(/[\W]+/g, " ").trim().toLowerCase(),
        },
      };
    },
    selectors: {
      rows: { selector: "div.post:has(div[class='postTitle'])" },
      category: { text: "Audiobooks" },
      title: titleSelector,
      url: { selector: "div.postTitle h2 a", attr: "href" },
      size: {
        selector: "div.postContent",
        filters: [
          (query: string) => {
            const matchSize = query.match(/File Size: (.+?)s/);
            return matchSize ? definedFilters.parseSize(matchSize[1]) : 0;
          },
        ],
      },
      time: {
        selector: "div.postContent",
        filters: [
          (query: string) => {
            const matchDateAdded = query.match(/Posted: (\d{1,2} \D{3} \d{4})/);
            return matchDateAdded ? definedFilters.parseTime(matchDateAdded[1]) : null;
          },
        ],
      },
      subTitle: {
        selector: "div.postInfo",
        filters: [
          (query: string) => {
            const matchGenres = query.match(/Category:\s+(.+?)(?=\s+(Language:|Keywords:))/s);
            return matchGenres ? matchGenres[1].trim().split("\xA0 ").join(" / ") : "";
          },
        ],
      },
      seeders: { text: "N/A" },
      leechers: { text: "N/A" },
      completed: { text: "N/A" },
    },
  },

  list: [
    {
      excludeUrlPattern: ["/abss/"],
    },
  ],

  detail: {
    urlPattern: ["/abss/"],
    selectors: {
      title: titleSelector,
      link: {
        selector: ":self",
        elementProcess: (doc: Document) => {
          const title = Sizzle(titleSelector.selector, doc)[0].textContent;
          const hash = Sizzle("td:contains('Info Hash:') ~ td", doc)[0].textContent;
          const trackers = Sizzle("td:contains('Tracker:') ~ td", doc).map((td) => td.textContent);
          return infoHashToPublicMagnet(hash, title, trackers) || "";
        },
      },
    },
  },
};

function infoHashToPublicMagnet(infoHash: string, title: string, trackers: string[]): string | null {
  if (!infoHash.trim() || !title.trim()) {
    return null;
  }
  const encodedTitle = encodeURIComponent(title);
  const trackerParams = new URLSearchParams();
  trackers.forEach((tr) => {
    trackerParams.append("tr", tr);
  });

  return `magnet:?xt=urn:btih:${infoHash}&dn=${encodedTitle}&${trackerParams.toString()}`;
}
