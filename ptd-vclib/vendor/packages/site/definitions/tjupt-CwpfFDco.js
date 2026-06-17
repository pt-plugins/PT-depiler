import { S as o, bD as c } from "../index-COeZNva1.js";
import { E as i } from "../types/torrent-BvvY2NbA.js";
import d, {
  SchemaMetadata as t,
  CategoryIncldead as u,
  CategoryInclbookmarked as g,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
const v = {
    selector: ["div.probar_b1, div.probar_b2, div.probar_b3"],
    attr: "style",
    filters: [
      (a) => {
        a = a || "";
        const e = a.match(/width:([ \d.]+)%/);
        return e && e.length >= 2 ? parseFloat(e[1]) : 0;
      },
    ],
  },
  h = {
    selector: ['div[class*="probar_a"]'],
    attr: "class",
    filters: [
      (a) => {
        const e = a.match(/probar_[ab]([123])/);
        if (e && e.length >= 2)
          switch (parseInt(e[1])) {
            case 1:
              return i.downloading;
            case 2:
              return i.seeding;
            case 3:
              return i.inactive;
          }
        return i.unknown;
      },
    ],
  },
  I = {
    ...t,
    version: 1,
    id: "tjupt",
    name: "北洋园PT",
    aka: ["北洋园"],
    schema: "NexusPHP",
    type: "private",
    urls: ["uggcf://gwhcg.bet/", "uggcf://jjj.gwhcg.bet/"],
    description:
      "TJUPT是天津市首个、全国前列的校园Private Tracker，建立于2010年，由天津大学信网协会和天外天共同开发的，旨在为大家建立一个更好的资源共享环境，提高资源水准。",
    tags: ["教育网", "影视", "综合"],
    collaborator: ["tongyifan", "echo094", "Rhilip"],
    category: [
      {
        name: "类型",
        key: "cat",
        options: [
          { name: "电影", value: 401 },
          { name: "剧集", value: 402 },
          { name: "综艺", value: 403 },
          { name: "资料", value: 404 },
          { name: "动漫", value: 405 },
          { name: "音乐", value: 406 },
          { name: "体育", value: 407 },
          { name: "软件", value: 408 },
          { name: "游戏", value: 409 },
          { name: "纪录片", value: 411 },
          { name: "移动视频", value: 412 },
          { name: "其他", value: 410 },
        ],
        cross: { mode: "brackets" },
      },
      u,
      {
        name: "显示促销种子？",
        key: "spstate",
        options: [
          { name: "全部", value: 0 },
          { name: "普通", value: 1 },
          { name: "2倍上传", value: 3 },
        ],
        cross: !1,
      },
      {
        name: "显示推荐？",
        key: "picktype",
        options: [
          { name: "全部", value: 0 },
          { name: "普通", value: 1 },
          { name: "热门", value: 2 },
          { name: "经典", value: 3 },
          { name: "推荐", value: 4 },
          { name: "0day", value: 5 },
          { name: "IMDB TOP 250", value: 6 },
        ],
        cross: !1,
      },
      g,
      {
        name: "显示保种？",
        key: "keepseed",
        options: [
          { name: "全部", value: 0 },
          { name: "仅保种", value: 1 },
          { name: "非保种", value: 2 },
        ],
        cross: !1,
      },
    ],
    officialGroupPattern: [/TJUPT$/],
    search: {
      ...t.search,
      advanceKeywordParams: {
        ...t.search.advanceKeywordParams,
        douban: { requestConfigTransformer: ({ requestConfig: a }) => (c(a, "params.search_area", 5), a) },
      },
      selectors: {
        ...t.search.selectors,
        rows: { selector: "table.torrents:last > tbody > tr:gt(0):not(:last)" },
        progress: v,
        status: h,
        tags: [
          { name: "H&R", selector: "*", color: "red" },
          { name: "禁转", selector: ".tag.tag-exclusive", color: "red" },
          { name: "官方", selector: ".tag.tag-tjupt", color: "light-blue" },
          { name: "驻站", selector: ".tag.tag-internal-team", color: "green" },
          { name: "中字", selector: ".tag.tag-chinese", color: "light-green" },
          { name: "应求", selector: ".tag.tag-response", color: "indigo" },
          { name: "竞价置顶", selector: ".tag.tag-sticky", color: "yellow" },
          { name: "加速中", selector: ".tag.tag-speedup", color: "pink" },
          { name: "救活", selector: ".tag.tag-reseed", color: "indigo" },
        ],
      },
    },
    list: [...t.list, { urlPattern: ["/speedup.php"] }],
    userInfo: {
      ...t.userInfo,
      selectors: {
        ...t.userInfo.selectors,
        uploaded: { selector: ["td.rowhead:contains('上传量') + td"], filters: [{ name: "parseSize" }] },
        messageCount: { ...t.userInfo.selectors.messageCount, selector: ["#msg-bar a[href*='messages.php'] strong"] },
        hnrPreWarning: {
          text: 0,
          selector: ["#info_block a[href*='hnr_details.php']:last"],
          filters: [{ name: "parseNumber" }],
        },
      },
      process: [
        ...t.userInfo.process.filter((a) => a.requestConfig.url !== "/mybonus.php"),
        {
          requestConfig: { url: "/bonus.php", params: { show: "description" }, responseType: "document" },
          fields: ["bonusPerHour"],
        },
      ],
    },
    levelRequirements: [
      { id: 1, name: "无名小辈", nameAka: ["User"], privilege: "新用户的默认级别。" },
      {
        id: 2,
        name: "拜师学艺",
        nameAka: ["Power User"],
        interval: "P4W",
        snatches: 20,
        seedingTime: "P30D",
        uploaded: "50GB",
        hnrUnsatisfied: 0,
        bonus: 1e4,
        privilege: "查看用户列表；请求续种；查看其他用户种子历史（隐私等级不为高时）；删除自己上传的字幕。",
      },
      {
        id: 3,
        name: "持剑下山",
        nameAka: ["Elite User"],
        interval: "P8W",
        snatches: 60,
        seedingTime: "P120D",
        uploaded: "200GB",
        hnrUnsatisfied: 0,
        bonus: 3e4,
        privilege: "封存账号后不会被删除。",
      },
      {
        id: 4,
        name: "初入江湖",
        nameAka: ["Crazy User"],
        interval: "P16W",
        snatches: 150,
        seedingTime: "P450D",
        uploaded: "800GB",
        uploads: 1,
        hnrUnsatisfied: 0,
        bonus: 8e4,
        privilege: "首次升级至此等级时将获得1个永久邀请；发送邀请；做种/下载/发布时可以选择匿名。",
      },
      {
        id: 5,
        name: "小有名气",
        nameAka: ["Insane User"],
        interval: "P28W",
        snatches: 300,
        seedingTime: "P1500D",
        uploaded: "2000GB",
        uploads: 5,
        hnrUnsatisfied: 0,
        bonus: 15e4,
        privilege: "首次升级至此等级时将获得1个永久邀请；查看普通日志。",
      },
      {
        id: 6,
        name: "威震一方",
        nameAka: ["Veteran User"],
        interval: "P48W",
        snatches: 600,
        seedingTime: "P4200D",
        uploaded: "5000GB",
        uploads: 10,
        hnrUnsatisfied: 0,
        bonus: 3e5,
        isKept: !0,
        privilege: "首次升级至此等级时将获得1个永久邀请；查看其它用户的评论、帖子历史；永久保留账号。",
      },
      {
        id: 7,
        name: "横扫群雄",
        nameAka: ["Extreme User"],
        interval: "P72W",
        snatches: 1e3,
        seedingTime: "P28000D",
        uploaded: "10000GB",
        uploads: 15,
        hnrUnsatisfied: 0,
        bonus: 4e5,
        isKept: !0,
        privilege: "首次升级至此等级时将获得1个永久邀请。",
      },
      {
        id: 8,
        name: "开宗立派",
        nameAka: ["Ultimate User"],
        interval: "P100W",
        snatches: 1800,
        seedingTime: "P90000D",
        uploaded: "20000GB",
        uploads: 30,
        hnrUnsatisfied: 0,
        bonus: 6e5,
        isKept: !0,
        privilege: "首次升级至此等级时将获得2个永久邀请。",
      },
      {
        id: 9,
        name: "天下无敌",
        nameAka: ["Nexus Master"],
        interval: "P132W",
        snatches: 3e3,
        seedingTime: "P300000D",
        uploads: 50,
        uploaded: "50000GB",
        hnrUnsatisfied: 0,
        bonus: 1e6,
        isKept: !0,
        privilege: "首次升级至此等级时将获得3个永久邀请。",
      },
      { id: 100, name: "西域来客", groupType: "vip", privilege: "免除自动降级，不记录下载量，免除HnR考核。" },
      { id: 200, name: "扫地僧", groupType: "manager", privilege: "退休的管理组成员。" },
      {
        id: 201,
        name: "龙门镖局",
        groupType: "manager",
        privilege: "查看匿名用户的真实身份；每月魔力值奖励和邀请码奖励（根据发种情况浮动）",
      },
      {
        id: 202,
        name: "六扇门",
        groupType: "manager",
        privilege:
          "查看管理组信箱、举报信箱；编辑种子信息，删除种子，设置置顶和种子优惠，管理候选和字幕区；编辑、删除论坛帖子/种子评论；查看用户基础信息；拥有无限量邀请权限；每周魔力值奖励",
      },
      {
        id: 203,
        name: "中枢六部",
        groupType: "manager",
        privilege:
          "管理用户账号信息；发送全员消息、设置全局优惠、设置IP地址封禁及其它敏感操作；修改站点友链、论坛板块、种子板块、规则、常见问题、公告等站点信息；发放魔力值、批量邀请用户",
      },
      { id: 204, name: "锦衣卫", groupType: "manager", privilege: "修改站点设定；管理站点代码、服务器等" },
      { id: 205, name: "九五之尊", groupType: "manager", privilege: "管理捐赠；管理管理组任命；其他未被提及的权限..." },
    ],
  };
class R extends d {
  async parseUserInfoForUploads(e) {
    const { data: n } = await this.request({ url: "/classes.php", responseType: "document" });
    if (n) {
      const l = o("tr#9 li span:contains('≥1'):first", n);
      if (l.length > 0) {
        const s = l[0].textContent?.trim();
        if (s) {
          const r = s.match(/(\d+)\/50/);
          r && (e.uploads = parseInt(r[1]));
        }
      }
      const p = o("tr#9 li span:contains('>200MiB'):first", n);
      if (p.length > 0) {
        const s = p[0].textContent?.trim();
        if (s) {
          const r = s.match(/(\d+)\/3000/);
          r && (e.snatches = parseInt(r[1]));
        }
      }
      const m = o("tr#9 li span:contains('/300000'):first", n);
      if (m.length > 0) {
        const s = m[0].textContent?.trim();
        if (s) {
          const r = s.match(/([\d.]+)\/300000/);
          r && (e.seedingTime = Math.floor(parseFloat(r[1]) * 86400));
        }
      }
    }
    return (
      typeof e.uploads > "u" && (e.uploads = 0),
      typeof e.snatches > "u" && (e.snatches = 0),
      typeof e.seedingTime > "u" && (e.seedingTime = 0),
      e
    );
  }
}
export { R as default, v as selectorSearchProgress, h as selectorSearchStatus, I as siteMetadata };
