import { SiteMetadata } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'
import { findThenParseNumberString, findThenParseSizeString, findThenParseValidTimeString } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'FileList',
  timezoneOffset: '+0000',
  description: 'FileList',
  url: 'https://filelist.io/',
  legacyUrl: [
    'https://flro.org/'
  ],
  tags: ['影视', '综合'],
  /**
   * 虽然有api接口，但是则需要我们使用 Basic Auth 的形式进行认证（从 Jackett 和 Lidarr 的代码推断）
   * 所以还是直接走页面解析算了
   */
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/browse.php',
      params: {
        cat: 0,
        searchin: 1,
        sort: 2
      }
    }
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/index.php' },
        fields: ['id', 'name', 'messageCount', 'bonus']
      },
      {
        requestConfig: { url: '/userdetails.php' },
        assertion: { id: 'id' },
        fields: ['uploaded', 'downloaded', 'ratio', 'levelName', 'joinTime', 'seeding', 'seedingSize']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'div.visitedlinks:last > div[class=torrentrow]' },
      id: { selector: '> div:eq(1) a:first', attr: 'href', filters: [(q:string) => urlparse(q, true).query.id] },
      title: { selector: '> div:eq(1) a:first' },
      url: { selector: '> div:eq(1) a:first', attr: 'href' },
      link: { selector: '> div:eq(3) a:first', attr: 'href' },
      time: {
        selector: '> div:eq(5)',
        elementProcess: [
          (element: HTMLElement) => {
            const elementMatch = element.innerHTML.replace('<br>', ' ').match(/(\d{2}:\d{2}:\d{2}[^\d]+?\d{2}\/\d{2}\/\d{4})/)![1]
            return elementMatch
              .replace(/(\d{2}:\d{2}:\d{2})[^\d]+?(\d{2}\/\d{2}\/\d{4})/, '$2 $1')
              .replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
          }
        ]
      },
      size: { selector: '> div:eq(6)' },
      author: { selector: '> div:eq(10)' },
      category: { selector: '> div:eq(0) img[alt]:first', attr: 'alt' },
      seeders: {
        selector: '> div:eq(8)',
        filters: [(query: string) => query.split('/')[0] || 0]
      },
      leechers: {
        selector: '> div:eq(9)',
        filters: [(query: string) => query.split('/')[1] || 0]
      },
      completed: { selector: '> div:eq(7)' },
      comments: { selector: '> div:eq(4)' },
      tags: [
        { name: 'Free', selector: "img[alt='FreeLeech']" }
      ]
    },
    userInfo: {
      // page: '/index.php',
      id: {
        selector: "a[href*='userdetails.php']:last",
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.id]
      },
      name: {
        selector: "a[href*='userdetails.php']:last"
      },
      messageCount: {
        selector: ".alert a[href*='messages.php']",
        filters: [findThenParseNumberString]
      },
      bonus: {
        selector: "a[href='/shop.php']",
        filters: [findThenParseNumberString]
      },
      // page: '/userdetails.php?id=$user.id$',
      uploaded: {
        selector: "td.colhead:contains('Uploaded') + td",
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: "td.colhead:contains('Downloaded') + td",
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: "td.colhead:contains('Share ratio') + td",
        filters: [parseFloat]
      },
      levelName: {
        selector: "td.colhead:contains('Class') + td"
      },
      joinTime: {
        selector: "td.colhead:contains('Join'):contains('date') + td",
        filters: [
          (query: string) => {
            query = query.split(' (')[0]
            return findThenParseValidTimeString(query)
          }
        ]
      },
      seeding: {
        selector: "td.colhead:contains('Seed'):contains('bonus') + td > div > b:first",
        filters: [findThenParseNumberString]
      },
      seedingSize: {
        selector: "td.colhead:contains('Seed'):contains('bonus') + td > div > b:nth-child(2):last", // FIXME  这里同时用了 :nth-child(2):last 似乎有问题
        filters: [findThenParseSizeString]
      }
    }
  }
}
