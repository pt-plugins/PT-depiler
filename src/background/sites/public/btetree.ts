import { SiteMetadata } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'

export const siteMetadata: SiteMetadata = {
  name: 'BT.etree',
  description: 'BT.etree is a Public Tracker dedicated to Bootleg FLAC MUSIC',
  url: 'https://bt.etree.org/',
  search: {
    keywordsParam: 'searchzzzz',
    defaultParams: [
      { key: 'cat', value: 0 }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table[bgcolor="#CCCCCC"] tbody tr:gt(1)' }, // 不要第一行
      id: { selector: 'td:nth-child(2) a.details_link', attr: 'href', filters: [(q:string) => urlparse(q, true).query.torrentId] },
      title: { selector: 'td:nth-child(2) a.details_link b' },
      url: { selector: 'td:nth-child(2) a.details_link', attr: 'href' },
      link: { selector: 'td:nth-child(3) a', attr: 'href' },
      time: { selector: 'td:nth-child(6)' },
      size: { selector: 'td:nth-child(7)' },
      author: { selector: 'td:nth-child(11)' },
      seeders: { selector: 'td:nth-child(9)' },
      leechers: { selector: 'td:nth-child(10)' },
      completed: { selector: 'td:nth-child(8)', filters: [(q:string) => q.replace('times', '')] },
      comments: { selector: 'td:nth-child(5)' },
      category: { selector: 'td:nth-child(1) a' }
    }
  }
}
