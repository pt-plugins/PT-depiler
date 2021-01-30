import { SiteMetadata } from '@/shared/interfaces/sites'
import { generateCategoryMap } from '@/shared/utils/common'
import urlparse from 'url-parse'
import dayjs from '@/shared/utils/dayjs'

const CategoryOptions = [
  { name: 'All', value: 0 },
  { name: 'Anime', value: 1 },
  { name: 'Non-English', value: 10 },
  { name: 'Manga', value: 3 },
  { name: 'Drama', value: 8 },
  { name: 'Music', value: 2 },
  { name: 'Music Video', value: 9 },
  { name: 'Raws', value: 7 },
  { name: 'Hentai', value: 4 },
  { name: 'Hentai (Anime)', value: 12 },
  { name: 'Hentai (Manga)', value: 13 },
  { name: 'Hentai (Games)', value: 14 },
  { name: 'Batch', value: 11 },
  { name: 'JAV', value: 15 },
  { name: 'Other', value: 5 }
]

const CategoryMap = generateCategoryMap(CategoryOptions)

export const siteMetadata: SiteMetadata = {
  name: 'Tokyo Toshokan',
  description: 'A BitTorrent Library for Japanese Media',
  url: 'https://www.tokyotosho.info/',
  search: {
    requestConfig: { url: '/search.php' },
    keywordsParam: 'terms',
    categories: [
      { name: 'Category', key: 'type', options: CategoryOptions }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.listing tr.category_0', merge: 2 },
      id: { selector: 'tr:nth-child(1) a[href^="details.php?id="]', attr: 'href', filters: [(q:string) => urlparse(q, true).query.id] },
      title: { selector: 'tr:nth-child(1) td.desc-top a[type="application/x-bittorrent"]' },
      url: { selector: 'tr:nth-child(1)  a[href^="details.php?id="]', attr: 'href' },
      link: { selector: ['tr:nth-child(1) td.desc-top a[type="application/x-bittorrent"]', 'tr:nth-child(1) td.desc-top a[href^="magnet:?xt="]'], attr: 'href' },
      time: {
        selector: 'tr:nth-child(2) td.desc-bot',
        filters: [
          (q: string) => dayjs(q
            .match(/Date: (.+?) \|?/)![1]
            .replace('UTC', '+00:00')).unix()
        ]
      },
      size: { selector: 'tr:nth-child(2) td.desc-bot', filters: [(q:string) => q && q.match(/Size: (.+?) \|?/)![1]] },
      seeders: { selector: 'tr:nth-child(2) td.stats > span:nth-child(1)' },
      leechers: { selector: 'tr:nth-child(2) td.stats > span:nth-child(2)' },
      completed: { selector: 'tr:nth-child(2) td.stats > span:nth-child(3)' },
      category: { selector: 'tr:nth-child(1) a[href*="cat"]', attr: 'href', filters: [(q:string) => CategoryMap.get(parseInt(urlparse(q, true).query.cat!))] },
      author: { selector: 'tr:nth-child(2) td.desc-bot', filters: [(q:string) => q && q.match(/Submitter: (.+?) \|?/)![1]] }
    }
  }
}
