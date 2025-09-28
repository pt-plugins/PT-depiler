/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/thegeeks.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/1302
 */
import type { ISiteMetadata } from "../types.ts";
import { definedFilters } from "../utils.ts";
import { set } from "es-toolkit/compat";

const categoryMap: Record<number, string> = {
  212: "AudioBook : Fiction",
  213: "AudioBook : Non-Fiction",
  71: "Docu : Antiques / Collecting",
  82: "Docu : Architecture/Building",
  72: "Docu : Astronomy / Space",
  85: "Docu : Childrens Ed",
  38: "Docu : Crime/ Investigation",
  59: "Docu : Earth / Environment",
  18: "Docu : Engineering",
  4: "Docu : Fine/Visual Arts",
  39: "Docu : FlyOnWall Docus",
  216: "Docu : FlyOnWall Medical",
  84: "Docu : FrontLine",
  36: "Docu : Gardening/Agriculture",
  58: "Docu : History - Biographies",
  55: "Docu : History - Civilization",
  31: "Docu : History - Misc",
  56: "Docu : History - War/Politics",
  35: "Docu : Home / Property",
  78: "Docu : Horizon",
  69: "Docu : Misc",
  75: "Docu : Nature",
  54: "Docu : News/World Reports",
  83: "Docu : Nova",
  27: "Docu : Paleontology",
  67: "Docu : Pets/Animal Keeping",
  53: "Docu : Social Experiment",
  32: "Docu : Travel / Culture",
  80: "Docu : Travelogues",
  34: "Docu : Vehicles/Transport",
  207: "Business : Economics",
  211: "Business : Investing",
  208: "Business : Marketing",
  209: "Business : Startup/Dev",
  28: "Business :Misc",
  214: "Comp: Artificial Intelligence",
  40: "Comp: Certification Courses",
  44: "Comp: Digital Audio/Video",
  48: "Comp: Games Dev/Guides",
  3: "Comp: Graphics ",
  42: "Comp: Lang/DBs",
  49: "Comp: Network/Hardware",
  43: "Comp: Operating Systems",
  46: "Comp: Security/Encryption",
  52: "Comp: Software Training",
  41: "Comp: Theory/Ref/Mags",
  47: "Comp: Web Development",
  68: "Crafts/Jewelry",
  21: "DIY / Workshop",
  25: "Exam Prep / Education",
  9: "Food/Cooking/Nutrition",
  37: "Game Shows / Quiz Shows",
  2: "Games: Cards/Tabletop/etc",
  23: "Hobbies: Misc",
  1: "Languages / Linguistics",
  20: "Law & Justice",
  30: "Literature",
  16: "Magic & Illusion",
  206: "Native American Studies",
  201: "Occultism: Academic / Referenc",
  210: "Occultism: Bashar",
  202: "Occultism: Mythology Folklore",
  203: "Paranormal",
  204: "Parapsychology",
  11: "Political Studies",
  61: "Science: Biology",
  77: "Science: Chemistry",
  12: "Science: Math/Statistics",
  10: "Science: Medicine/Health ",
  29: "Science: Philosophy",
  76: "Science: Physics",
  14: "Science: Psych/Sociolgy",
  215: "Sexuality/Seductn/Body Img",
  22: "Sports/Exercise/Outdoors",
  24: "Stock Media",
  33: "Style & Fashion",
  73: "Docu : Survivalism",
  60: "Docu : The Arts: Acting/ Filmmaking",
  217: "Docu : The Arts: Dance/Singing/Voice",
  26: "Docu : The Arts: Music History/Theory",
  15: "Docu : The Arts: Music Learn/Courses",
  45: "Docu : The Arts: Photography",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "thegeeks",
  name: "TheGeeks",
  aka: ["TG"],
  description: "The Geeks is a Private Torrent Tracker for Technology E-LEARNING",
  tags: ["学习"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "TCG",

  urls: ["uggcf://gurtrrxf.pyvpx/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params = {};
        (selectedOptions as string[] | number[]).forEach((val) => set(params, `c${val}`, 1));
        return { requestConfig: { params } };
      },
    },
    {
      name: "种子状态",
      key: "incldead",
      options: [
        { name: "Active", value: 0 },
        { name: "Dead", value: 3 },
        { name: "Neutral Leech", value: 4 },
      ],
    },
    {
      name: "搜索类型",
      key: "nonboolean",
      options: [
        { name: "Exact", value: 0 },
        { name: "Fuzzy", value: 1 },
        { name: "Parsed", value: 3 },
      ],
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: {
        incldead: 1,
        titleonly: 1,
        nonboolean: 4, // Simple search
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: {
        // 按 Jackett 备注，不能包含站点禁转和免费种子
        selector:
          "table[border='0'] > tbody > tr.ttable:has(a[href^='browse.php?cat=']):not(:has(font[color='blue'])):not(:contains('*TCG*'))",
      },
      category: {
        selector: "a[href^='browse.php?cat=']",
        attr: "href",
        filters: [
          (query: string) => {
            const catId = definedFilters.querystring(query, ["cat"]);
            return categoryMap[Number(catId)];
          },
        ],
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

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "Can leech up to 10 torrents at a time.",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P28D",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Able to leech 50 torrents at a time. Has full request privileges.",
    },
    {
      id: 3,
      name: "Extreme User",
      interval: "P60D",
      uploaded: "60GB",
      ratio: 2.05,
      privilege: "Able to leech 100 torrents at a time.",
    },
  ],
};
