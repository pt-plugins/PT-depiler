import PTPlugin from "@/background/ptplugin";
import { getSite, getSchemaModule, getDefinitionModule, favicon } from "@ptpp/site";
import { getBackupServer } from "@ptpp/backupserver";
import { getDownloader, getDownloaderIcon } from "@ptpp/downloader";

PTPlugin.init();

Object.assign(window, {
  favicon,
  getSite,
  getSchemaModule,
  getDefinitionModule,
  getBackupServer,
  getDownloader,
  getDownloaderIcon
});
