import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "CGPeers",
  timezoneOffset: "+0000",
  type: "private",
  schema: "GazelleJSONAPI",
  url: "https://www.cgpeers.com/",
  tags: ["设计", "素材"],
  host: "www.cgpeers.com",
  collaborator: ["bimzcy"],
  search: {
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
  },
};
