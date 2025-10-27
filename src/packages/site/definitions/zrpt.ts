import type { ISiteMetadata, ITorrentTag } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "zrpt",
  name: "ZRPT",
  aka: ["探索自然美", "专注纪录片"],
  description: "探索自然之美，专注纪录片的PT站点",
  tags: ["纪录片", "自然", "教育"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://zrpt.cc/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "自然纪录片", value: 401 },
        { name: "科学纪录片", value: 402 },
        { name: "历史纪录片", value: 403 },
        { name: "人文纪录片", value: 404 },
        { name: "地理纪录片", value: 405 },
        { name: "动物纪录片", value: 406 },
        { name: "植物纪录片", value: 407 },
        { name: "天文纪录片", value: 408 },
        { name: "其他纪录片", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "画质",
      key: "quality",
      options: [
        { name: "4K UHD", value: 1 },
        { name: "1080p", value: 2 },
        { name: "720p", value: 3 },
        { name: "480p", value: 4 },
        { name: "其他", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "语言",
      key: "language",
      options: [
        { name: "中文", value: 1 },
        { name: "英文", value: 2 },
        { name: "中英双语", value: 3 },
        { name: "其他", value: 4 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [
    {
      id: 0,
      name: "Peasant",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
    },
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；可以查看排行榜；可以查看其它用户的种子历史；可以删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,

      // ZRPT特有的选择器优化
      title: {
        selector: ["a[href*='details.php?id='][title]:first", "a[href*='details.php?id=']:first"],
      },
      subTitle: {
        ...SchemaMetadata.search!.selectors!.subTitle!,
      },

      // 扩展字段支持
      ext_imdb: {
        selector: ["a span[data-imdbid]:first"],
        data: "imdbid",
        filters: [{ name: "extImdbId" }],
      },
      ext_douban: {
        selector: ["a span[data-doubanid]:first"],
        data: "doubanid",
      },

      // 进度和状态处理 - 使用NexusPHP标准配置
      progress: {
        ...SchemaMetadata.search!.selectors!.progress!,
      },
      status: {
        ...SchemaMetadata.search!.selectors!.status!,
      },

      // 增强的标签系统 - 继承NexusPHP基础标签，添加ZRPT特有标签
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        // ZRPT特有的分类标签
        { name: "纪录片", selector: "a[href*='torrents.php?cat=401']", color: "teal" },
        { name: "自然", selector: "a[href*='torrents.php?cat=402']", color: "green" },
        { name: "科学", selector: "a[href*='torrents.php?cat=403']", color: "blue" },
        { name: "历史", selector: "a[href*='torrents.php?cat=404']", color: "brown" },
        { name: "人文", selector: "a[href*='torrents.php?cat=405']", color: "purple" },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents.php"],
    },
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      // ZRPT特有的等级解析配置
      levelId: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "src",
        filters: [
          (query: string) => {
            const match = query.match(/\/class\/(\d+)\.gif/);
            return match ? parseInt(match[1]) - 1 : 0;
          },
        ],
      },
      levelName: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "title",
        filters: [
          (query: string) => {
            if (query && query.includes(")")) {
              return query.split(")")[1].trim();
            }
            return query || "";
          },
        ],
      },
      // ZRPT特有的字段配置
      bonus: {
        selector: [
          "td.rowhead:contains('魔力值') + td",
          "td.rowhead:contains('积分') + td",
          "li:contains('魔力值')",
          "td:contains('魔力值')",
          "li:contains('积分:')",
          "td:contains('积分:')",
        ],
        filters: [
          (query: string) => {
            query = query.replace(/,/g, "");
            if (/(魔力值|积分).+?([\d.]+)/.test(query)) {
              query = query.match(/(魔力值|积分).+?([\d.]+)/)![2];
              return parseFloat(query);
            } else if (/[\d.]+/.test(query)) {
              return parseFloat(query.match(/[\d.]+/)![0]);
            }
            return query;
          },
        ],
      },
    },
  },
};
