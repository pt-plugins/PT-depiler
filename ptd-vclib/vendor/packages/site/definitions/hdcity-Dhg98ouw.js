import v, {
  SchemaMetadata as n,
  CategoryIncldead as g,
  CategorySpstate as f,
  CategoryInclbookmarked as h,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import "../index-COeZNva1.js";
import { f as s } from "../utils/datetime-DQxMK7bP.js";
import { p as u } from "../utils/filesize-D_1hx4u8.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const d = (e) => {
    const t = e.cloneNode(!0);
    t.querySelectorAll("i, span, div").forEach((r) => {
      r.textContent?.toLowerCase().includes("star") && r.remove();
    });
    let a = t.textContent?.replace(/\b(starbig|star)\b/gi, "") || "";
    return ((a = a.replace(/\s+/g, " ").replace(/^[\s\-_\.=]+|[\s\-_\.=]+$/g, "")), a || e.textContent?.trim() || "");
  },
  c = [
    { id: 0, name: "天使", privilege: "新手上路；可以直接发布种子；可以使用 RSS" },
    {
      id: 1,
      name: "大天使",
      interval: "P4W",
      uploaded: "50GB",
      ratio: 1,
      privilege: '可以请求续种； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")。',
    },
    {
      id: 2,
      name: "权天使",
      interval: "P8W",
      uploaded: "150GB",
      ratio: 1.1,
      privilege: "权天使及以上等级封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "能天使",
      interval: "P12W",
      uploaded: "500GB",
      ratio: 1.5,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    { id: 4, name: "力天使", interval: "P16W", uploaded: "1TB", ratio: 2, privilege: "可以查看普通日志。" },
    {
      id: 5,
      name: "主天使",
      interval: "P24W",
      uploaded: "5TB",
      ratio: 2.5,
      isKept: !0,
      privilege: "主天使及以上市民会永远保留账号。",
    },
    { id: 6, name: "座天使", interval: "P36W", uploaded: "10TB", ratio: 2.6, isKept: !0, privilege: "" },
    {
      id: 7,
      name: "智天使",
      interval: "P72W",
      uploaded: "20TB",
      ratio: 2.8,
      isKept: !0,
      privilege: "比较牛逼的等级。",
    },
    {
      id: 8,
      name: "炽天使",
      interval: "P100W",
      uploaded: "40TB",
      ratio: 4,
      isKept: !0,
      privilege: "最牛逼的市民，或特殊任务分配。",
    },
    {
      id: 9,
      name: "壕(VIP)",
      groupType: "vip",
      privilege: "管理员分配，捐助的市民，或自行以魅力值兑换获得。免除自动降级无视分享率。",
    },
    { id: 10, name: "隐天使(Retiree)", groupType: "manager", privilege: "退休后的管理组成员。" },
    { id: 11, name: "射种天使(Uploader)", groupType: "manager", privilege: "专注的发布者。工作组。可以查看匿名。" },
    {
      id: 12,
      name: "论坛版主(Forum Moderator)",
      groupType: "manager",
      privilege: "论坛管理者。可以制定在任版块的版规、管理主题和帖子。",
    },
    {
      id: 13,
      name: "总版主(Moderator)",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子及字幕；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息；可以将种子设为置顶或促销；可以查看用户IP或Email等机密信息。不能管理友情链接、最近消息；不能删除账号。",
    },
    { id: 14, name: "管理员(Administrator)", groupType: "manager", privilege: "各种日常管理，可以做任何修改。" },
    { id: 15, name: "守护天使(Sysop)", groupType: "manager", privilege: "网站开发/维护人员，可以做任何修改。" },
    { id: 16, name: "市长(Mayor)", groupType: "manager", privilege: "灵魂。" },
  ],
  i = { selector: ['a[href*="download?id="]'], attr: "href" },
  G = {
    ...n,
    version: 1,
    id: "hdcity",
    name: "HDCity",
    aka: ["城市"],
    tags: ["综合", "影视"],
    timezoneOffset: "+0800",
    collaborator: ["zhuweitung"],
    type: "private",
    schema: "NexusPHP",
    urls: ["uggcf://uqpvgl.pvgl/", "uggcf://uqpvgl.yravgre.bet/", "uggcf://uqpvgl.jbex/"],
    legacyUrls: ["https://hdcity.top/"],
    category: [
      {
        name: "类型",
        key: "cat",
        options: [
          { name: "Movies/电影", value: 401 },
          { name: "Series/剧集", value: 402 },
          { name: "Doc/档案记录", value: 404 },
          { name: "Anim/动漫", value: 405 },
          { name: "Shows/节目", value: 403 },
          { name: "MV/音乐视频", value: 406 },
          { name: "Sports/体育", value: 407 },
          { name: "Audio/音频", value: 408 },
          { name: "XXX/家长指引", value: 727 },
          { name: "Edu/文档/教材", value: 728 },
          { name: "Soft/软件", value: 729 },
          { name: "Other/其他", value: 409 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "媒介",
        key: "medium",
        options: [
          { name: "BD/蓝光原盘", value: 1 },
          { name: "HDDVD原盘", value: 2 },
          { name: "Remux/重混流", value: 3 },
          { name: "Encode/重编码", value: 7 },
          { name: "MiniBD/微蓝光", value: 4 },
          { name: "HDTV/SNG/原始录制", value: 5 },
          { name: "DVD原盘", value: 6 },
          { name: "CD/音乐/有声读物", value: 8 },
          { name: "Track/外挂音轨", value: 9 },
          { name: "Ebook/文档/图库", value: 10 },
          { name: "Rec/视频教材", value: 11 },
          { name: "Joy/游戏", value: 12 },
          { name: "Prog/程序", value: 13 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "编码",
        key: "codec",
        options: [
          { name: "H.264/AVC", value: 1 },
          { name: "H.265/HEVC", value: 13 },
          { name: "MPEG-2", value: 4 },
          { name: "DivX/XviD", value: 3 },
          { name: "WMV/VC-1", value: 2 },
          { name: "AV1", value: 16 },
          { name: "WebM/VP", value: 17 },
          { name: "WMA/WMA-LL", value: 14 },
          { name: "FLAC", value: 5 },
          { name: "APE", value: 6 },
          { name: "DTS/DTS-ES", value: 7 },
          { name: "Dolby AC3", value: 8 },
          { name: "TrueHD/Atmos", value: 15 },
          { name: "WAV/Raw", value: 10 },
          { name: "MP3/MP2", value: 11 },
          { name: "AAC/M4A", value: 12 },
          { name: "Other", value: 9 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "分辨率",
        key: "standard",
        options: [
          { name: "8K-4320p", value: 11 },
          { name: "8K-4320i", value: 10 },
          { name: "4K-2160p", value: 9 },
          { name: "4K-2160i", value: 8 },
          { name: "1080p", value: 1 },
          { name: "1080i", value: 2 },
          { name: "720p", value: 3 },
          { name: "720i", value: 7 },
          { name: "540p", value: 6 },
          { name: "480p", value: 5 },
          { name: "SD", value: 4 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "3D",
        key: "processing",
        options: [
          { name: "3D H-OU/上下半宽", value: 1 },
          { name: "3D H-SBS/左右半宽", value: 2 },
          { name: "3D Interleaved/交织", value: 3 },
          { name: "3D Red-blue/红蓝", value: 4 },
          { name: "3D Alt/其他3D", value: 5 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "制作组",
        key: "team",
        options: [
          { name: "HDCITY-NoVA", value: 1 },
          { name: "HDCITY-NoPA", value: 14 },
          { name: "HDCITY-NoTA", value: 15 },
          { name: "HDCITY-NoXA", value: 17 },
          { name: "0DAY", value: 9 },
        ],
        cross: { mode: "append" },
      },
      g,
      f,
      h,
    ],
    search: {
      ...n.search,
      keywordPath: "params.iwannaseethis",
      requestConfig: { url: "/pt", params: { notnewword: 1 } },
      selectors: {
        rows: { selector: ".mitem" },
        link: i,
        url: {
          ...i,
          filters: [
            { name: "querystring", args: ["id"] },
            { name: "prepend", args: ["/t-"] },
          ],
        },
        id: { ...i, filters: [{ name: "querystring", args: ["id"] }] },
        title: { selector: [".mtop a[href^='t-']"] },
        subTitle: { selector: [".mtitle a[href^='t-']"] },
        time: {
          selector: "div[style='minfo']",
          filters: [(e) => (e ? s(e.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[1]) : "")],
        },
        size: { selector: ".mbottom .mbelement:nth-child(3)", filters: [{ name: "parseSize" }] },
        author: { selector: ["div[style='minfo'] > span"], elementProcess: d },
        seeders: { selector: ".mbottom a[href*='seeders']", filters: [(e) => (e ? e.match(/(\d+)/)[1] : "0")] },
        leechers: { selector: ".mbottom a[href*='leechers']", filters: [(e) => (e ? e.match(/(\d+)/)[1] : "0")] },
        completed: { selector: ".mbottom a[href*='viewsnatches']", filters: [(e) => (e ? e.match(/(\d+)/)[1] : "0")] },
        tags: [...n.search.selectors.tags],
      },
    },
    userInfo: {
      ...n.userInfo,
      pickLast: ["id", "joinTime"],
      process: [
        {
          requestConfig: { url: "/userdetails", responseType: "document" },
          fields: [...(n.userInfo.process?.[0]?.fields || []), "id", "joinTime", "invites"],
          selectors: {
            ...n.userInfo.process?.[0]?.selectors,
            id: { selector: ["center .text_alt .text:contains('ID')"], filters: [(e) => e.match(/(\d+)/)[1]] },
            name: { selector: [".text_alt span[style]"], elementProcess: d },
            messageCount: { text: 0, selector: "a[href*='messages']", filters: [(e) => parseInt(e.match(/(\d+)/)[1])] },
            uploaded: {
              selector: [".text_alt + br + div .text:nth-child(1)"],
              filters: [(e) => u(e.match(/(上传量|上傳量|Uploaded):\s+([\d.]+ [ZEPTGMK]i?B)/)?.[2]?.trim() ?? "0")],
            },
            downloaded: {
              selector: [".text_alt + br + div .text:nth-child(1)"],
              filters: [(e) => u(e.match(/(下载量|下載量|Downloaded):\s+([\d.\s,ZEPTGMKiB]+)/)?.[2]?.trim() ?? "0")],
            },
            levelId: {
              selector: [".text_alt img[src*='class']:first"],
              attr: "src",
              filters: [
                (e) => {
                  const t = e.match(/\/class\/(\d+)\.gif/);
                  return t ? parseInt(t[1]) - 1 : 0;
                },
              ],
            },
            levelName: {
              selector: [".text_alt img[src*='class']:first"],
              attr: "src",
              filters: [
                (e) => {
                  const t = parseInt(e.match(/\/class\/(\d+)\.gif/)[1]) - 1;
                  return c.find((a) => a.id === t)?.name ?? t;
                },
              ],
            },
            bonus: {
              selector: [".text_alt + br + div .text:nth-child(4)"],
              filters: [(e) => parseFloat(e.match(/(魅力值|Karma Points)\s+([\d.]+)/)?.[2]?.trim() ?? "0")],
            },
            joinTime: {
              selector: [".text:contains('加入日期')", ".text:contains('Join date')"],
              filters: [(e) => s(e.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[1])],
            },
            lastAccessAt: {
              selector: [".text:contains('最近动向')", ".text:contains('Last Action')"],
              filters: [(e) => s(e.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[1])],
            },
            invites: {
              selector: [
                ".text:contains('邀请')",
                ".text:contains('Invites')",
                ".text:contains('Available')",
                "td:contains('邀请')",
                "td:contains('Invites')",
                "td:contains('Available')",
                "center .text_alt .text:contains('邀请')",
                "center .text_alt .text:contains('Invites')",
              ],
              filters: [
                (e) => {
                  if (!e?.trim()) return 0;
                  try {
                    const t = e.match(/Available:\s*(\d+)/i);
                    if (t) return parseInt(t[1], 10) || 0;
                    const a = parseInt(e.match(/\d+/)?.[0] || "0", 10);
                    return isNaN(a) ? 0 : a;
                  } catch {
                    return 0;
                  }
                },
              ],
            },
          },
        },
        {
          requestConfig: { url: "/mybonus", responseType: "document" },
          selectors: {
            bonusPerHour: {
              selector: [
                "div:contains('你当前每小时能获取'):last",
                "div:contains('You are currently getting'):last",
                "div:contains('你當前每小時能獲取'):last",
              ],
              filters: [{ name: "parseNumber" }],
            },
          },
        },
      ],
    },
    levelRequirements: c,
  };
class F extends v {
  async requestUserSeedingPage(t, a = "seeding") {
    const { data: r } = await this.request({ url: "/getusertorrentlistajax", params: { userid: t, type: a } });
    return r || null;
  }
  parseTorrentRowForTags(t, a, r) {
    super.parseTorrentRowForTags(t, a, r);
    const l = a.querySelectorAll(".mbottom .mpromo");
    if (l.length > 0) {
      const o = t.tags || [];
      (l.forEach((p) => {
        const m = p.textContent?.replace(/\s/g, "").replace("免费", "Free");
        m && o.push({ name: m });
      }),
        (t.tags = o));
    }
    return t;
  }
}
export { F as default, G as siteMetadata };
