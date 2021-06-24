/**
 * 旧版迁移，未经测试
 * Rhilip, 2021.4.25
 */
import { ISiteMetadata, ETorrentStatus } from '../../types';
import { findThenParseSizeString, parseSizeString } from '@ptpp/utils/filter';
import dayjs from '@ptpp/utils/plugins/dayjs';
import Sizzle from 'sizzle';
import urlparse from 'url-parse';

export const siteMetadata: ISiteMetadata = {
  name: 'Aidoru!Online',
  timezoneOffset: '+0000',
  description: 'Aidoru!Online is a Private Torrent Tracker for Female Japanese Idol related files',
  favicon: 'https://aidoru-online.me/themes/default/images/favicon.ico',
  url: 'https://aidoru-online.me/',
  legacyUrl: [
    'https://aidoru-online.org/'
  ],
  tags: ['偶像'],
  search: {
    keywordsParam: 'searchstr',
    requestConfig: {
      url: '/get_ttable.php',
      params: {
        pcat: 'Show All',
        subbed: '',
        deadlive: 1,
        sortcol: 'id',
        sortorder: 'desc',
        startdt: '',
        enddt: ''
      }
    },
    categories: [
      {
        name: 'Category',
        key: 'scat',
        options: [
          { value: 1, name: 'BD/DVDISO' },
          { value: 2, name: 'BD/DVD-RIP' },
          { value: 3, name: 'TV' },
          { value: 4, name: 'Perf' },
          { value: 5, name: 'PV' },
          { value: 6, name: 'Webstream' },
          { value: 7, name: 'Image' },
          { value: 8, name: 'Audio' },
          { value: 9, name: 'Album' },
          { value: 10, name: 'Single' },
          { value: 11, name: 'Radio' }
        ]
      }
    ]
  },
  userInfo: {
    process: [
      {
        requestConfig: {
          url: '/index.php'
        },
        fields: ['name', 'messageCount', 'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus']
      },
      {
        requestConfig: {
          url: '/account.php'
        },
        fields: ['joinTime', 'seeding', 'seedingSize']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.ttable_headinner tr.t-row:has(a[href^="download.php?id="])' },

      id: {
        selector: 'a[href^="torrents-details.php?id="]',
        attr: 'href',
        filters: [
          (query: string) => urlparse(query, true).query.id
        ]
      },
      title: {
        selector: 'a[href^="torrents-details.php?id="]',
        attr: 'title'
      },
      url: {
        selector: 'a[href^="torrents-details.php?id="]',
        attr: 'href'
      },
      link: {
        selector: 'a[href^="download.php?id="]',
        attr: 'href'
      },
      time: {
        selector: 'td:last-child',
        filters: [(query: string) => `20${query}`]
      },
      size: { selector: 'td.ttable_size' },
      author: { selector: 'td:eq(4)' },
      category: {
        selector: 'a.category-link',
        case: {
          ':contains("DVDISO")': 'BD/DVDISO',
          ':contains("DVD-RIP")': 'BD/DVD-RIP',
          ':contains("TV")': 'TV',
          ':contains("Perf")': 'Perf',
          ':contains("PV")': 'PV',
          ':contains("Webstream")': 'Webstream',
          ':contains("Image")': 'Image',
          ':contains("Audio")': 'Audio',
          ':contains("Album")': 'Album',
          ':contains("Single")': 'Single',
          ':contains("Radio")': 'Radio',
          ':contains("Misc")': 'Misc'
        }
      },
      seeders: { selector: 'td:nth-last-child(4)' },
      leechers: { selector: 'td:nth-last-child(3)' },
      completed: { selector: 'td:nth-last-child(2)' },
      comments: { selector: 'td:eq(5)' },

      progress: {
        text: 0,
        selector: 'td.ttable_seeding font',
        attr: 'color',
        filters: [
          (query: string) => {
            if (query === 'green') {
              return 100;
            } else if (query === 'black') {
              return 0;
            } else {
              return null;
            }
          }
        ]
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: 'td.ttable_seeding font',
        attr: 'color',
        filters: [
          (query: string) => {
            if (query === 'green') {
              return ETorrentStatus.seeding;
            } else if (query === 'black') {
              return ETorrentStatus.completed;
            } else if (query === '#ff0000') {
              return ETorrentStatus.downloading;
            } else {
              return ETorrentStatus.unknown;
            }
          }
        ]
      },

      tags: [
        { selector: 'img[src="images/freeleech.png"]', name: 'Free' },
        { selector: 'img[src="images/freeleech2.png"]', name: '2xFree' }
      ]
    },

    userInfo: {
      // page: '/index.php',
      name: {
        selector: '#main > table .myBlock-caption:first'
      },
      messageCount: {
        selector: ["a[href*='/forum/private.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      uploaded: {
        selector: [".myBlock-content td:contains('Uploaded:') + td"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: [".myBlock-content td:contains('Downloaded:') + td"],
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: [".myBlock-content td:contains('Ratio:') + td"]
      },
      levelName: {
        selector: [".myBlock-content td:contains('Class:') + td"]
      },
      bonus: {
        text: 'N/A'
      },

      // page: '/account.php'
      joinTime: {
        selector: ["td.prof-lbl:contains('Joined:') + td"],
        filters: [(query: string) => dayjs(query).valueOf()]
      },
      seeding: {
        selector: ["b:contains('Currently seeding')"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      seedingSize: {
        selector: ':self',
        elementProcess: (element: HTMLElement) => {
          let seedSize = 0;
          const sizeAnother = Sizzle("b:contains('Currently seeding') + br + table tr:not(:first-child) > td:nth-child(4)", element);
          sizeAnother.forEach(e => {
            seedSize += parseSizeString((e as HTMLElement).innerText.trim());
          });
          return seedSize;
        }
      }
    }
  }

};
