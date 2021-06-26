import { OptionType, OpUnitType } from 'dayjs';
import dayjs from '@ptpp/utils/plugins/dayjs';
import { timezoneOffset } from '@ptpp/utils/types';

export function parseValidTimeString (query: string, format?: OptionType): number | string {
  const time = dayjs(query, format);
  return time.isValid() ? time.valueOf() : query;
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

  return nowDayJs.valueOf();
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
