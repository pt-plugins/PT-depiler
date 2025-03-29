import { defineStore } from "pinia";
import { getDefinedSiteMetadata, ISearchCategories, ISiteMetadata, ISiteUserConfig, TSiteID } from "@ptd/site";
import type { ISitePiniaStorageSchema, TSolutionID, ISearchSolutionState, ISearchSolution } from "@/storage.ts";
import { isEmpty, set } from "es-toolkit/compat";

export const useSiteStore = defineStore("site", {
  persistWebExt: true,
  state: (): ISitePiniaStorageSchema => ({
    sites: {},
    solutions: {},
    lastUserInfo: {},
  }),
  getters: {
    getAddedSiteIds(state) {
      return Object.keys(state.sites);
    },

    getSearchSolutionName(state) {
      return (solutionId: TSolutionID): string => {
        if (solutionId === "default") {
          return "默认"; // FIXME i18n
        }

        return state.solutions[solutionId]?.name ?? solutionId;
      };
    },

    getSearchSolutions(state) {
      return Object.values(state.solutions);
    },

    getDefaultSearchSolution(state) {
      return async () => {
        const solutions: ISearchSolution[] = [];

        const addedSiteIds = Object.keys(state.sites);
        for (const siteId of addedSiteIds) {
          const siteMetadata = await getDefinedSiteMetadata(siteId);
          solutions.push({
            id: "default",
            siteId,
            searchEntries: siteMetadata.searchEntry ?? { default: {} },
          });
        }

        return { name: "default", id: "default", sort: 0, enabled: true, createdAt: 0, solutions };
      };
    },

    getSearchSolution(state) {
      return async (solutionId: TSolutionID | "default"): Promise<ISearchSolutionState> => {
        if (solutionId === "default") {
          return await this.getDefaultSearchSolution();
        } else {
          return state.solutions[solutionId];
        }
      };
    },

    getSiteMetadata(state) {
      return async (siteId: TSiteID): Promise<ISiteMetadata> => {
        return await getDefinedSiteMetadata(siteId);
      };
    },

    getSiteUserConfig(state) {
      return async (siteId: TSiteID): Promise<ISiteUserConfig> => {
        const siteUserConfig = state.sites[siteId] ?? {};
        if (isEmpty(siteUserConfig)) {
          const siteMetaData = await this.getSiteMetadata(siteId);
          siteUserConfig.isOffline ??= false;
          siteUserConfig.sortIndex ??= 100;
          siteUserConfig.allowSearch ??= Object.hasOwn(siteMetaData, "search");
          siteUserConfig.allowQueryUserInfo ??= Object.hasOwn(siteMetaData, "userInfo");
          siteUserConfig.inputSetting ??= {};
          siteUserConfig.merge ??= {};
        }
        return siteUserConfig;
      };
    },

    getSiteMergedMetadata(state) {
      return async <T extends keyof ISiteMetadata>(
        siteId: TSiteID,
        field: T,
        defaultValue?: ISiteMetadata[T],
      ): Promise<ISiteMetadata[T]> => {
        const siteConfig = await this.getSiteUserConfig(siteId);
        if (siteConfig.merge?.[field]) {
          return siteConfig.merge[field];
        }
        const siteMetadata = await this.getSiteMetadata(siteId);
        return siteMetadata[field] ?? (defaultValue as ISiteMetadata[T]);
      };
    },

    getSiteName(state) {
      return async (siteId: TSiteID): Promise<string> => {
        return await this.getSiteMergedMetadata(siteId, "name", siteId);
      };
    },

    getSiteUrl(state) {
      return async (siteId: TSiteID): Promise<string> => {
        const siteConfig = await this.getSiteUserConfig(siteId);
        if (siteConfig.url) {
          return siteConfig.url;
        }
        const siteMetadata = await this.getSiteMetadata(siteId);
        return siteMetadata.urls?.[0] ?? "#";
      };
    },

    getSiteCategory(state) {
      return async (siteId: TSiteID, categoryKey?: string): Promise<ISearchCategories | ISearchCategories[]> => {
        const siteMetadataCategory = await this.getSiteMergedMetadata(siteId, "category", []);
        if (categoryKey) {
          return siteMetadataCategory?.find((x) => x.key === categoryKey) as ISearchCategories;
        }
        return siteMetadataCategory as ISearchCategories[];
      };
    },

    getSiteCategoryName(state) {
      return async (siteId: TSiteID, categoryKey: string): Promise<string> => {
        const siteMetadataCategory = (await this.getSiteCategory(siteId, categoryKey)) as ISearchCategories;
        return siteMetadataCategory?.name ?? categoryKey;
      };
    },

    getSiteCategoryOptionName(state) {
      return async (
        siteId: TSiteID,
        categoryKey: string,
        optionKey: string | number | (string | number)[],
      ): Promise<string> => {
        const siteMetadataCategory = (await this.getSiteCategory(siteId, categoryKey)) as ISearchCategories;
        const options = siteMetadataCategory?.options ?? [];
        if (Array.isArray(optionKey)) {
          return optionKey.map((v) => options.find((o) => o.value === v)?.name ?? v).join(", ");
        } else {
          return options.find((o) => o.value === optionKey)?.name ?? (optionKey as string);
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

    addSearchSolution(solution: ISearchSolutionState) {
      this.solutions[solution.id] = solution;
      this.$save();
    },

    removeSearchSolution(solutionId: TSolutionID) {
      delete this.solutions[solutionId];
      this.$save();
    },
  },
});
