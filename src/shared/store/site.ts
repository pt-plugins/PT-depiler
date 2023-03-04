import { defineStore } from "pinia";
import { computedAsync } from "@vueuse/core";
import { updatedDiff } from "deep-object-diff";
import { type SiteID } from "@ptpp/site";
import { faviconCache, getSiteConfig, getSiteFavicon, ISiteRuntimeConfig } from "@/shared/adapters/site";

// 在store中缓存favicon对象，以保持单一性
export const siteFavicons = computedAsync(async () => {
  const ret: Record<string, string | false> = {};
  await faviconCache.iterate(function (value: string, key: string) {
    ret[key] = value;
  });
  return ret;
}, {});

export const useSiteStore = defineStore("site", {
  persist: true,
  state: () => ({
    sites: {} as Record<SiteID, ISiteRuntimeConfig>
  }),

  getters: {
    addedSiteIds (state) {
      return Object.keys(state.sites);
    },

    getSites () {
      return async (siteIds?: SiteID[]) => {
        siteIds ??= this.addedSiteIds;
        const siteDefinitions = [];
        for (const siteId of siteIds) {
          siteDefinitions.push((await getSiteConfig(siteId)));

          // noinspection ES6MissingAwait
          getSiteFavicon(siteId);
        }

        return siteDefinitions;
      };
    },
  },
  actions: {
    async addSite (site: ISiteRuntimeConfig) {
      const definedSiteConfig = await getSiteConfig(site.id, false);
      const updateSiteConfig = updatedDiff(definedSiteConfig, site);

      this.sites[site.id] = {id: site.id, ...updateSiteConfig};
      this.$save();
    },

    async patchSite (site: ISiteRuntimeConfig) {
      const definedSiteConfig = await getSiteConfig(site.id);
      const updateSiteConfig = updatedDiff(definedSiteConfig, site);

      this.sites[site.id] = {id: site.id, ...updateSiteConfig};
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
    }
  },

});
