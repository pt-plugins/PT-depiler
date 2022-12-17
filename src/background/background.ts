import PTPlugin from "@/background/ptplugin";
import browser from "webextension-polyfill";


PTPlugin.init();

Object.assign(globalThis, {
  browser,
});
