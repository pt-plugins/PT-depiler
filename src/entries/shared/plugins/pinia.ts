import { createPinia } from "pinia";
import piniaBridgePlugin from "@/shared/browser/pinia.ts";

export const piniaInstance = createPinia();

piniaInstance.use(piniaBridgePlugin);
