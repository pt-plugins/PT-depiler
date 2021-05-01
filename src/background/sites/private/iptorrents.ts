import { SiteMetadata } from '@/shared/interfaces/sites'
import {
  findThenParseNumberString,
  findThenParseSizeString,
  findThenParseValidTimeString,
  parseTimeToLive
} from '@/shared/utils/filter'
import urlparse from 'url-parse'

export const siteMetadata: SiteMetadata = {
  name: 'IPTorrents',
  timezoneOffset: '+0000',
  description: 'IPTorrents - #1 Private Tracker',
  url: 'https://iptorrents.com/',
  tags: ['综合'],
  search: {
    keywordsParam: 'q',
    requestConfig: {
      url: '/t'
    }
  },
  userInfo: {
    pickLast: ['id'],
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id']
      },
      {
        requestConfig: { url: '/userdetails.php' },
        assertion: { id: 'id' },
        fields: ['messageCount', 'name', 'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus', 'joinTime', 'seeding', 'seedingSize']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table#torrents > tbody > tr' },
      id: {
        selector: ' > td.al > a',
        attr: 'href',
        filters: [
          (query: string) => {
            const queryMatch = query.match(/\/t\/(\d+)/)
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : ''
          }
        ]
      },
      title: { selector: ' > td.al > a' },
      subTitle: {
        selector: 'div.sub',
        filters: [
          (query: string) => {
            if (/ \| /.test(query)) {
              return query.split(' | ')[0]
            }
            return ''
          }
        ]
      },
      url: { selector: ' > td.al > a', attr: 'href' },
      link: { selector: 'a[href*="/download.php"]', attr: 'href' },
      time: {
        selector: 'div.sub',
        filters: [
          /**
           *
           * @param query
           */
          (query: string) => {
            const queryMatch = query.match(/(?:\| )?([\d.]+ .+? ago)/)
            return queryMatch && queryMatch.length >= 2 ? parseTimeToLive(queryMatch[1]) : ''
          }
        ]
      },
      size: { selector: '> td:nth-child(6)' },
      author: {
        selector: 'div.sub',
        filters: [
          (query: string) => {
            if (query.includes(' by ')) {
              const queryMatch = query.match(/by (.+)$/)
              return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : ''
            }
            return ''
          }
        ]
      },
      category: { selector: 'td:eq(0) img', attr: 'alt' },
      seeders: { selector: 'td:nth-last-child(2)' },
      leechers: { selector: 'td:nth-last-child(1)' },
      completed: { selector: 'td:nth-last-child(3)' },
      /**
       * 部分用戶可能开启 “Torrents - Show files count”，此时在 Size 和 Snatched (即 completed ) 中间会添加 文件数 列，
       * 所以对于 seeders， leechers， completed 应该从后往前取，
       * 而 size，comments 应该从前往后取
       */
      comments: { selector: '> td:nth-child(5)', filters: [(q:string) => q.replace(/Go ?to ?comments/, '')] },
      tags: [
        { name: 'Free', selector: 'span.free' },
        { name: 'Free', selector: 'span.t_tag_free_leech' }
      ]
    },
    userInfo: {
      id: {
        selector: ["a[href*='/u/']:first", "a[href*='userdetails.php']:first"],
        attr: 'href',
        switchFilters: [
          (query: string) => {
            const queryMatch = query.match(/u\/(.+)/)
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : ''
          },
          (query: string) => urlparse(query, true).query.id
        ]
      },
      messageCount: {
        selector: ["td[style*='background: red'] a[href*='messages.php']"],
        filters: [findThenParseNumberString]
      },
      name: {
        selector: 'h1.c0'
      },
      uploaded: {
        selector: "th:contains('Uploaded') + td",
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: "th:contains('Downloaded') + td",
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: "th:contains('Share ratio') + td",
        filters: [findThenParseNumberString]
      },
      levelName: {
        selector: "th:contains('Class') + td"
      },
      bonus: {
        selector: "a[href='/mybonus.php']",
        filters: [findThenParseNumberString]
      },
      joinTime: {
        selector: "th:contains('Join date') + td",
        filters: [
          (query: string) => {
            query = query.split(' (')[0]
            return findThenParseValidTimeString(query)
          }
        ]
      },
      seeding: {
        selector: "th:contains('Seeding') + td",
        filters: [findThenParseNumberString]
      },
      seedingSize: {
        text: 'N/A'
      }
    }
  }
}
