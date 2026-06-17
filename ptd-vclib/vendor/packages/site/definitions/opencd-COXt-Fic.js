import { E as n } from "../types/torrent-BvvY2NbA.js";
import o, {
  SchemaMetadata as a,
  CategoryIncldead as t,
  CategorySpstate as m,
  CategoryInclbookmarked as i,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import "../index-COeZNva1.js";
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
const s = {
    selector: [".progress:eq(0) > div"],
    attr: "style",
    filters: [
      (l) => {
        const e = l.match(/width:([ \d.]+)%/);
        return e && e.length >= 2 ? parseFloat(e[1]) : 0;
      },
    ],
  },
  u = {
    text: n.unknown,
    selector: [".progress:eq(0) > div"],
    case: {
      ".progress_seeding": n.seeding,
      ".progress_completed": n.completed,
      ".progress_no_downloading": n.inactive,
      ".progress_downloading": n.downloading,
    },
  },
  x = {
    ...a,
    version: 1,
    id: "opencd",
    name: "OpenCD",
    aka: ["皇后"],
    description: "皇后，专一的音乐类PT站，是目前国内最大的无损音乐PT",
    tags: ["音乐"],
    collaborator: ["*", "cnsunyour"],
    type: "private",
    schema: "NexusPHP",
    urls: ["uggcf://bcra.pq/", "uggcf://jjj.bcra.pq/"],
    favicon: "./opencd.ico",
    category: [
      {
        name: "類型",
        key: "cat",
        options: [
          { name: "音乐(Music)", value: 408 },
          { name: "演唱会(Vocal Concert)", value: 402 },
          { name: "戏剧(Drama)", value: 405 },
          { name: "其他(Other)", value: 409 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "類別",
        key: "source",
        options: [
          { name: "流行(Pop)", value: 2 },
          { name: "古典(Classical)", value: 3 },
          { name: "器乐(Instrumental)", value: 11 },
          { name: "原声(OST)", value: 4 },
          { name: "摇滚(Rock)", value: 5 },
          { name: "爵士(Jazz)", value: 8 },
          { name: "新世纪(NewAge)", value: 12 },
          { name: "舞曲(Dance)", value: 13 },
          { name: "电子(Electronic)", value: 14 },
          { name: "民谣(Folk)", value: 15 },
          { name: "独立(Indie)", value: 16 },
          { name: "嘻哈(Hip Hop)", value: 17 },
          { name: "音乐剧(Musical)", value: 18 },
          { name: "乡村(Country)", value: 19 },
          { name: "另类(Alternative)", value: 20 },
          { name: "世界音乐(World)", value: 21 },
          { name: "其他(Others)", value: 9 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "媒介",
        key: "medium",
        options: [
          { name: "CD", value: 1 },
          { name: "24KCD", value: 2 },
          { name: "DSD", value: 3 },
          { name: "LPCD", value: 4 },
          { name: "HDCD", value: 5 },
          { name: "SACD", value: 6 },
          { name: "SRCD", value: 7 },
          { name: "K2CD", value: 8 },
          { name: "DTS", value: 9 },
          { name: "DAT", value: 10 },
          { name: "Blu-ray", value: 11 },
          { name: "HD DVD", value: 12 },
          { name: "HDTV", value: 13 },
          { name: "DVD", value: 14 },
          { name: "HQCD", value: 16 },
          { name: "XRCD", value: 17 },
          { name: "SHM-CD", value: 18 },
          { name: "Blu-spec", value: 19 },
          { name: "Vinyl", value: 20 },
          { name: "Web", value: 21 },
          { name: "HI-RES", value: 22 },
          { name: "Other", value: 15 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "格式",
        key: "standard",
        options: [
          { name: "镜像(Mirror)", value: 1 },
          { name: "WAV", value: 2 },
          { name: "FLAC", value: 4 },
          { name: "DTS", value: 15 },
          { name: "DFF", value: 17 },
          { name: "DSF", value: 18 },
          { name: "DST", value: 19 },
          { name: "其它(Other)", value: 10 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "製作組",
        key: "team",
        options: [
          { name: "OpenCD", value: 7 },
          { name: "LLM", value: 8 },
          { name: "TSxD", value: 9 },
          { name: "KHQ", value: 6 },
          { name: "其他(Other)", value: 5 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "地区(Area)",
        key: "area",
        options: [
          { name: "大陆", value: 1 },
          { name: "欧美", value: 2 },
          { name: "港台", value: 3 },
          { name: "日韩", value: 4 },
          { name: "其它地区", value: 5 },
        ],
        cross: { mode: "append", key: "tag" },
      },
      {
        name: "风格(Style)",
        key: "style",
        options: [
          { name: "流行(Pop)", value: 6 },
          { name: "发烧(HiFi)", value: 7 },
          { name: "汽车(garage)", value: 8 },
          { name: "古典(Classical)", value: 9 },
          { name: "民族(National)", value: 10 },
          { name: "摇滚(rock)", value: 11 },
          { name: "原声(OST)", value: 12 },
          { name: "民间(Folk)", value: 13 },
          { name: "乡村(Country)", value: 14 },
          { name: "天籁(Soul)", value: 15 },
          { name: "新世纪(NewAge)", value: 16 },
          { name: "蓝调(Blues)", value: 17 },
          { name: "爵士(Jazz)", value: 18 },
          { name: "金属(Metal)", value: 19 },
          { name: "朋克(Punk)", value: 20 },
          { name: "电子(Electronic)", value: 21 },
          { name: "儿童(Children's)", value: 22 },
          { name: "宗教(Religion)", value: 23 },
          { name: "雷鬼(Reggae)", value: 24 },
          { name: "贝斯(Drum&Bass)", value: 25 },
          { name: "说唱(Rap)", value: 26 },
          { name: "音乐剧(Musical)", value: 27 },
        ],
        cross: { mode: "append", key: "tag" },
      },
      t,
      m,
      i,
      {
        name: "来源？",
        key: "boardid",
        options: [
          { name: "普通区", value: 1 },
          { name: "原抓区", value: 2 },
        ],
        cross: !1,
      },
      {
        name: "掃圖？",
        key: "artwork",
        options: [
          { name: "全部", value: 0 },
          { name: "完整掃圖", value: 1 },
          { name: "非完整掃圖", value: 2 },
        ],
        cross: !1,
      },
      {
        name: "Log？",
        key: "log",
        options: [
          { name: "全部", value: 0 },
          { name: "100分", value: 1 },
          { name: "非100分", value: 2 },
        ],
        cross: !1,
      },
      {
        name: "只顯示我下載過的？",
        key: "option-torrents",
        options: [
          { name: "全部", value: 0 },
          { name: "我下載過的", value: 1 },
          { name: "我下載過，但未在做種的", value: 2 },
          { name: "正在做種的", value: 3 },
          { name: "有H&R可能性的", value: 4 },
          { name: "正在下載的", value: 5 },
          { name: "未下載過的", value: 6 },
          { name: "未完成的", value: 7 },
          { name: "已得到H&R的", value: 8 },
          { name: "已完成的", value: 9 },
          { name: "我发布的", value: 10 },
          { name: "我发布的，但未在做種", value: 11 },
        ],
      },
    ],
    officialGroupPattern: ["OpenCD", "LLM", "TSxD", "KHQ"],
    search: {
      ...a.search,
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        ...a.search.selectors,
        progress: s,
        status: u,
        tags: [
          ...a.search.selectors.tags,
          { name: "H&R", selector: "*", color: "red" },
          { selector: "img[src*='pic/share_rule_1.gif']", name: "Excl.", color: "deep-orange-darken-1" },
        ],
      },
    },
    detail: {
      urlPattern: ["/plugin_details.php"],
      selectors: {
        id: {
          selector: ":self",
          elementProcess: (l) => {
            const r = l.URL.match(/id=(\d+)/);
            if (r && r.length >= 2) return r[1];
          },
        },
        title: { selector: 'td.rowtitle:contains("專輯名稱：") + td', attr: "title" },
        link: { selector: ['a[href*="download.php?id="][href*="&passkey="]'], attr: "href" },
      },
    },
    userInfo: {
      ...a.userInfo,
      selectors: {
        ...a.userInfo.selectors,
        hnrUnsatisfied: {
          text: 0,
          selector: ["td.rowfollow > a[href*='torrents.php?option-torrents=8']"],
          filters: [{ name: "parseNumber" }],
        },
      },
    },
    levelRequirements: [
      { id: 1, name: "User", nameAka: ["採女-正八品"], privilege: "新用户的默认级别；可以查看NFO/LOG文档。" },
      {
        id: 2,
        name: "Power User",
        nameAka: ["常在-正七品"],
        interval: "P5W",
        ratio: 1.5,
        alternative: [{ downloaded: "20GB" }, { uploads: 5 }],
        privilege:
          '得到一个邀请名额；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
      },
      {
        id: 3,
        name: "Elite User",
        nameAka: ["贵人-正六品"],
        interval: "P10W",
        ratio: 2,
        alternative: [{ downloaded: "60GB" }, { uploads: 20 }],
        privilege:
          "得到两个邀请名额；贵人-正六品(Elite User)及以上用户封存账号后规定时间内不会被删除；发布三个种子后无需经过候选 可直接发布种子。",
      },
      {
        id: 4,
        name: "Crazy User",
        nameAka: ["良媛-正五品"],
        interval: "P15W",
        ratio: 2.5,
        alternative: [{ downloaded: "200GB" }, { uploads: 50 }],
        privilege: "得到三个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
      },
      {
        id: 5,
        name: "Insane User",
        nameAka: ["容华-正四品"],
        interval: "P20W",
        ratio: 3,
        alternative: [{ downloaded: "400GB" }, { uploads: 100 }],
        privilege: "得到四个邀请名额；可以查看普通日志。",
      },
      {
        id: 6,
        name: "Veteran User",
        nameAka: ["贵嫔-正三品"],
        interval: "P25W",
        ratio: 3.5,
        alternative: [{ downloaded: "600GB" }, { uploads: 200 }],
        isKept: !0,
        privilege:
          "得到五个邀请名额；可以查看用户列表，可以查看其它用户的评论、帖子历史。贵嫔-正三品(Veteran User)及以上用户会永远保留账号。",
      },
      {
        id: 7,
        name: "Extreme User",
        nameAka: ["淑仪-正二品"],
        interval: "P25W",
        ratio: 4,
        alternative: [{ downloaded: "1TB" }, { uploads: 300 }],
        isKept: !0,
        privilege: "得到六个邀请名额；可以更新过期的外部信息。",
      },
      {
        id: 8,
        name: "Ultimate User",
        nameAka: ["贵妃-正一品"],
        interval: "P30W",
        ratio: 4.5,
        alternative: [{ downloaded: "2TB" }, { uploads: 450 }],
        isKept: !0,
        privilege: "得到七个邀请名额；查看种子文件的结构。",
      },
      {
        id: 9,
        name: "Nexus Master",
        nameAka: ["皇后"],
        interval: "P30W",
        ratio: 5,
        alternative: [{ downloaded: "3TB" }, { uploads: 600 }],
        isKept: !0,
        privilege: "得到十个邀请名额。",
      },
      { id: 100, name: "貴賓(VIP)", groupType: "vip" },
      { id: 101, name: "養老族", nameAka: ["养老族"], groupType: "vip" },
      { id: 201, name: "保種員", nameAka: ["保种员"], groupType: "manager" },
      { id: 202, name: "發布員", nameAka: ["发布员"], groupType: "manager" },
      { id: 203, name: "工作人員", groupType: "manager" },
      { id: 204, name: "管理员", groupType: "manager" },
      { id: 205, name: "論壇版主", nameAka: ["论坛版主"], groupType: "manager" },
      { id: 206, name: "總版主", nameAka: ["总版主"], groupType: "manager" },
      { id: 207, name: "維護開发員", groupType: "manager" },
    ],
  };
class L extends o {
  async getTorrentDownloadLink(e) {
    return e.link && e.link.includes("/plugin_details.php")
      ? e.link.replace(/plugin_details\.php\?id=(\d+)/, "download.php?id=$1").replace(/&hit=1/, "")
      : super.getTorrentDownloadLink(e);
  }
}
export { L as default, s as selectorSearchProgress, u as selectorSearchStatus, x as siteMetadata };
