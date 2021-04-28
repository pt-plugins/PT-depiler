/**
 * 该站点搜索方法在旧版中并未涉及，目前搜索配置来自Jackett，未进行具体测试
 * Rhilip, 2021.04.28
 */
import { SiteMetadata } from '@/shared/interfaces/sites'
import Sizzle from 'sizzle'
import { findThenParseNumberString, findThenParseSizeString, parseTimeToLive } from '@/shared/utils/filter'
import urlparse from 'url-parse'
import dayjs from '@/shared/utils/dayjs'

export const siteMetadata: SiteMetadata = {
  name: 'bB',
  timezoneOffset: '+0000',
  description: 'bB is a Private Torrent Tracker for 0DAY / GENERAL',
  url: 'aHR0cHM6Ly9iYWNvbmJpdHMub3JnLw==',
  tags: ['综合'],
  search: {
    keywordsParam: 'searchstr',
    requestConfig: {
      url: 'torrents.php',
      params: {
        action: 'basic',
        searchtags: '',
        tags_type: 0,
        order_by: 's3',
        order_way: 'desc',
        disablegrouping: 1
      }
    }
  },
  userInfo: [
    {
      requestConfig: { url: '/index.php' },
      fields: ['id', 'name']
    },
    {
      requestConfig: { url: '/user.php' },
      assertion: { id: 'id' },
      fields: ['uploaded', 'downloaded', 'ratio', 'seeding', 'levelName', 'bonus', 'joinTime']
    }
  ],
  selector: {
    search: {
      rows: { selector: '#torrent_table > tbody > tr.torrent' },
      id: { selector: 'td:eq(1) a[title="View Torrent"]', attr: 'href' }, // FIXME 因为不知道具体链接接口，所以直接把种子详情页链接作为id
      title: {
        selector: 'td:nth-child(2)',
        elementProcess: [
          (element: HTMLElement) => {
            const cloneElement = element.cloneNode(true) as HTMLElement
            Sizzle('span, strong, div, br', cloneElement).forEach(e => e.remove())
            return cloneElement.innerText.trim().replace(' - ]', ']')
          }
        ]
      },
      url: { selector: 'td:eq(1) a[title="View Torrent"]', attr: 'href' },
      link: { selector: 'td:eq(1) a[title="Download"]', attr: 'href' },
      time: {
        selector: 'td:eq(3)',
        filters: [
          (query: string) => query.replace(' and', ''),
          parseTimeToLive
        ]
      },
      size: { selector: 'td:eq(4)' },
      category: { text: 'Other' }, // FIXME 不清楚，统一置为 Other
      seeders: { selector: 'td:eq(7)' },
      leechers: { selector: 'td:eq(8)' },
      completed: { selector: 'td:eq(6)' },
      tags: [
        { name: 'Free', selector: 'strong:contains("Freeleech!")' }
      ]
    },
    userInfo: {
      // page: '/index.php',
      id: {
        selector: ['.username'],
        attr: 'href',
        filters: [(query:string) => urlparse(query, true).query.id]
      },
      name: {
        selector: ['.username']
      },
      // page: '/user.php?id=$user.id$',
      uploaded: {
        selector: ["li:contains('Uploaded:') > span"],
        attr: 'title',
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["li:contains('Downloaded:') > span"],
        attr: 'title',
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: ["li:contains('Ratio:') > span"],
        attr: 'title',
        filters: [findThenParseNumberString]
      },
      seeding: {
        selector: ["li:contains('Seeding:')"],
        filters: [findThenParseNumberString]
      },
      levelName: {
        selector: ["li:contains('Class:')"],
        filters: [
          (query:string) => {
            const queryMatch = query.match(/Class:(.+)/)
            return (queryMatch && queryMatch.length >= 2) ? queryMatch[1] : ''
          }
        ]
      },
      bonus: {
        selector: ["li:contains('Bonus Points:') > a"],
        filters: [findThenParseNumberString]
      },
      joinTime: {
        selector: ["li:contains('Joined:') > span"],
        attr: 'title',
        filters: [
          (query: string) => dayjs(query).isValid() ? dayjs(query).valueOf() : query
        ]
      }
    }
  }
}
