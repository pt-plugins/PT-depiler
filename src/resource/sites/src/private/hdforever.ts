import { ISiteMetadata, IUserInfo, ITorrent } from '../../types';
import GazelleJSONAPI, { groupBrowseResult, groupTorrent } from '../schema/GazelleJSONAPI';
import { findThenParseSizeString } from '@/shared/utils/filter';

export const siteMetadata: ISiteMetadata = {
  name: 'HD-Forever',
  timezoneOffset: '+0100',
  description: 'HD-F',
  schema: 'GazelleJSONAPI',
  tags: ['影视', '综合'],
  url: 'https://hdf.world/',
  collaborator: ['luckiestone'],
  selector: {
    userInfo: {
      seedingSize: {
        selector: ['table.torrent_table:first td.nobr'],
        filters: [findThenParseSizeString]
      },
      bonus: {
        selector: "li#BonusPoints a[href*='store.php']",
        filters: [
          (query: string) => query.replace(/,|\n|\s+/g, '')
        ]
      }
    }
  }
};

export default class hdforever extends GazelleJSONAPI {
  protected override async transformGroupTorrent (group: groupBrowseResult, torrent: groupTorrent): Promise<ITorrent> {
    const parsedTorrent = await super.transformGroupTorrent(group, torrent);

    /**
     * 覆写 title 和 subTitle
     * @refs: https://www.diffchecker.com/jnRa1BMg
     */
    parsedTorrent.title = `${group.groupName} [${group.groupYear}] ${torrent.encoding} / ${torrent.format} / ${torrent.media}` +
      (torrent.isFreeleech || torrent.isNeutralLeech || torrent.isPersonalFreeleech ? ' / Freeleech' : '');
    parsedTorrent.subTitle = undefined;

    return parsedTorrent;
  }

  protected override async getUserSeedingTorrents (): Promise<Partial<IUserInfo>> {
    const { data: bonusPage } = await this.request<Document>({ url: '/store.php', params: { action: 'rate' }, responseType: 'document' });
    return this.getFieldsData(bonusPage, 'userInfo', ['seedingSize', 'bonus']);
  }
}
