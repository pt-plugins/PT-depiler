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
      // ⚠️ 分类维度暂时不写死。
      //
      // 好学已迁到 FluxTorrent 架构，站型是「综合站带教育」，而分类表来自
      // **站型包模板展开**（`site_type_packs.categories`），不是一张固定表：
      // general（综合站）包是 10 个顶层类（电影/电视剧/音乐/游戏/软件/动漫/
      // 纪录片/电子书/体育/综艺），education（教育）包另有 7 个
      // （学前教育/小学/初中/职高/高中/教育影音/纪录片），两者 id 会撞。
      // 兼容层的 `category` 参数收的是**站内 id**，写死错一个就筛不到东西。
      // 拿到站点实际分类表（`GET /api/v1/open/categories`，需 read 权限 Token）
      // 后再补这里。
      name: "类型",
      key: "category",
      options: [],
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
