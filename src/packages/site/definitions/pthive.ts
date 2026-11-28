/**
 * PTHive（https://pthive.site/），NexusPHP（xiaomlove/nexusphp 1.9 系 + 自定义 TCloud 皮肤）。
 *
 * 2026-11-28 适配时站点仍在公开测试，未登录只能访问 login / faq / rules / useragreement 页，
 * torrents.php、userdetails.php、upload.php 等一律要求登录，因此本文件的可信度分两层：
 *
 * 已核实（来自未登录可访问页面）：
 * - 站点名称、域名、NexusPHP 架构、开放注册；
 * - rules.php 使用蜂系等级称谓：Guard Bee（封存账号后不被删除）、Bee Sergeant（账号永久保留）、
 *   Bee General、Hive Keeper；
 * - faq.php 的提升/降级阈值与 schemas/NexusPHP.ts 的 xiaomloveDefaultUserLevelRequirements 完全一致
 *   （50GB/1.05、120GB/1.55、300GB/2.05、500GB/2.55、750GB/3.05、1TB/3.55、1.5TB/4.05、3TB/4.55）。
 *
 * 待登录核对（本次按 NexusPHP 默认结构填）：
 * - 分类表使用 NexusPHP 1.9 默认分类（401–409）；站点若改过 cat id，搜索分类会失配；
 * - 种子列表 / 详情 / 用户信息选择器全部沿用 NexusPHP schema 默认值，TCloud 皮肤若改过列表结构需再对齐。
 */
import { type ISiteMetadata } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  xiaomloveDefaultUserLevelRequirements,
} from "../schemas/NexusPHP";

/**
 * rules.php 用蜂系称呼指代站内等级，与 NexusPHP 原版等级的对应关系：
 * - Guard Bee：rules 写「Guard Bee 及以上等级用户封存账号后不会被删除」，与 faq 的 Elite User 同级语义；
 * - Bee Sergeant：rules 写「Bee Sergeant 及以上等级用户会永远保留」，与 faq 的 Veteran User 同级语义；
 * - Bee General / Hive Keeper：来自退役待遇一节「成为 Bee General（满足 Bee General 及以上则成为 Hive Keeper）」，
 *   据此按 Ultimate User / Nexus Master 的位置推断，属未登录核实的推断值。
 */
const beeLevelNames: Record<string, string> = {
  "Elite User": "Guard Bee",
  "Veteran User": "Bee Sergeant",
  "Ultimate User": "Bee General",
  "Nexus Master": "Hive Keeper",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "pthive",
  name: "PT Hive",
  description: "PT Hive 是一个以音乐与音乐演出视频为主打的私有 PT 站（NexusPHP）。",
  tags: ["音乐", "影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pthive.site/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影 Movies", value: 401 },
        { name: "剧集 TV Series", value: 402 },
        { name: "综艺 TV Shows", value: 403 },
        { name: "纪录片 Documentaries", value: 404 },
        { name: "动漫 Animations", value: 405 },
        { name: "音乐MV Music Videos", value: 406 },
        { name: "体育 Sports", value: 407 },
        { name: "无损音乐 HQ Audio", value: 408 },
        { name: "其他 Misc", value: 409 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  // 阈值与站点 faq 一致，只把 rules.php 的蜂系称呼设为展示名，原版名保留为别名以便两种叫法都能匹配 levelId
  levelRequirements: xiaomloveDefaultUserLevelRequirements.map((level) => {
    const beeName = beeLevelNames[level.name];
    return beeName ? { ...level, name: beeName, nameAka: [level.name] } : level;
  }),
};
