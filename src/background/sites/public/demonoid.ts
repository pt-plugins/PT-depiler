import { SiteMetadata } from '@/shared/interfaces/sites';
import urlparse from 'url-parse';

export const siteMetadata: SiteMetadata = {
  name: 'Demonoid',
  description: 'Demonoid is a Public torrent site for MOVIES / TV / GENERAL',
  url: 'https://www.demonoid.is/',
  legacyUrl: [
    'https://www.dnoid.to/',
    'https://www.dnoid.pw/'
  ],
  search: {
    requestConfig: {
      url: '/files/',
      params: {
        category: 0,
        subcategory: 0,
        language: 0,
        seeded: 2, // 0 seeded, 1 unseeded, 2 both
        quality: 0, // 0 all
        external: 2 // 0 Demonoid, 1 External, 2 Both
      }
    },
    keywordsParam: 'query',
    categories: [
      // 只做一级分类，不做二级分类
      {
        name: 'Category',
        key: 'category',
        options: [
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
      }
    ]
  },
  selector: {
    search: {
      // FIXME 以下部分未适配 merge 属性
      rows: { selector: 'table.font_12px tr:not([align])', merge: 2 },
      id: { selector: 'a[href^="/files/details/"]', attr: 'href' },
      title: { selector: 'a[href^="/files/details/"]' },
      url: { selector: 'a[href^="/files/details/"]', attr: 'href' },
      link: { selector: 'a[href^="/files/download"]', attr: 'href' },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(7)' },
      leechers: { selector: 'td:nth-child(8)' },
      completed: { selector: 'td:nth-child(6)' },
      comments: { text: 0, selector: 'td:nth-child(5)' },
      category: {
        selector: 'a[href*="category"]',
        attr: 'href',
        filters: [
          (q:string) => urlparse(q, true).query.category
        ]
      },
      author: { selector: 'a[href^="/users/"]' }
    }
  }
};
