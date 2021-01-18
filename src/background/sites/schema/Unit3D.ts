import { PrivateSite } from '@/background/sites/schema/Abstract'

export default class Unit3D extends PrivateSite {
  getDefaultSiteConfig (): SiteConfig {
    return {
      id: '',
      name: 'Unit3D',
      schema: 'Unit3D',
      feature: {
        queryUserInfo: true
      }
    }
  }

  getUserInfo (): Promise<UserInfo> {
    throw new Error()
  }

  searchTorrents (filter: searchFilter): Promise<searchResult> {
    throw new Error()
  }
}
