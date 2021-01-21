import { SiteMetadata } from '@/shared/interfaces/sites'
import { BittorrentSite } from '@/background/sites/schema/AbstractBittorrentSite'

export const siteMetadata: SiteMetadata = {
  name: 'ACG.RIP',
  description: '与动漫花园类似的日漫资源站点',
  url: 'https://acg.rip/',
  search: {
    keywordsParams: 'term'
  },
  selector: {
    search: {
      rows: { selector: 'table.post-index > tbody > tr' },
      id: {
        selector: 'td:nth-child(2) a',
        attr: 'href',
        filters: [(q: string) => q.match(/(\d+)/)![0]]
      },
      title: { selector: 'td:nth-child(2) a' },
      url: { selector: 'td:nth-child(2) a', attr: 'href' },
      link: { selector: 'td:nth-child(3) a', attr: 'href' },
      time: { selector: 'td:nth-child(1) time', attr: 'datetime' },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(5) div.seed' },
      leechers: { selector: 'td:nth-child(5) div.leech' },
      completed: { selector: 'td:nth-child(5) div.done' }
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class AcgRip extends BittorrentSite {
  protected readonly siteMetadata = siteMetadata;
}
