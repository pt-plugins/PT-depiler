import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "JoyHD",
  schema: "NexusPHP",
  type: "private",
  description: "JoyHD成立於2013年，發佈藍光原碟，藍光DIY和原抓音樂。",
  url: "https://www.joyhd.net/",
  tags: ["影视", "综合"],
  collaborator: "ylxb2016",
  category: {
    key: "cat",
    options: [
      { name: "Movie", value: 401 },
      { name: "TV Series", value: 402 },
      { name: "Entertainment", value: 403 },
      { name: "Anime", value: 405 },
      { name: "Music", value: 414 },
      { name: "Sport", value: 407 },
      { name: "Documentaries", value: 404 },
      { name: "MV", value: 406 },
      { name: "Software", value: 408 },
      { name: "Game", value: 410 },
      { name: "e-Learn", value: 411 },
      { name: "Other", value: 409 },
    ],
    cross: { mode: "append" },
  },
  userInfo: {
    selectors: {
      bonus: {
        selector: ["td.rowhead:contains('银元') + td"],
      },
    },
  },
};
