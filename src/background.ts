import { browser } from 'webextension-polyfill-ts';
import BtClientFactory from '@/background/factory/btclients';
import SiteFactory from '@/background/factory/sites';
import dayjs from '@ptpp/utils/plugins/dayjs';
import * as filter from '@ptpp/utils/filter';
import Sizzle from 'sizzle';
import axios from 'axios';

Object.assign(window as any, {
  btClient: BtClientFactory,
  site: SiteFactory,
  axios,
  browser,
  Sizzle,
  dayjs,
  filter
});

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage();
});
