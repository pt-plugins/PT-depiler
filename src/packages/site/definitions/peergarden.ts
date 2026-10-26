/**
 * PeerGarden 是 traxary 平台（UNIT3D fork）上的第二个站点，与 Traxary 同代码同运营方
 * （Yata-Dash 视作独立 type，可按 UNIT3D 通用规则适配）。
 * 2026-10-25 核实：GET https://peergarden.org/ → 302 到 /login（"Login - PeerGarden"）。
 *
 * ⚠️ 适配状态：未经 Jackett 验证；Yata-Dash（2026-09-04，staff approved）确认其 type=traxary
 * （可视作 UNIT3D），站点规则：min_ratio 0.4 / min_seed_days 2 / 最大登录间隔 90 天，
 * 且运营方请求禁用抓取（scrape.disable_scraping = true）。
 * 分类 id / 等级阶梯（Yata 称 PeerGarden 的阶梯已完整，存于平台 type 定义）待实测后补充，
 * 因此只展开 Unit3D 通用 SchemaMetadata。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "peergarden",
  name: "PeerGarden",
  aka: ["PG"],
  description: "PeerGarden 是 traxary 平台（UNIT3D fork）的私有 PT 站（适配待验证）",

  type: "private",
  schema: "Unit3D",

  urls: ["https://peergarden.org/"],
};
