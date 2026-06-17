import { E as r } from "../types/torrent-BvvY2NbA.js";
import u, {
  SchemaMetadata as a,
  CategoryIncldead as d,
  CategorySpstate as p,
  CategoryInclbookmarked as g,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import { S as v } from "../index-COeZNva1.js";
import { f as m } from "../utils/datetime-DQxMK7bP.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const l = { selector: ['a[href*="download.php?id="]'], attr: "href" },
  I = {
    ...a,
    version: 1,
    id: "hhanclub",
    name: "憨憨",
    aka: ["HHanClub"],
    tags: ["电影", "电视剧"],
    timezoneOffset: "+0800",
    collaborator: ["zhuweitung"],
    type: "private",
    schema: "NexusPHP",
    urls: ["uggcf://uunapyho.arg/"],
    legacyUrls: ["uggcf://uunapyho.gbc/"],
    officialGroupPattern: [/HHWEB/i],
    category: [
      {
        name: "类型",
        key: "cat",
        options: [
          { name: "其他", value: 409 },
          { name: "体育", value: 407 },
          { name: "综艺", value: 403 },
          { name: "电视剧", value: 402 },
          { name: "动漫", value: 405 },
          { name: "纪录片", value: 404 },
          { name: "电影", value: 401 },
          { name: "短剧", value: 412 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "来源",
        key: "source",
        options: [
          { name: "UHD Blu-ray", value: 7 },
          { name: "Blu-ray", value: 1 },
          { name: "WEB-DL", value: 2 },
          { name: "DVD", value: 3 },
          { name: "HDTV", value: 4 },
          { name: "TV", value: 5 },
          { name: "Other", value: 6 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "媒介",
        key: "medium",
        options: [
          { name: "UHD Blu-ray", value: 11 },
          { name: "FHD Blu-ray", value: 1 },
          { name: "UHD REMUX", value: 2 },
          { name: "Remux", value: 3 },
          { name: "Encode", value: 7 },
          { name: "WEB-DL", value: 10 },
          { name: "HDTV", value: 5 },
          { name: "DVDR", value: 6 },
          { name: "CD", value: 8 },
          { name: "Track", value: 9 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "编码",
        key: "codec",
        options: [
          { name: "HEVC/H265/x265", value: 6 },
          { name: "AVC/H264/x264", value: 1 },
          { name: "VC-1", value: 2 },
          { name: "MPEG-2", value: 4 },
          { name: "VP8/9", value: 7 },
          { name: "Other", value: 5 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "分辨率",
        key: "standard",
        options: [
          { name: "4320p/8K", value: 6 },
          { name: "2160p/4K", value: 1 },
          { name: "1080p", value: 2 },
          { name: "1080i", value: 4 },
          { name: "720p", value: 3 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "处理",
        key: "processing",
        options: [
          { name: "美剧", value: 3 },
          { name: "日剧", value: 4 },
          { name: "韩剧", value: 5 },
          { name: "港剧", value: 6 },
          { name: "台剧", value: 7 },
          { name: "大陆剧", value: 8 },
          { name: "英剧", value: 9 },
          { name: "其他", value: 10 },
        ],
        cross: { mode: "brackets" },
      },
      d,
      p,
      g,
    ],
    search: {
      ...a.search,
      selectors: {
        ...a.search.selectors,
        rows: { selector: ".torrent-table-sub-info" },
        link: l,
        url: {
          ...l,
          filters: [
            { name: "querystring", args: ["id"] },
            { name: "prepend", args: ["/details.php?id="] },
          ],
        },
        id: { ...l, filters: [{ name: "querystring", args: ["id"] }] },
        title: { selector: [".torrent-title a[href^='details.php']"] },
        subTitle: { selector: [".torrent-title .torrent-info-text-small_name"] },
        time: { selector: ".torrent-info-text-added", ...a.search.selectors.time },
        size: { selector: ".torrent-info-text-size", filters: [{ name: "parseSize" }] },
        author: { selector: ".torrent-info-text-author" },
        seeders: { selector: ".torrent-info-text-seeders" },
        leechers: { selector: ".torrent-info-text-leechers" },
        completed: { selector: ".torrent-info-text-finished" },
        progress: {
          selector: [
            '.torrent-title div[title^="leeching"]',
            '.torrent-title [title^="seeding"]',
            '.torrent-title div[title^="inactivity"]',
          ],
          attr: "title",
          filters: [{ name: "parseNumber" }],
        },
        status: {
          text: r.unknown,
          selector: [
            '.torrent-title div[title^="leeching"]',
            '.torrent-title [title^="seeding"]',
            '.torrent-title div[title^="inactivity"]',
          ],
          attr: "title",
          filters: [
            (e) =>
              e.includes("leeching")
                ? r.downloading
                : e.includes("seeding")
                  ? r.seeding
                  : e.includes("inactivity")
                    ? e.includes("100%")
                      ? r.completed
                      : r.inactive
                    : r.unknown,
          ],
        },
        tags: [
          ...a.search.selectors.tags,
          { name: "Free", selector: "span.promotion-tag-free", color: "blue" },
          { name: "官方", selector: "a[href*='tag_id3=1']", color: "#0000ff" },
          { name: "完结", selector: "a[href*='tag_id17=1']", color: "#4682B4" },
          { name: "原创", selector: "a[href*='tag_id8=1']", color: "#ff3300" },
          { name: "禁转", selector: "a[href*='tag_id1=1']", color: "#990000" },
          { name: "首发", selector: "a[href*='tag_id2=1']", color: "#009900" },
          { name: "国语", selector: "a[href*='tag_id5=1']", color: "#FF6699" },
          { name: "粤语", selector: "a[href*='tag_id10=1']", color: "#FF9999" },
          { name: "中字", selector: "a[href*='tag_id6=1']", color: "#99CC00" },
          { name: "特效", selector: "a[href*='tag_id14=1']", color: "#FF0099" },
          { name: "DIY", selector: "a[href*='tag_id11=1']", color: "#6633CC" },
          { name: "杜比视界", selector: "a[href*='tag_id12=1']", color: "#0066FF" },
          { name: "应求", selector: "a[href*='tag_id15=1']", color: "#FF6633" },
          { name: "转载", selector: "a[href*='tag_id18=1']", color: "#FF6633" },
        ],
      },
    },
    userInfo: {
      ...a.userInfo,
      selectors: {
        ...a.userInfo.selectors,
        uploaded: { selector: ["span:contains('上传量') + span"], filters: [{ name: "parseSize" }] },
        trueUploaded: { selector: ["span:contains('实际上传量') + span"], filters: [{ name: "parseSize" }] },
        downloaded: { selector: ["span:contains('下载量') + span"], filters: [{ name: "parseSize" }] },
        trueDownloaded: { selector: ["span:contains('实际下载量') + span"], filters: [{ name: "parseSize" }] },
        levelName: {
          selector: "a[href*='userdetails.php'][class*='_Name']:first",
          attr: "class",
          filters: [(e) => e.match(/(.*)_Name/)[1]],
        },
        messageCount: {
          text: 0,
          selector: "div.relative:has(div#display-message-alert) a.flex[href*='messages.php']",
          filters: [
            (e) => {
              const t = String(e || "").match(/(\d+)/);
              return t && t.length >= 2 ? parseInt(t[1]) : 0;
            },
          ],
        },
        bonus: { selector: ["span:contains('憨豆') + div"], filters: [{ name: "parseNumber" }] },
        seedingBonus: { selector: ["span:contains('做种积分') + span"], filters: [{ name: "parseNumber" }] },
        joinTime: { selector: ["span:contains('加入日期') + span"], filters: [(e) => ((e = e.split(" (")[0]), m(e))] },
        bonusPerHour: { selector: [".grid .row-span-4"], filters: [{ name: "parseNumber" }] },
        seedingBonusPerHour: {
          selector: [
            "div:contains('你当前每小时能获取'):last",
            "div:contains('You are currently getting'):last",
            "div:contains('你當前每小時能獲取'):last",
          ],
          filters: [{ name: "parseNumber" }],
        },
        lastAccessAt: {
          selector: ["span:contains('最近动向') + span"],
          filters: [(e) => ((e = e.split(" (")[0]), m(e))],
        },
      },
    },
    levelRequirements: [
      { id: 0, name: "憨头憨脑 User", privilege: "新用户的默认级别" },
      {
        id: 1,
        name: "憨声憨气 Power User",
        seedingBonus: 8e4,
        downloaded: "50GB",
        ratio: 1.05,
        privilege: "访问音乐区、论坛邀请区",
      },
      {
        id: 2,
        name: "憨态可掬 Elite User",
        interval: "P8W",
        seedingBonus: 15e4,
        downloaded: "120GB",
        ratio: 1.55,
        privilege: "-",
      },
      {
        id: 3,
        name: "明姿憨憨 Crazy User",
        interval: "P15W",
        seedingBonus: 3e5,
        downloaded: "300GB",
        ratio: 2.05,
        privilege: "可以在做种/下载/发布的时候选择匿名模式。",
      },
      {
        id: 4,
        name: "裝憨打呆 Insane User",
        interval: "P25W",
        seedingBonus: 5e5,
        downloaded: "500GB",
        ratio: 2.55,
        privilege: "-",
      },
      {
        id: 5,
        name: "憨状可掬 Veteran User",
        interval: "P40W",
        seedingBonus: 9e5,
        downloaded: "750GB",
        ratio: 3.05,
        privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户封存账号后不会被删除。",
      },
      {
        id: 6,
        name: "憨痴可人 Extreme User",
        interval: "P60W",
        seedingBonus: 11e5,
        downloaded: "1TB",
        ratio: 3.55,
        privilege: "可以更新过期的外部信息。",
      },
      {
        id: 7,
        name: "憨笑如花 Ultimate User",
        interval: "P80W",
        seedingBonus: 13e5,
        downloaded: "1.5TB",
        ratio: 4.05,
        isKept: !0,
        privilege: "得到一个邀请名额。Ultimate User及以上用户会永远保留账号。",
      },
      {
        id: 8,
        name: "满面娇憨 Nexus Master",
        interval: "P100W",
        seedingBonus: 15e5,
        downloaded: "3TB",
        ratio: 4.55,
        isKept: !0,
        privilege: "得到两个邀请名额。",
      },
    ],
  };
class G extends u {
  async parseUserInfoForSeedingBonusPerHour(t, n) {
    const s = this.getFieldData(n, this.metadata.userInfo?.selectors?.seedingBonusPerHour);
    let o = await this.getRescueDocument(t.id);
    const i = v("table + div b", o);
    i.length > 0 && (o = await this.getRescueDocument(t.id, parseInt(i[i.length - 1].textContent || "1") - 1));
    const c = this.getFieldData(o, {
      selector: ["table tbody tr:last-child > td:nth-of-type(6)"],
      filters: [{ name: "parseNumber" }],
    });
    return ((t.seedingBonusPerHour = s + c / 24), t);
  }
  async getRescueDocument(t, n = 0) {
    const { data: s } = await this.request({
      url: "/rescuesettleinfo.php",
      params: { id: t, page: n },
      responseType: "document",
    });
    return s;
  }
}
export { G as default, I as siteMetadata };
