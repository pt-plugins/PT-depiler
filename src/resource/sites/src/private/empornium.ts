import { SiteMetadata } from '@/shared/interfaces/sites';
import urlparse from 'url-parse';
import { ETorrentStatus } from '@/shared/interfaces/enum';
import { findThenParseNumberString, findThenParseSizeString } from '@/shared/utils/filter';
import dayjs from '@/shared/utils/dayjs';

export const siteMetadata: SiteMetadata = {
  name: 'Empornium',
  timezoneOffset: '+0000',
  description: 'Empornium (EMP) is a Private Torrent Tracker for XXX',
  url: 'https://www.empornium.me/',
  tags: ['Adult'],
  legacyUrl: [
    'https://www.empornium.is/',
    'https://empornium.sx/'
  ],
  search: {
    keywordsParam: 'searchtext',
    requestConfig: {
      url: '/torrents.php',
      params: {
        order_by: 'time',
        order_way: 'desc',
        action: 'advanced'
      }
    },
    categories: [
      {
        name: 'Category',
        key: 'filter_cat',
        options: [
          { value: 1, name: 'Amateur' },
          { value: 2, name: 'Anal' },
          { value: 5, name: 'Asian' },
          { value: 6, name: 'BBW' },
          { value: 30, name: 'BDSM' },
          { value: 36, name: 'Big Ass' },
          { value: 8, name: 'Big Tits' },
          { value: 7, name: 'Black' },
          { value: 9, name: 'Classic' },
          { value: 37, name: 'Creampie' },
          { value: 10, name: 'Cumshot' },
          { value: 11, name: 'DVD-R' },
          { value: 12, name: 'Fetish' },
          { value: 14, name: 'Gang Bang / Orgy' },
          { value: 39, name: 'Gay / Bi' },
          { value: 56, name: 'Hairy' },
          { value: 35, name: 'Hardcore' },
          { value: 44, name: 'HD Porn' },
          { value: 3, name: 'Hentai / 3D' },
          { value: 25, name: 'Homemade' },
          { value: 43, name: 'Interracial' },
          { value: 16, name: 'Latina' },
          { value: 23, name: 'Lesbian' },
          { value: 52, name: 'Lingerie' },
          { value: 27, name: 'Magazines' },
          { value: 53, name: 'Manga / Comic' },
          { value: 18, name: 'Masturbation' },
          { value: 26, name: 'Mature' },
          { value: 40, name: 'Megapack' },
          { value: 41, name: 'Natural Tits' },
          { value: 17, name: 'Oral' },
          { value: 29, name: 'Other' },
          { value: 47, name: 'Parody' },
          { value: 24, name: 'Paysite' },
          { value: 21, name: 'Pictures / Images' },
          { value: 50, name: 'Piss' },
          { value: 55, name: 'Porn Music Videos' },
          { value: 46, name: 'Pregnant / Preggo' },
          { value: 51, name: 'Scat/Puke' },
          { value: 22, name: 'Siterip' },
          { value: 20, name: 'Softcore' },
          { value: 49, name: 'Squirt' },
          { value: 34, name: 'Straight' },
          { value: 19, name: 'Teen' },
          { value: 15, name: 'Transsexual' },
          { value: 45, name: 'Voyeur' },
          { value: 13, name: 'XXX Games / Apps' }
        ],
        cross: { mode: 'appendQuote' }
      }
    ]
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/index.php' },
        fields: ['id', 'name', 'messageCount', 'seeding', 'uploaded', 'downloaded', 'ratio', 'bonus']
      },
      {
        requestConfig: { url: '/user.php' },
        assertion: { id: 'id' },
        fields: ['joinTime', 'levelName', 'seedingSize']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: 'table.torrent_table.grouping > tbody > tr:gt(0)' },
      id: {
        selector: 'a[href^="/torrents.php?action=download&id="]',
        attr: 'href',
        filters: [
          (query: string) => urlparse(query, true).query.id
        ]
      },
      title: { selector: 'a[href^="/torrents.php?id="]' },
      url: { selector: 'a[href^="/torrents.php?id="]', attr: 'href' },
      link: { selector: 'a[href^="/torrents.php?action=download&id="]', attr: 'href' },
      time: { selector: 'td:nth-child(5) > span', attr: 'title' },
      size: { selector: 'td:nth-child(6)' },
      author: { selector: 'td:eq(9)' },
      category: {
        selector: 'a[href*="filter_cat"]',
        attr: 'href',
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)]=1/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 'Other';
          }
        ]
      },
      seeders: { selector: 'td:nth-child(8)' },
      leechers: { selector: 'td:nth-child(9)' },
      completed: { selector: 'td:nth-child(7)' },
      comments: { selector: 'td:eq(3)' },
      tags: [
        { name: 'Free', selector: "span[title*='Freeleech'], img[alt='Freeleech']" }
      ],
      progress: {
        text: 0,
        selector: ["a[title='Currently Seeding Torrent'], a[title='Previously Snatched Torrent']", "a[title='Previously Grabbed Torrent File']", ''],
        case: {
          "a[title='Currently Seeding Torrent'], a[title='Previously Snatched Torrent']": 100,
          "a[title='Previously Grabbed Torrent File']": 0
        }
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: ["a[title='Currently Seeding Torrent']", "a[title='Previously Snatched Torrent']", "a[title='Previously Grabbed Torrent File']"],
        case: {
          "a[title='Currently Seeding Torrent']": ETorrentStatus.seeding,
          "a[title='Previously Snatched Torrent']": ETorrentStatus.completed,
          "a[title='Previously Grabbed Torrent File']": ETorrentStatus.inactive
        }
      }

    },
    userInfo: {
      // page: '/index.php'
      id: {
        selector: ["a.username[href*='user.php']:first"],
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.id || '']
      },
      name: {
        selector: 'a.username'
      },
      messageCount: {
        text: 0,
        selector: ['div.alertbar'],
        filters: [() => 11]
      },
      seeding: {
        selector: ['#nav_seeding_r'],
        filters: [findThenParseNumberString]
      },
      uploaded: {
        selector: ["td:contains('Up:') + td"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["td:contains('Down:') + td"],
        filters: [findThenParseSizeString]
      },
      ratio: { selector: ["td:contains('Ratio:') + td"] },
      bonus: { selector: ["td:contains('Credits:') + td"] },
      // page: '/user.php?id=$user.id$'
      joinTime: {
        selector: ["li:contains('Joined:') > span.time"],
        attr: 'title',
        filters: [(query: string) => dayjs(query).valueOf()]
      },
      levelName: {
        selector: ['span.rank']
      },
      seedingSize: {
        selector: ["ul.stats.nobullet > li:contains('Seeding Size:')"],
        filters: [findThenParseSizeString]
      }
    }
  }
};
