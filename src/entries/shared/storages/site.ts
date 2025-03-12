import type { IAdvancedSearchRequestConfig, ISiteUserConfig, TSiteID } from "@ptd/site";

export type TSolutionID = string;
export interface ISearchSolution {
  siteId: TSiteID;
  searchEntries: Record<string, IAdvancedSearchRequestConfig>;
}

export interface ISearchSolutionState {
  name: string;
  solutions: ISearchSolution[];
}

export interface SitePiniaStorageSchema {
  sites: Record<TSiteID, ISiteUserConfig>;
  solutions: Record<TSolutionID, ISearchSolutionState>;
}
