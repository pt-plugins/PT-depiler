import { SiteMetadata } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'

export const siteMetadata: SiteMetadata = {
  name: 'GloDLS',
  description: 'GloDLS is a Public Torrent Tracker for MOVIES / TV / GENERAL',
  url: 'https://www.gtdb.to/',
  legacyUrl: [
    'https://glodls.to/'
  ],
  search: {
    requestConfig: { url: '/search_results.php' },
    keywordsParam: 'search',
    categories: [
      {
        name: 'Category',
        key: 'cat',
        options: [
          { value: 50, name: 'XXX' },
          { value: 5, name: 'Androvalue' },
          { value: 28, name: 'Anime' },
          { value: 18, name: 'Apps' },
          { value: 51, name: 'Books' },
          { value: 73, name: 'Desi Porn' },
          { value: 75, name: 'FLAC' },
          { value: 10, name: 'Games' },
          { value: 55, name: 'Macintosh' },
          { value: 52, name: 'Mobile' },
          { value: 1, name: 'Movies' },
          { value: 22, name: 'Music' },
          { value: 33, name: 'Other' },
          { value: 72, name: 'Packs' },
          { value: 70, name: 'Pictures' },
          { value: 76, name: 'Sports' },
          { value: 74, name: 'Tutorials' },
          { value: 41, name: 'TV' },
          { value: 71, name: 'Vvalueeos' },
          { value: 54, name: 'Windows' }
        ],
        cross: { mode: 'append', key: 'c' }
      }
    ],
    defaultParams: [
      { key: 'incldead', value: 1 }, // 0 active 1 incldead 2 onlydead
      { key: 'inclexternal', value: 0 }, // 0 both 1 local 2 external
      { key: 'lang', value: 0 } // 0 all 1 english etc
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.ttable_headinner tr.t-row:even' },
      id: { selector: 'td:nth-child(2) a[href*="klappe_torrent"]', attr: 'href', filters: [(q:string) => q && q.match(/klappe_torrent\('(.+)'\)/)![1]] },
      title: { selector: 'td:nth-child(2) a[title]', attr: 'title' },
      url: { selector: 'td:nth-child(2) a[title]', attr: 'href' },
      link: { selector: ['a[href^="/down.php?id="]', 'a[href*="itorrents.org/torrent/"]'], attr: 'href' },
      size: { selector: 'td:nth-child(5)' },
      seeders: { selector: 'td:nth-child(6)' },
      leechers: { selector: 'td:nth-child(7)' },
      category: {
        selector: 'td:nth-child(1) a',
        attr: 'href',
        filters: [(q:string) => urlparse(q, true).query.cat]
      },
      author: { selector: 'td:nth-child(8)' }
    }
  }
}
