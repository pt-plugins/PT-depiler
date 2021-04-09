import PrivateSite from '@/background/sites/schema/AbstractPrivateSite'
import { SearchRequestConfig, SiteConfig, Torrent, UserInfo } from '@/shared/interfaces/sites'
import Sizzle from 'sizzle'
import urlparse from 'url-parse'
import dayjs from '@/shared/utils/dayjs'
import { extractContent } from '@/shared/utils/common'
import { parseSizeString, parseTimeToLive } from '@/shared/utils/filter'
import { ETorrentStatus } from '@/shared/interfaces/enum'

const baseLinkQuery = {
  selector: 'a[href*="download.php?id="]:has(> img[alt="download"])',
  attr: 'href'
}

export default class NexusPHP extends PrivateSite {
  /**
   * NexusPHP 模板默认配置，对于大多数NPHP站点都通用
   * @protected
   */
  protected readonly initConfig: Partial<SiteConfig> = {
    timezoneOffset: '+0800',
    search: {
      keywordsParam: 'search',
      requestConfig: {
        url: '/torrents.php'
      },
      defaultParams: [
        { key: 'notnewword', value: 1 }
      ]
    },
    selector: {
      search: {
        // row 等信息由 transformSearchPage 根据搜索结果自动生成
        link: baseLinkQuery, // 种子下载链接
        url: {
          ...baseLinkQuery,
          filters: [
            (query: string) => '/details.php?id=' + urlparse(query, true).query.id
          ]
        }, // 种子页面链接
        id: {
          ...baseLinkQuery,
          filters: [
            (query: string) => urlparse(query, true).query.id
          ]
        },
        progress: {
          text: 0
        },
        status: {
          text: ETorrentStatus.unknown
        },
        tags: [
          // 这里的 selector仅放最基础的（NPHP默认），如果各站有更改请在对应站点修改，不要污染全局空间
          // 因为 tags是会 concat 接起来的
          { name: 'Free', selector: 'img.pro_free', color: 'blue' },
          { name: '2xFree', selector: 'img.pro_free2up', color: 'green' },
          { name: '2xUp', selector: 'img.pro_2up', color: 'lime' },
          { name: '2x50%', selector: 'img.pro_50pctdown2up', color: 'light-green' },
          { name: '30%', selector: 'img.pro_30pctdown', color: 'indigo' },
          { name: '50%', selector: 'img.pro_50pctdown', color: 'orange' }
        ]
      },
      detail: {},
      userInfo: {
        // "page": "/index.php",
        id: {
          selector: ["a[href*='userdetails.php'][class*='Name']:first", "a[href*='userdetails.php']:first"],
          attr: 'href',
          filters: [
            (query:string) => { console.log(query); return urlparse(query, true).query.id }
          ]
        },
        name: {
          selector: ["a[href*='userdetails.php'][class*='Name']:first", "a[href*='userdetails.php']:first"]
        },
        messageCount: {
          text: 0,
          selector: "td[style*='background: red'] a[href*='messages.php']",
          filters: [
            (query: string) => {
              const queryMatch = query.match(/(\d+)/)
              return (queryMatch && queryMatch.length >= 2) ? parseInt(queryMatch[1]) : 0
            }
          ]
        },

        // "page": "/userdetails.php?id=$user.id$",
        uploaded: {
          selector: ["td.rowhead:contains('传输') + td", "td.rowhead:contains('傳送') + td", "td.rowhead:contains('Transfers') + td", "td.rowfollow:contains('分享率')"],
          filters: [
            (query: string) => {
              const queryMatch = query.replace(/,/g, '').match(/(上[传傳]量|Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/)
              return (queryMatch && queryMatch.length === 3) ? parseSizeString(queryMatch[2]) : 0
            }
          ]
        },
        downloaded: {
          selector: ["td.rowhead:contains('传输') + td", "td.rowhead:contains('傳送') + td", "td.rowhead:contains('Transfers') + td", "td.rowfollow:contains('分享率')"],
          filters: [
            (query: string) => {
              const queryMatch = query.replace(/,/g, '').match(/(下[载載]量|Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/)
              return (queryMatch && queryMatch.length === 3) ? parseSizeString(queryMatch[2]) : 0
            }
          ]
        },
        levelName: {
          selector: ["td.rowhead:contains('等级') + td > img", "td.rowhead:contains('等級')  + td > img", "td.rowhead:contains('Class')  + td > img"],
          attr: 'title'
        },
        bonus: {
          selector: ["td.rowhead:contains('魔力') + td", "td.rowhead:contains('Karma'):contains('Points') + td", "td.rowhead:contains('麦粒') + td", "td.rowfollow:contains('魔力值') + td"],
          filters: [
            (query: string) => {
              query = query.replace(/,/g, '')
              if (query.match(/魔力值:/)) {
                query = query.match(/魔力值.+?([\d.]+)/)![1]
              }
              return parseFloat(query)
            }
          ]
        },
        joinTime: {
          selector: ["td.rowhead:contains('加入日期') + td", "td.rowhead:contains('Join'):contains('date') + td"],
          filters: [
            (query: string) => {
              query = query.split(' (')[0]
              return dayjs(query).isValid() ? dayjs(query).unix() : query
            }
          ]
        },

        // /getusertorrentlistajax.php?userid=$user.id$&type=seeding
        // 注意此处为NPHP站点默认方法，部分站点可能有改写处理，请覆写对应方法
        seeding: {
          selector: ['tr:not(:eq(0))']
        }
      }
    }
  }

  protected transformSearchPage (doc: Document, requestConfig: SearchRequestConfig): Torrent[] {
    // 如果配置文件没有传入 search 的选择器，则我们自己生成

    const legacyTableSelector = 'table.torrents:last'

    // 对于NPHP，一般来说，表的第一行应该是标题行，即 `> tbody > tr:nth-child(1)` ，但是也有部分站点为 `> thead > tr`
    const legacyTableHasThead = Sizzle(`${legacyTableSelector} > thead > tr`, doc).length > 0

    if (!this.config.selector!.search!.rows) {
      this.config.selector!.search!.rows = {
        // 对于有thead的站点，认为 > tbody > tr 均为种子信息，而无 thead 的站点则为 > tbody > tr:gt(0)
        selector: `${legacyTableSelector} > tbody > tr` + (legacyTableHasThead ? '' : ':gt(0)')
      }
    }

    // 开始遍历我们的head行，并设置其他参数
    const headSelector = legacyTableSelector + (legacyTableHasThead ? ' > thead > tr > th' : ' > tbody > tr:eq(0) > td')
    const headAnother = Sizzle(headSelector, doc) as HTMLElement[]
    headAnother.forEach((element, elementIndex) => {
      // 比较好处理的一些元素，都是可以直接获取的
      for (const [dectSelector, dectField] of Object.entries({
        'img.comments': 'comments', // 评论数
        'img.size': 'size', // 大小
        'img.seeders': 'seeders', // 种子数
        'img.leechers': 'leechers', // 下载数
        'img.snatched': 'completed', // 完成数
        'img.time': 'time', // 发布时间 （仅生成 selector， 后面会覆盖）
        'a[href*="sort=9"]': 'author' // 发布者
      })) {
        if (Sizzle(dectSelector, element).length > 0 && !(dectField in this.config.selector!.search!)) {
          // @ts-ignore
          this.config.selector.search[dectField] = { selector: `> td:eq(${elementIndex})` }
        }
      }
    })

    // !!! 其他一些比较难处理的，我们把他 hack 到 parseRowToTorrent 中 !!!
    return super.transformSearchPage(doc, requestConfig)
  }

  protected parseRowToTorrent (row: Element, requestConfig: SearchRequestConfig): Partial<Torrent> {
    let torrent = super.parseRowToTorrent(row, requestConfig)

    // 处理标题、副标题
    if (!torrent.title || !torrent.subTitle) {
      torrent = Object.assign(torrent, this.parseTorrentTitleFromRow(row))
    }

    // 处理时间（使用默认selector）
    torrent.time = this.parseTorrentTimeFromRow(row)

    // 处理分类
    if (!torrent.category) {
      torrent.category = this.parseCategoryFromRow(row)
    }

    return torrent
  }

  // 处理标题、副标题
  protected parseTorrentTitleFromRow (row: Element): { title?: string, subTitle?: string } {
    const testSelectors = [
      "a[href*='hit'][title]",
      "a[href*='hit']:has(b)",
      "a.tooltip[href*='hit']" // FIXME u2.dmhy.org 移动到对应站点模块
    ]

    let titleAnother
    for (let i = 0; i < testSelectors.length; i++) {
      const testTitleAnother = Sizzle(testSelectors[i], row as Element)
      if (testTitleAnother.length > 0) {
        titleAnother = testTitleAnother[0]
        break
      }
    }

    // 没有 titleAnother 则直接返回，不继续对 title和 subTitle 进行查找
    if (!titleAnother) {
      return {}
    }

    let title = (titleAnother.getAttribute('title') || titleAnother.textContent || '').trim()

    if (this.config.selector?.search?.title?.filters) {
      title = this.runQueryFilters(title, this.config.selector?.search?.title?.filters)
    }

    return {
      title,
      subTitle: this.parseTorrentSubTitleFromTitleAnother(titleAnother, row)
    }
  }

  protected parseTorrentSubTitleFromTitleAnother (titleAnother: Element, row: Element): string {
    let subTitle = ''
    try {
      const testSubTitle = titleAnother.parentElement!.innerHTML.split('<br>')
      if (testSubTitle && testSubTitle.length > 1) {
        subTitle = extractContent(testSubTitle[testSubTitle.length - 1]).trim()
      }
      if (this.config.selector?.search?.subTitle?.filters) {
        subTitle = this.runQueryFilters(subTitle, this.config.selector?.search?.subTitle?.filters)
      }
    } catch (e) {}
    return subTitle
  }

  protected parseTorrentTimeFromRow (row: Element): number {
    let time: number | string = 0
    const { selector: timeSelector } = this.config.selector!.search!.time!
    try {
      const timeAnother = Sizzle(timeSelector as string, row)[0]
      const AccurateTimeAnother = Sizzle('span[title], time[title]', timeAnother)
      if (AccurateTimeAnother.length > 0) {
        time = AccurateTimeAnother[0].getAttribute('title')!
      } else {
        time = extractContent(timeAnother.innerHTML.replace('<br>', ' '))
      }

      if (time.match(/\d+[分时天月年]/g)) {
        time = parseTimeToLive(time)
      } else {
        time = dayjs(time).unix()
      }
    } catch (e) {}
    return time as number
  }

  protected parseCategoryFromRow (row: Element): string {
    let category = 'Other'
    const categoryLinkAnother = Sizzle('a:first', row)

    if (categoryLinkAnother.length > 0) {
      const categoryImgAnother = Sizzle('img:first', categoryLinkAnother[0])

      if (categoryImgAnother.length > 0) {
        category = categoryImgAnother[0].getAttribute('title') ||
          categoryImgAnother[0].getAttribute('alt') ||
          category
      } else {
        category = categoryLinkAnother[0].textContent || category
      }
    }
    return category.trim()
  }

  async flushUserInfo (): Promise<UserInfo> {
    const lastUserInfo = await this.getLastUserInfo()
    let flushUserInfo: Partial<UserInfo> = {}

    let userId: number
    if (lastUserInfo !== null && lastUserInfo.id) {
      // 我们认为NPHP站的 id 的情况永远不变（实质上对于所有站点都应该是这样的）
      // ！！！ 部分 NPHP 站点允许修改 name，所以 name 不能视为不变 ！！！
      userId = lastUserInfo.id as number
    } else {
      // 如果没有 id 信息，则访问一次 index.php
      userId = await this.getUserIdFromIndexPage()
    }
    flushUserInfo.id = userId

    // 导入基本 Details 页面获取到的用户信息
    flushUserInfo = Object.assign(flushUserInfo, await this.getUserInfoFromDetailsPage(userId))

    // 导入用户做种信息
    if (typeof flushUserInfo.seeding === 'undefined' || typeof flushUserInfo.seedingSize === 'undefined') {
      flushUserInfo = Object.assign(flushUserInfo, await this.getUserSeedingStatus(userId))
    }

    return flushUserInfo as UserInfo
  }

  protected async getUserIdFromIndexPage (): Promise<number> {
    const { data: indexDocument } = await this.request<Document>({ url: '/index.php', responseType: 'document' })
    const userId = this.getFieldData(indexDocument, this.config.selector?.userInfo?.id!)
    return parseInt(userId)
  }

  protected async getUserInfoFromDetailsPage (
    userId: number,
    attrs: string[] = ['name', 'messageCount', 'uploaded', 'downloaded', 'levelName', 'bonus', 'joinTime']
  ): Promise<Partial<UserInfo>> {
    const { data: userDetailDocument } = await this.request({
      url: '/userdetails.php',
      params: { id: userId },
      responseType: 'document',
      checkLogin: true
    })
    const flushUserInfo: Partial<UserInfo> = {}

    for (const userInfoAttrValue of attrs) {
      if (this.config.selector?.userInfo![userInfoAttrValue]) {
        flushUserInfo[userInfoAttrValue] = this.getFieldData(userDetailDocument, this.config.selector?.userInfo![userInfoAttrValue])
      }
    }

    return flushUserInfo
  }

  protected async getUserSeedingStatus (userId: number): Promise<{ seeding: number, seedingSize: number }> {
    const seedStatus = {
      seeding: 0,
      seedingSize: 0
    }

    const { data: userSeedingDocument } = await this.request<Document | null>({
      url: '/getusertorrentlistajax.php',
      params: { userid: userId, type: 'seeding' },
      responseType: 'document' // 如果没有种子的时候，设置 document 会导致axios返回的data中没有数据
    })
    if (userSeedingDocument) {
      const trAnothers = Sizzle('tr:not(:eq(0))', userSeedingDocument) // FIXME selector
      if (trAnothers.length > 0) {
        seedStatus.seeding = trAnothers.length
        trAnothers.forEach(trAnother => {
          const sizeSelector = Sizzle('td.rowfollow:eq(2)', trAnother)[0] as HTMLElement // FIXME selector
          seedStatus.seedingSize += parseSizeString(sizeSelector.innerText)
        })
      }
    }

    return seedStatus
  }
}
