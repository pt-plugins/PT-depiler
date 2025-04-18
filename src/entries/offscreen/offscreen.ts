import { sendMessage } from "@/messages.ts";

import "./utils/search.ts";
import "./utils/download.ts";
import "./utils/userInfo.ts";
import "./utils/indexdb.ts";

if (import.meta.env.DEV) {
  // @ts-ignore
  globalThis.sendMessage = sendMessage;
}
