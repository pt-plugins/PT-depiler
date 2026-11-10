/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hxpt.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/hxpt.json
 * @PTMDefinitions https://github.com/JustLookAtNow/pt_mate/blob/master/assets/sites/hxpt.json
 *
 * 2026-11 起站点引擎由 NexusPHP 整体迁移到 FluxTorrent（Rust + Next.js），
 * 旧的 .php 页面与刮削选择器全部作废；改为走 FluxTorrent 兼容层的只读 JSON
 * （`/api/v1/compat/nexusphp/*`），鉴权用开放 API Token。
 *
 * 分类 id 取自 FluxTorrent 侧 `categories` 表的站内 id（1-7），
 * 与旧站 NP 分类号（401-407）是两套编号 —— 兼容层的 `category` 参数收的是站内 id。
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
      name: "类型",
      key: "category",
      options: [
        { name: "学前教育", value: 1 },
        { name: "小学", value: 2 },
        { name: "初中", value: 3 },
        { name: "职高", value: 4 },
        { name: "高中", value: 5 },
        { name: "教育影音", value: 6 },
        { name: "纪录片", value: 7 },
      ],
      cross: false,
    },
    {
      name: "促销",
      key: "promo",
      options: [
        { name: "免费", value: "free" },
        { name: "2X免费", value: "x2free" },
        { name: "50%", value: "half" },
        { name: "2X 50%", value: "x2half" },
        { name: "2X", value: "x2" },
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
