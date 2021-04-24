import { SiteMetadata, UserInfo } from '@/shared/interfaces/sites'
import GazelleJSONAPI from '@/background/sites/schema/GazelleJSONAPI'
import { parseSizeString } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'RED',
  timezoneOffset: '+0000',
  description: 'music',
  url: 'https://redacted.ch/',
  tags: ['音乐'],
  schema: 'GazelleJSONAPI',
  collaborator: ['ylxb2016', 'enigamz'],
  search: {
    categories: [
      {
        name: 'Category',
        key: 'filter_cat',
        options: [
          { value: 1, name: 'Music' },
          { value: 2, name: 'Applications' },
          { value: 3, name: 'E-Books' },
          { value: 4, name: 'Audiobooks' },
          { value: 5, name: 'E-Learning Videos' },
          { value: 6, name: 'Comedy' },
          { value: 7, name: 'Comics' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    userInfo: {
      seedingSize: {
        selector: ['response.seedingsize'],
        filters: [parseSizeString]
      }
    }
  }
}

export default class redacted extends GazelleJSONAPI {
  protected async getUserSeedingTorrents (userId?: number): Promise<Partial<UserInfo>> {
    const { data: apiStats } = await this.requestApi('community_stats', { userid: userId })
    return this.getFieldsData(apiStats, 'userInfo', ['seedingSize'])
  }
}
