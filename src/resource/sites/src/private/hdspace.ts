import { ISiteMetadata } from '../../types';
import urlparse from 'url-parse';
import dayjs from '@ptpp/utils/plugins/dayjs';
import { findThenParseSizeString } from '@/shared/utils/filter';

export const siteMetadata: ISiteMetadata = {
  name: 'HD-Space',
  timezoneOffset: '+0000',
  description: 'Sharing The Universe',
  url: 'https://hd-space.org/',
  tags: ['影视'],
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/index.php',
      params: {
        page: 'torrents',
        active: 0
      }
    }
  },
  userInfo: {
    pickLast: ['id', 'name', 'joinTime'],
    process: [
      {
        requestConfig: { url: '/index.php' },
        fields: ['id', 'name', 'messageCount', 'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus', 'seeding']
      },
      {
        requestConfig: { url: '/index.php', params: { page: 'usercp' } },
        assertion: { id: 'uid' },
        fields: ['joinTime']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: 'table.lista > tbody > tr:has(a[href*="index.php?page=torrent-details"])' },
      id: {
        selector: 'a[href*="index.php?page=torrent-details"]',
        attr: 'href',
        filters: [
          (query: string) => urlparse(query, true).query.id
        ]
      },
      title: { selector: 'a[href*="index.php?page=torrent-details"]' },
      url: { selector: 'a[href*="index.php?page=torrent-details"]', attr: 'href' },
      link: { selector: 'a[href^="download.php]', attr: 'href' },
      time: {
        selector: '> td:eq(4)',
        filters: [
          // "July 11, 2015, 13:34:09", "Today|Yesterday at 20:04:23"
          (query: string) => {
            if (query.includes('at')) {
              query = query.replace('Today', dayjs().format('DD/MM/YYYY'));
              query = query.replace('Yesterday', dayjs().add(-1, 'day').format('DD/MM/YYYY'));
              query = query.replace(' at ', ' ');
              return dayjs(query, 'DD/MM/YYYY HH:mm:ss').valueOf();
            } else {
              return dayjs(query).valueOf();
            }
          }
        ]
      },
      size: { selector: '> td:eq(5)' },
      author: { selector: '> td:eq(6)' },
      category: { selector: '> td:eq(0) img', attr: 'alt', text: 'Other' },
      seeders: { selector: '> td:eq(7)' },
      leechers: { selector: '> td:eq(8)' },
      completed: { selector: '> td:eq(9)' },
      comments: { selector: '> td:eq(3)', filters: [(query: string) => query === '---' ? 0 : query] },
      tags: [
        { name: 'Free', selector: "img[src='gold/gold.png'], img[src='images/sf.png']" },
        { name: '50%', selector: "img[src='gold/silver.png']" }
      ]
    },
    userInfo: {
      // page: '/index.php'
      id: {
        selector: "a[href*='index.php?page=usercp']:first",
        attr: 'href',
        filters: [(query:string) => urlparse(query, true).query.uid]
      },
      name: {
        selector: "td[align='center'][style='text-align:center;']:contains('Welcome back')>span"
      },
      messageCount: {
        selector: ["a[href*='do=pm']"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/);
            return (queryMatch && queryMatch.length >= 2) ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      uploaded: {
        selector: ["td.green:contains('UP')"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["td.red:contains('DL')"],
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: "td.yellow:contains('Ratio')",
        filters: [
          (query: string) => parseFloat(query.replace(' Ratio: ', ''))
        ]
      },
      levelName: {
        selector: ["td[align='center'][style='text-align:center;']:contains('Rank')"],
        filters: [(query:string) => query.replace('Rank: ', '')]
      },
      bonus: {
        selector: ["td.green:contains('Bonus')"],
        filters: [(query:string) => query.replace('Bonus: ', '')]
      },
      seeding: {
        selector: ['#menu + table > tbody > tr > td:nth-child(4) b > font:nth-child(2)']
      },
      seedingSize: {
        text: 'N/A' // FIXME 实际是能获取到的
      },
      // page: '/index.php?page=usercp&uid=$user.id$',
      joinTime: {
        selector: ["td.header:contains('Joined on') + td"],
        filters: [(query: string) => dayjs(query).valueOf()]
      }
    }
  }
};
