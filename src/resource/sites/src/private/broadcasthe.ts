/**
 * 需要测试
 * Rhilip, 2021.04.23
 */
import { ISiteMetadata } from '../../types';
import { parseSizeString, parseTimeToLive } from '@ptpp/utils/filter';

export const siteMetadata: ISiteMetadata = {
  name: 'BTN',
  timezoneOffset: '+0000',
  description: '著名剧集站点，又被戏称为鼻涕妞',
  url: 'https://broadcasthe.net/',
  tags: ['剧集'],
  schema: 'Gazelle',
  collaborator: ['ylxb2016', 'enigmaz'],
  search: {
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
  selector: {
    search: {
      title: { selector: "[style='float:none;']:first", attr: 'title' },
      url: { selector: "[title='View Torrent']:first", attr: 'href' },
      link: { selector: "[title='Download']", attr: 'href' },
      time: { selector: "div:contains('Added:')", filters: [parseTimeToLive] }
    },

    userInfo: {
      uploaded: { selector: '#section2 > div > div.statistics > div:nth-child(3) > ul > li:nth-child(1)' },
      downloaded: { selector: '#section2 > div > div.statistics > div:nth-child(3) > ul > li:nth-child(7)' },
      ratio: { text: '---', selector: null, filters: [] },
      levelName: { selector: '#section2 > div > div.statistics > div:nth-child(1) > ul > li:nth-child(2)' },
      bonus: {
        selector: '#section2 > div > div.statistics > div:nth-child(1) > ul > li:nth-child(5) > a',
        filters: [
          (query: string) => query.replace(/,/g, '')
        ]
      },
      joinTime: { selector: '#section2 > div > div.statistics > div:nth-child(1) > ul > li:nth-child(1) > span' },
      seeding: {
        selector: '#section2 > div > div.statistics > div:nth-child(3) > ul > li:nth-child(4)',
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, '').match(/Seeding:.+?(\d+).+?/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      seedingSize: {
        selector: '#section2 > div > div.statistics > div:nth-child(3) > ul > li:nth-child(5)',
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, '').match(/Seeding Size:.+?([\d.]+ ?[TGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          }
        ]
      }
    }
  }
};
