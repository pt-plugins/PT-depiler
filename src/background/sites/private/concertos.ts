import { SiteMetadata } from '@/shared/interfaces/sites'
import { findThenParseSizeString } from '@/shared/utils/filter'
import dayjs from '@/shared/utils/dayjs'

export const siteMetadata: SiteMetadata = {
  name: 'Concertos',
  timezoneOffset: '+0000',
  description: 'Concertos',
  url: 'https://concertos.live/',
  tags: ['MV'],
  search: {
    keywordsParam: 'title',
    requestConfig: {
      url: '/torrents',
      params: {
        order_by: 'created_at',
        direction: 'desc'
      },
      responseType: 'document'
    }
  },
  userInfo: [
    {
      requestConfig: { url: '/' },
      fields: ['name', 'id', 'messageCount', 'uploaded', 'downloaded', 'ratio', 'levelName']
    },
    {
      requestConfig: { url: '/user/$userId$' },
      assertion: {
        id: 'userId'
      },
      fields: ['joinTime', 'bonus', 'seeding', 'seedingSize']
    }
  ],

  selector: {
    search: {
      rows: { selector: 'table.torrents > tbody > tr' },
      id: { selector: 'a[href*="/torrent/"]', filters: [(query:string) => query.match(/\/torrent\/(\d+)/)![1]] },
      title: { selector: 'a.torrents__title' },
      url: { selector: 'a.torrents__title', attr: 'href' },
      link: { selector: 'a.torrents__title', attr: 'href', filters: [(query: string) => `${query}/download`] },
      time: { selector: 'td:eq(2)' },
      size: { selector: 'td:eq(3)' },
      author: { selector: 'td:eq(1)' },
      category: {
        selector: 'a[href*="?category_"]',
        attr: 'href',
        filters: [
          (query: string) => (query.match(/category_(\d+)/) || ['', 'Other'])[1]
        ]
      },
      seeders: { selector: 'td:nth-last-child(3)' },
      leechers: { selector: 'td:nth-last-child(2)' },
      completed: { selector: 'td:nth-last-child(1)' },
      comments: { text: 0 },
      tags: [
        { name: 'Free', selector: "img[src='images/freeleech.png']" }
      ]
    },
    userInfo: {
      // page: '/',
      name: {
        selector: 'div.user-info > :first'
      },
      id: {
        selector: [".nav > a.nav__link[href*='/user']:first"],
        attr: 'href',
        filters: [(query: string) => query.replace('https://concertos.live/user/', '')]
      },
      messageCount: {
        selector: ['div.info-bar'],
        filters: [(query:string) => {
          const queryMatch = query.match(/(\d+)/)
          return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0
        }]
      },
      uploaded: {
        selector: [':has(> .user-info__item > .fa-upload)'],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: [':has(> .user-info__item > .fa-download)'],
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: [':has(.user-info__item > .fa-percent)'],
        filters: [(query: string) => query.replace('Ratio: ', '')]
      },
      levelName: {
        selector: [':has(.user-info__item > .fa-user)'],
        filters: [(query: string) => query.split(' ')[0]]
      },
      // page: '/user/$user.id$'
      joinTime: {
        selector: ['div.profile-block__age'],
        filters: [
          (query: string) => dayjs(query.replace('Member since ', '')).valueOf()
        ]
      },
      bonus: {
        selector: ["td:contains('BONs') + td"],
        filters: [(query: string) => query.replace(' ', '')]
      },
      seeding: {
        selector: ["td:contains('Total Seeding') + td"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/)
            return (queryMatch && queryMatch.length >= 2) ? parseInt(queryMatch[1]) : 0
          }
        ]
      },
      seedingSize: {
        text: 0
      }
    }
  }
}
