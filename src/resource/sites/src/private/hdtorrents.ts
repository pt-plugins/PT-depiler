import { ISiteMetadata, IUserInfo, ETorrentStatus } from '../../types';
import urlparse from 'url-parse';
import dayjs from '@ptpp/utils/plugins/dayjs';
import { findThenParseNumberString, findThenParseSizeString, parseSizeString } from '@ptpp/utils/filter';
import PrivateSite from '../schema/AbstractPrivateSite';
import Sizzle from 'sizzle';

export const siteMetadata: ISiteMetadata = {
  name: 'HD-Torrents',
  timezoneOffset: '+0000',
  description: 'HD-Torrents.org',
  url: 'https://hd-torrents.org/',
  legacyUrl: [
    'https://hdts.ru/',
    'https://hd-torrents.net/',
    'https://hd-torrents.me/'
  ],
  tags: ['综合'],
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/torrents.php',
      params: {
        active: 0
      }
    }
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id', 'messageCount']
      },
      {
        requestConfig: { url: '/usercp.php' },
        assertion: { id: 'uid' },
        fields: ['name', 'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus', 'joinTime', 'seeding']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.mainblockcontenttt tr:has(td.mainblockcontent:has(a[href*="details.php"]))' },
      id: {
        selector: 'a[href^="details.php?id="]',
        attr: 'href',
        filters: [
          (query: string) => urlparse(query, true).query.id
        ]
      },
      title: { selector: 'a[href^="details.php?id="]' },
      url: { selector: 'a[href^="details.php?id="]', attr: 'href' },
      link: { selector: "a[href*='download.php']", attr: 'href' },
      time: {
        selector: '> td:eq(6)',
        filters: [(query: string) => dayjs(query.replace('  ', ' '), 'HH:mm:ss MM/DD/YYYY').valueOf()]
      },
      size: { selector: '> td:eq(7)' },
      author: { selector: '> td:eq(8)' },
      category: { selector: '> td:eq(1) img[alt]', text: 'Other', attr: 'alt' },
      seeders: { selector: '> td:eq(9)' },
      leechers: { selector: '> td:eq(10)' },
      completed: { selector: '> td:eq(11)' },
      comments: { selector: '> td:eq(3)', filters: [(query: string) => query === '--' ? 0 : query] },
      tags: [
        { name: 'Free', selector: "img[src*='free.png']" },
        { name: '75%', selector: "img[src*='25.png']" },
        { name: '50%', selector: "img[src*='50.png']" },
        { name: '25%', selector: "img[src*='75.png']" }
      ],
      progress: {
        text: 0,
        selector: '> td:eq(1)',
        case: {
          '.mainblockcontentpeersall': null,
          '.mainblockcontentpeersseed': 100,
          '.mainblockcontenthistact': 100,
          '.mainblockcontentpeersleech': 0
        }
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: '> td:eq(1)',
        case: {
          '.mainblockcontentpeersall': ETorrentStatus.unknown,
          '.mainblockcontentpeersseed': ETorrentStatus.seeding,
          '.mainblockcontenthistact': ETorrentStatus.inactive,
          '.mainblockcontentpeersleech': ETorrentStatus.downloading
        }
      }
    },
    userInfo: {
      // page: '/',
      id: {
        selector: ["a[href*='usercp.php?uid=']:first"],
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.uid]
      },
      messageCount: {
        selector: ['.new-pm.warning'],
        filters: [findThenParseNumberString]
      },
      // page: '/usercp.php?uid=$user.id$',
      name: {
        selector: ["tr#CurrentDetailsHideShowTR td.header:contains('User') + td"]
      },
      uploaded: {
        selector: ["td.header:contains('Uploaded') + td"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["td.header:contains('Downloaded') + td"],
        filters: [findThenParseSizeString]
      },
      ratio: {
        selector: "td.header:contains('Ratio') + td",
        filters: [findThenParseNumberString]
      },
      levelName: {
        selector: "td.header:contains('Rank') + td"
      },
      bonus: {
        selector: ["td.header:contains('Seed Bonus Points') + td"],
        filters: [(query:string) => parseFloat(query.replace(/,/g, '')) || 0]
      },
      joinTime: {
        selector: "td.header:contains('Joined on') + td",
        filters: [(query: string) => dayjs(query, 'DD/MM/YYYY HH:mm:ss').valueOf()]
      },
      seeding: {
        selector: ["td.nav[title='Active-Torrents'] > a[href*='#actives']"],
        filters: [(query:string) => parseInt(query.replace(/,/g, '')) || 0]
      }
    }
  }
};

export default class hdtorrents extends PrivateSite {
  /**
   * FIXME 由于目前使用csrf的站点并不多，所以先这么写，到时候看看是否进行抽象
   * 根据 Jackett 的代码，似乎并不需要 csrfToken 就可以实现搜索，
   * 且根据搜索测试，确实可以不需要........
   *
  protected override async transformSearchFilter (filter: searchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter)

    if (filter.keywords) { // 如果 keywords 存在，则需要获取 csrfToken
      const { data: TPage } = await this.request({ url: '/torrents.php', responseType: 'document' })
      config.params.csrfToken = this.getFieldData(TPage, {
        selector: ["input[name='csrfToken']:first"]
      })
    }

    return config
  }
   */

  public override async flushUserInfo (lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const baseUserInfo = await super.flushUserInfo();

    if (baseUserInfo.id && !baseUserInfo.seedingSize) {
      baseUserInfo.seedingSize = 0;

      for (const pageInfo = { count: 0, current: 0 }; pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const TListDocument = await this.request({ url: '/usercp.php', params: { uid: baseUserInfo.id, activepage: pageInfo.current }, responseType: 'document' });

        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TListDocument, {
            selector: ["a[href*='activepage']:contains('1'):last"],
            attr: 'href',
            filters: [(query: string) => parseInt(urlparse(query, true).query.activepage as string) || -1]
          });
        }

        // 遍历并更新做种体积
        const trAnothers = Sizzle('tr#SeedingtorrentsHideShowTR table > tbody > tr:gt(0)');
        trAnothers.forEach(trAnother => {
          const sizeAnother = Sizzle('td:eq(1)', trAnother)[0];
          baseUserInfo.seedingSize! += parseSizeString((sizeAnother as HTMLElement).innerText.trim());
        });
      }
    }

    return baseUserInfo;
  }
}
