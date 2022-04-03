import PTPlugin from '@/background/ptplugin';
import { getSite, getSchemaModule, getDefinitionModule } from "@ptpp/site";
import { getBackupServer } from "@ptpp/backupserver";
import { getDownloader,getDownloaderIcon } from "@ptpp/downloader";

PTPlugin.init();

Object.assign(window, {
  getSite,
  getSchemaModule,
  getDefinitionModule,
  getBackupServer,
  getDownloader,
  getDownloaderIcon
});
