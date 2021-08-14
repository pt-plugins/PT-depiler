import { AxiosRequestConfig } from 'axios';
import { ITorrent } from './torrent';

export type TDefinedFilterName =
  'querystring'
  | 'parseNumber'
  | 'parseSize'
  | 'parseTime'
  | 'parseTTL';

export interface IDefinedQueryFilter {
  name: TDefinedFilterName,
  args?: any[]
}

export type TQueryFilter = IDefinedQueryFilter | Function

export class NoTorrentsError extends Error {}

/**
 * 搜索结果解析状态
 */
export enum ESearchResultParseStatus {
  success,
  parseError,
  passSearch,
  needLogin,
  noTorrents, // 等同于原先的 noTorrents 和 torrentTableIsEmpty ，这两个在结果上没有区别
}

export interface IElementQuery {
  // selector或 text 一定要有一个

  /**
   * 当text输入时，text会作为默认值
   * 特殊值：
   * - N/A 表示源站并没有提供该信息
   */
  text?: string | number | 'N/A',

  /**
   * 如果selector为 string[]， 则会依次尝试并找到第一个成功获取到有效信息的
   * 此外，此处约定了一些特殊的选择器
   *  - :self  该元素自身，对于html文档，一般用于tr自身属性，对于json文档，一般指root顶层
   */
  selector?: string | ':self' | string[] | null,

  /**
   * 对 Element 进行处理
   * 注意， elementProcess 不参与 mergeWith
   * - elementProcess：对 selector 出来的 Element 进行处理，此时不建议再定义 filters 或 switchFilters 以免出错
   */
  elementProcess?: Function | null, // 自定义对于Element的处理方法，此时 attr 以及 data 选项均不生效，但 filters 和 switchFilters 仍生效
  case?: { [selector: string]: any } // 使用 Sizzle.matchesSelector 进行匹配，并将结果设置为第一个匹配成功的键值
  data?: string | null, // 使用 HTMLElement.dataset[''] 进行取值，取不到值则置 ''
  attr?: 'title' | 'href' | string | null, // 使用 HTMLElement.getAttribute('') 进行取值，取不到值则置 ''

  /**
   * 对获取结果进行处理，处理结果将作为最终的值输出
   * 注意： filters 和 switchFilters 不参与 mergeWith
   *  - filters： 对 选出来的 string 进行处理
   *  - switchFilters: 根据 最终使用的 selector Id 确定使用的filters，优先级更高
   */
  filters?: TQueryFilter[],
  switchFilters?:TQueryFilter[], // 会根据selector的位置来使用对应的filter
}

export interface ISearchCategoryOptions {
  name: string,
  value: string | number
}

export interface ISearchCategories {
  name: string | 'Category' | '类别', // 搜索大类名称
  key: string | '#changeDomain' | '#changePath', // 搜索大类
  notes?: string, // 分类说明
  options: ISearchCategoryOptions[],
  // 该搜索大类是否允许内部交叉 （ 不声明，则默认不允许（False） ）
  cross?: {
    /**
     * 当允许搜索类别内部交叉时，该搜索类别在请求时字段如何处理，如果是：
     *  - 'raw': 由 axios 自动转化为 &{key}[]={xxx} 的形式 （默认）
     *  - 'append': 转化为 &{key}{xxx}=1 的形式交给 axios 来请求，此时可以通过定义 key 来改写 key
     *  - 'appendQuote': 类同 'append'，只不过转成了 &{key}[{xxx}]=1
     */
    mode?: 'raw' | 'append' | 'appendQuote'
    key?: string // 当内部交叉时，params与已定义的 key 不一致时使用
  }
}

export interface ISearchParams {
  /**
   * 约定的特殊key （都以 # 开头）：
   *   - #changeDomain   更换请求的 baseUrl 为 value 值
   */
  key: string,
  value: string | number | string[] | number[]
}

export interface ISearchFilter {
  keywords?: string,
  extraParams?: ISearchParams[], // 其他请求参数信息
}

export interface ISearchRequestConfig {
  filter: ISearchFilter,
  axiosConfig: AxiosRequestConfig
}

export interface ISearchResult {
  status: ESearchResultParseStatus,
  data: ITorrent[]
}
