import { createPinia } from "pinia";
import { piniaWebExtPersistencePlugin } from "~/extends/pinia/webExtPersistence.ts";

export const piniaInstance = createPinia();

piniaInstance.use(piniaWebExtPersistencePlugin);
