/**
 * YzYY 站点适配
 *
 * 架构说明：
 * - YzYY 基于 Discuz X3.5 论坛，种子聚合页为自定义 torrents.php（PHP 服务端渲染 + JS AJAX）
 * - 列表页：/torrents.php（?keyword= 搜索，?cat[]= 等高级筛选），默认返回完整 HTML（含服务端渲染的列表）
 * - 种子详情页：Discuz 帖子 forum.php?mod=viewthread&tid={tid}
 * - 下载链接：download.php?info_hash={info_hash}&passkey={pk}&confirm=1（帖子页）
 *             或 plugin.php?id=dz_seed:seed_detail&action=download&info_hash={hash}（列表页）
 * - 种子 ID 使用 info_hash（40 位 hex），不是 tid；tid 用于帖子 URL
 *
 * 版块 fid（publish.inc.php 权威）：
 *   8/9 电视剧（外语/华语）、10/11 音乐（华语/外语）、13/14 电影（华语/外语）、34 软件
 *   30 高清修复区-剧集、31 高清修复区-电影（会员个人 AI 修复影视；种子禁止转载，注意 no_repost 标记）
 *
 * 高级筛选参数（torrents.php 支持，但映射较复杂，此处未配置 category）：
 *   cat[]/medium[]/vcodec[]/acodec[]/res[]/tag[]/promo[]（PHP 端拼 SQL WHERE）
 *
 * 需要适配者注意：
 * - 本站列表页服务端渲染为 #listWrap table tbody tr（每行一个种子）
 * - 标题链接 title 属性为英文名，URL 指向 Discuz 帖子
 * - 下载链接基于 info_hash，需自定义 getTorrentDownloadLink
 */
import { type ISiteMetadata, type ITorrent } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

export const siteMetadata: ISiteMetadata = {
  version: 20260813,
  id: "yzyy",
  name: "YzYY",
  aka: [],
  description: "综合影视音乐资源站，基于 Discuz 论坛架构 + 自定义种子聚合模块",
  tags: ["综合", "影视", "音乐"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "AbstractPrivateSite",

  // ROT13 加密 https://www.yzyy.org/ 和 https://bbs.yzyy.asia/
  urls: ["uggcf://jjj.lmll.bet/", "uggcf://oof.lmll.nfvn/"],

  // 官方发布组（YzYY 官组）
  officialGroupPattern: [/YzYY/i],

  search: {
    keywordPath: "params.keyword",
    requestConfig: {
      url: "/torrents.php",
      params: { keyword: "" },
    },
    // IMDb/豆瓣高级搜索：ID 走 torrents.php 的 keyword 参数（服务端已支持按 imdb_id/douban_id 匹配）
    advanceKeywordParams: {
      imdb: { enabled: true },
      douban: { enabled: true },
    },
    selectors: {
      rows: {
        selector: "#listWrap table tbody tr",
      },
      // 下载链接（列表页第9列）→ 提取 info_hash 作为种子 ID
      id: {
        selector: 'td:last-child a[href*="info_hash="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["info_hash"] }],
      },
      url: {
        selector: 'td.nfo .tt a[href*="viewthread"]',
        attr: "href",
      },
      // 下载链接：列表页的 download 链接
      link: {
        selector: 'td:last-child a[href*="info_hash="]',
        attr: "href",
      },
      title: {
        selector: 'td.nfo .tt a[href*="viewthread"]',
        text: "",
      },
      subTitle: {
        selector: "td.nfo .sb",
        text: "",
      },
      time: {
        selector: ":self",
        data: "time",
        text: 0,
      },
      size: {
        selector: ":self",
        data: "size",
        text: 0,
        filters: [{ name: "parseSize" }],
      },
      seeders: {
        selector: ":self",
        data: "seeders",
        text: 0,
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: ":self",
        data: "leechers",
        text: 0,
        filters: [{ name: "parseNumber" }],
      },
      completed: {
        text: "-",
      },
      // 评论数（列表第4列：💬 0）
      comments: {
        selector: ":self",
        data: "replies",
        text: 0,
        filters: [{ name: "parseNumber" }],
      },
      // 分类：从 .ic 图标区取类型图标（ig-movie/ig-tv/ig-music/ig-soft 等）的 title 属性
      category: {
        selector: ".ic",
        elementProcess: (el: HTMLElement) => {
          const typeClass = [
            "ig-movie",
            "ig-tv",
            "ig-music",
            "ig-soft",
            "ig-movie-anime",
            "ig-movie-doc",
            "ig-movie-live",
            "ig-movie-variety",
            "ig-tv-anime",
            "ig-tv-doc",
            "ig-tv-live",
            "ig-tv-variety",
          ];
          const ics = el.querySelectorAll(".ic span.ig");
          for (const ic of Array.from(ics)) {
            const cls = (ic as HTMLElement).className || "";
            if (typeClass.some((t) => cls.split(/\s+/).includes(t))) {
              const title = (ic as HTMLElement).getAttribute("title");
              if (title) return title;
            }
          }
          return "";
        },
        text: "",
      },
      // 外站评分 ID（torrents.php 服务端从评分表/帖子正文提取，输出到行 data-douban/data-imdb）
      ext_douban: {
        selector: ":self",
        data: "douban",
        text: "",
      },
      ext_imdb: {
        selector: ":self",
        data: "imdb",
        text: "",
      },
      tags: [
        { name: "Free", selector: "td.nfo .tt .pp.fr", color: "blue" },
        { name: "2xFree", selector: "td.nfo .tt .pp.x2", color: "green" },
        { name: "50%", selector: "td.nfo .tt .pp.p5", color: "orange" },
        { name: "New", selector: "td.nfo .tt .nt", color: "red" },
      ],
    },
  },

  // 种子列表页（插件在网页上识别并注入批量下载等功能的页面）
  list: [
    {
      urlPattern: ["/torrents.php"],
      selectors: {
        // YzYY 搜索框只有 id="keyword"，没有 name 属性，必须显式用 #keyword
        keywords: {
          selector: "input#keyword",
          elementProcess: (el: HTMLInputElement) => el.value,
        },
      },
    },
  ],

  // 种子详情页（Discuz 帖子）
  detail: {
    urlPattern: ["/forum\\.php\\?mod=viewthread", "/thread-\\d+-\\d+-\\d+\\.html"],
    selectors: {
      title: {
        selector: ["#thread_subject", "h1#thread_subject", "html > body > title"],
      },
      // 帖子页下载种子按钮
      link: {
        selector: 'a#dz_seed_dl_btn[href*="download.php?info_hash="]',
        attr: "href",
      },
      // 种子 ID = info_hash（从下载按钮 URL 提取）
      id: {
        selector: 'a#dz_seed_dl_btn[href*="download.php?info_hash="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["info_hash"] }],
      },
    },
  },

  // 下载配置：批量下载时，每个种子间隔 3 秒
  download: {
    interval: 3,
  },

  userInfo: {
    // 用户数据从 plugin.php?id=dz_seed:user_panel 页面获取（当前登录用户完整 PT 数据）
    // 页面结构：.upanel-row > (.upanel-label + .upanel-value)，label 和 value 是相邻兄弟
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/plugin.php", params: { id: "dz_seed:user_panel" }, responseType: "document" },
        fields: [
          "name",
          "joinTime",
          "levelName",
          "uploaded",
          "downloaded",
          "ratio",
          "bonus",
          "totalTraffic",
          "invites",
          "uploads",
          "seeding",
          "seedingSize",
          "leeching",
          "snatches",
          "messageCount",
          "avatar",
        ],
      },
      {
        // 时魔/做种时魔从 mybonus 页获取（user_panel 页不展示）
        requestConfig: { url: "/plugin.php", params: { id: "dz_seed:mybonus" }, responseType: "document" },
        fields: ["bonusPerHour", "seedingBonusPerHour"],
        selectors: {
          // mybonus 表 tr.my 行：第9列 td.hl = 每小时积分（基础积分+B），第11列 td.hl = 每小时魔力
          bonusPerHour: {
            selector: ["table.dz-mb-table tbody tr.my td.hl:last-of-type"],
            filters: [{ name: "parseNumber" }],
            text: 0,
          },
          seedingBonusPerHour: {
            selector: ["table.dz-mb-table tbody tr.my td.hl:first-of-type"],
            filters: [{ name: "parseNumber" }],
            text: 0,
          },
        },
      },
    ],
    selectors: {
      id: {
        // 用户面板页无 uid 链接，用当前会话；从页面 URL 或 mybonus 推断
        selector: "html > body > title",
        elementProcess: () => "",
        text: "",
      },
      name: {
        selector: [".upanel-header h2"],
        elementProcess: (el: HTMLElement) => (el.textContent || "").trim().split("★")[0].trim(),
      },
      joinTime: {
        selector: [".upanel-label:contains('注册日期') + .upanel-value"],
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd HH:mm"] }],
      },
      levelName: {
        selector: [".upanel-label:contains('等级') + .upanel-value"],
        elementProcess: (el: HTMLElement) => (el.textContent || "").trim(),
      },
      uploaded: {
        selector: [".upanel-label:contains('上传量') + .upanel-value"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: [".upanel-label:contains('下载量') + .upanel-value"],
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: [".upanel-label:contains('分享率') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: [".upanel-label:contains('魔力') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
      },
      invites: {
        selector: [".upanel-label:contains('邀请') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
      },
      // 发布数（user_panel 汇总行：真实总数）
      uploads: {
        selector: [".upanel-label:contains('发布数') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
        text: 0,
      },
      // 做种数（user_panel 汇总行：真实总数）
      seeding: {
        selector: [".upanel-label:contains('做种数') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
        text: 0,
      },
      // 做种量（user_panel 汇总行：真实总量）
      seedingSize: {
        selector: [".upanel-label:contains('做种量') + .upanel-value"],
        filters: [{ name: "parseSize" }],
        text: 0,
      },
      // 总流量（上传+下载）
      totalTraffic: {
        selector: [".upanel-label:contains('总流量') + .upanel-value"],
        filters: [{ name: "parseSize" }],
      },
      // 下载中数
      leeching: {
        selector: [".upanel-label:contains('下载中') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
        text: 0,
      },
      // 完成种子数
      snatches: {
        selector: [".upanel-label:contains('完成数') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
        text: 0,
      },
      // 消息数
      messageCount: {
        selector: [".upanel-label:contains('消息数') + .upanel-value"],
        filters: [{ name: "parseNumber" }],
        text: 0,
      },
      // 头像
      avatar: {
        selector: ".upanel-header img",
        attr: "src",
      },
    },
  },

  noLoginAssert: {
    // 未登录时 torrents.php 会 302 到 member.php?mod=logging&action=login（URL 含 "login" 已足够判断）
    // ⚠️ 不能用 formhash 作判据：Discuz 所有已登录页面都含 <input name="formhash">，会导致已登录被误判为未登录
    urlPatterns: [/member\.php\?mod=logging|action=login|logging/i],
    matchSelectors: ["form[name='login']", "div#mainbox form[name='login']"],
  },
};

export default class YzYY extends PrivateSite {
  /**
   * 构造种子下载链接
   * - 列表页 link 已是 plugin.php?id=dz_seed:seed_detail&action=download&info_hash=... 时直接返回
   * - 帖子详情页 link 是 download.php?info_hash=...，无需转换
   * - 兜底：用 info_hash 构造 download.php 下载链接
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const mockRequestConfig = torrent.url?.startsWith("http") ? { url: torrent.url } : { baseURL: this.url };
    if (torrent.link) {
      return this.fixLink(torrent.link, mockRequestConfig);
    }
    // 兜底：用 info_hash 构造（torrent.id 是 info_hash）
    if (torrent.id) {
      return this.fixLink(`/download.php?info_hash=${torrent.id}`, mockRequestConfig);
    }
    return super.getTorrentDownloadLink(torrent);
  }
}
