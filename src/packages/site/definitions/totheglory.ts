import type { ISiteMetadata } from "@ptd/site";
import { extractContent, parseSizeString } from "@ptd/site";
import Sizzle from "sizzle";
import { set } from "es-toolkit/compat";

const categoryMovieMap = [
  "电影DVDRip",
  "电影720p",
  "电影1080i/p",
  "BluRay原盘",
  "影视2160p",
  "UHD原盘",
  "纪录片720p",
  "纪录片1080i/p",
  "纪录片BluRay原盘",
  "欧美剧720p",
  "欧美剧1080i/p",
  "高清日剧",
  "大陆港台剧1080i/p",
  "大陆港台剧720p",
  "高清韩剧",
  "欧美剧包",
  "日剧包",
  "华语剧包",
  "韩剧包",
  "(电影原声&Game)OST",
  "无损音乐FLAC&APE",
  "MV&演唱会",
  "高清体育节目",
  "高清动漫",
  "韩国综艺",
  "高清综艺",
  "日本综艺",
  "MiniVideo",
  "补充音轨",
  "iPhone/iPad视频",
  "动漫原盘",
];

function generateCategorySearchString(category: string | string[]) {
  const categories = Array.isArray(category) ? category : [category];
  return categories.map((v) => `分类:"${v}"`).join(" ");
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "totheglory",
  name: "ToTheGlory",
  aka: ["TTG"],
  description: "ToTheGlory（TTG）是一个综合性PT站点，以高清电影、电视剧、音乐、动漫资源为主。",
  tags: ["影视", "音乐", "游戏", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://totheglory.im/"],
  category: [
    {
      name: "分类入口",
      key: "c",
      options: [
        { name: "影视&音乐 Media", value: "M" },
        { name: "游戏&软件 Gamez&Warez", value: "G" },
      ],
    },
    {
      name: "分类（影视&音乐）",
      key: "cat_movie",
      options: categoryMovieMap.map((cat) => {
        return { name: cat, value: cat };
      }),
      cross: { mode: "brackets" }, // 因为ttg的分类是合并到搜索字符串中的，所以这里先置为 brackets，然后在search.requestConfigTransformer 做修改
    },
    {
      name: "分类（游戏&软件）",
      key: "cat_game",
      options: [
        { name: "单机游戏（PC）", value: "PC" },
        { name: "单机游戏（MAC）", value: "MAC" },
        { name: "微软系列（XBOX360）", value: "XBOX360" },
        { name: "微软系列（XBOX1）", value: "XBOX1" },
        { name: "微软系列（XBLA）", value: "XBLA" },
        { name: "微软系列（XBOX to XBOX360）", value: "XBOX to XBOX360" },
        { name: "索尼系列（PS2）", value: "PS2" },
        { name: "索尼系列（PSP）", value: "PSP" },
        { name: "索尼系列（PS4）", value: "PS4" },
        { name: "索尼系列（PS3）", value: "PS3" },
        { name: "索尼系列（PSV）", value: "PSV" },
        { name: "任天堂系列（WiiU）", value: "WIIU" },
        { name: "任天堂系列（Wii）", value: "WII" },
        { name: "任天堂系列（Switch）", value: "SWITCH" },
        { name: "任天堂系列（NDS）", value: "NDS" },
        { name: "任天堂系列（NGC）", value: "NGC" },
        { name: "主机视频（PS3兼容高清）", value: "PS3兼容高清" },
        { name: "主机视频（PSP兼容高清&标清）", value: "PSP兼容高清&标清" },
        { name: "主机视频（XBOX360兼容高清）", value: "XBOX360兼容高清" },
        { name: "主机视频（Game Video）", value: "Game Video" },
        { name: "软件（APPZ）", value: "APPZ" },
        { name: "软件（Game Ebook）", value: "Game Ebook" },
        { name: "软件（Ebook）", value: "Ebook" },
        { name: "苹果系列（iPhone/iPad游戏）", value: "iPhone/iPad游戏" },
        { name: "苹果系列（iPad书籍）", value: "iPad书籍" },
        { name: "苹果系列（iPhone/iPad软件）", value: "iPhone/iPad软件" },
      ],
      cross: { mode: "brackets" },
    },
  ],

  search: {
    keywordPath: "params.search_field",
    requestConfig: {
      url: "/browse.php",
      params: {
        c: "M", // 默认搜索 影视&音乐 板块，除非category覆写
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig }) => {
          if (requestConfig?.params?.search_field) {
            requestConfig.params.search_field = requestConfig.params.search_field.replace("tt", "IMDB");
          }

          return requestConfig!;
        },
      },
    },
    requestConfigTransformer: ({ requestConfig }) => {
      // 防止搜索字段缺失（如空白搜索的情况）
      if (typeof requestConfig?.params?.search_field === "undefined") {
        set(requestConfig!, "params.search_field", "");
      }

      // 在这里处理虚拟的 cat_movie 和 cat_game
      if (requestConfig?.params?.c === "M" && requestConfig?.params?.cat_movie) {
        requestConfig.params.search_field += " " + generateCategorySearchString(requestConfig.params.cat_movie);
      }

      if (requestConfig?.params?.c === "G" && requestConfig?.params?.cat_game) {
        requestConfig.params.search_field += " " + generateCategorySearchString(requestConfig.params.cat_game);
      }

      if (requestConfig?.params?.search_field) {
        requestConfig.params.search_field = requestConfig.params.search_field.trim();
      }

      delete requestConfig!.params.cat_movie;
      delete requestConfig!.params.cat_game;

      return requestConfig!;
    },

    selectors: {
      rows: { selector: "table#torrent_table > tbody > tr[id]" },
      id: { selector: ":self", attr: "id" },
      title: {
        selector: "div.name_left > a > b",
        elementProcess: (e: HTMLElement) => e.innerHTML.split("<br>")[0],
      },
      subTitle: {
        selector: "div.name_left > a > b",
        elementProcess: (e: HTMLElement) => extractContent(e.innerHTML.split("<br>")[1] || ""),
      },
      url: { selector: "div.name_left > a", attr: "href" },
      link: { selector: "a.dl_a", attr: "href" },
      time: { selector: "td:nth-child(5)", filters: [{ name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss"] }] },
      size: { selector: "td:nth-child(7)" },
      author: { selector: "td:nth-last-child(1)" },
      category: { selector: "td:nth-child(1) > a > img", attr: "alt" },
      seeders: {
        selector: "td:nth-child(9)",
        filters: [(q: `${number}/${number}`) => q.split("/")[0]],
      },
      leechers: {
        selector: "td:nth-child(9)",
        filters: [(q: `${number}/${number}`) => q.split("/")[1]],
      },
      completed: { selector: "td:nth-child(8)", filters: [parseInt] },
      comments: { text: 0, selector: 'a[href*="tocomm=1"]' },

      tags: [
        { name: "Free", selector: "img[alt='free']", color: "blue" },
        { name: "30%", selector: "img[alt='30%']", color: "indigo" },
        { name: "50%", selector: "img[alt='50%']", color: "deep-orange-darken-1" },
        { name: "Excl.", selector: "span.browse.excl", color: "red" },
      ],
    },
  },

  searchEntry: {
    area_media: { name: "影视&音乐 Media", requestConfig: { params: { c: "M" } } },
    area_gamez: { name: "游戏&软件 Gamez&Warez", requestConfig: { params: { c: "G" } }, enabled: false },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: {
            selector: "a[href*='userdetails.php']:first",
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          messageCount: {
            selector: "td[style*='background'] > b > a[href*='messages.php'], a[href='#notice']",
            filters: [{ name: "parseNumber" }],
          },
          uploaded: {
            selector: ["td.rowhead:contains('上传量') + td", "td.rowhead:contains('上傳量') + td"],
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: ["td.rowhead:contains('下载量') + td", "td.rowhead:contains('下載量') + td"],
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "td.rowhead:contains('分享率') + td",
            filters: [{ name: "parseNumber" }],
          },
          levelName: {
            selector: ["td.rowhead:contains('等级') + td", "td.rowhead:contains('等級') + td"],
          },
          bonus: {
            selector: ["td.rowhead:contains('积分') + td", "td.rowhead:contains('積分') + td"],
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: ["td.rowhead:contains('注册日期') + td", "td.rowhead:contains('註冊日期') + td"],
            filters: [{ name: "parseTime" }],
          },
          seeding: {
            text: 0,
            selector: "div#ka2",
            elementProcess: (element: HTMLElement) => {
              const trAnothers = Sizzle("tr:not(:eq(0))", element);
              return trAnothers.length;
            },
          },
          seedingSize: {
            text: 0,
            selector: "div#ka2",
            elementProcess: (element: HTMLElement) => {
              let seedingSize = 0;
              const trAnothers = Sizzle("tr:not(:eq(0))", element);
              trAnothers.forEach((trAnother) => {
                const sizeAnother = Sizzle("td:eq(3)", trAnother)[0];
                seedingSize += parseSizeString((sizeAnother as HTMLElement).innerText.trim());
              });
              return seedingSize;
            },
          },
          uploads: {
            text: 0,
            selector: "div#ka1",
            elementProcess: (element: HTMLElement) => {
              const trAnothers = Sizzle("tr:not(:eq(0))", element);
              return trAnothers.length;
            },
          },
        },
      },
      {
        requestConfig: { url: "/mybonus.php" },
        selectors: {
          bonusPerHour: {
            selector: "td.rowhead:contains('总计') + td",
            filters: [{ name: "split", args: [" ", 0] }, { name: "parseNumber" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Byte",
      privilege: "入站最初始等级，接受新人考核制。",
    },
    {
      id: 2,
      name: "KiloByte",
      interval: "P5W",
      downloaded: "60GB",
      ratio: 1.1,
      privilege: "可申请种子候选",
    },
    {
      id: 3,
      name: "MegaByte",
      interval: "P8W",
      downloaded: "150GB",
      ratio: 2.0,
      privilege: "无",
    },
    {
      id: 4,
      name: "GigaByte",
      interval: "P8W",
      downloaded: "250GB",
      ratio: 2.0,
      privilege: "可挂起，可进入积分商城",
    },
    {
      id: 5,
      name: "TeraByte",
      interval: "P8W",
      downloaded: "500GB",
      ratio: 2.5,
      privilege: "可用积分购买邀请，并可浏览全站（新加游戏分类页），可以访问邀请区",
    },
    {
      id: 6,
      name: "PetaByte",
      interval: "P16W",
      downloaded: "750GB",
      ratio: 2.5,
      privilege: "可直接发布种子",
    },
    {
      id: 7,
      name: "ExaByte",
      interval: "P24W",
      downloaded: "1TB",
      ratio: 3.0,
      privilege: "自行挂起账号后不会被清除",
    },
    {
      id: 8,
      name: "ZettaByte",
      interval: "P24W",
      downloaded: "1.5TB",
      ratio: 3.5,
      privilege: "无",
    },
    {
      id: 9,
      name: "YottaByte",
      interval: "P24W",
      downloaded: "2.5TB",
      ratio: 4.0,
      privilege: "可查看排行榜",
    },
    {
      id: 10,
      name: "BrontoByte",
      interval: "P32W",
      downloaded: "3.5TB",
      ratio: 5.0,
      privilege: "永远保留账号",
    },
    {
      id: 11,
      name: "NonaByte",
      interval: "P48W",
      downloaded: "5TB",
      uploaded: "50TB",
      ratio: 6.0,
      privilege: "无",
    },
    {
      id: 12,
      name: "DoggaByte",
      interval: "P48W",
      downloaded: "10TB",
      uploaded: "100TB",
      ratio: 6.0,
      privilege: "无",
    },
    {
      id: 100,
      groupType: "vip",
      name: "资深组",
      privilege: "元老组，免考核且长期不活动不访问也将保留账号。",
    },
    {
      id: 101,
      groupType: "vip",
      name: "VIP",
      privilege: "为TTG做出特殊重大贡献的用户或合作者等。只计算上传量，不计算下载量。",
    },
  ],
};
