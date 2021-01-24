import { SearchRequestConfig, SiteMetadata, Torrent } from '@/shared/interfaces/sites'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import Sizzle from 'sizzle'
import { generateCategoryMap } from '@/shared/utils/common'
import urlparse from 'url-parse'

const CategoryOptions = [
  { name: 'All', value: 0 },
  { name: 'Applications', value: 1 },
  { name: 'Audio Books', value: 2 },
  { name: 'Books', value: 3 },
  { name: 'Comics', value: 4 },
  { name: 'Games', value: 5 },
  { name: 'Japanese Anime', value: 6 },
  { name: 'Miscellaneous', value: 7 },
  { name: 'Movies', value: 8 },
  { name: 'Music', value: 9 },
  { name: 'Music Videos', value: 10 },
  { name: 'Pictures', value: 11 },
  { name: 'TV', value: 12 },
  { name: 'All', value: 0 },
  { name: 'Applications', value: 1 },
  { name: 'Audio Books', value: 2 },
  { name: 'Books', value: 3 },
  { name: 'Comics', value: 4 },
  { name: 'Games', value: 5 },
  { name: 'Japanese Anime', value: 6 },
  { name: 'Miscellaneous', value: 7 },
  { name: 'Movies', value: 8 },
  { name: 'Music', value: 9 },
  { name: 'Music Videos', value: 10 },
  { name: 'Pictures', value: 11 },
  { name: 'TV', value: 12 }
]

const CategoryMap = generateCategoryMap(CategoryOptions)

export const siteMetadata: SiteMetadata = {
  name: 'Demonoid',
  description: 'Demonoid is a Public torrent site for MOVIES / TV / GENERAL',
  url: 'https://www.demonoid.is/',
  legacyUrl: [
    'https://www.dnoid.to/',
    'https://www.dnoid.pw/'
  ],
  search: {
    path: '/files/',
    keywordsParams: 'query',
    categories: [
      // 只做一级分类，不做二级分类
      {
        name: 'Category',
        key: 'category',
        options: CategoryOptions
      }
    ],
    defaultParams: [
      { key: 'category', value: 0 },
      { key: 'subcategory', value: 0 },
      { key: 'language', value: 0 },
      { key: 'seeded', value: 2 }, // 0 seeded, 1 unseeded, 2 both
      { key: 'quality', value: 0 }, // 0 all
      { key: 'external', value: 2 } // 0 Demonoid, 1 External, 2 Both
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.font_12px tr:not([align])' }, // 注意这里选出来2x 列，所以我们要重写 transformSearchPage 方法
      id: { selector: 'a[href^="/files/details/"]', attr: 'href' },
      title: { selector: 'a[href^="/files/details/"]' },
      url: { selector: 'a[href^="/files/details/"]', attr: 'href' },
      link: { selector: 'a[href^="/files/downloa,d"]', attr: 'href' },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(7)' },
      leechers: { selector: 'td:nth-child(8)' },
      completed: { selector: 'td:nth-child(6)' },
      comments: { text: 0, selector: 'td:nth-child(5)' },
      category: {
        selector: 'a[href*="category"]',
        attr: 'href',
        filters: [
          (q:string) => CategoryMap.get(parseInt(urlparse(q, true).query.category as string))
        ]
      },
      author: { selector: 'a[href^="/users/"]' }
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Demonoid extends BittorrentSite {
  protected transformSearchPage (doc: Document, requestConfig: SearchRequestConfig): Torrent[] {
    const rowsSelector = this.config.selector!.search!.rows!
    const torrents: Torrent[] = []

    const tr2s = Sizzle(rowsSelector.selector as string, doc)
    for (let i = 0; i < tr2s.length; i += 2) {
      torrents.push({
        ...this.transformRowsTorrent(tr2s[i], requestConfig),
        ...this.transformRowsTorrent(tr2s[i + 1], requestConfig)
      } as Torrent)
    }

    return torrents
  }
}
