import { ETorrentStatus, type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";
import Sizzle from "sizzle";

const levelMap: Record<string, string> = {
  class1: "User",
  class2: "Power User",
  class3: "Elite User",
  class4: "Crazy User",
  class5: "Insane User",
  class6: "Veteran User",
  class7: "Extreme User",
  class8: "Ultimate User",
  class9: "Master User",
  class10: "Star User",
  class11: "God User",
};

export const siteMetadata: ISiteMetadata = {
  version: 2,
  id: "starspace",
  name: "星空",
  aka: ["StarSpace", "影"],
  description: "We all have a dream.",
  tags: ["影视", "音乐", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://fgne-fcnpr.arg/"],
  legacyUrls: ["https://shadowflow.org/"],

  collaborator: ["yiyule", "milangree", "hui-shao", "Rhilip"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "影视区", value: "/p_torrent/video_list_t.php" },
        { name: "音乐区", value: "/p_music/music_list_t.php" },
      ],
    },
  ],

  officialGroupPattern: [/Ying(WEB|DIY|TV|MV|MUSIC)?$/i],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/p_torrent/video_list_t.php", // 默认搜索视频板块，除非覆盖
      params: { area: "name" }, // 搜索标题和副标题
    },

    selectors: {
      rows: { selector: "tr[class*='tm_tr_top']" },
      id: {
        selector: "#tm_div_name > a",
        elementProcess: (e: HTMLElement) => {
          const href = e.getAttribute("href");
          return href ? href.split("tid=")[1] : "";
        },
      },
      title: { selector: "#tm_div_name > a" },
      subTitle: { selector: "div#tm_div_desc" },
      url: { selector: "#tm_div_name > a", attr: "href" },
      link: { selector: "a:has(img.download)", attr: "href" },
      time: { selector: "td#tm_td_uploader", filters: [{ name: "parseTTL" }] },
      size: { selector: "td#tm_td_size", filters: [{ name: "append", args: ["B"] }, { name: "parseSize" }] },
      author: { selector: "#tm_td_uploader span" },
      category: { selector: "td#table_cat_td2.corner_bottom" },
      seeders: { selector: "#tm_td_seed > a" },
      leechers: { selector: "#tm_td_dl > a" },
      completed: { selector: "#tm_td_complete > a" },

      comments: { text: "N/A" },

      tags: [
        { name: "Free", selector: "span#free", color: "#2bc3ee" },
        { name: "禁转", selector: "span.tag:contains('禁转')", color: "#ff0000" },
        { name: "官方", selector: "span.tag:contains('官方')", color: "#0040ff" },
        { name: "驻站", selector: "span.tag:contains('驻站')", color: "#da6f00" },
        { name: "完结", selector: "span.tag:contains('完结')", color: "#6c20b2" },
        { name: "中字", selector: "span.tag:contains('中字')", color: "#04b404" },
        { name: "英字", selector: "span.tag:contains('英字')", color: "#c4c800" },
        { name: "国语", selector: "span.tag:contains('国语')", color: "#e14f4f" },
        { name: "粤语", selector: "span.tag:contains('粤语')", color: "#cc8e8e" },
        { name: "英语", selector: "span.tag:contains('英语')", color: "#fa58f4" },
      ],

      progress: {
        selector: "div[style*='width'][title]",
        elementProcess: (element) => {
          const inlineWidth = element.style.width;
          return inlineWidth ? parseFloat(inlineWidth.replace("%", "")) : 0;
        },
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: "div[style*='background'][title]",
        case: {
          "div[style*='background: #bbbbbb']": ETorrentStatus.inactive, // 站点未提供 complete 和 inactive 的区分
          "div[style*='background: #71af67']": ETorrentStatus.seeding,
          "div[style*='background: #53c541']": ETorrentStatus.downloading,
        },
      },
    },
  },

  searchEntry: {
    area_video: { name: "视频", requestConfig: { url: "/p_torrent/video_list_t.php" } },
    area_music: { name: "音乐", requestConfig: { url: "/p_music/music_list_t.php" }, enabled: false },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/p_index/index.php" },
        selectors: {
          id: {
            selector: "a[href*='user_detail.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          name: {
            selector: "a[href*='user_detail.php']:first",
          },
        },
      },
      {
        requestConfig: { url: "/p_user/user_detail.php" },
        assertion: { id: "params.uid" },
        selectors: {
          levelName: {
            selector: ["td.nowrap:contains('等级') + td > img"],
            elementProcess: (e: HTMLElement) => {
              const level = e.getAttribute("alt");
              return levelMap[level ?? ""] ?? level ?? "";
            },
          },
          joinTime: {
            selector: ["td.nowrap:contains('加入日期') + td"],
            filters: [{ name: "parseTime" }],
          },
          uploaded: {
            selector: ["a[href*='user_upload.php']:first"],
            filters: [
              (query: string) => {
                const match = query.match(/(\d+(\.\d+)?\s*[A-Za-z]+)/);
                return match ? parseSizeString(match[0] + "B") : 0;
              },
            ],
          },
          downloaded: {
            selector: ["span#user_info_no_hover"],
            filters: [
              (query: string) => {
                const match = query.match(/(\d+(\.\d+)?\s*[A-Za-z]+)/);
                return match ? parseSizeString(match[0] + "B") : 0;
              },
            ],
          },
          ratio: {
            selector: ["td.nowrap:contains('传输') + td tr#tr_item_min > td:nth-child(4)"],
            filters: [{ name: "parseNumber" }],
          },
          bonus: {
            selector: ["td.nowrap:contains('魔力') + td"],
            filters: [{ name: "parseNumber" }],
          },
          seedingBonus: {
            selector: ["td.nowrap:contains('保种积分') + td", "td.nowrap:contains('保種積分') + td"],
            filters: [{ name: "parseNumber" }],
          },
          seeding: {
            text: 0,
            selector: "a[href*='torrent_user.php?pop=8']:first",
            filters: [{ name: "parseNumber" }],
          },
          lastAccessAt: {
            selector: [
              "td.nowrap:contains('最近访问') + td",
              "td.nowrap:contains('最近訪問') + td",
              "td.nowrap:contains('Last Access') + td",
            ],
            filters: [{ name: "split", args: ["(", 0] }, { name: "parseTime" }],
          },
        },
      },
      {
        requestConfig: { url: "/p_torrent/torrent_user.php", params: { pop: 8 } },
        selectors: {
          seedingSize: {
            text: 0,
            selector: "table#table_tm > tbody",
            elementProcess: (element: HTMLElement) => {
              let seedingSize = 0;
              const trAnothers = Sizzle("tr[class^='tm_tr']", element);
              trAnothers.forEach((trAnother) => {
                const sizeAnother = Sizzle("td:nth-child(4)", trAnother)[0] as HTMLElement | undefined;
                seedingSize += parseSizeString((sizeAnother?.innerText?.trim() ?? "0") + "B");
              });
              return seedingSize;
            },
          },
        },
      },
      {
        requestConfig: { url: "/p_torrent/torrent_user.php", params: { pop: 7 } },
        selectors: {
          uploads: {
            text: 0,
            selector: "#table_pager span.pager_current",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/p_bonus/bonus_hour.php" },
        selectors: {
          bonusPerHour: {
            selector: "tr:contains('合计时魔') > td:last",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      nameAka: ["新手"],
      privilege: "入站初始等级",
    },
    {
      id: 2,
      name: "Power User",
      nameAka: ["入门"],
      privilege: "(暂时下调)此等级及以上用户可以购买限时邀请",
    },
    {
      id: 3,
      name: "Elite User",
      nameAka: ["发烧"],
      privilege: "无",
    },
    {
      id: 4,
      name: "Crazy User",
      nameAka: ["着迷"],
      privilege: "此等级及以上用户不会因为长期不登录被禁用",
    },
    {
      id: 5,
      name: "Insane User",
      nameAka: ["狂热"],
      privilege: "无",
    },
    {
      id: 6,
      name: "Veteran User",
      nameAka: ["资深"],
      privilege: "无",
    },
    {
      id: 7,
      name: "Extreme User",
      nameAka: ["大师"],
      privilege: "无",
    },
    {
      id: 8,
      name: "Ultimate User",
      nameAka: ["宗师"],
      privilege: "无",
    },
    {
      id: 9,
      name: "Master User",
      nameAka: ["满级"],
      privilege: "无",
    },
    {
      id: 10,
      name: "Star User",
      nameAka: ["星级"],
      privilege: "无",
    },
    {
      id: 11,
      name: "God User",
      nameAka: ["神级"],
      privilege: "无",
    },
  ],
};
