import { SiteMetadata } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'
import {
  findThenParseNumberString,
  findThenParseSizeString,
  findThenParseValidTimeString,
  parseSizeString
} from '@/shared/utils/filter'
import Sizzle from 'sizzle'

export const siteMetadata: SiteMetadata = {
  name: 'KaraGarga',
  timezoneOffset: '+0000',
  aka: ['KG'],
  url: 'https://karagarga.in/',
  tags: ['影视', '音乐', '文学'],
  collaborator: 'luckiestone',
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/browse.php',
      params: {
        search_type: 'torrent', // torrent, title, director, uploader, year, imdb
        cat: 0
      }
    }
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id', 'name', 'messageCount', 'bonus']
      },
      {
        requestConfig: { url: '/userdetails.php' },
        assertion: { id: 'id' },
        fields: ['uploaded', 'downloaded', 'ratio', 'levelName', 'joinTime']
      },
      {
        requestConfig: { url: '/current.php' },
        assertion: { id: 'id' },
        fields: ['seeding', 'seedingSize']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table#browse > tbody > tr:has(a[href^="browse.php?genre="])' },
      id: { selector: 'a[href^="details.php?id="]', attr: 'href', filters: [(q:string) => urlparse(q, true).query.id] },
      title: { selector: 'a[href^="details.php?id="]' },
      url: { selector: 'a[href^="details.php?id="]', attr: 'href' },
      link: { selector: 'a[href^="/down.php/"]', attr: 'href' },
      time: {
        selector: 'td:nth-child(9)',
        filters: [
          (query:string) => query.replace(/([A-Za-z]{3})\s(\d+)\s'(\d{2})/, '$2 $1 $3')
        ]
      },
      size: { selector: 'td:nth-child(11)' },
      author: { selector: 'td:eq(7)' },
      category: {
        selector: 'a[href^="browse.php?genre="] img',
        case: {
          'img[title^="Movie"]': 'Movies',
          'img[title^="Music"]': 'Music',
          'img[title^="Literature"]': 'Literature'
        }
      },
      seeders: { selector: 'td:nth-child(13)' },
      leechers: { selector: 'td:nth-child(14)' },
      completed: { selector: 'td:nth-child(12)', filters: [findThenParseNumberString] },
      comments: { selector: "a[href*='#startcomments']" }
    },
    userInfo: {
      id: {
        selector: "a[title='click to see your details page']:last",
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.id]
      },
      name: {
        selector: "a[title='click to see your details page']:last"
      },
      messageCount: {
        selector: ["td[style*='background: #DF0101'] a[href*='messages.php']"],
        filters: [findThenParseNumberString]
      },
      bonus: { text: 'N/A' },
      uploaded: {
        selector: ["td.rowhead:contains('Uploaded') + td"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["td.rowhead:contains('Downloaded') + td"],
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: "td.rowhead:contains('Share ratio') + td > table > tbody > tr > td:nth-child(1) > font",
        filters: [parseFloat]
      },
      levelName: {
        selector: ["td.rowhead:contains('Class') + td"]
      },
      joinTime: {
        selector: ["td.rowhead:contains('Join'):contains('date') + td"],
        filters: [
          (query:string) => {
            query = query.split(' (')[0]
            return findThenParseValidTimeString(query)
          }
        ]
      },
      seeding: {
        selector: ["table[id='browse'] > tbody"],
        elementProcess: [
          (tbody: HTMLElement) => {
            const trAnothers = Sizzle("> tr[style*='padding-top:0px']", tbody)
            return trAnothers.length
          }
        ]
      },
      seedingSize: {
        selector: ["table[id='browse'] > tbody > tr[style*='padding-top:0px']"],
        elementProcess: [
          (tbody: HTMLElement) => {
            let seedingSize = 0
            const trAnothers = Sizzle("> tr[style*='padding-top:0px']", tbody)
            trAnothers.forEach(trAnother => {
              const sizeAnother = Sizzle('td:eq(9)', trAnother)[0]
              seedingSize += parseSizeString((sizeAnother as HTMLElement).innerText.trim())
            })
            return seedingSize
          }
        ]
      }
    }
  }
}
