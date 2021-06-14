import { ISiteMetadata } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'ACG.RIP',
  description: '与动漫花园类似的日漫资源站点',
  url: 'https://acg.rip/',
  search: {
    keywordsParam: 'term'
  },
  selector: {
    search: {
      rows: { selector: 'table.post-index > tbody > tr' },
      id: {
        selector: 'td:nth-child(2) span.title a',
        attr: 'href',
        filters: [(q: string) => q.match(/(\d+)/)![0]]
      },
      title: { selector: 'td:nth-child(2) span.title a' },
      url: { selector: 'td:nth-child(2) span.title a', attr: 'href' },
      link: { selector: 'td:nth-child(3) a', attr: 'href' },
      time: { selector: 'td:nth-child(1) time', attr: 'datetime' },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(5) div.seed' },
      leechers: { selector: 'td:nth-child(5) div.leech' },
      completed: { selector: 'td:nth-child(5) div.done' }
    }
  }
};
