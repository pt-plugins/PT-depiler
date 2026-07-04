/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/cdfile.yml
 */
import { type ISiteMetadata } from "../types";
// import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";
import { xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  // ...SchemaMetadata,
  version: 1,
  id: "cdfile",
  name: "CD File",
  description: "专注于Blu-Ray、DVD、CD等高品质光盘镜像资源，致力于打造光盘档案室",
  collaborator: ["koal"],
  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.cdfile.org/"],

  // refs: https://web.archive.org/web/20260428150553/https://pt.cdfile.org/
  // CD File PT站 我们已经关闭停止运营，后续不再开放
  isDead: true,

  /*
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies/电影", value: 401 },
        { name: "Music Videos/MV", value: 406 },
        { name: "TV Series/电视剧", value: 402 },
        { name: "Music/音轨", value: 408 },
        { name: "Animations/动漫", value: 405 },
        { name: "TV Shows/综艺", value: 403 },
        { name: "Sports/体育", value: 407 },
        { name: "Documentaries/纪录片", value: 404 },
        { name: "Others/其他", value: 409 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

   */

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
