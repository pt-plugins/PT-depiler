import type { ISiteMetadata } from "../types";
import { selectorSearchProgress, selectorSearchStatus } from "./hdhome";

export const siteMetadata: ISiteMetadata = {
  name: "TorrentCCF",
  description: "兼有学习资源和软件资源的影视PT站点",
  url: "https://et8.org/",
  tags: ["影视", "学习", "综合"],
  schema: "NexusPHP",
  type: "private",
  collaborator: ["Rhilip"],
  category: {
    key: "cat",
    options: [
      { value: 601, name: "Movies" },
      { value: 602, name: "Animations" },
      { value: 603, name: "Sports" },
      { value: 604, name: "Documentaries" },
      { value: 605, name: "EDU" },
      { value: 606, name: "TV/Cn" },
      { value: 607, name: "TV/Western" },
      { value: 608, name: "TV/hk_tw" },
      { value: 609, name: "TV/Japan_korea" },
      { value: 610, name: "TV Shows" },
      { value: 611, name: "Music/Cn" },
      { value: 612, name: "Music/Western" },
      { value: 613, name: "Music/Asia" },
      { value: 614, name: "Music/Classic" },
      { value: 615, name: "MusicVideo" },
      { value: 616, name: "Appz" },
      { value: 617, name: "PC Games" },
      { value: 618, name: "Playstation" },
      { value: 619, name: "Xbox" },
      { value: 620, name: "Wii" },
      { value: 621, name: "Others" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
    },
  },
};
