import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import { BittorrentClientBaseConfig } from "@ptpp/downloader";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("main", {
  state: () => (
    {
      isReady: false,
      options: {
        sites: [],
        clients: [] as BittorrentClientBaseConfig[]
      },
      uiOptions: {
        navBarIsOpen: true,
      }
    }
  ),

  actions: {
    getClient (clientId: string) {
      return this.options.clients.find(data => {
        return data.id === clientId;
      });
    },

    addClient (client: BittorrentClientBaseConfig) {
      !client.id && (client.id = nanoid());
      this.options.clients.push(client);
    },

    patchClient (client: BittorrentClientBaseConfig) {
      const clientIndex = this.options.clients.findIndex(data => {
        return data.id === client.id;
      });
      this.options.clients[clientIndex] = client;
    },

    removeClient (clientId: string) {
      const clientIndex = this.options.clients.findIndex(data => {
        return data.id === clientId;
      });

      if (clientIndex !== -1) {
        this.options.clients.splice(clientIndex, 1);
      }
    }
  }
});
