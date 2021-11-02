import axios from 'axios';
import browser from 'webextension-polyfill';
import Sizzle from 'sizzle';
import dayjs from '@ptpp/utils/plugins/dayjs';
import * as filter from '@ptpp/utils/filter';
import { isDebug } from '@/shared/constants';
import backupServers from '@/background/factory/backupServers';
import btClients from '@/background/factory/btClients';

function initDebug () {
  Object.assign(window as any, {
    btClients,
    backupServers,
    axios,
    browser,
    Sizzle,
    dayjs,
    filter
  });
}

isDebug && initDebug();
