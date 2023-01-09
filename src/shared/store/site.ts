import { defineStore } from "pinia";
import { getDefinitionModule, getFavicon, getSite as createSiteInstance, type ISiteMetadata } from "@ptpp/site";

export interface storeSiteConfig {
  id: string,
  rewriteConfig: Partial<ISiteMetadata>
}

export interface expandStoreSiteConfig extends Required<storeSiteConfig> {
  metadata: ISiteMetadata,
  favicon: string
}

export const useSiteStore = defineStore("site", {
  persist: true,
  state: () => ({
    sites: [] as storeSiteConfig[]
  }),

  getters: {
    addedSiteIds (state) {
      return state.sites.map(s => s.id);
    },

    getSite (state) {
      return (siteId: string) => state.sites.find(site => site.id === siteId);
    },

    getSiteInstance () {
      return async (siteId: string) => {
        const siteConfig = this.getSite(siteId);
        if (siteConfig) {
          return await createSiteInstance(siteConfig.id, siteConfig.rewriteConfig ?? {});
        }
        throw new Error("Get site Instance Fail");
      };
    },

    getSiteFavicon () {
      return async (siteId: string, flush: boolean = false) => {
        const siteInstance = await this.getSiteInstance(siteId);
        return await getFavicon(siteInstance, flush);
      };
    },

    getExpandSite () {
      return async (siteId: string) => {
        const siteConfig = this.getSite(siteId);
        if (siteConfig) {
          const {
            id,
            rewriteConfig = {
              sortIndex: 100,
            }
          } = siteConfig;

          const siteMetaData = (await getDefinitionModule(siteId)).siteMetadata;
          rewriteConfig.allowSearchTorrent ??= siteMetaData.feature?.searchTorrent !== false;
          rewriteConfig.allowQueryUserInfo ??= siteMetaData.schema !== "AbstractBittorrentSite" && siteMetaData.feature?.queryUserInfo !== false;

          return {
            id, rewriteConfig,
            metadata: siteMetaData,
            favicon: await this.getSiteFavicon(siteId)
          } as expandStoreSiteConfig;
        }
        throw new Error("Get expand site Fail");
      };
    }
  },
  actions: {
    addSite (site: storeSiteConfig) {
      this.sites.push(site);
    },

    patchSite (site: storeSiteConfig) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === site.id;
      });
      console.log(siteIndex);
      this.sites[siteIndex] = site;
    },

    removeSite (siteId: string) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === siteId;
      });

      if (siteIndex !== -1) {
        this.sites.splice(siteIndex, 1);
      }
    }
  },

});
