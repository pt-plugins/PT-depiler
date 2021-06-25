import { browser } from 'webextension-polyfill-ts';
import BtClientFactory from '@/background/factory/btClients';
import backupServerFactory from '@/background/factory/backupServers';
import SiteFactory from '@/background/factory/sites';
import dayjs from '@ptpp/utils/plugins/dayjs';
import * as filter from '@ptpp/utils/filter';
import Sizzle from 'sizzle';
import axios from 'axios';

Object.assign(window as any, {
  btClient: BtClientFactory,
  site: SiteFactory,
  backupServer: backupServerFactory,
  axios,
  browser,
  Sizzle,
  dayjs,
  filter
});

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage();
});
