import type { ISiteMetadata } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  xiaomloveDefaultUserLevelRequirements,
} from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "ptfans",
  name: "PTFans",
  description: "追随你的激情，共享PT乐趣！",
  tags: ["影视", "综合", "成人"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cgsnaf.pp/", "uggcf://phfng.jva/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "种子区", value: "/torrents.php" },
        { name: "9KG区", value: "/special.php" },
      ],
    },
    {
      name: "分类（种子区）",
      key: "cat_normal",
      notes: "请先设置搜索入口为“种子区”！",
      options: [
        { name: "Movies(电影)", value: 401 },
        { name: "TV Series(电视剧)", value: 404 },
        { name: "TV Shows(综艺)", value: 405 },
        { name: "Documentaries(纪录片)", value: 406 },
        { name: "Sport(体育、竞技、武术及相关)", value: 403 },
        { name: "Games(游戏及相关)", value: 409 },
        { name: "Music(音乐、专辑、MV、演唱会)", value: 407 },
        { name: "Art(曲艺、相声、小品、戏曲、舞蹈、歌剧、评书等)", value: 408 },
        { name: "Science(科学、知识、技能)", value: 410 },
        { name: "School(应试、考级、职称、初中以上教育)", value: 411 },
        { name: "Book(书籍、杂志、报刊、有声书)", value: 412 },
        { name: "Code(IT技术、建模、编程、信息技术、大数据、人工智能）", value: 413 },
        { name: "Animate(3D动画、2.5次元)", value: 414 },
        { name: "ACGN(二次元、漫画)", value: 415 },
        { name: "Baby(婴幼、儿童、早教、小学及相关)", value: 416 },
        { name: "Resource(素材、数据、图片、文档、模板)", value: 417 },
        { name: "Software(软件、系统、 程序、APP等)", value: 418 },
        { name: "Other(其它，确认上边分类无)", value: 419 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类（9KG区）",
      key: "cat_9kg",
      options: [
        { name: "步兵(步兵/无码)", value: 420 },
        { name: "骑兵(骑兵/有码)", value: 421 },
        { name: "三级(三级片、限制级电影)", value: 422 },
        { name: "H游(游戏及相关)", value: 424 },
        { name: "H漫(动漫、漫画)", value: 423 },
        { name: "H书(书籍、有声书)", value: 425 },
        { name: "H图(写真、图片、私拍、短视频）", value: 426 },
        { name: "H音(ASMR、音频、音乐)", value: 427 },
        { name: "H综(综艺、综合、剪辑、其他等)", value: 428 },
        { name: "H同(男同、女同、人妖)", value: 429 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "来源",
      key: "medium",
      options: [
        { name: "Other", value: 8 },
        { name: "Blu-ray", value: 6 },
        { name: "Web-DL", value: 5 },
        { name: "MiniBD", value: 4 },
        { name: "Encode", value: 7 },
        { name: "Remux", value: 3 },
        { name: "DVD", value: 2 },
        { name: "CD", value: 1 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264(x264/AVC)", value: 1 },
        { name: "H.265(x265/HEVC)", value: 2 },
        { name: "Bluray(VC-1)", value: 3 },
        { name: "Bluray(AVC)", value: 4 },
        { name: "Bluray(HEVC)", value: 5 },
        { name: "MPEG-2", value: 6 },
        { name: "Xvid", value: 7 },
        { name: "AV1", value: 8 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "清晰度",
      key: "standard",
      options: [
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "4K", value: 5 },
        { name: "8K", value: 6 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      tags: [...SchemaMetadata.search!.selectors!.tags!, { name: "H&R", selector: "img.hitandrun" }],
      // 虽然提供了 imdb, douban 的评分，但是没有 id 或者 url
    },
  },

  searchEntry: {
    area_normal: { name: "种子", requestConfig: { url: "/torrents.php" } },
    area_9kg: { name: "9KG", enabled: false, requestConfig: { url: "/special.php" } },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      hnrUnsatisfied: {
        selector: ['a[href*="myhr.php?userid="]'],
        filters: [(query: string) => parseInt(query.split("/")?.[1] ?? "0")],
      },
      hnrPreWarning: {
        selector: ['a[href*="myhr.php?userid="]'],
        filters: [(query: string) => parseInt(query.split("/")?.[0] ?? "0")],
      },
    },
  },

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
