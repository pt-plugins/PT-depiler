import { SiteMetadata } from '@/shared/interfaces/sites'
import { parseTimeToLive } from '@/shared/utils/filter'
import dayjs from 'dayjs'
import urlparse from 'url-parse'

export const siteMetadata: SiteMetadata = {
  name: 'TorrentGalaxy.org',
  description: 'TorrentGalaxy.org (TGx) is a Public site for TV / MOVIES / GENERAL',
  url: 'https://torrentgalaxy.to/',
  legacyUrl: [
    'https://torrentgalaxy.mx/',
    'https://torrentgalaxy.su/'
  ],
  search: {
    requestConfig: {
      url: '/torrents.php',
      params: { lang: 0 }
    },
    keywordsParam: 'search',
    categories: [
      {
        name: 'Category',
        key: 'cat',
        options: [
          { value: 28, name: 'Anime - All' },
          { value: 20, name: 'Apps - Mobile' },
          { value: 19, name: 'Apps - OS' },
          { value: 21, name: 'Apps - Other' },
          { value: 18, name: 'Apps - Windows' },
          { value: 13, name: 'Books - Audiobooks' },
          { value: 12, name: 'Books - Ebooks' },
          { value: 14, name: 'Books - Education' },
          { value: 15, name: 'Books - Magazine' },
          { value: 9, name: 'Documentaries - All' },
          { value: 11, name: 'Games - Console' },
          { value: 43, name: 'Games - Mobile' },
          { value: 17, name: 'Games - Other' },
          { value: 10, name: 'Games - Windows' },
          { value: 3, name: 'Movies - 2K/4K UHD' },
          { value: 46, name: 'Movies - Bollywood' },
          { value: 45, name: 'Movies - CAM/TS' },
          { value: 42, name: 'Movies - HD' },
          { value: 4, name: 'Movies - Packs' },
          { value: 1, name: 'Movies - SD' },
          { value: 22, name: 'Music - Albums' },
          { value: 26, name: 'Music - Discography' },
          { value: 23, name: 'Music - Lossless' },
          { value: 25, name: 'Music - Musicvideo' },
          { value: 24, name: 'Music - Singles' },
          { value: 40, name: 'Other - Other' },
          { value: 37, name: 'Other - Pictures' },
          { value: 33, name: 'Other - Training' },
          { value: 41, name: 'TV - Episodes HD' },
          { value: 5, name: 'TV - Episodes SD' },
          { value: 6, name: 'TV - Packs' },
          { value: 7, name: 'TV - Sports' },
          { value: 35, name: 'XXX - HD' },
          { value: 47, name: 'XXX - Misc' },
          { value: 34, name: 'XXX - SD' }
        ],
        cross: { mode: 'append', key: 'c' }
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'div.tgxtable > div:has(div[class="tgxtablecell shrink"])' },
      id: { selector: 'div a[href^="/torrent/"]', attr: 'href', filters: [(q:string) => q.match(/torrent\/(\d+)/)![1]] },
      title: { selector: 'div a[href^="/torrent/"]', attr: 'title' },
      url: { selector: 'div a[href^="/torrent/"]', attr: 'href' },
      link: { selector: ['div a[href^="magnet:?"]', 'a[href^="https://watercache.nanobytes.org/get"]'], attr: 'href' },
      time: {
        selector: 'div td:last-of-type',
        filters: [(q:string) => {
          if (/ago/.test(q)) {
            return parseTimeToLive(q)
          } else {
            return dayjs(q, 'DD/MM/YY Z').unix()
          }
        }]
      },
      size: { selector: 'div span[style^="border-radius"]' },
      seeders: { selector: 'div span[title="Seeders/Leechers"] font b' },
      leechers: { selector: 'div span[title="Seeders/Leechers"] font:nth-child(2) b' },
      category: {
        selector: 'div a[href^="/torrents.php?cat="]',
        attr: 'href',
        filters: [
          (q:string) => urlparse(q, true).query.cat!
        ]
      },
      comments: { text: 0, selector: 'a[href^="/comments.php]' },
      author: { selector: 'span.username' }
    }
  }
}
