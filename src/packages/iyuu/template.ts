/**
 * IYUU download_page 模板渲染（A 路线：IYUU 模板兜底）
 * 变量语义见 docs/iyuu-integration-plan.md §4（源码对应 DriverPthome::parseReplace 等）
 */
import type { IYUUDownloadCredentials } from "./types";

/**
 * 模板变量 → 凭据字段映射（仅静态可配置凭据）。
 * 注意：{sign}（hdsky）、{cuhash}（hdcity）等需要详情页动态提取的变量**不在模板侧实现**
 * —— 此类站点本地站点适配器已覆盖（B 路线），模板兜底遇到即标记 unsupported 跳过。
 */
const TEMPLATE_VAR_TO_CRED_KEY: Record<string, keyof IYUUDownloadCredentials> = {
  passkey: "passkey",
  uid: "uid",
  hash: "downHash",
  downhash: "downHash",
  downHash: "downHash",
  authkey: "authkey",
  torrent_pass: "torrentPass",
  torrent_key: "torrentKey",
  rsskey: "rsskey",
};

/** 需要动态获取、模板侧不实现的变量（出现即该站 A 路线不可用） */
const UNSUPPORTED_DYNAMIC_VARS = ["sign", "cuhash"] as const;

/**
 * 渲染 download_page 模板。
 * - {} 与 {id} 替换为 torrent_id（必填，无缺失语义）
 * - 静态凭据变量：已提供则替换；缺失则保留原 token 并记入 missing（调用方应跳过该站）
 * - 动态变量（sign/cuhash）：不渲染，记入 unsupported（调用方应跳过该站）
 */
export function renderDownloadPage(
  template: string,
  torrentId: number,
  creds: IYUUDownloadCredentials = {},
): { url: string; missing: string[]; unsupported: string[] } {
  let url = template.replace(/\{\}/g, String(torrentId)).replace(/\{id\}/g, String(torrentId));
  const missing: string[] = [];
  const unsupported: string[] = [];

  for (const rawVar of UNSUPPORTED_DYNAMIC_VARS) {
    if (url.includes(`{${rawVar}}`)) {
      unsupported.push(rawVar);
    }
  }

  for (const [rawVar, credKey] of Object.entries(TEMPLATE_VAR_TO_CRED_KEY)) {
    const token = `{${rawVar}}`;
    if (!url.includes(token)) continue;

    const value = creds[credKey];
    if (value === undefined || value === "") {
      missing.push(token);
    } else {
      url = url.replaceAll(token, String(value));
    }
  }

  return { url, missing, unsupported };
}

/** 收集模板中出现的静态凭据变量（用于设置页引导补配置；不含动态变量） */
export function collectTemplateVars(template: string): string[] {
  const vars: string[] = [];
  for (const rawVar of Object.keys(TEMPLATE_VAR_TO_CRED_KEY)) {
    if (template.includes(`{${rawVar}}`)) {
      vars.push(rawVar);
    }
  }
  return vars;
}

/** 该模板是否包含动态变量（sign/cuhash），即 A 路线不可用 */
export function hasUnsupportedDynamicVars(template: string): boolean {
  return UNSUPPORTED_DYNAMIC_VARS.some((rawVar) => template.includes(`{${rawVar}}`));
}

/** 由 IYUU 站点条目标线程协议前缀（is_https: 0=http、1=https、2=http(s)） */
export function iyuuProtocol(iyuuSite: { is_https: 0 | 1 | 2 }): "http://" | "https://" {
  return iyuuSite.is_https === 0 ? "http://" : "https://";
}
