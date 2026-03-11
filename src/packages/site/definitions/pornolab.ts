/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pornolab.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/4373
 */
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import type { ISiteMetadata, ITorrent } from "../types.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1670: "Erotic & Softcore",
  1768: "Erotic Movies",
  60: "Documentary & Reality",
  1671: "Erotic Clips & SiteRips",
  1644: "Nudity",
  1672: "Full Length Movies",
  1111: "Full Length Movies Packs",
  508: "Classic",
  555: "Feature & Vignettes",
  1845: "Gonzo 1991-2010",
  1673: "Gonzo 2011-2026",
  1112: "All Sex & Amateur 1991-2010",
  1718: "All Sex & Amateur 2011-2026",
  553: "All Girl & Solo",
  1143: "Ethnic-Themed",
  1646: "Pocket PC & Phone Video",
  1717: "Full Length Movies High-Quality",
  1851: "Erotic, Documentary & Reality (DVD)",
  1713: "Feature & Vignettes, Classic (DVD)",
  512: "Gonzo, All Girl & Solo, All Sex (DVD)",
  1712: "Erotic, Documentary & Reality (HD Video)",
  1775: "Feature & Vignettes, Classic (HD Video)",
  1450: "Gonzo, All Girl & Solo, All Sex (HD Video)",
  1674: "Russian Video",
  902: "Russian Full Length Movies",
  1675: "Russian Clips Packs",
  36: "Russian SiteRip's 1991-2015",
  1830: "Russian SiteRip's 1991-2015 (HD Video)",
  1803: "Russian SiteRip's 2016-2025",
  1831: "Russian SiteRip's 2016-2025 (HD Video)",
  1877: "Russian SiteRip's 2026",
  1878: "Russian SiteRip's 2026 (HD Video)",
  1741: "Russian Clips (various)",
  1676: "Russian Amateur Video",
  1677: "Clips",
  1780: "SiteRip's Packs (HD Video)",
  1110: "SiteRip's Packs (SD Video)",
  1678: "Actresses Clips Packs",
  1124: "SiteRip's 1991-2010 (HD Video)",
  1784: "SiteRip's 2011-2012 (HD Video)",
  1769: "SiteRip's 2013 (HD Video)",
  1793: "SiteRip's 2014 (HD Video)",
  1797: "SiteRip's 2015 (HD Video)",
  1804: "SiteRip's 2016 (HD Video)",
  1819: "SiteRip's 2017 (HD Video)",
  1825: "SiteRip's 2018 (HD Video)",
  1836: "SiteRip's 2019 (HD Video)",
  1842: "SiteRip's 2020 (HD Video)",
  1846: "SiteRip's 2021 (HD Video)",
  1857: "SiteRip's 2022 (HD Video)",
  1861: "SiteRip's 2023 (HD Video)",
  1867: "SiteRip's 2024 (HD Video)",
  1872: "SiteRip's 2025 (HD Video)",
  1875: "SiteRip's 2026 (HD Video)",
  1451: "SiteRip's 1991-2010",
  1788: "SiteRip's 2011-2012",
  1789: "SiteRip's 2013",
  1792: "SiteRip's 2014",
  1798: "SiteRip's 2015",
  1805: "SiteRip's 2016",
  1820: "SiteRip's 2017",
  1826: "SiteRip's 2018",
  1837: "SiteRip's 2019",
  1843: "SiteRip's 2020",
  1847: "SiteRip's 2021",
  1856: "SiteRip's 2022",
  1862: "SiteRip's 2023",
  1868: "SiteRip's 2024",
  1873: "SiteRip's 2025",
  1876: "SiteRip's 2026",
  1707: "Movie Scenes (excluding SiteRip)",
  1874: "Clips with translation",
  284: "Clips (various)",
  1853: "Compilations & Porn Music Video (PMV)",
  1823: "3D & Virtual Reality Videos",
  1800: "Japanese & Chinese Adult Video (JAV)",
  1801: "Full Length Japanese Movies Packs & SiteRip's Packs",
  1719: "Japanese Movies & SiteRip's (DVD & HD Video)",
  997: "Japanese Movies & SiteRip's 1991-2014",
  1818: "Japanese Movies & SiteRip's 2015-2026",
  1849: "Chinese Movies & SiteRip's (DVD & HD Video)",
  1723: "Photos & Magazines",
  1726: "MetArt & MetModels",
  883: "Erotic Picture Gallery (various)",
  1728: "Amateur Picture Gallery",
  1729: "Actresses Picture Packs",
  38: "SiteRip's Picture Packs",
  1757: "Picture Sets Packs",
  1735: "Misc & Special Interest Picture Packs",
  1731: "Magazines",
  1745: "Hentai & Manga, Cartoons & Comics, Artwork & Audio",
  1679: "Hentai: main subsection",
  1740: "Hentai DVD & HD",
  1834: "Hentai: 2D video",
  1752: "Hentai: 3D video",
  1760: "Hentai: Manga",
  1781: "Hentai: Artwork & HCG",
  1711: "Cartoons",
  1296: "Comics, Artwork & Audio",
  1863: "Discussion",
  1838: "Games",
  1750: "Games: main subsection",
  1756: "Games: Visual Novels (Pro)",
  1869: "Games: Visual Novels (Indie)",
  1785: "Games: role-playing [RPG Maker / WOLF RPG Editor]",
  1790: "Software: Animation",
  1827: "Games: In Progress and Demo (main subsection)",
  1870: "Games: In Progress and Demo (visual novels - Indie)",
  1828: "Games: In Progress and Demo (role-playing) [RPG Maker / WOLF RPG Editor]",
  1829: "Games Discussion",
  11: "Special Interest Movies & Clips",
  1715: "Transsexual (DVD & HD)",
  1680: "Transsexual",
  1758: "Bisexual",
  1682: "BDSM",
  1733: "Femdom & Strapon",
  1754: "Voyeur",
  1734: "Fisting & Dildo",
  1791: "Pregnant",
  509: "Bukkake",
  1859: "GangBang",
  1685: "Peening",
  1762: "Fetish",
  1681: "Scat",
  1688: "Gay Forum",
  903: "Full Length Movies (Gay)",
  1765: "Full-length Asian Films (Gay)",
  1767: "Classic Gay Films (Pre-1990's)",
  1755: "High-Quality Full Length Movies (Gay DVD & HD)",
  1787: "High-Quality Full Length Asian Movies (Gay DVD & HD)",
  1763: "Clip's & SiteRip's Packs (Gay)",
  1777: "Gay Clips (HD Video)",
  1691: "Clips & Movie Scenes (Gay)",
  1692: "Magazines, Photo, Rest (Gay)",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "pornolab",
  name: "PornoLab",
  description: "PornoLab is a Semi-Private Russian site for 3X",
  tags: ["成人", "XXX"],

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://pornolab.net/"],

  category: [
    {
      name: "类别",
      key: "f",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" },
    },
  ],

  search: {
    keywordPath: "params.nm",
    requestConfig: {
      url: "/forum/tracker.php",
      params: {
        o: 1, // sort by, 1 created 2 title 7 size 10 seeders
        s: 2, // sort order, 1 asc 2 desc
      },
      responseType: "document",
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table#tor-tbl > tbody > tr:has(a.tr-dl)" },
      category: {
        selector: "a.f",
        attr: "href",
        filters: [{ name: "querystring", args: ["f"] }, (query: number) => categoryMap[query]],
      },
      title: { selector: "a.tLink" },
      url: { selector: "a.tLink", attr: "href" },
      id: { selector: "a.tr-dl", attr: "href", filters: [{ name: "querystring", args: ["t"] }] },
      link: { selector: "a.tr-dl", attr: "href" },
      size: { selector: "td:nth-child(6) u" },
      time: { selector: "td:nth-child(11) u" },
      seeders: { selector: "td.seedmed > b" },
      leechers: { selector: "td.leechmed > b" },
      completed: { selector: "td:nth-child(9)" },
      author: { selector: "a[href*='tracker.php?pid=']" },
    },
  },

  detail: {
    urlPattern: ["/forum/viewtopic\\.php\\?t=\\d+"],
    selectors: {
      title: { selector: "a#topic-title" },
      link: { selector: "a.dl-link", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/forum/index.php", responseType: "document" },
        selectors: {
          id: {
            selector: "a[href*='/profile.php?mode=viewprofile&u=']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["u"] }],
          },
        },
      },
      {
        requestConfig: { url: "/forum/profile.php", params: { mode: "viewprofile" }, responseType: "document" },
        assertion: { id: "params.u" },
        selectors: {
          name: { selector: "h1.pagetitle > span" },
          levelName: { selector: "td#role" },
          joinTime: { selector: "td#user_regdate > span", filters: [{ name: "parseTime" }] },
          lastAccessAt: { selector: "td#user_lastvisit > span", filters: [{ name: "parseTime" }] },
          ratio: { selector: "td#u_ratio > b", filters: [{ name: "parseNumber" }] },
          downloaded: { selector: "td#u_down_total > span", filters: [{ name: "parseSize" }] },
          uploaded: { selector: "td#u_up_total > span", filters: [{ name: "parseSize" }] },
          seeding: { text: 0, selector: "div.seed:contains('Сидер')", filters: [{ name: "parseNumber" }] },
          seedingSize: {
            text: 0,
            selector: "table#t-seed > tbody",
            elementProcess: (el: HTMLElement) => {
              const sizeTds = el.querySelectorAll<HTMLElement>("tr > td:nth-child(6) > u");
              let seedingSize = 0;
              sizeTds.forEach((e) => {
                seedingSize += parseInt(e.innerText || e.textContent);
              });
              return seedingSize;
            },
          },
          uploads: { text: 0, selector: "div.seed:contains('Своих')", filters: [{ name: "parseNumber" }] },
          bonus: { text: "N/A" },
          bonusPerHour: { text: "N/A" },
        },
      },
    ],
  },

  // 用于映射用户等级名称，非实际要求
  levelRequirements: [
    {
      id: 1,
      name: "User",
      nameAka: ["Пользователь"],
    },
  ],
};

export default class PornoLab extends PrivateSite {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 转化详情页链接为下载链接
    if (torrent.link && torrent.link.includes("/viewtopic.php?t=")) {
      torrent.link = torrent.link.replace(/viewtopic\.php\?t=(\d+)/, "dl.php?t=$1");
    }

    return super.getTorrentDownloadLink(torrent);
  }
}
