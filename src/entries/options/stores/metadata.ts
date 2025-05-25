import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { isEmpty, set } from "es-toolkit/compat";
import {
  getDefinedSiteMetadata,
  type ISearchCategories,
  type ISearchEntryRequestConfig,
  type ISiteMetadata,
  type ISiteUserConfig,
  type TSiteHost,
  type TSiteID,
} from "@ptd/site";

import {
  IBackupServerMetadata,
  IDownloaderMetadata,
  IMediaServerMetadata,
  IMetadataPiniaStorageSchema,
  ISearchSolution,
  TDownloaderKey,
  TMediaServerKey,
  TSearchSnapshotKey,
  TSolutionKey,
} from "@/shared/storages/types/metadata.ts";
import { ISearchSolutionMetadata } from "@/shared/storages/types/metadata.ts";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

type TSimplePatchFieldKey = keyof Pick<
  IMetadataPiniaStorageSchema,
  "sites" | "solutions" | "snapshots" | "downloaders" | "mediaServers" | "backupServers"
>;

// FIXME 移动到 @ptd/site 中
export function getHostFromUrl(url: string): TSiteHost {
  let host = url;
  try {
    const urlObj = new URL(url);
    host = urlObj.host;
  } catch (e) {}

  return host;
}

export const useMetadataStore = defineStore("metadata", {
  persistWebExt: true,
  state: (): IMetadataPiniaStorageSchema => ({
    sites: {},
    solutions: {},
    snapshots: {},
    downloaders: {},
    mediaServers: {},
    backupServers: {},

    defaultSolutionId: "default",

    lastSearchFilter: "",
    lastUserInfo: {},
    lastDownloader: {},
    lastUserInfoAutoFlushAt: 0,

    siteHostMap: {},
  }),

  getters: {
    getAddedSiteIds(state) {
      return Object.keys(state.sites);
    },

    getAddedSites(state) {
      return Object.values(state.sites);
    },

    getSitesGroupData(state) {
      const sitesGroupData: Record<string, TSiteID[]> = {};
      for (const siteId in state.sites) {
        const site = state.sites[siteId];
        if (site.groups) {
          for (const group of site.groups) {
            sitesGroupData[group] ??= [];
            sitesGroupData[group].push(siteId);
          }
        }
      }
      return sitesGroupData;
    },

    getSiteMetadata(state) {
      return async (siteId: TSiteID): Promise<ISiteMetadata> => {
        return await getDefinedSiteMetadata(siteId);
      };
    },

    getSiteUserConfig(state) {
      return async (siteId: TSiteID, flush: boolean = false): Promise<ISiteUserConfig> => {
        const siteUserConfig = state.sites[siteId] ?? {};
        if (flush || isEmpty(siteUserConfig)) {
          return await sendMessage("getSiteUserConfig", { siteId, flush });
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

    getMediaServerIds(state) {
      return Object.keys(state.mediaServers);
    },

    getMediaServers(state) {
      return Object.values(state.mediaServers);
    },

    getEnabledMediaServers(state) {
      return Object.values(state.mediaServers).filter((mediaServer) => mediaServer.enabled);
    },

    getBackupServerIds(state) {
      return Object.keys(state.backupServers);
    },

    getBackupServers(state) {
      return Object.values(state.backupServers);
    },
  },
  actions: {
    async simplePatch<
      Field extends TSimplePatchFieldKey,
      Id extends keyof IMetadataPiniaStorageSchema[Field],
      Key extends keyof IMetadataPiniaStorageSchema[Field][Id],
      Value extends IMetadataPiniaStorageSchema[Field][Id][Key],
    >(schemaKey: Field, id: Id, key: Key | string, value: Value | any) {
      set(this[schemaKey][id], key, value);
      await this.$save();
    },

    async addSite(siteId: TSiteID, siteConfig: ISiteUserConfig) {
      delete siteConfig.valid;
      this.sites[siteId] = siteConfig;
      await this.buildSiteHostMap();
      await this.$save();
    },

    async removeSite(siteId: TSiteID) {
      delete this.sites[siteId];
      await this.buildSiteHostMap();
      await this.$save();
    },

    /**
     * 在添加、编辑站点时调用，重新生成 host 对站点的映射，
     * 便于 content-script 等其他地方通过 (await extStorage.getItem('metadata')).siteHostMap[host] 获取站点 ID
     *
     * Note: 对于在本commit之前就安装了插件的站点，需要重新编辑站点配置一次才能生成该映射
     */
    async buildSiteHostMap() {
      const siteHostMap: Record<TSiteHost, TSiteID> = {};
      for (const siteId in this.sites) {
        const site = this.sites[siteId];
        if (site.url) {
          siteHostMap[getHostFromUrl(site.url)] = siteId;
        }
        const urls = await this.getSiteMergedMetadata(siteId, "urls", []);
        if (urls.length > 0) {
          for (const url of urls) {
            siteHostMap[getHostFromUrl(url)] = siteId;
          }
        }
        const formerHosts = (await this.getSiteMergedMetadata(siteId, "formerHosts", []))!;
        if (formerHosts.length > 0) {
          for (const host of formerHosts) {
            siteHostMap[host] = siteId;
          }
        }
      }
      this.siteHostMap = siteHostMap;
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

      await this.$save();
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

    async setLastSearchFilter(filter: string) {
      this.lastSearchFilter = filter;
      await this.$save();
    },

    async setLastDownloader(downloader: IMetadataPiniaStorageSchema["lastDownloader"]) {
      this.lastDownloader = downloader;
      await this.$save();
    },

    async addMediaServer(mediaServerConfig: IMediaServerMetadata) {
      this.mediaServers[mediaServerConfig.id] = mediaServerConfig;
      await this.$save();
    },

    async removeMediaServer(mediaServerId: TMediaServerKey) {
      delete this.mediaServers[mediaServerId];
      await this.$save();
    },

    async addBackupServer(backupServerConfig: IBackupServerMetadata) {
      this.backupServers[backupServerConfig.id] = backupServerConfig;
      await this.$save();
    },

    async removeBackupServer(backupServerId: string) {
      delete this.backupServers[backupServerId];
      await this.$save();
    },
  },
});
