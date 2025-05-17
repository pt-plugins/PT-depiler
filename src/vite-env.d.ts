/// <reference types="vite/client" />

// 在 vite.config.ts 中定义的常量，这些常量一般都是编译中产生的
declare const __EXT_VERSION__: string;
declare const __GIT_VERSION__: { short: string; long: string; date: number; count: number; branch: string };
declare const __BUILD_TIME__: string;
declare const __RESOURCE_SITE_ICONS__: string[];
