import { ISiteMetadata } from '../../types';
import { parseTimeToLive } from '@/shared/utils/filter';

export const siteMetadata: ISiteMetadata = {
  name: 'Magnet4You',
  description: 'Magnet4You is a Public magnet search engine',
  url: 'https://magnet4you.me/',
  search: {
    requestConfig: { url: '/search.php' },
    keywordsParam: 's'
  },
  selector: {
    search: {
      rows: { selector: 'table.tb4 > tbody > tr:has(a[href^="magnet:?xt="])' },
      id: { selector: 'a[href^="magnet/"]', attr: 'href', filters: [(q:string) => q.match(/\d+/)![0]] },
      title: { selector: 'a[href^="magnet/"]' },
      url: { selector: 'a[href^="magnet/"]', attr: 'href' },
      link: { selector: 'a[href^="magnet:?xt="]', attr: 'href' },
      time: { selector: 'td:nth-child(2)', filters: [parseTimeToLive] },
      size: { selector: 'td:nth-child(3)' },
      seeders: { selector: 'td:nth-child(5)', filters: [(q:string) => q.replace('K', '000')] },
      leechers: { selector: 'td:nth-child(6)', filters: [(q:string) => q.replace('K', '000')] },
      completed: { selector: 'td:nth-child(7)', filters: [(q:string) => q.replace('K', '000')] }
    }
  }
};
