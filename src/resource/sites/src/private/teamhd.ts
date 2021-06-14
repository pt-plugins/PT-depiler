import { ISiteMetadata, ETorrentStatus } from '../../types';
import urlparse from 'url-parse';
import { findThenParseNumberString, findThenParseSizeString, parseSizeString } from '@/shared/utils/filter';

const categoryMap = {
  29: 'Movies/HD', // Movies Фильмы
  25: 'TV/Anime', // Cartoons Мультфильмы
  26: 'Audio/Lossless', // Hi-Res Audio
  27: 'Other', // Demo Демо
  28: 'TV/Documentary', // Documentary Документальное кино
  30: 'Audio/Video', // Music Video Музыкальное видео
  31: 'TV/Sport', // Sport Спорт
  32: 'TV/HD', // TV Show ТВ Шоу
  33: 'TV/HD', // Soaps Сериалы
  34: 'TV/HD', // Other
  35: 'Movies' // Content w/o subs Контент без перевода
};

const nextTextSibling = (element: HTMLElement) => {
  return (element.nextSibling as Text).textContent?.trim() || '';
};

export const siteMetadata: ISiteMetadata = {
  name: 'TeamHD',
  timezoneOffset: '+0000',
  description: '俄国站',
  url: 'https://teamhd.org/',
  tags: ['影视'],
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/browse'
    }
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/index.php' },
        fields: ['name', 'id', 'messageCount', 'uploaded', 'downloaded', 'ratio', 'bonus']
      },
      {
        requestConfig: { url: '/user/$userId$' },
        assertion: { id: 'userId' },
        fields: ['joinTime', 'levelName', 'seeding', 'seedingSize']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.browse > tbody > tr' },
      id: {
        selector: 'a[href^="download.php?id="]',
        attr: 'href',
        filters: [
          (query: string) => urlparse(query, true).query.id
        ]
      },
      title: { selector: 'a[href^="/details/id"]' },
      url: { selector: 'a[href^="/details/id"]', attr: 'href' },
      link: { selector: 'a[href^="download.php?id="]', attr: 'href' },
      time: { selector: 'td > div > small' },
      size: {
        selector: 'td:nth-child(5)',
        elementProcess: [
          (element: HTMLElement) => {
            element.querySelector('strong')?.remove();
            return findThenParseSizeString(element.innerText.trim());
          }
        ]
      },
      author: { selector: '>td:eq(4)' },
      category: {
        selector: ' a[href*="/browse/cat"]',
        attr: 'href',
        filters: [
          findThenParseNumberString,
          (catId: keyof typeof categoryMap) => categoryMap[catId] || 'Other'
        ]
      },
      seeders: {
        selector: 'td:nth-child(4)',
        filters: [
          (query: string) => query.split('|')[0]
        ]
      },
      leechers: {
        selector: 'td:nth-child(4)',
        filters: [
          (query: string) => query.split('|')[1]
        ]
      },
      completed: {
        selector: 'td:nth-child(5) strong'
      },
      comments: {
        selector: 'td:eq(2)'
      },
      progress: {
        selector: 'td.ttable_seeding font[color]',
        case: {
          "font[color='green']": 100,
          "font[color='black']": 0,
          "font[color='#ff0000']": null
        }
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: 'td.ttable_seeding font[color]',
        case: {
          "font[color='green']": ETorrentStatus.seeding,
          "font[color='black']": ETorrentStatus.completed,
          "font[color='#ff0000']": ETorrentStatus.downloading
        }
      },
      tags: [
        { name: 'Free', selector: "a[href*='/details/id'][style='color:#f2b101']" },
        { name: '50%', selector: 'a[href^="/details/id"][style="color:#828b8b"]' }
      ]
    },
    userInfo: {
      // page: '/index.php'
      name: {
        selector: "a[href*='/user/']:first"
      },
      id: {
        selector: "a[href*='/user/']",
        attr: 'href',
        filters: [(query:string) => query.split('/')[4]]
      },
      messageCount: {
        selector: ['#message_box > a > font'],
        filters: [findThenParseNumberString]
      },
      uploaded: {
        selector: ["div.col-8.mb-4 > font[color='green']"],
        elementProcess: [nextTextSibling, parseSizeString]
      },
      downloaded: {
        selector: ["div.col-8.mb-4 > font[color='darkred']"],
        elementProcess: [nextTextSibling, parseSizeString]
      },
      ratio: {
        selector: ["div.col-8.mb-4 > font[color='#1900D1']"],
        elementProcess: [nextTextSibling]
      },
      bonus: {
        selector: ["a.online[href='/mybonus.php']"]
      },
      // page: '/user/$user.id$',
      joinTime: {
        selector: ['#profile_right > table.inlay > tbody > tr:nth-child(1) > td:nth-child(2)'],
        filters: ["dateTime(query.text().split('(')[0]).valueOf()"]
      },
      levelName: {
        selector: ['#profile_left > table > tbody > tr > td:nth-child(2) > p:nth-child(1) > u > span'],
        filters: ['query.text()']
      },
      seeding: {
        selector: ["img[title='Distributes'] + font > font"],
        filters: [findThenParseNumberString]
      },
      seedingSize: {
        text: 'N/A'
      }
    }
  }
};
