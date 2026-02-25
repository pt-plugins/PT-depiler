import { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  id: "gtorg",
  version: 1,
  name: "Gay-Torrents.Org",
  tags: ["成人"],
  collaborator: ["haowenwu"],
  type: "private",
  urls: ["https://gay-torrents.org/"],

  userInfo: {
    pickLast: ["id"],

    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='usercp.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          bonus: {
            selector: ["a[href*='seedbonus']:first"],
            filters: [{ name: "parseNumber" }],
          },
          seeding: {
            selector: ["span[title='Seed']"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/usercp.php" },
        assertion: { id: "params.uid" },
        selectors: {
          name: {
            selector: "td:contains('User') + td",
          },
          levelName: {
            selector: ["td:contains('Rank') + td"],
          },
          downloaded: {
            selector: ["td:contains('Downloaded') + td"],
            filters: [{ name: "parseSize" }],
          },
          uploaded: {
            selector: ["td:contains('Uploaded') + td"],
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "td:contains('Ratio') + td",
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: ["td:contains('Joined on') + td"],
            filters: [
              (query: string) => {
                return query.includes(" ") ? query.split(" ")[0] : query;
              },
              { name: "parseTime" },
            ],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      ratio: 0.4,
    },
    {
      id: 2,
      name: "Poweruser",
      ratio: 1.05,
      uploaded: "50GB",
      privilege: "Access to: Online Users, Tracker info",
    },
    {
      id: 3,
      name: "Extrauser",
      ratio: 2,
      uploaded: "250GB",
      privilege: "Access to: Online Users, Tracker info, Requests, Top 10 and Users",
    },
  ],
};
