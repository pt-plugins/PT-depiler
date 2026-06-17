const e = {
  id: "ncore",
  version: 1,
  name: "nCore",
  tags: ["匈牙利"],
  collaborator: ["haowenwu"],
  type: "private",
  urls: ["uggcf://apber.ceb/"],
  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/profile.php" },
        selectors: {
          id: { selector: "input[data-uid]", attr: "data-uid" },
          name: { selector: "#profil_nev > span" },
          levelName: { selector: "#profil_rang > nobr", filters: [{ name: "replace", args: ["/()/", ""] }] },
          joinTime: {
            selector: ["div.userbox_tartalom_mini:nth-child(2) > div:nth-child(2) span"],
            attr: "title",
            filters: [{ name: "parseTime" }],
          },
          uploaded: {
            selector: ["div.userbox_tartalom_mini:nth-child(2) > div:nth-child(8) span"],
            filters: [{ name: "parseSize" }],
          },
          bonus: {
            selector: ["div.userbox_tartalom_mini:nth-child(2) > div:nth-child(10)"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },
  levelRequirements: [
    { id: 1, name: "Felhasználó" },
    { id: 2, name: "Tag", interval: "P26W", uploaded: "250GB" },
    { id: 3, name: "Elite", interval: "P52W", uploaded: "1TB" },
    { id: 4, name: "Legend", interval: "P52W", uploaded: "1TB" },
    { id: 5, name: "VAGY", uploaded: "10TB" },
  ],
};
export { e as siteMetadata };
