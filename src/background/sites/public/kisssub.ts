import { SearchRequestConfig, SiteMetadata, Torrent } from '@/shared/interfaces/sites'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import dayjs from '@/shared/utils/dayjs'

export const siteMetadata: SiteMetadata = {
  name: '爱恋动漫',
  description: '爱恋BT分享站，动画～漫画～游戏～动漫音乐～片源（RAW）～各类ACG资源聚集地～欢迎各大佬发布入住！',
  url: 'http://www.kisssub.org/',
  search: {
    path: '/search.php',
    keywordsParams: 'keyword'
  },
  selector: {
    search: {
      rows: { selector: 'table#listTable > tbody > tr' },
      id: {
        selector: 'td:nth-child(3) a',
        attr: 'href',
        filters: [
          (q: string) => q.match(/show-(.+?)\.html/)![1]
        ]
      },
      url: { selector: 'td:nth-child(3) a', attr: 'href' },
      title: { selector: 'td:nth-child(3) a' },
      time: {
        selector: 'td:nth-child(1)',
        filters: [
          (q: string) => {
            /**
             * 该站没有在列表页返回具体时间，返回格式如下：
             *   - 今天 xx:xx
             *   - 昨天 xx:xx
             *   - 前天 xx:xx
             *   - YYYY/MM/DD
             */
            const timeRawPattern = q.match(/([今昨前])天 ([\d:]+)/)
            if (timeRawPattern) {
              const standard = dayjs()
              if (timeRawPattern[1] === '昨') {
                standard.add(-1, 'days')
              } else if (timeRawPattern[1] === '前') {
                standard.add(-2, 'days')
              }

              return dayjs(`${standard.format('YYYY/MM/DD')} ${timeRawPattern[2]}`, 'YYYY/MM/DD HH:mm').unix()
            } else {
              return dayjs(q, 'YYYY/MM/DD').unix()
            }
          }
        ]
      },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(5)' },
      leechers: { selector: 'td:nth-child(6)' },
      completed: { selector: 'td:nth-child(7)' },
      category: { selector: 'td:nth-child(2)' }
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Kisssub extends BittorrentSite {
  protected transformRowsTorrent (row: Element, requestConfig: SearchRequestConfig): Partial<Torrent> {
    const transformTorrent = super.transformRowsTorrent(row, requestConfig)
    // 我们只要知道hash就可以种子了，但是如果不传入name的话，种子命名是 `{hash}.torrent`
    transformTorrent.link = `http://v2.uploadbt.com/?r=down&hash=${transformTorrent.id}&name=${encodeURIComponent(transformTorrent.title as string)}`

    return transformTorrent
  }
}
