import { SiteMetadata } from '@/shared/interfaces/sites'
import { findThenParseSizeString, parseSizeString } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'PT@KEEPFRDS',
  schema: 'NexusPHP',
  timezoneOffset: '+0000',
  url: 'https://pt.keepfrds.com/',
  favicon: 'https://pt.keepfrds.com/static/favicon-64x64.png',
  tags: ['影视', '综合'],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: 'Movies' },
          { value: 404, name: 'Documentaries' },
          { value: 405, name: 'Animations' },
          { value: 402, name: 'TV Series' },
          { value: 403, name: 'TV Shows' },
          { value: 406, name: 'Music Videos' },
          { value: 407, name: 'Sports' },
          { value: 409, name: 'Misc' },
          { value: 408, name: 'HQ Audio' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      subTitle: {
        filters: [
          (query: string) => {
            // 处理类似以下 尾部中括号的情况
            // The Invisible Man 2020 Bluray 1080p x265 10bit 2Audios DDP 7.1 MNHD-FRDS[ ] [限时禁转]
            while (/\[.*?]$/.test(query)) {
              query = query.replace(/\[.*?]$/, '').trim()
            }
            return query
          }
        ]
      },
      tags: [
        // 禁转, 限时禁转
        { selector: "td.embedded b > font.recommended:contains('禁转')", name: 'Excl.' }
      ]
    },
    userInfo: {
      messageCount: {
        selector: ["a[href*='messages.php'] b span[style*='color: red']"]
      },

      /**
       * 老版的写法，但是新版本中 filter 已经是文本而不是 Element，所以从其父元素中选取，并用正则匹配出来
       * "seeding": {
       *   "selector": ["img[alt='Torrents seeding']"],
       *   "filters": ["$(query[0].nextSibling).text().trim()"]
       * }
       */
      seeding: {
        selector: ["td:has(> img[alt='Torrents seeding'])"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(Active Torrents:|当前活动：|當前活動：).*?(\d+)/)
            return (queryMatch && queryMatch.length >= 3) ? parseInt(queryMatch[2]) : 0
          }
        ]
      },
      seedingSize: {
        selector: ["td.rowhead:contains('当前做种') + td, td.rowhead:contains('Current Seeding') + td, td.rowhead:contains('目前做種') + td"],
        filters: [findThenParseSizeString]
      }
    }
  }
}
