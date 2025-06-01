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
import tailwindcss from "@tailwindcss/vite";
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
];

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2023",
    outDir: `dist-${target}`,
    emptyOutDir: true,
  },
  plugins: [
    vitePluginGenerateWebextLocales(),
    nodePolyfills({
      include: ["buffer", "path"],
      globals: {
        Buffer: true,
      },
    }),
    tailwindcss(),
    VueDevTools({
      launchEditor: fs.existsSync(base_path("./.idea")) ? "webstorm" : "vscode",
    }),
    vue(),
    vuetify(),
    webExtension({
      browser: target,
      disableAutoLaunch: true,
      skipManifestValidation: true,
      manifest: () => ({
        manifest_version: 3,
        "{{chrome}}.minimum_chrome_version": "120",

        version: `${pkg.version}.${git.count()}`,

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

        // 在 Chrome 中需要多注册一个 offscreen 权限
        "{{chrome}}.permissions": [...permissions, "offscreen"],
        "{{firefox}}.permissions": permissions,
        host_permissions: ["*://*/*"],

        "{{firefox}}.browser_specific_settings": {
          gecko: {
            id: "ptdepiler.ptplugins@gmail.com",
            strict_min_version: "113.0",
          },
        },
      }),
      additionalInputs: target == "chrome" ? ["src/entries/offscreen/offscreen.html"] : undefined,
      watchFilePaths: ["package.json"],
      htmlViteConfig: {
        plugins: [
          {
            name: "sort-asserts",
            config(config) {
              config.build.rollupOptions.output = {
                ...config.build?.rollupOptions.output,
                chunkFileNames: (chunkInfo) => {
                  // 特殊情况下 facadeModuleId 可能为 null，这时我们使用 moduleIds 的最后一个作为 chunkName
                  const chunkName = chunkInfo.facadeModuleId || chunkInfo.moduleIds.slice(-1)[0];

                  if (/[\\/]src[\\/]packages[\\/](downloader|backupServer|site|social).+\.ts/.test(chunkName)) {
                    const name = chunkName.replace(/^.+?[\\/]src[\\/]/, "").replace(/\..+?$/, "");
                    return `${name}-[hash].js`;
                  }

                  return "assets/[name]-[hash].js"; // vite default
                },
                entryFileNames: "assets/[name]-[hash].js", // vite default
                assetFileNames: "assets/[name]-[hash][extname]", // vite default
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
    __EXT_VERSION__: JSON.stringify(`v${pkg.version}.${git.count()}+${git.short(__dirname)}`),
    __GIT_VERSION__: {
      short: git.short(__dirname),
      long: git.long(__dirname),
      date: +git.date(),
      count: git.count(),
      branch: git.branch(__dirname),
    },
    __BUILD_TIME__: +Date.now(),
    __RESOURCE_SITE_ICONS__: fs.readdirSync(base_path("./public/icons/site")),
  },
});
