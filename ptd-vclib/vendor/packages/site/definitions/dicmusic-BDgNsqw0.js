import "../index-COeZNva1.js";
import { a } from "../utils/helper-OCngMtkv.js";
import t, { SchemaMetadata as i } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const w = {
  ...i,
  version: 1,
  id: "dicmusic",
  name: "DICMusic",
  aka: ["DIC", "海豚"],
  description: "DICMusic 是一个专注于音乐的中文 Gazelle 站点",
  tags: ["音乐"],
  timezoneOffset: "+0800",
  collaborator: ["ylxb2016", "enigmaz", "amorphobia", "Ljcbaby"],
  type: "private",
  schema: "GazelleJSONAPI",
  urls: ["uggcf://qvpzhfvp.pbz/"],
  legacyUrls: ["https://dicmusic.club/"],
  category: [
    {
      name: "分类",
      key: "filter_cat",
      options: [
        { value: 1, name: "Music" },
        { value: 2, name: "Applications" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "编码",
      key: "encoding",
      options: a([
        "192",
        "APS (VBR)",
        "V2 (VBR)",
        "V1 (VBR)",
        "q8.x (VBR)",
        "320",
        "Lossless",
        "24bit Lossless",
        "Other",
      ]),
      cross: !1,
    },
    {
      name: "格式",
      key: "format",
      options: a(["FLAC", "WAV", "DSD", "MP3", "AAC", "DTS", "Lossless", "24bit Lossless", "Other"]),
      cross: !1,
    },
    {
      name: "媒介",
      key: "media",
      options: a(["CD", "DVD", "Vinyl", "Soundboard", "SACD", "Blu-ray", "DAT", "Cassette", "WEB", "Unknown Media"]),
      cross: !1,
    },
    {
      name: "发行类别",
      key: "releasetype",
      options: [
        { value: "1", name: "专辑" },
        { value: "3", name: "原声" },
        { value: "5", name: "EP" },
        { value: "6", name: "精选" },
        { value: "7", name: "集锦" },
        { value: "9", name: "单曲专辑" },
        { value: "11", name: "重混音" },
        { value: "13", name: "重混音" },
        { value: "21", name: "未知" },
      ],
      cross: !1,
    },
    {
      name: "有 Log",
      key: "haslog",
      options: [
        { value: "1", name: "是" },
        { value: "0", name: "否" },
        { value: "100", name: "100% only" },
        { value: "-1", name: "<100%/Unscored" },
      ],
      cross: !1,
    },
    {
      name: "有 Cue",
      key: "hascue",
      options: [
        { value: "1", name: "是" },
        { value: "0", name: "否" },
      ],
      cross: !1,
    },
    {
      name: "促销",
      key: "freetorrent",
      options: [
        { value: "1", name: "免费种子" },
        { value: "2", name: "中性种子" },
        { value: "3", name: "上述两者" },
        { value: "0", name: "普通种子" },
      ],
      cross: !1,
    },
  ],
  search: {
    keywordPath: "params.searchstr",
    requestConfig: { url: "/ajax.php", responseType: "json", params: { action: "browse", searchsubmit: 1 } },
    advanceKeywordParams: { imdb: !1 },
  },
  userInfo: {
    ...i.userInfo,
    selectors: {
      ...i.userInfo.selectors,
      bonusPerHour: {
        selector: ["table#bprates_overview > tbody > tr > td:eq(1)"],
        filters: [{ name: "parseNumber" }],
      },
      bonus: { selector: ["div#content > div.header > h3"], filters: [{ name: "parseNumber" }] },
      seedingSize: { selector: ["table#bprates_overview > tbody > tr > td:eq(1)"], filters: [{ name: "parseSize" }] },
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "User",
      interval: "P1W",
      uploaded: "0.1GiB",
      ratio: 0.1,
      privilege: "能够使用 RSS 订阅系统；具有论坛「茶话会」版块的阅读权限",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10GiB",
      ratio: 0.7,
      privilege: "发起求种；查看部分排行榜；完全访问「茶话会」版块",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploaded: "25GiB",
      ratio: 1.05,
      uploads: 5,
      isKept: !0,
      privilege:
        "免疫账号不活跃；发送邀请，赠送1枚永久邀请；佩戴1枚印记；创建1个私人合集；访问「求邀区」「发邀区」「Power User」版块；完全访问排行榜",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P4W",
      uploaded: "75GiB",
      ratio: 1.05,
      uploads: 50,
      isKept: !0,
      privilege:
        "首次赠送1枚永久邀请；佩戴2枚印记；创建2个私人合集；访问「Elite」版块；检查自己的种子；编辑所有种子；购买「自定义头衔（不允许 BBCode）」",
    },
    {
      id: 5,
      name: "Torrent Master",
      interval: "P8W",
      uploaded: "200GiB",
      ratio: 1.05,
      uploads: 150,
      isKept: !0,
      privilege: "首次赠送2枚永久邀请；每月获赠 1 枚临时邀请；佩戴3枚印记；创建3个私人合集；访问「Torrent Master」版块",
    },
    {
      id: 6,
      name: "Power Torrent Master",
      nameAka: ["Power TM"],
      interval: "P8W",
      uploaded: "200GiB",
      ratio: 1.05,
      uniqueGroups: 300,
      isKept: !0,
      privilege: "首次赠送2枚永久邀请；每月获赠 2 枚临时邀请；佩戴4枚印记；创建4个私人合集；能够检查所有种子",
    },
    {
      id: 7,
      name: "Elite Torrent Master",
      nameAka: ["Elite TM"],
      interval: "P12W",
      uploaded: "600GiB",
      ratio: 1.05,
      perfectFlacs: 500,
      isKept: !0,
      privilege:
        "首次赠送3枚永久邀请；每月获赠 3 枚临时邀请；佩戴5枚印记；创建5个私人合集；访问「Elite Torrent Master」版块",
    },
    {
      id: 8,
      name: "Elite TM +",
      interval: "P12W",
      uploaded: "600GiB",
      ratio: 1.05,
      perfectFlacs: 500,
      isKept: !0,
      privilege: "首次赠送3枚永久邀请；每月获赠 3 枚临时邀请；能够在商城购买「自定义头衔（允许 BBCode）」",
    },
    {
      id: 9,
      name: "Guru",
      interval: "P16W",
      uploaded: "1.2TiB",
      ratio: 1.05,
      isKept: !0,
      perfectFlacs: 1e3,
      privilege: "拥有无限邀请；佩戴6枚印记；创建6个私人合集；访问「Guru」版块；查看种子检查日志",
    },
    { id: 100, name: "VIP", groupType: "vip", privilege: "对站点做过特殊贡献或特邀会员" },
    { id: 101, name: "Legend", groupType: "vip", privilege: "对站点做出过杰出贡献的会员" },
    {
      id: 200,
      name: "First-Line Support",
      groupType: "manager",
      privilege: "协助站点日常工作，并在用户需要帮助时为他们提供支持",
    },
    {
      id: 201,
      name: "Torrent Inspector",
      groupType: "manager",
      privilege: "协助 Torrent Moderator 的种子管理工作，并在用户需要帮助时为他们提供支持",
    },
    { id: 202, name: "Interviewer", groupType: "manager", privilege: "面试并邀请新会员的用户" },
    { id: 203, name: "Translators", groupType: "manager", privilege: "协助站点的翻译人员" },
    {
      id: 204,
      name: "Torrent Celebrity",
      groupType: "manager",
      privilege: "由管理人员选出负责友站的邀请开设、维护方面的人员。并由管理人员授权",
    },
    { id: 205, name: "Designer", groupType: "manager" },
    { id: 206, name: "Security", groupType: "manager" },
    { id: 210, name: "Forum Moderator", groupType: "manager", privilege: "监督和审核论坛和种子评论" },
    { id: 211, name: "Torrent Moderator", groupType: "manager", privilege: "监督和完善种子" },
    {
      id: 212,
      name: "Moderator",
      groupType: "manager",
      privilege: "总管种子和网站一般内容。同时帮助和指导次用户等级成员",
    },
    { id: 213, name: "Developer", groupType: "manager", privilege: "设计和编写站点代码" },
    { id: 214, name: "Administrator", groupType: "manager", privilege: "一般站点管理和对其他工作人员的监督" },
    { id: 215, name: "SysOp", groupType: "manager", privilege: "一般站点管理和对其他工作人员的监督" },
  ],
};
class A extends t {
  async getSeedingSize(o, r = 0) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: e } = await this.request({ url: "/bonus.php?action=bprates", responseType: "document" });
    return this.getFieldsData(e, this.metadata.userInfo.selectors, ["seedingSize", "bonus", "bonusPerHour"]);
  }
  async transformGroupTorrent(o, r) {
    const e = await super.transformGroupTorrent(o, r);
    return (r.jinzhuan && e.tags?.push({ name: "Excl.", color: "deep-orange-darken-1" }), e);
  }
}
export { A as default, w as siteMetadata };
