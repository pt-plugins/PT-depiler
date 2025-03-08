import { defineStore } from "pinia";
import { getDefinedSiteMetadata, type IAdvancedSearchRequestConfig, ISiteUserConfig, TSiteID } from "@ptd/site";
import { sendMessage } from "@/messages.ts";

export type TSolutionID = string;
export interface ISearchSolution {
  siteId: TSiteID;
  searchEntries: Record<string, IAdvancedSearchRequestConfig>;
}

export interface ISearchSolutionState {
  name: string;
  solutions: ISearchSolution[];
}

export const useSiteStore = defineStore("site", {
  persist: true,
  state: () => ({
    sites: {} as Record<TSiteID, ISiteUserConfig>,
    solutions: {} as Record<TSolutionID, ISearchSolutionState>,
  }),
  getters: {
    getAddedSiteIds(state) {
      return Object.keys(state.sites);
    },

    getSearchSolution(state) {
      return async (solutionId: TSolutionID | "default"): Promise<ISearchSolutionState> => {
        if (solutionId === "default") {
          const solutions: ISearchSolution[] = [];

          const addedSiteIds = Object.keys(state.sites);
          for (const siteId of addedSiteIds) {
            const siteMetadata = await getDefinedSiteMetadata(siteId);
            solutions.push({
              siteId,
              searchEntries: siteMetadata.searchEntry ?? { default: {} },
            });
          }

          return { name: "default", solutions };
        } else {
          return state.solutions[solutionId];
        }
      };
    },
  },
  actions: {
    addSite(siteId: TSiteID, siteConfig: ISiteUserConfig) {
      delete siteConfig.valid;
      this.sites[siteId] = siteConfig;
      this.$save();
    },
    removeSite(siteId: TSiteID) {
      delete this.sites[siteId];
      this.$save();
    },
    updateSite(siteId: TSiteID, siteConfig: ISiteUserConfig) {
      delete siteConfig.valid;
      this.sites[siteId] = siteConfig;
      this.$save();
    },
    simplePatchSite<T extends keyof ISiteUserConfig>(siteId: TSiteID, key: T, value: ISiteUserConfig[T]) {
      this.sites[siteId][key] = value;
      this.$save();
    },

    async getSiteMetadata(siteId: TSiteID) {
      return await getDefinedSiteMetadata(siteId);
    },

    async getSiteUserConfig(siteId: TSiteID) {
      return sendMessage("getSiteUserConfig", siteId);
    },
  },
});
