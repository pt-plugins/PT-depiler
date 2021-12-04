import { defineStore } from 'pinia';
import { v4 as UUIDv4 } from 'uuid';
import { types } from '@ptpp/btclients';

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  state: () => (
    {
      isReady: false,
      options: {
        sites: [],
        clients: [] as types.BittorrentClientBaseConfig[]
      },
      uiOptions: {}
    }
  ),

  actions: {
    async addClient (client: types.BittorrentClientBaseConfig) {
      !client.id && (client.id = UUIDv4());
      this.options.clients.push(client);
    },

    async removeClient (clientId: string) {
      const clientIndex = this.options.clients.findIndex(data => {
        return data.id === clientId;
      });

      if (clientIndex !== -1) {
        this.options.clients.splice(clientIndex, 1);
      }
    }
  }
});
