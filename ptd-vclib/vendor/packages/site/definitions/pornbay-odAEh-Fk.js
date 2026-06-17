const e = {
  id: "pornbay",
  version: 1,
  name: "Pornbay",
  aka: ["PB"],
  tags: ["成人", "XXX"],
  type: "private",
  schema: "Luminance",
  urls: ["uggcf://cbeaonl.bet/"],
  isDead: !0,
  levelRequirements: [
    {
      id: 1,
      name: "Apprentice",
      privilege:
        "can upload torrents;  can access forums;  can make bookmarks;  can create collages;  can use the notifications system;  can create polls in the forums;  can bump threads in the forums;  can set forum signature (up to 128 characters);  can access site statistics",
    },
    {
      id: 2,
      name: "User",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "can use upload templates;  can add and vote on tags;  can add multiple tags at once",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege:
        "can access top 10 lists;  can create and vote in Requests;  can set torrent footer (800 px);  can set forum signature (up to 256 characters)",
    },
    {
      id: 4,
      name: "Expert User",
      interval: "P8W",
      uploaded: "100GB",
      uploads: 25,
      ratio: 1.05,
      privilege: "can access the Invites Forum",
    },
    {
      id: 5,
      name: "Super User",
      interval: "P13W",
      uploaded: "1TB",
      uploads: 50,
      ratio: 1.05,
      privilege:
        "can download zips of torrent files (from collages, and user pages);  can create public upload templates;  can set forum signature (up to 512 characters)",
    },
    {
      id: 6,
      name: "Fapinator",
      interval: "P26W",
      uploaded: "10TB",
      uploads: 250,
      ratio: 1.05,
      privilege: "can set forum signature (up to 1024 characters)",
    },
  ],
};
export { e as siteMetadata };
