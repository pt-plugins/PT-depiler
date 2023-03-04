import axios from "axios";
import Sizzle from "sizzle";
import { isDebug } from "@/shared/constants";
import { i18nInstance as i18n } from "@/shared/plugins/i18n";
import { getBackupServer } from "@ptpp/backupserver";
import { getDownloader, getDownloaderIcon } from "@ptpp/downloader";

function initDebug() {
  Object.assign(globalThis, {
    Sizzle,
    axios,
    i18n,
    getBackupServer,
    getDownloader,
    getDownloaderIcon
  });
}

isDebug && initDebug();
