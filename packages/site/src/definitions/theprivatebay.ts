import type { ISiteMetadata } from "../types";

const CategoryMap = new Map([
  // Audio
  [100, "Audio"],
  [101, "Music"],
  [102, "Audio Books"],
  [103, "Sound Clips"],
  [104, "FLAC"],
  [199, "Audio Other"],
  // Video
  [200, "Video"],
  [201, "Movies"],
  [202, "Movies"],
  [203, "Music Videos"],
  [204, "Movie Clips"],
  [205, "TV"],
  [206, "Handheld"],
  [207, "HD - Movies"],
  [208, "HD - TV shows"],
  [209, "3D"],
  [299, "Video Other"],
  // Applications
  [300, "Applications"],
  [301, "Windows"],
  [302, "Mac"],
  [303, "UNIX"],
  [304, "Handheld"],
  [305, "IOS (iPad/iPhone)"],
  [306, "Android"],
  [399, "Other OS"],
  // Games
  [400, "Games"],
  [401, "PC"],
  [402, "Mac"],
  [403, "PSx"],
  [404, "XBOX360"],
  [405, "Wii"],
  [406, "Handheld"],
  [407, "IOS (iPad/iPhone)"],
  [408, "Android"],
  [499, "Games Other"],
  // Porn
  [500, "Porn"],
  [501, "Movies"],
  [502, "Movies DVDR"],
  [503, "Pictures"],
  [504, "Games"],
  [505, "HD - Movies"],
  [506, "Movie Clips"],
  [599, "Porn other"],
  // Other
  [600, "Other"],
  [601, "E-books"],
  [602, "Comics"],
  [603, "Pictures"],
  [604, "Covers"],
  [605, "Physibles"],
  [699, "Other Other"],
]);

export const siteMetadata: ISiteMetadata = {
  name: "The Pirate Bay",
  type: "public",
  description:
    "Pirate Bay (TPB) is the galaxy’s most resilient Public BitTorrent site",
  url: "https://thepiratebay.org/",
  search: {
    requestConfig: {
      url: "https://apibay.org/q.php",
      responseType: "json",
      params: { cat: "" },
    },
    keywordsParam: "q",
    selectors: {
      rows: { selector: ":self" },
      id: { selector: "id" },
      title: { selector: "name" },
      url: {
        selector: "id",
        filters: [(q: string) => `/description.php?id=${q}`],
      },
      link: {
        selector: "info_hash",
        filters: [(q: string) => `magnet:?xt=urn:btih:${q}`],
      },
      time: { selector: "added" },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      category: {
        selector: "category",
        filters: [(q: string) => CategoryMap.get(parseInt(q))],
      },
    },
  },
};
