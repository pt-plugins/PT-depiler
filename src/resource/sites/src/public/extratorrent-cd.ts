import { ISiteMetadata } from '../../types';
import { parseTimeToLive } from '@ptpp/utils/filter';
import dayjs from '@ptpp/utils/plugins/dayjs';

export const siteMetadata: ISiteMetadata = {
  name: 'ExtraTorrent.cd',
  description: 'ExtraTorrent.cd is a Public tracker, a  popular alternative to the original ET site, providing Movie / TV / General magnets',
  url: 'https://extratorrent.si/',
  search: {
    requestConfig: { url: '/search/' },
    keywordsParam: 'search',
    categories: [
      {
        name: 'Category',
        key: 's_cat',
        options: [
          { name: 'All', value: 0 },
          { name: 'Movies', value: 4 },
          { name: 'TV', value: 8 },
          { name: 'Music', value: 5 },
          { name: 'Adult Porn', value: 533 },
          { name: 'Software', value: 7 },
          { name: 'Games', value: 3 },
          { name: 'Anime', value: 1 },
          { name: 'Books', value: 2 },
          { name: 'Pictures', value: 6 },
          { name: 'Mobile', value: 416 },
          { name: 'Other', value: 9 }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'tr[class^="tl"]' },
      id: { selector: 'td:nth-child(3) a[href*="/torrent/"]', attr: 'href', filters: [(q:string) => q.match(/\/torrent\/(\d+)/)![1]] },
      title: { selector: 'td:nth-child(3) a[href*="/torrent/"][title^="view"]' },
      url: { selector: 'td:nth-child(3) a[href*="/torrent/"]' },
      link: { selector: 'a[href^="magnet:?xt="]', attr: 'href' },
      time: {
        selector: 'td:nth-child(4)',
        filters: [
          (q:string) => {
            if (/ago$/.test(q)) { // 4-mins-ago
              return parseTimeToLive(q.replace('-', ''));
            } else if (/^Today-/.test(q)) { // Today-22:03
              return dayjs(q.replace('Today-', '')).unix();
            } else if (/Y-day-\d+/.test(q)) { // Y-day-2020
              return dayjs().add(-1, 'day').unix();
            } else { // 12-27-2019
              return dayjs(q, 'MM-DD-YYYY').unix();
            }
          }
        ]
      },
      size: { selector: 'td:nth-child(5)' },
      seeders: { selector: 'td:nth-child(6)' },
      leechers: { selector: 'td:nth-child(7)' },
      category: { text: 'Other', selector: 'td:nth-child(3) a[title^="Browse"]', attr: 'title' },
      author: { selector: 'td:nth-child(3) a[href^="/profile"]' }
    }
  }
};
