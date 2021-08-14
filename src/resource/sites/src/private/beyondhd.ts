/**
 * 并不是标准Unit3D的模板，做了很大更改，故
 * 根据旧版配置文件和 Whalko 提供的 html文档修改，未经过测试
 * Rhilip, 2021.4.21
 */
import { ISiteMetadata, ETorrentStatus, IUserInfo } from '../../types';
import Unit3D from '../schema/Unit3D';
import dayjs from '@ptpp/utils/plugins/dayjs';

export const siteMetadata: ISiteMetadata = {
  name: 'BeyondHD',
  timezoneOffset: '+0000',
  description: '综合',
  url: 'https://beyond-hd.me/',
  tags: ['综合'],
  schema: 'Unit3D',
  host: 'beyond-hd.me',
  collaborator: 'lengmianxia',
  search: {
    requestConfig: {
      url: '/torrents'
    },
    imdbTransformer: config => {
      config.params.imdb = config.params.search;
      delete config.params.search;
      return config;
    },
    selectors: {
      rows: { selector: 'div.table-torrents > table:last > tbody > tr.librarytab' },
      id: { selector: 'a.torrent-name', attr: 'torrent' },
      title: { selector: 'a.torrent-name' },
      url: { selector: 'a.torrent-name', attr: 'href' },
      time: { selector: 'span.text-age', filters: [{ name: 'parseTTL' }] },
      size: { selector: 'span.text-size' },
      author: { selector: 'span:has(> i.fa-user-shield)' },
      category: { selector: 'a[href*="/categories/"] > div > i[title]', attr: 'title' },
      completed: { selector: 'a[href*="/history"] > span' },
      comments: { selector: 'span[id^="commenttorrentcount"]' },
      progress: {
        selector: ["i.fal.fa-seedling, i.fal.fa-check[title='Snatched']"],
        elementProcess: (element: HTMLElement) => element.getAttribute('title') ? 100 : 0
      },
      status: {
        selector: ['i.fal.fa-seedling', "i.fal.fa-check[title='Snatched']"],
        switchFilters: [
          () => ETorrentStatus.seeding,
          () => ETorrentStatus.completed
        ]
      },
      tags: [
        { name: 'Free', selector: ".fas.fa-star[title*='100%']" },
        { name: '25%', selector: ".fas.fa-star[title*='25%']" },
        { name: '50%', selector: ".fas.fa-star[title*='50%']" },
        { name: '75%', selector: ".fas.fa-star[title*='75%']" }
      ]
    }
  },
  userInfo: {
    selectors: {
      id: {
        selector: '#beta-stats li:first a',
        attr: 'href',
        filters: [
          // https://beyond-hd.me/xxxxxx.ddddddd
          (query: string) => {
            const queryMatch = query.match(/\.me\/(.+)\.(.+)\/?/);
            return queryMatch && queryMatch.length >= 3 ? queryMatch[2] : '';
          }
        ]
      },
      name: { selector: '#beta-stats li:first', attr: null, filters: [] },
      uploaded: {
        selector: ["#beta-stats a[href*='uploads']:first"]
      },
      downloaded: {
        selector: ["#beta-stats a[href*='downloads']:first"]
      },
      bonus: {
        selector: ["#beta-stats a[href*='bonus']:first"],
        filters: [
          (query: string) => query.replace(/,|\n|\s+/g, '').replace(/BP:/g, '')
        ]
      },
      seeding: { selector: '#beta-stats a:has(> i.fa-seedling)' },
      messageCount: { selector: ".beta-alert[href$='/mail'] .notify" },
      seedingSize: { selector: ["td:contains('Active Seed Size') + td"] },
      levelName: { selector: 'div.button-holder span.badge-faded' },
      joinTime: {
        selector: "div.button-holder h5:contains('Since: ')",
        filters: [
          (query: string) => {
            query = query.replace('Member Since: ', '');
            return dayjs(query).isValid() ? dayjs(query).valueOf() : query;
          }
        ]
      }
    }
  }
};

export default class beyondhd extends Unit3D {
  private async getUserInfoPathFromSite (): Promise<`${string}.${string}`> {
    const { data: indexDocument } = await this.request<Document>({ url: '/', responseType: 'document', checkLogin: true });
    return this.getFieldData(indexDocument, {
      selector: "a[href*='settings']:first",
      attr: 'href',
      filters: [
        (query: string) => query.replace(/\/settings.+$/, '')
      ]
    }) as `${string}.${string}`;
  }

  public override async flushUserInfo (lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const flushUserInfo: Partial<IUserInfo> = {};

    const userPath = await this.getUserInfoPathFromSite();
    const { data: userDetailDocument } = await this.request<Document>({ url: userPath, responseType: 'document' });

    for (const userInfoAttrValue of Object.keys(this.config.userInfo?.selectors!)) {
      flushUserInfo[userInfoAttrValue] = this.getFieldData(userDetailDocument, this.config.userInfo?.selectors?.[userInfoAttrValue]!);
    }

    return flushUserInfo as IUserInfo;
  }
}
