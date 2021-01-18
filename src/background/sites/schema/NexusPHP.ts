import { PrivateSite } from '@/background/sites/schema/Abstract'

export default class NexusPHP extends PrivateSite {
  getDefaultSiteConfig (): SiteConfig {
    return {
      id: '',
      name: 'NexusPHP',
      schema: 'NexusPHP',
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
