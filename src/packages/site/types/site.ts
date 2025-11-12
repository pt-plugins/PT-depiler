// noinspection ES6PreferShortImport

import type { AxiosRequestConfig } from "axios";
import { TSiteID, TSiteHost, TSiteUrl, TSiteFullUrl, TUrlPatterns } from "./base";
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
  | "AvistazNetwork"
  | string;

type TUserInfoParseKey = keyof Omit<IUserInfo, "site" | "status" | "updateAt">;

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
  /**
   * 站点的id，全局唯一，必须和站点文件名（无扩展）相同
   * 应该是一个符合正则表达式 /[0-9a-z]+/ 的字符串（无大写字母、无特殊字符）
   *
   * 额外的，如果 https://github.com/Jackett/Jackett/tree/master/src/Jackett.Common/Definitions 中有相同站点配置，
   * 建议与其相同命名
   */
  readonly id: TSiteID;

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
  description?: string | string[]; // 站点说明
  tags?: string[]; // 站点标签
  timezoneOffset?: timezoneOffset;

  readonly collaborator?: string[]; // 提供该站点解决方案的协作者

  /**
   * type 和 schema 共同描述了站点实例 的构建方法
   *
   * type 用于指示这个站点的类型
   * schema 用于指定继承模板类型，如果未填写的话，且站点配置文件抛出了 default class 的话，会忽略掉此处的 schema 参数
   * 否则会根据其 type类型 进行自动更正为缺省值：
   *  - public 类型下， schema 的缺省值为 AbstractBittorrentSite
   *  - private 类型下， schema 的缺省值为 AbstractPrivateSite
   *
   */
  readonly type: "private" | "public"; // 站点类型
  schema?: SiteSchema;

  /**
   * 完整的网站地址，
   *
   * 1. 列表中第一个网址会作为默认的使用地址
   * 2. 如果网站支持 `https` ，请优先考虑填写 `https` 的地址
   * 3. 部分站点可能对于站点链接存在更为隐秘的要求，则请对链接进行 rot13 ，以防止在配置时泄露
   *    （但这并不能阻止用户通过安装插件后在使用过程中知道对应网址
   */
  urls: TSiteUrl[];

  /**
   * host 和 formerHosts 不支持填写 加密后的网站域名，不会自动进行 rot13 解码，如果需要请填写类似
   *  host: rot13('xxxxx')
   */
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
   *  - 本地 public/icons/site 目录下的文件，例如 ./{name}.png 或 ./{name}.ico 或 ./{name}.svg
   *    （从 `./` 开始写，如果 /public/icons/site 下有对应 {id}.{png, ico, svg} 文件则不需要显式定义，其他后缀的图片格式需要明确
   *  - `data:image/` 开头的Base64字符串 （不会有人这么做吧，一定过不了 Code Review 的）
   */
  favicon?: `${TSiteFullUrl}${string}` | `data:image/${string}` | `./${string}.${"png" | "ico" | "svg" | string}`;

  category?: ISearchCategories[];

  /**
   * 站点请求延迟（该站点全局性质），单位为毫秒，默认为0
   * 注意：此处的 requestDelay 应用于 AbstractBittorrentSite.request 方法中，
   *      如果有设置 siteMetadata.{search, searchEntry[*], userInfo.process[*]}.requestDelay 则会叠加
   */
  requestDelay?: number;

  /**
   * 站点搜索方法配置（主要用于插件 options 的适配）
   *
   * 由 AbstractBittorrentSite.transformSearchPage 方法进行转换，如果子类有覆写请按子类覆写逻辑理解
   */
  search?: ISearchConfig;

  /**
   * 当用户使用默认搜索入口时启动的搜索方法，一般不需要定义（即不定义时自动使用 search.requestConfig），除非有以下情况才建议使用：
   * 1. 站点有多个搜索入口，且不同搜索入口结果不同时
   * 2. 有单次搜索多页的需求（我们不推荐这种做法，因为会导致搜索结果的不稳定性和站点的过重负担）
   */
  searchEntry?: Record<string, ISearchEntryRequestConfig>;

  /**
   * 种子列表页配置（主要用于插件 content-script 的适配）
   *
   * 由 AbstractBittorrentSite.transformListPage 方法进行转换，如果子类有覆写请按子类覆写逻辑理解
   *
   * 注：只有极其特殊的情况下才需要定义此处的 selectors ，未定义时，会使用Search中定义的信息
   * 一般如下：
   *  - 使用 AJAX 方法异步加载页面种子
   */
  list?: Array<{
    /**
     * 在 web 访问时，哪些些页面会被认为是种子列表页，被认为是种子列表页的页面会被插件自动添加种子列表批量下载、链接复制、远程推送的功能
     *
     * 如果定义了 urlPattern 插件会严格按照 urlPattern 进行匹配，
     * 不然，插件会自动根据 search.requestConfig.url 以及 searchEntry[*].requestConfig.url 中的 url 自动生成，
     * 字段为 uniq([search.requestConfig.url, ...searchEntry[*].requestConfig.url])
     *
     * 如果 pattern 为 string，会使用 new RegExp(pattern, 'i') 生成 RegExp 对象，
     *
     * 如果 pattern 为 RegExp 对象，则直接使用该对象
     *
     * 匹配对象为 location.href ，依次匹配，任一匹配成功，则会被认为是种子列表页，
     */
    urlPattern?: TUrlPatterns;

    /**
     * 由于侧边栏组件先判断是否是 list ，导致某些应该是详情页的页面被误认为是列表页，
     * 该配置用于排除一些不应该被认为是种子列表页的页面
     *
     * 匹配方式和 urlPattern 相同
     */
    excludeUrlPattern?: TUrlPatterns;

    mergeSearchSelectors?: boolean; // 是否合并 search.selectors 中的配置到此处的 selectors 中，默认为 true

    /**
     * 对于种子列表页的解析配置，默认会使用 search.requestConfig.selectors 中的配置作为垫片
     * 需要至少解析出 id, title, url, link
     * 如果 link 不能解析出来，会调用 AbstractBittorrentSite.getTorrentDownloadLink 方法来获取下载链接
     * 如果解析出 subTitle, seeders, leechers, completed, time, size ，会在高级列表中显示
     *
     * 额外增加字段说明：
     * keywords: 用于获取种子列表页中正在使用的搜索关键词，如果获取到非空字符串，则在点击 "在插件中搜索的标识" 时自动填充该关键词
     *   如果未设置，AbstractBittorrentSite.transformListPage 会自动根据 search.keywordPath 或 searchEntry[*].keywordPath 来推断，
     *   比如：
     *     - search.keywordPath 为 params.xxxx 时，keywords 会被自动推断为 { selector: 'input[name="xxxx"]' }
     *     - search.keywordPath 为 data.xxxx 时，keywords 会被自动推断为 { selector: 'form[method="post" i] input[name="xxxx"]' }
     *     - 如果仍未找到，则会尝试从url中解析 &xxxx= 以及 &search= , &keywords= , &keyword=, $q= 字段内容
     */
    selectors?: ISearchConfig["selectors"] & { keywords?: IElementQuery };
  }>;

  /**
   * 种子详情页配置（主要用于插件 content-script 、 部分无法在搜索中构造种子 link 站点的适配）
   *
   * 由 AbstractBittorrentSite.{transformDetailPage, getTorrentDownloadLink} 方法进行转换，如果子类有覆写请按子类覆写逻辑理解
   */
  detail?: {
    /**
     * 在 web 访问时，哪些些页面会被认为是种子详情页，被认为是种子列表页的页面会被插件自动添加种子下载、链接复制、远程推送的功能
     *
     * urlPattern 无法进行自动生成，需要显式声明（一般情况下 schema 中已有相关声明）
     * 其他表现和 list.urlPattern 相同。
     */
    urlPattern?: TUrlPatterns;

    /**
     * 插件获取种子详情页时的配置，默认是在种子搜索时无法获取 link 的特殊站点使用，在使用时有垫片如下：
     *   { responseType: "document", url: torrent.url }
     */
    requestConfig?: AxiosRequestConfig;

    /**
     * 对于种子详情页的解析配置
     *
     * 对页面解析需要至少解析出 id, title, url, link
     * 注意 我们使用 typeof link != 'undefined' 来确定是否获取到正确的信息
     *
     * 注意：
     * 1. 为了尽可能减少配置，AbstractBittorrentSite.transformDetailPage 中预设了以下规则
     *      - 如果未定义 url 的 selector，则 url 会被自动设置为 doc.URL || location.href
     *      - 如果未定义 id 的 selector，且 url 中有 `&id=` 或者 `&tid=` 字段，则会被自动解析为 id
     *                                 如果 url 中没有 `&id=` 或者 `&tid=` 字段，则 id 会被自动设置为 url
     *      - 如果未定义 title 的 selector，则 html > body > title 会被自动设置为 title
     *    其他模板的详见 metadata 或 override function 情况
     *
     * 2. AbstractBittorrentSite.getTorrentDownloadLink 中会使用 link 的 selector 来获取下载链接
     */
    selectors?: {
      link?: IElementQuery; // 用于获取下载链接不在搜索页，而在详情页的情况
      [key: string]: IElementQuery | undefined;
    } & Omit<ISearchConfig["selectors"], "rows">; // 种子相关选择器
  };

  download?: {
    /**
     * 对一些特殊的站点（比如需要post方法），你可以为种子下载定义额外的 requestConfig
     * 会通过 toMerged({ url: torrent.link, method: 'get' }, download.requestConfig ?? {}) 进行合并，
     * 如果该站点的下载过于复杂（比如需要传递额外生成的 header），更建议覆写 getTorrentDownloadRequestConfig(torrent) 方法
     */
    requestConfig?: AxiosRequestConfig;

    /**
     * 在批量下载每个种子时，与（本站）上一个种子之间的间隔时间，单位为秒
     * 在生成站点 ISiteUserConfig 时，这一配置会被提升到 ISiteUserConfig.downloadInterval 中，
     * 如果站点没有定义该项，则默认设置为 0
     */
    interval?: number;
  };

  /**
   * 认为用户未登录的断言设置
   *
   * 该配置项仅对 基于 PrivateSite 模板，且未改写 AbstractPrivateSite.loggedCheck 的站点生效
   * 注意：
   * 1. 每一项都可以单独设置为 false 来禁用该项检查，但不支持整体禁用，如果需要整体禁用，建议设置为 type: public 或 直接改写 loggedCheck 方法
   */
  noLoginAssert?: {
    /**
     * HTTP 状态码，表示未登录的状态码，未设置时默认 [401, 403, 502, 504]
     * 如果站点响应的状态码在该数组中，则认为未登录
     */
    httpStatusCodes?: number[] | false;

    /**
     * 返回的 responseURL 中，哪些 URL 模式表示未登录，未设置时默认为 [/doLogin|login|verify|checkpoint|returnto/gi]
     * 如果请求的 URL 匹配该数组中的任意一个，则认为未登录
     */
    urlPatterns?: TUrlPatterns | false;

    /**
     * 如果响应头中有 refresh: <time>[;,] url=<url> 字段，
     * 且其中的 <url> 字段匹配该正则表达式，则认为未登录，未设置时默认为 noLoginAssert.urlPatterns 对应的内容
     * 如果此时 noLoginAssert.urlPatterns 为 false，则该项也会被设置为 false
     */
    refreshHeaderPattern?: TUrlPatterns | false;

    /**
     * 判断下面 matchSelectors 是否存在，如果存在则判断为未登录
     * 对 Document 的返回 使用 Sizzle().length > 0 进行判断，对其他情况如 json 返回使用 es-toolkit/compact 的 has 方法进行判断
     */
    matchSelectors?: string[];

    /**
     * 是否严格检查响应内容，未设置时默认为 false
     * 开启后会检查 responseText ，如果有下面情况，则判断为未登录：
     * ①为空 ； ②过短（ < 800 ），且包含 login, auth_form, not authorized 等字段
     */
    checkResponseContent?: boolean;
  };

  /**
   * 该配置项仅对 基于 PrivateSite 模板，且未改写 AbstractPrivateSite.getUserInfoResult 的站点生效
   */
  userInfo?: {
    /**
     * 如果可以，则从插件历史缓存的数据中获取那些数据（一般是比较恒定的数据，如 id, name, joinTime ）
     * 并可以帮助我们减少网络请求的字段
     */
    pickLast?: TUserInfoParseKey[];

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
        [key in TUserInfoParseKey]?: string;
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

      /**
       * 是否在 process 该步骤发送请求前延迟一段时间，单位为毫秒
       */
      requestDelay?: number;

      /**
       * fields 和 selectors 共同控制着该步骤能够获取到的字段（如果该字段已经存在于前一步步骤或 pickLast 生成的 userInfo 中，则不会再次请求）
       * 实际，本步骤能获取的 fields 为 [...fields, ...Object.keys(selectors)]
       *
       * 建议： 1. 对 schema 使用 fields 来定义，这样在 definitions 可以直接通过覆写 userInfo.selectors 快速调整
       *       2. 对 definition 这种 process 全部控制的站点，使用 selectors 来定义，这样可以不用重复定义 fields
       */
      fields?: TUserInfoParseKey[];
      selectors?: { [userinfoKey in TUserInfoParseKey]?: IElementQuery }; // 用户信息相关选择器（仅限该步骤使用）
    }[];

    /**
     * 此处的 requestDelay 仅用于 process 中未定义时的回落，或部分 schemas 额外步骤中使用
     */
    requestDelay?: number;

    selectors?: { [userinfoKey in TUserInfoParseKey]?: IElementQuery }; // 用户信息相关选择器（全部步骤均可使用）
  };

  /**
   * 站点用户等级定义
   * 对设置了 isDead: true 的站点请注释或删除该项
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

  // 分类信息，默认为 ISiteMetadata.tags，也允许用户自定义添加，相同的会被合并到一类中
  groups?: string[];

  // 请求超时时间，单位为毫秒，如果不设置默认为 30000ms
  timeout?: number;

  // 在批量下载每个种子时，与（本站）上一个种子之间的间隔时间，单位为秒，如果不设置默认为 0
  downloadInterval?: number;

  // 上传速度限制，单位为 MB/s，0 或不填时不限速，用于推送种子文件到下载器的时候，传递上传速度限制
  uploadSpeedLimit?: number;

  // 是否允许 content-script 访问该站点，默认为 true
  allowContentScript?: boolean;

  // 种子下载链接后缀，默认为空字符串，如果站点需要在下载链接后添加一些参数，可以在此处设置
  downloadLinkAppendix?: string;

  /**
   * 存储用户输入的配置项信息
   */
  inputSetting?: Record<ISiteUserInputMeta["name"], string>;

  /**
   * 站点实例在运行过程中生成的配置项
   * 该部分内容设置时需要使用 this.storeRuntimeSettings(key, value) 方法进行设置，
   * value 可以是任意可以 Json 化的字段
   */
  runtimeSettings?: Record<string, any>;

  /**
   * 如果存在该项，则该项会在站点实例化时使用 toMerged 方法合并到 config 中，此处主要用于用户在特殊情况下覆盖默认配置
   * 比如用户可以通过覆盖站点配置 $.search.searchEntry[*].enabled 项，在默认搜索中启用或禁用某一搜索入口
   */
  merge?: Partial<ISiteMetadata>;

  [key: string]: any;
}

export interface IParsedTorrentListPage {
  keywords: string;
  torrents: ITorrent[];
}

export type TSchemaMetadataListSelectors = Required<Required<Required<ISiteMetadata>["list"]>[number]>["selectors"];
