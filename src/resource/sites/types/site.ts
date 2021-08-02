import { ETorrentBaseTagColor, ITorrent } from './torrent';
import { IUserInfo } from './userinfo';
import { IElementQuery, ISearchCategories } from './search';
import { AxiosRequestConfig, ResponseType } from 'axios';
import { transPostDataTo, fullUrl, fullUrlProtect, timezoneOffset } from '@ptpp/utils/types';

export type SiteSchema = 'AbstractBittorrentSite' | 'AbstractPrivateSite' |
  'NexusPHP' | 'Unit3D' |
  'Gazelle' | 'GazelleJSONAPI' |
  'AvistaZ'

export type SiteFeature = string
  /**
   * 搜索支持，默认都支持该方法，除非手动指定 false 此时调用 searchTorrent 会报错
   */
  | 'searchTorrent'
  /**
   * 个人信息获取，默认所有基于 PrivateSite 都支持该方法，除非手动指定 false
   */
  | 'queryUserInfo'
  /**
   * 跳过 IMDb 搜索，即如果传入字符串满足 tt\d{7,8} 时，该站点返回 空Array，
   * 等同于旧版的配置项 "imdbSearch": false 或 "skipIMDbId": true
   */
  | 'skipImdbSearch'

export type listSelectors = {
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

  /**
   * 站点图标，具体处理过程见 `favicon.ts` 的说明
   * 此处可以不填，也可以是：
   *  - 站点 favicon.ico 的完整url，例如 https://xxxx.site/favicon.ico   （从http开始写）
   *  - 本地 ./public/assets/sites 下的 {name}.png 文件   (写法 /assets/sites/{name}.png )
   *  - `data:image/` 开头的Base64字符串 （不会有人这么做吧，一定过不了 Code Review 的）
   */
  favicon?: string | `data:image/${string}` | `/assets/sites/${string}.png`;

  /**
   * 站点是否已经死亡，死亡站点不再进行任何数据获取的交互。
   * 对于已经死亡的站点，最好能存一下其 favicon
   * TODO 仅用来保存用户的相关数据，且在展示时默认关闭输出。
   */
  isDead?: boolean,

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

    /**
     * 额外处理 Imdb 相关信息， 注意此函数（如果定义的话）是在 searchTorrents 中进行，
     * 即此时已根据 requestConfig 和传入的 filter 信息生成了普通搜索时的 Axios 配置，
     * @param config
     */
    imdbTransformer?: (config: AxiosRequestConfig) => AxiosRequestConfig,

    keywordsParam?: string, // 当不指定且未改写时，会导致keyword未被搜索使用
    categories?: ISearchCategories[], // 站点对应搜索入口的种子分类信息

    selectors?: listSelectors
  } // 站点搜索方法如何配置

  /**
   * 种子列表页配置
   * 注：只有极其特殊的情况下才需要定义此处的 selectors ， 一般如下：
   *  - 使用 AJAX 方法异步加载页面种子
   */
  list?: {
    selectors?: listSelectors
  },

  detail?: {
    type?: ResponseType, // 当不指定时，默认为 document

    selectors?: {
      link?: IElementQuery // 用于获取下载链接不在搜索页，而在详情页的情况
      [key: string]: IElementQuery | undefined // FIXME
    } & { [torrentKey in keyof ITorrent]?: IElementQuery } // 种子相关选择器
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
    process?: {
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
    }[],

    selectors?: { [userinfoKey in keyof IUserInfo]?: IElementQuery } // 用户信息相关选择器
  }

  feature?: { // 站点支持方法
    [key in SiteFeature]?: boolean
  }

  config?: {
    activateUrl?: string; // 用户在搜索时使用的地址
    entryPoint?: string; // 用户在options首页点击时，打开的站点地址
  }
}
