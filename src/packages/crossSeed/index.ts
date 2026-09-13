/**
 * crossSeed：统一辅种命中源抽象包
 * - types：统一候选模型 + 各类输入/配置类型
 * - template / resolver：双路线下载解析（B=本地适配器，A=模板兜底），跨源通用
 * - compute：pieces_hash（sha1(info.pieces)）计算
 * - nexusphp：NexusPHP /api/pieces-hash 站点直查
 * - local：本地文件树 ↔ 候选种子布局比对算法
 */
export * from "./types";
export * from "./template";
export * from "./compute";
export * from "./resolver";
export * from "./nexusphp";
export * from "./local";
