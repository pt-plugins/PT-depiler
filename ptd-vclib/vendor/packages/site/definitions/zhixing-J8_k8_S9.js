import { u } from "../../../url-join/url-join-Cu798wIg.js";
import { K as d } from "../index-COeZNva1.js";
import p from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import { E as f } from "../types/base-Dy_28wGT.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/torrent-BvvY2NbA.js";
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
const L = {
  id: "zhixing",
  version: 1,
  name: "知行PT",
  description: "北京交通大学知行PT",
  tags: ["教育网", "综合", "影视"],
  timezoneOffset: "+0800",
  collaborator: ["wanicca", "Rhilip"],
  type: "private",
  schema: "CGBTSource",
  urls: ["http://pt.zhixing.bjtu.edu.cn/"],
  category: [
    {
      name: "类别",
      key: "category",
      options: [
        { name: "全部", value: "" },
        { name: "电影", value: "movie" },
        { name: "剧集", value: "tv" },
        { name: "音乐", value: "music" },
        { name: "动漫", value: "comic" },
        { name: "游戏", value: "game" },
        { name: "综艺", value: "zongyi" },
        { name: "体育", value: "sports" },
        { name: "软件", value: "software" },
        { name: "学习", value: "study" },
        { name: "纪录片", value: "documentary" },
        { name: "其他", value: "other" },
      ],
      cross: !1,
      generateRequestConfig: (t) => ({ requestConfig: { url: `/search/${t}/` } }),
    },
  ],
  search: {
    requestConfig: { url: "/search/" },
    requestConfigTransformer: ({ keywords: t, requestConfig: r }) => {
      const e = r.url || "";
      return (t && (delete r.params?.keywords, (r.url = u(e, `x${t}`))), r);
    },
    selectors: {
      rows: { selector: "table.torrenttable > tbody > tr:gt(0)" },
      id: { selector: ":self", attr: "id", filters: [{ name: "replace", args: [/^t/, ""] }] },
      title: { selector: "a[name='title']" },
      url: { selector: "a[name='title']", attr: "href" },
      link: { selector: "a[href*='/download/']", attr: "href" },
      time: {
        selector: " > td:nth-child(7)",
        filters: [{ name: "parseTime", args: ["MM-dd HH:mm", "yyyy-MM-dd HH:mm"] }],
      },
      size: { selector: " > td:nth-child(4)", filters: [{ name: "parseSize" }] },
      author: { selector: " > td:nth-child(11)" },
      seeders: { selector: " > td:nth-child(8)" },
      leechers: { selector: " > td:nth-child(9)" },
      completed: { selector: " > td:nth-child(10)" },
      comments: { selector: " > td:nth-child(5)" },
      category: {
        selector: "td.icon-td > img",
        attr: "src",
        filters: [(t) => t.split("/").at(-1)?.replace(".png", "")],
      },
      tags: [
        { name: "Free", selector: "img[src^='/static/images/btn_free.gif']", color: "blue" },
        { name: "50%", selector: "img[src^='/static/images/btn_50p.gif']", color: "orange" },
        { name: "30%", selector: "img[src^='/static/images/btn_30p.gif']", color: "indigo" },
      ],
    },
  },
  detail: {
    urlPattern: ["/torrents/(\\d+)"],
    selectors: {
      id: { selector: "a[href*='/download/']", attr: "href", filters: [{ name: "parseNumber" }] },
      title: { selector: "div.torrent-title h1", filters: [{ name: "replace", args: ["种子名称：", ""] }] },
      link: { selector: "a[href*='/download/']", attr: "href" },
    },
  },
  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: "strong.vwmy > a[href*='/user/']:first",
            attr: "href",
            filters: [{ name: "split", args: ["/", 2] }],
          },
          name: { selector: "strong.vwmy > a[href*='/user/']:first" },
        },
      },
      {
        requestConfig: { url: "/user/$id$" },
        assertion: { id: "url" },
        selectors: {
          uploaded: { selector: ["p:contains('上传流量:')"], filters: [{ name: "parseSize" }] },
          downloaded: { selector: ["p:contains('下载流量:')"], filters: [{ name: "parseSize" }] },
          ratio: {
            selector: "p:contains('共享率')",
            filters: [
              { name: "replace", args: [/共享率: | (下载-虚拟下载小于20G则共享率为0)/, ""] },
              { name: "parseNumber" },
            ],
          },
          levelName: { selector: ["p:contains('用户组：')"], filters: [(t) => t.match(/用户组：([^ ]+)/)?.[1] ?? ""] },
          bonus: { selector: ["p:contains('总积分：')"], filters: [{ name: "parseNumber" }] },
          seedingBonus: { selector: ["p:contains('保种积分')"], filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: ["p:contains('注册时间：')"],
            filters: [{ name: "split", args: ["：", 1] }, { name: "parseTime" }],
          },
          seeding: { selector: ["p:contains('当前保种数量：')"], filters: [{ name: "parseNumber" }] },
          seedingSize: { selector: ["p:contains('当前保种容量：')"], filters: [{ name: "parseSize" }] },
          lastAccessAt: {
            selector: ["p:contains('上次IPv6访问时间：')", "p:contains('上次访问时间：')"],
            filters: [{ name: "split", args: ["：", 1] }, { name: "parseTime" }],
          },
        },
      },
    ],
  },
  levelRequirements: [
    { id: 0, name: "地狱使者", bonus: -999 },
    { id: 1, name: "武林新丁", bonus: -1 },
    { id: 2, name: "江湖小虾", bonus: 20 },
    { id: 3, name: "后起之秀", bonus: 100 },
    { id: 4, name: "武林高手", bonus: 200 },
    { id: 5, name: "风尘奇侠", bonus: 500 },
    { id: 6, name: "无双隐士", bonus: 1e3 },
    { id: 7, name: "世外高人", bonus: 2e3 },
    { id: 8, name: "江湖侠隐", bonus: 4e3 },
    { id: 9, name: "无敌圣者", bonus: 7e3 },
    { id: 10, name: "三界贤君", bonus: 12e3 },
  ],
};
class E extends p {
  async parseUserInfoForUserTorrent(r, e) {
    const s = { count: 0, size: 0 };
    let a = 1;
    for (;;) {
      const n = { url: `/user/${e}/${r}/p${a}` },
        { data: o } = await this.request(n),
        l = d(o);
      try {
        const i = await this.transformSearchPage(l, {
          searchEntry: this.metadata.search,
          requestConfig: n,
          keywords: "",
        });
        if (i.length === 0) break;
        ((s.count += i.length), (s.size += i.reduce((c, m) => c + (m.size || 0), 0)), (a += 1));
      } catch {
        break;
      }
    }
    return s;
  }
  async getUserInfoResult(r = {}) {
    const e = await super.getUserInfoResult(r);
    if (e.status === f.success && e.id) {
      const s = await this.parseUserInfoForUserTorrent("seeding", e.id);
      ((e.seeding = s.count), (e.seedingSize = s.size));
      const a = await this.parseUserInfoForUserTorrent("uploaded", e.id);
      e.uploads = a.count;
    }
    return e;
  }
}
export { E as default, L as siteMetadata };
