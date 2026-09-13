/**
 * IYUU 辅种中心接入包（纯函数模块，P0）
 * - siteMapping：IYUU 站名 ↔ 本地站点 id 映射（104 站全量）
 * - template：download_page 模板渲染与缺失变量收集（A 路线兜底）
 * - resolver：双路线解析（B=本地适配器优先，A=模板兜底）
 */
export * from "./types";
export * from "./siteMapping";
export * from "./template";
export * from "./resolver";
