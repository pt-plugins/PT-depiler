/**
 * 综合 Jackett 配置和旧版配置改写，未经测试
 * Rhilip, 2021.04.23
 */
import { ISiteMetadata } from '../../types';
import { parseSizeString } from '@/shared/utils/filter';
import dayjs from '@ptpp/utils/plugins/dayjs';

export const siteMetadata: ISiteMetadata = {
  name: 'Nebulance',
  timezoneOffset: '+0000',
  description: 'NBL',
  url: 'https://nebulance.io/',
  tags: ['剧集'],
  schema: 'Gazelle',
  host: 'nebulance.io',
  collaborator: 'luckiestone',
  search: {
    keywordsParam: 'searchtext',
    categories: [
      {
        name: 'Category',
        key: 'filter_cat',
        options: [
          { name: 'Episodes', value: 1 },
          { name: 'Season', value: 3 }
        ],
        cross: { mode: 'append' }
      }
    ]
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: '/ajax.php?action=index', responseType: 'json' },
        fields: ['id', 'name', 'uploaded', 'downloaded', 'ratio', 'levelName']
      },
      {
        requestConfig: { url: '/user.php', params: { /* id: flushUserInfo.id */ }, responseType: 'document' },
        assertion: { id: 'id' },
        fields: ['messageCount', 'bonus', 'joinTime', 'seeding', 'seedingSize']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: ".torrent_table > tbody > tr[class^='torrent row']" },
      title: { selector: 'a[data-src]', data: 'src' },
      link: { selector: "a[href*='torrents.php?action=download']:first", attr: 'href' },
      time: { selector: '> td:nth-child(4)' },
      size: { selector: '> td:nth-child(3) div' },
      seeders: { selector: '> "td:nth-child(6)' },
      leechers: { selector: '> td:nth-child(7)' },
      completed: { selector: '> td:nth-child(5)' }
    },
    userInfo: {
      // page: '/ajax.php?action=index'
      id: {
        selector: ['response.id']
      },
      name: {
        selector: ['response.username']
      },
      uploaded: {
        selector: ['response.userstats.uploaded']
      },
      downloaded: {
        selector: ['response.userstats.downloaded']
      },
      ratio: {
        selector: ['response.userstats.ratio']
      },
      levelName: {
        selector: ['response.userstats.class']
      },

      // page: '/user.php?id=$user.id$'
      messageCount: {
        selector: ["div.alertbar a[href*='inbox.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/\s+/g, '').match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      seeding: {
        selector: "ul.stats.nobullet > li:contains('Seeding:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/[,\n]/g, '').match(/:.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          }
        ]
      },
      seedingSize: {
        selector: "ul.stats.nobullet > li:contains('Seeding Size:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, '').match(/Seeding Size:.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          }
        ]
      },
      bonus: {
        selector: "ul#userinfo_major > li > a:contains('Cubits:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,|\n|\s+/g, '').match(/Cubits:.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : 0;
          }
        ]
      },
      joinTime: {
        selector: ["ul.stats.nobullet > li:contains('Joined:') > span"],
        elementProcess: [
          (element:HTMLElement) => {
            const timeText = (element.getAttribute('title') || element.innerText).trim();
            return dayjs(timeText).isValid() ? dayjs(timeText).valueOf() : timeText;
          }
        ]
      }
    }
  }
};
