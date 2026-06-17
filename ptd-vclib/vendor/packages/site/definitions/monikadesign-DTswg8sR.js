import { E as r } from "../types/torrent-BvvY2NbA.js";
import i, { SchemaMetadata as t } from "../schemas/Unit3D-ChxolkI5.js";
import o from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/datetime-DQxMK7bP.js";
import "../types/base-Dy_28wGT.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
const A = {
  ...t,
  id: "monikadesign",
  version: 1,
  name: "Monikadesign",
  aka: ["MDU", "莫妮卡"],
  tags: ["动漫"],
  timezoneOffset: "+0800",
  collaborator: ["Rhilip"],
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://zbavxnqrfvta.hx/"],
  category: [
    {
      name: "类别",
      key: "categories",
      options: [
        { name: "Anime TV", value: 8 },
        { name: "Anime Movie", value: 6 },
        { name: "TV", value: 2 },
        { name: "Movie", value: 1 },
        { name: "Music of TV", value: 9 },
        { name: "Music of Movie", value: 3 },
        { name: "Anime Live", value: 7 },
        { name: "Action Live", value: 5 },
        { name: "Game", value: 4 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "types",
      options: [
        { name: "Full Disc", value: 1 },
        { name: "Remux", value: 2 },
        { name: "Encode", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "ALBUM", value: 7 },
        { name: "SINGLE", value: 14 },
        { name: "OST", value: 15 },
        { name: "DRAMA", value: 16 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutions",
      options: [
        { name: "4320p", value: 1 },
        { name: "2160p", value: 2 },
        { name: "1080p", value: 3 },
        { name: "1080i", value: 4 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
        { name: "Lossless", value: 11 },
        { name: "Hi-Res", value: 12 },
        { name: "Lossy", value: 13 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "题材类型",
      key: "genres",
      options: [
        { name: "科幻 & 奇幻", value: 10765 },
        { name: "战争 & 政治", value: 10768 },
        { name: "儿童", value: 10762 },
        { name: "冒险", value: 12 },
        { name: "剧情", value: 18 },
        { name: "动作", value: 28 },
        { name: "动作冒险", value: 10759 },
        { name: "动画", value: 16 },
        { name: "历史", value: 36 },
        { name: "喜剧", value: 35 },
        { name: "奇幻", value: 14 },
        { name: "家庭", value: 10751 },
        { name: "恐怖", value: 27 },
        { name: "悬疑", value: 9648 },
        { name: "惊悚", value: 53 },
        { name: "战争", value: 10752 },
        { name: "新闻", value: 10763 },
        { name: "爱情", value: 10749 },
        { name: "犯罪", value: 80 },
        { name: "电视电影", value: 10770 },
        { name: "真人秀", value: 10764 },
        { name: "科幻", value: 878 },
        { name: "纪录片", value: 99 },
        { name: "肥皂剧", value: 10766 },
        { name: "脱口秀", value: 10767 },
        { name: "西部片", value: 37 },
        { name: "音乐", value: 10402 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Free", value: 0 },
        { name: "25% Free", value: 25 },
        { name: "50% Free", value: 50 },
        { name: "75% Free", value: 75 },
        { name: "100% Free", value: 100 },
        { name: "双倍上传", value: "doubleup" },
        { name: "精选", value: "featured" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (a) => {
        const n = { free: [] };
        return (
          a.forEach((e) => {
            e === "doubleup" || e === "featured" ? (n[e] = 1) : n.free.push(e);
          }),
          { requestConfig: { params: n } }
        );
      },
    },
    {
      name: "标签",
      key: "tags",
      options: [
        { name: "禁止转载", value: "exclusive" },
        { name: "附字幕", value: "subtitleIncluded" },
        { name: "附扫图", value: "scansIncluded" },
        { name: "附 CD", value: "cdsIncluded" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "额外",
      key: "extra",
      options: [
        { name: "内部组", value: "internal" },
        { name: "个人原创", value: "personalRelease" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "其它",
      key: "misc",
      options: [{ name: "已收藏", value: "bookmarked" }],
      cross: { mode: "append", key: "" },
    },
    {
      name: "健康度",
      key: "health",
      options: [
        { name: "活种", value: "alive" },
        { name: "急需保种", value: "dying" },
        { name: "死种", value: "dead" },
      ],
      cross: { mode: "append", key: "" },
    },
  ],
  search: {
    ...t.search,
    advanceKeywordParams: {
      ...t.search.advanceKeywordParams,
      bangumi: {
        requestConfigTransformer: ({ requestConfig: a }) => (
          a?.params?.name && ((a.params.bgmId = a.params.name), delete a.params.name),
          a
        ),
      },
    },
    selectors: {
      ...t.search.selectors,
      subTitle: { selector: ["span.torrent-listings-subhead"] },
      time: { selector: ["td.torrent-listings-age > span"], data: "originalTitle", filters: [{ name: "parseTime" }] },
      size: { selector: ["td.torrent-listings-size > span"], filters: [{ name: "parseSize" }] },
      author: { selector: ["span.torrent-listings-uploader"] },
      category: { selector: ["td.torrent-listings-format"], filters: [{ name: "split", args: ["	", 0] }] },
      completed: { selector: ['a[href*="/history"] > span.text-orange'] },
      comments: { text: "N/A" },
      status: {
        text: r.unknown,
        selector: ["button.btn.btn-circle"],
        case: {
          "button.btn.btn-success.btn-circle": r.seeding,
          "button.btn.btn-warning.btn-circle": r.downloading,
          "button.btn.btn-info.btn-circle": r.inactive,
          "button.btn.btn-danger.btn-circle": r.completed,
        },
      },
      progress: {
        text: 0,
        selector: ["button.btn.btn-circle"],
        case: {
          "button.btn.btn-success.btn-circle": 100,
          "button.btn.btn-warning.btn-circle, button.btn.btn-info.btn-circle, button.btn.btn-danger.btn-circle": 0,
        },
      },
      ext_bangumi: { selector: ['a[href*="bangumi.tv/subject"]'], attr: "href", filters: [{ name: "extBangumiId" }] },
      tags: [
        { selector: "span.torrent-listings-subtitle_tag", name: "中字" },
        { selector: "span.torrent-listings-hot", name: "热门" },
        { selector: "span.torrent-listings-cd", name: "附 CD" },
        { selector: "span.torrent-listings-sd", name: "附扫图" },
        { selector: "span.torrent-listings-freeleech", name: "Free" },
      ],
    },
  },
  list: [...t.list, { urlPattern: ["/torrents/airing/"] }],
  userInfo: {
    ...t.userInfo,
    selectors: {
      ...t.userInfo.selectors,
      bonus: { selector: ["li.ratio-bar__points a:has( > i.fa-coins)"], filters: [{ name: "parseNumber" }] },
      uploads: {
        selector: ['div.container div.block div.text-center a[href*="/uploads"]'],
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: { selector: ["aside .panelV2 dd:nth-child(6)"], filters: [{ name: "parseNumber" }] },
    },
  },
  levelRequirements: [
    { id: 1, name: "User", privilege: "新用户默认等级;可以正常下载/上传，访问论坛" },
    { id: 2, name: "PowerUser", uploaded: "1TiB", interval: "P1M", privilege: "访问邀请区" },
    { id: 3, name: "SuperUser", uploaded: "2TiB", interval: "P2M", privilege: "访问邀请区" },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "5TiB",
      interval: "P3M",
      privilege: "自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "10TiB",
      interval: "P6M",
      privilege: "自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "15TiB",
      interval: "P12M",
      privilege: "个人全局双倍上传 自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 7,
      name: "Seeder",
      groupType: "user",
      seedingSize: "3TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      privilege: "自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 8,
      name: "Archivist",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P60D",
      privilege: "个人全局双倍上传 自动通过候选 调整隐私设置 访问邀请区",
    },
  ],
};
class F extends i {
  async getUserBonusPerHour(n) {
    const { data: e } = await this.request(
      { url: `/users/${n}/bonus/transactions/create`, responseType: "document" },
      !0,
    );
    return this.getFieldData(e, this.metadata.userInfo?.selectors?.bonusPerHour);
  }
  async getTorrentDownloadLink(n) {
    const e = await o.prototype.getTorrentDownloadLink.call(this, n);
    if (e && !e.includes("/download/")) {
      const { data: s } = await this.request({ url: e, responseType: "document" });
      return this.getFieldData(s, this.metadata.search?.selectors?.link);
    }
    return e;
  }
}
export { F as default, A as siteMetadata };
