import { reactive } from "vue";
import { defineStore } from "pinia";
import {
  definitionList,
  getDefinitionModule,
  getFavicon,
  getSite as createSiteInstance,
  type ISiteMetadata as ISiteDefinedMetadata,
  type SiteID
} from "@ptpp/site";
import { merge } from "lodash-es";

export interface ISiteRuntimeConfig extends Partial<ISiteDefinedMetadata> {
  id: SiteID;

  /**
   * 用户在options首页点击时，打开的站点地址
   */
  entryPoint?: string;

  /**
   * 排序号
   */
  sortIndex?: number;
}

// 在store中缓存favicon对象，以保持单一性
export const siteFavicons = reactive<Record<string, string | false>>({});   // false means loading

export const useSiteStore = defineStore("site", {
  persist: true,
  state: () => ({
    sites: [] as ISiteRuntimeConfig[]
  }),

  getters: {
    addedSiteIds (state) {
      return state.sites.map(s => s.id);
    },

    canAddedSiteIds (state) {
      const addedSiteIds = state.sites.map(s => s.id);
      return definitionList.filter(x => !addedSiteIds.includes(x));
    },

    getSite (state) {
      return async (siteId: SiteID) => {
        let siteMetaData = (await getDefinitionModule(siteId)).siteMetadata;

        const storedSiteConfig = state.sites.find(site => site.id === siteId);
        if (storedSiteConfig) {
          storedSiteConfig.sortIndex ??= 100;
          siteMetaData = merge(siteMetaData, storedSiteConfig);
        }

        this.getSiteFavicon(siteId);  // FIXME loop call?

        return siteMetaData;
      };
    },

    getSites () {
      return async (siteIds?: SiteID[]) => {
        siteIds ??= this.addedSiteIds;
        const siteDefinitions = [];
        for (const siteId of siteIds) {
          siteDefinitions.push((await this.getSite(siteId)));
        }

        return siteDefinitions;
      };
    },

    getSiteInstance () {
      return async (siteId: SiteID) => {
        const siteConfig = await this.getSite(siteId);
        if (siteConfig) {
          return await createSiteInstance(siteConfig);
        }
        throw new Error("Get site Instance Fail");
      };
    },

    getSiteFavicon () {
      return (siteId: string, flush: boolean = false) => {
        if (flush || siteFavicons[siteId] !== false) {
          siteFavicons[siteId] = false;

          this.getSiteInstance(siteId).then(siteInstance => {
            getFavicon(siteInstance, flush).then(favicon => {
              siteFavicons[siteId] = favicon;
            });
          });
        }
        return siteFavicons[siteId];
      };
    },
  },
  actions: {
    addSite (site: ISiteRuntimeConfig) {
      this.sites.push(site);
    },

    patchSite (site: ISiteRuntimeConfig) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === site.id;
      });
      this.sites[siteIndex] = site;
    },

    removeSite (siteId: SiteID) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === siteId;
      });

      if (siteIndex !== -1) {
        this.sites.splice(siteIndex, 1);
      }
    }
  },

});
