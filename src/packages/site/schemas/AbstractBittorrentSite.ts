import Sizzle from "sizzle";
import { get, isEmpty, set } from "es-toolkit/compat";
import { chunk, pascalCase, pick, toMerged, union } from "es-toolkit";
import { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

// noinspection ES6PreferShortImport
import { axios, isCloudflareBlocked, retrieve, sleep, store } from "../utils/adapter";
import {
  EResultParseStatus,
  IElementQuery,
  ISearchResult,
  ISiteMetadata,
  ITorrent,
  NeedLoginError,
  CFBlockedError,
  NoTorrentsError,
  IAdvanceKeywordSearchConfig,
  ISearchInput,
  ITorrentTag,
  ISiteUserConfig,
  TSiteUrl,
  ISearchEntryRequestConfig,
  IParsedTorrentListPage,
  TSchemaMetadataListSelectors,
} from "../types";
import {
  definedFilters,
  filterNames,
  TQueryFilter,
  cfDecodeEmail,
  parseSizeString,
  parseTimeWithZone,
  tryToNumber,
  hasNonLatinCharacters,
} from "../utils";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: -1,
  search: {},
};

// 适用于公网BT站点，同时也作为 所有站点方法 的基类
export default class BittorrentSite {
  public readonly metadata: ISiteMetadata; // 实际过程中使用的配置文件
  public readonly userConfig: ISiteUserConfig;

  constructor(metadata: ISiteMetadata, userConfig: ISiteUserConfig = {}) {
    this.metadata = toMerged(metadata, userConfig.merge ?? {});
    this.userConfig = userConfig;
    console?.log(`[Site] ${this.name} Initialized with Metadata: `, this.metadata, "UserConfig: ", this.userConfig);
  }

  get name(): string {
    return this.userConfig.merge?.name ?? this.metadata.name;
  }

  get url(): TSiteUrl {
    return this.userConfig.url ?? this.metadata.urls[0];
  }

  get isOnline(): boolean {
    return !this.metadata.isDead && !this.userConfig.isOffline;
  }

  get allowSearch(): boolean {
    return this.isOnline && !!this.metadata.search && !(this.userConfig.allowSearch === false);
  }

  get downloadInterval(): number {
    return this.userConfig.downloadInterval ?? this.metadata.download?.interval ?? 0;
  }

  /**
   * 登录检查方法，对于公开站点，该方法一定直接返回 True
   * @param raw
   */
  protected loggedCheck(raw: AxiosResponse): boolean {
    return true;
  }

  protected async sleepAction(ms: number | undefined): Promise<void> {
    if (ms && ms > 0) {
      await sleep(ms);
    }
  }

  protected async storeRuntimeSettings<T extends any>(key: string, value: T): Promise<T> {
    this.userConfig.runtimeSettings ??= {}; // 确保 runtimeSettings 存在
    this.userConfig.runtimeSettings[key] = value; // 更新当前实例的 runtimeSettings
    await store(this.metadata.id, key, value); // 持久化
    return value;
  }

  protected async retrieveRuntimeSettings<T>(key: string): Promise<T | null> {
    return (this.userConfig.runtimeSettings?.[key] ?? (await retrieve<T>(this.metadata.id, key))) as T | null;
  }

  public async request<T>(axiosConfig: AxiosRequestConfig, checkLogin: boolean = true): Promise<AxiosResponse<T>> {
    // 统一设置一些 AxiosRequestConfig， 当作默认值
    axiosConfig.baseURL ??= this.url;
    axiosConfig.url ??= "/";
    axiosConfig.timeout ??= this.userConfig.timeout ?? 30e3;

    // 如果站点有请求延迟，则等待一段时间
    await this.sleepAction(this.metadata.requestDelay ?? 0);

    let req: AxiosResponse;
    try {
      req = await axios.request<T>(axiosConfig);

      // 全局性的替换 span.__cf_email__
      if (axiosConfig.responseType === "document") {
        const doc = req.data;

        // 进行简单的检查，防止无意义的替换
        if (doc instanceof Document && doc.documentElement.outerHTML.search("__cf_email__")) {
          const cfProtectSpan = Sizzle(".__cf_email__", doc);

          cfProtectSpan.forEach((element) => {
            element.replaceWith(cfDecodeEmail((element as HTMLElement).dataset.cfemail!));
          });
        }

        req.data = doc;
      }
    } catch (e) {
      // 从 AxiosError 中获取 response
      req = (e as AxiosError).response!;
    }

    if (isCloudflareBlocked(req)) {
      throw new CFBlockedError();
    }

    // 随后检查是否需要登录
    if (checkLogin && !this.loggedCheck(req!)) {
      throw new NeedLoginError();
    }

    // 如果非需要登录的情况，但还是返回了 4xx 或者 5xx ，则抛出错误
    if (req.status >= 400) {
      throw Error(`Network Error: ${req.status} ${req.statusText || ""}`.trim());
    }

    return req;
  }

  /**
   * 种子搜索方法入口
   * @param keywords
   * @param searchEntry
   */
  public async getSearchResult(keywords?: string, searchEntry: ISearchEntryRequestConfig = {}): Promise<ISearchResult> {
    console?.log(`[Site] ${this.name} start search with keywords:`, keywords, "input searchEntry:", searchEntry);
    const result: ISearchResult = {
      data: [],
      status: EResultParseStatus.unknownError,
    };

    // 0. 检查该站点是否允许搜索
    if (!this.allowSearch) {
      result.status = EResultParseStatus.passParse;
      return result;
    }

    // 1. 形成搜索入口，默认情况下需要合并 this.config.search

    // 如果传入了 id，说明需要首先与 metadata.searchEntry 中对应id的搜索配置的合并
    if (searchEntry.id) {
      searchEntry = toMerged(this.metadata.searchEntry?.[searchEntry.id] ?? {}, searchEntry)!;
    }

    // 继续检查 searchEntry， 如果为空，或者没有显示设置 merge 为 false，则进一步在 this.metadata.search 的基础上进行合并
    if (isEmpty(searchEntry) || searchEntry.merge !== false) {
      searchEntry = toMerged(this.metadata.search!, searchEntry)!;
    }

    // 检查该搜索入口是否设置为禁用
    if (searchEntry.enabled === false) {
      result.status = EResultParseStatus.passParse;
      return result;
    }

    console?.log(`[Site] ${this.name} start search with merged searchEntry:`, searchEntry);

    // 2. 检查字符集兼容性并过滤站点
    if (searchEntry.skipNonLatinCharacters && keywords) {
      if (hasNonLatinCharacters(keywords)) {
        console?.log(`[Site] ${this.name} skipped due to non-Latin characters in query:`, keywords);
        result.status = EResultParseStatus.passParse;
        return result;
      }
    }

    // 3. 生成对应站点的基础 requestConfig
    let requestConfig: AxiosRequestConfig = toMerged(
      { url: "/", responseType: "document", params: {}, data: {} }, // 最基础的垫片，baseUrl 会在 request 方法中被补全，此处不用额外声明
      searchEntry.requestConfig || {}, // 使用默认配置覆盖垫片配置，如果是站点是 json 返回，应该在此处覆写 responseType，并准备基础参数
    );

    // 4. 预检查 keywords 是否为高级搜索词，如果是，则查找对应的 searchEntry.advanceKeywordParams[*] 并改写 keywords
    let advanceKeywordType: string | undefined;
    let advanceKeywordConfig: IAdvanceKeywordSearchConfig | false = false;
    if (keywords && searchEntry.advanceKeywordParams) {
      for (const [advanceField, advanceConfig] of Object.entries(searchEntry.advanceKeywordParams)) {
        if (keywords.startsWith(`${advanceField}|`)) {
          // 检查是否跳过
          if (advanceConfig === false || advanceConfig.enabled === false) {
            result.status = EResultParseStatus.passParse;
            return result;
          }

          // 改写 keywords 并缓存 transformer
          keywords = keywords?.replace(`${advanceField}|`, "");
          advanceKeywordType = advanceField;
          advanceKeywordConfig = advanceConfig;
          break;
        }
      }
    }

    // 5. 首先将搜索关键词根据 keywordsParam 放入请求配置中，注意如果是 advanceKeyword 已经被去除了前缀 `${advanceKeywordType}|`
    if (keywords) {
      set(requestConfig, searchEntry.keywordPath || "params.keywords", keywords || "");
    }

    // 6. 如果是高级搜索词搜索，则在对应基础上改写 AxiosRequestConfig
    if (advanceKeywordConfig) {
      if (advanceKeywordConfig.requestConfig) {
        requestConfig = toMerged(requestConfig, advanceKeywordConfig.requestConfig || {});
      }

      if (typeof advanceKeywordConfig.requestConfigTransformer === "function") {
        requestConfig = advanceKeywordConfig.requestConfigTransformer({ keywords, searchEntry, requestConfig });
      }
    }

    // 7. 如果有 requestConfigTransformer，则会在最后一步对请求配置进行处理
    if (typeof searchEntry.requestConfigTransformer === "function") {
      requestConfig = searchEntry.requestConfigTransformer({ keywords, searchEntry, requestConfig });
    }

    // 如果站点有搜索请求延迟，则等待一段时间
    if ((searchEntry.requestDelay ?? 0) > 0) {
      await sleep(searchEntry.requestDelay!);
    }

    console?.log(`[Site] ${this.name} start search with requestConfig:`, requestConfig);

    // 8. 请求页面并转化为document
    try {
      const req = await this.request(requestConfig);
      result.data = await this.transformSearchPage(req.data, { keywords, searchEntry, requestConfig });
      result.status = EResultParseStatus.success;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e);
      }
      result.status = EResultParseStatus.parseError;

      if (e instanceof CFBlockedError) {
        result.status = EResultParseStatus.CFBlocked;
      } else if (e instanceof NeedLoginError) {
        result.status = EResultParseStatus.needLogin;
      } else if (e instanceof NoTorrentsError) {
        result.status = EResultParseStatus.noResults;
      }
    }
    return result;
  }

  /**
   * @warning 此方法不可以在 getFieldData 的 filters 中使用，
   *          对于约定的 url, link 本方法会自动调用进行补全
   * @param uri
   * @param requestConfig
   */
  protected fixLink(uri: string, requestConfig: AxiosRequestConfig): string {
    let url = uri;

    if (uri.length > 0 && !uri.startsWith("magnet:")) {
      if (uri.startsWith("//")) {
        // 当 传入的uri 以 /{2,} 开头时，被转换成类似 https?:///xxxx/xxxx 的形式，
        // 虽不符合url规范，但是浏览器容错高，所以不用担心 2333
        const urlHelper = new URL(requestConfig.baseURL || this.url);
        url = `${urlHelper.protocol}:${uri}`;
      } else if (uri.slice(0, 4) !== "http") {
        // 基于请求地址，处理 ./xxx, xxxx, /xxxx 等相对路径
        const requestUrl = axios.getUri(requestConfig);
        url = new URL(uri, requestUrl).toString();
      }
    }

    return url;
  }

  /**
   * getFieldData 的上层方法，目的是直接获取一批数据，并以字典形式返回
   * @param element
   * @param fields
   * @param selectors
   * @protected
   */
  protected getFieldsData<
    G extends "search" | "detail" | "userInfo",
    S extends Required<Required<ISiteMetadata>[G]>["selectors"],
  >(element: Element | object, selectors: S, fields?: (keyof S)[]): { [key in keyof S]?: any } {
    const ret: { [key in keyof S]?: any } = {};

    if (!fields) {
      fields = Object.keys(selectors as Record<string, any>) as (keyof S)[];
    }

    // @ts-ignore
    for (const [key, selector] of Object.entries(pick(selectors, fields))) {
      // @ts-ignore
      ret[key] = this.getFieldData(element, selector as IElementQuery);
    }

    return ret;
  }

  protected getFieldData(element: Element | object, elementQuery: IElementQuery): any {
    let query: any = String(elementQuery.text ?? "");

    if (elementQuery.selector) {
      let usedSelector: string | undefined;
      const selectors = ([] as string[]).concat(elementQuery.selector);
      for (usedSelector of selectors) {
        if (element instanceof Node) {
          // 这里我们预定义一个特殊的 Css Selector，即不进行子元素选择
          const another = (
            usedSelector === ":self" ? element : Sizzle(usedSelector, element as Element | Document)[0]
          ) as HTMLElement;
          if (another) {
            if (elementQuery.elementProcess) {
              query = this.runQueryFilters<string>(another, elementQuery.elementProcess);
            } else if (elementQuery.case) {
              for (const [match, value] of Object.entries(elementQuery.case)) {
                if (Sizzle.matchesSelector(another, match)) {
                  query = value ?? query;
                  break;
                }
              }
            } else if (elementQuery.data) {
              query = another.dataset[elementQuery.data] ?? query;
            } else if (elementQuery.attr) {
              query = another.getAttribute(elementQuery.attr) ?? query;
            } else {
              // 优先使用 innerText，如果没有，则使用 textContent
              query = (another.innerText ?? another.textContent).replace(/\n/gi, " ") || query;
            }
          }
        } else {
          query = usedSelector === ":self" ? element : get(element, usedSelector)!;
        }

        // noinspection SuspiciousTypeOfGuard
        if (typeof query === "undefined") {
          query = "";
        }

        // noinspection SuspiciousTypeOfGuard
        if (typeof query === "string") {
          query = query.trim();
        }
        if (query !== "") {
          break;
        }

        usedSelector = undefined; // 在每次循环结束后，重置 usedSelector
      }

      if (selectors.length > 0 && elementQuery.switchFilters?.[usedSelector!]) {
        query = this.runQueryFilters(query, elementQuery.switchFilters[usedSelector!]);
      } else if (elementQuery.filters && elementQuery.filters?.length > 0) {
        query = this.runQueryFilters(query, elementQuery.filters);
      }
    }

    // noinspection SuspiciousTypeOfGuard
    if (typeof query === "string") {
      query = query.trim(); // 去除空格
      if (/^-?\d+$/.test(query)) {
        // 尽可能的将返回值转成数字类型
        query = isNaN(parseInt(query)) ? 0 : parseInt(query);
      }
    }

    return query;
  }

  protected runQueryFilters<T>(query: any, filters: TQueryFilter[] | TQueryFilter): T {
    const realFilters = ([] as TQueryFilter[]).concat(filters);
    for (const realFilter of realFilters) {
      if (typeof realFilter === "function") {
        query = realFilter(query);
      } else if (realFilter?.name) {
        const { name, args = [] } = realFilter;
        if (filterNames.includes(name)) {
          query = definedFilters[name](query, args);
        }
      }
    }

    return query;
  }

  /**
   * 如何解析 JSON 或者 Document，获得种子详情列表
   */
  public async transformSearchPage(doc: Document | object | any, searchConfig: ISearchInput): Promise<ITorrent[]> {
    const { searchEntry, requestConfig } = searchConfig;
    if (!searchEntry!.selectors?.rows) {
      throw Error("列表选择器未定义");
    }

    const rowsSelector = searchEntry!.selectors.rows;
    const torrents: ITorrent[] = [];

    let trs: any;

    if (doc instanceof Document) {
      trs = Sizzle(rowsSelector.selector as string, doc);
      if (rowsSelector.filter) {
        trs = rowsSelector.filter(trs);
      } else {
        /**
         * 应对某些站点连用多个tr表示一个种子的情况，将多个tr使用 <div> 包裹成一个 Element，
         * 这种情况下，子选择器就可以写成 `tr:nth-child(1) xxxx` 来精确
         */
        const rowMergeDeep: number = rowsSelector.merge || 1;
        if (trs.length > 0 && rowMergeDeep > 1) {
          const newTrs: Element[] = [];

          chunk(trs, rowMergeDeep).forEach((chunkTr) => {
            const wrapperDiv = doc.createElement("div");
            chunkTr.forEach((tr) => {
              wrapperDiv.appendChild(tr as Element);
            });
            newTrs.push(wrapperDiv);
          });

          trs = newTrs;
        }
      }
    } else {
      // 同样定义一个 :self 以防止对于JSON返回的情况下，所有items在顶层字典（实际是 Object[] ）下
      trs = rowsSelector.selector === ":self" ? doc : get(doc, rowsSelector.selector as string);

      if (rowsSelector.filter) {
        trs = rowsSelector.filter(trs);
      }
    }

    // 如果没有搜索到种子，则抛出 NoTorrentsError
    if (trs.length === 0) {
      throw new NoTorrentsError();
    }

    for (const tr of trs) {
      try {
        torrents.push((await this.parseWholeTorrentFromRow({}, tr, searchConfig!)) as ITorrent);
      } catch (e) {
        console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, e, tr);
      }
    }

    return torrents;
  }

  protected async parseWholeTorrentFromRow(
    torrent: Partial<ITorrent> = {},
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Promise<Partial<ITorrent>> {
    const { searchEntry, requestConfig } = searchConfig;

    // FIXME 对于每个 searchEntry，其需要获取的 torrentKey 应该都是一样的，但是目前会导致在每个loop中都重复生成相同的 key，不过没太大关系
    const definedTorrentSelectorKey = Object.keys(searchEntry!.selectors!).filter((key) => key !== "rows");
    const defaultTorrentSelectorKey = [
      "id",
      "title",
      "subTitle",
      "url",
      "link",
      "time",
      "size",
      "author",
      "seeders",
      "leechers",
      "completed",
      "comments",
      "category",
      "tags",
      "progress",
      "status",
    ];

    /**
     * 对种子文件的任意非rows属性进行处理，例如 "id" 属性：
     * - 如果对应的实例中有 parseTorrentRowForId 方法，则调用该方法，注意该方法会需要返回更新后的 torrent 对象
     * - 不然则使用 selectors.id 的定义来获取，此时只更新 torrent 的id属性
     */
    for (const key of union(definedTorrentSelectorKey, defaultTorrentSelectorKey) as (keyof Omit<ITorrent, "site">)[]) {
      // 如果已经有值，则跳过
      if (Object.hasOwn(torrent, key)) {
        continue;
      }

      const dynamicParseFuncKey = `parseTorrentRowFor${pascalCase(key as string)}` as keyof this;
      if (dynamicParseFuncKey in this && typeof this[dynamicParseFuncKey] === "function") {
        torrent = await this[dynamicParseFuncKey](torrent, row, searchConfig);
      } else if (searchEntry!.selectors![key]) {
        torrent[key] = this.getFieldData(row, searchEntry!.selectors![key] as IElementQuery);
      }
    }

    // 对获取到的种子进行一些通用的处理
    torrent.site ??= this.metadata.id; // 补全种子的 site 属性
    torrent.id ??= tryToNumber(torrent.url || torrent.link); // 补全种子的 id 属性，如果不存在，则由 url, link 属性替代
    typeof torrent.url != "undefined" && (torrent.url = this.fixLink(torrent.url as string, requestConfig!));
    typeof torrent.link != "undefined" && (torrent.link = this.fixLink(torrent.link as string, requestConfig!));
    if (typeof (torrent.size as unknown) === "string") {
      torrent.size = parseSizeString(torrent.size as unknown as string);
    }
    typeof torrent.size != "undefined" && (torrent.size = tryToNumber(torrent.size));
    typeof torrent.seeders != "undefined" && (torrent.seeders = tryToNumber(torrent.seeders));
    typeof torrent.leechers != "undefined" && (torrent.leechers = tryToNumber(torrent.leechers));
    typeof torrent.completed != "undefined" && (torrent.completed = tryToNumber(torrent.completed));
    typeof torrent.comments != "undefined" && (torrent.comments = tryToNumber(torrent.comments));
    typeof torrent.category != "undefined" && (torrent.category = tryToNumber(torrent.category));
    typeof torrent.status != "undefined" && (torrent.status = tryToNumber(torrent.status));

    // 仅当设置了时区偏移时，才进行转换
    if (this.metadata.timezoneOffset && typeof torrent.time !== "undefined") {
      torrent.time = parseTimeWithZone(torrent.time as unknown as string, this.metadata.timezoneOffset);
    }

    // 在此基础上，不同 schema 可以复写处理过程
    torrent = this.fixParsedTorrent(torrent as ITorrent, row, searchConfig);
    return torrent;
  }

  protected parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    if (searchConfig?.searchEntry?.selectors?.tags) {
      const tags: ITorrentTag[] = [];
      searchConfig.searchEntry.selectors.tags.forEach(({ name, color, selector }) => {
        if (row instanceof Element) {
          if (Sizzle(selector, row).length > 0) {
            tags.push({ name, color });
          }
        } else {
          if (get(row, selector)) {
            tags.push({ name, color });
          }
        }
      });
      torrent.tags = tags;
    }

    return torrent;
  }

  protected fixParsedTorrent(
    torrent: ITorrent,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): ITorrent {
    return torrent;
  }

  /**
   * 此方法主要在 content-script 中调用，用于在种子列表页将传入的 Document 转换为种子列表和关键词
   * @param doc
   */
  public async transformListPage(doc: Document): Promise<IParsedTorrentListPage> {
    const retData = { keywords: "", torrents: [] } as IParsedTorrentListPage;

    const parsedListPageUrl = doc.URL || location.href; // 获取当前页面的 URL

    const searchEntry: { selectors: TSchemaMetadataListSelectors } = { selectors: {}, ...(this.metadata.search ?? {}) };

    // 使用 list 中定义的 selectors 覆盖掉 search 中的 selectors
    for (const list of this.metadata.list ?? []) {
      const { urlPattern: listUrlPattern = [], selectors: listSelectors = {}, mergeSearchSelectors = true } = list;
      if (listUrlPattern.some((pattern) => new RegExp(pattern!, "i").test(parsedListPageUrl))) {
        searchEntry.selectors = { ...(mergeSearchSelectors ? searchEntry.selectors : {}), ...listSelectors };
        break; // 找到匹配的 list 后，直接跳出循环
      }
    }

    // 如果有 keywords 选择器，则获取当前搜索页的关键词
    if (searchEntry.selectors.keywords) {
      retData.keywords = this.getFieldData(doc, searchEntry.selectors.keywords as IElementQuery);
      delete searchEntry.selectors.keywords; // 删除 keywords 选择器，避免污染后续的种子解析
    } else {
      // 参照 searchEntry 中的 keywordPath 来获取关键词
      const keywordPath = (searchEntry as ISiteMetadata["search"])!.keywordPath || "params.keywords";
      const [keywordField, keywordParams] = keywordPath.split(".");

      // 首先尝试使用 getFieldData 获取关键词
      retData.keywords = this.getFieldData(doc, {
        selector: [
          keywordField === "params" ? `input[name="${keywordParams}"]` : false,
          keywordField === "data" ? `form[method="post" i] input[name="${keywordField}"]` : false,
        ].filter(Boolean) as string[],
        elementProcess: (el: HTMLInputElement) => el.value,
        text: "",
      });

      // 如果没有获取到关键词，则尝试从 URL 中解析
      if (retData.keywords === "") {
        const urlParams = new URLSearchParams(parsedListPageUrl.split("?")[1] ?? "");
        for (const keywordParam of [keywordParams, "search", "keywords", "keyword", "q"].filter(Boolean)) {
          // 尝试从 URL 中获取关键词
          if (urlParams.has(keywordParam)) {
            retData.keywords = urlParams.get(keywordParam) || "";
            break;
          }
        }
      }
    }

    try {
      // 将其委托到 transformSearchPage 方法中进行处理
      retData.torrents = await this.transformSearchPage(doc, {
        searchEntry,
        requestConfig: { url: parsedListPageUrl },
      });
    } catch (e) {
      console.error(`[PTD] site '${this.name}' transformListPage Error:`, e);
    }

    return retData;
  }

  /**
   * 此方法主要在 content-script 中调用，用于将传入的 Document 转换为种子列表
   * @param doc
   */
  public async transformDetailPage(doc: Document): Promise<ITorrent> {
    let torrent: Partial<ITorrent> = { site: this.metadata.id };
    const parsedDetailsPage = doc.cloneNode(true) as Document; // 克隆一份文档，避免污染原始文档

    // 首先使用selectors来尝试获取种子详情
    const detailsSelectors = this.metadata.detail?.selectors || {};
    torrent = toMerged(torrent, this.getFieldsData(parsedDetailsPage, detailsSelectors));

    // 如果未获取到 url，则 url 会被自动设置为 doc.URL || location.href
    if (!torrent.url) {
      torrent.url = parsedDetailsPage.URL || location.href; // 如果没有 url，则使用当前页面的 URL
    }

    // 如果未获取到 id，且 url 中有 `&id=` 或者 `&tid=` 字段，则会被自动解析为 id
    if (!torrent.id) {
      const urlParams = new URLSearchParams(torrent.url.split("?")[1] ?? "");
      for (const idParam of ["tid", "id"]) {
        // 尝试从 URL 中获取关键词
        if (urlParams.has(idParam)) {
          torrent.id = urlParams.get(idParam) || "";
          break;
        }
      }

      // 如果还是没有 id，则使用 url 作为 id
      if (!torrent.id) {
        torrent.id = torrent.url;
      }
    }

    if (!torrent.title) {
      torrent.title = this.getFieldData(parsedDetailsPage, { text: "", selector: ["html > body > title"] });
    }

    if (torrent.link) {
      torrent.link = this.fixLink(torrent.link, { baseURL: parsedDetailsPage.URL }); // 如果 link 存在，则进行修正
    }

    return torrent as ITorrent;
  }

  /**
   * 使用该方法返回种子文件的下载链接
   * 可以在某些特殊站点通过覆写本方法，来更新搜索结果中的种子链接：
   *  - 如果在搜索页面没有提供下载链接，可以在这里进行补全
   *  - 如果搜索页面提供的下载链接有特定的生存期限，可以在这里进行更新
   * @param torrent
   */
  public async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (!torrent.link && this.metadata?.detail?.selectors?.link) {
      const { data } = await this.request<any>(
        toMerged({ responseType: "document", url: torrent.url }, this.metadata.detail?.requestConfig ?? {}),
      );
      torrent.link = this.getFieldData(data, this.metadata.detail.selectors.link) as string;
    }

    if (this.userConfig.downloadLinkAppendix) {
      // 如果用户配置了下载链接后缀，则在链接后追加
      torrent.link = `${torrent.link}${this.userConfig.downloadLinkAppendix}`;
    }

    return torrent.link!;
  }

  /**
   * 使用该方法返回种子文件的下载配置
   * @param torrent
   */
  public async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig> {
    const torrentDownloadLink = await this.getTorrentDownloadLink(torrent);
    return toMerged(
      { baseURL: this.url, url: torrentDownloadLink, method: "GET", timeout: this.userConfig.timeout ?? 30e3 },
      this.metadata.download?.requestConfig ?? {},
    );
  }
}
