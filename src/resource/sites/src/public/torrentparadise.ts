import { SiteMetadata } from '@/shared/interfaces/sites';
import { parseTimeToLive } from '@/shared/utils/filter';

export const siteMetadata: SiteMetadata = {
  name: 'TorrentParadise',
  description: 'Torrent Paradise is a Public magnet indexer',
  url: 'https://torrentparadise.cl/',
  legacyUrl: [
    'https://torrentparadise.org/',
    'https://torrentparadise.to/',
    'https://torrentparadise.cc/',
    'https://torrentparadise.la/'
  ],
  search: {
    requestConfig: { url: 'search.php' },
    keywordsParam: 'f'
  },
  selector: {
    search: {
      rows: { selector: 'table.table-bordered > tbody > tr.table-default' },
      id: { selector: 'td:nth-child(2) a', attr: 'href', filters: [(q:string) => q.match(/torrent\/(\d+)/)![1]] },
      title: { selector: 'td:nth-child(2) a' },
      url: { selector: 'td:nth-child(2) a', attr: 'href' },
      time: { selector: 'td:nth-child(4)', filters: [parseTimeToLive] },
      size: { selector: 'td:nth-child(3)' },
      seeders: { selector: 'td:nth-child(5)' },
      leechers: { selector: 'td:nth-child(6)' },
      category: { selector: 'td:nth-child(1) a' }
    },
    detail: {
      link: { selector: 'a[href^="magnet:?xt="]', attr: 'href' }
    }
  }
};
