import { SiteMetadata } from '@/shared/interfaces/sites'
import { parseTimeToLive } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'ConCen',
  description: 'ConCen (Conspiracy Central) is a Public conspiracy related torrent index',
  url: 'https://concen.org/',
  search: {
    keywordsParams: 'title',
    categories: [
      {
        name: 'Order',
        key: 'order',
        options: [
          { name: 'Title', value: 'title' },
          { name: 'Uploaded', value: 'created' },
          { name: 'Size', value: 'size' },
          { name: 'Seeds', value: 'seeds' },
          { name: 'Peers', value: 'peers' },
          { name: 'Completed', value: 'completed' }
        ]
      },
      {
        name: 'Sort',
        key: 'sort',
        options: [
          { name: 'Descending', value: 'desc' },
          { name: 'Ascending', value: 'asc' }
        ]
      }
    ],
    defaultParams: [
      { key: 'title_op', value: 'allwords' },
      { key: 'title_1_op', value: 'not' },
      { key: 'title_1', value: '' },
      { key: 'seeds', value: '1' }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table  > tbody > tr:has(td.views-field-title)' },
      id: { selector: 'td.views-field-field-torrent a', attr: 'href', filters: [(q:string) => q.match(/(\d+)\.torrent$/)![1]] },
      title: { selector: 'td.views-field-title a' },
      url: { selector: 'td.views-field-title a', attr: 'href' },
      link: { selector: ['td.views-field-field-torrent a', 'td.views-field-name a'], attr: 'href' },
      time: { selector: 'td.views-field-created', filters: [parseTimeToLive] },
      size: { selector: 'td.views-field-size' },
      seeders: { selector: 'td.views-field-seeds' },
      leechers: { selector: 'td.views-field-peers' },
      completed: { selector: 'td.views-field-completed' }
    }
  }
}
