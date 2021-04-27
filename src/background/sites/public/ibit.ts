import { searchFilter, SiteMetadata } from '@/shared/interfaces/sites'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import { AxiosRequestConfig } from 'axios'
import { parseTimeToLive } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'IBit',
  description: 'IBit is a Public Verified Torrent Search Engine',
  url: 'https://ibit.to/',
  legacyUrl: [
    'https://ibit.uno/',
    'https://ibit.am/'
  ],
  selector: {
    search: {
      rows: { selector: 'table.striped > tbody > tr' },
      id: { selector: 'a[href^="/torrent/"]', attr: 'href', filters: [(q:string) => q.match(/--([a-zA-Z0-9])\//)![1]] },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: 'href' },
      time: { selector: 'td:nth-child(4)', filters: [parseTimeToLive] },
      size: { selector: 'td:nth-child(5)' },
      seeders: { selector: 'td:nth-child(6)' },
      leechers: { selector: 'td:nth-child(7)' },
      comments: { text: 0, selector: 'small[title*="comments"]' },
      category: { selector: 'td:nth-child(3)' }
    },
    detail: {
      link: {
        selector: 'script:contains("magnet:?xt=")',
        filters: [
          (q:string) => {
            const rawHash = q.match(/play\('(.+?)'/)![1]
            return `magnet:?xt=urn:btih:${rawHash.replace(/X-X/ig, '')}`
          }
        ]
      }
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Ibit extends BittorrentSite {
  protected async transformSearchFilter (filter: searchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter)
    config.url = filter.keywords ? `torrent-search/${filter.keywords}` : '/torrents/all'
    return config
  }
}
