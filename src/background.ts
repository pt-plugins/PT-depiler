import { browser } from 'webextension-polyfill-ts';
import BtClientFactory from '@/background/factory/btclients';
import Site from '@/background/factory/sites';
import dayjs from '@/shared/utils/dayjs';
import * as filter from '@/shared/utils/filter';
import Sizzle from 'sizzle';
import axios from 'axios';

Object.assign(window as any, {
  btClient: BtClientFactory,
  site: Site,
  axios,
  browser,
  Sizzle,
  dayjs,
  filter
});

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage();
});
