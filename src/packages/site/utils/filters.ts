import { parseSizeString } from "./filesize";
import { parseValidTimeString, parseTimeToLive } from "./datetime";

export type TDefinedFilterNameWithArgs =
  | "querystring"
  | "append"
  | "perpend"
  | "replace";
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
  return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
}

export function runFilter(query: any, filter: IDefinedQueryFilter): any {
  const { name, args = [] } = filter;
  switch (name) {
    case "parseNumber": {
      return parseNumber(query);
    }
    case "parseSize": {
      return findThenParseSizeString(query);
    }
    case "parseTime": {
      return parseValidTimeString(query, args);
    }
    case "parseTTL": {
      return parseTimeToLive(query);
    }
    case "querystring": {
      const baseUrl = /^https?:/.test(query as string) ? "" : "http://localhost/";

      const parsedQueryString = new URL(query, baseUrl).searchParams;
      for (const arg of args) {
        if (parsedQueryString.has(arg)) {
          return parsedQueryString.get(arg);
        }
      }
      return "";
    }
    case "append": {
      return query + (args[0] || "");
    }
    case "perpend": {
      return (args[0] || "") + query;
    }
    case "replace": {
      return query.replace(args[0], args[1]);
    }
    default:
      return query;
  }
}
