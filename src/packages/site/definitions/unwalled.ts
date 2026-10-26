/**
 * Unwalled 是 UNIT3D 架构的私有站（2026-10-25 核实：GET https://unwalled.cc/ → 302 到 /login，
 * 登录页标题 "Login - Unwalled"）。
 *
 * ⚠️ 适配状态：Yata-Dash（2026-07-18，staff approved）确认其 type=unit3d，但 **Jackett 无该站定义**，
 * 也没有公开的分类 id / 等级 / API 资料 —— 因此本定义只展开 Unit3D 通用 SchemaMetadata
 * （搜索走站点 HTML 列表页、用户信息走默认资料页抓取，均依赖浏览器登录态），
 * 分类筛选与 levelRequirements 待账号实测站点真实表单后补充，严禁凭空编造枚举值。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "unwalled",
  name: "Unwalled",
  aka: ["UNW"],
  description: "Unwalled 是一个 UNIT3D 架构的私有 PT 站（适配待验证：搜索为通用 Unit3D 列表页规则）",

  type: "private",
  schema: "Unit3D",

  urls: ["https://unwalled.cc/"],
};
