import { OpUnitType } from 'dayjs';
import dayjs from '@ptpp/utils/plugins/dayjs';
import { timezoneOffset } from '@ptpp/utils/types';

export const sizePattern = /^(\d*\.?\d+)(.*[^ZEPTGMK])?([ZEPTGMK](B|iB))s?$/i;

export function parseSizeString (size: string): number {
  size = size.replace(/,/g, ''); // 建议在传入前就替换掉，但是以防万一还是在这里再做一次替换
  const sizeRawMatch = size.match(sizePattern);
  if (sizeRawMatch) {
    const sizeNumber = parseFloat(sizeRawMatch[1]);
    const sizeType = sizeRawMatch[3];
    switch (true) {
      case /Zi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 70);
      case /Ei?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 60);
      case /Pi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 50);
      case /Ti?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 40);
      case /Gi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 30);
      case /Mi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 20);
      case /Ki?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 10);
      default:
        return sizeNumber;
    }
  }
  return 0;
}

export function findThenParseSizeString (query: string): number {
  const queryMatch = query.trim().replace(/[ ,\n]/g, '').match(/([\d.]+ ?[ZEPTGMK]?i?B)/);
  return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
}

export function findThenParseNumberString (query: string) : number {
  const queryMatch = query.trim().replace(/[ ,\n]/g, '').match(/([\d.]+)/);
  return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
}

export function findThenParseValidTimeString (query: string): number | string {
  return dayjs(query).isValid() ? dayjs(query).valueOf() : query;
}

export const dateUnit = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second'];
export const nonStandDateUnitMap = new Map<string, typeof dateUnit[number]>([
  // 中文
  ['分', 'minute'], ['时', 'hour'], ['天', 'day'], ['月', 'month'], ['年', 'year'],
  // 英文缩写
  ['hr', 'hour'], ['min', 'minute'], ['sec', 'second']
]);

export function parseTimeToLive (ttl: string): number {
  // 处理原始字符串中的非标准Unit
  nonStandDateUnitMap.forEach((v, k) => {
    ttl = ttl.replace(k, v);
  });

  let nowDayJs = dayjs();
  dateUnit.forEach(v => {
    const matched = ttl.match(new RegExp(`([.\\d]+) ?(${v}s?)`));
    if (matched) {
      nowDayJs = nowDayJs.add(-parseFloat(matched![1]), matched![2] as OpUnitType);
    }
  });

  return nowDayJs.unix();
}

export function parseTimeWithZone (time: number | string, timezoneOffset: timezoneOffset = '+0000'): number {
  if (!timezoneOffset || !time) {
    return dayjs(time).valueOf();
  }
  let result = time;
  // 标准时间戳需要 * 1000
  if (/^(\d){10}$/.test(result + '')) {
    result = parseInt(result + '') * 1000;
  }
  // 时间格式按 ISO 8601 标准设置，如：2020-01-01T00:00:01+0800
  const datetime = dayjs(result).format('YYYY-MM-DDTHH:mm:ss');
  return new Date(`${datetime}${timezoneOffset}`).getTime();
}

/**
 * cloudflare Email 解码方法，来自 https://usamaejaz.com/cloudflare-email-decoding/
 * @param {*} encodedString
 */
export function cfDecodeEmail (encodedString: string) {
  let email = '';
  const r = parseInt(encodedString.substr(0, 2), 16);
  for (let n = 2; encodedString.length - n; n += 2) {
    const i = parseInt(encodedString.substr(n, 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}
