import { computed, ref } from "vue";
import { filesize } from "filesize";
import { refDebounced } from "@vueuse/core";
import searchQueryParser, { type SearchParserOptions, SearchParserResult } from "search-query-parser";
import { parseSizeString, parseValidTimeString } from "@ptd/site";
import { formatDate } from "@/options/utils.ts";

import { get } from "es-toolkit/compat";
import { flattenDeep } from "es-toolkit";
import { startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "date-fns";

type TAdvanceFilterFormat = "date" | "size";

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

interface IAdvanceFilterDict {
  text: ITextValue;
  [key: string]: ITextValue | IKeywordValue<any> | IRangedValue;
}

interface IValueFormat {
  parse?: (value: any) => any;
  build?: (value: any) => any;
}

const advanceFilterFormat: Record<TAdvanceFilterFormat, IValueFormat> = {
  date: {
    parse: (value: string) => parseValidTimeString(value, dateFilterFormat) as number,
    build: (value: string | number) => formatDate(value, "yyyyMMdd'T'HHmmss") as string,
  },
  size: {
    parse: parseSizeString,
    build: (value: string | number) => filesize(value, { spacer: "" }),
  },
} as const;

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
export const dateFilterFormat = [
  "T",
  "yyyyMMdd'T'HHmmss",
  "yyyyMMdd'T'HHmm",
  "yyyyMMdd'T'HH",
  "yyyyMMdd",
  "yyyyMM",
  "yyyy",
];

export function checkRange(range: { from?: number; to?: number }, value: number) {
  if (range?.from && value < range.from) return false;
  if (range?.to && value > range.to) return false;
  return true;
}

export function setDateRangeByDatePicker(value: unknown[]): [number, number] {
  const dateRange = value as Date[];
  return [dateRange[0].getTime(), dateRange[dateRange.length - 1].getTime()];
}

interface TableCustomFilterOptions {
  parseOptions: SearchParserOptions;
  titleFields: string[]; // item的那些部分作为title

  format?: Record<string, TAdvanceFilterFormat | IValueFormat>;

  initialSearchValue?: string;
  debouncedMs?: number;
}

export function useTableCustomFilter<ItemType extends Record<string, any>>(options: TableCustomFilterOptions) {
  const { parseOptions, titleFields = ["title"], format = {}, initialSearchValue = "", debouncedMs = 500 } = options;

  parseOptions.tokenize = true;
  parseOptions.offsets = false;
  parseOptions.alwaysArray = true;

  const tableWaitFilterRef = ref(initialSearchValue);
  const tableFilterRef = refDebounced(tableWaitFilterRef, debouncedMs); // 延迟搜索过滤词的生成

  // @ts-ignore
  const tableParsedFilterRef = computed<SearchParserResult>(() =>
    searchQueryParser.parse(tableFilterRef.value, parseOptions),
  );

  const advanceFilterDictRef = ref<Record<string, any>>({ text: { required: [], exclude: [] } });
  parseOptions.keywords?.forEach((key) => {
    advanceFilterDictRef.value[key] = { all: [], required: [], exclude: [] };
  });
  parseOptions.ranges?.forEach((key) => {
    advanceFilterDictRef.value[key] = { range: [0, 0], ticks: [], value: [0, 0] };
  });

  const getRaw = (x: any) => x;
  function getValueFormat(key: string): Required<IValueFormat> {
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

  function checkKeywordValue<K extends string>(
    filter: Record<K, string[]>,
    rawItem: ItemType,
    keyword: K,
    // @ts-ignore
  ): boolean | undefined {
    if (filter[keyword] && rawItem[keyword]) {
      const valueFormat = getValueFormat(keyword);
      const itemValue = rawItem[keyword];
      if (Array.isArray(itemValue)) {
        const parsedItemValue = itemValue.map((v: any) => valueFormat.parse(v)) as string[];
        return filter[keyword].every((keyword: string) => parsedItemValue.includes(keyword));
      } else {
        return filter[keyword].includes(valueFormat.parse(itemValue) as string);
      }
    }
  }

  function tableFilterFn(value: any, query: string, item: any): boolean {
    const rawItem = item.raw as ItemType;

    const { text, exclude } = tableParsedFilterRef.value;

    const itemTitle = flattenDeep(titleFields.map((key) => get(rawItem, key)))
      .filter(Boolean)
      .join("|$|")
      .toLowerCase();

    console.log(rawItem, tableParsedFilterRef.value);

    if (text) {
      const includeText = (Array.isArray(text) ? text : [text]).map((x) => x.toLowerCase());
      if (!includeText.every((keyword: string) => itemTitle.includes(keyword))) return false;
    }

    if (parseOptions.keywords) {
      for (const keyword of parseOptions.keywords) {
        if (checkKeywordValue(tableParsedFilterRef.value, rawItem, keyword) === false) return false;
      }
    }

    if (parseOptions.ranges) {
      for (const keyword of parseOptions.ranges) {
        if (tableParsedFilterRef.value[keyword] && rawItem[keyword]) {
          const valueFormat = getValueFormat(keyword);
          const from = valueFormat.parse((tableParsedFilterRef.value[keyword] as any).from) as number;
          const to = valueFormat.parse((tableParsedFilterRef.value[keyword] as any).to) as number;

          if (!checkRange({ from, to }, rawItem[keyword as string])) return false;
        }
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
          if (checkKeywordValue(exclude, rawItem, keyword) === true) return false;
        }
      }

      if (parseOptions.ranges) {
        for (const keyword of parseOptions.ranges) {
          if (exclude[keyword] && rawItem[keyword]) {
            const valueFormat = getValueFormat(keyword);
            const from = valueFormat.parse((exclude[keyword] as any).from) as number;
            const to = valueFormat.parse((exclude[keyword] as any).to) as number;

            if (checkRange({ from, to }, rawItem[keyword as string])) return false;
          }
        }
      }
    }

    return true;
  }

  function stringifyFilterFn() {
    const { keywords = [], ranges = [] } = parseOptions;
    const filters: any = { exclude: {} };

    ["text", ...keywords].forEach((key) => {
      const valueFormat = getValueFormat(key);
      const { required, exclude } = advanceFilterDictRef.value[key] as unknown as ITextValue;
      if (required?.length > 0) filters[key] = required.map((v) => valueFormat.build(v));
      if (exclude?.length > 0) filters.exclude[key] = required.map((v) => valueFormat.build(v));
    });

    ranges.forEach((key) => {
      const valueFormat = getValueFormat(key);
      const { range, value } = advanceFilterDictRef.value[key] as unknown as IRangedValue;
      if (value[0] !== range[0] || value[1] !== range[1]) {
        filters[key] = { from: valueFormat.build(value[0]), to: valueFormat.build(value[1]) };
      }
    });

    return searchQueryParser.stringify(filters, parseOptions);
  }

  function updateTableFilterValue() {
    tableWaitFilterRef.value = stringifyFilterFn();
  }

  return {
    tableWaitFilterRef,
    tableFilterRef,
    tableParsedFilterRef,
    advanceFilterDictRef,
    tableFilterFn,
    stringifyFilterFn,
    updateTableFilterValue,
  };
}
