import PrivateSite from '@/background/sites/schema/AbstractPrivateSite'
import { SearchRequestConfig, SiteConfig, SiteMetadata, Torrent, UserInfo } from '@/shared/interfaces/sites'
import Sizzle from 'sizzle'
import urlparse from 'url-parse'
import dayjs from '@/shared/utils/dayjs'
import { extractContent } from '@/shared/utils/common'
import { parseTimeToLive } from '@/shared/utils/filter'
import { merge } from 'lodash-es'

export default class NexusPHP extends PrivateSite {
  constructor (config: Partial<SiteConfig> = {}, siteMetaData: SiteMetadata) {
    super(config, siteMetaData)

    // 补充定义 search 信息
    this.config.search = merge({
      keywordsParam: 'search',
      requestConfig: {
        url: '/torrents.php'
      },
      defaultParams: [
        { key: 'notnewword', value: 1 }
      ]
    }, this.config.search || {})

    // 补充定义一些比较常见的 selector
    const baseLinkQuery = {
      selector: 'a[href*="download.php?id="]:has(> img[alt="download"])',
      attr: 'href'
    }

    this.config.selector = merge({
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
        tags: [] as { selector: string, name: string, color?: string }[]
      },
      detail: {},
      userInfo: {}
    }, this.config.selector || {})

    // 传入NPHP默认的优惠类型Tags
    this.config.selector!.search!.tags = [
      { name: 'Free', selector: 'img.pro_free, .free_bg, font.free', color: 'blue' },
      { name: '2xFree', selector: 'img.pro_free2up, .twoupfree_bg, font.twoupfree', color: 'green' },
      { name: '2xUp', selector: 'img.pro_2up, .twoup_bg, font.twoup', color: 'lime' },
      { name: '2x50%', selector: 'img.pro_50pctdown2up, .twouphalfdown_bg, font.twouphalfdown', color: 'light-green' },
      { name: '30%', selector: 'img.pro_30pctdown, .thirtypercentdown_bg, font.thirtypercent', color: 'indigo' },
      { name: '50%', selector: 'img.pro_50pctdown, .halfdown_bg, font.halfdown', color: 'orange' }
    ]// @ts-ignore
      .concat(this.config.selector!.search!.tags!)
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

    return {
      title: (titleAnother.getAttribute('title') || titleAnother.textContent || '').trim(),
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
    // TODO

    return super.flushUserInfo()
  }
}
