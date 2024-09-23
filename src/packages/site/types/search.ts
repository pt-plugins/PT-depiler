import type { AxiosRequestConfig } from "axios";
import type { TQueryFilter } from "../utils/filters";
import type { ITorrent } from "./torrent";

/**
 * 搜索结果解析状态
 */
export enum ESearchResultParseStatus {
  success,
  parseError,
  passSearch,
  needLogin,
  noResults, // 等同于原先的 noTorrents 和 torrentTableIsEmpty ，这两个在结果上没有区别
}

export interface IElementQuery {
  // selector或 text 一定要有一个

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
   * 对于Element的处理方法，4种方法互斥，如果不做定义，则直接返回 innerText
   */

  // 对 selector 出来的 Element 进行自定义处理，此时不建议再定义 filters 或 switchFilters 以免出错
  // eslint-disable-next-line @typescript-eslint/ban-types
  elementProcess?: Function | null;
  // 使用 Sizzle.matchesSelector 进行匹配，并将结果设置为第一个匹配成功的键值
  case?: { [selector: string]: any } | null;
  // 使用 HTMLElement.dataset[''] 进行取值，取不到值则置 ''
  data?: string | null;
  // 使用 HTMLElement.getAttribute('') 进行取值，取不到值则置 ''
  attr?: "title" | "href" | string | null;

  /**
   * 对获取结果进行处理，处理结果将作为最终的值输出
   * 注意： filters 和 switchFilters 不参与 mergeWith
   *  - filters： 对 选出来的 string 进行处理
   *  - switchFilters: 根据 最终使用的 selector Id 确定使用的filters，优先级更高，
   *                   switchFilters是旧版本处理方式，建议使用 `selector: ':self' + case: {}` 来替代switchFilters
   */
  filters?: TQueryFilter[];
  switchFilters?: TQueryFilter[]; // 会根据selector的位置来使用对应的filter
}

export interface ISearchCategoryOptions {
  name: string;
  value: string | number;
}

export interface ISearchCategories {
  name: string | "Category" | "类别"; // 搜索大类名称
  key: string | "#changePath"; // 搜索大类
  notes?: string; // 分类说明
  options: ISearchCategoryOptions[];
  // 该搜索大类是否允许内部交叉 （ 不声明，则默认不允许（False） ）
  cross?:
    | {
        /**
         * 当允许搜索类别内部交叉时，该搜索类别 {key: [v1, v2]} 在请求时字段如何处理，
         * 如果定义了 cross.key， 则外层的 key 会被覆盖，即 key = cross.key | key
         *
         *  - 'brackets':    {key}[]={v1}&{key}[]={v2} （axios默认）
         *  - 'comma':       {key}={v1},{v2}
         *  - 'append':      {key}{v1}=1&{key}{v2}=1
         *  - 'appendQuote': {key}[{v1}]=1&{key}[{v2}]=1
         */
        mode?: "brackets" | "comma" | "append" | "appendQuote";
        key?: string; // 当内部交叉时，params与已定义的 key 不一致时使用
      }
    | false;
}

export interface ISearchParams {
  /**
   * 约定的特殊key （都以 # 开头）：
   *   - #changePath   更换请求的 path 为 value 值
   */
  key: ISearchCategories["key"];
  value: string | number | string[] | number[];
}

export type ISearchParamsMap = Record<ISearchParams["key"], ISearchParams["value"]>;

export interface ISearchFilter {
  keywords?: string;
  extraParams?: ISearchParams[]; // 其他请求参数信息
}

export interface ISearchRequestConfig {
  filter: ISearchFilter;
  axiosConfig: AxiosRequestConfig;
}

export interface ISearchResult {
  status: ESearchResultParseStatus;
  data: ITorrent[];
}
