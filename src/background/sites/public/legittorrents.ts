import { SiteMetadata } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'
import dayjs from '@/shared/utils/dayjs'

export const siteMetadata: SiteMetadata = {
  name: 'Legit Torrents',
  description: 'Legit Torrents is a Public site for free and legal torrents',
  url: 'http://www.legittorrents.info/',
  search: {
    path: '/index.php',
    keywordsParams: 'search',
    defaultParams: [
      { key: 'page', value: 'torrents' },
      { key: 'active', value: 0 }, // 0 all 1 active 2 deadonly
      { key: 'category', value: 0 }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table table table.lista > tbody > tr:has(a[href^="download.php?id="])' },
      id: {
        selector: 'a[title][href^="index.php?page=torrent-details&id="]',
        attr: 'href',
        filters: [
          (q:string) => urlparse(q, true).query.id
        ]
      },
      title: { selector: 'a[title][href^="index.php?page=torrent-details&id="]' },
      url: { selector: 'a[title][href^="index.php?page=torrent-details&id="]', attr: 'href' },
      link: { selector: 'a[href^="download.php?id="]', attr: 'href' },
      time: { selector: 'td time', filters: [(q:string) => dayjs(`${q} -07:00`).unix()] },
      seeders: { selector: 'td:nth-child(5)' },
      leechers: { selector: 'td:nth-child(6)' },
      completed: { selector: 'td:nth-child(7)' }
    }
  }
}
