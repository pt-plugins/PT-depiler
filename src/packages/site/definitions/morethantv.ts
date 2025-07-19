import { ISearchCategoryOptions, type ISiteMetadata } from "../types";

const categories: ISearchCategoryOptions[] = [
  // Torznab Movie Categories
  { name: "Movies/All", value: 2000 },
  { name: "Movies/HD", value: 2040 },
  { name: "Movies/UHD", value: 2045 },
  { name: "Movies/BluRay", value: 2050 },
  { name: "Movies/3D", value: 2060 },
  { name: "Movies/SD", value: 2030 },
  { name: "Movies/Foreign", value: 2010 },
  { name: "Movies/Other", value: 2020 },

  // Torznab Show Categories
  { name: "TV/All", value: 5000 },
  { name: "TV/Foreign", value: 5020 },
  { name: "TV/SD", value: 5030 },
  { name: "TV/HD", value: 5040 },
  { name: "TV/UHD", value: 5045 },
  { name: "TV/Other", value: 5050 },
  { name: "TV/Sport", value: 5060 },
  { name: "TV/Anime", value: 5070 },
  { name: "TV/Documentary", value: 5080 },
];

export const siteMetadata: ISiteMetadata = {
  id: "morethantv",
  version: 1,
  name: "MoreThanTV",
  aka: ["MTV"],
  description: "MoreThanTV is a Private Torrent Tracker for TV / MOVIES",
  tags: ["电视剧", "剧集"],

  collaborator: ["luckiestone", "Rhilip"],

  type: "private",
  schema: "Luminance",

  urls: ["https://www.morethantv.me/"],
  formerHosts: ["www.morethan.tv"],

  category: [
    {
      name: "Category",
      key: "cat",
      options: categories,
      cross: { mode: "comma" },
    },
  ],

  search: {
    skipNonLatinCharacters: true,
    keywordPath: "params.q",
    requestConfig: {
      url: "/api/torznab", // 返回的是一个 xml 文档
      params: {
        limit: 100,
        extended: 1,
        t: "search",
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params.imdbid = keywords;
          delete requestConfig!.params.q;
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "item" },
      id: { selector: "guid", filters: [{ name: "querystring", args: ["torrentid"] }] },
      title: { selector: "title" },
      url: { selector: "guid" },
      link: { selector: "link" },
      time: { selector: "pubDate", filters: [{ name: "parseTime", args: ["EEE, d MMMM yyyy HH:mm:ss xxxx"] }] }, // Sat, 31 May 2025 22:24:23 +0000
      size: { selector: "size" },
      author: { selector: '[name="poster"]', attr: "value" }, // <torznab:attr name="poster" value="anon" />
      seeders: { selector: "[name='seeders']", attr: "value" },
      leechers: { selector: "[name='leechers']", attr: "value" },
      completed: { selector: "[name='grabs']", attr: "value" },
      category: {
        selector: "[name='category']:last",
        attr: "value",
        filters: [(x: string | number) => categories.find((c) => c.value === parseInt(`${x}`))?.name ?? "Unknown"],
      }, // <torznab:attr name="category" value="5040" />
      tags: [{ selector: '[name="downloadvolumefactor"][value="0"]', name: "Free", color: "blue" }],
      ext_imdb: { selector: "[name='imdbid']", attr: "value", filters: [{ name: "extImdbId" }] }, // <torznab:attr name="imdbid" value="1234567" />
      // 使用 api 不返回 process 和 status
      // 如果走 torrents/browse?searchtext= 则没有 category
    },
  },

  list: [
    {
      urlPattern: [/show\/\d+/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "div#torrents tbody > tr.group" },
        id: {
          selector: "a[href^='/torrents.php'][href*='torrentid=']",
          attr: "href",
          filters: [{ name: "querystring", args: ["torrentid"] }],
        },
        title: { selector: "a[href^='/torrents.php'][href*='torrentid='][title]", attr: "title" },
        url: { selector: "a[href^='/torrents.php'][href*='torrentid=']", attr: "href" },
        link: { selector: "a[href^='/torrents.php'][href*='action=download']", attr: "href" },
        seeders: { selector: "td:nth-child(5)" },
        leechers: { selector: "td:nth-child(6)" },
        completed: { selector: "td:nth-child(4)" },
        size: { selector: "td:nth-child(3)", filters: [{ name: "parseSize" }] },
        keywords: { selector: "input#searchbox_torrents", elementProcess: (el) => el?.value ?? "" },
      },
    },
    {
      urlPattern: ["/torrents/browse"],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "table#torrent_table tr.torrent" },
        id: {
          selector: "a.overlay_torrent[href]",
          attr: "href",
          filters: [{ name: "querystring", args: ["torrentid"] }],
        },
        title: { selector: "a.overlay_torrent[href]" },
        url: { selector: "a.overlay_torrent[href]", attr: "href" },
        link: { selector: "a[href^='/torrents.php'][href*='action=download']", attr: "href" },
        seeders: { selector: "td:nth-child(7)" },
        leechers: { selector: "td:nth-child(8)" },
        completed: { selector: "td:nth-child(6)" },
        size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
        time: {
          selector: "span.time[title]",
          attr: "title", // Jul 03 2025, 21:04
          filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm"] }],
        },
        keywords: { selector: "input#searchtext", elementProcess: (el) => el?.value ?? "" },
      },
    },
  ],

  userInfo: {
    pickLast: ["id", "joinTime"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a.username[href*='user.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a.username[href*='user.php']:first" },
          messageCount: {
            selector: ["div.alert-bar > a[href*='inbox.php']", "div.alertbar > a[href*='inbox.php']"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/user.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: { selector: "ul.stats > li:contains('Uploaded')", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "ul.stats > li:contains('Downloaded')", filters: [{ name: "parseSize" }] },
          ratio: { selector: "ul.stats > li:contains('Ratio:')", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "ul.stats > li:contains('Seeding:')", filters: [{ name: "parseNumber" }] },
          seedingSize: { selector: "ul.stats > li:contains('Seeding Size:')", filters: [{ name: "parseSize" }] },
          levelName: { selector: "ul.stats > li:contains('Class:') a" },
          bonus: { selector: "#stats_credits", filters: [{ name: "parseNumber" }] },
          bonusPerHour: {
            selector: "ul.stats > li:contains('Seeding:')",
            filters: [
              (query: string) => {
                let ret = 0;
                const queryMatch = query.replace(/,/g, "").match(/Seeding:.+?(\d+)/);
                if (queryMatch && queryMatch.length >= 2) {
                  const rawPerHour = parseFloat(queryMatch[1]);
                  ret = rawPerHour >= 300 ? 100 : Math.round((Math.sqrt(rawPerHour * 0.4 + 1) - 1) * 10);
                }
                return ret;
              },
            ],
          },
          joinTime: {
            selector: "ul.stats > li:contains('Joined:') > span",
            attr: "title",
            filters: [{ name: "parseTime", args: ["MMMM dd yyyy, HH:mm"] }],
          },
          posts: { selector: "ul.stats > li:contains('Forum Posts:')", filters: [{ name: "parseNumber" }] },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Runner",
      privilege: "Userclass for newly registered users",
    },
    {
      id: 2,
      name: "Grip",
      interval: "P2W",
      uploaded: "10GB",
      privilege: "Request Creation; Bookmarks; Poll Making; Notifications Access; Can play the slots",
    },
    {
      id: 3,
      name: "Key Grip",
      interval: "P4W",
      uploaded: "200GB",
      privilege:
        "Upload privileges; Subscription, Creation & Personal Collage Access; Top 10 Access; Advanced Search Access; Inactivity disabled after a few months",
    },
    {
      id: 4,
      name: "Camera Operator",
      interval: "P8W",
      uploaded: "500GB",
      privilege:
        "Advanced top 10 Access; Invite Forum Access; View Site Stats; Can Add Tags; Can Vote on Tags; Can set a torrent signature",
    },
    {
      id: 5,
      name: "Boom Operator",
      interval: "P12W",
      uploaded: "1000GB",
      uploads: 10,
      posts: 5,
      privilege:
        "Advanced Site Stats; Boom Operator Restricted forum; Can make/delete private upload templates; Can purchase invites from bonus shop",
    },
    {
      id: 6,
      name: "Gaffer",
      interval: "P24W",
      uploaded: "2000GB",
      uploads: 100,
      posts: 10,
      privilege: "Gaffer Restricted forum; Can send invites while site is past user limit",
    },
    {
      id: 7,
      name: "Engineer",
      interval: "P48W",
      uploaded: "3000GB",
      uploads: 500,
      posts: 25,
      privilege:
        "Engineer Restricted forum; FREE Invites (Send a staff PM for us to credit your account); Immune from inactivity disablement",
    },
    // Special Classes Overview
    { id: 100, name: "Assistant Producer", groupType: "vip" },
    { id: 101, name: "Donor", groupType: "vip" },
    { id: 102, name: "Network Affiliate", groupType: "vip" },
    { id: 103, name: "Former Staff", groupType: "vip" },
    { id: 104, name: "Internal", groupType: "vip" },
    // Staff Classes
    { id: 200, name: "Production Supervisor", groupType: "manager" },
    { id: 201, name: "Junior Developer", groupType: "manager" },
    { id: 202, name: "Manager", groupType: "manager" },
    { id: 203, name: "Executive Producer", groupType: "manager" },
    { id: 204, name: "Senior Developer", groupType: "manager" },
    { id: 205, name: "Director", groupType: "manager" },
    { id: 206, name: "Showrunner", groupType: "manager" },
    // Support Classes
    { id: 210, name: "First Line Support", groupType: "manager" },
    { id: 211, name: "Tagger", groupType: "manager" },
  ],
};
