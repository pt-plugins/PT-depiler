import { u as p } from "../../../url-join/url-join-Cu798wIg.js";
import { o as c } from "../../../es-toolkit/omit-BqXgNNTz.js";
import { E as s } from "../types/torrent-BvvY2NbA.js";
import { bO as g } from "../index-COeZNva1.js";
import { b as D } from "../utils/level-ChrMpKO_.js";
import h, {
  SchemaMetadata as r,
  CategoryIncldead as T,
  CategorySpstate as S,
  CategoryInclbookmarked as y,
  subTitleRemoveExtraElement as k,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
const m = [
    { id: 1, name: "User", privilege: "新用户的默认级别。" },
    {
      id: 2,
      name: "Power User",
      interval: "P5W",
      downloaded: "200GB",
      ratio: 2,
      bonus: 6e5,
      privilege: "NFO文档；请求续种；查看其它用户的种子历史；删除自己上传的字幕",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P10W",
      downloaded: "500GB",
      ratio: 2.5,
      bonus: 8e5,
      privilege: "查看邀请区",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "1TB",
      ratio: 3,
      bonus: 1e6,
      privilege: "在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P20W",
      downloaded: "2TB",
      ratio: 3.5,
      bonus: 15e5,
      privilege: "查看普通日志",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "4TB",
      ratio: 4,
      bonus: 2e6,
      privilege: "封存账号后不会被删除；查看其它用户的评论、帖子历史",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P30W",
      downloaded: "6TB",
      ratio: 4.5,
      bonus: 25e5,
      privilege: "更新过期的外部信息；查看Extreme User论坛",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P45W",
      downloaded: "8TB",
      ratio: 5,
      bonus: 35e5,
      isKept: !0,
      privilege: "永远保留账号",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P65W",
      downloaded: "10TB",
      ratio: 5.5,
      bonus: 5e6,
      isKept: !0,
      privilege: "直接发布种子；可以查看排行榜；在网站开放邀请期间发送邀请",
    },
  ],
  H = m.map((a) => c(a, ["bonus"])),
  o = { selector: 'form[action*="download.php"]:first', attr: "action" },
  Q = {
    ...r,
    version: 1,
    id: "hdsky",
    name: "HDSky",
    aka: ["HDS", "天空"],
    description: "高清发烧友后花园PT",
    tags: ["影视", "纪录片", "综合"],
    type: "private",
    schema: "NexusPHP",
    urls: ["https://hdsky.me/"],
    category: [
      {
        name: "类别",
        key: "cat",
        options: [
          { value: 401, name: "Movies/电影" },
          { value: 404, name: "Documentaries/纪录片" },
          { value: 410, name: "iPad/iPad影视" },
          { value: 405, name: "Animations/动漫" },
          { value: 402, name: "TV Series/剧集(分集）" },
          { value: 411, name: "TV Series/剧集(合集）" },
          { value: 403, name: "TV Shows/综艺" },
          { value: 406, name: "Music Videos/音乐MV" },
          { value: 407, name: "Sports/体育" },
          { value: 408, name: "HQ Audio/无损音乐" },
          { value: 409, name: "Misc/其他" },
          { value: 412, name: "TV Series/海外剧集(分集）" },
          { value: 413, name: "TV Series/海外剧集(合集）" },
          { value: 414, name: "TV Shows/海外综艺(分集）" },
          { value: 415, name: "TV Shows/海外综艺(合集）" },
          { value: 416, name: "Shortplay/短剧" },
        ],
        cross: { mode: "append" },
      },
      {
        name: "媒介",
        key: "medium",
        options: [
          { value: 1, name: "UHD Blu-ray" },
          { value: 14, name: "UHD Blu-ray/DIY" },
          { value: 12, name: "Blu-ray/DIY" },
          { value: 3, name: "Remux" },
          { value: 7, name: "Encode" },
          { value: 5, name: "HDTV" },
          { value: 6, name: "DVDR" },
          { value: 8, name: "CD" },
          { value: 4, name: "MiniBD" },
          { value: 9, name: "Track" },
          { value: 11, name: "WEB-DL" },
          { value: 15, name: "SACD" },
          { value: 2, name: "HD DVD" },
          { value: 16, name: "3D Blu-ray" },
        ],
        cross: { mode: "append" },
      },
      {
        name: "编码",
        key: "codec",
        options: [
          { value: 1, name: "H.264/AVC" },
          { value: 13, name: "x265" },
          { value: 10, name: "x264" },
          { value: 12, name: "HEVC" },
          { value: 2, name: "VC-1" },
          { value: 4, name: "MPEG-2" },
          { value: 3, name: "Xvid" },
          { value: 11, name: "Other" },
          { value: 14, name: "MVC" },
          { value: 15, name: "ProRes" },
          { value: 17, name: "VP9" },
          { value: 16, name: "AV1" },
        ],
        cross: { mode: "append" },
      },
      {
        name: "音频编码",
        key: "audiocodec",
        options: [
          { value: 10, name: "DTS-HDMA" },
          { value: 16, name: "DTS-HDMA:X 7.1" },
          { value: 17, name: "TrueHD Atmos" },
          { value: 19, name: "PCM" },
          { value: 11, name: "TrueHD" },
          { value: 3, name: "DTS" },
          { value: 13, name: "LPCM" },
          { value: 1, name: "FLAC" },
          { value: 2, name: "APE" },
          { value: 4, name: "MP3" },
          { value: 5, name: "OGG" },
          { value: 6, name: "AAC" },
          { value: 12, name: "AC3/DD" },
          { value: 7, name: "Other" },
          { value: 14, name: "DTS-HD HR" },
          { value: 15, name: "WAV" },
          { value: 18, name: "DSD" },
          { value: 22, name: "Opus" },
          { value: 20, name: "E-AC3" },
          { value: 21, name: "DDP with Dolby Atmos" },
          { value: 23, name: "ALAC" },
        ],
        cross: { mode: "append" },
      },
      {
        name: "分辨率",
        key: "standard",
        options: [
          { value: 5, name: "4K/2160p" },
          { value: 1, name: "2K/1080p" },
          { value: 2, name: "1080i" },
          { value: 3, name: "720p" },
          { value: 4, name: "SD" },
          { value: 6, name: "8K/4320P" },
        ],
        cross: { mode: "append" },
      },
      {
        name: "制作组",
        key: "team",
        options: [
          { value: 6, name: "HDSky/原盘DIY小组" },
          { value: 1, name: "HDS/重编码及remux小组" },
          { value: 28, name: "HDS3D/3D重编码小组" },
          { value: 9, name: "HDSTV/电视录制小组" },
          { value: 31, name: "HDSWEB/网络视频小组" },
          { value: 18, name: "HDSPad/移动视频小组" },
          { value: 22, name: "HDSCD/无损音乐小组" },
          { value: 34, name: "HDSpecial|稀缺资源" },
          { value: 24, name: "Original/自制原创资源" },
          { value: 27, name: "Other/其他制作组或转发资源" },
          { value: 26, name: "Autoseed/自动发布机器人" },
          { value: 30, name: "BMDru小组" },
          { value: 25, name: "AREA11/韩剧合作小组" },
          { value: 33, name: "Request/应求发布资源" },
          { value: 35, name: "HDSWEB/(网络视频小组合集专用)" },
          { value: 36, name: "HDSAB/有声书小组" },
          { value: 37, name: "HDSWEB/(补档专用)" },
        ],
        cross: { mode: "append" },
      },
      T,
      S,
      y,
    ],
    officialGroupPattern: [/-(hds|.*@HDSky)/i],
    search: {
      ...r.search,
      selectors: {
        ...r.search.selectors,
        id: { ...o, filters: [{ name: "querystring", args: ["id"] }] },
        url: {
          ...o,
          filters: [
            { name: "querystring", args: ["id"] },
            { name: "prepend", args: ["/details.php?id="] },
          ],
        },
        subTitle: {
          text: "",
          selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
          elementProcess: (a) =>
            k(
              ["span.optiontag"],
              !0,
            )(a)
              .replace(/\[(优惠剩余时间| ?promotion will end in |優惠剩餘時間).*\]/g, "")
              .trim(),
        },
        link: { ...o },
        progress: {
          selector: ["div.progressseeding, div.progressfinished, div.progressdownloading, div.progressdownloaded"],
          attr: "style",
          filters: [
            (a) => {
              a = a || "";
              const e = a.match(/width:([ \d.]+)%/);
              return e && e.length >= 2 ? parseFloat(e[1]) : 0;
            },
          ],
        },
        status: {
          text: s.unknown,
          selector: ['div[class^="progress"]'],
          case: {
            ".progressseeding": s.seeding,
            ".progressdownloading": s.downloading,
            ".progressfinished": s.completed,
            ".progressdownloaded": s.inactive,
          },
        },
      },
    },
    detail: { ...(r.detail ?? {}), selectors: { ...(r.detail?.selectors ?? {}), link: { ...o } } },
    levelRequirements: m,
  };
class X extends h {
  async getTorrentDownloadLink(e) {
    if (e.link) {
      if (/&passkey=/.test(e.link)) return e.link;
      const t = this.runQueryFilters(e.link, [{ name: "querystring", args: ["t"] }]),
        l = Date.now() / 1e3,
        i = parseInt(t || "0") + 600;
      if (l < i) return e.link;
      delete e.link;
    }
    return (e.id && !e.url && (e.url = p(this.url, `/details.php?id=${e.id}`)), super.getTorrentDownloadLink(e));
  }
  parseTorrentRowForTags(e, n, t) {
    super.parseTorrentRowForTags(e, n, t);
    const l = n.querySelectorAll("span.optiontag[style*='background-color'][style*='color']");
    if (l.length > 0) {
      const i = e.tags || [];
      (l.forEach((u) => {
        const d = u.textContent,
          v = u.style.backgroundColor;
        d && v && i.push({ name: d, color: v });
      }),
        (e.tags = i));
    }
    return e;
  }
  guessUserLevelId(e) {
    let n = m;
    return (
      this.userConfig.merge?.levelRequirements
        ? (n = this.userConfig.merge.levelRequirements)
        : e.joinTime &&
          e.joinTime < 17407872e5 &&
          ((n = H), g(this.metadata.id, "levelRequirements", n, "merge").catch()),
      D(e, n)
    );
  }
}
export { X as default, Q as siteMetadata };
