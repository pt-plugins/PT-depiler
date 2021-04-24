import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: 'AniDex',
  description: 'A torrent tracker specialising in content from East Asia, including anime, manga, music, adult videos and more.',
  tags: ['anime', 'manga', 'jav', 'download', 'anidex', 'magnet'],
  url: 'https://anidex.info',
  search: {
    keywordsParam: 'q',
    requestConfig: {
      params: { page: 'search' }
    },
    categories: [
      {
        name: 'Category',
        key: 'id',
        options: [
          { name: 'All', value: '0' },
          { name: 'Anime', value: '1,2,3' },
          { name: 'Live Action', value: '4,5' },
          { name: 'Light Novel', value: '6' },
          { name: 'Manga', value: '7,8' },
          { name: 'Music', value: '9,10,11' },
          { name: 'Games', value: '12' },
          { name: 'Applications', value: '13' },
          { name: 'Pictures', value: '14' },
          { name: 'Adult Video', value: '15' },
          { name: 'Other', value: '16' }
        ]
      },
      {
        name: 'Sort',
        key: 's',
        options: [
          { name: 'Filename', value: 'filename' },
          { name: 'File Size', value: 'size' },
          { name: 'Created', value: 'upload_timestamp' },
          { name: 'Seeders', value: 'seeders' },
          { name: 'Leechers', value: 'leechers' },
          { name: 'Completed', value: 'completed' }
        ]
      },
      {
        name: 'Order',
        key: 'o',
        options: [
          { name: 'Descending', value: 'desc' },
          { name: 'Ascending', value: 'asc' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'div#content > div.table-responsive > table > tbody > tr' },
      id: { selector: 'td:nth-child(3) a', attr: 'id' },
      title: { selector: 'td:nth-child(3) a span[title]', attr: 'title' },
      url: { selector: 'td:nth-child(3) a', attr: 'href' },
      link: { selector: ['td:nth-child(5) a', 'td:nth-child(6) a'], attr: 'href' },
      time: { selector: 'td:nth-child(8)', attr: 'title' },
      size: { selector: 'td:nth-child(7)' },
      seeders: { selector: 'td:nth-child(9)' },
      leechers: { selector: 'td:nth-child(10)' },
      completed: { selector: 'td:nth-child(11)' },
      comments: { selector: 'td:nth-child(4) a[href$="#comments"]' },
      category: { selector: 'td:nth-child(1) a' }
    }
  }
}
