import { SiteMetadata } from '@/shared/interfaces/sites'
import dayjs from '@/shared/utils/dayjs'

export const siteMetadata: SiteMetadata = {
  name: 'PornLeech',
  description: 'PornLeech is a Public Tracker for 3X',
  url: 'http://pornleech.io/',
  search: {
    requestConfig: { url: '/index.php' },
    keywordsParam: 'search',
    defaultParams: [
      { key: 'page', value: 'torrents' },
      { key: 'options', value: 0 }, // Search in filename
      { key: 'active', value: 0 } // 0 - All , 1 - Active only , 2 - Dead only
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.lista > tbody > tr:has(a[href^="download.php?id="])' },
      id: { selector: 'td[valign="middle"] a', attr: 'href', filters: [(q:string) => q.match(/(\d+)\.html/)![1]] },
      title: { selector: 'td[valign="middle"] a' },
      url: { selector: 'td[valign="middle"] a', attr: 'href' },
      link: { selector: 'a[href^="download.php?id="]', attr: 'href' },
      time: {
        selector: 'td[valign="middle"] > p:nth-child(4)',
        filters: [
          (q:string) => {
            const dateRaw = q.match(/AddDate:\s*\u00a0\s*(.+?)$/)![1]
            return dayjs(`${dateRaw} -07:00`, 'HH:mm:ss DD/MM/YYYY Z').unix()
          }
        ]
      },
      size: { selector: 'td[valign="middle"] > p:nth-child(3)', filters: [(q:string) => q.match(/Size:\s*\u00a0\s*(.+?)$/)![1]] },
      seeders: { selector: 'td[valign="middle"] > p:nth-child(5)', filters: [(q:string) => q.match(/Seeds:\s*\u00a0\s*(\d+)\u00a0/)![1]] },
      leechers: { selector: 'td[valign="middle"] > p:nth-child(5)', filters: [(q:string) => q.match(/Leechers:\s*\u00a0\s*(\d+)\u00a0/)![1]] },
      completed: { selector: 'td[valign="middle"] > p:nth-child(5)', filters: [(q:string) => q.match(/Complete:\s*\u00a0\s*(.+?)$/)![1].replace('---', '0')] }
    }
  }
}
