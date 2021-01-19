import { BittorrentSite } from '@/background/sites/schema/Abstract'
import { AxiosRequestConfig } from 'axios'
import urljoin from 'url-join'
import { sizeToNumber } from '@/shared/utils/filter'
import { searchCategories, searchFilter, SiteConfig, Torrent } from '@/shared/interfaces/sites'

export const nyaaCommonFilter: searchCategories[] = [
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
    name: 'Sort',
    key: 's',
    options: [
      { name: 'Created', value: 'id' },
      { name: 'Size', value: 'size' },
      { name: 'Seeders', value: 'seeders' },
      { name: 'Leechers', value: 'leechers' },
      { name: 'Downloaders', value: 'downloads' },
      { name: 'Comments', value: 'comments' }
    ]
  },
  {
    name: 'Order',
    key: 'o',
    options: [
      { name: 'Desc', value: 'desc' },
      { name: 'Asc', value: 'asc' }
    ]
  }
]

export const siteConfig: SiteConfig = {
  name: 'Nyaa Torrents',
  description: '一个侧重于东亚（中国、日本及韩国）多媒体资源的BitTorrent站点，是世界上最大的动漫专用种子索引站。',
  url: 'https://nyaa.si/',
  categories: [
    ...nyaaCommonFilter,
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
  ],
  search: {
    type: 'document',
    defaultParams: [
      { key: 'c', value: '0_0' }
    ]
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Nyaa extends BittorrentSite {
  protected readonly siteConfig = siteConfig;

  generateDetailPageLink (id: string): string {
    return urljoin(this.config.url, `/view/${id}`)
  }

  transformSearchFilter (filter: searchFilter): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      baseURL: this.config.url,
      url: '/',
      params: {}
    }
    if (filter.keywords) {
      config.params.q = filter.keywords
    }

    this.config.search.defaultParams.concat(filter.categories || []).forEach(category => {
      const { key, value } = category
      config.params[key] = value
    })

    return config
  }

  transformSearchPage (doc: Document): Torrent[] {
    const torrents: Torrent[] = []

    const trs = doc.querySelectorAll('table.torrent-list > tbody > tr')
    trs?.forEach(tr => {
      torrents.push({
        id: this.getFieldData(tr, {
          selector: 'td:nth-child(2) a:last-of-type',
          attribute: 'href',
          filters: [
            (q: string) => parseInt(q.match(/(\d+)/)![0])
          ]
        }),
        title: this.getFieldData(tr, { selector: 'td:nth-child(2) a:last-of-type', attribute: 'title' }),
        url: this.fixLink(this.getFieldData(tr, { selector: 'td:nth-child(2) a:last-of-type', attribute: 'href' }) as string),
        link: this.fixLink(this.getFieldData(tr, { selector: 'td:nth-child(4) a', attribute: 'href' }) as string),
        time: this.getFieldData(tr, { selector: 'td:nth-child(5)', data: 'timestamp' }),
        size: this.getFieldData(tr, { selector: 'td:nth-child(4)', filters: [sizeToNumber] }),
        seeders: this.getFieldData(tr, { selector: 'td:nth-child(6)', filters: [parseInt] }),
        leechers: this.getFieldData(tr, { selector: 'td:nth-child(7)', filters: [parseInt] }),
        completed: this.getFieldData(tr, { selector: 'td:nth-child(8)', filters: [parseInt] }),
        comments: this.getFieldData(tr, {
          selector: 'td:nth-child(2) a.comments',
          filters: [(q:string) => parseInt(q) || 0]
        }),
        category: this.getFieldData(tr, { selector: 'td:nth-child(1) a', attribute: 'title' })
      } as Torrent)
    })

    return torrents
  }
}
