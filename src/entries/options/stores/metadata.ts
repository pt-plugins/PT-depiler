import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { isEmpty, set } from "es-toolkit/compat";
import {
  getHostFromUrl,
  getDefinedSiteMetadata,
  type ISearchCategories,
  type ISearchEntryRequestConfig,
  type ISiteMetadata,
  type ISiteUserConfig,
  type ITorrent,
  type TSiteHost,
  type TSiteID,
} from "@ptd/site";

import {
  IBackupServerMetadata,
  ICollectionFolder,
  IDownloaderMetadata,
  IMediaServerMetadata,
  IMetadataPiniaStorageSchema,
  ISearchSolution,
  TCollectionId,
  TDownloaderKey,
  TMediaServerKey,
  TSearchSnapshotKey,
  TSolutionKey,
  ISearchSolutionMetadata,
  TTorrentCollectionKey,
  DEFAULT_COLLECTION_ID,
  buildTorrentCollectionKey,
} from "@/shared/types.ts";
import { extStorage } from "@/storage.ts";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

type TSimplePatchFieldKey = keyof Pick<
  IMetadataPiniaStorageSchema,
  "sites" | "solutions" | "snapshots" | "downloaders" | "mediaServers" | "backupServers" | "collections"
>;

export const useMetadataStore = defineStore("metadata", {
  persistWebExt: true,
  state: (): IMetadataPiniaStorageSchema => ({
    sites: {},
    solutions: {},
    snapshots: {},
    downloaders: {},
    mediaServers: {},
    backupServers: {},

    collections: {
      [DEFAULT_COLLECTION_ID]: {
        id: DEFAULT_COLLECTION_ID,
        name: "默认收藏夹",
        color: "primary",
        sortIndex: 0,
        isDefault: true,
        torrentIds: [],
      },
    },

    defaultSolutionId: "default",
    defaultDownloader: {},

    lastSearchFilter: "",
    lastUserInfo: {},
    lastDownloader: {},
    lastUserInfoAutoFlushAt: 0,

    siteHostMap: {},
    siteNameMap: {},
  }),

  getters: {
    getAddedSiteIds(state) {
      return Object.keys(state.sites);
    },

    getAddedSites(state) {
      return Object.entries(state.sites).map(([siteId, metadata]) => {
        return { ...metadata, id: siteId };
      });
    },

    getSortedAddedSites(state): Array<ISiteUserConfig & { id: string }> {
      return this.getAddedSites.sort((a, b) => {
        return (b.sortIndex ?? 0) - (a.sortIndex ?? 0);
      });
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
      // 如果站点 isDead 或者 isOffline 则不返回搜索方案（ undefined ），调用该方法的地方需要额外判断
      return async (siteId: TSiteID): Promise<Record<string, ISearchEntryRequestConfig> | undefined> => {
        const siteUserConfig = state.sites[siteId];
        const siteMetadata = await getDefinedSiteMetadata(siteId);

        if (siteUserConfig.isOffline || siteMetadata.isDead) {
          return;
        }

        let searchEntries = siteMetadata.searchEntry ?? { default: {} };
        for (const [key, value] of Object.entries(siteUserConfig?.merge?.searchEntry ?? {})) {
          if (searchEntries[key] && typeof value.enabled === "boolean") {
            /**
             * 由于我们需要通过 sendMessage 向 offscreen 发送搜索方案，然而 sendMessage 不支持 Function 等复杂类型，
             * 所以我们这里只传递 id, name, enabled，其他的搜索方案的内容在 站点实例里面组合
             */
            searchEntries[key] = { id: key, name: searchEntries[key].name, enabled: value.enabled };
          }
        }
        return searchEntries;
      };
    },

    getSearchSolution(state) {
      return async (
        solutionId: TSolutionKey | `site:${string}` | "default" | "all",
      ): Promise<ISearchSolutionMetadata> => {
        // 首先判断是否是约定的 "all"  "default"  "site:xxx,xxx" 站点搜索方案
        if (
          // 全部站点
          solutionId === "all" ||
          (solutionId === "default" && state.defaultSolutionId === "default") ||
          // 特定站点
          solutionId.startsWith("site:")
        ) {
          const solutions: ISearchSolution[] = [];

          let addedSiteIds = Object.keys(state.sites);
          if (solutionId.startsWith("site:")) {
            addedSiteIds = solutionId
              .slice(5) //  /^site:/
              .split(",")
              .map((id) => id.trim());
          }

          for (const siteId of addedSiteIds) {
            const searchEntries = await this.getSiteDefaultSearchSolution(siteId);
            if (searchEntries) {
              solutions.push({ id: "default", siteId, searchEntries });
            }
          }

          return {
            name: "all",
            id: solutionId.startsWith("site:") ? (solutionId as `site:${string}`) : "all",
            sort: 0,
            enabled: true,
            isDefault: true,
            createdAt: 0,
            solutions,
          };
        } else if (solutionId === "default") {
          // 如果 solutionId 是 "default"，则使用默认的搜索方案 ID
          solutionId = state.defaultSolutionId;
        }

        // 对于已经存在的搜索方案，其中如果有 id === "default" 的特殊情况，将其动态解开
        let solution = state.solutions[solutionId] as ISearchSolutionMetadata;
        let solutionItems = [];
        for (const solutionItem of solution.solutions) {
          if (solutionItem.id === "default") {
            const searchEntries = await this.getSiteDefaultSearchSolution(solutionItem.siteId);
            if (searchEntries) {
              solutionItem.searchEntries = searchEntries;
              solutionItems.push(solutionItem);
            }
          } else {
            solutionItems.push(solutionItem);
          }
        }

        solution.solutions = solutionItems;
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

    getSortedEnabledDownloaders(state): Array<IDownloaderMetadata> {
      return this.getEnabledDownloaders.sort((a, b) => {
        return (b.sortIndex ?? 0) - (a.sortIndex ?? 0);
      });
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

    getCollectionIds(state) {
      return Object.keys(state.collections);
    },

    getCollections(state) {
      return Object.values(state.collections);
    },

    /** 检查种子是否已收藏（在任意收藏夹中） */
    isTorrentCollected(state) {
      return (torrentKey: TTorrentCollectionKey): boolean => {
        return Object.values(state.collections).some((c) => c.torrentIds.includes(torrentKey));
      };
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
      await this.buildSiteNameMap();
      await this.$save();
    },

    async removeSite(siteId: TSiteID) {
      delete this.sites[siteId];
      await this.buildSiteHostMap();
      await this.buildSiteNameMap();
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
        const legacyUrls = (await this.getSiteMergedMetadata(siteId, "legacyUrls", []))!;
        if (legacyUrls.length > 0) {
          for (const url of legacyUrls) {
            siteHostMap[getHostFromUrl(url)] = siteId;
          }
        }
      }
      this.siteHostMap = siteHostMap;
    },

    async buildSiteNameMap() {
      const siteNameMap: Record<TSiteID, string> = {};
      for (const siteId in this.sites) {
        siteNameMap[siteId] = await this.getSiteName(siteId);
      }
      this.siteNameMap = siteNameMap;
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
      this.lastSearchFilter = filter.replace(/\s*site:\S+/g, "").trim();
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

    // ==================== 收藏夹相关 ====================

    /** 获取所有收藏夹，按 sortIndex 排序 */
    getSortedCollections(): ICollectionFolder[] {
      return Object.values(this.collections).sort((a, b) => {
        // 默认收藏夹排在最前面
        if (a.id === DEFAULT_COLLECTION_ID) return -1;
        if (b.id === DEFAULT_COLLECTION_ID) return 1;
        return (a.sortIndex ?? 0) - (b.sortIndex ?? 0);
      });
    },

    /** 返回自定义收藏夹（排除默认收藏夹），按 sortIndex 排序 */
    getCustomCollections(): ICollectionFolder[] {
      return Object.values(this.collections)
        .filter((c) => !c.isDefault)
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
    },

    /** 添加自定义收藏夹 */
    async addCollection(collectionConfig: Omit<ICollectionFolder, "id" | "torrentIds">) {
      const id = nanoid();
      this.collections[id] = { ...collectionConfig, id, torrentIds: [] };
      await this.$save();
      return id;
    },

    /** 编辑收藏夹属性（名称、颜色、排序等，不影响 torrentIds） */
    async editCollection(id: TCollectionId, patch: Partial<Omit<ICollectionFolder, "id" | "torrentIds">>) {
      if (!this.collections[id]) return;
      Object.assign(this.collections[id], patch);
      await this.$save();
    },

    /**
     * 删除自定义收藏夹（不删除种子数据）。
     * 注意：默认收藏夹不可删除。
     */
    async removeCollection(id: TCollectionId) {
      if (!this.collections[id] || this.collections[id].isDefault) return;
      delete this.collections[id];
      await this.$save();
    },

    /** 获取种子所在的收藏夹 ID 列表 */
    getTorrentCollectionIds(torrentKey: TTorrentCollectionKey): TCollectionId[] {
      return Object.values(this.collections)
        .filter((c) => c.torrentIds.includes(torrentKey))
        .map((c) => c.id);
    },

    /** 将种子加入指定收藏夹，并在 extStorage 中存储种子数据 */
    async addTorrentToCollections(torrent: ITorrent, collectionIds: TCollectionId[]) {
      const key = buildTorrentCollectionKey(torrent);

      // 保存种子数据
      const stored = (await extStorage.getItem("collectionTorrents")) ?? {};
      if (!stored[key]) {
        stored[key] = torrent;
        await extStorage.setItem("collectionTorrents", stored);
      }

      // 更新收藏夹中的种子列表
      for (const cid of collectionIds) {
        if (this.collections[cid] && !this.collections[cid].torrentIds.includes(key)) {
          this.collections[cid].torrentIds.push(key);
        }
      }
      await this.$save();
    },

    /** 批量将多个种子加入指定收藏夹（一次性读写 extStorage，避免多次 IO） */
    async addTorrentsToCollections(torrents: ITorrent[], collectionIds: TCollectionId[]) {
      if (torrents.length === 0 || collectionIds.length === 0) return;

      const stored = (await extStorage.getItem("collectionTorrents")) ?? {};

      for (const torrent of torrents) {
        const key = buildTorrentCollectionKey(torrent);
        stored[key] = torrent;
        for (const cid of collectionIds) {
          if (this.collections[cid] && !this.collections[cid].torrentIds.includes(key)) {
            this.collections[cid].torrentIds.push(key);
          }
        }
      }

      await extStorage.setItem("collectionTorrents", stored);
      await this.$save();
    },

    /** 从指定收藏夹中移除种子（不删除全局种子数据） */
    async removeTorrentFromCollection(torrentKey: TTorrentCollectionKey, collectionId: TCollectionId) {
      if (!this.collections[collectionId]) return;
      this.collections[collectionId].torrentIds = this.collections[collectionId].torrentIds.filter(
        (k) => k !== torrentKey,
      );
      await this.$save();
    },

    /** 从所有收藏夹中删除种子，并从 extStorage 中删除种子数据 */
    async removeTorrentFromAllCollections(torrentKey: TTorrentCollectionKey) {
      for (const cid in this.collections) {
        this.collections[cid].torrentIds = this.collections[cid].torrentIds.filter((k) => k !== torrentKey);
      }

      // 从 extStorage 中删除种子数据
      const stored = (await extStorage.getItem("collectionTorrents")) ?? {};
      if (stored[torrentKey]) {
        delete stored[torrentKey];
        await extStorage.setItem("collectionTorrents", stored);
      }

      await this.$save();
    },

    /** 更新种子所在的收藏夹集合（先清理再添加） */
    async updateTorrentCollections(torrent: ITorrent, newCollectionIds: TCollectionId[]) {
      const key = buildTorrentCollectionKey(torrent);

      // 从所有收藏夹中移除该种子
      for (const cid in this.collections) {
        this.collections[cid].torrentIds = this.collections[cid].torrentIds.filter((k) => k !== key);
      }

      if (newCollectionIds.length > 0) {
        // 保存种子数据
        const stored = (await extStorage.getItem("collectionTorrents")) ?? {};
        stored[key] = torrent;
        await extStorage.setItem("collectionTorrents", stored);

        // 将种子加入选中的收藏夹
        for (const cid of newCollectionIds) {
          if (this.collections[cid]) {
            this.collections[cid].torrentIds.push(key);
          }
        }
      } else {
        // 如果没有选中任何收藏夹，则删除全局种子数据
        const stored = (await extStorage.getItem("collectionTorrents")) ?? {};
        if (stored[key]) {
          delete stored[key];
          await extStorage.setItem("collectionTorrents", stored);
        }
      }

      await this.$save();
    },

    /** 获取收藏夹中的种子数据 */
    async getCollectionTorrents(collectionId: TCollectionId): Promise<ITorrent[]> {
      const folder = this.collections[collectionId];
      if (!folder || folder.torrentIds.length === 0) return [];
      const stored = (await extStorage.getItem("collectionTorrents")) ?? {};
      return folder.torrentIds.map((k) => stored[k]).filter(Boolean) as ITorrent[];
    },

    /** 获取所有收藏种子数据 */
    async getAllCollectionTorrents(): Promise<Record<TTorrentCollectionKey, ITorrent>> {
      return (await extStorage.getItem("collectionTorrents")) ?? {};
    },
  },
});
