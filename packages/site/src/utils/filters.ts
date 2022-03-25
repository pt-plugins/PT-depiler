import { parseSizeString } from "./filesize";
import { parseValidTimeString, parseTimeToLive } from "./datetime";

export type TDefinedFilterNameWithArgs = "querystring";
export type TDefinedFilterName =
  | "parseNumber"
  | "parseSize"
  | "parseTime"
  | "parseTTL"
  | TDefinedFilterNameWithArgs;

export interface IDefinedQueryFilter {
  name: TDefinedFilterName;
  args?: any[];
}

export interface IDefinedQueryFilterWithArgs {
  name: TDefinedFilterName;
  args: any[];
}

export type TQueryFilter =
  | IDefinedQueryFilter
  | IDefinedQueryFilterWithArgs
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function;

export function parseNumber(query: string): number {
  const queryMatch = query
    .trim()
    .replace(/[ ,\n]/g, "")
    .match(/([\d.]+)/);
  return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
}

export function findThenParseSizeString(query: string): number {
  const queryMatch = query
    .trim()
    .replace(/[ ,\n]/g, "")
    .match(/([\d.]+ ?[ZEPTGMK]?i?B)/);
  return queryMatch && queryMatch.length >= 2
    ? parseSizeString(queryMatch[1])
    : 0;
}

export function runFilter(query: any, filter: IDefinedQueryFilter): any {
  switch (filter.name) {
    case "parseNumber": {
      return parseNumber(query);
    }
    case "parseSize": {
      return findThenParseSizeString(query);
    }
    case "parseTime": {
      return parseValidTimeString(query, filter.args);
    }
    case "parseTTL": {
      return parseTimeToLive(query);
    }
    case "querystring": {
      const queryName = filter.args![0];
      return (new URL(query)).searchParams.get(queryName) || "";
    }
    default:
      return query;
  }
}
