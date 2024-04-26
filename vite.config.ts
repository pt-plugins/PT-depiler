import os from "os";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension from "@samrum/vite-plugin-web-extension";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import vuetify from "vite-plugin-vuetify";
import generateFile from "vite-plugin-generate-file";
import git from "git-rev-sync";
import pkg from "./package.json";

const siteIcons = fs.readdirSync("public/icons/site");

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Vite 默认的 chunkFileNames, entryFileNames 会将所有的产物都放在 assets 下，这里我们根据需要进行调整至分别的目录
        chunkFileNames: (chunkInfo) => {
          // 特殊情况下 facadeModuleId 可能为 null，这时我们使用 moduleIds 的最后一个作为 chunkName
          const chunkName =
            chunkInfo.facadeModuleId || chunkInfo.moduleIds.slice(-1)[0];

          if (
            /[\\/]src[\\/]packages[\\/](downloader|backupServer|site).+\.ts/.test(
              chunkName,
            ) ||
            /[\\/]src[\\/]entries[\\/].+\.vue/.test(chunkName)
          ) {
            const name = chunkName
              .replace(/^.+?[\\/]src[\\/]/, "")
              .replace(/\..+?$/, "");
            return `${name}-[hash].js`;
          }

          return "assets/[name]-[hash].js"; // vite default
        },
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes("entries")) {
            return "[name]-[hash].js";
          }

          return "assets/[name]-[hash].js"; // vite default
        },
      },
    },
  },
  plugins: [
    nodePolyfills({
      include: ["buffer", "path"],
      globals: {
        Buffer: true,
      },
    }),
    vue(),
    vuetify(),
    VueI18nPlugin({
      strictMessage: false,
      include: [path.resolve(__dirname, "./src/locales/**")],
    }),
    webExtension({
      manifest: {
        manifest_version: 3,
        version: `${pkg.version}.${git.count() % 65535}`,

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

        minimum_chrome_version: "120",

        action: {
          default_icon: {
            "16": "icons/logo/16.png",
            "19": "icons/logo/19.png",
            "64": "icons/logo/64.png",
            "128": "icons/logo/128.png",
          },
          default_title: "__MSG_extName__",
        },
        background: {
          service_worker: "entries/background/main.ts",
        },
        options_ui: {
          page: "entries/options/index.html",
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
      },
      additionalInputs: {
        html: ["entries/offscreen/offscreen.html"],
      },
    }),
    generateFile([
      {
        type: "json",
        output: "build_info.json",
        data: {
          buildAt: Date.now(),
          gitVersion: {
            short: git.short(__dirname),
            long: git.long(__dirname),
            date: git.date(),
            count: git.count(),
            branch: git.branch(__dirname),
          }, // Add git detail in manifest when build
          buildOs: {
            arch: os.arch(),
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
          },
          siteIcons,
        },
      },
    ]),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src/entries"),
      "@ptd": path.resolve(__dirname, "./src/packages"),
    },
  },
});
