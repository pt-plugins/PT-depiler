import { nanoid } from "nanoid";
import { defineStore } from "pinia";

import type {
  IDownloaderMetadata,
  IMetadataPiniaStorageSchema,
  ISearchSolution,
  TDownloaderKey,
  TSearchSnapshotKey,
  TSolutionKey,
} from "@/shared/storages/types/metadata.ts";
import { ISearchSolutionMetadata } from "@/shared/storages/types/metadata.ts";
import {
  getDefinedSiteMetadata,
  type ISearchCategories,
  type ISearchEntryRequestConfig,
  type ISiteMetadata,
  type ISiteUserConfig,
  type TSiteID,
} from "@ptd/site";
import { isEmpty, set } from "es-toolkit/compat";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

export const useMetadataStore = defineStore("metadata", {
  persistWebExt: true,
  state: (): IMetadataPiniaStorageSchema => ({
    sites: {},
    solutions: {},
    snapshots: {},
    downloaders: {},

    defaultSolutionId: "default",

    lastUserInfo: {},
  }),

  getters: {
    getAddedSiteIds(state) {
      return Object.keys(state.sites);
    },

    getAddedSites(state) {
      return Object.values(state.sites);
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
          siteUserConfig.timeout = 30e3;
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

    getSearchSolutionIds(state) {
      return Object.keys(state.solutions);
    },

    getSearchSolutions(state) {
      return Object.values(state.solutions);
    },

    getSiteDefaultSearchSolution(state) {
      return async (siteId: TSiteID): Promise<Record<string, ISearchEntryRequestConfig>> => {
        const siteMetadata = await getDefinedSiteMetadata(siteId);

        let searchEntries = siteMetadata.searchEntry ?? { default: {} };
        for (const [key, value] of Object.entries(state.sites[siteId]?.merge?.searchEntry ?? {})) {
          if (searchEntries[key] && typeof value.enabled === "boolean") {
            searchEntries[key] = { ...searchEntries[key], enabled: value.enabled };
          }
        }
        return searchEntries;
      };
    },

    getDefaultAllSearchSolution(state) {
      return async () => {
        const solutions: ISearchSolution[] = [];

        const addedSiteIds = Object.keys(state.sites);
        for (const siteId of addedSiteIds) {
          const searchEntries = await this.getSiteDefaultSearchSolution(siteId);
          solutions.push({ id: "default", siteId, searchEntries });
        }

        return { name: "all", id: "all", sort: 0, enabled: true, isDefault: true, createdAt: 0, solutions };
      };
    },

    getSearchSolution(state) {
      return async (solutionId: TSolutionKey | "default" | "all"): Promise<ISearchSolutionMetadata> => {
        if (solutionId === "all" || (solutionId === "default" && state.defaultSolutionId === "default")) {
          return await this.getDefaultAllSearchSolution();
        } else if (solutionId === "default") {
          solutionId = state.defaultSolutionId;
        }

        // 对于已经存在的搜索方案，其中如果有 id === "default" 的特殊情况，将其动态解开
        let solution = state.solutions[solutionId] as ISearchSolutionMetadata;
        for (const solutionsIndex in solution.solutions) {
          let solutionItem = solution.solutions[solutionsIndex];
          if (solutionItem.id === "default") {
            solutionItem.searchEntries = await this.getSiteDefaultSearchSolution(solutionItem.siteId);
            solution.solutions[solutionsIndex] = solutionItem;
          }
        }

        return solution;
      };
    },

    getSearchSolutionName(state) {
      return (solutionId: TSolutionKey): string => {
        if (solutionId === "all") {
          return "全站"; // FIXME i18n
        }

        return state.solutions[solutionId]?.name ?? solutionId;
      };
    },

    getSearchSnapshotList(state) {
      return Object.values(state.snapshots);
    },

    getSearchSnapshotData(state) {
      return async (id: TSearchSnapshotKey) => {
        const snapshotInfo = state.snapshots[id];
        if (snapshotInfo?.id) {
          return await sendMessage("getSearchResultSnapshotData", id);
        } else {
          const runtimeStorage = useRuntimeStore();
          runtimeStorage.showSnakebar("未找到该搜索快照...", { color: "error" });
          return;
        }
      };
    },

    getDownloaderIds(state) {
      return Object.keys(state.downloaders);
    },

    getDownloaders(state) {
      return Object.values(state.downloaders);
    },

    getEnabledDownloaders(state) {
      return Object.values(state.downloaders).filter((downloader) => downloader.enabled);
    },
  },
  actions: {
    async addSite(siteId: TSiteID, siteConfig: ISiteUserConfig) {
      delete siteConfig.valid;
      this.sites[siteId] = siteConfig;
      await this.$save();
    },

    async removeSite(siteId: TSiteID) {
      delete this.sites[siteId];
      await this.$save();
    },

    async simplePatchSite<T extends keyof ISiteUserConfig>(siteId: TSiteID, key: T, value: ISiteUserConfig[T]) {
      set(this.sites[siteId], key, value);
      await this.$save();
    },

    async addSearchSolution(solution: ISearchSolutionMetadata) {
      this.solutions[solution.id] = solution;
      await this.$save();
    },

    async removeSearchSolution(solutionId: TSolutionKey) {
      delete this.solutions[solutionId];

      if (this.defaultSolutionId === solutionId) {
        this.defaultSolutionId = "default";
      }

      this.$save();
    },

    async saveSearchSnapshotData(name: string) {
      const runtimeStorage = useRuntimeStore();
      const searchSnapshotData = runtimeStorage.search;

      if (searchSnapshotData.isSearching) {
        runtimeStorage.showSnakebar("你不能创建一个正在搜索中的快照...", { color: "error" });
        return;
      }

      const snapshotId = nanoid();
      this.snapshots[snapshotId] = {
        id: snapshotId,
        name,
        createdAt: Date.now(),
        recordCount: searchSnapshotData.searchResult.length,
      };

      // 保存搜索快照数据
      await sendMessage("saveSearchResultSnapshotData", { snapshotId, data: searchSnapshotData });

      await this.$save();
    },

    async editSearchSnapshotDataName(id: TSearchSnapshotKey, name: string) {
      this.snapshots[id].name = name;
      await this.$save();
    },

    async removeSearchSnapshotData(id: TSearchSnapshotKey) {
      delete this.snapshots[id]; // 删除搜索快照元数据
      await sendMessage("removeSearchResultSnapshotData", id); // 删除搜索快照数据
      await this.$save();
    },

    async addDownloader(downloaderConfig: IDownloaderMetadata) {
      delete downloaderConfig.valid;
      this.downloaders[downloaderConfig.id] = downloaderConfig;
      await this.$save();
    },

    async removeDownloader(downloaderId: TDownloaderKey) {
      delete this.downloaders[downloaderId];
      await this.$save();
    },

    async simplePatchDownloader<T extends keyof IDownloaderMetadata>(
      downloaderId: TDownloaderKey,
      key: T,
      value: IDownloaderMetadata[T],
    ) {
      set(this.downloaders[downloaderId], key, value);
      await this.$save();
    },
  },
});
