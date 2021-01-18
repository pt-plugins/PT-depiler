import { merge } from 'lodash-es'
import { EConfigKey } from '@/shared/interfaces/enum'

// 适用于公网BT站点，同时也作为 所有站点方法 的基类
export abstract class BittorrentSite {
  private readonly config: SiteConfig;

  constructor (config: Partial<SiteConfig> = {}) {
    // 使用 lodash的 merge 来合并站点默认配置和用户配置
    // 以免 { ...data }解包形式覆盖深层配置
    this.config = merge(this.getDefaultSiteConfig(), config)
  }

  abstract getDefaultSiteConfig (): SiteConfig;

  /**
   * 种子搜索方法
   * @param filter
   */
  abstract searchTorrents(filter: searchFilter) : Promise<searchResult>;
}

// 适用于PT站点
export abstract class PrivateSite extends BittorrentSite {
  /**
   * 获得当前站点最新的用户信息（更新）
   */
  abstract getUserInfo(): Promise<UserInfo> ;

  /**
   * 从内部存储中获取站点站点
   */
  async getLastUserInfo (): Promise<UserInfo | null> {
    return null
  }
}
