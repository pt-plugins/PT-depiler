import {defineStore} from "pinia";
import {BittorrentClientBaseConfig} from "@ptpp/downloader";

export const useDownloaderStore = defineStore("downloader", {
  persist: true,
  state: () => ({
    defaultDownloaderId: null,
    clients: [] as BittorrentClientBaseConfig[]
  }),
  actions: {
    getClient(clientId: string) {
      return this.clients.find(data => {
        return data.id === clientId;
      });
    },

    addClient(client: BittorrentClientBaseConfig) {
      this.clients.push(client);
    },

    patchClient(client: BittorrentClientBaseConfig) {
      const clientIndex = this.clients.findIndex(data => {
        return data.id === client.id;
      });
      this.clients[clientIndex] = client;
    },

    removeClient(clientId: string) {
      const clientIndex = this.clients.findIndex(data => {
        return data.id === clientId;
      });

      if (clientIndex !== -1) {
        this.clients.splice(clientIndex, 1);
      }
    }
  }
});
