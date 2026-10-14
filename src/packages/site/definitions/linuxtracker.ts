/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/linuxtracker.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * Jackett 里列了 313 个发行版分类，但站点侧**没有任何分类导航 UI**（列表页只有 `?category=<数字id>` 这一个入口），
 * 所以这里只保留 56 个常见发行版，且每个 id 都用 `https://linuxtracker.org/torrents/?category=<id>`
 * 线上核对过「返回结果里的 category-badge 与该 id 一一对应」，不做全量照抄。
 */
const categories: Array<{ name: string; value: number }> = [
  { name: "Ubuntu", value: 563 },
  { name: "Ubuntu Studio", value: 564 },
  { name: "Xubuntu", value: 607 },
  { name: "Lubuntu", value: 1218 },
  { name: "Kubuntu", value: 287 },
  { name: "Ubuntu Mate", value: 2145 },
  { name: "Ubuntu Budgie", value: 2198 },
  { name: "Ubuntu Kylin", value: 2144 },
  { name: "Edubuntu", value: 155 },
  { name: "Debian", value: 128 },
  { name: "Linux Mint", value: 347 },
  { name: "Fedora", value: 178 },
  { name: "Opensuse", value: 2093 },
  { name: "Arch Linux", value: 39 },
  { name: "Manjaro", value: 2073 },
  { name: "EndeavourOS", value: 2278 },
  { name: "Garuda Linux", value: 2299 },
  { name: "Pop!_OS", value: 2207 },
  { name: "Elementary OS", value: 2041 },
  { name: "Zorin", value: 1233 },
  { name: "Kali", value: 2051 },
  { name: "Parrot", value: 2162 },
  { name: "CentOS", value: 102 },
  { name: "AlmaLinux", value: 2311 },
  { name: "Redhat", value: 458 },
  { name: "Oracle Linux", value: 1237 },
  { name: "Gentoo", value: 206 },
  { name: "Slackware", value: 495 },
  { name: "Void Linux", value: 2151 },
  { name: "NixOS", value: 2084 },
  { name: "MX Linux", value: 2177 },
  { name: "Deepin", value: 131 },
  { name: "Tails", value: 2136 },
  { name: "Proxmox", value: 1230 },
  { name: "TrueNAS", value: 194 },
  { name: "Pfsense", value: 432 },
  { name: "OPNsense", value: 2203 },
  { name: "Clear Linux", value: 2253 },
  { name: "Alpine Linux", value: 2003 },
  { name: "Raspbian", value: 2110 },
  { name: "Puppy", value: 452 },
  { name: "Knoppix", value: 277 },
  { name: "GParted", value: 1212 },
  { name: "Clonezilla", value: 107 },
  { name: "Ventoy", value: 3 },
  { name: "FreeBSD", value: 190 },
  { name: "OpenBSD", value: 401 },
  { name: "NetBSD", value: 380 },
  { name: "Haiku", value: 2049 },
  { name: "Reactos", value: 2111 },
  { name: "Steamos", value: 2132 },
  { name: "Lakka", value: 2258 },
  { name: "LibreELEC", value: 2176 },
  { name: "Batocera Linux", value: 2237 },
  { name: "Qubes", value: 2109 },
  { name: "Whonix", value: 2246 },
  { name: "Other distros", value: 4 },
];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "linuxtracker",
  name: "LinuxTracker",
  description: "LinuxTracker is a Public Linux ISO Torrent Repository",
  tags: ["软件"],

  type: "public",
  urls: ["https://linuxtracker.org/"],

  category: [
    {
      name: "分类",
      key: "category",
      options: categories,
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: { url: "/torrents/", responseType: "document" },
    selectors: {
      rows: { selector: "table.torrent-table > tbody > tr" },
      id: {
        selector: "a.torrent-name",
        attr: "href",
        filters: [(query: string) => query.split("/").filter(Boolean).pop() ?? query],
      },
      title: { selector: "a.torrent-name" },
      url: { selector: "a.torrent-name", attr: "href" },
      size: { selector: "td:nth-child(4)", filters: [{ name: "parseSize" }] },
      // 列表页只有日期（"Oct 4, 2026"），站点时间即 UTC（已用 rss.linuxtracker.org 的 pubDate "+0000" 核对）
      time: { selector: "td:nth-child(3)" },
      // 每格形如 `<strong>9</strong><small>+69 ext</small>`，取站点自身的统计值
      seeders: { selector: "td.seeds strong" },
      leechers: { selector: "td.leeches strong" },
      completed: { selector: "td:last-child strong" },
      category: { selector: "span.category-badge" },
    },
  },

  detail: {
    urlPattern: ["/torrents/[0-9a-f]{6,}/?$"],
    selectors: {
      title: { selector: ".detail-title-block h2" },
      // 与列表页共用同一套 id 规则（末段的 hash），
      // 否则详情页会回落到整条 URL，同一颗种子会有两个 id
      id: {
        selector: ":self",
        elementProcess: (el: any) => el.URL || "",
        filters: [(query: string) => query.split("/").filter(Boolean).pop() ?? query],
      },
      // 优先用站点的 .torrent 下载地址（实测 Content-Type: application/x-bittorrent），
      // 该地址取不到时才退回页面上的 magnet
      link: { selector: ["a.primary-action", "a[href^='magnet:']"], attr: "href" },
      size: { selector: "dl.torrent-meta div:contains('Size') dd", filters: [{ name: "parseSize" }] },
      category: { selector: "dl.torrent-meta div:contains('Category') dd" },
      // "Added Oct 4, 2026 17:54" —— 站点时间为 UTC，transformDetailPage 不做换算，这里显式转时间戳
      time: {
        selector: "dl.torrent-meta div:contains('Added') dd",
        filters: [
          (query: string) => {
            const matched = String(query).match(/([A-Za-z]{3})[a-z]* (\d{1,2}), (\d{4}) (\d{2}):(\d{2})/);
            if (!matched) {
              return query;
            }
            const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(
              matched[1],
            );
            return Date.UTC(+matched[3], month, +matched[2], +matched[4], +matched[5]);
          },
        ],
      },
      seeders: { selector: ".detail-stats strong.seeds" },
      leechers: { selector: ".detail-stats strong.leeches" },
      completed: { selector: ".detail-stats div:contains('Completed') strong" },
    },
  },
};
