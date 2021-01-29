import { SiteMetadata } from '@/shared/interfaces/sites'
import dayjs from '@/shared/utils/dayjs'

export const siteMetadata: SiteMetadata = {
  name: 'Solid Torrents',
  description: 'Solid Torrents is a Public torrent meta-search engine',
  url: 'https://solidtorrents.net/',
  search: {
    path: '/api/v1/search',
    type: 'json',
    keywordsParams: 'q',
    defaultParams: [
      { key: 'category', value: 'all' },
      { key: 'sort', value: 'seeders' }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'results' },
      id: { selector: '_id' },
      title: { selector: 'title' },
      url: { selector: '_id', filters: [(q:string) => `/view/${q}`] },
      link: { selector: 'magnet' },
      time: { selector: 'imported', filters: [(q:string) => dayjs(q).unix()] },
      size: { selector: 'size' },
      seeders: { selector: 'swarm.seeders' },
      leechers: { selector: 'swarm.leechers' },
      completed: { selector: 'swarm.downloads' },
      category: { selector: 'category' }
    }
  }
}
