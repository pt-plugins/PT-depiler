/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/hdchina.org/config.json
 *
 */
import {
  type ILevelRequirement,
  type ISearchInput,
  type ISiteMetadata,
  type ITorrent,
  type ITorrentTag,
} from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";

/** 站点优惠图标 class → 前端展示用的标签（取自 ajax_promotion.php 返回的 sp_state 片段） */
const promotionTagDefine: Record<string, { name: string; color: string }> = {
  pro_free: { name: "Free", color: "blue" },
  pro_free2up: { name: "2xFree", color: "green" },
  pro_2up: { name: "2xUp", color: "lime" },
  pro_50pctdown2up: { name: "2x50%", color: "light-green" },
  pro_50pctdown: { name: "50%", color: "deep-orange-darken-1" },
  pro_30pctdown: { name: "30%", color: "indigo" },
};

/** 用户等级要求，取自站点 /rules.php 「网站等级规则」 */
const userLevelRequirements: ILevelRequirement[] = [
  {
    id: 1,
    name: "Peasant",
    nameAka: ["封杀对象", "封杀对象(Peasant)"],
    privilege:
      "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
  },
  {
    id: 2,
    name: "User",
    nameAka: ["群众演员", "群众演员(User)"],
    privilege:
      "默认的新用户等级。无法提交种子候选，无法对候选投票，无法使用道具，无法打开签名和个性化称号，不能直接发种，不能查看排行榜。",
  },
  {
    id: 3,
    name: "Power User",
    nameAka: ["客串龙套", "客串龙套(Power User)"],
    interval: "P5W",
    downloaded: "200GB",
    ratio: 1.5,
    privilege:
      "享有群众演员的所有权限，可以使用道具，可以打开签名和个性化称号，不能直接发种(暂时下调至PU)，不能查看排行榜。",
  },
  {
    id: 4,
    name: "Elite User",
    nameAka: ["领衔主演", "领衔主演(Elite User)"],
    interval: "P10W",
    downloaded: "500GB",
    ratio: 2.0,
    privilege: "享有龙套的所有权限，可以在候选区投票，可以在论坛建议区发帖，可以上传字幕，可以删除自己上传的字幕。",
  },
  {
    id: 5,
    name: "Crazy User",
    nameAka: ["成名大腕", "成名大腕(Crazy User)"],
    interval: "P15W",
    downloaded: "1TB",
    ratio: 2.5,
    privilege:
      "享有主演的所有权限，可以查看排行榜，可以使用挂起功能，可在种子区观看到当前下载活动进度条，可以查看当前自己在全站中的流量排名，可以进入邀请区。",
  },
  {
    id: 6,
    name: "Insane User",
    nameAka: ["金牌经纪", "金牌经纪(Insane User)"],
    interval: "P20W",
    downloaded: "1.5TB",
    ratio: 3.0,
    privilege: "享有大腕的所有权限，并可以直接发布种子，无需候选。",
  },
  {
    id: 7,
    name: "Veteran User",
    nameAka: ["最佳导演", "最佳导演(Veteran User)"],
    interval: "P25W",
    downloaded: "2TB",
    ratio: 4.0,
    privilege: "享有经纪人的所有权限，可以在个人资料内隐藏个人信息，可以匿名做种。",
  },
  {
    id: 8,
    name: "Extreme User",
    nameAka: ["大制作人", "大制作人(Extreme User)"],
    interval: "P30W",
    downloaded: "3TB",
    ratio: 5.0,
    privilege: "享有导演的所有权限，可以发送邀请，可以查看其它会员种子历史，可以更新IMDb信息。",
  },
  {
    id: 9,
    name: "Ultimate User",
    nameAka: ["国际巨星", "国际巨星(Ultimate User)"],
    interval: "P40W",
    downloaded: "4TB",
    ratio: 6.0,
    privilege:
      "享有制片人的所有权限，首次升级该级别可自动获得2枚邀请名额。账号挂起永久保留，未挂起的情况下可以保留50周。取消一个月只能发送一个邀请的限制。",
  },
  {
    id: 10,
    name: "Nexus Master",
    nameAka: ["影业帝国", "影业帝国(Nexus Master)"],
    interval: "P50W",
    downloaded: "5TB",
    ratio: 8.0,
    isKept: true,
    privilege: "享有国际巨星的所有权限，首次升级该级别可自动获得3枚邀请名额，账号永久保存(无需挂起)。",
  },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdchina",

  name: "HDChina",
  aka: ["HDWinG", "HDW", "瓷器"],
  description: "高清影音人士分享乐园",
  tags: ["影视", "音乐", "纪录片", "综合"],
  timezoneOffset: "+0800",
  collaborator: ["IITII"],
  favicon: "./hdchina.jpg",

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://uqjvat.bet/"],
  legacyUrls: ["https://hdchina.org/", "https://hdchina.club/"],

  noLoginAssert: {
    matchSelectors: [
      // 站点自有的未登录页（标题 + 正文双重兜底）
      "title:contains('阻断页面')",
      "html:contains('该网站暂时无法进行访问')",
      // NexusPHP 标准登录表单
      "form[action*='takelogin.php']",
      "form#loginform",
      "form[name='loginform']",
    ],
  },

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 20, name: "原盘(Full BD)" },
        { value: 17, name: "电影Movie(1080p)" },
        { value: 16, name: "电影Movie(1080i)" },
        { value: 9, name: "电影Movie(720p)" },
        { value: 13, name: "欧美剧(EU/US TV series)" },
        { value: 25, name: "中港台剧集(Chinese TV series)" },
        { value: 26, name: "韩剧(Kor Drama)" },
        { value: 24, name: "日剧(Jpn Drama)" },
        { value: 21, name: "欧美剧集包(EU/US TV series pack)" },
        { value: 22, name: "中港台剧集包(Chinese TV series pack)" },
        { value: 23, name: "日韩剧集包(JPN/KOR drama pack)" },
        { value: 27, name: "iPad视频(iPad Video)" },
        { value: 5, name: "纪录片(Documentary)" },
        { value: 15, name: "体育节目(Sports)" },
        { value: 14, name: "动画片(Animation)" },
        { value: 401, name: "综艺(TV Shows)" },
        { value: 402, name: "演唱会(Vocal Concert)" },
        { value: 406, name: "MV(Music Video)" },
        { value: 408, name: "音乐(Music)" },
        { value: 19, name: "补充音轨(Audio Track)" },
        { value: 405, name: "戏剧(Drama)" },
        { value: 404, name: "书籍(Book)" },
        { value: 409, name: "其他(Other)" },
        { value: 410, name: "4K UltraHD" },
        { value: 411, name: "旅游(Travel)" },
        { value: 412, name: "饮食(Food)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 11, name: "Blu-ray" },
        { value: 12, name: "HD DVD" },
        { value: 6, name: "Remux" },
        { value: 19, name: "Blu-spec" },
        { value: 2, name: "MiniBD" },
        { value: 5, name: "Encode" },
        { value: 13, name: "HDTV" },
        { value: 21, name: "WEB-DL" },
        { value: 14, name: "DVD" },
        { value: 4, name: "DVDR" },
        { value: 10, name: "DAT" },
        { value: 1, name: "CD" },
        { value: 15, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264/AVC" },
        { value: 2, name: "VC-1" },
        { value: 4, name: "MPEG-2" },
        { value: 6, name: "x264" },
        { value: 10, name: "x265/HEVC" },
        { value: 3, name: "Xvid" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 14, name: "DTS X" },
        { value: 15, name: "Atmos" },
        { value: 12, name: "DTS-HDMA" },
        { value: 13, name: "True-HD" },
        { value: 11, name: "LPCM" },
        { value: 3, name: "DTS" },
        { value: 8, name: "AC3" },
        { value: 9, name: "WAVE" },
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 6, name: "AAC" },
        { value: 5, name: "OGG" },
        { value: 10, name: "TTA" },
        { value: 4, name: "MP2/3" },
        { value: 7, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 19, name: "8K" },
        { value: 17, name: "4K" },
        { value: 18, name: "2K" },
        { value: 11, name: "1080P" },
        { value: 12, name: "1080I" },
        { value: 13, name: "720P" },
        { value: 15, name: "SD" },
        { value: 10, name: "其他(Other)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 15, name: "HDChina" },
        { value: 16, name: "HDCTV" },
        { value: 12, name: "iHD" },
        { value: 10, name: "HDWinG" },
        { value: 11, name: "HDWTV" },
        { value: 17, name: "KiSHD" },
        { value: 7, name: "OpenMV" },
        { value: 22, name: "HDC" },
        { value: 23, name: "DIY" },
        { value: 6, name: "KHQ" },
        { value: 30, name: "ExREN" },
        { value: 26, name: "JOMA" },
        { value: 25, name: "Anonymous" },
        { value: 24, name: "CrsS" },
        { value: 18, name: "Ebp" },
        { value: 19, name: "DON" },
        { value: 20, name: "ESiR" },
        { value: 29, name: "TrollHD" },
        { value: 9, name: "WiKi" },
        { value: 4, name: "beAst" },
        { value: 2, name: "CMCT" },
        { value: 8, name: "NGB" },
        { value: 21, name: "LU9998" },
        { value: 28, name: "TAiCHi" },
        { value: 27, name: "U2" },
        { value: 31, name: "Enichi" },
        { value: 32, name: "AREY" },
        { value: 5, name: "其他(Other)" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  officialGroupPattern: [/-(HDChina|HDWinG|HDCTV|HDWTV)$/i],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      // NexusPHP 的列表表格被换成了 table.torrent_list，且表头是 tr.tab_header
      rows: {
        selector: "table.torrent_list > tbody > tr:not(.tab_header)",
      },
      id: {
        selector: "td.t_name h3 a",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: "td.t_name h3 a",
        text: "",
        elementProcess: (element) => (element.getAttribute("title") || element.textContent || "").trim(),
      },
      subTitle: {
        selector: "td.t_name h4",
        text: "",
      },
      url: {
        selector: "td.t_name h3 a",
        attr: "href",
      },
      // 下载链接为签名形式（download.php?hash=...），没有 id/passkey 参数
      link: {
        selector: 'td.act a[href*="download.php?hash="]',
        attr: "href",
      },
      category: {
        selector: "td.t_cat img.catchs",
        attr: "alt",
      },
      size: {
        selector: "td.t_size",
      },
      author: {
        selector: "td.t_uploader",
        text: "",
      },
      comments: {
        selector: "td.t_comment",
        filters: [{ name: "parseNumber" }],
      },
      time: {
        selector: "td.t_time",
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] }],
      },
      seeders: {
        selector: "td.t_torrents",
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: "td.t_leech",
        filters: [{ name: "parseNumber" }],
      },
      completed: {
        selector: "td.t_completed",
        filters: [{ name: "parseNumber" }],
      },
      ext_imdb: {
        // 站点开启 IMDb 显示后，标题链接的 onmouseover 会带上
        // get_ext_info_ajax('torrent_x','<imdbId>','0','xxx')：
        // 第二个参数是 IMDb 编号，但不带 tt 前缀、且去掉了前导零（66319 → tt0066319），
        // 这里统一补成 tt + 7 位（超过 7 位的不截断）。
        selector: ["td.t_name h3 a[onmouseover*='get_ext_info_ajax']", "span[data-imdbid]", "a[href*='imdb.com']"],
        text: "",
        elementProcess: (element) => {
          const raw =
            (element.getAttribute("onmouseover") || "").match(/get_ext_info_ajax\(\s*'[^']*'\s*,\s*'(\d+)'/)?.[1] ??
            element.getAttribute("data-imdbid") ??
            element.getAttribute("href") ??
            "";

          const imdbId = raw.match(/tt\d+|\d+/)?.[0];
          return imdbId ? `tt${imdbId.replace(/^tt/, "").padStart(7, "0")}` : "";
        },
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        // 分享规则：/pic/share_rule_1.gif 即「禁止转载」；站点另有 share_rule_2/3/255 三种规则，此处只标最严格的一档
        { name: "禁转", selector: "img[src*='pic/share_rule_1.gif']", color: "deep-orange-darken-1" },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
    },
  ],

  detail: {
    ...(SchemaMetadata.detail ?? {}),
    selectors: {
      ...(SchemaMetadata.detail?.selectors ?? {}),
      title: {
        // 详情页标题为 h2#top，其中可能混入优惠状态占位 span
        selector: ["h2#top"],
        text: "",
        elementProcess: (element) => {
          const clone = element.cloneNode(true) as HTMLElement;
          clone.querySelectorAll("span.sp_state_placeholder").forEach((placeholder) => placeholder.remove());
          return (clone.textContent || "").trim();
        },
      },
      link: {
        selector: ['a[href*="download.php?hash="]'],
        attr: "href",
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: [
      { ...SchemaMetadata.userInfo!.process![0] },
      {
        ...SchemaMetadata.userInfo!.process![1],
        // 站点没有 H&R（myhr.php 不存在），也没有「实际上传/下载量」，这些字段直接不取
        fields: [
          "name",
          "uploaded",
          "downloaded",
          "levelName",
          "bonus",
          "seedingBonus",
          "joinTime",
          "seeding",
          "seedingSize",
          "lastAccessAt",
        ],
      },
      { ...SchemaMetadata.userInfo!.process![2] },
    ],
  },

  levelRequirements: userLevelRequirements,
};

export default class HDChina extends NexusPHP {
  /** 站点所有 AJAX 接口都要求带上页面里的 CSRF token，取到后缓存复用 */
  private csrfToken: string | null = null;

  /**
   * 站点把优惠状态（Free / 2X / …）从列表页里剥离，改为前端 POST /ajax_promotion.php 批量获取。
   *
   * - content-script 场景：页面自己的脚本已经请求过该接口，并把优惠图标写进每行的 `td.discount`
   *   （`<img class="pro_free" alt="Free">`）。NexusPHP schema 的 `tags` 选择器（`img.pro_*`）
   *   会直接从行内 DOM 解析出优惠标签，此时无需再发一次同样的请求；
   * - 后台搜索场景：通过 HTTP 拿到的原始 HTML 没有执行页面脚本，`td.discount` 为空，
   *   这时才补一次请求，把优惠标签补回每个种子。
   */
  public override async transformSearchPage(doc: Document | any, searchConfig: ISearchInput): Promise<ITorrent[]> {
    const torrents = await super.transformSearchPage(doc, searchConfig);
    if (!(doc instanceof Document) || torrents.length === 0) {
      return torrents;
    }

    // 页面已渲染出优惠图标（td.discount 内的 img.pro_*），说明站点自己的 ajax_promotion.php 请求已经完成，复用其结果
    if (doc.querySelector("td.discount img[class*='pro_']")) {
      return torrents;
    }

    const csrf = doc.querySelector('meta[name="x-csrf"]')?.getAttribute("content");
    const ids = torrents.map((torrent) => String(torrent.id)).filter((id) => /^\d+$/.test(id));
    if (!csrf || ids.length === 0) {
      return torrents;
    }

    try {
      const data: Record<string, string> = { csrf };
      ids.forEach((id, index) => {
        data[`ids[${index}]`] = id;
      });

      const { data: response } = await this.request<{
        status: number;
        message?: Record<string, { sp_state?: string; timeout?: string }>;
      }>({
        url: "/ajax_promotion.php",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data,
        responseType: "json",
      });

      for (const torrent of torrents) {
        const spState = response?.message?.[String(torrent.id)]?.sp_state;
        if (!spState) {
          continue;
        }

        const tags: ITorrentTag[] = torrent.tags ?? [];
        for (const match of spState.matchAll(/class="(pro_[a-z0-9]+)"/g)) {
          const tag = promotionTagDefine[match[1]];
          if (tag && !tags.some((item) => item.name === tag.name)) {
            tags.push({ ...tag });
          }
        }

        if (tags.length > 0) {
          torrent.tags = tags;
        }
      }
    } catch (e) {
      console.debug(`[PTD] site '${this.name}' failed to fetch promotion state:`, e);
    }

    return torrents;
  }

  /**
   * 站点把 /getusertorrentlistajax.php 换成了 POST /ajax_getusertorrentlist.php，
   * 且返回的是 JSON（真正的内容在 message 字段里），另外必须带 CSRF token。
   */
  protected override async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const csrf = await this.fetchCsrfToken();
    if (!csrf) {
      return null;
    }

    const { data } = await this.request<{ status: number; message?: string }>({
      url: "/ajax_getusertorrentlist.php",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { userid: userId, type, csrf },
      responseType: "json",
    });

    return data?.message ?? null;
  }

  private async fetchCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    const { data } = await this.request<string>({ url: "/index.php" });
    this.csrfToken = (typeof data === "string" ? data : "").match(/<meta name="x-csrf" content="([^"]+)"/)?.[1] ?? "";
    return this.csrfToken;
  }
}
