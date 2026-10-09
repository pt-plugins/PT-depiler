/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/luckpt.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/luckpt.json
 * @PTMDefinitions https://github.com/JustLookAtNow/pt_mate/blob/master/assets/sites/luckpt.json
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "luckpt",
  name: "LuckPT",
  description: "汇聚多元精彩，启程旋律之旅。",
  tags: ["影视", "综合", "音乐"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.luckpt.de/"],

  /**
   * 这一站的列表皮肤不是经典 NexusPHP：表头那几列的标记从 `img.size` / `img.seeders` …
   * 挪成了 `img.torrent-header-icon[alt="size"]`，而 NexusPHP 的「按表头猜列号」
   * （`guessSearchFieldIndexConfig`，只认 class）对这套写法一列都猜不中 ——
   * 于是 size / seeders / leechers / completed / comments / time 六列**没有被指派选择器**，
   * 界面上就是「大小 0.00 B、四个数字列空白、发布于 `-`」（不是解析错，是那几列没读）。
   * 这一版每个数据格都带 `data-col`，直接按它点名，不再依赖表头顺序。
   *
   * 依据：PT-Assistant 仓库 9cd693c（作者以真页源码跑通 getSite → transformSearchPage 链路），
   * 本仓库尚未在真实站点上复核；站点改版时优先看 `td[data-col]`。
   */
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      size: { selector: ['td[data-col="size"]'] },
      seeders: { selector: ['td[data-col="seeders"]'] },
      leechers: { selector: ['td[data-col="leechers"]'] },
      completed: { selector: ['td[data-col="snatched"]'] },
      comments: { selector: ['td[data-col="comments"]'] },
      time: {
        ...SchemaMetadata.search!.selectors!.time!,
        selector: ['td[data-col="time"]'],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "100GB",
      seedingBonus: 120000,
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； " +
        '可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "200GB",
      seedingBonus: 320000,
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "500GB",
      seedingBonus: 600000,
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1000GB",
      seedingBonus: 1000000,
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1.6TB",
      seedingBonus: 1800000,
      ratio: 3.05,
      isKept: true,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "2.4TB",
      seedingBonus: 2600000,
      ratio: 3.55,
      isKept: true,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "3.0TB",
      seedingBonus: 3800000,
      ratio: 4.05,
      isKept: true,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "4.9TB",
      seedingBonus: 5000000,
      ratio: 4.55,
      isKept: true,
      privilege: "得到十个邀请名额。",
    },
  ],
};
