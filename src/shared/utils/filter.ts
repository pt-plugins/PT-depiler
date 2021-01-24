import dayjs from '@/shared/utils/dayjs'
import { OpUnitType } from 'dayjs'

export const sizePattern = /^(\d*\.?\d+)(.*[^ZEPTGMK])?([ZEPTGMK](B|iB))$/i
export const dateUnit = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'min', 'second', 'sec']
export const zhDateUnitMap = new Map<string, string>([
  ['分', 'minute'],
  ['时', 'hour'],
  ['天', 'day'],
  ['月', 'month'],
  ['年', 'year']
])

export function parseSizeString (size: string): number {
  const sizeRawMatch = size.match(sizePattern)
  if (sizeRawMatch) {
    const sizeNumber = parseFloat(sizeRawMatch[1])
    const sizeType = sizeRawMatch[3]
    switch (true) {
      case /Zi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 70)
      case /Ei?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 60)
      case /Pi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 50)
      case /Ti?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 40)
      case /Gi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 30)
      case /Mi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 20)
      case /Ki?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 10)
      default:
        return sizeNumber
    }
  }
  return 0
}

export function parseTimeToLive (ttl: string): number {
  let nowDayJs = dayjs()

  // 处理中文日期
  zhDateUnitMap.forEach((v, k) => {
    ttl = ttl.replace(k, ` ${v} `)
  })

  dateUnit.forEach(v => {
    const matched = ttl.match(new RegExp(`(\\d+) ?(${v}s?)`))
    if (matched) {
      nowDayJs = nowDayJs.add(-parseInt(matched![1]), matched![2] as OpUnitType)
    }
  })

  return nowDayJs.unix()
}

/**
 * cloudflare Email 解码方法，来自 https://usamaejaz.com/cloudflare-email-decoding/
 * @param {*} encodedString
 */
export function cfDecodeEmail (encodedString: string) {
  let email = ''
  const r = parseInt(encodedString.substr(0, 2), 16)
  for (let n = 2; encodedString.length - n; n += 2) {
    const i = parseInt(encodedString.substr(n, 2), 16) ^ r
    email += String.fromCharCode(i)
  }
  return email
}
