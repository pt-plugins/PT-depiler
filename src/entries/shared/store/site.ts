import { nanoid } from "nanoid";
import { remove } from "lodash-es";
import { defineStore } from "pinia";
import { computedAsync } from "@vueuse/core";
import { ISearchParamsMap, type SiteID } from "@ptd/site";
import { faviconCache, getSiteConfig, getSiteFavicon, diffSiteConfig, ISiteRuntimeConfig } from "@/shared/adapters/site";
import { i18n } from "@/shared/plugins/i18n";

// 在store中缓存favicon对象，以保持单一性
export const siteFavicons = computedAsync(async () => {
  const ret: Record<string, string | false> = {};
  await faviconCache.iterate(function (value: string, key: string) {
    ret[key] = value;
  });
  return ret;
}, {});

export interface searchPlan {
  site: SiteID,
  filters: ISearchParamsMap
}

type SolutionId = string;

export interface storedSearchSolution {
  id?: SolutionId,
  name: string,
  plan: searchPlan[],
  sort?: number
}

export const useSiteStore = defineStore("site", {
  persist: true,
  state: () => ({
    sites: {} as Record<SiteID, ISiteRuntimeConfig>,
    searchSolutions: {
      default: {
        id: "default",
        name: "default",
        plan: [],
        sort: 0
      }
    } as Record<SolutionId, Required<storedSearchSolution>>
  }),

  getters: {
    addedSiteIds (state) {
      return Object.keys(state.sites);
    },

    getSites () {
      return async (siteIds?: SiteID[]) => {
        siteIds ??= this.addedSiteIds;
        const siteDefinitions: ISiteRuntimeConfig[] = [];
        for (const siteId of siteIds) {
          siteDefinitions.push((await getSiteConfig(siteId)) as ISiteRuntimeConfig);

          // noinspection ES6MissingAwait
          getSiteFavicon(siteId);
        }

        siteDefinitions.sort((a, b) => a.sortIndex! > b.sortIndex! ? 1 : -1);

        return siteDefinitions;
      };
    },

    getSolutionList: (state) => {
      return Object.values(state.searchSolutions);
    },

    getSortSolutionIds: (state) => {
      return Object.values(state.searchSolutions)
        .sort((a, b) => (a.sort > b.sort) ? 1 : -1)
        .map(a => a.id);
    },

    getSolutionPlan: (state) => {
      return (id: SolutionId) => {
        if (id === "default") {
          /**
           * 由于对于默认搜索方案，所有的字段都定义在 ISiteRuntimeConfig.defaultSearchParams 上，
           * 所以此处需要从 siteStore 中遍历获取
           */
          return Object.entries(state.sites)
            .map(([site, config]) => ({
              site, filters: config.defaultSearchParams ?? []
            }));
        } else {
          return state.searchSolutions[id];
        }
      };
    },

    getSolutionName:(state) => {
      return (id: SolutionId) => {
        if (id === "default") {
          // @ts-ignore
          return i18n.t("common.default");
        } else {
          return state.searchSolutions[id].name;
        }
      };
    },
  },
  actions: {
    async addSite (site: ISiteRuntimeConfig) {
      this.sites[site.id] = await diffSiteConfig(site, false);
      this.$save();
    },

    async patchSite (site: ISiteRuntimeConfig) {
      this.sites[site.id] = await diffSiteConfig(site);
      this.$save();
    },

    simplePatchSite(siteId: SiteID, key: keyof ISiteRuntimeConfig, value: any) {
      // @ts-ignore
      this.sites[siteId][key] = value;
      this.$save();
    },

    removeSite (siteId: SiteID) {
      delete this.sites[siteId];
      this.$save();
    },

    addSearchSolution (solution: Omit<storedSearchSolution, "id">) {
      const solutionId = nanoid();

      if (!solution.sort || solution.sort < 0 || solution.sort > 100) {
        solution.sort = 50;
      }

      this.searchSolutions[solutionId] = {...solution, id: solutionId} as Required<storedSearchSolution>;
      this.$save();
    },

    patchSearchSolution (id: SolutionId, solution: Required<storedSearchSolution>) {
      if (id !== "default") {
        this.searchSolutions[id] = solution;
        this.$save();
      }
    },

    removeSearchSolution (id: SolutionId) {
      if (id !== "default") {  // prevent default solution delete
        delete this.searchSolutions[id];
        this.$save();
      }
    },

    removeSearchSolutionPlan (id: SolutionId, removePlan: searchPlan) {
      if (id !== "default") {
        const searchSolutions = this.searchSolutions[id];
        remove(searchSolutions.plan, removePlan);
        this.$save();
      }
    }
  },
});
