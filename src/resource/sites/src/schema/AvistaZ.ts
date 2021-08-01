import { ISiteMetadata, IUserInfo } from '../../types';
import PrivateSite from '../schema/AbstractPrivateSite';
import dayjs from '@ptpp/utils/plugins/dayjs';
import urlparse from 'url-parse';
import Sizzle from 'sizzle';

export default class AvistaZ extends PrivateSite {
  protected override readonly initConfig: Partial<ISiteMetadata> = {
    search: {
      keywordsParam: 'search',
      requestConfig: {
        url: '/torrents',
        params: {
          in: 1
        }
      },
      selectors: {
        rows: { selector: 'table.table:first > tbody > tr:has(a[href*="/torrent/"])' },
        id: {
          selector: 'a.torrent-filename',
          attr: 'href',
          filters: [(query: string) => {
            const queryMatch = query.match(/\/torrent\/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }]
        },
        title: {
          selector: 'a.torrent-filename',
          attr: 'title',
          filters: [
            (query: string) => query.replace('Torrent Details - ', '')
          ]
        },
        url: { selector: 'a.torrent-filename', attr: 'href' },
        link: { selector: 'a.torrent-download-icon', attr: 'href' },
        time: { selector: '> td:nth-child(4) > span', attr: 'title' },
        size: { selector: '> td:nth-child(6)' },
        author: { selector: 'span.pull-right:has( > i.fa-upload) > span.badge-user' },
        category: {
          selector: '> td:nth-child(1) > i',
          attr: 'title',
          filters: [
            (query:string) => query.replace(' Torrent', '')]
        },
        seeders: { selector: ' > td:nth-child(7)' },
        leechers: { selector: '> td:nth-child(8)' },
        completed: { selector: '> td:nth-child(9)' },
        comments: { selector: '> td:nth-child(5)' },
        tags: [
          { name: 'Free', selector: 'i.fa-star' },
          { name: '2xUp', selector: 'i.fa-diamond' },
          { name: '50%', selector: 'i.fa-star-half-o' }
        ]
      }
    },
    userInfo: {
      pickLast: ['id', 'name', 'joinTime'],
      process: [
        {
          requestConfig: { url: '/' },
          fields: ['name']
        },
        {
          requestConfig: { url: '/profile/$userName$' },
          assertion: { name: 'userName' },
          fields: ['messageCount', 'id', 'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus', 'joinTime', 'seeding']
        }
      ],
      selectors: {
        // url: '/',
        name: {
          selector: ["a[href*='/profile/']:first"],
          attr: 'href',
          filters: [
            (query: string) => {
              const queryMatch = query.match(/profile\/(.+)/);
              return (queryMatch && queryMatch.length >= 2) ? queryMatch[1] : '';
            }
          ]
        },
        // url: '/profile/$userName$'
        messageCount: {
          selector: ['a[title=Messages] span.message-count.badge'],
          filters: [parseInt]
        },
        id: {
          selector: ["td:contains('User ID') + td"],
          filters: [parseInt]
        },
        uploaded: {
          selector: ["td:contains('Uploaded') + td"],
          filters: [{ name: 'parseSize' }]
        },
        downloaded: {
          selector: ["td:contains('Downloaded') + td"],
          filters: [{ name: 'parseSize' }]
        },
        ratio: {
          selector: "td:contains('Ratio') + td",
          filters: [{ name: 'parseNumber' }]
        },
        levelName: {
          selector: "td:contains('Rank') + td"
        },
        bonus: {
          selector: ["td:contains('Bonus Points') + td"],
          filters: [{ name: 'parseNumber' }]
        },
        joinTime: {
          selector: "td:contains('Joined') + td",
          filters: [
            (query: string) => {
              const timeString = query.split(' (')[0];
              return dayjs(timeString).isValid() ? dayjs(timeString).valueOf() : timeString;
            }
          ]
        },
        seeding: {
          selector: ["li:contains('Seeding'):first", "li:contains('Seeds'):first"],
          filters: [{ name: 'parseNumber' }]
        }
      }
    }
  }

  public override async flushUserInfo (lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let baseUserInfo = await super.flushUserInfo();

    if (baseUserInfo.name && !baseUserInfo.seedingSize) {
      baseUserInfo = { seedingSize: 0, ...baseUserInfo }; // 基底属性

      // 生成页面信息
      for (const pageInfo = { count: 1, current: 1 }; pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const { data: TListDocument } = await this.request<Document>({
          url: `/profile/${baseUserInfo.name}/active`,
          params: { order: 'progress', sort: 'desc', page: pageInfo.current },
          responseType: 'document'
        });

        if (pageInfo.count === 1) {
          pageInfo.count = this.getFieldData(TListDocument, {
            text: 1,
            selector: 'ul.pagination:first > li:has(a[href*="/active?page="]):nth-last-child(2) > a',
            attr: 'href',
            filters: [(query: string) => parseInt(urlparse(query, true).query.page as string) || 1]
          });
        }

        const trAnothers = Sizzle('table.table.table-condensed > tbody > tr', TListDocument);
        trAnothers.forEach(trAnother => {
          const statusAnother = Sizzle('> td:eq(3)', trAnother)[0] as HTMLElement;
          if (statusAnother && statusAnother.innerText.includes('seed')) { // 只统计做种状态的
            baseUserInfo.seedingSize += this.getFieldData(trAnother, {
              selector: 'span[title="File Size"]',
              filters: [{ name: 'parseSize' }]
            });
          }
        });
      }
    }

    return baseUserInfo;
  }
}
