import { SiteMetadata } from '@/shared/interfaces/sites';
import { ETorrentStatus } from '@/shared/interfaces/enum';

export const siteMetadata: SiteMetadata = {
  name: 'CHDBits',
  schema: 'NexusPHP',
  url: 'https://chdbits.co/',
  tags: ['影视', '综合'],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: 'Movies' },
          { value: 404, name: 'Documentaries' },
          { value: 405, name: 'Animations' },
          { value: 402, name: 'TV Series' },
          { value: 403, name: 'TV Shows' },
          { value: 406, name: 'Music' },
          { value: 407, name: 'Sports' },
          { value: 409, name: 'Demo' },
          { value: 408, name: 'HQ Audio' },
          { value: 410, name: 'Game' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      progress: {
        selector: ['td.rowfollow:last-child'],
        filters: [
          (query: string) => query === '--' ? 0 : parseFloat(query)
        ]
      },
      status: {
        selector: ['td.rowfollow:last-child'],
        filters: [
          // 未交待具体情况，不能准确判断时候是在下载中，所以置 unknown
          (query: string) => parseFloat(query) >= 100 ? ETorrentStatus.completed : ETorrentStatus.unknown
        ]
      }
    }
  }
};
