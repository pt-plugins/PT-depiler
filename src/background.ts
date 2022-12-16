import PTPlugin from "@/background/ptplugin";
import browser from "webextension-polyfill";
import { getSite, getSchemaModule, getDefinitionModule, getFavicon } from "@ptpp/site";
import { getBackupServer } from "@ptpp/backupserver";
import { getDownloader, getDownloaderIcon } from "@ptpp/downloader";

PTPlugin.init();

Object.assign(window, {
  browser,
  getFavicon,
  getSite,
  getSchemaModule,
  getDefinitionModule,
  getBackupServer,
  getDownloader,
  getDownloaderIcon
});
