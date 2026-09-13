/**
 * crossSeed：统一辅种命中源抽象包（含原 @ptd/iyuu 全部内容）
 * - types：统一候选模型 + 各类输入/配置类型
 * - template / resolver：双路线下载解析（B=本地适配器，A=模板兜底），跨源通用
 * - compute：pieces_hash（sha1(info.pieces)）计算
 * - nexusphp：NexusPHP /api/pieces-hash 站点直查
 * - local：本地文件树 ↔ 候选种子布局比对算法（cross-seed decide 模型）
 * - siteMapping / iyuuCenter：IYUU 辅种中心（站名映射表 + 中心协议类型，三源之一）
 */
export * from "./types";
export * from "./template";
export * from "./compute";
export * from "./resolver";
export * from "./nexusphp";
export * from "./local";
export * from "./siteMapping";
export * from "./iyuuCenter";
