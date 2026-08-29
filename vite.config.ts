import fs from "node:fs";
import process from "node:process";
import path from "node:path";

// Vite And it's plugins
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import VueDevTools from "vite-plugin-vue-devtools";
import webExtension from "vite-plugin-web-extension";

// @ts-ignore
import { vitePluginGenerateWebextLocales } from "./vite/plugin/generateWebextLocales.ts";

import git from "git-rev-sync";
import pkg from "./package.json";

function base_path(_path = "") {
  return path.resolve(__dirname, _path);
}

const target = process.env.TARGET || "chrome";
const permissions = [
  "activeTab",
  "alarms",
  "clipboardWrite",
  "contextMenus",
  "cookies",
  "downloads",
  "declarativeNetRequest",
  "storage",
  "unlimitedStorage",
  "notifications",
];

const optionalPermissions = ["nativeMessaging"];

// @ts-ignore
const git_count = git.count("HEAD");
const base_version = `${pkg.version}.${git_count}`;
const commit_version = `${base_version}+${git.short(__dirname)}`;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2023",
    outDir: `dist-${target}`,
    emptyOutDir: true,
  },
  // Vuetify 4: 强制 Vite 预打包 overlay 相关模块，避免 dev 模式下 useStack 被拆分为
  // 两份实例导致 dialog 内的 menu/select 等浮层 z-index 计算失效（官方 Upgrade Guide 建议）。
  // 仅影响 dev 模式；生产构建不受影响。
  optimizeDeps: {
    include: [
      "vuetify/components/VOverlay",
      "vuetify/components/VDialog",
      "vuetify/components/VMenu",
      "vuetify/components/VSelect",
      "vuetify/components/VTooltip",
    ],
  },
  plugins: [
    vitePluginGenerateWebextLocales(),
    nodePolyfills({
      include: ["buffer", "path"],
      globals: {
        Buffer: true,
      },
    }),
    VueDevTools({
      launchEditor: fs.existsSync(base_path("./.idea")) ? "webstorm" : "vscode",
    }),
    vue(),
    vuetify({
      styles: { configFile: "./src/styles/vuetify/settings.scss" },
    }),
    webExtension({
      browser: target,
      disableAutoLaunch: true,
      skipManifestValidation: true,
      manifest: () => ({
        manifest_version: 3,
        "{{chrome}}.minimum_chrome_version": "120",

        version: base_version,
        "{{chrome}}.version_name": commit_version,

        name: "__MSG_extName__",
        description: "__MSG_extDesc__",
        default_locale: "en",
        homepage_url: "https://github.com/pt-plugins/PT-depiler",
        icons: {
          "16": "icons/logo/16.png",
          "19": "icons/logo/19.png",
          "64": "icons/logo/64.png",
          "128": "icons/logo/128.png",
        },

        action: {
          default_icon: {
            "16": "icons/logo/16.png",
            "19": "icons/logo/19.png",
            "64": "icons/logo/64.png",
            "128": "icons/logo/128.png",
          },
          default_title: "__MSG_extName__",
        },

        "{{chrome}}.background": {
          service_worker: "src/entries/background/main.ts",
        },

        // 在 Firefox 中，background 不能使用 service_worker
        "{{firefox}}.background": {
          scripts: ["src/entries/background/ff_main.ts"],
        },

        omnibox: {
          keyword: "ptd",
        },

        options_ui: {
          page: "src/entries/options/index.html",
          open_in_tab: true,
        },

        content_scripts: [
          {
            matches: ["*://*/*"],
            exclude_matches: ["*://*/*.xml", "*://*/*.xml?*"],
            js: ["src/entries/content-script/index.ts"],
          },
        ],

        // 在 Chrome 中需要多注册一个 offscreen 权限
        "{{chrome}}.permissions": [...permissions, "offscreen"],
        "{{chrome}}.optional_permissions": optionalPermissions,
        "{{firefox}}.permissions": permissions,
        "{{firefox}}.optional_permissions": optionalPermissions,
        host_permissions: ["*://*/*"],

        "{{firefox}}.browser_specific_settings": {
          gecko: {
            id: "ptdepiler.ptplugins@gmail.com",
            strict_min_version: "121.0",
          },
        },
        "{{firefox}}.content_security_policy": {
          extension_pages: "script-src 'self';",
        },

        web_accessible_resources: [
          {
            resources: ["icons/*", "lib/*", "pt-depiler.css", "pt-depiler-components.css"],
            matches: ["*://*/*"],
          },
          // content script 的按需主逻辑（assets/cs-app.js）及其共享 chunk 依赖链，
          // 由轻量引导在匹配站点时于页面上下文动态 import 加载（见 issue #1467）。
          // 使用通配以避免依赖拓扑变化后遗漏新 chunk 导致运行时加载失败。
          {
            resources: ["assets/*", "vendor/*"],
            matches: ["*://*/*"],
          },
        ],
      }),
      // vite-plugin-web-extension 会在构造中，将js中引入的css文件自动添加到 manifest 中的 content_scripts 中，我们不需要这种默认行为
      transformManifest: (manifest) => {
        manifest.content_scripts.forEach((script: { css?: any }) => {
          if (script.css) {
            delete script.css;
          }
        });
        return manifest;
      },
      additionalInputs: target == "chrome" ? ["src/entries/offscreen/offscreen.html"] : undefined,
      watchFilePaths: ["package.json"],
      htmlViteConfig: {
        plugins: [
          {
            name: "cs-app-entry",
            config(config) {
              // content script 的重逻辑（Vue/Vuetify/站点包）挂到多页 ESM 构建中作为额外入口，
              // 产物 assets/cs-app.js 由轻量引导在匹配站点时通过 chrome.runtime.getURL 动态加载，
              // 并直接复用 options 构建已拆分的 vendor chunk（见 issue #1467）。
              config.build ??= {};
              config.build.rollupOptions ??= {};
              config.build.rollupOptions.input ??= {};
              (config.build.rollupOptions.input as Record<string, string>)["cs-app"] = base_path(
                "src/entries/content-script/app/init.ts",
              );
              // 该入口仅由 content script 引导在运行时动态 import（构建期无静态消费者），
              // 必须保留入口导出签名，否则 mountApp 会被 rollup 树摇成纯副作用壳
              config.build.rollupOptions.preserveEntrySignatures = "strict";
            },
          },
          {
            name: "sort-asserts",
            config(config) {
              config.build!.rollupOptions!.output = {
                ...config.build?.rollupOptions!.output,
                chunkFileNames: (chunkInfo) => {
                  // 特殊情况下 facadeModuleId 可能为 null，这时我们使用 moduleIds 的最后一个作为 chunkName
                  const chunkName = chunkInfo.facadeModuleId || chunkInfo.moduleIds.slice(-1)[0];

                  // 对 src/entries 下的 Index.vue 文件进行特殊处理（以防止构造产物无法区分）
                  if (/src[\\/]entries[\\/].+?Index\.vue$/.test(chunkName)) {
                    const indexEntryName = chunkName.match(/.+[\\/](.+?)[\\/]Index\.vue/)?.[1];
                    return `assets/${indexEntryName}-[hash].js`;
                  }

                  // 我们自己的 @pkg 下分包，使用 vendor/packages 前缀
                  if (
                    /[\\/]src[\\/]packages[\\/](downloader|backupServer|site|social|mediaServer).+\.ts/.test(chunkName)
                  ) {
                    const name = chunkName.replace(/^.+?[\\/]src[\\/]/, "").replace(/\..+?$/, "");
                    return `vendor/${name}-[hash].js`;
                  }

                  // 其他 node_modules 分包，直接使用 vendor/{deps} 前缀
                  if (/node_modules[\\/].+?[\\/]/.test(chunkName)) {
                    const pkgName = chunkName.match(/.+[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                    return `vendor/${pkgName}/[name]-[hash].js`;
                  }

                  return "assets/[name]-[hash].js"; // vite default
                },
                entryFileNames: (chunkInfo) => {
                  // cs-app 的加载地址写死在 content script 引导里，必须使用稳定文件名（不带 hash）
                  if (chunkInfo.name === "cs-app") {
                    return "assets/cs-app.js";
                  }
                  return "assets/[name]-[hash].js"; // vite default
                },
                assetFileNames: (assetInfo) => {
                  const assetName = assetInfo.names[0] || "";

                  // 将 css 文件放到 assets/css 目录
                  if (assetName.endsWith(".css")) {
                    // cs-app（content script 按需主逻辑）依赖的两份样式：vuetify 基础组件样式与
                    // cs-app 入口组件样式。动态 import 不会自动加载 css 分片，它们由 app/init.ts 在
                    // shadow DOM 中按固定地址 link，必须输出到根目录且使用稳定文件名
                    if (assetName === "vuetify.css") {
                      return "pt-depiler.css";
                    }
                    if (assetName === "cs-app.css") {
                      return "pt-depiler-components.css";
                    }
                    return "assets/css/[name]-[hash][extname]";
                  }

                  return "assets/[name]-[hash][extname]"; // vite default
                },
              };

              return config;
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": base_path("./src"),
      "@": base_path("./src/entries"),
      "@ptd": base_path("./src/packages"),
    },
  },
  define: {
    __BROWSER__: JSON.stringify(target),
    __EXT_VERSION__: JSON.stringify(`v${commit_version}`),
    __GIT_VERSION__: {
      short: git.short(__dirname),
      long: git.long(__dirname),
      date: +git.date(),
      count: git_count,
      branch: git.branch(__dirname),
    },
    __BUILD_TIME__: +Date.now(),
    __RESOURCE_SITE_ICONS__: fs.readdirSync(base_path("./public/icons/site")),
  },
});
