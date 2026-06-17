import o, { SchemaMetadata as t } from "../schemas/Luminance-DtLCtoLD.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../types/torrent-BvvY2NbA.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const a = [
    { name: "Movies/All", value: 2e3 },
    { name: "Movies/HD", value: 2040 },
    { name: "Movies/UHD", value: 2045 },
    { name: "Movies/BluRay", value: 2050 },
    { name: "Movies/3D", value: 2060 },
    { name: "Movies/SD", value: 2030 },
    { name: "Movies/Foreign", value: 2010 },
    { name: "Movies/Other", value: 2020 },
    { name: "TV/All", value: 5e3 },
    { name: "TV/Foreign", value: 5020 },
    { name: "TV/SD", value: 5030 },
    { name: "TV/HD", value: 5040 },
    { name: "TV/UHD", value: 5045 },
    { name: "TV/Other", value: 5050 },
    { name: "TV/Sport", value: 5060 },
    { name: "TV/Anime", value: 5070 },
    { name: "TV/Documentary", value: 5080 },
  ],
  A = {
    ...t,
    id: "morethantv",
    version: 2,
    name: "MoreThanTV",
    aka: ["MTV"],
    description: "MoreThanTV is a Private Torrent Tracker for TV / MOVIES",
    tags: ["电视剧", "剧集", "电影"],
    collaborator: ["luckiestone", "Rhilip"],
    type: "private",
    schema: "Luminance",
    urls: ["https://www.morethantv.me/"],
    legacyUrls: ["https://www.morethan.tv/"],
    category: [{ name: "Category", key: "cat", options: a, cross: { mode: "comma" } }],
    officialGroupPattern: [/-(TEPES|E\.N\.D|SMURF|hallowed|WDYM|PiRAMiDHEAD|VaLTiEL)/i],
    search: {
      skipNonLatinCharacters: !0,
      keywordPath: "params.q",
      requestConfig: { url: "/api/torznab", params: { limit: 100, extended: 1, t: "search" } },
      advanceKeywordParams: {
        imdb: {
          requestConfigTransformer: ({ keywords: r, requestConfig: e }) => (
            (e.params.imdbid = r),
            delete e.params.q,
            e
          ),
        },
        tvmaze: {
          requestConfigTransformer: ({ keywords: r, requestConfig: e }) => (
            (e.params.tvmazeid = r),
            delete e.params.q,
            e
          ),
        },
      },
      selectors: {
        rows: { selector: "item" },
        id: { selector: "guid", filters: [{ name: "querystring", args: ["torrentid"] }] },
        title: { selector: "title" },
        url: { selector: "guid" },
        link: { selector: "link" },
        time: { selector: "pubDate", filters: [{ name: "parseTime", args: ["EEE, d MMMM yyyy HH:mm:ss xxxx"] }] },
        size: { selector: "size" },
        author: { selector: '[name="poster"]', attr: "value" },
        seeders: { selector: "[name='seeders']", attr: "value" },
        leechers: { selector: "[name='leechers']", attr: "value" },
        completed: { selector: "[name='grabs']", attr: "value" },
        category: {
          selector: "[name='category']:last",
          attr: "value",
          filters: [(r) => a.find((e) => e.value === parseInt(`${r}`))?.name ?? "Unknown"],
        },
        tags: [{ selector: '[name="downloadvolumefactor"][value="0"]', name: "Free", color: "blue" }],
        ext_imdb: { selector: "[name='imdbid']", attr: "value", filters: [{ name: "extImdbId" }] },
        ext_tvmaze: { selector: "[name='tvmazeid']", attr: "value" },
      },
    },
    list: [
      {
        urlPattern: [/show\/\d+/],
        mergeSearchSelectors: !1,
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
          keywords: { selector: "input#searchbox_torrents", elementProcess: (r) => r?.value ?? "" },
        },
      },
      {
        urlPattern: ["/torrents/browse"],
        mergeSearchSelectors: !1,
        selectors: {
          ...t.search.selectors,
          id: {
            selector: "a.overlay_torrent[href]",
            attr: "href",
            filters: [{ name: "querystring", args: ["torrentid"] }],
          },
          seeders: { selector: "td:nth-child(7)" },
          leechers: { selector: "td:nth-child(8)" },
          completed: { selector: "td:nth-child(6)" },
          size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
          keywords: { selector: "input#searchtext", elementProcess: (r) => r?.value ?? "" },
        },
      },
    ],
    levelRequirements: [
      { id: 1, name: "Runner", privilege: "Userclass for newly registered users" },
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
        isKept: !0,
        privilege:
          "Engineer Restricted forum; FREE Invites (Send a staff PM for us to credit your account); Immune from inactivity disablement",
      },
      { id: 100, name: "Assistant Producer", groupType: "vip" },
      { id: 101, name: "Donor", groupType: "vip" },
      { id: 102, name: "Network Affiliate", groupType: "vip" },
      { id: 103, name: "Former Staff", groupType: "vip" },
      { id: 104, name: "Internal", groupType: "vip" },
      { id: 200, name: "Production Supervisor", groupType: "manager" },
      { id: 201, name: "Junior Developer", groupType: "manager" },
      { id: 202, name: "Manager", groupType: "manager" },
      { id: 203, name: "Executive Producer", groupType: "manager" },
      { id: 204, name: "Senior Developer", groupType: "manager" },
      { id: 205, name: "Director", groupType: "manager" },
      { id: 206, name: "Showrunner", groupType: "manager" },
      { id: 210, name: "First Line Support", groupType: "manager" },
      { id: 211, name: "Tagger", groupType: "manager" },
    ],
  };
class E extends o {
  async getTorrentDownloadLink(e) {
    return this.getTorrentDownloadLinkFactory("torrentid")(e);
  }
}
export { E as default, A as siteMetadata };
