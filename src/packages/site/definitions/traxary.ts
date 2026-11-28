/**
 * Traxary 是 UNIT3D fork（traxary 平台，Yata-Dash 视作独立 type 但可按 UNIT3D 通用规则适配）。
 *
 * ⚠️ 站点已死亡（2026-11-28 核实）：beta.traxary.com 在 DNS 上已 NXDOMAIN，
 *   traxary.com 亦无可用 A/AAAA 记录、HTTPS 无法解析，故标记 isDead。
 *   此前的状态（2026-10-25）：GET https://beta.traxary.com/ → 302 到 /login（"Login - traxary"），
 *   属 BETA/TESTING 阶段；运营方曾请求禁止抓取（Yata scrape.disable_scraping = true），
 *   同平台另有一站 PeerGarden（见 definitions/peergarden.ts）。
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "traxary",
  name: "Traxary",
  aka: ["TRX"],
  description: "Traxary 是一个 UNIT3D fork（traxary 平台）的私有 PT 站（站点已关闭）",

  type: "private",
  schema: "Unit3D",

  urls: ["https://beta.traxary.com/"],

  // refs: 2026-11-28 实测 beta.traxary.com 无法解析（NXDOMAIN），traxary.com 无 A/AAAA 记录
  isDead: true, // 2026-11-28
};
