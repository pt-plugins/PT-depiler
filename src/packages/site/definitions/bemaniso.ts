import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "Bemaniso",
  timezoneOffset: "+0000",
  description: "Game,music",
  url: "https://bemaniso.ws/",
  tags: ["Game", "Music", "sims"],
  type: "private",
  schema: "GazelleJSONAPI",
  collaborator: ["ted423"],
  search: {
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
  },
};
