import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

export const siteMetadata: SiteMetadata = {
  name: '南洋PT',
  timezoneOffset: '+0800',
  description: '网站由西安交通大学学生自主创建与管理，汇集学习资料、纪录片、电影、剧集等各类优质资源',
  url: 'https://nanyangpt.com/',
  tags: ['教育网', '影视', '综合'],
  schema: 'NexusPHP',
  collaborator: 'Rhilip',
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: '电影' },
          { value: 402, name: '剧集' },
          { value: 403, name: '动漫' },
          { value: 404, name: '综艺' },
          { value: 405, name: '体育' },
          { value: 406, name: '纪录' },
          { value: 407, name: '音乐' },
          { value: 408, name: '学习' },
          { value: 409, name: '软件' },
          { value: 410, name: '游戏' },
          { value: 411, name: '其他' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      progress: {
        selector: [".rowfollow[title='Downloading'], .rowfollow[title='Seeding'], .rowfollow[title='Stopped'], .rowfollow[title='Completed']"],
        filters: [
          (query: string) => query === '--' ? 0 : parseFloat(query)
        ]
      },
      status: {
        selector: [".rowfollow[title='Downloading']", ".rowfollow[title='Seeding']", ".rowfollow[title='Stopped']", ".rowfollow[title='Completed']"],
        attr: 'title',
        filters: [
          (query:string) => {
            switch (query) {
              case 'Downloading':
                return ETorrentStatus.downloading
              case 'Seeding':
                return ETorrentStatus.seeding
              case 'Stopped':
                return ETorrentStatus.inactive
              case 'Completed':
                return ETorrentStatus.completed
              default:
                return ETorrentStatus.unknown
            }
          }
        ]
      },
      tags: [
        { name: 'Excl.', selector: "td.embedded > a[title] > b > font[color='red']" }
      ]
    }
  }
}
