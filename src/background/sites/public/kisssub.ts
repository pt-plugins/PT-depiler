import { searchFilter, SiteConfig, Torrent } from '@/shared/interfaces/sites'
import { BittorrentSite } from '@/background/sites/schema/Abstract'
import urljoin from 'url-join'
import { AxiosRequestConfig } from 'axios'
import dayjs from '@/shared/utils/dayjs'
import { sizeToNumber } from '@/shared/utils/filter'

export const siteConfig: SiteConfig = {
  name: '爱恋动漫',
  description: '爱恋BT分享站，动画～漫画～游戏～动漫音乐～片源（RAW）～各类ACG资源聚集地～欢迎各大佬发布入住！',
  url: 'http://www.kisssub.org/',
  search: {
    type: 'document'
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Kisssub extends BittorrentSite {
  protected readonly siteConfig = siteConfig;

  generateDetailPageLink (id: string): string {
    return urljoin(this.config.url, `/show-${id}.html`)
  }

  transformSearchFilter (filter: searchFilter): AxiosRequestConfig {
    return {
      baseURL: this.config.url,
      url: '/search.php',
      params: {
        keyword: filter.keywords
      }
    } as AxiosRequestConfig
  }

  transformSearchPage (doc: Document): Torrent[] {
    const torrents: Torrent[] = []
    const trs = doc.querySelectorAll('table#listTable > tbody > tr')

    trs.forEach(tr => {
      const url = this.fixLink(this.getFieldData(tr, { selector: 'td:nth-child(3) a', attribute: 'href' }) as string)
      const title = this.getFieldData(tr, { selector: 'td:nth-child(3) a' })
      const id = url.match(/show-(.+?)\.html/)![1]

      /**
       * 该站没有在列表页返回具体时间，返回格式如下：
       *   - 今天 xx:xx
       *   - 昨天 xx:xx
       *   - 前天 xx:xx
       *   - YYYY/MM/DD
       */
      const timeRaw = this.getFieldData(tr, { selector: 'td:nth-child(1)' }) as string
      const timeRawPattern = timeRaw.match(/([今昨前])天 ([\d:]+)/)
      let time
      if (timeRawPattern) {
        const standard = dayjs()
        if (timeRawPattern[1] === '昨') {
          standard.add(-1, 'days')
        } else if (timeRawPattern[1] === '前') {
          standard.add(-2, 'days')
        }

        time = dayjs(`${standard.format('YYYY/MM/DD')} ${timeRawPattern[2]}`, 'YYYY/MM/DD HH:mm').unix()
      } else {
        time = dayjs(timeRaw, 'YYYY/MM/DD').unix()
      }

      torrents.push({
        id,
        title,
        url,
        // 我们只要知道hash就可以种子了，但是如果不传入name的话，种子命名是 `{hash}.torrent`
        link: `http://v2.uploadbt.com/?r=down&hash=${id}&name=${title}`,
        time,
        size: this.getFieldData(tr, { selector: 'td:nth-child(4)', filters: [sizeToNumber] }),
        seeders: this.getFieldData(tr, { selector: 'td:nth-child(5)', filters: [parseInt] }),
        leechers: this.getFieldData(tr, { selector: 'td:nth-child(6)', filters: [parseInt] }),
        completed: this.getFieldData(tr, { selector: 'td:nth-child(7)', filters: [parseInt] }),
        comments: 0, // 该站没有评论
        category: this.getFieldData(tr, { selector: 'td:nth-child(2)' })
      } as Torrent)
    })

    return torrents
  }
}
