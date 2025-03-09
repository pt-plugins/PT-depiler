import fs from "node:fs";
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
import { vitePluginGenerateWebextLocales } from "./vite/generateWebextLocales";

import git from "git-rev-sync";
import pkg from "./package.json";

function base_path(_path = "") {
  return path.resolve(__dirname, _path);
}

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
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
      disableAutoLaunch: true,
      skipManifestValidation: true,
      manifest: () => ({
        "{{chrome}}.manifest_version": 3,
        minimum_chrome_version: "120",

        version: pkg.version,

        name: "__MSG_extName__",
        description: "__MSG_extDesc__",
        default_locale: "en",
        homepage_url: "https://github.com/ronggang/PT-Plugin-Plus",
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

        options_ui: {
          page: "src/entries/options/index.html",
          open_in_tab: true,
        },

        permissions: [
          "activeTab",
          "alarms",
          "clipboardWrite",
          "contextMenus",
          "cookies",
          "notifications",
          "scripting",
          "storage",
          "unlimitedStorage",
          "offscreen",
        ],
        host_permissions: ["*://*/*"],
      }),
      additionalInputs: ["src/entries/offscreen/offscreen.html"],
      watchFilePaths: ["package.json"],
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
