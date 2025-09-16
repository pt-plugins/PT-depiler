import { type ILevelRequirement, ISearchInput, type ISiteMetadata, ITorrent, ITorrentTag } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";
import { parseSizeString, parseValidTimeString } from "../utils";

// 清理用户名中的 star 相关元素和文本
const cleanUsername = (element: Element): string => {
  const clone = element.cloneNode(true) as Element;
  
  // 移除包含 star 的元素
  clone.querySelectorAll('i, span, div').forEach(el => {
    if (el.textContent?.toLowerCase().includes('star')) {
      el.remove();
    }
  });
  
  // 清理文本
  let result = clone.textContent?.replace(/\b(starbig|star)\b/gi, '') || '';
  result = result.replace(/\s+/g, ' ').replace(/^[\s\-_\.=]+|[\s\-_\.=]+$/g, '');
  
  return result || element.textContent?.trim() || '';
};

const levelRequirements: (ILevelRequirement & { levelId?: number })[] = [
  {
    id: 0,
    name: "天使",
    privilege: "新手上路；可以直接发布种子；可以使用 RSS",
  },
  {
    id: 1,
    name: "大天使",
    interval: "P4W",
    uploaded: "50GB",
    ratio: 1.0,
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
  {
    id: 4,
    name: "力天使",
    interval: "P16W",
    uploaded: "1TB",
    ratio: 2.0,
    privilege: "可以查看普通日志。",
  },
  {
    id: 5,
    name: "主天使",
    interval: "P24W",
    uploaded: "5TB",
    ratio: 2.5,
    privilege: "主天使及以上市民会永远保留账号。",
  },
  {
    id: 6,
    name: "座天使",
    interval: "P36W",
    uploaded: "10TB",
    ratio: 2.6,
    privilege: "",
  },
  {
    id: 7,
    name: "智天使",
    interval: "P72W",
    uploaded: "20TB",
    ratio: 2.8,
    privilege: "比较牛逼的等级。",
  },
  {
    id: 8,
    name: "炽天使",
    interval: "P100W",
    uploaded: "40TB",
    ratio: 4.0,
    privilege: "最牛逼的市民，或特殊任务分配。",
  },
  {
    id: 9,
    name: "贵宾",
    privilege: "管理员分配，捐助的市民，或自行以魅力值兑换获得。免除自动降级无视分享率。",
  },
  {
    id: 10,
    name: "隐天使",
    privilege: "退休后的管理组成员。",
  },
  {
    id: 11,
    name: "射种天使",
    privilege: "专注的发布者。工作组。可以查看匿名。",
  },
  {
    id: 12,
    name: "论坛版主",
    privilege: "论坛管理者。可以制定在任版块的版规、管理主题和帖子。",
  },
  {
    id: 13,
    name: "总版主",
    privilege: "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子及字幕；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息；可以将种子设为置顶或促销；可以查看用户IP或Email等机密信息。不能管理友情链接、最近消息；不能删除账号。",
  },
  {
    id: 14,
    name: "管理员",
    privilege: "各种日常管理，可以做任何修改。",
  },
  {
    id: 15,
    name: "守护天使",
    privilege: "网站开发/维护人员，可以做任何修改。",
  },
  {
    id: 16,
    name: "市长",
    privilege: "灵魂。",
  },
];

const linkQuery = {
  selector: ['a[href*="download?id="]'],
  attr: "href",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

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
  formerHosts: ["hdcity.top"],

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
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    keywordPath: "params.iwannaseethis",
    requestConfig: {
      url: "/pt",
      params: { notnewword: 1 },
    },
    selectors: {
      rows: { selector: ".mitem" },
      link: linkQuery,
      url: {
        ...linkQuery,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/t-"] },
        ],
      },
      id: {
        ...linkQuery,
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: [".mtop a[href^='t-']"],
      },
      subTitle: {
        selector: [".mtitle a[href^='t-']"],
      },
      time: {
        selector: "div[style='minfo']",
        filters: [
          (query: string) => {
            return query ? parseValidTimeString(query.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)![1]) : "";
          },
        ],
      },
      size: { selector: ".mbottom .mbelement:nth-child(3)", filters: [{ name: "parseSize" }] },
      author: { 
        selector: ["div[style='minfo'] > span"],
        elementProcess: cleanUsername,
      },
      seeders: {
        selector: ".mbottom a[href*='seeders']",
        filters: [
          (query: string) => {
            return query ? query.match(/(\d+)/)![1] : "0";
          },
        ],
      },
      leechers: {
        selector: ".mbottom a[href*='leechers']",
        filters: [
          (query: string) => {
            return query ? query.match(/(\d+)/)![1] : "0";
          },
        ],
      },
      completed: {
        selector: ".mbottom a[href*='viewsnatches']",
        filters: [
          (query: string) => {
            return query ? query.match(/(\d+)/)![1] : "0";
          },
        ],
      },
      tags: [...SchemaMetadata.search!.selectors!.tags!],
    },
  },

  userInfo: {
    pickLast: ["id", "joinTime"],
    process: [
      {
        requestConfig: { url: "/userdetails", responseType: "document" },
        selectors: {
          id: {
            selector: ["center .text_alt .text:contains('ID')"],
            filters: [
              (query: string) => {
                return query.match(/(\d+)/)![1];
              },
            ],
          },
          name: {
            selector: [".text_alt span[style]"],
            elementProcess: cleanUsername,
          },
          messageCount: {
            text: 0,
            selector: "a[href*='messages']",
            filters: [
              (query: string) => {
                return parseInt(query.match(/(\d+)/)![1]);
              },
            ],
          },
          uploaded: {
            selector: [".text_alt + br + div .text:nth-child(1)"],
            filters: [
              (query: string) => {
                return parseSizeString(
                  query.match(/(上传量|上傳量|Uploaded):\s+([\d.]+ [ZEPTGMK]i?B)/)?.[2]?.trim() ?? "0",
                );
              },
            ],
          },
          downloaded: {
            selector: [".text_alt + br + div .text:nth-child(1)"],
            filters: [
              (query: string) => {
                return parseSizeString(
                  query.match(/(下载量|下載量|Downloaded):\s+([\d.\s,ZEPTGMKiB]+)/)?.[2]?.trim() ?? "0",
                );
              },
            ],
          },
          levelName: {
            selector: [".text_alt img[src*='class']:first"],
            attr: "src",
            filters: [
              (query: string) => {
                const levelId = parseInt(query.match(/\/class\/(\d+)\.gif/)![1]) - 1;
                return levelRequirements.find((x) => x.id === levelId)?.name ?? levelId;
              },
            ],
          },
          bonus: {
            selector: [".text_alt + br + div .text:nth-child(4)"],
            filters: [
              (query: string) => {
                return parseFloat(query.match(/(魅力值|Karma Points)\s+([\d.]+)/)?.[2]?.trim() ?? "0");
              },
            ],
          },
          joinTime: {
            selector: [".text:contains('加入日期')", ".text:contains('Join date')"],
            filters: [
              (query: string) => {
                return parseValidTimeString(query.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)![1]);
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
  levelRequirements,
};

export default class HDCity extends NexusPHP {
  // 获取做种、发种页面
  protected override async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const { data } = await this.request<string>({
      url: "/getusertorrentlistajax",
      params: { userid: userId, type },
    });
    return data || null;
  }

  // 获取种子标签
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    super.parseTorrentRowForTags(torrent, row, searchConfig);

    const customTags = row.querySelectorAll(".mbottom .mpromo");
    if (customTags.length > 0) {
      const tags: ITorrentTag[] = torrent.tags || [];
      customTags.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const tagName = htmlElement.textContent?.replace(/\s/g, "").replace("免费", "Free");
        if (tagName) {
          tags.push({ name: tagName });
        }
      });

      torrent.tags = tags;
    }

    return torrent;
  }
}
