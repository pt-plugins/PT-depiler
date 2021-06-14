import { ISiteMetadata } from '../../types';
import { parseTimeToLive } from '@/shared/utils/filter';

export const siteMetadata: ISiteMetadata = {
  name: 'Torrent4You',
  description: 'Torrent4You is a Public torrent storage cache',
  url: 'https://torrent4you.me/',
  search: {
    requestConfig: { url: '/search.php' },
    keywordsParam: 's',
    categories: [
      {
        name: 'Category',
        key: 'cat',
        options: [
          { name: 'Movies', value: 'movies' },
          { name: 'Series', value: 'series' },
          { name: 'Anime', value: 'anime' },
          { name: 'Games', value: 'games' },
          { name: 'Books', value: 'books' },
          { name: 'Mp3', value: 'mp3' },
          { name: 'XxX', value: 'xxx' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.tb4 > tbody > tr:has(form)' },
      id: { selector: 'td:nth-child(1) a', attr: 'href', filters: [(q:string) => q.match(/torrent\/(\d+)/)![1]] },
      title: { selector: 'td:nth-child(1) a' },
      url: { selector: 'td:nth-child(1) a', attr: 'href' },
      link: { selector: 'td:nth-child(1) form', attr: 'action' },
      time: { selector: 'td:nth-child(3)', filters: [parseTimeToLive] },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(6)', filters: [(q:string) => q.replace('K', '000')] },
      leechers: { selector: 'td:nth-child(7)', filters: [(q:string) => q.replace('K', '000')] },
      completed: { selector: 'td:nth-child(8)', filters: [(q:string) => q.replace('K', '000')] },
      comments: { selector: 'td:nth-child(5)' }
    }
  }
};
