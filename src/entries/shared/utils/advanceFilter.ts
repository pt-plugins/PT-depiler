import { type Reactive } from "vue";
import searchQueryParser, { type SearchParserOptions } from "search-query-parser";
import { startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "date-fns";
import { formatDate } from "@/options/utils.ts";
import { filesize } from "filesize";

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
  format?: (value: number) => string | number;
}

export type TAdvanceFilterDict = Record<string, ITextValue | IKeywordValue<any> | IRangedValue>;

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

export function generateRangeField(data: (number | undefined)[], format?: IRangedValue["format"]): IRangedValue {
  const range = generateRange(data);
  return { range, ticks: Array.from(new Set(data)) as number[], value: range, format };
}

export function setDateRangeByDatePicker(value: unknown[]): [number, number] {
  const dateRange = value as Date[];
  return [dateRange[0].getTime(), dateRange[dateRange.length - 1].getTime()];
}

const advanceFilterFormat: Record<string, IRangedValue["format"]> = {
  date: (value: number) => formatDate(value, "yyyyMMdd'T'HHmmss") as string,
  size: (value: number) => filesize(value, { spacer: "" }),
};

export function stringifyFilter<T>(
  advanceFilterDict: Reactive<TAdvanceFilterDict>,
  searchQueryParserOptions: SearchParserOptions,
) {
  const { keywords = [], ranges = [] } = searchQueryParserOptions;
  const filters: any = { exclude: {} };

  (["text", ...keywords] as T[]).forEach((key) => {
    const { required, exclude } = advanceFilterDict[key] as ITextValue;
    if (required?.length > 0) filters[key] = required;
    if (exclude?.length > 0) filters.exclude[key] = exclude;
  });

  ranges.forEach((key) => {
    const { range, value, format } = advanceFilterDict[key] as IRangedValue;
    if (value[0] !== range[0] || value[1] !== range[1]) {
      const valueFormat = format ?? advanceFilterFormat[key] ?? ((x: number | string) => x);
      filters[key] = { from: valueFormat(value[0]), to: valueFormat(value[1]) };
    }
  });

  return searchQueryParser.stringify(filters, searchQueryParserOptions);
}
