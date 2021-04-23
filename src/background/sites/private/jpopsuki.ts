import { SiteMetadata, Torrent, UserInfo } from '@/shared/interfaces/sites'
import Gazelle from '@/background/sites/schema/Gazelle'
import Sizzle from 'sizzle'
import { parseSizeString } from '@/shared/utils/filter'
import urlparse from 'url-parse'

export const siteMetadata: SiteMetadata = {
  name: 'JPopsuki',
  timezoneOffset: '+0000',
  description: '日韩音乐',
  url: 'https://jpopsuki.eu/',
  tags: ['音乐', '日韩'],
  schema: 'Gazelle',
  search: {
    categories: [
      {
        name: 'Category',
        key: 'filter_cat',
        options: [
          { value: 1, name: 'Album' },
          { value: 2, name: 'Single' },
          { value: 3, name: 'PV' },
          { value: 4, name: 'DVD' },
          { value: 5, name: 'TV-Music' },
          { value: 6, name: 'TV-Variety' },
          { value: 7, name: 'TV-Drama' },
          { value: 8, name: 'Fansubs' },
          { value: 9, name: 'Pictures' },
          { value: 10, name: 'Misc' }
        ]
      }
    ]
  },
  selector: {
    search: {
      // 对于特定站点，不使用自动生成列表，而是直接指定selector
      time: { selector: '> td:eq(5)' },
      size: { selector: '> td:eq(6)' },
      completed: { selector: '> td:eq(7)' },
      seeders: { selector: '> td:eq(8)' },
      leechers: { selector: '> td:eq(9)' },
      comments: { text: 0, selector: 'a[href*="#comments"][title="View Comments"]' },
      category: { selector: '> td:eq(1) > a' },

      link: { selector: "a[href*='torrents.php?action=download'][title='Download']", attr: 'href' },

      tags: [
        { selector: "strong:contains('Freeleech!')", name: 'Free' }
      ]
    },
    userInfo: {
      seeding: {
        selector: "div:contains('Community') + ul.stats > li:contains('Seeding:')",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/Seeding.+?([\d.]+)/)
            return (queryMatch && queryMatch.length >= 2) ? parseInt(queryMatch[1]) : 0
          }
        ]
      },
      messageCount: {
        selector: ["#alerts > .alertbar > a[href='notice.php']", "div.alertbar > a[href*='inbox.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/)
            return (queryMatch && queryMatch.length >= 2) ? parseInt(queryMatch[1]) : 0
          }
        ]
      }
    }
  }
}

export default class jpopsuki extends Gazelle {
  protected transformSearchPage (doc: Document): Torrent[] {
    const torrents: Torrent[] = []

    const rows = Sizzle('table.torrent_table:last > tbody > tr:gt(0)', doc) as HTMLElement[]

    let albumAttr: Partial<Torrent> = {}
    for (let i = 0; i < rows.length; i++) {
      const tr = rows[i] as HTMLTableRowElement

      const titleAnother = Sizzle("a[href*='torrents.php?id=']:first", tr)
      if (titleAnother.length === 0) {
        continue
      }

      // 检查 tr 的类型
      let torrent = {} as Torrent
      if (tr.classList.contains('group_redline')) { // 专辑行，获取title信息
        albumAttr = this.getFieldsData(tr, 'search', ['comments', 'category'])

        // 移除掉其他无关元素后的作为专辑标题
        const albumRow = (Sizzle('> td:eq(3)', tr)[0]).cloneNode(true) as HTMLElement
        Sizzle(">span, div.tags, a[title='View Comments']", albumRow).forEach(e => e.remove())
        albumAttr.title = albumRow.innerText.trim()
        continue
      } else if (tr.classList.contains('group_torrent_redline')) { // 专辑对应的不同格式行
        // 补全前面的单元格，使后续的 selector 能正常生效
        tr.insertCell(0)
        tr.insertCell(0)
        tr.insertCell(0)

        torrent = { ...albumAttr, ...torrent } // 传入专辑信息，并将格式信息作为 subTitle
        torrent.subTitle = this.getFieldData(tr, { selector: '> td:eq(3) > a[href*="torrents.php?id="]' })
      } else if (tr.classList.contains('torrent_redline') || tr.classList.contains('torrent')) { // 单种行
        const cloneTitleAnother = titleAnother[0].parentElement!.cloneNode(true) as HTMLElement
        Sizzle(">span, div.tags, a[title='View Comments']", cloneTitleAnother).forEach(e => e.remove())
        torrent.title = cloneTitleAnother.innerText.trim()
      } else {
        continue
      }

      if (torrent.title) {
        torrent.title = torrent.title.replace(/\t+/g, ' ').replace(/\(\d*\)$/, '').trim()
      }

      torrent = this.parseRowToTorrent(tr, torrent) as Torrent
      torrents.push(torrent)
    }
    return torrents
  }

  private async getUserTorrentList (userId: number, page: number = 0, type: string = 'seeding'): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: '/torrents.php',
      params: {
        userid: userId, page, type
      },
      responseType: 'document'
    })
    return TListDocument
  }

  async flushUserInfo (): Promise<UserInfo> {
    const flushUserInfo = await super.flushUserInfo()

    if (flushUserInfo.id) {
      let seedingSize = 0

      const pageInfo = { count: 0, current: 0 } // 生成页面信息
      for (;pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const TListDocument = await this.getUserTorrentList(flushUserInfo.id as number, pageInfo.current)
        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TListDocument, {
            selector: ["a[href*='torrents.php?page=']:contains('Last'):last"],
            attr: 'href',
            filters: [(query: string) => parseInt(urlparse(query, true).query.page as string) || -1]
          })
        }

        const torrentAnothers = Sizzle('tr.torrent', TListDocument)
        torrentAnothers.forEach(element => {
          const sizeAnother = Sizzle('td:eq(5)', element)
          if (sizeAnother && sizeAnother.length >= 0) {
            seedingSize += parseSizeString((sizeAnother[0] as HTMLElement).innerText.trim())
          }
        })
      }

      // 更新做种信息
      flushUserInfo.seedingSize = seedingSize
    }
    return flushUserInfo
  }
}
