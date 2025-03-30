import { ETorrentStatus, ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, SchemaMetadata } from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "nanyangpt",
  name: "南洋PT",
  description: "网站由西安交通大学学生自主创建与管理，汇集学习资料、纪录片、电影、剧集等各类优质资源",
  tags: ["教育网", "影视", "综合"],

  collaborator: ["Rhilip"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://nanyangpt.com/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "剧集" },
        { value: 403, name: "动漫" },
        { value: 404, name: "综艺" },
        { value: 405, name: "体育" },
        { value: 406, name: "纪录" },
        { value: 407, name: "音乐" },
        { value: 408, name: "学习" },
        { value: 409, name: "软件" },
        { value: 410, name: "游戏" },
        { value: 411, name: "其他" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "显示断种/活种？",
      key: "incldead",
      options: [
        { name: "全部", value: 0 },
        { name: "仅活种", value: 1 },
        { name: "仅断种", value: 2 },
        { name: "待救种", value: 3 },
      ],
      cross: false,
    },
    {
      name: "促销种子？",
      key: "spstate",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "免费", value: 2 },
        { name: "2X", value: 3 },
        { name: "2X免费", value: 4 },
        { name: "50%", value: 5 },
        { name: "2X 50%", value: 6 },
        { name: "30%", value: 7 },
      ],
      cross: false,
    },
    CategoryInclbookmarked,
  ],
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      progress: {
        selector: [
          ".rowfollow[title='Downloading'], .rowfollow[title='Seeding'], .rowfollow[title='Stopped'], .rowfollow[title='Completed']",
        ],
        filters: [(query: string) => (query === "--" ? 0 : parseFloat(query))],
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: [
          ".rowfollow[title='Downloading']",
          ".rowfollow[title='Seeding']",
          ".rowfollow[title='Stopped']",
          ".rowfollow[title='Completed']",
        ],
        case: {
          ".rowfollow[title='Downloading']": ETorrentStatus.downloading,
          ".rowfollow[title='Seeding']": ETorrentStatus.seeding,
          ".rowfollow[title='Stopped']": ETorrentStatus.inactive,
          ".rowfollow[title='Completed']": ETorrentStatus.completed,
        },
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "Excl.", selector: "td.embedded > a[title] > b > font[color='red']" },
      ],
    },
  },
};
