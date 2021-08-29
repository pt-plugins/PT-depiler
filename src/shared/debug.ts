import axios from 'axios';
import browser from 'webextension-polyfill';
import Sizzle from 'sizzle';
import dayjs from '@ptpp/utils/plugins/dayjs';
import * as filter from '@ptpp/utils/filter';
import { isDebug } from '@/shared/constants';

function initDebug () {
  Object.assign(window as any, {
    axios,
    browser,
    Sizzle,
    dayjs,
    filter
  });
}

isDebug && initDebug();
