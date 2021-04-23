import { searchFilter, SiteMetadata, Torrent } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'
import { parseSizeString } from '@/shared/utils/filter'
import Gazelle from '@/background/sites/schema/Gazelle'

export const siteMetadata: SiteMetadata = {
  name: 'AB',
  timezoneOffset: '+0000',
  description: '动漫',
  url: 'https://animebytes.tv/',
  tags: ['动漫'],
  schema: 'Gazelle',
  host: 'animebytes.tv',
  selector: {
    userInfo: {
      id: {
        selector: ['#stats_menu > a:first'],
        attr: 'href',
        filters: [
          (query: string) => parseInt(urlparse(query, true).query.userid || '')
        ]
      },
      name: {
        selector: ['a.username:first']
      },

      uploaded: {
        selector: ["dt:contains('Uploaded:') + dd > span"],
        attr: 'title',
        filters: [(query:string) => query.replace(/,/g, '')]
      },
      downloaded: {
        selector: ["dt:contains('Downloaded:') + dd > span"],
        attr: 'title',
        filters: [(query:string) => query.replace(/,/g, '')]
      },
      ratio: {
        selector: ["dt:contains('Ratio:') + dd > span"],
        attr: 'title',
        filters: [(query:string) => query.replace(/,/g, '')]
      },
      seeding: {
        selector: ["dt:contains('Seeding:') + dd"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/[,\n]/g, '').match(/([\d.]+)/)
            return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0
          }
        ]
      },
      seedingSize: {
        selector: ["dt:contains('Total seed size:') + dd > span"],
        filters: [parseSizeString]
      },
      levelName: {
        selector: ["dt:contains('Class:') + dd"]
      },
      bonus: {
        selector: ['#yen_count > a'],
        filters: [(query:string) => query.replace(/,|\n|\s+|¥/g, '')]
      },
      joinTime: {
        selector: ["dt:contains('Joined:') + dd > span"]
      }
    }
  }
}

export default class animebytes extends Gazelle {
  // FIXME 暂时以一种强硬的方式表示不支持搜索
  public async searchTorrents (filter: searchFilter): Promise<Torrent[]> {
    throw new Error('Not Support Now.')
  }
}
