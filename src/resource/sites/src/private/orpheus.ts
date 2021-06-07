import { SiteMetadata, UserInfo } from '@/shared/interfaces/sites';
import GazelleJSONAPI from '../schema/GazelleJSONAPI';
import { findThenParseSizeString } from '@/shared/utils/filter';

export const siteMetadata: SiteMetadata = {
  name: 'OPS',
  timezoneOffset: '+0000',
  description: 'music',
  url: 'https://orpheus.network/',
  tags: ['音乐'],
  schema: 'GazelleJSONAPI',
  collaborator: ['ylxb2016', 'enigmaz'],
  selector: {
    userInfo: {
      joinTime: {
        selector: ["div:contains('Statistics') + ul.stats > li:contains('Joined:') > span"],
        elementProcess: [
          (element: HTMLElement) => (element.getAttribute('title') || element.innerText).trim()
        ]
        // filter: 会由 GazelleJSONAPI基类 的 filter 进行进一步处理
      },

      seeding: {
        selector: ['div#content > table > tbody > tr > td:eq(0)'],
        filters: [parseInt]
      },
      seedingSize: {
        selector: ['div#content > table > tbody > tr > td:eq(1)'],
        filters: [findThenParseSizeString]
      },
      bonus: {
        selector: ['div#content > div.header > h3'],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, '').match(/.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : 0;
          }
        ]
      }
    }
  }
};

export default class orpheus extends GazelleJSONAPI {
  protected async getUserExtendInfo (userId: number): Promise<Partial<UserInfo>> {
    const { data: userPage } = await this.request<any>({ url: '/user.php', params: { id: userId } });
    return this.getFieldsData(userPage, 'userInfo', ['joinTime']);
  }

  protected async getUserSeedingTorrents (): Promise<Partial<UserInfo>> {
    const { data: bonusPage } = await this.request<Document>({ url: '/bonus.php', params: { action: 'bprates' }, responseType: 'document' });
    return this.getFieldsData(bonusPage, 'userInfo', ['seeding', 'seedingSize', 'bonus']);
  }
}
