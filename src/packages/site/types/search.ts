import type { AxiosRequestConfig } from "axios";
import type { TQueryFilter } from "@ptd/site";
import type { ITorrent, TBaseTorrentTagName } from "./torrent";

export type TAdvanceSearchKeyword = "imdb" | "tmdb" | "douban" | "bangumi" | "anidb" | "tvdb" | string;

export interface ISearchInput {
  keywords?: `${TAdvanceSearchKeyword}|${string}` | string;
  searchEntry?: IAdvancedSearchRequestConfig; // 展开的搜索入口
  requestConfig?: AxiosRequestConfig;
}

export type TSearchRequestConfigTransformer = (input: ISearchInput) => AxiosRequestConfig;

export interface IBaseSearchConfig {
  /**
   * 搜索时进行请求的 axios 配置项
   *
   * 为了避免配置项过于重复/麻烦，实际请求的 AxiosRequestConfig 会按照如下顺序生成：
   * 1. 默认的 AxiosRequestConfig 垫片： { responseType: 'document', baseUrl: site.url, url: '/', params: {}, data: {} }
   * 2. 如果设置有 filter.searchEntry
   *    - 如果 filter.searchEntry.merge 为 true， 则 在 siteConfig.search 的基础上展开，则形成对应的 requestConfig
   *    - 如果 filter.searchEntry.merge 为 false，则 不做展开，直接取 filter.searchEntry 的 requestConfig
   *
   * 2. search.requestsConfig 中的配置项，如果是站点是 json 返回，应该在此处覆写 responseType
   * 3.
   * 4. 如果有 advanceKeyword，则会根据 advanceKeyword 的配置生成请求配置
   * 5. 根据实际的搜索条件 keywords 生成的请求配置
   * 6. 如果有 requestConfigTransformer，则会在最后一步对请求配置进行处理
   * 一般情况下，此项用于调试，如： (config) => {console.log(config); return config;}
   *
   * 注意：
   * 1. 每一步生成的字段均会被下一步操作给合并覆盖
   * 2. 对于post请求，如果类型为 form 或 params，请参照 axios 说明设置 content-type 请求头：
   *    - 'application/x-www-form-urlencoded': https://axios-http.com/docs/urlencoded#automatic-serialization
   *    - 'multipart/form-data': https://axios-http.com/docs/multipart#automatic-serialization
   *
   */
  requestConfig?: Partial<AxiosRequestConfig>;

  /**
   * 定义在正式开始请求前，对合并后的 AxiosRequestConfig 如何处理
   * 一般情况下，此项用于调试，如： (config) => {console.log(config); return config;}
   *
   * @param config 已根据 requestConfig 和传入的 filter 信息生成了普通搜索时的 Axios 配置
   * @param filter 原始搜索条件，注意此处的 keywords 已经被去除了前缀 `${advanceKeywordType}|`
   */
  requestConfigTransformer?: TSearchRequestConfigTransformer;
}

export interface IAdvanceKeywordSearchConfig extends IBaseSearchConfig {
  enabled?: boolean;
}

export interface ISearchConfig extends IBaseSearchConfig {
  /**
   * 搜索关键字的路径，用于在搜索时对关键字进行处理
   * 例如： params.keywords 用于将关键字放在请求参数中
   */
  keywordPath?: `${"data." | "params." | string}${string}`;

  /**
   * 高级搜索词，格式如下 ${advanceKeywordType}|${keyword}，例如：
   *  - imdb|tt17097088
   *  - douban|35131346
   *
   * 注意：我们断言高级搜索词的内容是单一的，即不会出现多个高级搜索词{或,和}普通搜索词 同时出现的情况
   */
  advanceKeywordParams?: Record<
    TAdvanceSearchKeyword,
    IAdvanceKeywordSearchConfig | false /* 等同于 { enabled: false }*/
  >;

  selectors?: {
    /**
     * 种子列表定位。
     * filter 配置项用于对 selector 获取到的rows进行处理，
     * 如果filter不存在，则其他部分选项起作用：
     *  - merge  用于合并部分使用多行表示一个种子的情况，仅在返回为 Document 时生效
     */
    rows?: {
      selector: string | ":self";
      filter?: <T>(rows: T) => T;
      merge?: number;
    };
  } & {
    /**
     * 对于种子的基本属性（除 tags 外）使用 IElementQuery 提供的字段进行检索
     */
    [torrentKey in keyof Omit<ITorrent, "tags">]?: IElementQuery; // 种子相关选择器
  } & {
    /**
     * 对于种子的 tags 属性，如果对应 selector 存在，则认为对应tag存在
     */
    tags?: {
      name: TBaseTorrentTagName;
      selector: string;
      color?: string;
    }[];
  };
}

export interface IAdvancedSearchRequestConfig extends Partial<ISearchConfig> {
  /**
   * 是否基于站点默认的search配置进行合并，默认情况下均会合并（因为绝大多数情况下都是可以复用的）
   * 只有显式声明为 false，才不会合并
   */
  merge?: boolean;
}

export interface ISearchCategoryOptions {
  name: string;
  value: string | number;
}

export interface ISearchCategories {
  name: string; // 搜索大类名称
  key: string; // 搜索大类
  notes?: string; // 分类说明
  options: ISearchCategoryOptions[];
  // 该搜索大类是否允许内部交叉 （ 不声明，则默认不允许（False） ）
  cross?:
    | {
        /**
         * 当允许搜索类别内部交叉时，该搜索类别 {key: [v1, v2]} 在请求时字段如何处理，
         * 如果定义了 cross.key， 则外层的 key 会被覆盖，即 key = cross.key | key
         *
         * | mode | query | axios config |
         * |:--:|:---|:---|
         * | brackets | {key}[]={v1}&{key}[]={v2} | { key: [v1,v2] } |
         * | comma | {key}={v1},{v2} | { key: `${v1},${v2}` } |
         * | append | {key}{v1}=1&{key}{v2}=1 | { `${key}${v1}`: 1, `${key}${v2}`: 1 } |
         * | appendQuote | {key}[{v1}]=1&{key}[{v2}]=1 | { `${key}[${v1}]`: 1, `${key}[${v2}]`: 1 } |
         */
        mode?: "brackets" | "comma" | "append" | "appendQuote";
        key?: string; // 当内部交叉时，params与已定义的 key 不一致时使用
      }
    | false;
}

/**
 * 搜索结果解析状态
 */
export enum ESearchResultParseStatus {
  unknownError,
  waiting,
  working,
  success,
  parseError,
  passSearch,
  needLogin,
  noResults, // 等同于原先的 noTorrents 和 torrentTableIsEmpty ，这两个在结果上没有区别
}

export interface IElementQuery {
  /**
   * 当text输入时，text会作为默认值
   * 特殊值：
   * - N/A 表示源站并没有提供该信息
   */
  text?: string | number | "N/A";

  /**
   * 如果selector为 string[]， 则会依次尝试并找到第一个成功获取到有效信息的
   * 此外，此处约定了一些特殊的选择器
   *  - :self  该元素自身，对于html文档，一般用于tr自身属性，对于json文档，一般指root顶层
   */
  selector?: string | ":self" | string[] | null;

  /**
   * 如果是html文档，则提供了4种Element的处理方法（如果不做定义，则直接返回 innerText），
   * 这四种方法互斥，优先级依次为：elementProcess > case > data > attr ,
   * 如果不做定义，则直接返回 innerText
   */

  // 对 selector 出来的 Element 进行自定义处理，此时不建议再定义 filters 或 switchFilters 以免出错
  elementProcess?: (query: any) => any | null;

  // 使用 Sizzle.matchesSelector 进行匹配，并将结果设置为第一个匹配成功的键值
  case?: { [selector: string]: any } | null;
  // 使用 HTMLElement.dataset[''] 进行取值，取不到值则置 ''
  data?: string | null;
  // 使用 HTMLElement.getAttribute('') 进行取值，取不到值则置 ''
  attr?: "title" | "href" | string | null;

  /**
   * 对获取结果进行处理，处理结果将作为最终的值输出
   *  - filters： 对 选出来的 string 进行处理
   *  - switchFilters: 根据 最终使用的 selector 确定使用的filters
   *                   在 selector为数组时 且 有生效的 selector 且 有对应定义的 filters 时，覆盖 filters 参数生效
   */
  filters?: TQueryFilter[];
  switchFilters?: Record<string, TQueryFilter[]>; // 会根据匹配到的selector来使用对应的filter
}

export interface ISearchResult {
  status: ESearchResultParseStatus;
  data: ITorrent[];
}
