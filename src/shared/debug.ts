import ky from "ky";
import browser from "webextension-polyfill";
import Sizzle from "sizzle";
import { isDebug } from "@/shared/constants";
import { i18nInstance as i18n } from "@/shared/plugins/i18n";
import { getSite, getSchemaModule, getDefinitionModule, getFavicon } from "@ptpp/site";
import { getBackupServer } from "@ptpp/backupserver";
import { getDownloader, getDownloaderIcon } from "@ptpp/downloader";

function initDebug() {
  Object.assign(globalThis, {
    ky,
    browser,
    Sizzle,
    i18n,
    getFavicon,
    getSite,
    getSchemaModule,
    getDefinitionModule,
    getBackupServer,
    getDownloader,
    getDownloaderIcon
  });
}

isDebug && initDebug();
