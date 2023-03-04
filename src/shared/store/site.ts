import { defineStore } from "pinia";
import { computedAsync } from "@vueuse/core";
import { type SiteID } from "@ptpp/site";
import { faviconCache, getSiteConfig, getSiteFavicon, diffSiteConfig, ISiteRuntimeConfig } from "@/shared/adapters/site";

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
    }
  },

});
