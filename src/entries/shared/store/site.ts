import { nanoid } from "nanoid";
import { remove } from "lodash-es";
import { defineStore } from "pinia";
import { ISearchParamsMap, type ITorrent, type SiteID } from "@ptd/site";
import {
  diffSiteConfig,
  getSiteConfig,
  getSiteFavicon,
  ISiteRuntimeConfig,
} from "@/shared/adapters/site";
import { i18n } from "@/shared/plugins/i18n";

export { faviconCache as siteFavicons } from "@/shared/adapters/site";

type PlanId = string;

export interface searchPlan {
  id: string;
  site: SiteID;
  filters: ISearchParamsMap;
}

type SolutionId = string;

export interface storedSearchSolution {
  id?: SolutionId;
  name: string;
  plan: searchPlan[];
  sort?: number;
}

export interface ISearchTorrent extends ITorrent {
  plan: PlanId;
}

export const useSiteStore = defineStore("site", {
  persist: true,
  state: () => ({
    sites: {} as Record<SiteID, ISiteRuntimeConfig>,
    defaultSearchSolution: "default",
    searchSolutions: {
      default: {
        id: "default",
        name: "default",
        plan: [],
        sort: 0,
      },
    } as Record<SolutionId, Required<storedSearchSolution>>,
  }),

  getters: {
    addedSiteIds(state) {
      return Object.keys(state.sites);
    },

    getSites() {
      return async (siteIds?: SiteID[]) => {
        siteIds ??= this.addedSiteIds;
        const siteDefinitions: ISiteRuntimeConfig[] = [];
        for (const siteId of siteIds) {
          siteDefinitions.push((await getSiteConfig(siteId)) as ISiteRuntimeConfig);

          // noinspection ES6MissingAwait
          getSiteFavicon(siteId);
        }

        siteDefinitions.sort((a, b) => (a.sortIndex! > b.sortIndex! ? 1 : -1));

        return siteDefinitions;
      };
    },

    getSolutionList: (state) => {
      return Object.values(state.searchSolutions);
    },

    getSortSolutionIds: (state) => {
      return Object.values(state.searchSolutions)
        .sort((a, b) => (a.sort > b.sort ? 1 : -1))
        .map((a) => a.id);
    },

    getSolutionPlan: (state) => {
      return (id: SolutionId): Required<storedSearchSolution> => {
        if (id === "default") {
          state.searchSolutions["default"].plan = Object.entries(state.sites).map(
            ([site, config]) =>
              ({
                id: site,
                site,
                filters: config.defaultSearchParams ?? [],
              }) as searchPlan,
          );

          return state.searchSolutions["default"];
        } else {
          return state.searchSolutions[id];
        }
      };
    },

    getSolutionName: (state) => {
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
    async addSite(site: ISiteRuntimeConfig) {
      this.sites[site.id] = await diffSiteConfig(site, false);
      this.$save();
    },

    async patchSite(site: ISiteRuntimeConfig) {
      this.sites[site.id] = await diffSiteConfig(site);
      this.$save();
    },

    simplePatchSite(siteId: SiteID, key: keyof ISiteRuntimeConfig, value: any) {
      // @ts-ignore
      this.sites[siteId][key] = value;
      this.$save();
    },

    removeSite(siteId: SiteID) {
      delete this.sites[siteId];
      this.$save();
    },

    addSearchSolution(solution: Omit<storedSearchSolution, "id">) {
      const solutionId = nanoid();

      if (!solution.sort || solution.sort < 0 || solution.sort > 100) {
        solution.sort = 50;
      }

      this.searchSolutions[solutionId] = {
        ...solution,
        id: solutionId,
      } as Required<storedSearchSolution>;
      this.$save();
    },

    patchSearchSolution(id: SolutionId, solution: Required<storedSearchSolution>) {
      if (id !== "default") {
        this.searchSolutions[id] = solution;
        this.$save();
      }
    },

    removeSearchSolution(id: SolutionId) {
      if (id !== "default") {
        // prevent default solution delete
        delete this.searchSolutions[id];
        this.$save();
      }
    },

    removeSearchSolutionPlan(id: SolutionId, removePlan: searchPlan) {
      if (id !== "default") {
        const searchSolutions = this.searchSolutions[id];
        remove(searchSolutions.plan, removePlan);
        this.$save();
      }
    },
  },
});
