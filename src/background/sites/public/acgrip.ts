import { searchFilter, SiteConfig, Torrent } from '@/shared/interfaces/sites'
import { BittorrentSite } from '@/background/sites/schema/Abstract'
import urljoin from 'url-join'
import { AxiosRequestConfig } from 'axios'
import { sizeToNumber } from '@/shared/utils/filter'

export const siteConfig: SiteConfig = {
  name: 'ACG.RIP',
  description: '与动漫花园类似的日漫资源站点',
  url: 'https://acg.rip/',
  search: {
    type: 'document',
    defaultParams: []
  }
}

// noinspection JSUnusedGlobalSymbols
export default class AcgRip extends BittorrentSite {
  protected siteConfig = siteConfig;

  generateDetailPageLink (id: string): string {
    return urljoin(this.config.url, `/t/${id}`)
  }

  transformSearchFilter (filter: searchFilter): AxiosRequestConfig {
    return {
      baseURL: this.config.url,
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
        id: this.getFieldData(tr, {
          selector: 'td:nth-child(2) a',
          attribute: 'href',
          filters: [
            (q: string) => parseInt(q.match(/(\d+)/)![0])
          ]
        }),
        title: this.getFieldData(tr, { selector: 'td:nth-child(2) a' }),
        url: this.fixLink(this.getFieldData(tr, { selector: 'td:nth-child(2) a', attribute: 'href' }) as string),
        link: this.fixLink(this.getFieldData(tr, { selector: 'td:nth-child(3) a', attribute: 'href' }) as string),
        time: this.getFieldData(tr, { selector: 'td:nth-child(1) time', attribute: 'datetime', filters: [parseInt] }),
        size: this.getFieldData(tr, { selector: 'td:nth-child(4)', filters: [sizeToNumber] }),
        seeders: this.getFieldData(tr, { selector: 'td:nth-child(5) div.seed', filters: [parseInt] }),
        leechers: this.getFieldData(tr, { selector: 'td:nth-child(5) div.leech', filters: [parseInt] }),
        completed: this.getFieldData(tr, { selector: 'td:nth-child(5) div.done', filters: [parseInt] }),
        comments: 0 // 该站没有评论
        // category: '全站'
      } as Torrent)
    })
    return torrents
  }
}
