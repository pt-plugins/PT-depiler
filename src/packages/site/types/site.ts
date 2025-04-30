// noinspection ES6PreferShortImport

import type { AxiosRequestConfig } from "axios";
import type { TSiteID, TSiteHost, TSiteUrl, TSiteFullUrl } from "./base";
import type { ITorrent } from "./torrent";
import type { ILevelRequirement, IUserInfo } from "./userinfo";
import type { IElementQuery, ISearchCategories, ISearchConfig, ISearchEntryRequestConfig } from "./search";
import type { timezoneOffset } from "../utils";
import type PrivateSite from "../schemas/AbstractPrivateSite.ts";

export type SiteSchema =
  | "AbstractBittorrentSite"
  | "AbstractPrivateSite"
  | "NexusPHP"
  | "Unit3D"
  | "Gazelle"
  | "GazelleJSONAPI"
  | "AvistaZ";

export interface ISiteUserInputMeta {
  name: string; // 存储在 userConfig.inputSetting 中的名称
  label: string; // 标签名称
  hint: string; // 提示该项如何输入
  required: boolean; // 是否必填
}

/**
 * 站点配置，这部分配置由系统提供，并随着每次插件更新而更新
 */
export interface ISiteMetadata {
  readonly id: TSiteID; // 必须和站点文件名（无扩展）相同

  /**
   * 对应解析的更新版本，建议每次对ISiteMetadata的修改都对此版本号 +1
   * 注意，我们在此处约定如下：
   *  - AbstractBittorrentSite，AbstractPrivateSite，NexusPHP，Unit3D，Gazelle，GazelleJSONAPI，AvistaZ 这些架构不需要更新版本号
   *  - AbstractBittorrentSite，AbstractPrivateSite 模板定义为 -1
   *  - NexusPHP 等其他架构定义为 0
   *  - 其他站点都应该定义为任意大于0的数字，建议定义为 1，你也可以定义为编辑的日期如 YYYYMMDD ，但在单个站点定义中应该保持一致
   */
  version: number;

  name: string; // 站点名

  aka?: string[]; // 站点别名
  description?: string; // 站点说明
  tags?: string[]; // 站点标签
  timezoneOffset?: timezoneOffset;

  readonly collaborator?: string[]; // 提供该站点解决方案的协作者

  /**
   * 指定继承模板类型，如果未填写的话，且站点配置文件抛出了 default class 的话，会忽略掉此处的 schema 参数
   * 否则会根据其 type类型 进行自动更正为缺省值：
   *  - public 类型下， schema 的缺省值为 AbstractBittorrentSite
   *  - private 类型下， schema 的缺省值为 AbstractPrivateSite
   */
  readonly type: "private" | "public"; // 站点类型
  schema?: SiteSchema;

  /**
   * 完整的网站地址，
   *
   * 1. 列表中第一个网址会作为默认的使用地址
   * 2. 如果网站支持 `https` ，请优先考虑填写 `https` 的地址
   * 3. 部分站点可能对于站点链接存在更为隐秘的要求，则请对链接进行 btoa ，以防止在配置时泄露
   *    （但这并不能阻止用户通过安装插件后在使用过程中知道对应网址
   */
  urls: TSiteUrl[];

  host?: TSiteHost; // 站点域名，如果不存在，则从url中获取
  readonly formerHosts?: TSiteHost[]; // 站点过去曾经使用过的，但现在已不再使用的域名

  /**
   * 该站点已经！完全！死亡！没有任何恢复的可能性
   * - 对临时性的站点关闭，更建议用户使用 userConfig.isOffline 属性
   * - 对于已经死亡的站点，插件：①不会在添加时显示该站点；②已添加的获取搜索结果、个人信息功能全部停止
   */
  isDead?: true;

  /**
   * 站点图标，具体处理过程见 `../utils/favicon.ts` 的说明
   * 此处填写格式如下：
   *  - 站点 favicon.ico 的完整url，例如 https://xxxx.site/favicon.ico   （从 `http` 开始写）
   *  - 本地 public/icons/site 目录下的文件，例如 ./{name}.png 或 ./{name}.ico 或 ./{name}.svg     （从 `./` 开始写）
   *  - `data:image/` 开头的Base64字符串 （不会有人这么做吧，一定过不了 Code Review 的）
   */
  favicon?: `${TSiteFullUrl}${string}` | `data:image/${string}` | `./${string}.${"png" | "ico" | "svg"}`;

  category?: ISearchCategories[];

  search?: ISearchConfig; // 站点搜索方法如何配置

  /**
   * 当用户使用默认搜索入口时启动的搜索方法，一般不需要定义（即不定义时自动使用 search.requestConfig），除非有以下情况才建议使用：
   * 1. 站点有多个搜索入口，且不同搜索入口结果不同时
   * 2. 有单次搜索多页的需求（我们不推荐这种做法，因为会导致搜索结果的不稳定性和站点的过重负担）
   */
  searchEntry?: Record<string, ISearchEntryRequestConfig>;

  /**
   * 种子列表页配置（用于展示插件）
   * 注：只有极其特殊的情况下才需要定义此处的 selectors ，未定义时，会使用Search中定义的信息
   * 一般如下：
   *  - 使用 AJAX 方法异步加载页面种子
   */
  list?: {
    selectors?: ISearchConfig["selectors"];
  };

  detail?: {
    requestConfig?: AxiosRequestConfig;

    selectors?: {
      link?: IElementQuery; // 用于获取下载链接不在搜索页，而在详情页的情况
      [key: string]: IElementQuery | undefined; // FIXME
    } & { [torrentKey in keyof ITorrent]?: IElementQuery }; // 种子相关选择器
  };

  download?: {
    /**
     * 对一些特殊的站点（比如需要post方法），你可以为种子下载定义额外的 requestConfig
     * 会通过 toMerged({ url: torrent.link, method: 'get' }, download.requestConfig ?? {}) 进行合并，
     * 如果该站点的下载过于复杂（比如需要传递额外生成的 header），更建议覆写 getTorrentDownloadRequestConfig(torrent) 方法
     */
    requestConfig?: AxiosRequestConfig;
  };

  /**
   * 该配置项仅对 基于 PrivateSite 模板，且未改写 getUserInfoResult 的站点生效
   */
  userInfo?: {
    /**
     * 如果可以，则从插件历史缓存的数据中获取那些数据（一般是比较恒定的数据，如 id, name, joinTime ）
     * 并可以帮助我们减少网络请求的字段
     */
    pickLast?: (keyof IUserInfo)[];

    /**
     * 有执行顺序，从上到下依次执行，第一个不应该有断言 assertion，后续配置项可以有断言
     */
    process?: {
      requestConfig: AxiosRequestConfig; // { url: '/', params: {}, responseType: 'document' } 会作为基件
      /**
       * 请求参数替换断言
       * key为之前步骤获取到的用户信息字典，value为 requestConfig 中需要替换的键值位置：
       * 对 { url: "http://www.our.pt/user/$id$" , params: {  } } ：
       * - { id: 'url' } 表示替换的键值在 url 中，因为 url 为 string 类型，则使用 replace替换 $id$ 字段为之前获取的id值
       * - { id: 'params.uid' } 则表示 替换的键值在 params.uid 中，因为此时params.uid未定义，则 直接设置 params.uid 为之前获取的id值
       */
      assertion?: {
        [key in keyof IUserInfo]?: string;
      };

      /**
       * 请求配置转换器，用于在请求配置中添加一些特殊的配置项
       * @param config
       * @param userInfo
       */
      requestConfigTransformer?: (
        config: AxiosRequestConfig,
        userInfo: IUserInfo,
        siteInstance: PrivateSite,
      ) => AxiosRequestConfig;

      fields: (keyof IUserInfo)[];

      selectors?: { [userinfoKey in keyof IUserInfo]?: IElementQuery }; // 用户信息相关选择器（仅限该步骤使用）
    }[];

    selectors?: { [userinfoKey in keyof IUserInfo]?: IElementQuery }; // 用户信息相关选择器（全部步骤均可使用）
  };

  /**
   * 站点用户等级定义
   */
  levelRequirements?: ILevelRequirement[];

  /**
   * 在站点配置过程中，部分站点可能需要额外输入一些信息，此处用于定义这些信息
   * 对应的信息应该存入 userConfig 中
   */
  userInputSettingMeta?: ISiteUserInputMeta[];
}

/**
 * 用于站点的用户配置，这部分配置由用户提供，外部应用应仅存储以下内容，不应存储其他内容
 *
 * 注意：
 * 1. 此处默认提供了一些直接要在 schemas 或其他站点模板中使用一些比较统一的配置，开发者可以根据站点模板需要添加其他配置
 * 2. 对应其他和展示有关的配置项，应该在 ISiteRuntimeConfig 中定义
 */
export interface ISiteUserConfig {
  id?: TSiteID; // 站点id
  sortIndex?: number; // 站点排序索引

  /**
   * 用户在 search, queryUserInfo 时实际使用的 baseUrl
   */
  url?: TSiteUrl; // 站点实际使用的地址

  /**
   * 站点是否已经离线，对于已经离线的站点不再设置进行任何交互
   * （最好能存一下其 favicon，供需要的展示）
   */
  isOffline?: boolean;

  /**
   * 是否允许搜索该站点，未指定且存在 $.search 配置项时默认为 true
   */
  allowSearch?: boolean;

  /**
   * 是否允许查询该站点个人信息，未指定时且存在 $.userInfo 配置项时默认为 true
   */
  allowQueryUserInfo?: boolean;

  groups?: string[]; // 分类信息，默认为 ISiteMetadata.tags， 也允许用户自定义添加，相同的会被合并到一类中

  timeout?: number; // 请求超时时间，单位为毫秒，如果不设置默认为 30000ms

  /**
   * 存储用户输入的配置项信息
   */
  inputSetting?: Record<ISiteUserInputMeta["name"], string>;

  /**
   * 如果存在该项，则该项会在站点实例化时使用 toMerged 方法合并到 config 中，此处主要用于用户在特殊情况下覆盖默认配置
   * 比如用户可以通过覆盖站点配置 $.search.searchEntry[*].enabled 项，在默认搜索中启用或禁用某一搜索入口
   */
  merge?: Partial<ISiteMetadata>;

  [key: string]: any;
}
