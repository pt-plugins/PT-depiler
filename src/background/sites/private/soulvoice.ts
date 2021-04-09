/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

export const siteMetadata: SiteMetadata = {
  name: '聆音Club',
  schema: 'NexusPHP',
  url: 'https://pt.soulvoice.club/',
  description: '致力于建设一个有声资源，电子书为主，学习资料，影视资源为辅的PT分享站。',
  tags: ['综合', '电子书', '有声书'],
  collaborator: 'Gold John King',
  selector: {
    search: {
      progress: {
        selector: ['> td:eq(8)'],
        filters: [
          (query: string) => query === '--' ? 0 : parseFloat(query)
        ]
      },
      status: {
        selector: ['> td:eq(8)'],
        filters: [
          (query: string) => query === '--' ? ETorrentStatus.unknown : (parseFloat(query) >= 100 ? ETorrentStatus.completed : ETorrentStatus.inactive)
        ]
      }
    }
  }
}
