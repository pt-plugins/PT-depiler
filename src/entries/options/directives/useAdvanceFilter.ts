import { filesize } from "filesize";
import { get } from "es-toolkit/compat";
import { refDebounced } from "@vueuse/core";
import { computed, type Ref, ref, unref, watch } from "vue";
import { flatten, flattenDeep, isEqual, uniq, uniqBy } from "es-toolkit";
import { startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "date-fns";
import searchQueryParser, { type SearchParserOptions, SearchParserResult } from "search-query-parser";

import { parseSizeString, parseValidTimeString } from "@ptd/site";
import { formatDate } from "@/options/utils.ts";

type TAdvanceFilterFormat = "date" | "size" | "boolean";

export interface ITextValue {
  required: string[];
  exclude: string[];
}

export interface IKeywordValue<T> extends ITextValue {
  all: T[];
}

export interface IRangedValue {
  range: [number, number];
  ticks: number[];
  value: [number, number];
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

export function generateRange(data: (number | undefined)[]): [number, number] {
  const numData = data.filter((x) => !isNaN(x as unknown as number)) as number[];
  return [Math.min(...numData), Math.max(...numData)];
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

export function generateRangeField(data: (number | undefined)[]): IRangedValue {
  const range = generateRange(data);
  return { range, ticks: Array.from(new Set(data)) as number[], value: range };
}

export function setDateRangeByDatePicker(value: unknown[]): [number, number] {
  const dateRange = value as Date[];
  return [dateRange[0].getTime(), dateRange[dateRange.length - 1].getTime()];
}

type TFilter = SearchParserResult & { [key: string]: any[] };
type TRawItem = { [key: string]: any };

export function checkKeywordValue(
  filter: TFilter,
  rawItem: TRawItem,
  keyword: string,
  format: TFormat = {},
  // @ts-ignore
): boolean | undefined {
  const itemValue = get(rawItem, keyword); // true    filter[keyword] = ['1']
  if (filter[keyword] && typeof itemValue !== "undefined") {
    const valueFormat = getValueFormat(keyword as string, format);
    if (Array.isArray(itemValue)) {
      const parsedItemValue = itemValue.map((v: any) => valueFormat.parse(v)) as string[];
      return filter[keyword].every((keyword: string) => parsedItemValue.includes(keyword));
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

  initialSearchValue?: string;
  initialItems?: Ref<ItemType[]> | ItemType[];
  debouncedMs?: number;

  watchItems?: boolean; // 是否监听 items 的变化（需要传入的为ref），动态更新 advanceFilterDictRef
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
  } = options;

  parseOptions.tokenize = true;
  parseOptions.offsets = false;
  parseOptions.alwaysArray = true;

  const tableWaitFilterRef = ref(initialSearchValue);
  const tableFilterRef = refDebounced(tableWaitFilterRef, debouncedMs); // 延迟搜索过滤词的生成

  // @ts-ignore
  const tableParsedFilterRef = computed<TFilter>(() => searchQueryParser.parse(tableFilterRef.value, parseOptions));

  const advanceFilterDictRef = ref<Record<string, any>>({});

  const resetAdvanceFilterDictCountRef = ref<number>(0);

  function resetAdvanceFilterDictFn() {
    resetAdvanceFilterDictCountRef.value++; // 更新重置计数，防止因为 :key 的问题导致 vue 无法重置 v-checkbox
    advanceFilterDictRef.value.text = { required: [], exclude: [] };
    parseOptions.keywords?.forEach((keyword) => {
      const valueFormat = getValueFormat(keyword, format);

      advanceFilterDictRef.value[keyword] = {
        all: uniqBy(
          flatten(
            unref(initialItems)
              .map((item) => item[keyword])
              .filter(Boolean),
          ),
          (x) => valueFormat.parse(x),
        ),
        required: [],
        exclude: [],
      };
    });
    parseOptions.ranges?.forEach((keyword) => {
      advanceFilterDictRef.value[keyword] = generateRangeField(unref(initialItems).map((item) => item[keyword]));
    });
  }

  resetAdvanceFilterDictFn();

  if (watchItems) {
    watch(initialItems, () => resetAdvanceFilterDictFn());
  }

  function toggleKeywordStateFn<T = any>(field: string, value: T) {
    const state = advanceFilterDictRef.value[field].required!.includes(value);
    if (state) {
      advanceFilterDictRef.value[field].exclude!.push(value);
    } else {
      advanceFilterDictRef.value[field].exclude! = advanceFilterDictRef.value[field].exclude!.filter(
        (x: T) => !isEqual(x, value),
      );
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
          if (checkKeywordValue(exclude, rawItem, keyword, format) === true) return false;
        }
      }

      // NOTE： search-query-parser 不支持 range 的 exclude
    }

    return true;
  }

  function stringifyFilterFn() {
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
      const { range, value } = advanceFilterDictRef.value[key] as unknown as IRangedValue;
      if (value[0] !== range[0] || value[1] !== range[1]) {
        filters[key] = { from: valueFormat.build(value[0]), to: valueFormat.build(value[1]) };
      }
    });

    return searchQueryParser.stringify(filters, parseOptions);
  }

  function updateTableFilterValueFn() {
    tableWaitFilterRef.value = stringifyFilterFn();
  }

  return {
    tableWaitFilterRef,
    tableFilterRef,
    tableParsedFilterRef,
    advanceFilterDictRef,
    resetCountRef: resetAdvanceFilterDictCountRef,
    resetAdvanceFilterDictFn,
    toggleKeywordStateFn,
    tableFilterFn,
    stringifyFilterFn,
    updateTableFilterValueFn,
  };
}
