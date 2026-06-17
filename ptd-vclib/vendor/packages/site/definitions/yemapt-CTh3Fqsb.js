import l from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const s = [
    { id: 0, name: "乱民", ratio: 0.3, privilege: "无" },
    { id: 1, name: "小卒", ratio: 0.5, privilege: "注册后默认等级，待系统更新后会自动升级到level2" },
    { id: 2, name: "教谕", ratio: 0.6, privilege: "可查看站点统计" },
    {
      id: 3,
      name: "登仕郎",
      downloaded: "100GB",
      ratio: 1,
      privilege: "新注册用户系统定时更新后的默认等级；可查看种子TOP10排行",
    },
    {
      id: 4,
      name: "修职郎",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 2,
      privilege: "可查看种子TOP250信息；可查看用户TOP10信息",
    },
    {
      id: 5,
      name: "文林郎",
      interval: "P8W",
      downloaded: "400GB",
      ratio: 3,
      privilege: "可查看用户TOP250信息，可匿名发帖",
    },
    { id: 6, name: "忠武校尉", interval: "P12W", downloaded: "500GB", ratio: 4, privilege: "可设定免候选发布种子" },
    { id: 7, name: "承信将军", interval: "P16W", downloaded: "800GB", ratio: 5, privilege: "发帖可禁止评论" },
    { id: 8, name: "武毅将军", interval: "P20W", downloaded: "1TB", ratio: 6, privilege: "无" },
    {
      id: 9,
      name: "武节将军",
      interval: "P24W",
      downloaded: "2TB",
      ratio: 7,
      isKept: !0,
      privilege: "此等级及以上用户，账号将永久保留",
    },
    { id: 10, name: "显威将军", interval: "P28W", downloaded: "2.5TB", ratio: 8, isKept: !0, privilege: "无" },
    { id: 11, name: "宣武将军", interval: "P32W", downloaded: "3TB", ratio: 9, isKept: !0, privilege: "无" },
  ],
  d = [
    { name: "无", value: "none" },
    { name: "50%", value: "half" },
    { name: "Free", value: "free" },
  ],
  m = [
    { name: "无", value: "none" },
    { name: "1.5xUp", value: "one_half" },
    { name: "2xUp", value: "double_upload" },
  ],
  p = {
    id: "ID",
    fileSize: "大小",
    leechNum: "下载数",
    seedNum: "做种数",
    completedNum: "完成数",
    listingTime: "发布时间",
    uploadPromotionEndTime: "上传促销结束时间",
    downloadPromotionEndTime: "下载促销结束时间",
  },
  u = { descend: "降序", ascend: "升序" },
  q = {
    version: 1,
    id: "yemapt",
    name: "YemaPT",
    description:
      "YemaPT 是一个由全新技术架构构建而来的综合类资源PT站点。有分享率和登录要求，可访问 wiki.yemapt.org 查看。",
    tags: ["综合"],
    collaborator: ["Rhilip"],
    timezoneOffset: "+0800",
    type: "private",
    schema: "YemaPT",
    urls: ["https://www.yemapt.org/"],
    category: [
      {
        name: "类目",
        key: "categoryId",
        keyPath: "data",
        options: [
          { name: "影视", value: "1" },
          { name: "影视 / 电影", value: "4" },
          { name: "影视 / 剧集", value: "5" },
          { name: "影视 / 综艺", value: "13" },
          { name: "影视 / 动漫", value: "14" },
          { name: "影视 / 纪录片", value: "15" },
          { name: "影视 / 体育", value: "17" },
          { name: "影视 / 短剧", value: "6" },
          { name: "影视 / MV/演唱会", value: "16" },
          { name: "综合", value: "2" },
          { name: "综合 / 软件", value: "3" },
          { name: "综合 / 游戏", value: "10" },
          { name: "综合 / 书籍", value: "12" },
          { name: "综合 / 其他", value: "22" },
          { name: "音频", value: "7" },
          { name: "音频 / 音乐", value: "8" },
          { name: "音频 / 广播剧", value: "9" },
          { name: "教育", value: "18" },
          { name: "教育 / 教育书籍", value: "19" },
          { name: "教育 / 教育音频", value: "20" },
          { name: "教育 / 教育视频", value: "21" },
        ],
        cross: !1,
      },
      { name: "下载促销", key: "downloadPromotionType", keyPath: "data", options: d, cross: !1 },
      { name: "上传促销", key: "uploadPromotionType", keyPath: "data", options: m, cross: !1 },
      {
        name: "排序",
        key: "sorter",
        options: Object.entries(p).flatMap(([t, e]) =>
          Object.entries(u).map(([r, o]) => ({ name: `${e} ${o}`, value: `${t}:${r}` })),
        ),
        cross: !1,
        generateRequestConfig: (t) => {
          const [e, r] = String(t).split(":");
          return { requestConfig: { data: { sorter: { field: e, order: r } } } };
        },
      },
    ],
    search: {
      keywordPath: "data.keyword",
      requestConfig: {
        method: "POST",
        url: "/api/torrent/fetchOpenTorrentList",
        responseType: "json",
        data: {
          pageParam: { current: 1, pageSize: 40, total: 1e3 },
          sorter: { order: "descend", field: "listingTime" },
        },
      },
      selectors: {
        rows: { selector: "data" },
        id: { selector: "id" },
        title: { selector: "showName" },
        subTitle: { selector: "shortDesc" },
        url: { selector: "id", filters: [{ name: "prepend", args: ["/#/torrent/detail/"] }] },
        link: { selector: "id", filters: [{ name: "prepend", args: ["/api/torrent/download?id="] }] },
        time: { selector: "listingTime", filters: [{ name: "parseTime", args: ["yyyy-MM-dd'T'HH:mm:ss.SSSXXX"] }] },
        size: { selector: "fileSize" },
        author: { selector: "userInfo.name" },
        seeders: { selector: "seedNum" },
        leechers: { selector: "leechNum" },
        completed: { text: 0 },
        comments: { text: 0 },
        category: { selector: "categoryName" },
        ext_douban: { text: "", selector: "douban" },
        ext_imdb: { text: "", selector: "imdb", filters: [{ name: "extImdbId" }] },
      },
    },
    list: [
      {
        urlPattern: ["/#/openTorrent/list"],
        mergeSearchSelectors: !1,
        selectors: {
          rows: { selector: "tr[data-row-key]" },
          id: { selector: ":self", attr: "data-row-key" },
          title: { selector: [".torrent-title", "a[href*='#/torrent/detail/']", "a[href*='/#/torrent/detail/']"] },
          subTitle: { selector: ".short-desc" },
          url: {
            selector: ":self",
            attr: "data-row-key",
            filters: [{ name: "prepend", args: ["/#/torrent/detail/"] }],
          },
          link: {
            selector: ":self",
            attr: "data-row-key",
            filters: [{ name: "prepend", args: ["/api/torrent/download?id="] }],
          },
          size: { selector: ".file-size", filters: [{ name: "parseSize" }] },
        },
      },
    ],
    detail: {
      urlPattern: ["/#/torrent/detail/\\d+/?"],
      selectors: {
        id: { selector: ":self", elementProcess: (t) => t.URL.match(/\/#\/torrent\/detail\/(\d+)\/?/)?.[1] ?? t.URL },
        title: { selector: ".torrent-title" },
        link: { text: "" },
      },
    },
    userInfo: {
      process: [
        {
          requestConfig: { url: "/api/consumer/fetchSelfDetail", responseType: "json" },
          selectors: {
            id: { selector: "data.id" },
            name: { selector: "data.name" },
            levelName: { selector: "data.level", filters: [(t) => s.find((e) => e.id === t)?.name ?? t] },
            levelId: { selector: "data.level" },
            joinTime: {
              selector: "data.registerTime",
              filters: [{ name: "parseTime", args: ["yyyy-MM-dd'T'HH:mm:ss.SSSXXX"] }],
            },
            invites: { selector: "data.invitedNum" },
            uploaded: { selector: "data.promotionUploadSize" },
            downloaded: { selector: "data.promotionDownloadSize" },
            trueUploaded: { selector: "data.uploadSize" },
            trueDownloaded: { selector: "data.downloadSize" },
            bonus: { selector: "data.bonus" },
          },
        },
        {
          requestConfig: { url: "/api/torrent/fetchSelfTorrentCount", method: "POST", data: {}, responseType: "json" },
          selectors: { uploads: { selector: "data" } },
        },
        {
          requestConfig: { url: "/api/userTorrent/fetchSeedTorrentInfo", method: "POST", responseType: "json" },
          selectors: { seeding: { selector: "data.num" }, seedingSize: { selector: "data.fileSize" } },
        },
        {
          requestConfig: { url: "/api/consumer/fetchUserPointAcc", responseType: "json" },
          selectors: {
            bonusPerHour: {
              selector: "data",
              filters: [(t) => (t ? t.hourPoint + t.hourBasePoint + t.hourOwnerPoint : 0)],
            },
          },
        },
      ],
    },
    levelRequirements: s,
    userInputSettingMeta: [
      {
        name: "token",
        label: "API Auth Key",
        hint: "在个人面板 - 详情 - 安全设定中获取 API Auth Key 并填入此处",
        required: !0,
      },
    ],
  },
  i = {
    1: { name: "禁转" },
    2: { name: "首发" },
    3: { name: "官组" },
    4: { name: "DIY" },
    5: { name: "国语" },
    6: { name: "中字" },
    7: { name: "粤语" },
    8: { name: "英字" },
    9: { name: "HDR10" },
    10: { name: "杜比视界" },
    11: { name: "连载中" },
    12: { name: "完结" },
    13: { name: "多国字幕" },
    14: { name: "HDR10+" },
    15: { name: "杜比全景声(Atmos)" },
    16: { name: "DTS-X" },
    17: { name: "5.1/7.1声道" },
    18: { name: "完结全集" },
    19: { name: "SP/剧场版/OVA" },
  };
class B extends l {
  async request(e, r = !0) {
    e.headers = { ...(e.headers ?? {}), Authorization: this.userConfig.inputSetting.token ?? "" };
    const o = await super.request(e, !1),
      a = o.data;
    if (r && a && typeof a == "object" && a.success === !1)
      throw new Error(a.errorMessage || "YemaPT API request failed");
    return o;
  }
  fixLink(e, r) {
    return super.fixLink(e, { ...r, baseURL: this.url });
  }
  async getTorrentDownloadLink(e) {
    const { data: r } = await this.request({
        url: "/api/torrent/generateDownloadKey",
        method: "GET",
        responseType: "json",
        params: { id: e.id },
      }),
      o = r?.data,
      a = typeof o == "string" ? o : (o?.key ?? o?.token);
    if (!a) throw new Error(`Failed to generate YemaPT download key for torrent ${e.id}`);
    return new URL(`/api/torrent/download1?token=${encodeURIComponent(a)}`, this.url).toString();
  }
  async getTorrentDownloadRequestConfig(e) {
    return { url: await this.getTorrentDownloadLink(e), method: "GET", timeout: this.userConfig.timeout ?? 3e4 };
  }
  parseTorrentRowForTags(e, r, o) {
    const a = [];
    switch (r.uploadPromotion) {
      case "double_upload":
        a.push({ name: "2xUp", color: "green" });
        break;
      case "one_half":
        a.push({ name: "1.5xUp", color: "light-green" });
        break;
    }
    switch (r.downloadPromotion) {
      case "free":
        a.push({ name: "Free", color: "blue" });
        break;
      case "half":
        a.push({ name: "50%", color: "orange" });
        break;
    }
    for (const n of r.tagList ?? []) i[n] && a.push(i[n]);
    return ((e.tags = a), e);
  }
}
export { B as default, q as siteMetadata };
