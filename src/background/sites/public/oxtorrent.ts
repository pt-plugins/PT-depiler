import { searchFilter, SiteMetadata } from '@/shared/interfaces/sites'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import { AxiosRequestConfig } from 'axios'

const CategoryMap = new Map([
  ['Films', 'Movies'],
  ['Séries', 'TV Shows'],
  ['Logiciels', 'Softwares'],
  ['Musique', 'Music'],
  ['Jeux-Consoles', 'Console Games'],
  ['Jeux-PC', 'PC Games'],
  ['Ebook', 'Books'],
  ['Porno', 'XXX']
])

export const siteMetadata: SiteMetadata = {
  name: 'OxTorrent',
  description: 'OxTorrent is a French Public site for TV / MOVIES / GENERAL',
  url: 'https://www.oxtorrent.cc/',
  legacyUrl: [
    'https://www.oxtorrent.co/',
    'https://wwv.oxtorrent.com/',
    'https://www.smartorrent.tv/'
  ],
  selector: {
    search: {
      rows: { selector: 'table.table-hover > tbody > tr:has(a[href*="torrent/"])' },
      id: {
        selector: 'td:nth-child(1) a',
        attr: 'href',
        filters: [
          (q:string) => q.match(/torrent\/(\d+)/)![1]
        ]
      },
      title: { selector: 'td:nth-child(1) a' },
      url: { selector: 'td:nth-child(1) a', attr: 'href' },
      size: { selector: 'td:nth-child(2)' },
      seeders: { selector: 'td:nth-child(3)' },
      leechers: { selector: 'td:nth-child(4)' },
      category: {
        selector: 'td:nth-child(1) i, td:nth-child(1) div i',
        attr: 'class',
        filters: [
          (q:string) => CategoryMap.get(q)
        ]
      }

    },
    detail: {
      link: { selector: 'a[href^="magnet:?"]', attr: 'href' }
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Oxtorrent extends BittorrentSite {
  protected async transformSearchFilter (filter: searchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter)
    config.url = filter.keywords ? `/recherche/${filter.keywords}` : '/'
    return config
  }
}
