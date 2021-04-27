import { searchFilter, SiteMetadata } from '@/shared/interfaces/sites'
import { parseTimeToLive } from '@/shared/utils/filter'
import dayjs from '@/shared/utils/dayjs'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import { AxiosRequestConfig } from 'axios'

const CategoryMap = new Map([
  [1, 'Movies'], [2, 'Music'], [3, 'Television'], [4, 'Games'], [5, 'Software'],
  [6, 'Anime'], [7, 'Adult'], [8, 'Ebooks'], [9, 'Animation'], [10, 'Other'],
  [0, 'TBC']
])

export const siteMetadata: SiteMetadata = {
  name: 'TOROS',
  description: 'TOROS is a Public torrent index',
  url: 'https://www.toros.co/',
  selector: {
    search: {
      rows: { selector: 'table.table-responsive tr:has(a[href^="/torrent/"])' },
      id: { selector: 'a[href^="/torrent/"]', attr: 'href', filters: [(q:string) => q.match(/torrent\/(\d+)/)![1]] },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: 'href' },
      time: {
        selector: 'td:nth-child(2)',
        filters: [
          (q:string) => {
            if (/ago/.test(q)) {
              return parseTimeToLive(q)
            } else if (/Yesterday/.test(q)) {
              return dayjs().add(-1, 'day').unix()
            } else {
              return dayjs(q, 'DD MMM').unix()
            }
          }
        ]
      },
      size: { selector: 'td:nth-child(3)' },
      seeders: { selector: 'td:nth-child(4)' },
      leechers: { selector: 'td:nth-child(5)' },
      category: { selector: 'td:nth-child(1)', attr: 'class', filters: [(q:string) => CategoryMap.get(parseInt(q.replace(/^tv/, '')))] },
      author: { selector: 'td:nth-child(6)' }
    },
    detail: {
      link: { selector: 'a[href^="magnet:?xt="]', attr: 'href' }
    }
  }

}

// noinspection JSUnusedGlobalSymbols
export default class Toros extends BittorrentSite {
  protected async transformSearchFilter (filter: searchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter)
    config.url = filter.keywords ? `all/torrents/${filter.keywords}.html` : 'top100.html'

    return config
  }
}
