import { OpUnitType } from 'dayjs';
import dayjs from '@ptpp/utils/plugins/dayjs';
import { timezoneOffset } from '@ptpp/utils/types';

export * from './filters/size';

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

export function getFixedRatio (uploaded: number = 0, downloaded: number = 0): string | '∞' {
  const ratio = uploaded / downloaded;
  if (ratio === Infinity || ratio > 10000) {
    return '∞'; // Ratio过大时，将分享率设置为无限
  } else {
    return ratio.toFixed(2);
  }
}

// From: https://stackoverflow.com/a/28899585/8824471
export function extractContent (s:string): string {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}

export function createDocument (str: string, type: DOMParserSupportedType = 'text/html') : Document {
  return (new DOMParser()).parseFromString(str, type);
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成随机字符串
 * @param length
 * @param noSimilar 是否包含容易混淆的字符[oO,Ll,9gq,Vv,Uu,I1]，默认为包含
 */
export function getRandomString (length: number = 32, noSimilar: boolean = false):string {
  const chars = noSimilar
    ? 'abcdefhijkmnprstwxyz2345678ABCDEFGHJKMNPQRSTWXYZ'
    : 'abcdefghijkmnopqrstuvwxyz0123456789ABCDEFGHIJKMNOPQRSTUVWXYZ';
  const maxLength = chars.length;
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * maxLength)));
  }

  return result.join('');
}
