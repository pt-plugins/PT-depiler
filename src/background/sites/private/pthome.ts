import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

export const siteMetadata: SiteMetadata = {
  name: 'PTHome',
  timezoneOffset: '+0800',
  schema: 'NexusPHP',
  url: 'https://pthome.net/',
  description: '只为成为您的家，快乐下载，分享至美！',
  tags: ['综合', '影视', '游戏'],
  collaborator: 'waldens',
  selector: {
    search: {
      progress: {
        selector: ['td:not(.rowfollow):not(.colhead):not(.embedded)'],
        filters: [
          (query: string) => query === '-' ? 0 : parseFloat(query)
        ]
      },
      status: {
        selector: ['.torrents-progress', '.torrents-progress2'],
        elementProcess: [
          (element:HTMLElement) => {
            if (element.classList.contains('torrents-progress')) {
              return (element.getAttribute('style') || '').indexOf('100%') != -1 ? ETorrentStatus.seeding : ETorrentStatus.downloading
            } else if (element.classList.contains('torrents-progress2')) {
              return ETorrentStatus.completed
            } else {
              return ETorrentStatus.unknown
            }
          }
        ]
      }
    }
  }
}
