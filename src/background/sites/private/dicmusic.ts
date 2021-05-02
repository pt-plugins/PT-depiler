import { SiteMetadata, UserInfo } from '@/shared/interfaces/sites'
import GazelleJSONAPI from '@/background/sites/schema/GazelleJSONAPI'
import { findThenParseSizeString } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'DIC',
  timezoneOffset: '+0800',
  description: 'music',
  url: 'https://dicmusic.club/',
  tags: ['音乐'],
  schema: 'GazelleJSONAPI',
  host: 'dicmusic.club',
  collaborator: ['ylxb2016', 'enigmaz'],
  selector: {
    userInfo: {
      seedingSize: {
        selector: ['table#bprates_overview > tbody > tr > td:eq(1)'],
        filters: [findThenParseSizeString]
      },
      bonus: {
        selector: ['div#content > div.header > h3'],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, '').match(/.+?([\d.]+)/)
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : 0
          }
        ]
      }
    }
  }
}

export default class dicmusic extends GazelleJSONAPI {
  protected async getUserSeedingTorrents (): Promise<Partial<UserInfo>> {
    const { data: bonusPage } = await this.request<Document>({ url: '/bonus.php', params: { action: 'bprates' }, responseType: 'document' })
    return this.getFieldsData(bonusPage, 'userInfo', ['seedingSize', 'bonus'])
  }
}
