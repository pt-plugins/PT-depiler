import { SiteMetadata, UserInfo } from '@/shared/interfaces/sites'
import GazelleJSONAPI from '@/background/sites/schema/GazelleJSONAPI'
import { parseSizeString } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'Oppaitime',
  timezoneOffset: '+0000',
  description: '成人动漫站',
  schema: 'GazelleJSONAPI',
  tags: ['动画', '漫画', '游戏', '影视'],
  url: 'https://oppaiti.me/',
  collaborator: 'bimzcy',
  search: {
    categories: [
      {
        name: 'Category',
        key: 'filter_cat',
        options: [
          { value: 1, name: 'Movies' },
          { value: 2, name: 'Anime' },
          { value: 3, name: 'Manga' },
          { value: 4, name: 'Games' },
          { value: 5, name: 'Audio' },
          { value: 6, name: 'Other' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    userInfo: {
      seedingSize: {
        selector: ["li:contains('Total Seeding: ') > span"],
        filters: [parseSizeString]
      },
      bonus: {
        selector: ['span.stat > a[href]'],
        filters: [(query: string) => query.replace(',', '')]
      }
    }
  }
}

export default class oppaitime extends GazelleJSONAPI {
  protected async getUserSeedingTorrents (userId:number): Promise<Partial<UserInfo>> {
    const { data: bonusPage } = await this.request({ url: '/user.php', params: { id: userId }, responseType: 'document' })
    return this.getFieldsData(bonusPage, 'userInfo', ['seedingSize', 'bonus'])
  }
}
