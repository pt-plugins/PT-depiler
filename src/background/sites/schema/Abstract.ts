import { merge } from 'lodash-es'
import { searchFilter, SiteConfig, Torrent, UserInfo } from '@/shared/interfaces/sites'

// 适用于公网BT站点，同时也作为 所有站点方法 的基类
export abstract class BittorrentSite {
  protected abstract siteConfig: SiteConfig;
  protected userConfig: Partial<SiteConfig>;

  private _config?: SiteConfig;

  constructor (config: Partial<SiteConfig> = {}) {
    this.userConfig = config
  }

  /**
   * 获得运行时配置
   */
  get config (): SiteConfig {
    if (!this._config) {
      // 使用 lodash 的 merge 来合并站点默认配置和用户配置
      // 以免 { ...data } 解包形式覆盖深层配置
      this._config = merge(this.siteConfig, this.userConfig)
    }

    return this._config
  }

  /**
   * 种子搜索方法
   * @param filter
   */
  abstract searchTorrents(filter: searchFilter) : Promise<Torrent[]>;

  /**
   * 根据种子id信息生成对应种子介绍页面
   * @param id
   */
  abstract generateDetailPageLink(id: any): string;
}

// 适用于PT站点
export abstract class PrivateSite extends BittorrentSite {
  /**
   * 获得当前站点最新的用户信息用于更新
   */
  abstract getUserInfo(): Promise<UserInfo> ;
}
