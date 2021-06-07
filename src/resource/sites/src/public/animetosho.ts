import { SiteMetadata } from '@/shared/interfaces/sites';
import dayjs from '@/shared/utils/dayjs';

export const siteMetadata: SiteMetadata = {
  name: 'Anime Tosho',
  description: 'AnimeTosho (AT) is an automated service that provides torrent files, magnet links and DDL for all anime releases',
  url: 'https://animetosho.org/',
  search: {
    requestConfig: { url: '/search' },
    keywordsParam: 'q',
    categories: [
      {
        name: 'Sort',
        key: 'order',
        options: [
          { name: 'Newest first', value: '' },
          { name: 'Oldest first', value: 'date-a' },
          { name: 'Smallest first', value: 'size-a' },
          { name: 'Sort: Largest first', value: 'size-d' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'div.home_list_entry' },
      id: { selector: 'div.link a', attr: 'href', filters: [(q:string) => q.match(/\.([nd\d]+)$/)![1]] },
      title: { selector: 'div.link a' },
      url: { selector: 'div.link a' },
      link: { selector: ['div.links > a[href$=".torrent"]', 'div.links > a[href^="magnet:?xt="]'], attr: 'href' },
      time: {
        selector: 'div.date',
        attr: 'title',
        filters: [
          (q:string) => {
            // 03/06/2011 08:17
            // Today 01:59
            // Yesterday 23:39
            q = q.replace('Date/time submitted: ', '');
            q = q.replace('Today', dayjs().format('DD/MM/YYYY'));
            q = q.replace('Yesterday', dayjs().add(-1, 'day').format('DD/MM/YYYY'));
            return dayjs(q, 'DD/MM/YYYY HH:mm').unix();
          }
        ]
      },
      size: { selector: 'div.size' },
      seeders: { text: 0, selector: 'span[title*="Seeders"]', attr: 'title', filters: [(q:string) => q.match(/Seeders: (\d+)/)![1]] },
      leechers: { text: 0, selector: 'span[title*="Leechers"]', attr: 'title', filters: [(q:string) => q.match(/Leechers: (\d+)/)![1]] }
    }
  }
};
