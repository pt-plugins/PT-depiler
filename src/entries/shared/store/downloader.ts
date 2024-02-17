import { defineStore } from "pinia";
import type { DownloaderBaseConfig } from "@ptd/downloader";

export const useDownloaderStore = defineStore("downloader", {
  persist: true,
  state: () => ({
    defaultDownloaderId: null as unknown as string,
    clients: [] as DownloaderBaseConfig[]
  }),

  getters: {
    isDefaultDownloader (state) {
      return (clientId: string) => state.defaultDownloaderId === clientId;
    },

    getClient (state) {
      return (clientId: string) => state.clients.find(client => client.id === clientId);
    }
  },

  actions: {
    addClient (client: DownloaderBaseConfig) {
      this.clients.push(client);

      // 如果此时只有一个下载器 or 未设置默认下载器，则将这个下载器设置为默认下载器
      if (this.clients.length === 1 || this.defaultDownloaderId === null) {
        this.defaultDownloaderId = client.id!;
      }
      this.$save();
    },

    patchClient (client: DownloaderBaseConfig) {
      const clientIndex = this.clients.findIndex(data => {
        return data.id === client.id;
      });
      this.clients[clientIndex] = client;
      this.$save();
    },

    removeClient (clientId: string) {
      const clientIndex = this.clients.findIndex(data => {
        return data.id === clientId;
      });

      if (clientIndex !== -1) {
        this.clients.splice(clientIndex, 1);
      }

      if (clientId === this.defaultDownloaderId) {
        this.defaultDownloaderId = null as unknown as string;
      }
      this.$save();
    }
  }
});
