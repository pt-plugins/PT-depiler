import { type ISiteMetadata } from "../types";
// import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  // ...SchemaMetadata,
  version: 1,
  id: "xauat6",
  name: "溪涧草堂PT",
  description: "以热播电影，热播剧集，热播综艺为主，纪录，动漫，GTV，资料等资源为辅，多方面地为用户提供丰富的资源下载",
  tags: ["教育网", "影视", "综合"],
  collaborator: ["Rhilip"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["uggc://cg.knhng6.rqh.pa/"],

  isDead: true,

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "剧集" },
        { value: 403, name: "纪录" },
        { value: 404, name: "资料" },
        { value: 405, name: "综艺" },
        { value: 406, name: "MV" },
        { value: 407, name: "音乐" },
        { value: 408, name: "动漫" },
        { value: 409, name: "软件" },
        { value: 410, name: "体育" },
        { value: 421, name: "游戏" },
        { value: 424, name: "游戏视频" },
        { value: 422, name: "其他" },
      ],
      cross: { mode: "append" },
    },
  ],
};
