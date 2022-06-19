import { createPinia } from "pinia";
import browser from "webextension-polyfill";

export const piniaInstance = createPinia();

piniaInstance.use(({store}) => {
  browser.storage.local
    .get(store.$id)
    .then((initPersistData: Record<string, any>) => {
      if (initPersistData[store.$id]) {
        // 如果有值，则使用persist data替换整个store
        store.$patch(initPersistData[store.$id]);
      }
    });

  store.$subscribe((mutation: any, state: any) => {
    console.log("Store `" + store.$id + "` change subscribed: ", mutation);
    browser.storage.local.set({
      [store.$id]: JSON.parse(JSON.stringify(state)),
    });
  });
});
