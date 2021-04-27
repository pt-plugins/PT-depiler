import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'
import NexusPHP from '@/background/sites/schema/NexusPHP'
import { createDocument } from '@/shared/utils/common'
import urlparse from 'url-parse'

export const siteMetadata: SiteMetadata = {
  name: 'M-Team',
  timezoneOffset: '+0800',
  description: 'M-Team',
  url: 'https://kp.m-team.cc/',
  tags: ['影视', '综合'],
  schema: 'NexusPHP',
  host: 'kp.m-team.cc',
  formerHosts: [
    'pt.m-team.cc',
    'tp.m-team.cc'
  ],
  search: {
    categories: [
      {
        name: '搜索入口',
        key: '#changePath',
        options: [
          { name: '综合', value: '/torrents.php' },
          { name: '音乐', value: '/music.php' },
          { name: 'Adult', value: '/adult.php' }
        ]
      },
      {
        name: '综合分类',
        key: 'cat',
        options: [
          { value: 401, name: 'Movie(電影)/SD' },
          { value: 419, name: 'Movie(電影)/HD' },
          { value: 420, name: 'Movie(電影)/DVDiSo' },
          { value: 421, name: 'Movie(電影)/Blu-Ray' },
          { value: 439, name: 'Movie(電影)/Remux' },
          { value: 403, name: 'TV Series(影劇/綜藝)/SD' },
          { value: 402, name: 'TV Series(影劇/綜藝)/HD' },
          { value: 435, name: 'TV Series(影劇/綜藝)/DVDiSo' },
          { value: 438, name: 'TV Series(影劇/綜藝)/BD' },
          { value: 404, name: '紀錄教育' },
          { value: 405, name: 'Anime(動畫)' },
          { value: 407, name: 'Sports(運動)' },
          { value: 422, name: 'Software(軟體)' },
          { value: 423, name: 'PCGame(PC遊戲)' },
          { value: 427, name: 'eBook(電子書)' },
          { value: 409, name: 'Misc(其他)' }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '音乐分类',
        key: 'cat',
        options: [
          { value: 406, name: 'MV(演唱)' },
          { value: 408, name: 'Music(AAC/ALAC)' },
          { value: 434, name: 'Music(無損)' }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '成人分类',
        key: 'cat',
        options: [
          { value: 410, name: 'AV(有碼)/HD Censored' },
          { value: 429, name: 'AV(無碼)/HD Uncensored' },
          { value: 424, name: 'AV(有碼)/SD Censored' },
          { value: 430, name: 'AV(無碼)/SD Uncensored' },
          { value: 426, name: 'AV(無碼)/DVDiSo Uncensored' },
          { value: 437, name: 'AV(有碼)/DVDiSo Censored' },
          { value: 431, name: 'AV(有碼)/Blu-Ray Censored' },
          { value: 432, name: 'AV(無碼)/Blu-Ray Uncensored' },
          { value: 436, name: 'AV(網站)/0Day' },
          { value: 425, name: 'IV(寫真影集)/Video Collection' },
          { value: 433, name: 'IV(寫真圖集)/Picture Collection' },
          { value: 411, name: 'H-Game(遊戲)' },
          { value: 412, name: 'H-Anime(動畫)' },
          { value: 413, name: 'H-Comic(漫畫)' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },

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
        elementProcess: [
          (element: HTMLElement) => {
            const elementText = element.innerText.trim()
            const floatElementText = parseFloat(elementText)
            if (elementText === '--') {
              return ETorrentStatus.unknown
            } else if (element.classList.contains('peer-active')) {
              return floatElementText >= 100 ? ETorrentStatus.seeding : ETorrentStatus.downloading
            } else {
              return floatElementText >= 100 ? ETorrentStatus.completed : ETorrentStatus.inactive
            }
          }
        ]
      }
    },
    userInfo: {
      uploaded: {
        selector: ["td.rowfollow:contains('分享率')", "td.rowhead:contains('传输') + td", "td.rowhead:contains('傳送') + td", "td.rowhead:contains('Transfers') + td"]
      },
      downloaded: {
        selector: ["td.rowfollow:contains('分享率')", "td.rowhead:contains('传输') + td", "td.rowhead:contains('傳送') + td", "td.rowhead:contains('Transfers') + td"]
      }
    }
  }
}

export default class mteam extends NexusPHP {
  private async getUserTorrentList (userId: number, page: number = 0, type: string = 'seeding'): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: '/getusertorrentlist.php',
      params: {
        userid: userId, page, type
      },
      responseType: 'document'
    })
    return TListDocument
  }

  protected async getUserSeedingStatus (userId: number): Promise<{ seeding: number; seedingSize: number }> {
    let seedStatus = { seeding: 0, seedingSize: 0 }

    /**
     * 首先尝试ajax接口，如果超出 100条，则 ajax 接口会返回 OVERLOADED，
     * 转而请求 /getusertorrentlist.php 页面
     */
    const userSeedingRequestString = await this.requestUserSeedingPage(userId)
    if (userSeedingRequestString && userSeedingRequestString.indexOf('OVERLOADED') === -1) {
      const userSeedingDocument = createDocument(userSeedingRequestString)
      seedStatus = this.countSeedingStatusFromDocument(userSeedingDocument)
    } else {
      const pageInfo = { count: 0, current: 0 } // 生成页面信息
      for (;pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const TListDocument = await this.getUserTorrentList(userId, pageInfo.current)
        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TListDocument, {
            selector: ["a[href*='page=']:contains('-'):last"],
            attr: 'href',
            filters: [(query: string) => parseInt(urlparse(query, true).query.page as string) || -1]
          })
        }

        // 解析当前页信息， 并合并至顶层字典中
        const pageSeedStatus = this.countSeedingStatusFromDocument(TListDocument)
        seedStatus.seeding += pageSeedStatus.seeding
        seedStatus.seedingSize += pageSeedStatus.seedingSize
      }
    }

    return seedStatus
  }
}
