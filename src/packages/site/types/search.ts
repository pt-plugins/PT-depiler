// noinspection ES6PreferShortImport

import type { AxiosRequestConfig } from "axios";
import type { TSupportSocialSite$1 } from "@ptd/social";
import type { EResultParseStatus } from "./base";
import type { ITorrent, TBaseTorrentTagName } from "./torrent";
import type { TQueryFilter } from "../utils/filter";

export type TAdvanceSearchKeyword = TSupportSocialSite$1 | string;

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
   * 2. 对于post请求，如果类型为 form 或 params （默认为 json），请参照 axios 说明设置 content-type 请求头：
   *    - 'application/x-www-form-urlencoded': https://axios-http.com/docs/urlencoded#automatic-serialization
   *    - 'multipart/form-data': https://axios-http.com/docs/multipart#automatic-serialization
   *
   */
  requestConfig?: Partial<AxiosRequestConfig>;

  /**
   * 是否在搜索发送请求前延迟一段时间，单位为毫秒
   */
  requestDelay?: number;

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
   * 注意：1. 我们断言高级搜索词的内容是单一的，即不会出现多个高级搜索词{或,和}普通搜索词 同时出现的情况
   *      2. 高级搜索词需要明确声明，如未声明则相当于搜索 普通搜索词
   */
  advanceKeywordParams?: Record<
    TAdvanceSearchKeyword,
    IAdvanceKeywordSearchConfig | false /* 等同于 { enabled: false } */
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
    [torrentKey in keyof Omit<ITorrent, "site" | "tags">]?: IElementQuery; // 种子相关选择器
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

export interface ISearchEntryRequestConfig extends IAdvancedSearchRequestConfig {
  id?: string; // 唯一标识（应该与 ISiteMetadata.searchEntry 中对应的key一致，一般情况下无需特别声明）
  name?: string; // 别名
  enabled?: boolean; // 是否默认启用
}

export interface ISearchCategoryOptions {
  name: string;
  value: string | number;
}

export type TSelectSearchCategoryValue = ISearchCategoryOptions["value"] | ISearchCategoryOptions["value"][];

/**
 * 对自定义搜索方案的分类进行定义
 *
 * 生成请求配置的规则：
 *   1， 如果定义了 generateRequestConfig 方法，则根据该方法生成请求配置
 *   2. 如果未定义 generateRequestConfig 方法，则根据 key, keyPath, cross 信息综合生成请求配置
 *     - 首先检查 cross 是否存在，如果存在则根据 cross.mode + key 生成请求配置
 *     - 如果 cross 不存在，则根据 keyPath 生成请求配置
 *     - 如果 keyPath 不存在，则默认为 params
 * 注意：
 *   1. 对于根据 key, keyPath, cross 信息综合生成请求配置，都会不设置 { merge: false }，以便在生成请求配置时合并站点默认配置
 *   2. 如果需要覆盖站点默认配置，请使用 generateRequestConfig 方法并主动设置 { merge: false } （不建议！！）
 *   3. 在多个 category 组合时，会使用 es-toolkit 中的 merge 方法进行合并
 * 例如：（以下均假设 options 为 [{ name: '电影', value: 4010 }, { name: '电视剧', value: 4011}]）
 *  - 搜索类别为 cat，该搜索类别不允许多选，搜索类别值为 4010
 *    { key: 'cat', options }
 *    -> { requestConfig: { params: { cat: 4010 } } }
 *  - 搜索类别为 cat，该搜索类别不允许多选，搜索类别值为 4010，在请求时应该放入 post.data 中
 *    { key: 'cat', options, keyPath: 'data' }
 *    -> { requestConfig: { data: { cat: 4010 } } }
 *  - 搜索类别为 cat，该搜索类别允许多选，生成方式为 brackets
 *    {  key: 'cat', options, cross: { mode: 'brackets' } }
 *    -> { requestConfig: { params: { cat: [4010, 4011] } } }
 *  - 搜索类别为 cat，该搜索类别允许多选，生成方式为 comma
 *    {  key: 'cat', options, cross: { mode: 'comma' } }
 *    -> { requestConfig: { params: { cat: '4010,4011' } } }
 *  - 搜索类别为 cat，该搜索类别允许多选，生成方式为 append，同时需要覆写 key 为 category_
 *    {  key: 'cat', options, cross: { mode: 'append', key: 'category_' } }
 *    -> { requestConfig: { params: { 'category_4010': 1, 'category_4011': 1 } } }
 *  - 搜索类别为 cat，该搜索类别允许多选，生成方式为 appendQuote
 *    {  key: 'cat', options, cross: { mode: 'appendQuote' } }
 *    -> { requestConfig: { params: { 'cat[4010]': 1, 'cat[4011]': 1 } } }
 *  - 搜索类别为 cat，定义了 generateRequestConfig 方法
 *    { key: 'cat', options, generateRequestConfig: (selectedCategories) => ({ requestConfig: { params: { cat: selectedCategories[0].value } } }) }
 *    -> { requestConfig: { params: { cat: 4010 } } }
 *
 */
export interface ISearchCategories {
  name: string; // 搜索大类名称
  notes?: string; // 分类说明

  /**
   *  搜索大类
   *  注意：
   *   1. 在单个站点中搜索大类的 key 不能重复！！！
   *      对于一些特殊的情况，如不同搜索入口，可能会出现相同的 key，你可以这样处理：
   *        1. 将key 设置为 key_xxxx, key_yyyy
   *        2. 如果这个搜索类别是交叉的，则建议使用 cross.key 覆盖原有的 key
   *        3. 也可以使用 generateRequestConfig 方法覆盖原有的 key
   *   2. 我们约定了如下的特殊key：
   *      - #url: 表示直接替换 requestsConfig.url 的值，此时会忽略 keyPath 和 cross 的设置
   */
  key: "#url" | string;
  keyPath?: "data" | "params" | string; // 在未设置 generateRequestConfig，用于指导怎么生成请求参数，未指定时默认为 params

  options: ISearchCategoryOptions[];
  // 该搜索大类是否允许内部交叉（即多选） （ 不声明，则默认不允许（False） ）
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
         *
         * 注意：
         *  custom 仅为一个占位符，并没有实际的实现，需要在 generateRequestConfig 中自行实现
         */
        mode?: "brackets" | "comma" | "append" | "appendQuote" | "custom";
        key?: string; // 当内部交叉时，params与已定义的 key 不一致时使用
      }
    | false;

  /**
   * 生成请求配置（高级）
   * @param category 用户选择的搜索类别
   */
  generateRequestConfig?: (selectedCategories: TSelectSearchCategoryValue) => IAdvancedSearchRequestConfig;
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
  status: EResultParseStatus;
  data: ITorrent[];
}
