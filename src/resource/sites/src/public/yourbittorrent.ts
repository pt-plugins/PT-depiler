import { ISiteMetadata } from '../../types';
import dayjs from '@ptpp/utils/plugins/dayjs';

const CategoryMap = new Map([
  ['c1', 'Movies'], ['c2', 'Music'], ['c3', 'Series'], ['c4', 'Games'], ['c5', 'Apps'],
  ['c6', 'Anime'], ['c7', 'Adult'], ['c8', 'eBooks'], ['c9', 'Photos'], ['c10', 'Other']
]);

export const siteMetadata: ISiteMetadata = {
  name: 'YourBittorrent',
  description: 'YourBittorrent is a Public torrent index',
  url: 'https://yourbittorrent.com/',
  legacyUrl: [
    'https://yourbittorrent2.com/',
    'https://yourbittorrent.host/'
  ],
  search: {
    keywordsParam: 'q',
    requestConfig: { params: { v: '', c: '' } },
    selectors: {
      rows: { selector: 'tr.table-default:has(a[href^="/torrent/"])' },
      id: { selector: 'td:nth-child(2) a', attr: 'href', filters: [(q:string) => q.match(/torrent\/(\d+)/)![1]] },
      title: { selector: 'td:nth-child(2) a' },
      url: { selector: 'td:nth-child(2) a', attr: 'href' },
      link: {
        selector: 'td:nth-child(2) a',
        attr: 'href',
        filters: [
          // turn /torrent/25778710/have-i-got-news-for-you-s59e02-720p-britishb00bseztv.html
          // into /down/25778710.torrent
          (q:string) => `/down/${q.match(/torrent\/(\d+)/)![1]}.torrent`
        ]
      },
      time: {
        selector: 'td:nth-child(4)',
        filters: [
          (q:string) => {
            if (q.includes('Today')) {
              return dayjs().valueOf();
            } else if (q.includes('Yesterday')) {
              return dayjs().add(-1, 'day').valueOf();
            } else {
              return dayjs(`${q} -07:00`, 'DD/MM/YY Z').valueOf(); // 02/01/06 -07:00
            }
          }
        ]
      },
      seeders: { selector: 'td:nth-child(5)' },
      leechers: { selector: 'td:nth-child(6)' },
      category: { selector: 'td:nth-child(1)', attr: 'class', filters: [(q:string) => CategoryMap.get(q)] }
    }
  }
};
