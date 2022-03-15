import PTPlugin from '@/background/ptplugin';
import { getSite, getSchemaModule, getDefinitionModule } from "@ptpp/site";
import { getBackupServer } from "@ptpp/backupserver";
import { getDownloader } from "@ptpp/downloader";

PTPlugin.init();

Object.assign(window, {
  getSite,
  getSchemaModule,
  getDefinitionModule,
  getBackupServer,
  getDownloader
});
