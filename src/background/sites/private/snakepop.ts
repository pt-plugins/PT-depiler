import { SiteMetadata, UserInfo } from '@/shared/interfaces/sites';
import GazelleJSONAPI from '@/background/sites/schema/GazelleJSONAPI';
import urlparse from 'url-parse';
import Sizzle from 'sizzle';
import { parseSizeString } from '@/shared/utils/filter';

export const siteMetadata: SiteMetadata = {
  name: 'Snakepop',
  timezoneOffset: '+0800',
  description: 'music',
  url: 'https://snakepop.art/',
  tags: ['音乐'],
  schema: 'GazelleJSONAPI',
  host: 'snakepop.art',
  collaborator: ['timyuan'],
  selector: {
    userInfo: {
      levelName: {
        filters: [(query: string) => query.match(/(.+(?= [(]))/)![0]]
      }
    }
  }
};

export default class snakepop extends GazelleJSONAPI {
  protected async getUserSeedingTorrents (userId?: number): Promise<Partial<UserInfo>> {
    const userSeedingTorrent: Partial<UserInfo> = { seedingSize: 0, bonus: 0 };

    for (const pageInfo = { count: 0, current: 1 }; pageInfo.current <= pageInfo.count; pageInfo.current++) {
      const { data: seedPage } = await this.request<Document>({
        url: '/torrents.php',
        params: { type: 'seeding', userid: userId, page: pageInfo.current },
        responseType: 'document'
      });

      if (pageInfo.count === 0) {
        pageInfo.count = this.getFieldData(seedPage, {
          selector: "a[href*='type=seeding']:contains('Last'):last",
          attr: 'href',
          filters: [(query: string) => parseInt(urlparse(query, true).query.page as string) || -1]
        });
      }

      userSeedingTorrent.bonus = this.getFieldData(seedPage, {
        selector: 'li#stats_seedpoints span.stat',
        filters: [parseFloat]
      }) || 0;

      const sizeAnothers = Sizzle('td.number_column.nobr', seedPage);
      sizeAnothers.forEach(sizeAnother => {
        userSeedingTorrent.seedingSize! += parseSizeString((sizeAnother as HTMLElement).innerText.trim());
      });
    }

    return userSeedingTorrent;
  }
}
