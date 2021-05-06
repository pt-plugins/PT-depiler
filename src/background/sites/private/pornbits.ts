import { searchFilter, SiteMetadata } from '@/shared/interfaces/sites';
import PrivateSite from '@/background/sites/schema/AbstractPrivateSite';
import { AxiosRequestConfig } from 'axios';
import { findThenParseValidTimeString, parseSizeString } from '@/shared/utils/filter';

export const siteMetadata: SiteMetadata = {
  name: 'Pornbits',
  description: 'Pornbits',
  url: 'https://pornbits.net/',
  legacyUrl: [
    'https://pornbits.org/'
  ],
  tags: ['XXX'],
  host: 'pornbits.net',
  collaborator: 'ian',
  userInfo: {
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['name', 'uploaded', 'downloaded']
      },
      {
        requestConfig: { url: '/user/details' },
        fields: ['levelName', 'joinTime', 'seeding']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: '#content > table > tbody > tr' },
      title: { selector: 'a[href*="/torrent/details/"]' },
      url: { selector: 'a[href*="/torrent/details/"]', attr: 'href' },
      link: { selector: 'a[href*="/torrent/download/"]', attr: 'href' },
      time: {
        selector: 'td:nth-child(4) div:nth-child(2):contains("-")',
        filters: [
          (query: string) => query.split('m')[1].trim()
        ]
      },
      size: { selector: 'td:nth-child(5) div:nth-child(1)' },
      category: { text: 'XXX' },
      seeders: { selector: 'td:nth-child(6)' },
      leechers: { selector: 'td:nth-child(7)' },
      completed: { selector: 'td:nth-child(8)' },
      tags: [
        { name: 'Free', selector: 'img[src="/images/glyphicons_069_gift.png"]' }
      ]
    },
    userInfo: {
      name: {
        selector: '#subnav > div > div > ul > li.dropdown.pull-right > a > span.hidden-sm'
      },
      uploaded: {
        selector: '#header > div > div > div > span.navbar-text.stats.hidden-sm',
        filters: [
          (query: string) => {
            query = query.split(':')[1].split('D')[0].trim();
            return parseSizeString(query);
          }
        ]
      },
      downloaded: {
        selector: '#header > div > div > div > span.navbar-text.stats.hidden-sm',
        filters: [
          (query: string) => {
            query = query.split(':')[2].split('R')[0].replace(/Bytes/g, '').trim();
            return parseSizeString(query);
          }
        ]
      },
      levelName: {
        selector: '#content > div > div.col-md-3 > div:nth-child(3) > span'
      },
      joinTime: {
        selector: '#content > div > div.col-md-3 > div:nth-child(5)',
        filters: [
          (query: string) => {
            query = query.split(':')[1].trim();
            return findThenParseValidTimeString(query);
          }
        ]
      },
      seeding: {
        selector: '#content > div > div.col-md-9 > div:nth-child(5) > div.panel-heading > h4',
        filters: [
          (query:string) => query.split(':')[1].split('L')[0].trim()
        ]
      }

    }
  }

};

export default class pornbits extends PrivateSite {
  protected async transformSearchFilter (filter: searchFilter): Promise<AxiosRequestConfig> {
    const config : AxiosRequestConfig = {};
    if (filter.keywords) {
      config.url = `/browse/search/date/name_tags/${filter.keywords}`;
    } else {
      config.url = '/browse/index/date/name';
    }

    return config;
  }
}
