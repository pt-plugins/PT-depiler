import { BittorrentSite } from '@/background/sites/schema/Abstract'
import axios from 'axios'
import urljoin from 'url-join'
import { generateDocumentFromString } from '@/shared/utils/common'

import { searchFilter, SearchResultItemCategory, SiteConfig, Torrent } from '@/shared/interfaces/sites'
import { sizeToNumber } from '@/shared/utils/filter'

export const siteConfig: SiteConfig = {
  name: 'Nyaa Torrents',
  description: '一个侧重于东亚（中国、日本及韩国）多媒体资源的BitTorrent站点，是世界上最大的动漫专用种子索引站。',
  url: 'https://nyaa.si/',
  categories: [
    {
      name: 'Filter',
      key: 'f',
      options: [
        { name: 'No filter', value: '0' },
        { name: 'No remakes', value: '1' },
        { name: 'Trusted only', value: '2' }
      ],
      cross: false
    },
    {
      name: 'Category',
      key: 'c',
      options: [
        { name: 'All categories', value: '0_0' },
        { name: 'Anime', value: '1_0' },
        { name: 'Anime - AMV', value: '1_1' },
        { name: 'Anime - English', value: '1_2' },
        { name: 'Anime - Non-English', value: '1_3' },
        { name: 'Anime - Raw', value: '1_4' },
        { name: 'Audio', value: '2_0' },
        { name: 'Audio - Lossless', value: '2_1' },
        { name: 'Audio - Lossy', value: '2_2' },
        { name: 'Literature', value: '3_0' },
        { name: 'Literature - English', value: '3_1' },
        { name: 'Literature - Non-English', value: '3_2' },
        { name: 'Literature - Raw', value: '3_3' },
        { name: 'Live Action', value: '4_0' },
        { name: 'Live Action - English', value: '4_1' },
        { name: 'Live Action - Idol/PV', value: '4_2' },
        { name: 'Live Action - Non-English', value: '4_3' },
        { name: 'Live Action - Raw', value: '4_4' },
        { name: 'Pictures', value: '5_0' },
        { name: 'Pictures - Graphics', value: '5_1' },
        { name: 'Pictures - Photos', value: '5_2' },
        { name: 'Software', value: '6_0' },
        { name: 'Software - Apps', value: '6_1' },
        { name: 'Software - Games', value: '6_2' }
      ],
      cross: false
    }
  ]
}

// noinspection JSUnusedGlobalSymbols
export default class Nyaa extends BittorrentSite {
  protected readonly siteConfig = siteConfig;

  generateDetailPageLink (id: string): string {
    return urljoin(this.config.url, `/view/${id}`)
  }

  async searchTorrents (filter: searchFilter): Promise<Torrent[]> {
    // 生成请求参数
    const params: any = {}
    if (filter.keywords) {
      params.q = filter.keywords
    }

    filter.categories?.forEach(category => {
      const { key, value } = category
      params[key] = value
    })

    // 请求页面并转化为document
    const req = await axios.get(this.config.url, {
      params
    })
    const doc = generateDocumentFromString(req.data)

    const torrents: Torrent[] = []

    // 处理表行
    const trs = doc.querySelectorAll('table.torrent-list > tbody > tr')
    trs?.forEach(tr => {
      const tds = tr.querySelectorAll('td')
      const categoryAnother = tds[0].querySelector('a')
      const nameAndCommentAnother = tds[1].querySelectorAll('a')
      const nameAnother = nameAndCommentAnother[nameAndCommentAnother.length - 1]

      const downloadLinkAnother = tds[2].querySelectorAll('a')

      const category: SearchResultItemCategory = {
        name: categoryAnother!.getAttribute('title') as string,
        link: urljoin(this.config.url, categoryAnother!.getAttribute('href') as string)
      }
      const detailPageUri = nameAnother!.getAttribute('href') as string
      const title = nameAnother!.getAttribute('title') as string
      const downloadLinks = Array.from(downloadLinkAnother).map(t => {
        let uri = t.getAttribute('href') as string
        if (!uri.startsWith('magnet')) {
          uri = urljoin(this.config.url, uri)
        }
        return uri
      })

      let comments = 0
      if (nameAndCommentAnother.length > 1) {
        comments = parseInt(nameAndCommentAnother[0].innerText)
      }

      torrents.push({
        id: parseInt(detailPageUri.match(/(\d+)/)![0]),
        title,
        url: urljoin(this.config.url, detailPageUri),
        link: downloadLinks[0],
        time: tds[4].dataset.timestamp,
        size: sizeToNumber(tds[3].innerText),
        seeders: parseInt(tds[5].innerText),
        leechers: parseInt(tds[6].innerText),
        completed: parseInt(tds[7].innerText),
        comments,
        category
      } as Torrent)
    })

    return torrents
  }
}
