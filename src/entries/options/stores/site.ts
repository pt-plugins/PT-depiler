import { defineStore } from "pinia";
import { getDefinedSiteMetadata, ISiteUserConfig, TSiteID } from "@ptd/site";
import { SiteSchema, TSolutionID, ISearchSolutionState, ISearchSolution } from "@/storage.ts";
import { isEmpty, set } from "es-toolkit/compat";

export const useSiteStore = defineStore("site", {
  persist: true,
  state: (): SiteSchema => ({
    sites: {},
    solutions: {},
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
      set(this.sites[siteId], key, value);
      this.$save();
    },

    async getSiteMetadata(siteId: TSiteID) {
      return await getDefinedSiteMetadata(siteId);
    },

    async getSiteUserConfig(siteId: TSiteID) {
      const siteUserConfig = this.sites[siteId] ?? {};
      if (isEmpty(siteUserConfig)) {
        const siteMetaData = await this.getSiteMetadata(siteId);
        siteUserConfig.isOffline ??= false;
        siteUserConfig.allowSearch ??= Object.hasOwn(siteMetaData, "search");
        siteUserConfig.allowQueryUserInfo ??= Object.hasOwn(siteMetaData, "userInfo");
        siteUserConfig.inputSetting ??= {};
        siteUserConfig.merge ??= {};
      }
      return siteUserConfig;
    },
  },
});
