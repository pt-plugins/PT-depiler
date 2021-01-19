import { merge } from 'lodash-es'
import urlparse from 'url-parse'
import { searchFilter, SiteConfig, Torrent, UserInfo } from '@/shared/interfaces/sites'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import urljoin from 'url-join'

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
  async searchTorrents (filter: searchFilter) : Promise<Torrent[]> {
    // 请求页面并转化为document
    const axiosConfig = this.transformSearchFilter(filter)
    axiosConfig.responseType = this.config.search?.type || 'document'

    const req = await axios.request(axiosConfig)
    if (!this.logCheck(req)) {
      throw Error('未登录') // FIXME i18n
    }

    return this.transformSearchPage(req.data)
  }

  fixLink (uri: string): string {
    let url = uri

    if (uri.startsWith('//')) {
      const urlHelper = urlparse(this.config.url)
      url = `${urlHelper.protocol}:${uri}`
    } if (!uri.startsWith('magnet:') && uri.substr(0, 4) !== 'http') {
      url = urljoin(this.config.url, uri)
    }
    return url
  }

  getFieldData (element: Element, query: {
    selector: string,
    attribute?: string,
    data?: string,
    filters?: Function[]
  }): string | number {
    const { selector, attribute, data, filters } = query
    const another = (element as HTMLElement).querySelector(selector) as HTMLElement

    let ret: string = ''
    if (another) {
      if (data) {
        ret = another.dataset[data] || ''
      } else if (attribute) {
        ret = another.getAttribute(attribute) || ''
      } else {
        ret = another.innerText || ''
      }
    }

    ret = ret.trim()
    if (filters) {
      filters.forEach(fn => {
        ret = fn(ret)
      })
    }

    return ret
  }

  /**
   * 登录检查方法，对于公开站点，该方法一定直接返回 True
   * @param raw
   */
  logCheck (raw: AxiosResponse): boolean {
    return true
  }

  /**
   * 根据搜索筛选条件，生成 AxiosRequestConfig
   * @param filter
   */
  abstract transformSearchFilter(filter: searchFilter): AxiosRequestConfig;

  /**
   * 如何解析 JSON 或者 Document，获得种子文件
   * @param doc
   */
  abstract transformSearchPage(doc: any): Torrent[];

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

  abstract logCheck(raw: AxiosResponse): boolean;
}
