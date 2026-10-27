/**
 * Traxary 是 UNIT3D fork（traxary 平台，Yata-Dash 视作独立 type 但可按 UNIT3D 通用规则适配）。
 * 2026-10-25 核实：GET https://beta.traxary.com/ → 302 到 /login（"Login - traxary"）。
 *
 * ⚠️ 适配状态：
 * - Yata-Dash 明确标注这是 **BETA/TESTING 定义**：URL 指向 beta.traxary.com，
 *   生产域名确定后需更换；该站运营方在同一套代码上运行多个站点（PeerGarden 同平台）。
 * - 未经 Jackett 验证，分类 id / 等级阶梯（Yata notes：Groups 页尚未采集）均无公开资料，
 *   因此只展开 Unit3D 通用 SchemaMetadata，分类筛选与 levelRequirements 待实测后补充。
 * - 运营方请求该站禁用抓取（Yata scrape.disable_scraping = true）。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "traxary",
  name: "Traxary",
  aka: ["TRX"],
  description: "Traxary 是一个 UNIT3D fork（traxary 平台）的私有 PT 站，目前为 Beta 阶段（适配待验证）",

  type: "private",
  schema: "Unit3D",

  urls: ["https://beta.traxary.com/"],
};
