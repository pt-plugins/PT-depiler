import { searchFilter, SiteMetadata, Torrent } from '@/shared/interfaces/sites'
import { BittorrentSite } from '@/background/sites/schema/Abstract'
import urljoin from 'url-join'
import { AxiosRequestConfig } from 'axios'
import { sizeToNumber } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'ACG.RIP',
  description: '与动漫花园类似的日漫资源站点',
  url: 'https://acg.rip/',
  search: {
    type: 'document'
  },
  selector: {
    search: {
      id: {
        selector: 'td:nth-child(2) a',
        attribute: 'href',
        filters: [(q: string) => q.match(/(\d+)/)![0]]
      },
      title: { selector: 'td:nth-child(2) a' },
      url: { selector: 'td:nth-child(2) a', attribute: 'href' },
      link: { selector: 'td:nth-child(3) a', attribute: 'href' },
      time: { selector: 'td:nth-child(1) time', attribute: 'datetime', filters: [parseInt] },
      size: { selector: 'td:nth-child(4)', filters: [sizeToNumber] },
      seeders: { selector: 'td:nth-child(5) div.seed', filters: [parseInt] },
      leechers: { selector: 'td:nth-child(5) div.leech', filters: [parseInt] },
      completed: { selector: 'td:nth-child(5) div.done', filters: [parseInt] }
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class AcgRip extends BittorrentSite {
  protected readonly siteMetadata = siteMetadata;

  generateDetailPageLink (id: string): string {
    return urljoin(this.config.url, `/t/${id}`)
  }

  transformSearchFilter (filter: searchFilter): AxiosRequestConfig {
    return {
      url: '/',
      params: {
        term: filter.keywords
      }
    } as AxiosRequestConfig
  }

  transformSearchPage (doc: Document): Torrent[] {
    const torrents: Torrent[] = []
    const trs = doc.querySelectorAll('table.post-index > tbody > tr')
    trs.forEach(tr => {
      torrents.push({
        ...this.transformRowsTorrent(tr),
        comments: 0 // 该站没有评论
        // category: '全站'
      } as Torrent)
    })
    return torrents
  }
}
