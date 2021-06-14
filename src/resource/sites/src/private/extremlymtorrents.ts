import { ISiteMetadata } from '../../types';
import urlparse from 'url-parse';
import { findThenParseSizeString } from '@/shared/utils/filter';
import dayjs from '@ptpp/utils/plugins/dayjs';

export const siteMetadata: ISiteMetadata = {
  name: 'ExtremlymTorrents',
  timezoneOffset: '+0000',
  description: 'ExtremlymTorrents (XTR) is a Semi-Private tracker for MOVIES / TV / GENERAL',
  url: 'https://extremlymtorrents.ws/',
  tags: ['综合'],
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/torrents-search.php',
      params: {
        lang: 0, // 0 all 1 English 2 etc...
        sort: 'id',
        order: 'desc'
      }
    },
    categories: [
      {
        name: 'Category',
        key: 'cat',
        options: [
          { value: 22, name: '720p HD' },
          { value: 15, name: '1080p HD' },
          { value: 40, name: '4K UHD 2160p' },
          { value: 12, name: 'BluRay' },
          { value: 5, name: 'DVDRip' },
          { value: 16, name: 'BluRay 3D' },
          { value: 13, name: 'HDTV' },
          { value: 47, name: 'Porn UHD 4K -[+18]- xXx' },
          { value: 11, name: 'Porn -[+18]- xXx' },
          { value: 50, name: 'xXx iMAGESET (+18)' },
          { value: 41, name: 'TVRip' },
          { value: 6, name: 'Music Mp3 | FLAC' },
          { value: 9, name: 'Kvaluez | Cartoons' },
          { value: 8, name: 'Comics | EBook' },
          { value: 10, name: 'TV Episode | Season Complete' },
          { value: 27, name: 'DVD | PAL | NTSC' },
          { value: 25, name: 'WEBRip | WEB-DL' },
          { value: 35, name: 'BRRip | BDRip | HDRip' },
          { value: 3, name: 'Applications' },
          { value: 17, name: 'PSP | Playstation ' },
          { value: 30, name: 'PDTV | SDTV' },
          { value: 18, name: 'PS3 | Playstation 3 ' },
          { value: 46, name: 'PS4 | PlayStation 4' },
          { value: 20, name: 'Iphone iOS' },
          { value: 19, name: 'Androvalue Apk' },
          { value: 21, name: 'Pack' },
          { value: 49, name: 'TV UHD | 2160p | Episodes' },
          { value: 24, name: 'VvalueeoClip' },
          { value: 26, name: 'Wii Games' },
          { value: 31, name: "DOC's" },
          { value: 36, name: 'CAMRip | REC' },
          { value: 38, name: 'TS: TeleSync | HD-TS' },
          { value: 48, name: '4K | 2160p | Music Vvalueeo' },
          { value: 28, name: 'Anime | Japanese' },
          { value: 43, name: 'Hentai | Manga' },
          { value: 29, name: 'Windows PC' },
          { value: 7, name: 'Mac' },
          { value: 23, name: 'Linux' },
          { value: 32, name: 'GPS Navigation' },
          { value: 45, name: 'Vinyl Rip' },
          { value: 2, name: 'XBOX 360' },
          { value: 1, name: 'Games PC' },
          { value: 14, name: 'Wallpapers' },
          { value: 44, name: 'Bollywood' },
          { value: 42, name: 'X EXTERN ONLY MAGNET' },
          { value: 39, name: 'Sport TV' },
          { value: 39, name: 'Sport TV' }
        ],
        cross: { mode: 'append', key: 'c' }
      }
    ]
  },

  userInfo: {
    pickLast: ['id', 'name'],
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id', 'name']
      },
      {
        requestConfig: { url: '/account-details.php' },
        assertion: { id: 'id' },
        fields: ['uploaded', 'downloaded', 'levelName', 'joinTime']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: 'table.xtrz > tbody > tr[class^="ttable_col"]' },
      id: {
        selector: 'a[href^="file.php?id="]',
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.id]
      },
      title: {
        selector: 'a[href^="file.php?id="] b'
      },
      url: { selector: 'a[href^="file.php?id="]', attr: 'href' },
      link: { selector: 'a[href^="download.php?id="]', attr: 'href' },
      time: {
        selector: 'td:nth-last-child(1)',
        filters: [
          (query: string) => query.replace(/(\d{2}).(\d{2}).(\d{4})\n?(\d{2}:\d{2}:\d{2})/, '$3-$2-$1 $4')
        ]
      },
      size: { selector: 'td:nth-last-child(4)' },
      author: { selector: 'td:eq(3)' },
      category: {
        selector: 'a[href^="torrents.php?cat="]',
        attr: 'href',
        filters: [
          (query: string) => urlparse(query, true).query.cat
        ]
      },
      seeders: { selector: 'td:nth-last-child(3)' },
      leechers: { selector: 'td:nth-last-child(2)' },
      completed: { text: 'N/A' },
      comments: { text: 'N/A' },
      tags: [
        { name: 'Free', selector: "img[title='Free Torrents']" },
        { name: 'VIP', selector: "img[alt='Only VIP']" }
      ]
    },
    userInfo: {
      // page: '/',
      id: {
        selector: "a[href*='account-details.php']:first",
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.id || '']
      },
      name: {
        selector: "a[href*='account-details.php'][href*='id=']:first"
      },
      // page: '/account-details.php?id=$user.id$'
      uploaded: {
        selector: ["td.ttable_col2:contains('Uploaded:') + td"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["td.ttable_col2:contains('Downloaded:') + td"],
        filters: [findThenParseSizeString]
      },
      levelName: {
        selector: "td.ttable_col2:contains('User Class:') + td"
      },
      joinTime: {
        selector: "td.ttable_col2:contains('Joined:') + td",
        filters: [
          (query: string) => dayjs(query).isValid() ? dayjs(query).valueOf() : query
        ]
      },
      seeding: { text: 'N/A' },
      seedingSize: { text: 'N/A' },
      bonus: { text: 'N/A' }
    }
  }
};
