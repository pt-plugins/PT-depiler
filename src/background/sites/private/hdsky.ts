import urlparse from 'url-parse'
import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

export const siteMetadata: SiteMetadata = {
  name: 'HDSky',
  schema: 'NexusPHP',
  url: 'https://hdsky.me/',
  description: '高清发烧友后花园PT',
  tags: ['影视', '纪录片', '综合'],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: 'Movies/电影' },
          { value: 404, name: 'Documentaries/纪录片' },
          { value: 410, name: 'iPad/iPad影视' },
          { value: 405, name: 'Animations/动漫' },
          { value: 402, name: 'TV Series/剧集' },
          { value: 403, name: 'TV Shows/综艺' },
          { value: 406, name: 'Music Videos/音乐MV' },
          { value: 407, name: 'Sports/体育' },
          { value: 408, name: 'HQ Audio/无损音乐' },
          { value: 409, name: 'Misc/其他' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      id: {
        selector: 'form[action*="download.php"]:first',
        attr: 'action',
        filters: [
          (query: string) => urlparse(query, true).query.id
        ]
      },
      url: {
        selector: 'form[action*="download.php"]:first',
        attr: 'action',
        filters: [
          (query: string) => '/details.php?id=' + urlparse(query, true).query.id
        ]
      },
      link: {
        selector: 'form[action*="download.php"]:first',
        attr: 'action'
      },
      progress: {
        selector: ['div.progressseeding, div.progressfinished, div.progressdownloading, div.progressdownloaded'],
        attr: 'style',
        filters: [
          (query: string | undefined) => {
            query = query || ''
            const queryMatch = query.match(/width:([ \d.]+)%/)
            return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0
          }
        ]
      },
      status: {
        selector: ['div[class^="progress"]'],
        attr: 'class',
        filters: [
          (query: string) => {
            switch (true) {
              case /progressseeding/.test(query):
                return ETorrentStatus.seeding
              case /progressdownloading/.test(query):
                return ETorrentStatus.downloading
              case /progressfinished/.test(query):
                return ETorrentStatus.completed
              case /progressdownloaded/.test(query):
                return ETorrentStatus.inactive
              default:
                return ETorrentStatus.unknown
            }
          }
        ]
      }
    }
  }
}
