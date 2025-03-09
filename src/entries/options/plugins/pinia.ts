import { createPinia } from "pinia";
import { piniaWebExtPersistencePlugin } from "~/extends/pinia/webExtPersistence.ts";
import { createStatePersistence } from "pinia-plugin-state-persistence";

export const piniaInstance = createPinia();

piniaInstance.use(piniaWebExtPersistencePlugin);
piniaInstance.use(
  createStatePersistence({
    debug: import.meta.env.DEV,
    storage: sessionStorage,
  }),
);
