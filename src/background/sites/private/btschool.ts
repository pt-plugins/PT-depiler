/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

export const siteMetadata: SiteMetadata = {
  name: 'BTSCHOOL',
  schema: 'NexusPHP',
  description: '汇聚每一个人的影响力',
  url: 'https://pt.btschool.club/',
  tags: ['影视', '综合'],
  selector: {
    search: {
      progress: {
        selector: ['.progress:eq(0) > div'],
        attr: 'style',
        filters: [
          (query: string) => {
            const queryMatch = query.match(/width:([ \d.]+)%/)
            return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0
          }
        ]
      },
      status: {
        selector: ['.progress:eq(0) > div'],
        attr: 'class',
        filters: [
          (query: string) => {
            switch (true) {
              case /progress_seeding/.test(query):
                return ETorrentStatus.seeding
              case /progress_completed/.test(query):
                return ETorrentStatus.completed
              case /progress_no_downloading/.test(query):
                return ETorrentStatus.inactive
              case /progress_downloading/.test(query): // FIXME 待检查，旧版代码中没有
                return ETorrentStatus.downloading
              default:
                return ETorrentStatus.unknown
            }
          }
        ]
      }
    }
  }
}
