import {
  ElementQuery, searchCategories, searchCategoryOptions,
  searchFilter, searchParams, SearchRequestConfig, SearchResultItemTag,
  SiteConfig,
  SiteMetadata,
  Torrent
} from '@/shared/interfaces/sites'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import Sizzle from 'sizzle'
import urljoin from 'url-join'
import urlparse from 'url-parse'
import { merge, get, chunk, mergeWith } from 'lodash-es'
import { cfDecodeEmail, parseSizeString, parseTimeWithZone } from '@/shared/utils/filter'
import { ETorrentStatus } from '@/shared/interfaces/enum'

// 适用于公网BT站点，同时也作为 所有站点方法 的基类
export default class BittorrentSite {
  /**
   * 作为这个class类的基本属性，一般用在模板定义中
   * @protected
   */
  protected readonly initConfig: Partial<SiteConfig> = {};

  // 在 constructor 时生成的一些属性
  private readonly userConfig: Partial<SiteConfig>;
  private readonly siteMetaData: Partial<SiteConfig>;
  private _config?: SiteConfig; // 实际过程中使用的配置文件

  protected _runtime: any = {
    cacheRequest: new Map()
  };

  constructor (config: Partial<SiteConfig> = {}, siteMetaData: SiteMetadata) {
    this.userConfig = config
    this.siteMetaData = siteMetaData
  }

  get config (): SiteConfig {
    if (!this._config) {
      /**
       * 使用 lodash 的 mergeWith 来合并站点默认配置和用户配置
       * 以免 { ...data } 解包形式覆盖深层配置
       */
      this._config = mergeWith(this.initConfig, this.siteMetaData, this.userConfig,
        // @ts-ignore
        (objValue, srcValue, key) => {
          if (Array.isArray(objValue)) {
            if (['elementProcess', 'filters', 'switchFilters'].includes(key)) { // 不合并 filters，每次都用最后并入的
              return srcValue
            } else {
              // @ts-ignore
              return [].concat(srcValue, objValue) // 保证后并入的配置优先
            }
          }
        }) as SiteConfig

      // 防止host信息缺失
      if (!this._config.host) {
        this._config.host = urlparse(this._config.url).host
      }
    }

    return this._config
  }

  get activateUrl (): string {
    return this.config.activateUrl || this.config.url
  }

  get categoryMap (): searchCategoryOptions[] {
    return this.getCategory(['Category', '类别'])?.options!
  }

  protected getCategory (catName: string | string[]): searchCategories | undefined {
    const catNames = ([] as string[]).concat(catName)
    return this.config.search?.categories?.find((d) => d.name in catNames)
  }

  /**
   * 根据搜索筛选条件，生成 AxiosRequestConfig
   * @param filter
   */
  protected transformSearchFilter (filter: searchFilter): AxiosRequestConfig {
    const config: AxiosRequestConfig = {}

    const params: any = {}
    if (filter.keywords) {
      params[this.config.search?.keywordsParam || 'keywords'] = filter.keywords || ''
    }

    if (filter.extraParams) {
      for (let i = 0; i < filter.extraParams?.length; i++) {
        const { key, value } = filter.extraParams[i]

        if (key === '#changeDomain') { // 更换 baseURL
          config.baseURL = value as string
        } else if (key === '#changePath') {
          config.url = value as string
        } else { //  其他参数视为params
          /**
           * 如果传入的 value 是 Array，我们认为这是 cross 模式，并作相应处理
           * 但是如果此时未在对应 category 中做相应定义声明的话，将直接把对应信息交给 axios，而不做额外处理
           */
          if (Array.isArray(value)) {
            // 检索 key 的定义情况
            const definedCategoryForKey = this.getCategory(key)
            if (definedCategoryForKey?.cross) {
              const crossKey = definedCategoryForKey.cross.key || key
              if (definedCategoryForKey?.cross.mode === 'append') {
                value.forEach((v: string | number) => {
                  params[`${crossKey}${v}`] = 1
                })
                continue // 跳过，不再将原始字段值插入params
              }
            }
          }

          params[key] = value
        }
      }
    }

    if (this.config.search?.requestConfig?.method?.toLowerCase() === 'post') { // POST
      const transData = this.config.search?.requestConfig.transferPostData || 'raw'

      let postData: FormData | URLSearchParams
      if (transData !== 'raw') {
        if (transData === 'form') {
          postData = new FormData()
        } else if (transData === 'params') {
          postData = new URLSearchParams()
        }

        Object.keys(params).forEach(k => {
          const v = params[k]
          postData.append(k, v)
        })
      }

      // @ts-ignore
      config.data = postData || params
    } else { // GET
      config.params = params
    }

    return config
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

    // 根据配置和搜索关键词生成 AxiosRequestConfig
    const axiosConfig: AxiosRequestConfig = merge(
      { url: '/', responseType: 'document' },
      this.config.search?.requestConfig, // 使用默认配置覆盖垫片配置
      this.transformSearchFilter(filter) // 根据搜索信息生成配置
    )

    // 请求页面并转化为document
    const req = await this.request({ ...axiosConfig, checkLogin: true })
    const rawTorrent = this.transformSearchPage(req.data)
    return rawTorrent.map(t => this.fixParsedTorrent(t, { filter, axiosConfig }))
  }

  async request<T> (axiosConfig: AxiosRequestConfig & { requestName?: string, checkLogin?: boolean }): Promise<AxiosResponse> {
    // 统一设置一些 AxiosRequestConfig， 当作默认值
    axiosConfig.baseURL = axiosConfig.baseURL || this.activateUrl
    axiosConfig.url = axiosConfig.url || '/'
    console.log(axiosConfig)

    let req: AxiosResponse
    try {
      req = await axios.request<T>(axiosConfig)

      // 全局性的替换 span.__cf_email__
      if (axiosConfig.responseType === 'document') {
        const doc = req.data

        // 进行简单的检查，防止无意义的替换
        if (doc instanceof Document &&
          doc.documentElement.outerHTML.search('__cf_email__')) {
          const cfProtectSpan = Sizzle('.__cf_email__', doc)

          cfProtectSpan.forEach(element => {
            element.replaceWith(cfDecodeEmail((element as HTMLElement).dataset.cfemail!))
          })
        }

        req.data = doc
      }
    } catch (e) {
      req = (e as AxiosError).response!
      if (req.status >= 400) {
        throw Error('网络请求失败') // FIXME i18n
      }
    }

    if (axiosConfig.checkLogin && !this.loggedCheck(req)) {
      throw Error('未登录') // FIXME i18n
    }

    // 将结果缓存到 _runtime.cacheRequest 已实现跨方法调用
    const requestCacheName = axiosConfig.requestName || axiosConfig.url
    this._runtime.cacheRequest.set(requestCacheName, req)
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
    const { selector } = elementQuery
    let query: string = String(elementQuery.text || '')
    let selectorId = 0
    if (selector) {
      const selectors = ([] as string[]).concat(selector)
      for (; selectorId < selectors.length; selectorId++) {
        const selector = selectors[selectorId]
        if (element instanceof Node) {
          // 这里我们预定义一个特殊的 Css Selector，即不进行子元素选择
          const another = (selector === ':self' ? element : Sizzle(selector, element)[0]) as HTMLElement
          if (another) {
            if (elementQuery.elementProcess && elementQuery.elementProcess.length > 0) {
              query = this.runQueryFilters<string>(another, elementQuery.elementProcess)
            } else if (elementQuery.data) {
              query = another.dataset[elementQuery.data] || ''
            } else if (elementQuery.attr) {
              query = another.getAttribute(elementQuery.attr) || ''
            } else {
              query = another.innerText.replace(/\n/ig, ' ') || ''
            }
          }
        } else {
          query = get(element, selector)
        }

        // noinspection SuspiciousTypeOfGuard
        if (typeof query === 'string') {
          query = query.trim()
        }
        if (query !== '') {
          break
        }
      }
    }

    if (elementQuery.switchFilters && elementQuery.switchFilters.length > 0) {
      /**
       * 当所有selector都未匹配时 selectorId = selectors.length，此时可能
       * 导致 switchFilters[selectorId] === undefined ，所以此时不应运行 switchFilters
       */
      if (selectorId < elementQuery.switchFilters.length) {
        query = this.runQueryFilters(query, elementQuery.switchFilters[selectorId])
      }
    } else if (elementQuery.filters && elementQuery.filters.length > 0) {
      query = this.runQueryFilters(query, elementQuery.filters)
    }

    return query
  }

  protected runQueryFilters <T> (query: any, filters: (Function | string)[] | Function | string): T {
    const realFilters = ([] as (Function | string)[]).concat(filters)
    for (let i = 0; i < realFilters.length; i++) {
      let fn = realFilters[i]
      // eslint-disable-next-line no-new-func
      fn = typeof fn === 'string' ? (new Function('query', `return ${fn}`)) : fn
      query = fn(query)
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
   * 如何解析 JSON 或者 Document，获得种子详情列表
   * @param doc
   */
  protected transformSearchPage (doc: Document | object): Torrent[] {
    if (!this.config.selector?.search?.rows) {
      throw Error('列表选择器未定义')
    }

    const rowsSelector = this.config.selector.search.rows
    const torrents: Torrent[] = []

    let trs: any
    if (doc instanceof Document) {
      trs = Sizzle(rowsSelector.selector as string, doc)

      /**
       * 应对某些站点连用多个tr表示一个种子的情况，将多个tr使用 <div> 包裹成一个 Element，
       * 这种情况下，子选择器就可以写成 `tr:nth-child(1) xxxx` 来精确
       */
      const rowMergeDeep: number = rowsSelector.merge || 1
      if (trs.length > 0 && rowMergeDeep > 1) {
        const newTrs: Element[] = []

        chunk(trs, rowMergeDeep).forEach(chunkTr => {
          const wrapperDiv = doc.createElement('div')
          chunkTr.forEach(tr => { wrapperDiv.appendChild(tr as Element) })
          newTrs.push(wrapperDiv)
        })

        trs = newTrs
      }
    } else {
      // 同样定义一个 :self 以防止对于JSON返回的情况下，所有items在顶层字典（实际是 Object[] ）下
      trs = rowsSelector.selector === ':self' ? doc : get(doc, rowsSelector.selector as string)
    }

    trs?.forEach((tr: any) => {
      torrents.push(this.parseRowToTorrent(tr) as Torrent)
    })

    return torrents
  }

  protected fixParsedTorrent (torrent: Torrent, requestConfig: SearchRequestConfig): Torrent {
    for (const [key, value] of Object.entries(torrent)) {
      let updateValue = value
      if (key === 'url' || key === 'link') {
        // 将相对链接补齐至绝对链接地址
        updateValue = this.fixLink(value as string, requestConfig)
      } else if (key === 'size' && typeof value === 'string') {
        // 将获取到的 size 从 string 转化为 bytes
        updateValue = parseSizeString(value)
      } else if (key === 'time') {
        // 不指定时区的话默认按0时区处理
        updateValue = parseTimeWithZone(value, this.config.timezoneOffset || '+0000')
      } else if (['id', 'size', 'seeders', 'leechers', 'completed', 'comments', 'category', 'status'].includes(key)) {
        // 其他一些能够为数字的统一转化为数字
        if (typeof value === 'string') {
          updateValue = updateValue.replace(/[, ]/ig, '') // 统一处理 `1,024` `1 024` 之类的情况
          if (value.match(/^\d*$/)) { // 尽可能的将返回值转成数字类型
            updateValue = isNaN(parseInt(updateValue)) ? 0 : parseInt(updateValue)
          }
        }
      }

      /**
       * 对 Category 属性进行转化，则要求我们在 this.config.search.categories 中定义一个
       * { name: 'Category', options: {value: string|number, name: string}[] }
       */
      if (key === 'category' && this.categoryMap) {
        const CategoryData = this.categoryMap.find((d) => d.value === updateValue)
        if (CategoryData) {
          updateValue = CategoryData.name
        }
      }

      // @ts-ignore
      torrent[key] = updateValue
    }
    return torrent
  }

  protected parseRowToTorrent (row: Element | Document | Object): Partial<Torrent> {
    let torrent = {} as Partial<Torrent>
    for (const [key, selector] of Object.entries(this.config.selector!.search!)) {
      // 应该跳过的部分
      if ([
        'rows', // rows 已经在前面被处理过了
        'tags' // tags 转由 parseTagsFromRow 方法处理
      ].includes(key)) {
        continue
      }

      // @ts-ignore
      torrent[key] = this.getFieldData(row, selector!)
    }

    // 处理Tags
    if (this.config.selector?.search?.tags) {
      torrent.tags = this.parseTagsFromRow(row)
    }

    // 处理下载进度
    if (!torrent.progress || !torrent.status) {
      torrent = Object.assign(torrent, this.parseDownloadProcessFromRow(row))
    }

    return torrent
  }

  protected parseTagsFromRow (row: Element | Document | Object): SearchResultItemTag[] {
    const tags: SearchResultItemTag[] = []
    const tagsQuery = this.config.selector!.search!.tags!
    for (let i = 0; i < tagsQuery.length; i++) {
      const { selector, name, color } = tagsQuery[i]
      if (row instanceof Element) {
        if (Sizzle(selector, row).length > 0) {
          tags.push({ name, color })
        }
      } else {
        if (get(row, selector)) {
          tags.push({ name, color })
        }
      }
    }

    return tags
  }

  protected parseDownloadProcessFromRow (row: Element | Document | Object): {
    progress?: number; /* 进度（100表示完成） */ status?: ETorrentStatus; /* 状态 */
  } {
    return {}
  }

  async getTorrentPageLink (torrent: Torrent): Promise<string> {
    return torrent.url
  }

  async getTorrentDownloadLink (torrent: Torrent):Promise<string> {
    if (!torrent.link && this.config.selector?.detail?.link) {
      const { data } = await this.request({
        url: torrent.url,
        responseType: this.config.detail?.type || 'document'
      })
      return this.getFieldData(data, this.config.selector.detail.link)
    }

    return torrent.link
  }
}
