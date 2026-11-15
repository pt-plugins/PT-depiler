import { inject, type InjectionKey, type Ref } from "vue";
import type { ISiteUserConfig } from "@ptd/site";

/**
 * 站点编辑过程中的草稿配置；`valid` 由 Editor 通过 update:formValid 回填，仅用于弹窗内部流程控制，
 * 不写入 metadata（持久化前会整体取 value，多出的 valid 字段不会落库）。
 */
export type TStoredSiteUserConfig = ISiteUserConfig & { valid?: boolean };

/** AddDialog / EditDialog 提供给 Editor 的草稿配置 */
export const STORED_SITE_USER_CONFIG_KEY: InjectionKey<Ref<TStoredSiteUserConfig>> = Symbol("storedSiteUserConfig");

/** 读取草稿配置；该状态只能由 AddDialog / EditDialog 提供，缺失时直接报错以便尽早暴露层级错误 */
export function useStoredSiteUserConfig(): Ref<TStoredSiteUserConfig> {
  const config = inject(STORED_SITE_USER_CONFIG_KEY);
  if (!config) {
    throw new Error("[PT-depiler] storedSiteUserConfig 未提供，Editor 需在 AddDialog / EditDialog 内使用");
  }
  return config;
}
