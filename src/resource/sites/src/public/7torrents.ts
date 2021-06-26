import { ISiteMetadata } from '../../types';

// FIXME Cloudflare DDoS Protect
export const siteMetadata: ISiteMetadata = {
  name: '7torrents',
  description: '7torrents is a Public BitTorrent DHT search engine.',
  url: 'https://www.7torrents.cc/',
  search: {
    requestConfig: { url: '/search' },
    keywordsParam: 'query',
    categories: [
      {
        name: 'Order By',
        key: 'sort',
        options: [
          { name: 'Seeders', value: 'seeders' },
          { name: 'Leechers', value: 'leechers' },
          { name: 'Added Time', value: 'created' },
          { name: 'Size', value: 'length' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'div#results > div.media' },
      id: {
        selector: ':self',
        attr: 'onclick',
        filters: [
          (q: string) => q.match(/\/torrent\/([a-z0-9]{40})/)![1]
        ]
      },
      title: { selector: ':self', data: 'name' },
      url: {
        selector: ':self',
        attr: 'onclick',
        filters: [
          (q: string) => q.match(/location\.href='(.+)'/)![1]
        ]
      },
      link: { selector: 'div.media-right > a', attr: 'href' },
      time: { selector: ':self', data: 'added', filters: [{ name: 'parseTTL' }] },
      size: { selector: ':self', data: 'size' },
      seeders: { selector: ':self', data: 'seeders' },
      leechers: { selector: ':self', data: 'leechers' },
      comments: { text: 0 },
      category: { text: 'All' } // 该站点不支持 Category
    }
  }
};
