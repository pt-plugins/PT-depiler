import fs from "node:fs";
import process from "node:process";
import path from "node:path";

// Vite And it's plugins
import { defineConfig } from "vite";
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
    // 这里曾有 `vite-plugin-node-polyfills`（`include: ["buffer","path"]` + `globals.Buffer`）。2026-10-08 移除，
    // 因为本仓已不再有任何 Node 内建的运行时依赖：
    //   · `buffer`：源码里最后一处用法（downloader 把 ArrayBuffer 转成 Buffer 交给 parse-torrent）
    //     已改为零拷贝的 `new Uint8Array(...)`；
    //   · `path`：唯一使用方 parse-torrent 只用 `join` + `sep`，已由下面的 `resolve.alias` 指向自实现；
    //   · `global` / `process` / 裸 `Buffer`：该插件的 globals 是经 `@rollup/plugin-inject` 实现的，
    //     **只有代码里真的出现裸标识符才会注入**，现已无任何引用（实测产物里零注入痕迹）。
    // 移除前后产物完全等价：10.21MB / 814 文件，各入口 chunk 体积逐一致（background 132.6KB、cs-app 225KB、
    // options index 60KB），无 `__vite-browser-external-*` 桩，path-browserify 与 buffer 垫片均为 0。
    //
    // ⚠️ 将来若新增的依赖 import 了 Node 内建：`path` 认下面那条 alias；其余需要像 `src/extends/shims/`
    // 那样补一个等价实现（**不要**重新引入多模块垫片 —— 它们会把用不到的十几个成员一起打进产物）。
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
        "{{chrome}}.minimum_chrome_version": "140",

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

        // 在 Firefox 中，background 不能使用 service_worker。
        // 这里必须使用 page（HTML 入口）而不是 scripts：scripts 入口会被插件以 build.lib + iife
        // 打成单文件，IIFE 不允许代码分割，会把 offscreen 的整条依赖图内联进后台脚本，
        // 并与 options 页的 vendor chunk 重复（产物约 +1.8MB / +16%）。
        // 使用 page 后后台进入多页 ESM 构建，与 options / cs-app 共享 chunk。
        "{{firefox}}.background": {
          page: "src/entries/background/firefox_main.html",
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
            strict_min_version: "133.0",
          },
        },
        "{{firefox}}.content_security_policy": {
          extension_pages: "script-src 'self';",
        },

        web_accessible_resources: [
          {
            resources: ["icons/*", "lib/*", "pt-depiler.css"],
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
            // Firefox 的后台页（firefox_main.html）是纯逻辑页面，不需要任何样式；
            // 但 cssCodeSplit=false 会让 Vite 把整份 pt-depiler.css 注入该构建的**每个** HTML 入口
            // （见下方 config 中的 cssCodeSplit），后台事件页每次唤醒都要白加载解析这份 CSS。
            // Vite 在 generateBundle 里先注入 CSS link、再执行 transformIndexHtml，
            // 因此这里可以精确摘掉那条注入的 link，且只作用于 firefox_main.html。
            transformIndexHtml: {
              order: "post",
              handler(html, ctx) {
                if (!ctx.filename.endsWith("firefox_main.html")) return html;
                return html.replace(/[ \t]*<link\b[^>]*>[ \t]*\r?\n?/g, (tag) =>
                  /rel="stylesheet"/.test(tag) && /pt-depiler\.css/.test(tag) ? "" : tag,
                );
              },
            },
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
              // 动态 import 不会自动加载按 chunk 拆分的 css 分片，cs-app 的组件树样式
              // （vuetify 组件、页面组件等分散在各 chunk 的 css）无法逐份在页面上下文
              // 引入，故合并为单文件，由 app/init.ts 按固定地址 link
              config.build.cssCodeSplit = false;
              // 关闭 module preload（见 issue #1524）：
              // 该 ESM 入口被 content script 引导在**站点页面文档**里动态 import，而 Vite 生成的
              // 预加载辅助函数把依赖还原为根相对地址（`function(e){return"/"+e}`），页面上下文会把
              // 它们解析成 `https://<站点>/vendor/...`，每个 chunk 每页都发出一次必然 404 的请求，
              // 并计入站点访问统计。此处产物的 `__vite__mapDeps` 全部为 js 依赖、无 css 依赖，
              // 关掉预加载后辅助函数退化为纯 `import()` 包装（仅少一个无效提示，不影响模块解析），
              // 站点侧不再出现任何发往自身 /vendor/... 的请求。
              // 仅作用于 cs-app 入口所在的多页构建；offscreen 等扩展页面文档不受影响。
              config.build.modulePreload = false;
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
                    // cssCodeSplit=false 后全量样式合并为单一文件；content script 的
                    // shadow DOM 通过 chrome.runtime.getURL("pt-depiler.css") 固定地址
                    // 加载（见 app/init.ts），必须输出到根目录且使用稳定文件名
                    if (assetName === "index.css" || assetName === "style.css") {
                      return "pt-depiler.css";
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
    alias: [
      // `parse-torrent` 会 `import path from "path"`，而它只用到 `join` + `sep`
      // （见 src/extends/shims/path.ts 的开头注释）。用本仓的最小实现接管，
      // 换掉 path-browserify 的 478 行实现。用正则做精确匹配，避免误伤 `path/xxx` 子路径。
      { find: /^(node:)?path$/, replacement: base_path("./src/extends/shims/path.ts") },
      { find: "~", replacement: base_path("./src") },
      { find: "@", replacement: base_path("./src/entries") },
      { find: "@ptd", replacement: base_path("./src/packages") },
    ],
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
