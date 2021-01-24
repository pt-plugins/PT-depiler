import { merge, get } from 'lodash-es'
import urlparse from 'url-parse'
import {
  ElementQuery,
  searchFilter, searchParams, SearchRequestConfig,
  SiteConfig,
  SiteMetadata,
  Torrent
} from '@/shared/interfaces/sites'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import urljoin from 'url-join'
import { parseSizeString } from '@/shared/utils/filter'
import Sizzle from 'sizzle'

// 适用于公网BT站点，同时也作为 所有站点方法 的基类
export default class BittorrentSite {
  protected readonly userConfig: Partial<SiteConfig>;
  protected readonly config: SiteConfig;

  constructor (config: Partial<SiteConfig> = {}, siteMetaData: SiteMetadata) {
    this.userConfig = config

    // 使用 lodash 的 merge 来合并站点默认配置和用户配置
    // 以免 { ...data } 解包形式覆盖深层配置
    this.config = merge(siteMetaData, this.userConfig) as SiteConfig

    // 防止host信息缺失
    if (!this.config.host) {
      this.config.host = urlparse(siteMetaData.url).host
    }
  }

  /**
   * 根据搜索筛选条件，生成 AxiosRequestConfig
   * @param filter
   */
  protected transformSearchFilter (filter: searchFilter): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      params: {}
    }
    if (filter.keywords) {
      config.params[this.config.search?.keywordsParams || 'keywords'] = filter.keywords
    }

    if (filter.extraParams) {
      for (let i = 0; i < filter.extraParams?.length; i++) {
        const { key, value } = filter.extraParams[i]

        if (key === '#changeDomain') { // 更换 baseURL
          config.baseURL = (value as string)
        } else { //  其他参数视为params
          /**
           * 如果传入的 value 是 Array，我们认为这是 cross 模式，并作相应处理
           * 但是如果此时未在对应 category 中做相应定义声明的话，将直接把对应信息交给 axios，而不做额外处理
           */
          if (Array.isArray(value)) {
            // 检索 key 的定义情况
            const definedCategoryForKey = this.config.search?.categories?.filter(x => x.key === key)[0]
            if (definedCategoryForKey?.cross) {
              const crossKey = definedCategoryForKey.cross.key || key
              if (definedCategoryForKey?.cross.mode === 'append') {
                value.forEach((v:string | number) => {
                  config.params[`${crossKey}${v}`] = 1
                })
                continue // 跳过，不再将原始字段值插入params
              }
            }
          }

          config.params[key] = value
        }
      }
    }

    return config
  }

  get activateUrl (): string {
    if (this.config.activateUrl) {
      return this.config.activateUrl
    }
    return this.config.url
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * 种子搜索方法
   * @param filter
   */
  public async searchTorrents (filter: searchFilter) : Promise<Torrent[]> {
    // 处理 filter，合并 defaultParams 到 extraParams 的最前面
    if (this.config.search?.defaultParams) {
      filter.extraParams = ([] as searchParams[])
        .concat(
          this.config.search.defaultParams || [],
          filter.extraParams || []
        )
    }

    // 请求页面并转化为document
    const axiosConfig = this.transformSearchFilter(filter)
    axiosConfig.url = axiosConfig.url || this.config.search?.path || '/'
    axiosConfig.responseType = this.config.search?.type || 'document'

    const req = await this.request(axiosConfig)
    return this.transformSearchPage(req.data, { filter, axiosConfig })
  }

  async request (axiosConfig: AxiosRequestConfig): Promise<AxiosResponse> {
    // 统一设置一些 AxiosRequestConfig， 当作默认值
    axiosConfig.baseURL = axiosConfig.baseURL || this.activateUrl
    axiosConfig.url = axiosConfig.url || '/'
    console.log(axiosConfig)

    let req: AxiosResponse
    try {
      req = await axios.request(axiosConfig)
    } catch (e) {
      req = (e as AxiosError).response!
      if (req.status >= 400) {
        throw Error('网络请求失败') // FIXME i18n
      }
    }

    if (!this.loggedCheck(req)) {
      throw Error('未登录') // FIXME i18n
    }

    return req
  }

  /**
   * @warning 此方法不可以在 getFieldData 的 filters 中使用，
   *          对于约定的 url, link 本方法会自动调用进行补全
   * @param uri
   * @param requestConfig
   */
  protected fixLink (uri: string, requestConfig: SearchRequestConfig): string {
    let url = uri

    if (uri.length > 0 && !uri.startsWith('magnet:')) {
      const { axiosConfig } = requestConfig
      const baseUrl = axiosConfig.baseURL || this.activateUrl
      if (uri.startsWith('//')) {
        // 当 传入的uri 以 /{2,} 开头时，被转换成类似 https?:///xxxx/xxxx 的形式，
        // 虽不符合url规范，但是浏览器容错高，所以不用担心 2333
        const urlHelper = urlparse(baseUrl)
        url = `${urlHelper.protocol}:${uri}`
      } else if (uri.substr(0, 4) !== 'http') {
        url = urljoin(baseUrl, uri.replace(/^\./, ''))
      }
    }

    return url
  }

  protected getFieldData (element: Element | Object, elementQuery: ElementQuery): any {
    const { text, selector, attr, data, filters } = elementQuery
    let query: string = String(text || '')

    if (selector) {
      const selectors = ([] as string[]).concat(selector)
      for (let i = 0; i < selectors.length; i++) {
        const selector = selectors[i]
        if (element instanceof Element) {
          // 这里我们预定义一个特殊的 Css Selector，即不进行子元素选择
          const another = (selector === ':self' ? element : Sizzle(selector, element)[0]) as HTMLElement
          if (another) {
            if (data) {
              query = another.dataset[data] || ''
            } else if (attr) {
              query = another.getAttribute(attr) || ''
            } else {
              query = another.innerText || ''
            }
          }
        } else {
          query = get(element, selector)
        }

        query = query.trim()
        if (query !== '') {
          break
        }
      }
    }

    if (filters) {
      filters.forEach(fn => {
        // eslint-disable-next-line no-new-func
        fn = typeof fn === 'string' ? (new Function('query', `return ${fn}`)) : fn
        query = fn(query)
      })
    }

    return query
  }

  /**
   * 登录检查方法，对于公开站点，该方法一定直接返回 True
   * @param raw
   */
  protected loggedCheck (raw: AxiosResponse): boolean {
    return true
  }

  /**
   * 如何解析 JSON 或者 Document，获得种子文件
   * @param doc
   * @param requestConfig
   */
  protected transformSearchPage (doc: Document, requestConfig: SearchRequestConfig): Torrent[] {
    const rowsSelector = this.config.selector!.search!.rows!
    const torrents: Torrent[] = []

    let trs: any
    if (doc instanceof Document) {
      trs = Sizzle(rowsSelector.selector as string, doc)
    } else {
      trs = get(doc, rowsSelector.selector as string)
    }
    trs?.forEach((tr: any) => {
      torrents.push(this.transformRowsTorrent(tr, requestConfig) as Torrent)
    })

    return torrents
  }

  protected transformRowsTorrent (row: Element | Document | Object, requestConfig: SearchRequestConfig): Partial<Torrent> {
    const torrent = {} as Partial<Torrent>

    for (const key in this.config.selector.search) {
      if (key === 'rows') {
        continue // rows 不作为对应项
      }

      // noinspection JSUnfilteredForInLoop
      let value = this.getFieldData(row, this.config.selector.search[key])

      // noinspection JSUnfilteredForInLoop
      if (['url', 'link'].includes(key)) {
        value = this.fixLink(value as string, requestConfig)
      }

      if (key === 'size') {
        value = parseSizeString(value)
      }

      // noinspection JSUnfilteredForInLoop
      if (['id', 'size', 'seeders', 'leechers', 'completed', 'comments'].includes(key)) {
        if (typeof value === 'string') {
          value = value.replace(/,/ig, '')
          if (value.match(/^\d+$/)) {
            value = isNaN(parseInt(value)) ? 0 : parseInt(value)
          }
        }
      }

      // @ts-ignore
      // noinspection JSUnfilteredForInLoop
      torrent[key] = value
    }
    return torrent
  }

  async getTorrentPageLink (torrent: Torrent): Promise<string> {
    return torrent.url
  }

  async getTorrentDownloadLink (torrent: Torrent):Promise<string> {
    if (!torrent.link && this.config.selector.detail?.link) {
      const { data } = await this.request({
        url: torrent.url,
        responseType: this.config.detail?.type || 'document'
      })
      return this.getFieldData(data, this.config.selector.detail.link)
    }

    return torrent.link
  }
}
