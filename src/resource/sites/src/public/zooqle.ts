import { ISiteMetadata } from '../../types';
import { parseTimeToLive } from '@ptpp/utils/filter';

export const siteMetadata: ISiteMetadata = {
  name: 'Zooqle',
  description: 'Zooqle is a Public torrent index providing a huge database of verified torrents',
  url: 'https://zooqle.com/',
  search: {
    requestConfig: { url: '/search' },
    keywordsParam: 'q',
    selectors: {
      rows: { selector: 'tr:has(td[class^="text-muted3"])' },
      id: { selector: 'td:nth-child(1)' },
      title: { selector: 'td:nth-child(2) a' },
      url: { selector: 'td:nth-child(2) a', attr: 'href' },
      link: { selector: ['a[title^="Generate .torrent"]', 'a[title^="Magnet link"]'], attr: 'href' },
      time: {
        selector: 'td:nth-child(5)',
        filters: [
          (q:string) => {
            q = q.replace('long ago', '99 years').replace('yesterday', '1 day');
            return parseTimeToLive(q);
          }
        ]
      },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(6) div', filters: [(q:string) => (q.match(/Seeders: ([\d,])/) || [0, 0])[1]] },
      leechers: { selector: 'td:nth-child(6) div', filters: [(q:string) => (q.match(/Leechers: ([\d,])/) || [0, 0])[1]] },
      category: {
        selector: 'td:nth-child(2) > i',
        attr: 'href',
        filters: [
          (q:string) => (q.split(' ') || ['', 'Other'])[1].replace('zqf-', '')
        ]
      }
    }
  }
};
