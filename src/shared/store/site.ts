import { defineStore } from "pinia";
import {
  definitionList,
  type SiteID
} from "@ptpp/site";
import { faviconCache, getSiteConfig, ISiteRuntimeConfig } from "@/shared/adapters/site";
import { computedAsync } from "@vueuse/core";

// 在store中缓存favicon对象，以保持单一性
export const siteFavicons = computedAsync(async () => {
  const ret: Record<string, string | false> = {};
  await faviconCache.iterate(function (value: string, key: string) {
    ret[key] = value;
  });
  return ret;
});

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

    getSites () {
      return async (siteIds?: SiteID[]) => {
        siteIds ??= this.addedSiteIds;
        const siteDefinitions = [];
        for (const siteId of siteIds) {
          siteDefinitions.push((await getSiteConfig(siteId)));
        }

        return siteDefinitions;
      };
    },
  },
  actions: {
    addSite (site: ISiteRuntimeConfig) {
      this.sites.push(site);
      this.$save();
    },

    patchSite (site: ISiteRuntimeConfig) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === site.id;
      });
      this.sites[siteIndex] = site;
      this.$save();
    },

    removeSite (siteId: SiteID) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === siteId;
      });

      if (siteIndex !== -1) {
        this.sites.splice(siteIndex, 1);
      }
      this.$save();
    }
  },

});
