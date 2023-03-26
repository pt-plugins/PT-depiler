import {
  ESearchResultParseStatus,
  ETorrentBaseTagColor,
  IElementQuery,
  ISearchFilter,
  ISearchRequestConfig,
  ISearchResult,
  ISiteMetadata,
  ITorrent,
  ITorrentTag,
  transPostDataTo,
  NeedLoginError,
  NoTorrentsError,
} from "../types";
import type { TQueryFilter } from "../utils";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Sizzle from "sizzle";
import urlJoin from "url-join";
import { chunk, get, merge, pick } from "lodash-es";
import {
  runFilter,
  cfDecodeEmail,
  parseSizeString,
  parseTimeWithZone,
} from "../utils";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  search: {},
};

// 适用于公网BT站点，同时也作为 所有站点方法 的基类
export default class BittorrentSite {
  protected readonly config: ISiteMetadata; // 实际过程中使用的配置文件

  constructor (config: ISiteMetadata) {
    this.config = config;
  }

  get activateUrl (): string {
    return this.config.activateUrl || this.config.url;
  }

  get isOnline (): boolean {
    return !(this.config.isOffline ?? false);
  }

  protected transferPostData<T extends Record<string, any>> (
    params: T,
    transTo: transPostDataTo
  ) {
    let postData: T | FormData | URLSearchParams = params;

    if (transTo !== "raw") {
      if (transTo === "form") {
        postData = new FormData();
      } else if (transTo === "params") {
        postData = new URLSearchParams();
      }

      Object.keys(params).forEach((k) => {
        postData.append(k, params[k]);
      });
    }
    return postData;
  }

  /**
   * 根据搜索筛选条件，生成 AxiosRequestConfig
   * @param filter
   */
  protected async transformSearchFilter (
    filter: ISearchFilter
  ): Promise<AxiosRequestConfig> {
    const config: AxiosRequestConfig = {
      params: {},
      data: {}
    };

    const params: any = {};
    if (filter.keywords) {
      params[this.config.search?.keywordsParam || "keywords"] =
        filter.keywords || "";
    }

    if (filter.extraParams) {
      for (let i = 0; i < filter.extraParams?.length; i++) {
        let {
          key,
          value
        } = filter.extraParams[i];

        if (key === "#changePath") {
          config.url = value as string;
        } else {
          //  其他参数视为params
          if (Array.isArray(value)) {
            /**
             * 如果传入的 value 是 Array，我们认为这是 cross 模式，并作相应处理
             * 但是如果此时未在对应 category 中做相应定义声明的话，将直接把对应信息交给 axios，而不做额外处理
             */
            const paramsForKey = this.config.search?.categories?.find(
              (d) => d.key === key
            ); // 检索 key 的定义情况
            if (paramsForKey?.cross) {
              key = paramsForKey.cross.key || key; // 覆盖 key
              const crossMode = paramsForKey?.cross.mode || "brackets";
              if (crossMode === "comma") {
                value = value.join(",");
              } else if (crossMode !== "brackets") {
                value.forEach((v: string | number) => {
                  if (crossMode === "append") {
                    params[`${key}${v}`] = 1;
                  } else if (crossMode === "appendQuote") {
                    params[`${key}[${v}]`] = 1;
                  }
                });
                continue; // 跳过，不再将原始字段值插入params
              }
            }
          }

          params[key] = value;
        }
      }
    }

    if (this.config.search?.requestConfig?.method?.toLowerCase() === "post") {
      // POST
      config.data = this.transferPostData(
        params,
        this.config.search?.requestConfig.transferPostData || "raw"
      );
    } else {
      // GET
      config.params = params;
    }

    return config;
  }

  get allowSearch (): boolean {
    return this.isOnline && !(this.config.allowSearch === false);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * 种子搜索方法
   * @param filter
   */
  public async searchTorrents (
    filter: ISearchFilter = {}
  ): Promise<ISearchResult> {
    const result: ISearchResult = {
      data: [],
      status: ESearchResultParseStatus.success,
    };

    // 检查该站点是否支持搜索
    if (!this.allowSearch) {
      result.status = ESearchResultParseStatus.passSearch;
      return result;
    }

    // 检查高级搜索词
    let advanceKeywordTransformer: any = false;
    if (filter.keywords && this.config.search?.advanceKeyword) {
      for (const [advanceField, advanceConfig] of Object.entries(this.config.search.advanceKeyword)) {
        if (filter.keywords.startsWith(`${advanceField}|`)) {
          // 检查是否跳过
          if (advanceConfig.skip === true) {
            result.status = ESearchResultParseStatus.passSearch;
            return result;
          }

          // 改写 filter.keywords 并缓存 transformer
          filter.keywords = filter.keywords?.replace(`${advanceField}|`, "");
          advanceKeywordTransformer = advanceConfig.transformer!;
        }
      }
    }

    // 根据配置和搜索关键词生成 AxiosRequestConfig
    let axiosConfig: AxiosRequestConfig = merge(
      {
        url: "/",
        responseType: "document"
      },
      this.config.search?.requestConfig, // 使用默认配置覆盖垫片配置
      await this.transformSearchFilter(filter) // 根据搜索信息生成配置
    );

    // 如果是 Imdb 搜索，且定义了 imdbTransformer 方法，则改写 AxiosRequestConfig
    if (advanceKeywordTransformer) {
      axiosConfig = advanceKeywordTransformer(axiosConfig, filter);
    }

    // 请求页面并转化为document
    try {
      const req = await this.request({
        ...axiosConfig,
        checkLogin: true
      });
      const rawTorrent = await this.transformSearchPage(req.data);
      result.data = rawTorrent.map((t) =>
        this.fixParsedTorrent(t, {
          filter,
          axiosConfig
        })
      );
    } catch (e) {
      if (e instanceof NeedLoginError) {
        result.status = ESearchResultParseStatus.needLogin;
      } else if (e instanceof NoTorrentsError) {
        result.status = ESearchResultParseStatus.noResults;
      } else {
        result.status = ESearchResultParseStatus.parseError;
      }
    }
    return result;
  }

  async request<T> (
    axiosConfig: AxiosRequestConfig & {
      requestName?: string;
      checkLogin?: boolean;
    }
  ): Promise<AxiosResponse<T>> {
    // 统一设置一些 AxiosRequestConfig， 当作默认值
    axiosConfig.baseURL = axiosConfig.baseURL || this.activateUrl;
    axiosConfig.url = axiosConfig.url || "/";
    console.log(axiosConfig);

    let req: AxiosResponse;
    try {
      req = await axios.request<T>(axiosConfig);

      // 全局性的替换 span.__cf_email__
      if (axiosConfig.responseType === "document") {
        const doc = req.data;

        // 进行简单的检查，防止无意义的替换
        if (
          doc instanceof Document &&
          doc.documentElement.outerHTML.search("__cf_email__")
        ) {
          const cfProtectSpan = Sizzle(".__cf_email__", doc);

          cfProtectSpan.forEach((element) => {
            element.replaceWith(
              cfDecodeEmail((element as HTMLElement).dataset.cfemail!)
            );
          });
        }

        req.data = doc;
      }
    } catch (e) {
      req = (e as AxiosError).response!;
      if (req.status >= 400) {
        throw Error(
          `Network Error: ${req.status} ${req.statusText || ""}`.trim()
        );
      }
    }

    if (axiosConfig.checkLogin && !this.loggedCheck(req)) {
      throw new NeedLoginError(); // FIXME i18n
    }

    return req;
  }

  /**
   * @warning 此方法不可以在 getFieldData 的 filters 中使用，
   *          对于约定的 url, link 本方法会自动调用进行补全
   * @param uri
   * @param requestConfig
   */
  protected fixLink (uri: string, requestConfig: AxiosRequestConfig): string {
    let url = uri;

    if (uri.length > 0 && !uri.startsWith("magnet:")) {
      const baseUrl = requestConfig.baseURL || this.activateUrl;
      if (uri.startsWith("//")) {
        // 当 传入的uri 以 /{2,} 开头时，被转换成类似 https?:///xxxx/xxxx 的形式，
        // 虽不符合url规范，但是浏览器容错高，所以不用担心 2333
        const urlHelper = new URL(baseUrl);
        url = `${urlHelper.protocol}:${uri}`;
      } else if (uri.slice(0, 4) !== "http") {
        url = urlJoin(baseUrl, uri.replace(/^\./, ""));
      }
    }

    return url;
  }

  /**
   * getFieldData 的上层方法，目的是直接获取一批数据，并以字典形式返回
   * @param element
   * @param selectorGroup
   * @param fields
   * @protected
   */
  protected getFieldsData<G extends "search" | "detail" | "userInfo",
    // @ts-ignore
    F extends keyof Required<Required<ISiteMetadata>[G]>["selectors"]> (
    element: Element | object,
    selectorGroup: G,
    fields: F[]
  ): { [key in F]?: any } {
    const ret: { [key in F]?: any } = {};

    for (const [key, selector] of Object.entries(
      pick(this.config[selectorGroup]!.selectors, fields)
    )) {
      // @ts-ignore
      ret[key] = this.getFieldData(element, selector as IElementQuery);
    }

    return ret;
  }

  protected getFieldData (
    element: Element | object,
    elementQuery: IElementQuery
  ): any {
    const { selector } = elementQuery;
    let query: string | number | object = String(elementQuery.text ?? "");
    let selectorId = 0;
    if (elementQuery) {
      const selectors = ([] as string[]).concat(selector!);
      for (; selectorId < selectors.length; selectorId++) {
        const selector = selectors[selectorId];
        if (element instanceof Node) {
          // 这里我们预定义一个特殊的 Css Selector，即不进行子元素选择
          const another = (
            selector === ":self" ? element : Sizzle(selector, element as Element | Document)[0]
          ) as HTMLElement;
          if (another) {
            if (elementQuery.elementProcess) {
              query = this.runQueryFilters<string>(
                another,
                elementQuery.elementProcess
              );
            } else if (elementQuery.case) {
              for (const [match, value] of Object.entries(elementQuery.case)) {
                if (Sizzle.matchesSelector(another, match)) {
                  query = value ?? "";
                  break;
                }
              }
            } else if (elementQuery.data) {
              query = another.dataset[elementQuery.data] ?? "";
            } else if (elementQuery.attr) {
              query = another.getAttribute(elementQuery.attr) ?? "";
            } else {
              query = another.innerText.replace(/\n/gi, " ") || "";
            }
          }
        } else {
          query = selector === ":self" ? element : get(element, selector)!;
        }

        // noinspection SuspiciousTypeOfGuard
        if (typeof query === "string") {
          query = query.trim();
        }
        if (query !== "") {
          break;
        }
      }
    }

    if (elementQuery.switchFilters && elementQuery.switchFilters.length > 0) {
      /** FIXME
       * 当所有selector都未匹配时 selectorId = selectors.length，此时可能
       * 导致 switchFilters[selectorId] === undefined ，所以此时不应运行 switchFilters
       */
      if (selectorId < elementQuery.switchFilters.length) {
        query = this.runQueryFilters(
          query,
          elementQuery.switchFilters[selectorId]
        );
      }
    } else if (elementQuery.filters && elementQuery.filters.length > 0) {
      query = this.runQueryFilters(query, elementQuery.filters);
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

  protected runQueryFilters<T> (
    query: any,
    filters: TQueryFilter[] | TQueryFilter
  ): T {
    const realFilters = ([] as TQueryFilter[]).concat(filters);
    for (let i = 0; i < realFilters.length; i++) {
      const fn = realFilters[i];

      if (typeof fn === "function") {
        query = fn(query);
      } else {
        query = runFilter(query, fn);
      }
    }
    return query;
  }

  /**
   * 登录检查方法，对于公开站点，该方法一定直接返回 True
   * @param raw
   */
  protected loggedCheck (raw: AxiosResponse): boolean {
    return true;
  }

  /**
   * 如何解析 JSON 或者 Document，获得种子详情列表
   * @param doc
   */
  protected async transformSearchPage (
    doc: Document | object | any
  ): Promise<ITorrent[]> {
    if (!this.config.search?.selectors?.rows) {
      throw Error("列表选择器未定义");
    }

    const rowsSelector = this.config.search.selectors.rows;
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
      trs =
        rowsSelector.selector === ":self"
          ? doc
          : get(doc, rowsSelector.selector as string);

      if (rowsSelector.filter) {
        trs = rowsSelector.filter(trs);
      }
    }

    // 如果没有搜索到种子，则抛出 NoTorrentsError
    if (trs.length === 0) {
      throw new NoTorrentsError();
    }

    trs?.forEach((tr: any) => {
      torrents.push(this.parseRowToTorrent(tr) as ITorrent);
    });

    return torrents;
  }

  protected fixParsedTorrent (
    torrent: ITorrent,
    requestConfig: ISearchRequestConfig
  ): ITorrent {
    // 检查种子的id属性是否存在，如果不存在，则由 url, link 属性替代
    if (!torrent.id) {
      if (torrent.url) {
        torrent.id = torrent.url;
      } else if (torrent.link) {
        torrent.id = torrent.link;
      }
    }

    for (const [key, value] of Object.entries(torrent)) {
      let updateValue = value;
      if (key === "url" || key === "link") {
        // 将相对链接补齐至绝对链接地址
        updateValue = this.fixLink(value as string, requestConfig.axiosConfig);
      } else if (key === "size" && typeof value === "string") {
        // 将获取到的 size 从 string 转化为 bytes
        updateValue = parseSizeString(value);
      } else if (key === "time") {
        // 不指定时区的话默认按0时区处理
        updateValue = parseTimeWithZone(
          value,
          this.config.timezoneOffset || "+0000"
        );
      } else if (
        [
          "id",
          "size",
          "seeders",
          "leechers",
          "completed",
          "comments",
          "category",
          "status",
        ].includes(key)
      ) {
        // 其他一些能够为数字的统一转化为数字
        if (typeof updateValue === "string") {
          updateValue = updateValue.replace(/[, ]/gi, ""); // 统一处理 `1,024` `1 024` 之类的情况
          if (/^-?\d+$/.test(updateValue)) {
            // 尽可能的将返回值转成数字类型
            updateValue = isNaN(parseInt(updateValue))
              ? 0
              : parseInt(updateValue);
          }
        }
      }

      // 如果定义了 this.config.category，则尝试对其进行转化
      if (key === "category" && this.config.category) {
        const CategoryData = this.config.category.options.find(
          (d) => d.value === updateValue
        );
        if (CategoryData) {
          updateValue = CategoryData.name;
        }
      }

      // @ts-ignore
      torrent[key] = updateValue;
    }

    return torrent;
  }

  protected parseRowToTorrent (
    row: Element | Document | object,
    torrent: Partial<ITorrent> = {}
  ): Partial<ITorrent> {
    const leftKeys = Object.keys(this.config.search!.selectors!).filter(
      (key) => {
        return (
          ![
            "rows", // rows 已经在前面被处理过了
            "tags", // tags 转由 parseTagsFromRow 方法处理
          ].includes(key) && !(key in torrent)
        );
      }
    ) as (keyof Required<ISiteMetadata>["search"]["selectors"])[];

    torrent = {
      ...torrent,
      ...this.getFieldsData(row, "search", leftKeys),
    };

    // 处理Tags
    if (this.config.search?.selectors?.tags) {
      torrent.tags = this.parseTagsFromRow(row);
    }

    // 处理下载进度
    if (!torrent.progress || !torrent.status) {
      torrent = { ...torrent, ...this.parseDownloadProcessFromRow(row) };
    }

    return torrent;
  }

  protected parseTagsFromRow (row: Element | Document | object): ITorrentTag[] {
    const tags: ITorrentTag[] = [];
    const tagsQuerys = this.config.search!.selectors!.tags!;
    for (let i = 0; i < tagsQuerys.length; i++) {
      const tagsQuery = tagsQuerys[i];

      if (!tagsQuery.color) {
        // 补全 tags 的颜色信息
        if (Object.keys(ETorrentBaseTagColor).includes(tagsQuery.name)) {
          // @ts-ignore
          tagsQuery.color = ETorrentBaseTagColor[tagsQuery.name];
        } else {
          tagsQuery.color = "#ffc107";
        }
      }

      const {
        selector,
        name,
        color
      } = tagsQuerys[i];
      if (row instanceof Element) {
        if (Sizzle(selector, row).length > 0) {
          tags.push({
            name,
            color
          });
        }
      } else {
        if (get(row, selector)) {
          tags.push({
            name,
            color
          });
        }
      }
    }

    return tags;
  }

  protected parseDownloadProcessFromRow (
    row: Element | Document | object
  ): Pick<ITorrent, "progress" | "status"> {
    return {};
  }

  async getTorrentPageLink (torrent: ITorrent): Promise<string> {
    return torrent.url;
  }

  async getTorrentDownloadLink (torrent: ITorrent): Promise<string> {
    if (!torrent.link && this.config?.detail?.selectors?.link) {
      const { data } = await this.request<any>(
        merge(
          {
            responseType: "document",
            url: torrent.url,
          },
          this.config.detail?.requestConfig
        )
      );
      return this.getFieldData(data, this.config.detail.selectors.link);
    }

    return torrent.link;
  }
}
