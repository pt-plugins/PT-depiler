import { createPinia } from "pinia";
import { createStatePersistence } from "pinia-plugin-state-persistence";

import { piniaWebExtPersistencePlugin } from "~/extends/pinia/webExtPersistence.ts";

export const piniaInstance = createPinia();

piniaInstance.use(piniaWebExtPersistencePlugin);
piniaInstance.use(createStatePersistence());
