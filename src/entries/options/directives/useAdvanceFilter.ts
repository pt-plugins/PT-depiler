import { filesize } from "filesize";
import { get } from "es-toolkit/compat";
import { refDebounced } from "@vueuse/core";
import { computed, type Ref, ref, unref, watch, isRef } from "vue";
import { flatten, flattenDeep, isEqual, uniq, uniqBy } from "es-toolkit";
import { startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "date-fns";
import searchQueryParser, { type SearchParserOptions, SearchParserResult as TFilter } from "search-query-parser";

import { parseSizeString, parseValidTimeString } from "@ptd/site";
import { formatDate } from "@/options/utils.ts";

type TAdvanceFilterFormat = "date" | "size" | "number" | "boolean";

export interface ITextValue {
  required: string[];
  exclude: string[];
}

export interface IRangedField {
  range: [number, number];
  ticks: number[];
}

interface IValueFormat {
  parse?: (value: any) => any;
  build?: (value: any) => string;
}

export const dateFilterFormat = [
  "T",
  "yyyyMMdd'T'HHmmss",
  "yyyyMMdd'T'HHmm",
  "yyyyMMdd'T'HH",
  "yyyyMMdd",
  "yyyyMM",
  "yyyy",
];

const advanceFilterFormat: Record<TAdvanceFilterFormat, IValueFormat> = {
  date: {
    parse: (value: string | number) => {
      if (typeof value === "number") return value;
      else return parseValidTimeString(value, dateFilterFormat) as number;
    },
    build: (value: string | number) => formatDate(value, "yyyyMMdd'T'HHmmss") as string,
  },
  size: {
    parse: (value: string | number) => {
      if (typeof value === "number") return value;
      else return parseSizeString(value);
    },
    build: (value: string | number) => filesize(value, { spacer: "" }) as string,
  },
  // 对 number 全部转为字符串比较
  number: {
    parse: (value: string | number) => value.toString(),
    build: (value: string | number) => value.toString(),
  },
  boolean: {
    parse: (value: string) => (value ? "1" : "0"),
    build: (value: boolean) => (value ? "1" : "0"),
  },
} as const;

type TFormat = Record<string, TAdvanceFilterFormat | IValueFormat>;

const getRaw = (x: any) => x;
function getValueFormat(key: string, format: TFormat = {}): Required<IValueFormat> {
  let valueFormatFn: IValueFormat = {};

  if (format[key]) {
    if (typeof format[key] === "string" && advanceFilterFormat[format[key] as TAdvanceFilterFormat]) {
      valueFormatFn = advanceFilterFormat[format[key] as TAdvanceFilterFormat];
    } else {
      const { parse: parseFn, build: buildFn } = format[key] as IValueFormat;
      valueFormatFn.parse ??= parseFn;
      valueFormatFn.build ??= buildFn;
    }
  }

  valueFormatFn.parse ??= getRaw;
  valueFormatFn.build ??= getRaw;

  return valueFormatFn as Required<IValueFormat>;
}

export function getThisDateUnitRange(
  dateType: "day" | "week" | "month" | "quarter" | "year",
  range: [number, number],
): [number, number] {
  const [minDate, maxDate] = range;

  const now = new Date();
  const start = {
    day: startOfDay(now),
    week: startOfWeek(now),
    month: startOfMonth(now),
    quarter: startOfQuarter(now),
    year: startOfYear(now),
  }[dateType];

  return [Math.max(minDate, start.getTime()), Math.min(maxDate, now.getTime())];
}

export function generateRangeField(data: (number | undefined)[]): IRangedField {
  const numData = data.filter((x) => !isNaN(x as unknown as number)) as number[];

  return {
    range: numData.length > 0 ? [Math.min(...numData), Math.max(...numData)] : [-Infinity, Infinity],
    ticks: Array.from(new Set(data)) as number[],
  };
}

export function setDateRangeByDatePicker(value: unknown[]): [number, number] {
  const dateRange = value as Date[];
  return [dateRange[0].getTime(), dateRange[dateRange.length - 1].getTime()];
}

type TRawItem = { [key: string]: any };

export function checkKeywordValue(
  filter: TFilter,
  rawItem: TRawItem,
  keyword: string,
  format: TFormat = {},
  exclude = false,
  // @ts-ignore
): boolean | undefined {
  const itemValue = get(rawItem, keyword); // true    filter[keyword] = ['1']
  if (filter[keyword]) {
    // 如果原始数据中没有该 keyword 字段，则直接返回 false
    if (typeof itemValue == "undefined") {
      return false;
    }

    const valueFormat = getValueFormat(keyword as string, format);
    if (Array.isArray(itemValue)) {
      const parsedSet = new Set(itemValue.map((v: any) => valueFormat.parse(v)) as string[]);
      const filterVals = filter[keyword] as string[];
      // 如果是正向关键词则要求全部包含，如果是排除关键词则要求有任意一个包含
      return exclude ? filterVals.some((k) => parsedSet.has(k)) : filterVals.every((k) => parsedSet.has(k));
    } else {
      return filter[keyword].includes(valueFormat.parse(itemValue) as string);
    }
  }
}

export function checkRangeValue(
  filter: TFilter,
  rawItem: TRawItem,
  keyword: string,
  format: TFormat = {},
  // @ts-ignore
): boolean | undefined {
  const itemValue = get(rawItem, keyword);
  if (filter[keyword] && typeof itemValue !== "undefined") {
    const valueFormat = getValueFormat(keyword, format);
    const value = valueFormat.parse(itemValue) as number;
    const from = valueFormat.parse((filter[keyword] as any).from || -Infinity) as number;
    const to = valueFormat.parse((filter[keyword] as any).to || Infinity) as number;

    return Boolean(from && value >= from && to && value <= to);
  }
}

interface TableCustomFilterOptions<ItemType> {
  parseOptions: SearchParserOptions;
  titleFields: string[]; // item的那些部分作为title

  format?: TFormat;

  initialSearchValue?: string; // 用于生成 tableWaitFilterRef 的初始数据
  initialItems?: Ref<ItemType[]> | ItemType[]; // 用于生成 advanceFilterDictRef 的初始数据
  debouncedMs?: number; // 过滤器字符串更新的防抖时间，单位毫秒

  watchItems?: boolean; // 是否监听 items 的变化（需要传入的为ref），动态更新 advanceFilterDictRef
  autoUpdateFilter?: boolean; // 是否在 advanceFilterDictRef 变化时自动更新过滤器字符串（需要传入的为ref）
}

export function useTableCustomFilter<ItemType extends Record<string, any>>(
  options: TableCustomFilterOptions<ItemType>,
) {
  const {
    parseOptions,
    titleFields = ["title"],
    format = {},
    initialSearchValue = "",
    initialItems = [],
    debouncedMs = 500,
    watchItems = false,
    autoUpdateFilter = false,
  } = options;

  // 给 parseOptions 设置一些固定的值，以控制 searchQueryParser.parse 的结果
  parseOptions.tokenize = true;
  parseOptions.offsets = false;
  parseOptions.alwaysArray = true;

  /**
   * 用作 VInput 的 v-model ，接收用户的直接输入
   */
  const tableWaitFilterRef = ref(initialSearchValue);

  /**
   * 用作 VDataTable 的 props.search，
   * 由于 VDataTable 过滤操作较重，而 用户直接输入的更新操作触发频繁
   * 通过延迟实际使用的搜索过滤词生成来避免不必要的卡顿
   */
  const tableFilterRef = refDebounced(tableWaitFilterRef, debouncedMs); // 延迟搜索过滤词的生成

  /**
   * 用作 VDataTable 内部比较方法 tableFilterFn
   * 通过 computed 来缓存 实际使用的判断字典
   */
  const tableParsedFilterRef = computed<TFilter>(
    () => searchQueryParser.parse(tableFilterRef.value, parseOptions) as TFilter,
  );

  /**
   * 用来表示 initialItems 中 parseOptions.{keywords, ranges} 可选值的字典，结构如下
   * {
   *   `${keyword}`: string[],
   *   `${ranges}`: { range: [min, max], ticks: [x1, x2, x3, ...] }
   * }
   */
  const advanceItemPropsRef = ref<Record<string, any>>({});

  function buildAdvanceItemPropsFn() {
    const unRefedItems = unref(initialItems);

    parseOptions.keywords?.forEach((keyword) => {
      const valueFormat = getValueFormat(keyword, format);

      advanceItemPropsRef.value[keyword] = uniqBy(
        flatten(unRefedItems.map((item) => item[keyword]).filter(Boolean)),
        (x) => valueFormat.parse(x),
      );
    });
    parseOptions.ranges?.forEach((keyword) => {
      advanceItemPropsRef.value[keyword] = generateRangeField(unRefedItems.map((item) => item[keyword]));
    });
  }

  // 方法调用时主动构建一次
  buildAdvanceItemPropsFn();

  // 如果设置了主动观察，且传入的 initialItems 可以被观察，则使用 watch 来自动构建
  if (watchItems && isRef(initialItems)) {
    watch(initialItems, () => buildAdvanceItemPropsFn(), { deep: true });
  }

  /**
   * 一个中间态字典，用于缓存在高级筛选窗口中勾选的项目
   * {
   *   text: { required: string[], exclude: string[] },
   *   `${keyword}`: { required: string[], exclude: string[] },
   *   `${ranges}`: [number, number]
   * }
   */
  const advanceFilterDictRef = ref<Record<string, any>>({});

  // 从 string 中构建 advanceFilterDictRef
  function buildFilterDictFn(text: string = "") {
    const { keywords = [], ranges = [] } = parseOptions;
    const parsedFilter = searchQueryParser.parse(text, parseOptions) as TFilter;

    ["text", ...keywords].forEach((key) => {
      const valueFormat = getValueFormat(key, format);
      let required: unknown[] = [];
      let exclude: unknown[] = [];

      if (parsedFilter[key]?.length) {
        required = uniq(flattenDeep(parsedFilter[key].map((v: any) => valueFormat.parse(v))));
      }
      if (parsedFilter.exclude?.[key]?.length) {
        exclude = uniq(flattenDeep(parsedFilter.exclude[key].map((v: any) => valueFormat.parse(v))));
      }

      advanceFilterDictRef.value[key] = { required, exclude };
    });

    ranges.forEach((key) => {
      const valueFormat = getValueFormat(key, format);

      advanceFilterDictRef.value[key] = [
        parsedFilter[key]?.from ? valueFormat.parse(parsedFilter[key].from) : -Infinity,
        parsedFilter[key]?.to ? valueFormat.parse(parsedFilter[key].to) : Infinity,
      ];
    });
  }

  // 方法调用时主动构建一次
  buildFilterDictFn(initialSearchValue);

  function stringifyFilterDictFn() {
    const { keywords = [], ranges = [] } = parseOptions;
    const filters: any = { exclude: {} };

    ["text", ...keywords].forEach((key) => {
      const valueFormat = getValueFormat(key, format);
      const { required, exclude } = advanceFilterDictRef.value[key] as unknown as ITextValue;
      if (required?.length > 0) filters[key] = uniq(flattenDeep(required.map((v) => valueFormat.build(v))));
      if (exclude?.length > 0) filters.exclude[key] = uniq(flattenDeep(exclude.map((v) => valueFormat.build(v))));
    });

    ranges.forEach((key) => {
      const valueFormat = getValueFormat(key, format);
      const range = (advanceItemPropsRef.value[key] as unknown as IRangedField).range;
      const value = (advanceFilterDictRef.value[key] as unknown as [number, number]).map(valueFormat.parse);

      if ((value[0] && value[0] !== -Infinity) || (value[1] && value[1] !== Infinity)) {
        filters[key] = {
          from: valueFormat.build(Math.max(range[0], value[0], -Infinity)),
          to: valueFormat.build(Math.min(range[1], value[1], Infinity)),
        };
      }
    });

    return searchQueryParser.stringify(filters, parseOptions);
  }

  function updateTableFilterValueFn() {
    tableWaitFilterRef.value = stringifyFilterDictFn();
  }

  if (autoUpdateFilter) {
    watch(
      advanceFilterDictRef,
      () => {
        updateTableFilterValueFn();
      },
      { deep: true },
    );
  }

  const reBuildFilterCountRef = ref<number>(0);
  function reBuildAdvanceFilter(updateItemProps: boolean = false) {
    reBuildFilterCountRef.value++; // 更新计数，防止因为 :key 的问题导致 vue 无法重置 v-checkbox 状态
    if (updateItemProps) buildAdvanceItemPropsFn();
    buildFilterDictFn(""); // 使用空字符串构建
  }

  function toggleKeywordStateFn(field: string, value: string) {
    const keywordState = advanceFilterDictRef.value[field] as ITextValue;
    const state = keywordState.required!.includes(value);
    if (state) {
      keywordState.exclude!.push(value);
    } else {
      keywordState.exclude! = keywordState.exclude!.filter((x: string) => !isEqual(x, value));
    }
  }

  function tableFilterFn(value: any, query: string, item: any): boolean {
    const rawItem = item.raw as ItemType;

    const { text, exclude } = tableParsedFilterRef.value;

    const itemTitle = flattenDeep(titleFields.map((key) => get(rawItem, key)))
      .filter(Boolean)
      .join("|$|")
      .toLowerCase();

    if (text) {
      const includeText = (Array.isArray(text) ? text : [text]).map((x) => x.toLowerCase());
      if (!includeText.every((keyword: string) => itemTitle.includes(keyword))) return false;
    }

    if (parseOptions.keywords) {
      for (const keyword of parseOptions.keywords) {
        if (checkKeywordValue(tableParsedFilterRef.value, rawItem, keyword, format) === false) return false;
      }
    }

    if (parseOptions.ranges) {
      for (const keyword of parseOptions.ranges) {
        if (checkRangeValue(tableParsedFilterRef.value, rawItem, keyword, format) === false) return false;
      }
    }

    if (exclude) {
      const { text: exText } = exclude;

      if (exText) {
        const excludesText = (Array.isArray(exText) ? exText : [exText]).map((x) => x.toLowerCase());
        if (excludesText.some((keyword: string) => itemTitle.includes(keyword))) return false;
      }

      if (parseOptions.keywords) {
        for (const keyword of parseOptions.keywords) {
          if (checkKeywordValue(exclude, rawItem, keyword, format, true) === true) return false;
        }
      }

      // NOTE： search-query-parser 不支持 range 的 exclude
    }

    return true;
  }

  return {
    tableWaitFilterRef,
    tableFilterRef,
    tableParsedFilterRef,
    advanceItemPropsRef,
    buildAdvanceItemPropsFn,
    advanceFilterDictRef,
    buildFilterDictFn,
    stringifyFilterDictFn,
    tableFilterFn,
    reBuildFilterCountRef,
    reBuildAdvanceFilter,
    updateTableFilterValueFn,
    toggleKeywordStateFn,
  };
}
