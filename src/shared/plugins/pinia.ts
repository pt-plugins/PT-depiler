import { createPinia } from "pinia";
import piniaBridgePlugin from "@/shared/browser/piniaBridgePlugin";

export const piniaInstance = createPinia();

piniaInstance.use(piniaBridgePlugin);
