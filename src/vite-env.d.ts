/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_AVISTAZ_USER_INFO_FETCHING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 在 vite.config.ts 中定义的常量，这些常量一般都是编译中产生的
declare const __BROWSER__: "chrome" | "firefox";
declare const __EXT_VERSION__: string;
declare const __GIT_VERSION__: { short: string; long: string; date: number; count: number; branch: string };
declare const __BUILD_TIME__: string;
declare const __RESOURCE_SITE_ICONS__: string[];

/**
 * 构建期生成的站点定义轻量索引（vite/plugin/generateSiteIndex.ts）。
 * 实际内容由插件在 `load()` 里产出，这里只声明类型，让 vue-tsc / IDE 能解析。
 */
declare module "virtual:site-metadata-index" {
  import type { TSiteMetadataIndex } from "@ptd/site/types/metadataIndex";

  export const siteMetadataIndex: TSiteMetadataIndex;
}
