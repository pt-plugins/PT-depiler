import { ETorrentBaseTagColor, ITorrent } from './torrent';
import { IUserInfo } from './userinfo';
import { AxiosRequestConfig, ResponseType } from 'axios';
import { transPostDataTo, fullUrl, fullUrlProtect } from '@ptpp/utils/types'; // FIXME
import { timezoneOffset } from '@ptpp/utils/types';

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
  attr?: string | null, // 使用 HTMLElement.getAttribute('') 进行取值，取不到值则置 ''

  /**
   * 对获取结果进行处理，处理结果将作为最终的值输出
   * 注意： filters 和 switchFilters 不参与 mergeWith
   *  - filters： 对 选出来的 string 进行处理
   *  - switchFilters: 根据 最终使用的 selector Id 确定使用的filters，优先级更高
   */
  filters?: Function[],
  switchFilters?: Function[], // 会根据selector的位置来使用对应的filter
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

export interface SearchRequestConfig {
  filter: ISearchFilter,
  axiosConfig: AxiosRequestConfig
}

export type SiteSchema = 'AbstractBittorrentSite' | 'AbstractPrivateSite' |
  'NexusPHP' | 'Unit3D' |
  'Gazelle' | 'GazelleJSONAPI' |
  'AvistaZ'

export type SiteFeature = 'queryUserInfo'

/**
 * 站点配置，这部分配置由系统提供，并随着每次更新而更新，不受用户配置的任何影响
 * 当且仅当 基于模板构建时，该部分配置可以由用户修改
 */
export interface ISiteMetadata {
  name: string; // 站点名
  aka?: string | string[]; // 站点别名
  description?: string; // 站点说明
  tags?: string[]; // 站点标签

  /**
   * 指定继承模板类型，如果未填写的话，但文件抛出了 default class 的话，会忽略掉此处的参数
   * 否则会根据其所在的目录进行自动更正为缺省值：
   *  - public 目录下， schema 的缺省值为 AbstractBittorrentSite
   *  - private 目录下， schema 的缺省值为 AbstractPrivateSite
   *
   */
  schema?: SiteSchema;

  /**
   * 完整的网站地址，如果网站支持 `https` ，请优先考虑填写 `https` 的地址
   * 部分站点可能对于站点链接存在更为隐秘的要求，则请对链接进行 btoa ，以防止在配置时泄露
   * （但这并不能阻止用户通过插件的网络请求等其他途径知道对应网址
   */
  url: fullUrl | fullUrlProtect; // 完整的网站地址，如果网站支持 `https` ，请优先考虑填写 `https` 的地址
  favicon?: string; // 站点 favicon.ico 的url，例如 https://ourbits.club/favicon.ico

  /**
   * 和url相同作用和写法，唯一不同是将会覆写url的行为（因为url不允许用户编辑）
   * 即，当 legacyUrl 存在时：
   *  - 在搜索中，如果用户设置时未传入 activateUrl ，则使用 legacyUrl[0]
   *  - 在页面中， [url, ...legacyUrl] 效果相同
   */
  legacyUrl?: (fullUrl | fullUrlProtect)[];

  collaborator?: string | string[]; // 协作者，建议使用 string[] 进行定义
  timezoneOffset?: timezoneOffset;

  host?: string; // 站点域名，如果不存在，则从url中获取
  formerHosts?: string[]; // 站点过去曾经使用过的，但现在已不再使用的域名

  search?: {
    /**
     * 搜索时进行请求，为了避免过于麻烦的配置项
     * 设置了默认的 AxiosRequestConfig 为 { responseType: 'document', url: '/' }
     * 则意味则如果是 json 返回，应该自己覆写 responseType
     */
    requestConfig?: AxiosRequestConfig & { transferPostData?: transPostDataTo },

    keywordsParam?: string, // 当不指定且未改写时，会导致keyword未被搜索使用
    categories?: ISearchCategories[] // 站点对应搜索入口的种子分类信息
  } // 站点搜索方法如何配置

  detail?: {
    type?: ResponseType, // 当不指定时，默认为 document
  }

  /**
   * 该配置项仅对 基于 PrivateSite 模板，且未改写 flushUserInfo 的站点生效
   */
  userInfo?: {
    /**
     * 如果可以，则从插件历史缓存的数据中获取那些数据（一般是比较恒定的数据，如 id, name, joinTime ）
     * 并可以帮助我们减少网络请求的字段
     */
    pickLast?: (keyof IUserInfo)[],

    /**
     * 有执行顺序，从上到下依次执行，第一个不应该有断言 assertion，后续配置项可以有断言
     */
    process: {
      requestConfig: AxiosRequestConfig & { transferPostData?: transPostDataTo }, // { url: '/', params: {}, responseType: 'document' } 会作为基件
      /**
       * 请求参数替换断言
       * key为之前步骤获取到的用户信息字典，value为需要替换的键值，如果：
       *  requestConfig.url 中有类似 `$value$` 的字段，则替换 url
       *  不然会生成 params: {value: key}
       */
      assertion?: {
        [key in keyof IUserInfo]?: string
      },
      fields: (keyof IUserInfo)[]
    }[]
  }

  selector?: {
    search?: {
      /**
       * 种子列表定位。
       * filter 配置项用于对 selector 获取到的rows进行处理，
       * 如果filter不存在，则其他部分选项起作用：
       *  - merge  用于合并部分使用多行表示一个种子的情况，仅在返回为 Document 时生效
       */
      rows?: {
        selector: string | ':self',
        filter?: <T>(rows: T) => T
        merge?: number,
      }
    } & { [torrentKey in keyof Omit<ITorrent, 'tags'>]?: IElementQuery } // 种子相关选择器
      & { tags?: { selector: string, name: (keyof typeof ETorrentBaseTagColor) | string, color?: string }[] } // Tags相关选择器

    detail?: {
      link?: IElementQuery // 用于获取下载链接不在搜索页，而在详情页的情况
      [key: string]: IElementQuery | undefined // FIXME
    } & { [torrentKey in keyof ITorrent]?: IElementQuery } // 种子相关选择器

    userInfo?: { [userinfoKey in keyof IUserInfo]?: IElementQuery } // 用户信息相关选择器
  }

  feature?: { // 站点支持方法
    [key in SiteFeature]: boolean
  }

  config?: {
    activateUrl?: string; // 用户在搜索时使用的地址
    entryPoint?: string; // 用户在options首页点击时，打开的站点地址
  }
}
