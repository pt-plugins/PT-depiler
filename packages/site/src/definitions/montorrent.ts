import type { ISiteMetadata } from "../types";

const CategoryMap = new Map([
  ["vo", "Films VO"],
  ["vostfr", "Films VOSTFR"],
  ["dvdrip", "Films DVDRIP"],
  ["bdrip", "Films BDRIP"],
  ["webrip", "Films WEBRIP"],
  ["hdrip", "Films HDRIP"],
  ["dvdscreener", "Films DVD Screener"],
  ["screener", "Films Screener"],
  ["hd2160p", "Films 2160p"],
  ["hd1080p", "Films 1080p"],
  ["hd720p", "Films 720p"],
  ["hd2160p-hdlight", "Films 2160p HD Light"],
  ["hd1080p-hdlight", "Films 1080p HD Light"],
  ["hd720p-hdlight", "Films 720p HD Light"],
  ["hd3d", "Films 3D"],
  ["serie-vostfr", "Emission TV VOSTFR"],
  ["serie-vf", "Emission TV VF"],
  ["pack-vf", "Emission TV Pack VF"],
  ["pack-vostfr", "Emission TV Pack VOSTFR"],
  ["pack-vo", "Emission TV VO"],
  ["albums", "Audio"],
  ["jeux", "Jeu vidéo"],
  ["jeux-pc", "Jeu vidéo PC"],
  ["jeux-console", "Jeu vidéo Consoles"],
  ["logiciels", "Application"],
  ["ebooks", "eBook"],
]);

export const siteMetadata: ISiteMetadata = {
  name: "MonTorrent",
  type: "public",
  description: "MonTorrent is a FRENCH Public Indexer",
  url: "https://www.montorrent.com/",
  search: {
    requestConfig: { url: "/recherche/" },
    keywordsParam: "query",
    // TODO categories: []
    selectors: {
      rows: { selector: "div.t-details" },
      id: { selector: ":self", attr: "id" },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href^="/telechargement/"]', attr: "href" },
      // 该站无发布时间
      size: { selector: "div.t-taille" },
      seeders: { selector: "div.t-sources" },
      leechers: { selector: "div.t-clients" },
      category: {
        selector: 'a[href*="id_cat"]',
        attr: "class",
        filters: [(q: string) => q.replace("liste-categorie-couleur ", ""), (q: string) => CategoryMap.get(q)],
      },
    },
  },
};
