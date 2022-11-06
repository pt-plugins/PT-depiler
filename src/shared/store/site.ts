import {defineStore} from "pinia";
import { ISiteMetadata } from "@ptpp/site";

interface storeSiteConfig {
  id: string,
  rewriteConfig: Partial<ISiteMetadata>
}

export const useSiteStore = defineStore("site",{
  persist: true,
  state: () => ({
    sites: [] as storeSiteConfig[]
  }),

  getters: {
    addedSiteIds(state) {
      return state.sites.map(s => s.id);
    }
  },
  actions: {
    addSite(site: storeSiteConfig) {
      this.sites.push(site);
    },

    patchSite(site: storeSiteConfig) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === site.id;
      });
      this.sites[siteIndex] = site;
    },

    removeSite(siteId: string) {
      const siteIndex = this.sites.findIndex(data => {
        return data.id === siteId;
      });

      if (siteIndex !== -1) {
        this.sites.splice(siteIndex, 1);
      }
    }
  },



});
