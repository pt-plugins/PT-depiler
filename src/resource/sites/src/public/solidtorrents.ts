import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: 'Solid Torrents',
  description: 'Solid Torrents is a Public torrent meta-search engine',
  url: 'https://solidtorrents.net/',
  search: {
    requestConfig: {
      url: '/api/v1/search',
      responseType: 'json',
      params: {
        category: 'all',
        sort: 'seeders'
      }
    },
    keywordsParam: 'q'
  },
  selector: {
    search: {
      rows: { selector: 'results' },
      id: { selector: '_id' },
      title: { selector: 'title' },
      url: { selector: '_id', filters: [(q:string) => `/view/${q}`] },
      link: { selector: 'magnet' },
      time: { selector: 'imported' },
      size: { selector: 'size' },
      seeders: { selector: 'swarm.seeders' },
      leechers: { selector: 'swarm.leechers' },
      completed: { selector: 'swarm.downloads' },
      category: { selector: 'category' }
    }
  }
};
