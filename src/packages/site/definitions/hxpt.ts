/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hxpt.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/hxpt.json
 * @PTMDefinitions https://github.com/JustLookAtNow/pt_mate/blob/master/assets/sites/hxpt.json
 *
 * 2026-11 起站点引擎由 NexusPHP 整体迁移到 FluxTorrent（Rust + Next.js），
 * 旧的 .php 页面与刮削选择器全部作废；改为走 FluxTorrent 兼容层的只读 JSON
 * （`/api/v1/compat/nexusphp/*`），鉴权用开放 API Token。
 *
 * 分类 id 取自 FluxTorrent 侧 `categories` 表的**站内 id**（1-13 综合类 +
 * 101-107 教育类），与旧站 NP 分类号（401-407）是两套编号 —— 兼容层的
 * `category` 参数收的是站内 id。
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/FluxTorrent.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 2,

  id: "hxpt",
  name: "好学",
  aka: ["HXPT"],
  description: "好学者如春苗，日有所长；心向学，梦有光！",
  tags: ["学习"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "FluxTorrent",

  urls: ["uggcf://jjj.ukcg.bet/"],

  category: [
    {
      // 分类 id = 好学线上 `categories` 表的**站内 id**（2026-11-10 从生产库核对）。
      //
      // 分类表是**站型包模板展开**的，好学现为 general（综合站）站型：
      //   1-13   综合站 13 类（电影/电视剧/短剧/音乐/游戏/软件/动漫/纪录片/
      //                     电子书/有声书/体育/综艺/教育资源）
      //   101-107 教育 7 类（学前教育/小学/初中/职高/高中/教育影音/大学）
      // 教育类是 101+ 段而不是 1-7 —— 通用分类已占低位 id，两套不撞。
      // 兼容层的 `category` 参数收站内 id（**不是** NP legacy_id：好学的 NP 号
      // 401-406 只挂在教育类上，且与「大学」并不一一对应）。
      //
      // 当前各分类的实际存量（站点在用的主要是教育类 + 纪录片/动漫/综艺，
      // 电影/短剧/音乐/游戏/软件/电子书/有声书/体育/教育资源 目前为空）：
      //   教育影音 18081 · 小学 1684 · 纪录片 1540 · 初中 1075 · 高中 694
      //   · 大学 155 · 学前教育 149 · 动漫 302 · 综艺 42 · 职高 30 · 电视剧 1
      name: "类型",
      key: "category",
      options: [
        { name: "电影", value: 1 },
        { name: "电视剧", value: 2 },
        { name: "短剧", value: 3 },
        { name: "音乐", value: 4 },
        { name: "游戏", value: 5 },
        { name: "软件", value: 6 },
        { name: "动漫", value: 7 },
        { name: "纪录片", value: 8 },
        { name: "电子书", value: 9 },
        { name: "有声书", value: 10 },
        { name: "体育", value: 11 },
        { name: "综艺", value: 12 },
        { name: "教育资源", value: 13 },
        { name: "学前教育", value: 101 },
        { name: "小学", value: 102 },
        { name: "初中", value: 103 },
        { name: "职高", value: 104 },
        { name: "高中", value: 105 },
        { name: "教育影音", value: 106 },
        { name: "大学", value: 107 },
      ],
      cross: false,
    },
    {
      // 兼容层的 promo 是「族」语义，不是档位精确匹配：
      //   free 族 = {free, x2free}      x2 族 = {x2, x2free, x2half}
      //   half 族 = {half, x2half}      x2free/x2half 是两族交集的合成档
      // 所以「免费」会连 2X 免费一起端出来，「2X」会连 2X 免费 / 2X 50% 一起端出来。
      name: "促销",
      key: "promo",
      options: [
        { name: "免费（含 2X 免费）", value: "free" },
        { name: "2X 免费", value: "x2free" },
        { name: "50%（含 2X 50%）", value: "half" },
        { name: "2X 50%", value: "x2half" },
        { name: "2X（含 2X 免费 / 2X 50%）", value: "x2" },
        { name: "30%", value: "p30" },
        { name: "任意优惠", value: "any" },
        { name: "无优惠", value: "none" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "显示断种/活种？",
      key: "alive",
      options: [
        { name: "全部", value: 0 },
        { name: "仅活种", value: 1 },
        { name: "仅断种", value: 2 },
      ],
      cross: false,
    },
    {
      // 兼容层的 official 只认 1 / 0（0 = 仅非官种），「全部」必须留空串才不过滤
      name: "仅官种？",
      key: "official",
      options: [
        { name: "全部", value: "" },
        { name: "仅官种", value: "1" },
        { name: "仅非官种", value: "0" },
      ],
      cross: false,
    },
    {
      name: "排序",
      key: "sort",
      options: [
        { name: "最新发布", value: "created" },
        { name: "最新发布（升序）", value: "created_asc" },
        { name: "做种数", value: "seeders" },
        { name: "做种数（升序）", value: "seeders_asc" },
        { name: "大小", value: "size" },
        { name: "大小（升序）", value: "size_asc" },
        { name: "完成数", value: "completed" },
        { name: "完成数（升序）", value: "completed_asc" },
      ],
      cross: false,
    },
  ],

  // 等级梯度待确认：迁移后站点的用户组名称与门槛以站点配置为准，
  // 接口返回的 class / class_name 已是权威值，这里不写死一份可能对不上的梯度。
};
