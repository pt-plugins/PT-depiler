import { SiteMetadata, UserInfo } from '@/shared/interfaces/sites'
import PrivateSite from '@/background/sites/schema/AbstractPrivateSite'
import { findThenParseSizeString } from '@/shared/utils/filter'
import dayjs from '@/shared/utils/dayjs'
import urlparse from 'url-parse'
import Sizzle from 'sizzle'

export const siteMetadata: SiteMetadata = {
  name: 'Bibliotik',
  timezoneOffset: '+0000',
  description: 'Bibliotik',
  url: 'https://bibliotik.me/',
  tags: ['电子书'],
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/torrents/',
      params: {
        orderby: 'added',
        order: 'desc'
      }
    }
  },
  userInfo: {
    pickLast: ['id', 'name'],
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id', 'name']
      },
      {
        requestConfig: { url: '/users/$userId$' },
        assertion: { id: 'userId' },
        fields: ['uploaded', 'downloaded', 'levelName', 'joinTime', 'bonus']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: 'table#torrents_table > tbody > tr:has(.title)' },
      id: {
        selector: 'span.title a:first',
        attr: 'href',
        filters: [
          (query: string) => query.match(/torrents\/(\d+)\/?/)![1]
        ]
      },
      title: { selector: 'span.title a:first' },
      url: { selector: 'span.title a:first', attr: 'href' },
      link: { selector: 'a[title="Download"]', attr: 'href' },
      time: { selector: 'time', attr: 'datetime' },
      size: { selector: '.t_files_size_added span[data-bytecount]', data: 'bytecount' },
      author: { selector: ['.authorLink', '.editorLink'] },
      category: {
        selector: 'td:first-child',
        case: {
          'div[title="Applications"]': 'Applications',
          'div[title="Audiobooks"]': 'Audiobooks',
          'div[title="Comics"]': 'Comics',
          'div[title="Ebooks"]': 'eBooks',
          'div[title="Magazines"]': 'Magazines'
        }
      },
      seeders: { selector: '.seeders', text: 0 },
      leechers: { selector: '.leechers', text: 0 },
      completed: { selector: '.snatches', text: 0 },
      comments: { selector: 'td:eq(5)', text: 0 }

    },
    userInfo: {
      // page: '/' ，走默认解析方法
      id: {
        selector: ["#pre_header_status a[href*='/users/']"],
        attr: 'href',
        filters: [
          (query: string) => (query.match(/(\d+)/) || ['', ''])[1]
        ]
      },
      name: {
        selector: ["#pre_header_status a[href*='/users/']"]
      },
      // page: '/users/$user.id$'
      uploaded: {
        selector: ["#pre_header_status li:contains('Up: ')"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["#pre_header_status li:contains('Down: ')"],
        filters: [findThenParseSizeString]
      },
      levelName: {
        selector: ["#detailsbox p:contains('Class: ')"],
        filters: [
          (query: string) => query.replace(/Class: /g, '')
        ]
      },
      joinTime: {
        selector: "#detailsbox p:contains('Joined ') time",
        attr: 'datetime',
        filters: [
          (query: string) => dayjs(query).isValid() ? dayjs(query).valueOf() : query
        ]
      },
      bonus: {
        text: 'N/A'
      }
    }
  }
}

export default class bibliotik extends PrivateSite {
  async flushUserInfo (): Promise<UserInfo> {
    let userInfo = await super.flushUserInfo()

    if (userInfo.id) {
      userInfo = { seeding: 0, seedingSize: 0, ...userInfo }
      const pageInfo = { count: 0, current: 0 } // 生成页面信息
      for (;pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const { data: TListDocument } = await this.request<Document>({
          url: `/users/${userInfo.id}/seeding`,
          params: {
            page: pageInfo.current > 0 ? pageInfo.current : undefined
          },
          responseType: 'document'
        })
        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TListDocument, {
            selector: ".pagination a[href*='?page']:contains('Last >>'):first",
            attr: 'href',
            filters: [(query: string) => parseInt(urlparse(query, true).query.page as string) || -1]
          })
        }

        const pageSeedAnother = Sizzle('table#torrents_table:first tbody > tr', TListDocument)

        userInfo.seeding! += pageSeedAnother.length
        pageSeedAnother.forEach(another => {
          const sizeAnother = Sizzle('td.t_files_size_added', another)
          if (sizeAnother && sizeAnother.length > 0) {
            const sizeText = (sizeAnother[0] as HTMLElement).innerText.trim()
            userInfo.seedingSize! += findThenParseSizeString(sizeText)
          }
        })
      }
    }

    return userInfo
  }
}
